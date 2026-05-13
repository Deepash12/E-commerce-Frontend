// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Package, Edit, Trash } from 'lucide-react';
// import { productAPI, reviewAPI, wishlistAPI } from '../api/service';
// import { useCart } from '@/context/CartContext';
// import { useAuth } from '@/context/AuthContext';
// import { LoadingPage } from '../components/ui';
// import { formatPrice, cn } from '@/utils';
// import type { Product, RatingSummary, Review } from '@/types';
// import toast from 'react-hot-toast';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// const ProductDetailPage: React.FC = () => {

//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const { user } = useAuth();
//   const { addToCart } = useCart();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [qty, setQty] = useState(1);
//   const [adding, setAdding] = useState(false);
//   const [wishlisted, setWishlisted] = useState(false);

//   const isAdmin = user?.role === "ADMIN";

//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
//   const [reviewText, setReviewText] = useState('');
//   const [rating, setRating] = useState(5);
//   const [loadingReviews, setLoadingReviews] = useState(false);

//   useEffect(() => {

//     if (!id) return;

//     productAPI.getById(+id)
//       .then(r => {
//         const p = r.data as Product;

//         setProduct(p);
//         setWishlisted(p.isWishlist === true);
//         setProduct(prev => prev ? { ...prev, isWishlist: p.isWishlist === true } : prev);
//       })
//       .catch(() => toast.error('Product not found'))
//       .finally(() => setLoading(false));

//   }, [id]);


//   useEffect(() => {
//     if (!id) return;

//     const fetchReviews = async () => {
//       setLoadingReviews(true);
//       try {
//         const res = await reviewAPI.getProductReviews(+id);
//         setReviews(res.data.data.content);

//         const ratingRes = await reviewAPI.getRatingSummary(+id);
//         setRatingSummary(ratingRes.data.data);
//       } catch {
//         toast.error("Failed to load reviews");
//       } finally {
//         setLoadingReviews(false);
//       }
//     };

//     fetchReviews();
//   }, [id]);


//   const handleAdd = async () => {

//     if (!user) {
//       toast.error('Please sign in');
//       navigate('/login');
//       return;
//     }

//     if (!product) return;

//     setAdding(true);

//     try {

//       await addToCart(product.id, qty);
//       toast.success(`${qty} item(s) added to cart`);

//     } catch {

//       toast.error('Failed to add to cart');

//     } finally {

//       setAdding(false);

//     }
//   };


//   const handleBuyNow = async () => {

//     if (!user) {
//       toast.error("Please sign in");
//       navigate("/login");
//       return;
//     }

//     if (!product) return;

//     try {

//       await addToCart(product.id, qty);

//       toast.success("Proceeding to checkout");

//       navigate("/checkout");

//     } catch {

//       toast.error("Failed to process");

//     }

//   };

//   const handleWishlist = async () => {

//     if (!user) {
//       toast.error('Please sign in');
//       return;
//     }

//     if (!product) return;

//     try {

//       if (wishlisted) {

//         await wishlistAPI.toggle(product.id);
//         setWishlisted(false);
//         toast.success('Removed from wishlist');

//       } else {

//         await wishlistAPI.toggle(product.id);
//         setWishlisted(true);
//         toast.success('Saved to wishlist');

//       }

//     } catch {

//       toast.error('Action failed');

//     }
//   };

//   const handleDelete = async () => {

//     if (!product) return;

//     if (!window.confirm("Delete this product?")) return;

//     try {

//       await productAPI.delete(product.id);
//       toast.success("Product deleted");
//       navigate("/products/all");

//     } catch {

//       toast.error("Delete failed");

//     }
//   };

//   if (loading) return <LoadingPage />;

//   if (!product)
//     return (
//       <div className="page-wrapper container-wide pt-16">
//         <p className="text-obsidian-500">Product not found.</p>
//       </div>
//     );

//   return (

//     <div>

//       <div className="container-wide py-2">

//         {/* Back button */}

//         <button
//           onClick={() => navigate(-1)}
//           className="btn btn-ghost px-0 mb-8 gap-2 text-obsidian-400"
//         >
//           <ArrowLeft size={15} />
//           Back
//         </button>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start animate-fade-up">

//           {/* PRODUCT IMAGE */}

//           <div className="aspect-square bg-obsidian-900 border border-obsidian-800 rounded-lg overflow-hidden flex items-center justify-center">

