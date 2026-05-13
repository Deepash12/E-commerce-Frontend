
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Heart, ShoppingBag, Trash2, Zap, Star } from 'lucide-react';
// import { wishlistAPI } from '../api/service';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import { LoadingPage, EmptyState } from '../components/ui';
// import { formatPrice } from '../utils';
// import type { Product } from '../types';
// import toast from 'react-hot-toast';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// /* ── Individual Wishlist Card (matches product card style) ── */
// const WishlistCard: React.FC<{
//   product: Product;
//   onRemove: (id: number) => void;
// }> = ({ product, onRemove }) => {
//   const { addToCart } = useCart();
//   const navigate = useNavigate();

//   const [adding, setAdding] = useState(false);
//   const [hovered, setHovered] = useState(false);
//   const [removing, setRemoving] = useState(false);

//   const discountAmount = product.discountPrice ?? 0;
//   const hasDiscount = discountAmount > 0;
//   const finalPrice = hasDiscount ? product.price - discountAmount : product.price;
//   const discountPercent = hasDiscount ? Math.round((discountAmount / product.price) * 100) : 0;
//   const inStock = (product.stockQuantity ?? 1) > 0;

//   const imageUrl = product.productImageUrl
//     ? `${BASE_URL}${product.productImageUrl}`
//     : null;

//   const handleAdd = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     setAdding(true);
//     try {
//       await addToCart(product.id, 1);
//       toast.success('Added to cart!');
//     } catch {
//       toast.error('Failed to add');
//     } finally {
//       setAdding(false);
//     }
//   };

//   const handleBuyNow = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     try {
//       await addToCart(product.id, 1);
//       navigate('/checkout');
//     } catch {
//       toast.error('Failed');
//     }
//   };

//   const handleRemove = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     setRemoving(true);
//     try {
//       await wishlistAPI.toggle(product.id);
//       onRemove(product.id);
//       toast.success('Removed from wishlist');
//     } catch {
//       toast.error('Failed to remove');
//     } finally {
//       setRemoving(false);
//     }
//   };

//   return (
//     <Link
//       to={`/products/${product.id}`}
//       style={{ display: 'block', height: '100%', textDecoration: 'none' }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <div
//         style={{
//           position: 'relative', borderRadius: '14px', overflow: 'hidden',
//           height: '100%', display: 'flex', flexDirection: 'column',
//           background: hovered
//             ? 'linear-gradient(160deg, #1e1c17 0%, #151310 100%)'
//             : 'linear-gradient(160deg, #161616 0%, #0f0f0f 100%)',
//           border: hovered ? '1px solid rgba(212,175,55,0.55)' : '1px solid rgba(255,255,255,0.06)',
//           boxShadow: hovered
//             ? '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08) inset'
//             : '0 2px 16px rgba(0,0,0,0.35)',
//           transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
//           transition: 'all 0.38s cubic-bezier(0.34,1.56,0.64,1)',
//         }}
//       >
//         {/* Image */}
//         <div
//           style={{
//             position: 'relative', height: '220px', background: '#fff',
//             overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}
//         >
//           {imageUrl ? (
//             <img
//               src={imageUrl}
//               alt={product.name}
//               style={{
//                 width: '100%', height: '100%', objectFit: 'contain', padding: '16px',
//                 transform: hovered ? 'scale(1.07)' : 'scale(1)',
//                 transition: 'transform 0.55s ease',
//               }}
//             />
//           ) : (
//             <div
//               style={{
//                 width: '100%', height: '100%', display: 'flex', alignItems: 'center',
//                 justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a1a, #252525)',
//                 fontSize: '4rem', fontWeight: 700, color: 'rgba(212,175,55,0.25)',
//                 fontFamily: "'Playfair Display', serif",
//               }}
//             >
//               {product.name?.[0]?.toUpperCase() ?? '?'}
//             </div>
//           )}

