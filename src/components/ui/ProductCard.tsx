
import React, { useState, useEffect, useRef } from "react";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils";
import toast from "react-hot-toast";
import { wishlistAPI } from "@/api/service";
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
interface ProductCardProps {
  product: any;
}
export default function ProductCard({ product }: ProductCardProps) {
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);
  const [hovered, setHovered] = useState(false);
  const wishlistBusyRef = useRef(false);
  const discountAmount =
    product.discountPrice ?? product.discount ?? 0;
  const hasDiscount = discountAmount > 0;
  const originalPrice = product.price ?? product.oldPrice ?? 0;
  const finalPrice = hasDiscount
    ? originalPrice - discountAmount
    : originalPrice;
  const discountPercent =
    hasDiscount && originalPrice > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;
  const inStock = (product.stockQuantity ?? 1) > 0;
  const imageUrl = product.productImageUrl
    ? `${BASE_URL}${product.productImageUrl}`
    : product.image ?? null;
  const productUrl = `/products/${product.id}`;

  // ---------------- ADD TO CART ----------------
  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (adding || buying || !inStock) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add");
    } finally {
      setAdding(false);
    }
  };
  // ---------------- BUY NOW ----------------
  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (adding || buying || !inStock) return;
    setBuying(true);
    try {
      await addToCart(product.id, 1);
      navigate("/checkout");
    } catch {
      toast.error("Failed");
    } finally {
      setBuying(false);
    }
  };
  // ---------------- WISHLIST TOGGLE ----------------
  const toggleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (
      wishlistBusyRef.current ||
      updatingWishlist ||
      checkingWishlist
    ) {
      return;
    }
    wishlistBusyRef.current = true;
    setUpdatingWishlist(true);
    try {
      await wishlistAPI.toggle(product.id);
      const newStatus = !wishlisted;
      setWishlisted(newStatus);
      toast.success(
        newStatus
          ? "Added to wishlist"
          : "Removed from wishlist"
      );
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Failed to update wishlist");
    } finally {
      wishlistBusyRef.current = false;
      setUpdatingWishlist(false);
    }
  };
  // ---------------- CHECK WISHLIST ----------------
  useEffect(() => {
    if (!user || isAdmin) {
      setWishlisted(false);
      setCheckingWishlist(false);
      return;
    }
    let cancelled = false;
    setCheckingWishlist(true);
    const checkWishlist = async () => {
      try {
        const res = await wishlistAPI.get(0, 20);
        const responseData = res.data ?? res;
        const data =
          responseData?.data?.content ??
          responseData?.content ??
          [];
        const exists = data.some(
          (item: any) =>
            Number(item.id) === Number(product.id) &&
            item.isWishlist === true
        );
        if (!cancelled) {
          setWishlisted(exists);
        }
      } catch (error) {
        console.error(
          "Failed to check wishlist:",
          error
        );
      } finally {
        if (!cancelled) {
          setCheckingWishlist(false);
        }
      }
    };
    checkWishlist();
    return () => {
      cancelled = true;
    };
  }, [user, isAdmin, product.id]);
  return (
    <div
      style={{
        display: "block",
        height: "100%",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "14px",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: hovered
            ? "linear-gradient(160deg, #1c1a15 0%, #141210 100%)"
            : "linear-gradient(160deg, #151515 0%, #0e0e0e 100%)",
          border: hovered
            ? "1px solid rgba(212,175,55,0.5)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: hovered
            ? "0 20px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.06) inset"
            : "0 2px 12px rgba(0,0,0,0.3)",
          transform: hovered
            ? "translateY(-4px)"
            : "translateY(0)",
          transition:
            "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "220px",
            background: "#fff",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link
            to={productUrl}
            aria-label={`View ${product.name} details`}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "16px",
                  transform: hovered
                    ? "scale(1.06)"
                    : "scale(1)",
                  transition:
                    "transform 0.55s ease",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #1a1a1a, #242424)",
                  fontFamily:
                    "'Playfair Display', serif",
                  fontSize: "4rem",
                  fontWeight: 700,
                  color: "rgba(212,175,55,0.2)",
                }}
              >
                {(product.name ?? "?")[0].toUpperCase()}
              </div>
            )}
          </Link>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "11px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: "20px",
                  backdropFilter: "blur(8px)",
                  background: "rgba(10,10,10,0.7)",
                  border: inStock
                    ? "1px solid rgba(74,222,128,0.45)"
                    : "1px solid rgba(248,113,113,0.45)",
                  color: inStock
                    ? "#4ade80"
                    : "#f87171",
                }}
              >
                {inStock ? "In Stock" : "Sold Out"}
              </span>
            </div>

            {/* Discount Badge */}

            {hasDiscount && (
              <div
                style={{
                  display: "flex",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 9px",
                    borderRadius: "20px",
                    backdropFilter: "blur(8px)",
                    background: "rgba(10,10,10,0.7)",
                    border:
                      "1px solid rgba(74,222,128,0.4)",
                    color: "#4ade80",
                    letterSpacing: "0.04em",
                  }}
                >
                  −{discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* ---------------- WISHLIST BUTTON ---------------- */}

          {!isAdmin && (
            <button
              type="button"
              onClick={toggleWishlist}
              disabled={
                updatingWishlist || checkingWishlist
              }
              aria-label={
                wishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              aria-pressed={wishlisted}
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: wishlisted
                  ? "rgba(244,63,94,0.18)"
                  : "rgba(0,0,0,0.55)",
                border: wishlisted
                  ? "1px solid rgba(244,63,94,0.4)"
                  : "1px solid rgba(255,255,255,0.1)",
                color: wishlisted
                  ? "#fb7185"
                  : "rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
                cursor:
                  updatingWishlist || checkingWishlist
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.25s ease",
                zIndex: 10,
                pointerEvents: "auto",
              }}
            >
              <Heart
                size={13}
                fill={
                  wishlisted
                    ? "currentColor"
                    : "none"
                }
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* ---------------- CONTENT ZONE ---------------- */}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            gap: "6px",
          }}
        >
          {/* Category */}

          {product.categoryName && (
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.6)",
                margin: 0,
              }}
            >
              {typeof product.categoryName === "object"
                ? product.categoryName.name
                : product.categoryName}
            </p>
          )}

          {/* ---------------- PRODUCT NAME LINK ---------------- */}

          <Link
            to={productUrl}
            style={{
              textDecoration: "none",
              display: "block",
            }}
          >
            <h3
              style={{
                fontFamily:
                  "'Playfair Display', serif",
                fontSize: "1.02rem",
                fontWeight: 600,
                lineHeight: 1.35,
                color: hovered
                  ? "#d4af37"
                  : "#e5e5e5",
                transition: "color 0.25s ease",
                margin: 0,
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Description */}

          <p
            style={{
              fontSize: "11.5px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.28)",
              margin: 0,
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>

          {/* ---------------- STAR RATING ---------------- */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "2px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "2px",
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  aria-hidden="true"
                  style={{
                    color:
                      star <= 4
                        ? "#d4af37"
                        : "rgba(255,255,255,0.15)",
                    fill:
                      star <= 4
                        ? "#d4af37"
                        : "none",
                  }}
                />
              ))}
            </div>

            <span
              style={{
                fontSize: "10.5px",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.02em",
              }}
            >
              (120)
            </span>
          </div>

          {/* ---------------- PRICE ---------------- */}

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            <span
              style={{
                fontFamily:
                  "'Playfair Display', serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#d4af37",
                letterSpacing: "-0.02em",
              }}
            >
              {formatPrice(finalPrice)}
            </span>

            {hasDiscount && (
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.25)",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(originalPrice)}
              </span>
            )}

            {hasDiscount && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#4ade80",
                  letterSpacing: "0.04em",
                }}
              >
                {discountPercent}% off
              </span>
            )}
          </div>

          {/* ---------------- ACTION BUTTONS ---------------- */}

          {!isAdmin && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              {/* Add to Cart */}

              <button
                type="button"
                onClick={handleAdd}
                disabled={
                  adding ||
                  buying ||
                  !inStock
                }
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: "9px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  background: "transparent",
                  border:
                    "1px solid rgba(212,175,55,0.3)",
                  color:
                    !inStock || adding
                      ? "rgba(212,175,55,0.3)"
                      : "rgba(212,175,55,0.85)",
                  cursor:
                    adding || buying || !inStock
                      ? "not-allowed"
                      : "pointer",
                  opacity: !inStock ? 0.45 : 1,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!adding && !buying && inStock) {
                    e.currentTarget.style.background =
                      "rgba(212,175,55,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                <ShoppingBag
                  size={12}
                  aria-hidden="true"
                />
                {adding ? "Adding…" : "Add to Cart"}
              </button>

              {/* Buy Now */}

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={
                  !inStock ||
                  buying ||
                  adding
                }
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: "9px",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  border: "none",
                  background: inStock
                    ? "linear-gradient(135deg, #c9a227 0%, #d4af37 60%, #b8861e 100%)"
                    : "rgba(60,60,60,0.3)",
                  color: inStock
                    ? "#0a0a0a"
                    : "rgba(255,255,255,0.2)",
                  cursor:
                    !inStock || buying || adding
                      ? "not-allowed"
                      : "pointer",
                  transition: "filter 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (inStock && !buying && !adding) {
                    e.currentTarget.style.filter =
                      "brightness(1.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
              >
                <Zap
                  size={12}
                  aria-hidden="true"
                />
                {buying ? "Processing…" : "Buy Now"}
              </button>
            </div>
          )}
        </div>

        {/* ---------------- GOLD SHIMMER ---------------- */}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #c9a227 30%, #d4af37 50%, #c9a227 70%, transparent)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}