//             {product.productImageUrl ? (
//               <img
//                 src={`${BASE_URL}${product.productImageUrl}`}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="font-display text-[140px] text-obsidian-700 opacity-60">
//                 {product.name[0].toUpperCase()}
//               </span>
//             )}

//           </div>

//           {/* PRODUCT INFO */}

//           <div>

//             {product.categoryName && (

//               <p className="text-[10px] tracking-[0.15em] uppercase text-gold-500 mb-3">
//                 {product.categoryName.name}
//               </p>

//             )}

//             <h1 className="page-title mb-5 leading-tight">
//               {product.name}
//             </h1>

//             {/* PRICE */}

//             <div className="flex items-center gap-4 mb-6">

//               <span className="font-display text-4xl text-gold-400">
//                 {formatPrice(product.price)}
//               </span>

//               <span
//                 className={cn(
//                   'badge',
//                   product.stockQuantity > 0 ? 'badge-green' : 'badge-red'
//                 )}
//               >
//                 {product.stockQuantity > 0
//                   ? `${product.stockQuantity} in stock`
//                   : 'Out of stock'}
//               </span>

//             </div>

//             <div className="h-px bg-obsidian-800 mb-6" />

//             {/* DESCRIPTION */}

//             <p className="text-obsidian-400 leading-relaxed text-sm mb-8">
//               {product.description}
//             </p>


//             {/* QUANTITY */}

//             {!isAdmin && product.stockQuantity > 0 && (

//               <div className="mb-7">

//                 <p className="label mb-2">Quantity</p>

//                 <div className="flex items-center border border-obsidian-700 rounded-sm w-fit">

//                   <button
//                     onClick={() => setQty(Math.max(1, qty - 1))}
//                     className="px-3 py-2"
//                   >
//                     <Minus size={14} />
//                   </button>

//                   <span className="px-5 py-2 text-sm font-medium min-w-[3rem] text-center">
//                     {qty}
//                   </span>

//                   <button
//                     onClick={() =>
//                       setQty(Math.min(product.stockQuantity, qty + 1))
//                     }
//                     className="px-3 py-2"
//                   >
//                     <Plus size={14} />
//                   </button>

//                 </div>

//               </div>

//             )}

//             {/* ACTION BUTTONS */}

//             <div className="flex flex-col gap-3 mb-8">

//               {!isAdmin && (

//                 <>
//                   <button
//                     className="btn btn-primary btn-lg w-full gap-3"
//                     onClick={handleAdd}
//                     disabled={adding || product.stockQuantity === 0}
//                   >
//                     <ShoppingBag size={16} />
//                     {adding ? "Adding..." : "Add to Cart"}
//                   </button>

//                   <button
//                     onClick={handleBuyNow}
//                     className="btn btn-outline btn-lg w-full"
//                     disabled={product.stockQuantity === 0}
//                   >
//                     Buy Now
//                   </button>

//                   <button
//                     className={`btn btn-outline btn-lg px-4 transition ${wishlisted ? "border-pink-500 text-pink-500" : ""
//                       }`}
//                     onClick={handleWishlist}
//                   >
//                     <Heart
//                       size={20}
//                       fill={wishlisted ? "currentColor" : "none"}
//                     />
//                   </button>
//                 </>

//               )}

//               {isAdmin && (

//                 <>
//                   <Link
//                     to={`/products/edit/${product.id}`}
//                     className="btn btn-primary gap-2"
//                   >
//                     <Edit size={16} />
//                     Edit
//                   </Link>

//                   <button
//                     onClick={handleDelete}
//                     className="btn btn-danger gap-2"
//                   >
//                     <Trash size={16} />
//                     Delete
//                   </button>
//                 </>

//               )}

//             </div>






//             {/* DELIVERY INFO */}

//             <div className="flex items-center gap-2 text-obsidian-600 text-xs">

//               <Package size={13} />
//               Free delivery on orders over ₹499

//             </div>

//             <div className="mt-10 grid md:grid-cols-2 gap-8">

//               {/* LEFT: Rating Summary */}
//               <div>

//                 <h2 className="text-lg mb-3">Ratings & Reviews</h2>

//                 <div className="text-3xl text-gold-400 font-semibold">
//                   {ratingSummary?.averageRating?.toFixed(1) || 0} ⭐
//                 </div>

//                 <p className="text-sm text-obsidian-500 mb-4">
//                   {ratingSummary?.totalReviews || 0} ratings
//                 </p>