//           {/* Overlay badges */}
//           <div
//             style={{
//               position: 'absolute', inset: 0, padding: '12px',
//               display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
//               pointerEvents: 'none',
//             }}
//           >
//             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//               <span
//                 style={{
//                   fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em',
//                   textTransform: 'uppercase', padding: '3px 9px', borderRadius: '20px',
//                   background: 'rgba(20,20,20,0.75)',
//                   border: inStock ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(248,113,113,0.5)',
//                   color: inStock ? '#4ade80' : '#f87171', backdropFilter: 'blur(8px)',
//                 }}
//               >
//                 {inStock ? 'In Stock' : 'Sold Out'}
//               </span>
//             </div>
//             {hasDiscount && (
//               <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//                 <span
//                   style={{
//                     fontSize: '10px', fontWeight: 800, padding: '3px 9px', borderRadius: '20px',
//                     background: 'rgba(20,20,20,0.75)', border: '1px solid rgba(74,222,128,0.45)',
//                     color: '#4ade80', backdropFilter: 'blur(8px)', letterSpacing: '0.04em',
//                   }}
//                 >
//                   −{discountPercent}%
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Remove (Wishlist) button */}
//           <button
//             onClick={handleRemove}
//             disabled={removing}
//             style={{
//               position: 'absolute', top: '10px', left: '10px',
//               width: '34px', height: '34px', borderRadius: '10px',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               background: 'rgba(244,63,94,0.18)', border: '1px solid rgba(244,63,94,0.4)',
//               color: '#fb7185', backdropFilter: 'blur(8px)',
//               cursor: removing ? 'not-allowed' : 'pointer',
//               transition: 'all 0.25s ease', zIndex: 10, pointerEvents: 'auto',
//               opacity: removing ? 0.5 : 1,
//             }}
//             title="Remove from wishlist"
//           >
//             <Heart size={13} fill="currentColor" />
//           </button>
//         </div>

//         {/* Content */}
//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px' }}>
//           {product.categoryName && (
//             <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.65)', margin: 0 }}>
//               {typeof product.categoryName === 'object' ? (product.categoryName as any).name : product.categoryName}
//             </p>
//           )}

//           <h3
//             style={{
//               fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600,
//               lineHeight: 1.35, color: hovered ? '#d4af37' : '#e5e5e5',
//               transition: 'color 0.25s ease', margin: 0,
//             }}
//           >
//             {product.name}
//           </h3>

//           <p
//             style={{
//               fontSize: '11.5px', lineHeight: 1.65, color: 'rgba(255,255,255,0.3)',
//               margin: 0, flex: 1,
//               display: '-webkit-box', WebkitLineClamp: 2,
//               WebkitBoxOrient: 'vertical', overflow: 'hidden',
//             }}
//           >
//             {product.description}
//           </p>

//           {/* Star rating — real data if available, else "No reviews yet" */}
//           {(product as any).averageRating > 0 ? (
//             <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
//               <div style={{ display: 'flex', gap: '2px' }}>
//                 {[1, 2, 3, 4, 5].map((star) => {
//                   const rating = (product as any).averageRating;
//                   const filled = star <= Math.floor(rating);
//                   const partial = !filled && star === Math.ceil(rating);
//                   return (
//                     <div key={star} style={{ position: 'relative', width: '11px', height: '11px' }}>
//                       {/* Background star */}
//                       <Star size={11} style={{ color: 'rgba(255,255,255,0.12)', fill: 'rgba(255,255,255,0.12)', position: 'absolute', top: 0, left: 0 }} />
//                       {/* Filled / partial star */}
//                       {(filled || partial) && (
//                         <div style={{ position: 'absolute', top: 0, left: 0, width: partial ? `${((rating % 1) * 100)}%` : '100%', overflow: 'hidden' }}>
//                           <Star size={11} style={{ color: '#d4af37', fill: '#d4af37' }} />
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//               <span style={{ fontSize: '10.5px', color: '#d4af37', fontWeight: 600 }}>
//                 {Number((product as any).averageRating).toFixed(1)}
//               </span>
//               {(product as any).reviewCount > 0 && (
//                 <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.25)' }}>
//                   ({(product as any).reviewCount})
//                 </span>
//               )}
//             </div>
//           ) : (
//             <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.2)', margin: '2px 0 0', fontStyle: 'italic' }}>
//               No reviews yet
//             </p>
//           )}

