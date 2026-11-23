
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Package,
  Edit,
  Trash,
} from "lucide-react";

import { productAPI, reviewAPI, wishlistAPI } from "../api/service";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LoadingPage } from "../components/ui";
import { formatPrice, cn } from "@/utils";
import type { Product, RatingSummary, Review } from "@/types";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getImageUrl = (url?: string | null) => {
  if (!url) return null;

  const cleanUrl = url.trim();

  if (
    !cleanUrl ||
    cleanUrl === "null" ||
    cleanUrl === "undefined"
  ) {
    return null;
  }

  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://")
  ) {
    return cleanUrl;
  }

  return `${BASE_URL}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`
    }`;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const [wishlisted, setWishlisted] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState(false);

  const wishlistRequestInProgress = useRef(false);

  const [imageError, setImageError] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingSummary, setRatingSummary] =
    useState<RatingSummary | null>(null);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // --------------------------------------------
  // FETCH PRODUCT DETAILS
  // --------------------------------------------

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setProduct(null);
    setQty(1);

    productAPI
      .getById(Number(id))
      .then((response) => {
        if (cancelled) return;

        const apiResponse: any = response.data;
        const fetchedProduct: Product =
          apiResponse?.data ?? apiResponse;

        setProduct(fetchedProduct);
        setImageError(false);
      })
      .catch((error) => {
        if (cancelled) return;

        console.error("Product detail fetch error:", error);
        toast.error("Product not found");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // --------------------------------------------
  // FETCH WISHLIST STATUS FROM BACKEND
  // --------------------------------------------

  useEffect(() => {
    if (!id || !user || isAdmin) {
      setWishlisted(false);
      setCheckingWishlist(false);
      setWishlistError(false);
      return;
    }

    let cancelled = false;

    setCheckingWishlist(true);
    setWishlistError(false);
    setWishlisted(false);

    const fetchWishlistStatus = async () => {
      try {
        let page = 0;
        let found = false;
        let hasMorePages = true;

        // Fetch paginated wishlist data.
        // Stop once the product is found or all pages
        // have been checked.
        while (hasMorePages && !found) {
          const response = await wishlistAPI.get(page, 20);

          const responseData: any =
            response.data ?? response;

          const pageData =
            responseData?.data ?? responseData;

          const items: any[] = Array.isArray(pageData)
            ? pageData
            : pageData?.content ?? [];

          if (!Array.isArray(items)) {
            throw new Error("Invalid wishlist response");
          }

          found = items.some(
            (item: any) =>
              Number(item.id) === Number(id) &&
              item.isWishlist === true
          );

          if (found) {
            break;
          }

          if (Array.isArray(pageData)) {
            hasMorePages = false;
          } else if (
            typeof pageData?.last === "boolean"
          ) {
            hasMorePages = !pageData.last;
          } else if (
            typeof pageData?.totalPages === "number"
          ) {
            hasMorePages =
              page + 1 < pageData.totalPages;
          } else {
            hasMorePages = false;
          }

          page += 1;
        }

        if (!cancelled) {
          setWishlisted(found);
          setWishlistError(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch wishlist status:",
            error
          );

          setWishlistError(true);
          toast.error("Unable to load wishlist status");
        }
      } finally {
        if (!cancelled) {
          setCheckingWishlist(false);
        }
      }
    };

    fetchWishlistStatus();

    return () => {
      cancelled = true;
    };
  }, [id, user, isAdmin]);

  // --------------------------------------------
  // FETCH REVIEWS AND RATING SUMMARY
  // --------------------------------------------

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchReviews = async () => {
      setLoadingReviews(true);

      try {
        const response =
          await reviewAPI.getProductReviews(Number(id));

        const reviewResponse: any = response.data;

        if (!cancelled) {
          setReviews(
            reviewResponse?.data?.content ??
            reviewResponse?.content ??
            (Array.isArray(reviewResponse)
              ? reviewResponse
              : [])
          );
        }

        const ratingResponseResult =
          await reviewAPI.getRatingSummary(Number(id));

        const ratingResponse: any =
          ratingResponseResult.data;

        if (!cancelled) {
          setRatingSummary(
            ratingResponse?.data ?? ratingResponse
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Review fetch error:", error);
          toast.error("Failed to load reviews");
        }
      } finally {
        if (!cancelled) {
          setLoadingReviews(false);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // --------------------------------------------
  // ADD TO CART
  // --------------------------------------------

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please sign in");
      navigate("/login");
      return;
    }

    if (!product || adding) return;

    setAdding(true);

    try {
      await addToCart(product.id, qty);
      toast.success(`${qty} item(s) added to cart`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  // --------------------------------------------
  // BUY NOW
  // --------------------------------------------

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please sign in");
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, qty);
      toast.success("Proceeding to checkout");
      navigate("/checkout");
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error("Failed to process");
    }
  };

  // --------------------------------------------
  // WISHLIST ADD / REMOVE
  // --------------------------------------------

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in");
      navigate("/login");
      return;
    }

    if (
      !product ||
      checkingWishlist ||
      updatingWishlist ||
      wishlistRequestInProgress.current
    ) {
      return;
    }

    if (wishlistError) {
      toast.error(
        "Wishlist status unavailable. Refresh and try again."
      );
      return;
    }

    wishlistRequestInProgress.current = true;
    setUpdatingWishlist(true);

    try {
      await wishlistAPI.toggle(product.id);

      const newStatus = !wishlisted;

      setWishlisted(newStatus);

      setProduct((previousProduct) =>
        previousProduct
          ? {
            ...previousProduct,
            isWishlist: newStatus,
          }
          : previousProduct
      );

      toast.success(
        newStatus
          ? "Saved to wishlist"
          : "Removed from wishlist"
      );
    } catch (error) {
      console.error("Wishlist update failed:", error);
      toast.error("Failed to update wishlist");
    } finally {
      wishlistRequestInProgress.current = false;
      setUpdatingWishlist(false);
    }
  };

  // --------------------------------------------
  // DELETE PRODUCT (ADMIN)
  // --------------------------------------------

  const handleDelete = async () => {
    if (!product) return;

    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await productAPI.delete(product.id);
      toast.success("Product deleted");

      if (isAdmin) {
        navigate("/admin/products");
      } else {
        navigate("/products/all");
      }
    } catch (error) {
      console.error("Product delete error:", error);
      toast.error("Delete failed");
    }
  };

  // --------------------------------------------
  // LOADING AND NOT FOUND
  // --------------------------------------------

  if (loading) {
    return <LoadingPage />;
  }

  if (!product) {
    return (
      <div className="page-wrapper container-wide pt-16">
        <p className="text-obsidian-500">
          Product not found.
        </p>
      </div>
    );
  }

  const productImageSrc = getImageUrl(
    product.productImageUrl
  );

  // --------------------------------------------
  // PAGE UI
  // --------------------------------------------

  return (
    <div>
      <div className="container-wide py-2">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost px-0 mb-8 gap-2 text-obsidian-400"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start animate-fade-up">
          {/* Product Image */}
          <div className="aspect-square bg-obsidian-900 border border-obsidian-800 rounded-lg overflow-hidden flex items-center justify-center">
            {productImageSrc && !imageError ? (
              <img
                src={productImageSrc}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => {
                  setImageError(true);
                }}
              />
            ) : (
              <span className="font-display text-[140px] text-obsidian-700 opacity-60">
                {product.name?.[0]?.toUpperCase() || "P"}
              </span>
            )}
          </div>

          {/* Product Information */}
          <div>
            {product.categoryName && (
              <p className="text-[10px] tracking-[0.15em] uppercase text-gold-500 mb-3">
                {product.categoryName.name}
              </p>
            )}

            <h1 className="page-title mb-5 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-display text-4xl text-gold-400">
                  {formatPrice(
                    product.finalPrice ?? product.price
                  )}
                </span>

                {product.finalPrice != null &&
                  product.finalPrice < product.price && (
                    <span className="text-lg text-obsidian-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}

                <span
                  className={cn(
                    "badge",
                    product.stockQuantity > 0
                      ? "badge-green"
                      : "badge-red"
                  )}
                >
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {product.discountPrice != null &&
                product.discountPrice > 0 && (
                  <p className="mt-2 text-sm text-green-500">
                    You save{" "}
                    {formatPrice(product.discountPrice)}
                  </p>
                )}
            </div>

            <div className="h-px bg-obsidian-800 mb-6" />

            {/* Description */}
            <p className="text-obsidian-400 leading-relaxed text-sm mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            {!isAdmin && product.stockQuantity > 0 && (
              <div className="mb-7">
                <p className="label mb-2">
                  Quantity
                </p>

                <div className="flex items-center border border-obsidian-700 rounded-sm w-fit">
                  <button
                    onClick={() =>
                      setQty(Math.max(1, qty - 1))
                    }
                    disabled={qty <= 1}
                    className="px-3 py-2"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="px-5 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {qty}
                  </span>

                  <button
                    onClick={() =>
                      setQty(
                        Math.min(
                          product.stockQuantity,
                          qty + 1
                        )
                      )
                    }
                    disabled={
                      qty >= product.stockQuantity
                    }
                    className="px-3 py-2"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              {!isAdmin && (
                <>
                  {/* Add to Cart */}
                  <button
                    className="btn btn-primary btn-lg w-full gap-3"
                    onClick={handleAdd}
                    disabled={
                      adding ||
                      product.stockQuantity === 0
                    }
                  >
                    <ShoppingBag size={16} />
                    {adding
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    className="btn btn-outline btn-lg w-full"
                    disabled={
                      product.stockQuantity === 0
                    }
                  >
                    Buy Now
                  </button>

                  {/* Wishlist */}
                  <button
                    type="button"
                    className={`btn btn-outline btn-lg px-4 transition ${wishlisted
                        ? "border-pink-500 text-pink-500"
                        : ""
                      }`}
                    onClick={handleWishlist}
                    disabled={checkingWishlist || wishlistError}
                    aria-disabled={updatingWishlist}
                    aria-busy={updatingWishlist}
                    aria-label={
                      checkingWishlist
                        ? "Checking wishlist"
                        : wishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                    }
                    aria-pressed={wishlisted}
                    title={
                      wishlistError
                        ? "Unable to load wishlist. Refresh to retry."
                        : undefined
                    }
                  >
                    <Heart
                      size={20}
                      fill={
                        wishlisted
                          ? "currentColor"
                          : "none"
                      }
                      aria-hidden="true"
                    />
                  </button>

                  {wishlistError && (
                    <p className="text-sm text-red-500">
                      Unable to load wishlist status.
                      Please refresh the page.
                    </p>
                  )}
                </>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="btn btn-primary gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="btn btn-danger gap-2"
                  >
                    <Trash size={16} />
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Delivery Information */}
            <div className="flex items-center gap-2 text-obsidian-600 text-xs">
              <Package size={13} />
              Free delivery on orders over ₹499
            </div>

            {/* Ratings and Reviews */}
            <div className="mt-10 grid md:grid-cols-2 gap-8">
              {/* Rating Summary */}
              <div>
                <h2 className="text-lg mb-3">
                  Ratings & Reviews
                </h2>

                <div className="text-3xl text-gold-400 font-semibold">
                  {ratingSummary?.averageRating?.toFixed(1) ||
                    0}{" "}
                  ⭐
                </div>

                <p className="text-sm text-obsidian-500 mb-4">
                  {ratingSummary?.totalReviews || 0}{" "}
                  ratings
                </p>

                {[5, 4, 3, 2, 1].map((star) => (
                  <div
                    key={star}
                    className="flex items-center gap-2 mb-1"
                  >
                    <span className="w-6 text-sm">
                      {star}⭐
                    </span>

                    <div className="flex-1 h-2 bg-obsidian-800 rounded">
                      <div
                        className="h-2 bg-green-500 rounded"
                        style={{
                          width: `${ratingSummary?.totalReviews
                              ? ((ratingSummary
                                .ratingBreakdown?.[
                                star
                              ] || 0) /
                                ratingSummary.totalReviews) *
                              100
                              : 0
                            }%`,
                        }}
                      />
                    </div>

                    <span className="text-xs">
                      {ratingSummary
                        ?.ratingBreakdown?.[star] || 0}
                    </span>
                  </div>
                ))}
              </div>

              {/* Top Reviews */}
              <div>
                {loadingReviews ? (
                  <p className="text-sm text-obsidian-500">
                    Loading reviews...
                  </p>
                ) : (
                  reviews.slice(0, 2).map((review) => (
                    <div
                      key={review.id}
                      className="border-b py-3"
                    >
                      <div className="text-green-500 text-sm">
                        {"⭐".repeat(review.rating)}
                      </div>

                      <p className="text-sm">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}

                {(ratingSummary?.totalReviews ?? 0) >
                  0 ? (
                  <button
                    onClick={() =>
                      navigate(
                        `/products/${product.id}/reviews`
                      )
                    }
                    className="mt-4 btn btn-outline w-full"
                  >
                    Show all reviews
                  </button>
                ) : (
                  <p className="text-sm text-obsidian-500 mt-4">
                    No reviews yet. Be the first
                    to review this product!
                  </p>
                )}
              </div>
            </div>

            {/* Existing Review Form State */}
            <div style={{ display: "none" }}>
              <textarea
                value={reviewText}
                onChange={(event) =>
                  setReviewText(event.target.value)
                }
              />

              <input
                type="number"
                value={rating}
                onChange={(event) =>
                  setRating(Number(event.target.value))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