//                 {/* Breakdown */}
//                 {[5, 4, 3, 2, 1].map(star => (
//                   <div key={star} className="flex items-center gap-2 mb-1">

//                     <span className="w-6 text-sm">{star}⭐</span>

//                     <div className="flex-1 h-2 bg-obsidian-800 rounded">
//                       <div
//                         className="h-2 bg-green-500 rounded"
//                         style={{
//                           width: `${ratingSummary?.totalReviews
//                             ? ((ratingSummary.ratingBreakdown?.[star] || 0) /
//                               ratingSummary.totalReviews) * 100
//                             : 0
//                             }%`
//                         }}
//                       />
//                     </div>

//                     <span className="text-xs">
//                       {ratingSummary?.ratingBreakdown?.[star] || 0}
//                     </span>

//                   </div>
//                 ))}

//               </div>

//               {/* RIGHT: Top Reviews */}
//               <div>

//                 {reviews.slice(0, 2).map(r => (
//                   <div key={r.id} className="border-b py-3">

//                     <div className="text-green-500 text-sm">
//                       {"⭐".repeat(r.rating)}
//                     </div>

//                     <p className="text-sm">{r.comment}</p>

//                   </div>
//                 ))}

//                 {/* 👉 Show All Button */}
//                 {ratingSummary?.totalReviews??0 > 0 ? (
//                   <button
//                     onClick={() => navigate(`/products/${product?.id}/reviews`)}
//                     className="mt-4 btn btn-outline w-full"
//                   >
//                     Show all reviews
//                   </button>
//                 ) : (
//                   <p className="text-sm text-obsidian-500 mt-4">
//                     No reviews yet. Be the first to review this product!
//                   </p>
//                 )}

//               </div>

//             </div>

//           </div>



//         </div>

//       </div>

//     </div>

//   );
// };

// export default ProductDetailPage;