//           {/* Price */}
//           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
//             <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 700, color: '#d4af37', letterSpacing: '-0.02em' }}>
//               {formatPrice(finalPrice)}
//             </span>
//             {hasDiscount && (
//               <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', textDecoration: 'line-through' }}>
//                 {formatPrice(product.price)}
//               </span>
//             )}
//             {hasDiscount && (
//               <span style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80' }}>
//                 {discountPercent}% off
//               </span>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
//             {/* Add to Cart */}
//             <button
//               onClick={handleAdd}
//               disabled={adding || !inStock}
//               style={{
//                 flex: 1, padding: '9px 0', borderRadius: '9px',
//                 fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.05em',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
//                 background: 'transparent', border: '1px solid rgba(212,175,55,0.35)',
//                 color: !inStock ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.85)',
//                 cursor: adding || !inStock ? 'not-allowed' : 'pointer',
//                 opacity: !inStock ? 0.45 : 1, transition: 'all 0.2s ease',
//               }}
//               onMouseEnter={(e) => {
//                 if (!adding && inStock) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.08)';
//               }}
//               onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
//             >
//               <ShoppingBag size={12} />
//               {adding ? 'Adding…' : 'Add to Cart'}
//             </button>

//             {/* Buy Now */}
//             <button
//               onClick={handleBuyNow}
//               disabled={!inStock}
//               style={{
//                 flex: 1, padding: '9px 0', borderRadius: '9px',
//                 fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.05em',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
//                 border: 'none',
//                 background: inStock
//                   ? 'linear-gradient(135deg, #c9a227 0%, #d4af37 50%, #b8861e 100%)'
//                   : 'rgba(80,80,80,0.3)',
//                 color: inStock ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
//                 cursor: !inStock ? 'not-allowed' : 'pointer', transition: 'filter 0.2s ease',
//               }}
//               onMouseEnter={(e) => {
//                 if (inStock) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.12)';
//               }}
//               onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
//             >
//               <Zap size={12} />
//               Buy Now
//             </button>

//             {/* Remove button */}
//             <button
//               onClick={handleRemove}
//               disabled={removing}
//               style={{
//                 padding: '9px 12px', borderRadius: '9px',
//                 fontSize: '11.5px', fontWeight: 600,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 background: 'transparent', border: '1px solid rgba(248,113,113,0.3)',
//                 color: 'rgba(248,113,113,0.7)',
//                 cursor: removing ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
//                 opacity: removing ? 0.5 : 1,
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.08)';
//                 (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(248,113,113,0.5)';
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
//                 (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(248,113,113,0.3)';
//               }}
//               title="Remove from wishlist"
//             >
//               <Trash2 size={12} />
//             </button>
//           </div>
//         </div>

//         {/* Gold shimmer bottom line on hover */}
//         <div
//           style={{
//             position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
//             background: 'linear-gradient(90deg, transparent 0%, #c9a227 30%, #d4af37 50%, #c9a227 70%, transparent 100%)',
//             opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease',
//           }}
//         />
//       </div>
//     </Link>
//   );
// };

// /* ── Skeleton Card ── */
// const SkeletonCard = () => (
//   <div style={{ borderRadius: '14px', overflow: 'hidden', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)', height: '460px' }}>
//     <div style={{ height: '220px', background: 'linear-gradient(90deg, #181818 25%, #222 50%, #181818 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
//     <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {[['35%', '8px'], ['70%', '14px'], ['90%', '10px'], ['50%', '10px']].map(([w, h], i) => (
//         <div key={i} style={{ height: h, width: w, borderRadius: '4px', background: 'linear-gradient(90deg, #1c1c1c 25%, #262626 50%, #1c1c1c 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.6s infinite ${i * 0.12}s` }} />
//       ))}
//     </div>
//   </div>
// );

// /* ── Main Wishlist Page ── */
// const WishlistPage: React.FC = () => {
//   const [items, setItems] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchWishlist = async () => {
//     try {
//       const res = await wishlistAPI.get(0, 20);
//       const data = res.data.content || [];
//       setItems(data.filter((item: Product) => item && item.id));
//     } catch {
//       toast.error('Failed to load wishlist');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchWishlist(); }, []);

