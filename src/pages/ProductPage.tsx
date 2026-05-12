import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Search,
  ArrowUpDown,
  X,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { productAPI, wishlistAPI } from "../api/service";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Pagination } from "../components/ui";
import { formatPrice } from "@/utils";
import type { Product, ProductFilters } from "@/types";
import toast from "react-hot-toast";

/* ─────────────────────── Animated wrapper ─────────────────────────── */
const FadeIn: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => (
  <div style={{ animation: `fadeUp 0.5s ease both`, animationDelay: `${index * 55}ms` }}>
    {children}
  </div>
);

/* ─────────────────────── Product Card ─────────────────────────────── */
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [adding, setAdding]       = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered]     = useState(false);
  const [addHover, setAddHover]   = useState(false);
  const [buyHover, setBuyHover]   = useState(false);

  const discountAmount  = product.discountPrice ?? 0;
  const hasDiscount     = discountAmount > 0;
  const finalPrice      = hasDiscount ? product.price - discountAmount : product.price;
  const discountPercent = hasDiscount ? Math.round((discountAmount / product.price) * 100) : 0;
  const inStock         = product.stockQuantity > 0;

  useEffect(() => { setWishlisted(Boolean(product.isWishlist)); }, [product]);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setAdding(true);
    try { await addToCart(product.id, 1); toast.success("Added to cart"); }
    catch { toast.error("Failed to add"); }
    finally { setAdding(false); }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    try { await addToCart(product.id, 1); navigate("/checkout"); }
    catch { toast.error("Failed"); }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    try {
      const res = await wishlistAPI.toggle(product.id);
      setWishlisted(res.data.isWishlist);
      toast.success(res.data.message);
    } catch { toast.error("Action failed"); }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      style={{ display: "block", height: "100%", textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: hovered
            ? "linear-gradient(160deg, #1c1a14 0%, #141210 100%)"
            : "linear-gradient(160deg, #141414 0%, #0d0d0d 100%)",
          border: hovered
            ? "1px solid rgba(201,168,76,0.5)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: hovered
            ? "0 28px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(201,168,76,0.06) inset"
            : "0 2px 16px rgba(0,0,0,0.3)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.38s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── Image ── */}
        <div style={{ position: "relative", height: 230, background: "#fff", overflow: "hidden" }}>
          {product.productImageUrl ? (
            <img
              src={`http://localhost:8080${product.productImageUrl}`}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: 16,
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.55s ease",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #1a1a1a, #252525)",
              fontSize: "4rem", fontWeight: 700,
              color: "rgba(201,168,76,0.2)", fontFamily: "Georgia, serif",
            }}>
              {product.name[0].toUpperCase()}
            </div>
          )}

          {/* Badges overlay */}
          <div style={{ position: "absolute", inset: 0, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
            {/* Top: stock */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(10,10,10,0.8)",
                border: inStock ? "1px solid rgba(74,222,128,0.45)" : "1px solid rgba(248,113,113,0.45)",
                color: inStock ? "#4ade80" : "#f87171",
                backdropFilter: "blur(8px)",
              }}>
                {inStock ? "In Stock" : "Sold Out"}
              </span>
            </div>
            {/* Bottom: discount */}
            {hasDiscount && (
              <div style={{ display: "flex" }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(10,10,10,0.8)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  color: "#C9A84C",
                  backdropFilter: "blur(8px)",
                  letterSpacing: "0.04em",
                }}>
                  −{discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Wishlist btn */}
          {user && !isAdmin && (
            <button
              onClick={handleWishlist}
              style={{
                position: "absolute", top: 10, left: 10,
                width: 34, height: 34, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: wishlisted ? "rgba(236,72,153,0.2)" : "rgba(0,0,0,0.6)",
                border: wishlisted ? "1px solid rgba(244,114,182,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: wishlisted ? "#f472b6" : "rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
                transition: "all 0.25s ease",
                zIndex: 10,
                pointerEvents: "auto",
              }}
            >
              <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          )}

          {/* Shimmer on hover */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(135deg, transparent 40%, rgba(201,168,76,0.04) 60%, transparent 80%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }} />
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "18px 16px 16px", gap: 6 }}>
          {product.categoryName && (
            <p style={{
              fontSize: 9, fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase" as const,
              color: "rgba(201,168,76,0.6)", margin: 0,
            }}>
              {typeof product.categoryName === "object" ? product.categoryName.name : product.categoryName}
            </p>
          )}

          <h3 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "1.02rem", fontWeight: 600, lineHeight: 1.35,
            color: hovered ? "#C9A84C" : "#e5e5e5",
            transition: "color 0.25s ease", margin: 0,
          }}>
            {product.name}
          </h3>

          <p style={{
            fontSize: 11.5, lineHeight: 1.65,
            color: "rgba(255,255,255,0.28)", margin: 0, flex: 1,
            display: "-webkit-box" as any,
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as any,
            overflow: "hidden",
          }}>
            {product.description}
          </p>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" as const, marginTop: 8 }}>
            <span style={{
              fontFamily: "'Georgia', serif",
              fontSize: "1.4rem", fontWeight: 700,
              color: "#C9A84C", letterSpacing: "-0.02em",
            }}>
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          {!isAdmin && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                onClick={handleAdd}
                disabled={adding || !inStock}
                onMouseEnter={() => setAddHover(true)}
                onMouseLeave={() => setAddHover(false)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  background: addHover && inStock ? "rgba(201,168,76,0.1)" : "transparent",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: !inStock ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.8)",
                  cursor: adding || !inStock ? "not-allowed" : "pointer",
                  opacity: !inStock ? 0.4 : 1,
                  transition: "all 0.2s ease",
                  fontFamily: "'Georgia', serif",
                }}
              >
                <ShoppingBag size={12} />
                {adding ? "Adding…" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                onMouseEnter={() => setBuyHover(true)}
                onMouseLeave={() => setBuyHover(false)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em",
                  border: "none",
                  background: inStock
                    ? "linear-gradient(135deg, #C9A84C 0%, #a8873d 100%)"
                    : "rgba(80,80,80,0.3)",
                  color: inStock ? "#0a0a0a" : "rgba(255,255,255,0.2)",
                  cursor: !inStock ? "not-allowed" : "pointer",
                  filter: buyHover && inStock ? "brightness(1.1)" : "none",
                  transition: "filter 0.2s ease",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>

        {/* Gold shimmer bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #C9A84C 30%, #d4af37 50%, #C9A84C 70%, transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />
      </div>
    </Link>
  );
};

/* ─────────────────────── Skeleton Card ─────────────────────────────── */
const SkeletonCard = () => (
  <div style={{
    borderRadius: 16, overflow: "hidden",
    background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.04)",
    height: 430,
  }}>
    <div style={{
      height: 230,
      background: "linear-gradient(90deg, #151515 25%, #1e1e1e 50%, #151515 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s infinite",
    }} />
    <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      {[["30%", "8px"], ["65%", "15px"], ["90%", "11px"], ["50%", "11px"]].map(([w, h], i) => (
        <div key={i} style={{
          height: h, width: w, borderRadius: 4,
          background: "linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)",
          backgroundSize: "200% 100%",
          animation: `shimmer 1.6s infinite ${i * 0.1}s`,
        }} />
      ))}
    </div>
  </div>
);

/* ─────────────────────── Sort Options ─────────────────────────────── */
const SORT_OPTIONS = [
  { label: "Newest",    sortBy: "id",         sortDir: "desc" },
  { label: "Price ↑",  sortBy: "finalPrice",  sortDir: "asc"  },
  { label: "Price ↓",  sortBy: "finalPrice",  sortDir: "desc" },
  { label: "Name A–Z", sortBy: "name",        sortDir: "asc"  },
];

/* ─────────────────────── Products Page ─────────────────────────────── */
const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlKeyword = searchParams.get("keyword") ?? "";

  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [totalPages, setTotalPages]   = useState(0);
  const [searchInput, setSearchInput] = useState(urlKeyword);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSort, setActiveSort]   = useState(0);

  const [filters, setFilters] = useState<ProductFilters>({
    pageNumber: 0,
    pageSize:   12,
    sortBy:     "id",
    sortDir:    "desc",
    keyword:    urlKeyword,
  });

  useEffect(() => {
    setFilters((f) => ({ ...f, keyword: urlKeyword, pageNumber: 0 }));
    setSearchInput(urlKeyword);
  }, [urlKeyword]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== "" && v !== undefined) params[k] = v;
      });
      const res  = await productAPI.getAll(params as ProductFilters);
      const data = res.data as { content?: Product[] };
      setProducts(data.content ?? (res.data as Product[]));
      setTotalPages((res.data as { totalPages?: number }).totalPages ?? 1);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const update = (key: keyof ProductFilters, value: unknown) =>
    setFilters((f) => ({
      ...f,
      [key]: value,
      pageNumber: key === "pageNumber" ? (value as number) : 0,
    }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    update("keyword", searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    update("keyword", "");
  };

  const handleSortChange = (idx: number) => {
    const opt = SORT_OPTIONS[idx];
    setActiveSort(idx);
    setFilters((f) => ({ ...f, sortBy: opt.sortBy, sortDir: opt.sortDir as "asc" | "desc", pageNumber: 0 }));
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.9; }
        }
        .sort-select option { background: #111; color: #fff; }
        .search-btn:hover { background: rgba(201,168,76,0.22) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080808" }}>

        {/* ── Hero ── */}
        <div style={{
          position: "relative", overflow: "hidden",
          padding: "100px 0 56px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          animation: "heroIn 0.6s ease both",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
            width: 800, height: 320,
            background: "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)",
            pointerEvents: "none",
            animation: "glowPulse 5s ease-in-out infinite",
          }} />

          {/* Subtle grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(201,168,76,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px", pointerEvents: "none",
          }} />

          <div className="container-wide" style={{ position: "relative" }}>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 18, padding: "5px 14px", borderRadius: 20,
              background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)",
            }}>
              <Sparkles size={11} style={{ color: "#C9A84C" }} />
              <span style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase" as const, color: "rgba(201,168,76,0.8)",
              }}>
                Exclusive Selections
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 700, color: "#f0f0f0",
              letterSpacing: "-0.03em", lineHeight: 1.08,
              margin: "0 0 10px",
            }}>
              Our{" "}
              <span style={{
                background: "linear-gradient(135deg, #a8873d 0%, #C9A84C 40%, #e8c96a 70%, #C9A84C 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Collection
              </span>
            </h1>

            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.04em", margin: "0 0 40px",
            }}>
              Curated products of distinction
            </p>

            {/* ── Search + Sort ── */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12, maxWidth: 700 }}>
              {/* Search */}
              <form onSubmit={handleSearch} style={{
                flex: "1 1 300px", display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.03)",
                border: searchFocused ? "1px solid rgba(201,168,76,0.5)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, overflow: "hidden",
                transition: "border-color 0.25s, box-shadow 0.25s",
                boxShadow: searchFocused ? "0 0 0 3px rgba(201,168,76,0.07)" : "none",
              }}>
                <span style={{
                  padding: "0 14px", display: "flex", alignItems: "center",
                  color: searchFocused ? "rgba(201,168,76,0.7)" : "rgba(255,255,255,0.2)",
                  transition: "color 0.2s", flexShrink: 0,
                }}>
                  <Search size={15} />
                </span>

                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    fontSize: 13, color: "#e0e0e0", padding: "14px 0",
                    caretColor: "#C9A84C", fontFamily: "'Georgia', serif",
                  }}
                />

                {searchInput && (
                  <button type="button" onClick={clearSearch} style={{
                    padding: "0 10px", color: "rgba(255,255,255,0.22)",
                    background: "transparent", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", flexShrink: 0,
                  }}>
                    <X size={13} />
                  </button>
                )}

                <button type="submit" className="search-btn" style={{
                  padding: "0 22px", alignSelf: "stretch",
                  background: "rgba(201,168,76,0.1)",
                  borderLeft: "1px solid rgba(255,255,255,0.06)",
                  color: "#C9A84C", border: "none",
                  borderLeft: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em",
                  transition: "background 0.2s", flexShrink: 0,
                  fontFamily: "'Georgia', serif",
                }}>
                  Search
                </button>
              </form>

              {/* Sort */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "0 16px", flexShrink: 0,
              }}>
                <ArrowUpDown size={13} style={{ color: "rgba(201,168,76,0.5)", flexShrink: 0 }} />
                <select
                  value={activeSort}
                  onChange={(e) => handleSortChange(Number(e.target.value))}
                  className="sort-select"
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: "rgba(255,255,255,0.6)", fontSize: 13,
                    cursor: "pointer", padding: "14px 0", minWidth: 112,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {SORT_OPTIONS.map((opt, i) => (
                    <option key={i} value={i}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active keyword pill */}
            {filters.keyword && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginTop: 18, animation: "fadeUp 0.3s ease",
              }}>
                <SlidersHorizontal size={12} style={{ color: "rgba(201,168,76,0.5)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Results for</span>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "#C9A84C",
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  padding: "2px 10px", borderRadius: 20,
                }}>
                  "{filters.keyword}"
                </span>
                <button onClick={clearSearch} style={{
                  fontSize: 11, color: "rgba(255,255,255,0.22)",
                  background: "transparent", border: "none", cursor: "pointer",
                  textDecoration: "underline", fontFamily: "'Georgia', serif",
                }}>
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="container-wide" style={{ padding: "52px 0 100px" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 24 }}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "100px 0", gap: 18,
              animation: "fadeUp 0.4s ease",
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                background: "rgba(201,168,76,0.05)",
                border: "1px solid rgba(201,168,76,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(201,168,76,0.35)",
              }}>
                <ShoppingBag size={32} />
              </div>
              <p style={{ fontFamily: "'Georgia', serif", fontSize: "1.2rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                No products found
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", margin: 0 }}>
                Try adjusting your search or filters
              </p>
              {filters.keyword && (
                <button onClick={clearSearch} style={{
                  marginTop: 4, padding: "10px 24px", borderRadius: 10,
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                  color: "#C9A84C", background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.22)", cursor: "pointer",
                  fontFamily: "'Georgia', serif",
                }}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Count row */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 32,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TrendingUp size={13} style={{ color: "rgba(201,168,76,0.45)" }} />
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", margin: 0, letterSpacing: "0.05em" }}>
                    {products.length} product{products.length !== 1 ? "s" : ""} shown
                  </p>
                </div>
                <div style={{
                  height: 1, flex: 1, margin: "0 20px",
                  background: "linear-gradient(90deg, rgba(201,168,76,0.1), transparent)",
                }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 24,
              }}>
                {products.map((p, i) => (
                  <FadeIn key={p.id} index={i}>
                    <ProductCard product={p} />
                  </FadeIn>
                ))}
              </div>
            </>
          )}

          {!loading && totalPages > 1 && (
            <div style={{ marginTop: 64, animation: "fadeUp 0.4s ease 0.3s both" }}>
              <Pagination
                page={filters.pageNumber ?? 0}
                totalPages={totalPages}
                onChange={(p) => update("pageNumber", p)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;