import React, { useState, useEffect } from "react";
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getImageUrl = (url?: string | null) => {
  if (!url) return null;

  const cleanUrl = url.trim();

  if (!cleanUrl || cleanUrl === "null" || cleanUrl === "undefined") {
    return null;
  }

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return `${BASE_URL}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}`;
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
  const [imageError, setImageError] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(
    null
  );
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    productAPI
      .getById(+id)
      .then((r) => {
        const apiResponse: any = r.data;
        const p: Product = apiResponse?.data ?? apiResponse;

        console.log("Product detail response:", p);
        console.log("Product image from API:", p?.productImageUrl);
        console.log("Final product image:", getImageUrl(p?.productImageUrl));

        setProduct({
          ...p,
          isWishlist: p.isWishlist === true,
        });

        setWishlisted(p.isWishlist === true);
        setImageError(false);
      })
      .catch((error) => {
        console.error("Product detail fetch error:", error);
        toast.error("Product not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);

      try {
        const res = await reviewAPI.getProductReviews(+id);
        const reviewResponse: any = res.data;

        setReviews(
          reviewResponse?.data?.content ??
            reviewResponse?.content ??
            (Array.isArray(reviewResponse) ? reviewResponse : [])
        );

        const ratingRes = await reviewAPI.getRatingSummary(+id);
        const ratingResponse: any = ratingRes.data;

        setRatingSummary(ratingResponse?.data ?? ratingResponse);
      } catch (error) {
        console.error("Review fetch error:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      toast.error("Please sign in");
      navigate("/login");
      return;
    }

    if (!product) return;

    setAdding(true);

    try {
      await addToCart(product.id, qty);
      toast.success(`${qty} item(s) added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

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
    } catch {
      toast.error("Failed to process");
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in");
      return;
    }

    if (!product) return;

    try {
      await wishlistAPI.toggle(product.id);

      if (wishlisted) {
        setWishlisted(false);
        setProduct((prev) =>
          prev ? { ...prev, isWishlist: false } : prev
        );
        toast.success("Removed from wishlist");
      } else {
        setWishlisted(true);
        setProduct((prev) =>
          prev ? { ...prev, isWishlist: true } : prev
        );
        toast.success("Saved to wishlist");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (!window.confirm("Delete this product?")) return;

    try {
      await productAPI.delete(product.id);
      toast.success("Product deleted");

      if (isAdmin) {
        navigate("/admin/products");
      } else {
        navigate("/products/all");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <LoadingPage />;

  if (!product) {
    return (
      <div className="page-wrapper container-wide pt-16">
        <p className="text-obsidian-500">Product not found.</p>
      </div>
    );
  }

  const productImageSrc = getImageUrl(product.productImageUrl);

  return (
    <div>
      <div className="container-wide py-2">
        {/* Back button */}
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
                onLoad={() => {
                  console.log("Product detail image loaded:", productImageSrc);
                }}
                onError={(e) => {
                  console.log(
                    "Product detail image failed:",
                    e.currentTarget.src
                  );
                  setImageError(true);
                }}
              />
            ) : (
              <span className="font-display text-[140px] text-obsidian-700 opacity-60">
                {product.name?.[0]?.toUpperCase() || "P"}
              </span>
            )}
          </div>

          {/* Product Info */}
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
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-4xl text-gold-400">
                {formatPrice(product.price)}
              </span>

              <span
                className={cn(
                  "badge",
                  product.stockQuantity > 0 ? "badge-green" : "badge-red"
                )}
              >
                {product.stockQuantity > 0
                  ? `${product.stockQuantity} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <div className="h-px bg-obsidian-800 mb-6" />

            {/* Description */}
            <p className="text-obsidian-400 leading-relaxed text-sm mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            {!isAdmin && product.stockQuantity > 0 && (
              <div className="mb-7">
                <p className="label mb-2">Quantity</p>

                <div className="flex items-center border border-obsidian-700 rounded-sm w-fit">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="px-5 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {qty}
                  </span>

                  <button
                    onClick={() =>
                      setQty(Math.min(product.stockQuantity, qty + 1))
                    }
                    className="px-3 py-2"
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
                  <button
                    className="btn btn-primary btn-lg w-full gap-3"
                    onClick={handleAdd}
                    disabled={adding || product.stockQuantity === 0}
                  >
                    <ShoppingBag size={16} />
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="btn btn-outline btn-lg w-full"
                    disabled={product.stockQuantity === 0}
                  >
                    Buy Now
                  </button>

                  <button
                    className={`btn btn-outline btn-lg px-4 transition ${
                      wishlisted ? "border-pink-500 text-pink-500" : ""
                    }`}
                    onClick={handleWishlist}
                  >
                    <Heart
                      size={20}
                      fill={wishlisted ? "currentColor" : "none"}
                    />
                  </button>
                </>
              )}

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

            {/* Delivery Info */}
            <div className="flex items-center gap-2 text-obsidian-600 text-xs">
              <Package size={13} />
              Free delivery on orders over ₹499
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-8">
              {/* Left: Rating Summary */}
              <div>
                <h2 className="text-lg mb-3">Ratings & Reviews</h2>

                <div className="text-3xl text-gold-400 font-semibold">
                  {ratingSummary?.averageRating?.toFixed(1) || 0} ⭐
                </div>

                <p className="text-sm text-obsidian-500 mb-4">
                  {ratingSummary?.totalReviews || 0} ratings
                </p>

                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="w-6 text-sm">{star}⭐</span>

                    <div className="flex-1 h-2 bg-obsidian-800 rounded">
                      <div
                        className="h-2 bg-green-500 rounded"
                        style={{
                          width: `${
                            ratingSummary?.totalReviews
                              ? ((ratingSummary.ratingBreakdown?.[star] || 0) /
                                  ratingSummary.totalReviews) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <span className="text-xs">
                      {ratingSummary?.ratingBreakdown?.[star] || 0}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right: Top Reviews */}
              <div>
                {loadingReviews ? (
                  <p className="text-sm text-obsidian-500">
                    Loading reviews...
                  </p>
                ) : (
                  reviews.slice(0, 2).map((r) => (
                    <div key={r.id} className="border-b py-3">
                      <div className="text-green-500 text-sm">
                        {"⭐".repeat(r.rating)}
                      </div>

                      <p className="text-sm">{r.comment}</p>
                    </div>
                  ))
                )}

                {(ratingSummary?.totalReviews ?? 0) > 0 ? (
                  <button
                    onClick={() =>
                      navigate(`/products/${product?.id}/reviews`)
                    }
                    className="mt-4 btn btn-outline w-full"
                  >
                    Show all reviews
                  </button>
                ) : (
                  <p className="text-sm text-obsidian-500 mt-4">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </div>

            {/* Kept for your existing review form states if needed later */}
            <div style={{ display: "none" }}>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;