//   const handleRemove = (productId: number) => {
//     setItems((prev) => prev.filter((p) => p.id !== productId));
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes shimmer {
//           0%   { background-position:  200% 0; }
//           100% { background-position: -200% 0; }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>

//       <div style={{ minHeight: '100vh', background: '#080808' }}>

//         {/* Hero / Header */}
//         <div
//           style={{
//             position: 'relative', overflow: 'hidden',
//             padding: '110px 0 52px', borderBottom: '1px solid rgba(255,255,255,0.05)',
//             animation: 'fadeUp 0.6s ease both',
//           }}
//         >
//           {/* Ambient glow */}
//           <div
//             style={{
//               position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
//               width: '600px', height: '300px',
//               background: 'radial-gradient(ellipse at center, rgba(244,63,94,0.05) 0%, transparent 70%)',
//               pointerEvents: 'none',
//             }}
//           />

//           <div className="container-wide" style={{ position: 'relative' }}>
//             {/* Eyebrow */}
//             <div
//               style={{
//                 display: 'inline-flex', alignItems: 'center', gap: '8px',
//                 marginBottom: '18px', padding: '5px 14px', borderRadius: '20px',
//                 background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.18)',
//               }}
//             >
//               <Heart size={11} style={{ color: '#f43f5e' }} fill="#f43f5e" />
//               <span style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(244,63,94,0.8)' }}>
//                 Your Wishlist
//               </span>
//             </div>

//             <h1
//               style={{
//                 fontFamily: "'Playfair Display', serif",
//                 fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700,
//                 color: '#f0f0f0', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 12px',
//               }}
//             >
//               Saved{' '}
//               <span style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//                 Items
//               </span>
//             </h1>

//             <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.04em', margin: 0 }}>
//               {loading ? 'Loading…' : `${items.length} item${items.length !== 1 ? 's' : ''} saved for later`}
//             </p>
//           </div>
//         </div>

//         {/* Grid */}
//         <div className="container-wide" style={{ padding: '48px 0 80px' }}>
//           {loading ? (
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
//               {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
//             </div>
//           ) : items.length === 0 ? (
//             <div
//               style={{
//                 display: 'flex', flexDirection: 'column', alignItems: 'center',
//                 justifyContent: 'center', padding: '96px 0', gap: '16px', animation: 'fadeUp 0.4s ease',
//               }}
//             >
//               <div
//                 style={{
//                   width: '80px', height: '80px', borderRadius: '50%',
//                   background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.18)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(244,63,94,0.45)',
//                 }}
//               >
//                 <Heart size={32} />
//               </div>
//               <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
//                 Your wishlist is empty
//               </p>
//               <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
//                 Save items you love to find them later
//               </p>
//               <Link
//                 to="/products"
//                 style={{
//                   marginTop: '8px', padding: '11px 28px', borderRadius: '9px',
//                   fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
//                   color: '#0a0a0a', background: 'linear-gradient(135deg, #c9a227, #d4af37)',
//                   textDecoration: 'none', transition: 'filter 0.2s ease',
//                 }}
//                 onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = 'brightness(1.1)'; }}
//                 onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = 'none'; }}
//               >
//                 Browse Collection
//               </Link>
//             </div>
//           ) : (
//             <>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
//                 <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.05em' }}>
//                   {items.length} item{items.length !== 1 ? 's' : ''} saved
//                 </p>
//                 <div style={{ height: '1px', flex: 1, margin: '0 20px', background: 'linear-gradient(90deg, rgba(244,63,94,0.12), transparent)' }} />
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
//                 {items.map((product, i) => (
//                   <div key={product.id} style={{ animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 55}ms` }}>
//                     <WishlistCard product={product} onRemove={handleRemove} />
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default WishlistPage;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, Zap, Star } from "lucide-react";
import { wishlistAPI } from "../api/service";
import { useCart } from "../context/CartContext";
import { LoadingPage, EmptyState } from "../components/ui";
import { formatPrice } from "../utils";
import type { Product } from "../types";
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

