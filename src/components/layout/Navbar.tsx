// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate, useLocation } from "react-router-dom";
// // import {
// //   ShoppingCart,
// //   Heart,
// //   ChevronDown,
// //   Menu,
// //   X,
// //   Search
// // } from "lucide-react";

// // import { useAuth } from "@/context/AuthContext";
// // import { useCart } from "@/context/CartContext";
// // import { cn } from "@/utils";
// // import toast from "react-hot-toast";
// // import ProfileDropdown from "./../ProfileDropdown";

// // const ProfileDropdownAny = ProfileDropdown as unknown as React.ComponentType<{
// //   username: string;
// //   onLogout: () => Promise<void>;
// //   isAdmin?: boolean;
// // }>;

// // const Navbar: React.FC = () => {
// //   const { user, logout, isAdmin } = useAuth();
// //   const { cart } = useCart();

// //   const [search, setSearch] = useState("");
// //   const [scrolled, setScrolled] = useState(false);
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   useEffect(() => {
// //     const fn = () => setScrolled(window.scrollY > 24);
// //     window.addEventListener("scroll", fn);
// //     return () => window.removeEventListener("scroll", fn);
// //   }, []);

// //   const handleLogout = async () => {
// //     await logout();
// //     toast.success("Signed out");
// //     navigate("/");
// //   };

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!search.trim()) return;
// //     navigate(`/products?keyword=${search}`);
// //   };

// //   const cartCount = cart?.totalItems ?? 0;

// //   const navLink = (to: string, label: string) => (
// //     <Link
// //       to={to}
// //       className={cn(
// //         "relative text-xs tracking-widest uppercase pb-1 transition-colors duration-200",
// //         location.pathname === to
// //           ? "text-gold-400"
// //           : "text-obsidian-400 hover:text-obsidian-100"
// //       )}
// //     >
// //       {label}
// //       <span
// //         className={cn(
// //           "absolute left-0 bottom-0 h-[1px] bg-gold-400 transition-all duration-300",
// //           location.pathname === to ? "w-full" : "w-0 group-hover:w-full"
// //         )}
// //       />
// //     </Link>
// //   );

// //   return (
// //     <nav
// //       className={cn(
// //         "fixed top-0 inset-x-0 z-[999] h-[90px] transition-all duration-300",
// //         scrolled
// //           ? "bg-obsidian-950/95 backdrop-blur-lg border-b border-obsidian-800"
// //           : "bg-transparent"
// //       )}
// //     >
// //       <div className="container-wide h-full flex items-center justify-between">

// //         {/* Logo */}
// //         <Link
// //           to={isAdmin ? "/admin/products" : "/products"}
// //           className="font-display text-2xl font-medium tracking-[0.2em] text-gradient"
// //         >
// //           LUXE
// //         </Link>

// //         {/* Desktop Menu */}
// //         <div className="hidden md:flex items-center gap-8 flex-1 ml-10">

// //           {!isAdmin && (
// //             <>
// //               {navLink("/products", "Home")}
// //               {navLink("/about", "About")}

// //               {/* Search Bar */}
// //               <form onSubmit={handleSearch} className="relative ml-6 flex-1 max-w-xl">

// //                 <Search
// //                   size={16}
// //                   className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500"
// //                 />

// //                 <input
// //                   type="text"
// //                   placeholder="Search products..."
// //                   value={search}
// //                   onChange={(e) => setSearch(e.target.value)}
// //                   className="w-full bg-obsidian-900 border border-obsidian-700 rounded px-9 py-2 text-sm text-white focus:outline-none focus:border-gold-400"
// //                 />

// //               </form>
// //             </>
// //           )}

// //           {/* Admin Menu */}
// //           {isAdmin && (
// //             <div className="relative group">
// //               <button className="text-xs tracking-widest uppercase text-obsidian-400 hover:text-obsidian-100 flex items-center gap-1">
// //                 Admin <ChevronDown size={12} />
// //               </button>

// //               <div className="absolute left-0 top-full w-56 bg-obsidian-900 border border-obsidian-700 rounded-md shadow-lg hidden group-hover:block">

// //                 <Link
// //                   to="/admin/products"
// //                   className="block px-4 py-2 text-sm hover:bg-obsidian-800"
// //                 >
// //                   View Products
// //                 </Link>

// //                 <Link
// //                   to="/admin/products/add"
// //                   className="block px-4 py-2 text-sm hover:bg-obsidian-800"
// //                 >
// //                   Add Product
// //                 </Link>

// //                 <Link
// //                   to="/admin/coupons"
// //                   className="block px-4 py-2 text-sm hover:bg-obsidian-800"
// //                 >
// //                   Coupons
// //                 </Link>

// //               </div>
// //             </div>
// //           )}

// //         </div>

// //         {/* Right Actions */}
// //         <div className="flex items-center gap-2">

// //           {/* Mobile Menu Button */}
// //           <button
// //             className="md:hidden btn btn-ghost p-2"
// //             onClick={() => setMobileOpen(!mobileOpen)}
// //           >
// //             {mobileOpen ? <X size={20} /> : <Menu size={20} />}
// //           </button>

// //           {user ? (
// //             <>
// //               {!isAdmin && (
// //                 <>
// //                   <Link
// //                     to="/wishlist"
// //                     className="btn btn-ghost p-2.5"
// //                   >
// //                     <Heart
// //                       size={22}
// //                       className="text-pink-500"
// //                       fill="currentColor"
// //                     />
// //                   </Link>

// //                   <Link
// //                     to="/cart"
// //                     className="btn btn-ghost p-2.5 relative"
// //                   >
// //                     <ShoppingCart size={22} className="text-gold-400" />

// //                     {cartCount > 0 && (
// //                       <span className="absolute top-1 right-1 bg-gold-400 text-obsidian-950 rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
// //                         {cartCount > 9 ? "9+" : cartCount}
// //                       </span>
// //                     )}
// //                   </Link>
// //                 </>
// //               )}

// //               <ProfileDropdownAny
// //                 username={user.username}
// //                 onLogout={handleLogout}
// //                 isAdmin={isAdmin}
// //               />
// //             </>
// //           ) : (
// //             <>
// //               <Link to="/login" className="btn btn-ghost btn-sm">
// //                 Sign In
// //               </Link>

// //               <Link to="/register" className="btn btn-primary btn-sm">
// //                 Register
// //               </Link>
// //             </>
// //           )}

// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       {mobileOpen && (
// //         <div className="md:hidden bg-obsidian-950 border-t border-obsidian-800 px-6 py-6 flex flex-col gap-4">

// //           {!isAdmin && (
// //             <>
// //               <Link to="/products" className="text-sm uppercase">
// //                 Home
// //               </Link>

// //               <Link to="/about" className="text-sm uppercase">
// //                 About
// //               </Link>
// //             </>
// //           )}

// //         </div>
// //       )}
// //     </nav>
// //   );
// // };

// // export default Navbar;
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   ShoppingCart,
//   Heart,
//   ChevronDown,
//   Menu,
//   X,
// } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { useCart } from "@/context/CartContext";
// import { cn } from "@/utils";
// import toast from "react-hot-toast";
// import ProfileDropdown from "./../ProfileDropdown";

// const ProfileDropdownAny = ProfileDropdown as unknown as React.ComponentType<{
//   username: string;
//   onLogout: () => Promise<void>;
//   isAdmin?: boolean;
// }>;

// const Navbar: React.FC = () => {
//   const { user, logout, isAdmin } = useAuth();
//   const { cart } = useCart();

//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 24);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     toast.success("Signed out");
//     navigate("/");
//   };

//   const cartCount = cart?.totalItems ?? 0;

//   const navLink = (to: string, label: string) => (
//     <Link
//       to={to}
//       className={cn(
//         "relative text-xs tracking-widest uppercase pb-1 transition-colors duration-200",
//         location.pathname === to
//           ? "text-gold-400"
//           : "text-obsidian-400 hover:text-obsidian-100"
//       )}
//     >
//       {label}
//       <span
//         className={cn(
//           "absolute left-0 bottom-0 h-[1px] bg-gold-400 transition-all duration-300",
//           location.pathname === to ? "w-full" : "w-0 group-hover:w-full"
//         )}
//       />
//     </Link>
//   );

//   return (
//     <nav
//       className={cn(
//         "fixed top-0 inset-x-0 z-[999] h-[90px] transition-all duration-300",
//         scrolled
//           ? "bg-obsidian-950/95 backdrop-blur-lg border-b border-obsidian-800"
//           : "bg-transparent"
//       )}
//     >
//       <div className="container-wide h-full flex items-center justify-between">

//         {/* Logo */}
//         <Link
//           to={isAdmin ? "/admin/products" : "/products"}
//           className="font-display text-2xl font-medium tracking-[0.2em] text-gradient"
//         >
//           LUXE
//         </Link>

//         {/* Desktop Nav Links */}
//         <div className="hidden md:flex items-center gap-8 flex-1 ml-10">

//           {!isAdmin && (
//             <>
//               {navLink("/products", "Home")}
//               {navLink("/about", "About")}
//             </>
//           )}

//           {/* Admin Dropdown */}
//           {isAdmin && (
//             <div className="relative group">
//               <button className="text-xs tracking-widest uppercase text-obsidian-400 hover:text-obsidian-100 flex items-center gap-1">
//                 Admin <ChevronDown size={12} />
//               </button>

//               <div className="absolute left-0 top-full w-56 bg-obsidian-900 border border-obsidian-700 rounded-md shadow-lg hidden group-hover:block">
//                 <Link
//                   to="/admin/products"
//                   className="block px-4 py-2 text-sm hover:bg-obsidian-800"
//                 >
//                   View Products
//                 </Link>

//                 <Link
//                   to="/admin/products/add"
//                   className="block px-4 py-2 text-sm hover:bg-obsidian-800"
//                 >
//                   Add Product
//                 </Link>

//                 <Link
//                   to="/admin/coupons"
//                   className="block px-4 py-2 text-sm hover:bg-obsidian-800"
//                 >
//                   Coupons
//                 </Link>
//               </div>
//             </div>
//           )}

//         </div>

//         {/* Right Actions */}
//         <div className="flex items-center gap-2">

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden btn btn-ghost p-2"
//             onClick={() => setMobileOpen(!mobileOpen)}
//           >
//             {mobileOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>

//           {user ? (
//             <>
//               {!isAdmin && (
//                 <>
//                   <Link to="/wishlist" className="btn btn-ghost p-2.5">
//                     <Heart size={22} className="text-pink-500" fill="currentColor" />
//                   </Link>

//                   <Link to="/cart" className="btn btn-ghost p-2.5 relative">
//                     <ShoppingCart size={22} className="text-gold-400" />
//                     {cartCount > 0 && (
//                       <span className="absolute top-1 right-1 bg-gold-400 text-obsidian-950 rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
//                         {cartCount > 9 ? "9+" : cartCount}
//                       </span>
//                     )}
//                   </Link>
//                 </>
//               )}

//               <ProfileDropdownAny
//                 username={user.username}
//                 onLogout={handleLogout}
//                 isAdmin={isAdmin}
//               />
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
//               <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
//             </>
//           )}

//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="md:hidden bg-obsidian-950 border-t border-obsidian-800 px-6 py-6 flex flex-col gap-4">
//           {!isAdmin && (
//             <>
//               <Link to="/products" className="text-sm uppercase">Home</Link>
//               <Link to="/about" className="text-sm uppercase">About</Link>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/utils";
import toast from "react-hot-toast";
import ProfileDropdown from "./../ProfileDropdown";

const ProfileDropdownAny = ProfileDropdown as unknown as React.ComponentType<{
  username: string;
  onLogout: () => Promise<void>;
  isAdmin?: boolean;
}>;

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", fn);
    fn();

    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ✅ Route change hote hi mobile menu close
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ✅ Navbar ke outside click par mobile menu close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const cartCount = cart?.totalItems ?? 0;

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      onClick={closeMobileMenu}
      className={cn(
        "relative text-xs tracking-widest uppercase pb-1 transition-colors duration-200",
        location.pathname === to
          ? "text-gold-400"
          : "text-obsidian-400 hover:text-obsidian-100"
      )}
    >
      {label}

      <span
        className={cn(
          "absolute left-0 bottom-0 h-[1px] bg-gold-400 transition-all duration-300",
          location.pathname === to ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </Link>
  );

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 inset-x-0 z-[999] transition-all duration-300",
        mobileOpen ? "h-auto" : "h-[90px]",
        scrolled || mobileOpen
          ? "bg-obsidian-950/95 backdrop-blur-lg border-b border-obsidian-800"
          : "bg-transparent"
      )}
    >
      <div className="container-wide h-[90px] flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAdmin ? "/admin/products" : "/products"}
          onClick={closeMobileMenu}
          className="font-display text-2xl font-medium tracking-[0.2em] text-gradient"
        >
          LUXE
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 flex-1 ml-10">
          {!isAdmin && (
            <>
              {navLink("/products", "Home")}
              {navLink("/about", "About")}
            </>
          )}

          {/* Admin Dropdown */}
          {isAdmin && (
            <div className="relative group">
              <button className="text-xs tracking-widest uppercase text-obsidian-400 hover:text-obsidian-100 flex items-center gap-1">
                Admin <ChevronDown size={12} />
              </button>

              <div className="absolute left-0 top-full w-56 bg-obsidian-900 border border-obsidian-700 rounded-md shadow-lg hidden group-hover:block">
                <Link
                  to="/admin/products"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-sm hover:bg-obsidian-800"
                >
                  View Products
                </Link>

                <Link
                  to="/admin/products/add"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-sm hover:bg-obsidian-800"
                >
                  Add Product
                </Link>

                <Link
                  to="/admin/coupons"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-sm hover:bg-obsidian-800"
                >
                  Coupons
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn btn-ghost p-2"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen((prev) => !prev);
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {user ? (
            <>
              {!isAdmin && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className="btn btn-ghost p-2.5"
                  >
                    <Heart
                      size={22}
                      className="text-pink-500"
                      fill="currentColor"
                    />
                  </Link>

                  <Link
                    to="/cart"
                    onClick={closeMobileMenu}
                    className="btn btn-ghost p-2.5 relative"
                  >
                    <ShoppingCart size={22} className="text-gold-400" />

                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-gold-400 text-obsidian-950 rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <ProfileDropdownAny
                username={user.username}
                onLogout={handleLogout}
                isAdmin={isAdmin}
              />
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="btn btn-ghost btn-sm"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="btn btn-primary btn-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-obsidian-950 border-t border-obsidian-800 px-6 py-6 flex flex-col gap-4">
          {!isAdmin && (
            <>
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="text-sm uppercase text-obsidian-200"
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="text-sm uppercase text-obsidian-200"
              >
                About
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/products"
                onClick={closeMobileMenu}
                className="text-sm uppercase text-obsidian-200"
              >
                View Products
              </Link>

              <Link
                to="/admin/products/add"
                onClick={closeMobileMenu}
                className="text-sm uppercase text-obsidian-200"
              >
                Add Product
              </Link>

              <Link
                to="/admin/coupons"
                onClick={closeMobileMenu}
                className="text-sm uppercase text-obsidian-200"
              >
                Coupons
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;