const WishlistCard: React.FC<{
  product: Product;
  onRemove: (id: number) => void;
}> = ({ product, onRemove }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountAmount = product.discountPrice ?? 0;
  const hasDiscount = discountAmount > 0;
  const finalPrice = hasDiscount ? product.price - discountAmount : product.price;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / product.price) * 100)
    : 0;
  const inStock = (product.stockQuantity ?? 1) > 0;

  const imageUrl = getImageUrl(product.productImageUrl);

  useEffect(() => {
    setImageError(false);
  }, [product.productImageUrl]);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();

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

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await addToCart(product.id, 1);
      navigate("/checkout");
    } catch {
      toast.error("Failed");
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();

    setRemoving(true);

    try {
      await wishlistAPI.toggle(product.id);
      onRemove(product.id);
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    } finally {
      setRemoving(false);
    }
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
          borderRadius: "14px",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: hovered
            ? "linear-gradient(160deg, #1e1c17 0%, #151310 100%)"
            : "linear-gradient(160deg, #161616 0%, #0f0f0f 100%)",
          border: hovered
            ? "1px solid rgba(212,175,55,0.55)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: hovered
            ? "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08) inset"
            : "0 2px 16px rgba(0,0,0,0.35)",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          transition: "all 0.38s cubic-bezier(0.34,1.56,0.64,1)",
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
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              onError={(e) => {
                console.log("Wishlist image failed:", e.currentTarget.src);
                setImageError(true);
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "16px",
                transform: hovered ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.55s ease",
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
                background: "linear-gradient(135deg, #1a1a1a, #252525)",
                fontSize: "4rem",
                fontWeight: 700,
                color: "rgba(212,175,55,0.25)",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {product.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: "20px",
                  background: "rgba(20,20,20,0.75)",
                  border: inStock
                    ? "1px solid rgba(74,222,128,0.5)"
                    : "1px solid rgba(248,113,113,0.5)",
                  color: inStock ? "#4ade80" : "#f87171",
                  backdropFilter: "blur(8px)",
                }}
              >
                {inStock ? "In Stock" : "Sold Out"}
              </span>
            </div>

            {hasDiscount && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 9px",
                    borderRadius: "20px",
                    background: "rgba(20,20,20,0.75)",
                    border: "1px solid rgba(74,222,128,0.45)",
                    color: "#4ade80",
                    backdropFilter: "blur(8px)",
                    letterSpacing: "0.04em",
                  }}
                >
                  −{discountPercent}%
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleRemove}
            disabled={removing}
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
              background: "rgba(244,63,94,0.18)",
              border: "1px solid rgba(244,63,94,0.4)",
              color: "#fb7185",
              backdropFilter: "blur(8px)",
              cursor: removing ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              zIndex: 10,
              pointerEvents: "auto",
              opacity: removing ? 0.5 : 1,
            }}
            title="Remove from wishlist"
          >
            <Heart size={13} fill="currentColor" />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            gap: "8px",
          }}
        >
          {product.categoryName && (
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.65)",
                margin: 0,
              }}
            >
              {typeof product.categoryName === "object"
                ? (product.categoryName as any).name
                : product.categoryName}
            </p>
          )}

          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1rem",
              fontWeight: 600,
              lineHeight: 1.35,
              color: hovered ? "#d4af37" : "#e5e5e5",
              transition: "color 0.25s ease",
              margin: 0,
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              fontSize: "11.5px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.3)",
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

          {(product as any).averageRating > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "2px",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = (product as any).averageRating;
                  const filled = star <= Math.floor(rating);
                  const partial = !filled && star === Math.ceil(rating);

                  return (
                    <div
                      key={star}
                      style={{ position: "relative", width: "11px", height: "11px" }}
                    >
                      <Star
                        size={11}
                        style={{
                          color: "rgba(255,255,255,0.12)",
                          fill: "rgba(255,255,255,0.12)",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />

                      {(filled || partial) && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: partial ? `${(rating % 1) * 100}%` : "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Star size={11} style={{ color: "#d4af37", fill: "#d4af37" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <span style={{ fontSize: "10.5px", color: "#d4af37", fontWeight: 600 }}>
                {Number((product as any).averageRating).toFixed(1)}
              </span>

              {(product as any).reviewCount > 0 && (
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.25)" }}>
                  ({(product as any).reviewCount})
                </span>
              )}
            </div>
          ) : (
            <p
              style={{
                fontSize: "10.5px",
                color: "rgba(255,255,255,0.2)",
                margin: "2px 0 0",
                fontStyle: "italic",
              }}
            >
              No reviews yet
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.35rem",
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
                  color: "rgba(255,255,255,0.28)",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.price)}
              </span>
            )}

            {hasDiscount && (
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#4ade80" }}>
                {discountPercent}% off
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <button
              onClick={handleAdd}
              disabled={adding || !inStock}
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
                border: "1px solid rgba(212,175,55,0.35)",
                color: !inStock
                  ? "rgba(212,175,55,0.3)"
                  : "rgba(212,175,55,0.85)",
                cursor: adding || !inStock ? "not-allowed" : "pointer",
                opacity: !inStock ? 0.45 : 1,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!adding && inStock) {
                  e.currentTarget.style.background = "rgba(212,175,55,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <ShoppingBag size={12} />
              {adding ? "Adding…" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!inStock}
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
                  ? "linear-gradient(135deg, #c9a227 0%, #d4af37 50%, #b8861e 100%)"
                  : "rgba(80,80,80,0.3)",
                color: inStock ? "#0a0a0a" : "rgba(255,255,255,0.2)",
                cursor: !inStock ? "not-allowed" : "pointer",
                transition: "filter 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (inStock) e.currentTarget.style.filter = "brightness(1.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            >
              <Zap size={12} />
              Buy Now
            </button>

            <button
              onClick={handleRemove}
              disabled={removing}
              style={{
                padding: "9px 12px",
                borderRadius: "9px",
                fontSize: "11.5px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid rgba(248,113,113,0.3)",
                color: "rgba(248,113,113,0.7)",
                cursor: removing ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: removing ? 0.5 : 1,
              }}
              title="Remove from wishlist"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, #c9a227 30%, #d4af37 50%, #c9a227 70%, transparent 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div
    style={{
      borderRadius: "14px",
      overflow: "hidden",
      background: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.05)",
      height: "460px",
    }}
  >
    <div
      style={{
        height: "220px",
        background:
          "linear-gradient(90deg, #181818 25%, #222 50%, #181818 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }}
    />

    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {[
        ["35%", "8px"],
        ["70%", "14px"],
        ["90%", "10px"],
        ["50%", "10px"],
      ].map(([w, h], i) => (
        <div
          key={i}
          style={{
            height: h,
            width: w,
            borderRadius: "4px",
            background:
              "linear-gradient(90deg, #1c1c1c 25%, #262626 50%, #1c1c1c 75%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.6s infinite ${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const res = await wishlistAPI.get(0, 20);
      const apiResponse: any = res.data;
      const data = apiResponse?.data?.content ?? apiResponse?.content ?? [];

      setItems(data.filter((item: Product) => item && item.id));
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      toast.error("Failed to load wishlist");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = (productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080808" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "110px 0 52px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "600px",
              height: "300px",
              background:
                "radial-gradient(ellipse at center, rgba(244,63,94,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div className="container-wide" style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "18px",
                padding: "5px 14px",
                borderRadius: "20px",
                background: "rgba(244,63,94,0.07)",
                border: "1px solid rgba(244,63,94,0.18)",
              }}
            >
              <Heart size={11} style={{ color: "#f43f5e" }} fill="#f43f5e" />

              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(244,63,94,0.8)",
                }}
              >
                Your Wishlist
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#f0f0f0",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                margin: "0 0 12px",
              }}
            >
              Saved{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f43f5e, #fb7185)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Items
              </span>
            </h1>

            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.32)",
                letterSpacing: "0.04em",
                margin: 0,
              }}
            >
              {loading
                ? "Loading…"
                : `${items.length} item${items.length !== 1 ? "s" : ""} saved for later`}
            </p>
          </div>
        </div>

        <div className="container-wide" style={{ padding: "48px 0 80px" }}>
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "24px",
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Heart size={56} />}
              title="Your wishlist is empty"
              description="Save items you love to find them later"
              action={
                <Link to="/products" className="btn btn-primary">
                  Browse Collection
                </Link>
              }
            />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "28px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.2)",
                    margin: 0,
                    letterSpacing: "0.05em",
                  }}
                >
                  {items.length} item{items.length !== 1 ? "s" : ""} saved
                </p>

                <div
                  style={{
                    height: "1px",
                    flex: 1,
                    margin: "0 20px",
                    background:
                      "linear-gradient(90deg, rgba(244,63,94,0.12), transparent)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "24px",
                }}
              >
                {items.map((product, i) => (
                  <div
                    key={product.id}
                    style={{
                      animation: `fadeUp 0.5s ease both`,
                      animationDelay: `${i * 55}ms`,
                    }}
                  >
                    <WishlistCard product={product} onRemove={handleRemove} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;