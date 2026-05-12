import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/ui/Footer";


import { ProtectedRoute, AdminRoute } from "./components/auth/ProtectedRoute";



import { LoadingPage } from "./components/ui";

import { ForgotPasswordPage, ResetPasswordPage } from "./pages/PasswordPage";

// Admin Product Pages
import ProductListPage from "./pages/admin/products/ProductListPage";
import AddProductPage from "./pages/admin/products/AddProductPage";
import EditProductPage from "./pages/admin/products/EditProductPage";
import ProductViewPage from "./pages/admin/products/ProductViewPage";

// Admin Coupon Pages
import AddCouponPage from "./pages/admin/coupons/AddCouponPage";
import AdminCouponsPage from "./pages/admin/coupons/AdminCouponsPage";
import CouponsPage from "./pages/CouponsPage";
import ProfileInformation from "./pages/ProfileInformation";
import EditProfile from "./pages/EditProfile";
import AboutPage from "./components/ui/AboutPage";
import CouponViewPage from "./pages/CouponViewPage";
import EditCouponPage from "./pages/admin/coupons/EditCouponsPage";

import ViewCouponPage from "./pages/admin/coupons/viewCouponsPage";


import { useAuth } from "./context/AuthContext";
import ProductReviewsPage from "./pages/ProductReviewViewPage";

import MyReviewsPage from "./pages/MyReviewsPage";

// Lazy Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProductsPage = lazy(()=> import("./pages/ProductPage"));
// const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const AddressesPage = lazy(() => import("./pages/AddressesPage"));
const WishlistPage = lazy(() => import("./pages/Wishlistpage"));


function AppRoutes() {
  const { isAdmin } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-[90px]">
        <Suspense fallback={<LoadingPage />}>
          <Routes>

            {/* Public Pages */}
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Product Pages */}
            {/* <Route path="/products" element={<ProductsPage />} /> */}

            <Route
              path="/products"
              element={isAdmin ? <Navigate to="/admin/products" /> : <ProductsPage />}
            />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            <Route path="/products/:id/reviews" element={<ProductReviewsPage />} />

            {/* User Protected Pages */}
            <Route
              path="/cart"
              element={<ProtectedRoute><CartPage /></ProtectedRoute>}
            />

            <Route
              path="/checkout"
              element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
            />

            <Route
              path="/payment"
              element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}
            />

            <Route
              path="/orders"
              element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
            />

            <Route
              path="/orders/:id"
              element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
            />

            <Route
              path="/addresses"
              element={<ProtectedRoute><AddressesPage /></ProtectedRoute>}
            />
            {/* <Route path="/addresses/edit/:id" element={<EditAddressPage />} /> */}

            <Route
              path="/wishlist"
              element={<ProtectedRoute><WishlistPage /></ProtectedRoute>}
            />
            <Route path="/profile/reviews" element={<ProtectedRoute><MyReviewsPage /></ProtectedRoute>} />

            {/* ---------------- ADMIN ROUTES ---------------- */}

            {/* Admin Products */}
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductListPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products/add"
              element={
                <AdminRoute>
                  <AddProductPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute>
                  <EditProductPage />
                </AdminRoute>
              }
            />
            <Route path="/admin/products/view/:id" element={<ProductViewPage />} />

            {/* Admin Coupons */}
            <Route
              path="/admin/coupons"
              element={
                <AdminRoute>
                  <AdminCouponsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/coupons/add"
              element={
                <AdminRoute>
                  <AddCouponPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/coupons/edit/:id"
              element={
                <AdminRoute>
                  <EditCouponPage />
                </AdminRoute>
              }
            />

            <Route path="/admin/coupons/view/:id" element={<ViewCouponPage />} />



            {/* <Route path="/about" element={<AboutPage />} /> */}

            <Route
              path="/about"
              element={isAdmin ? <Navigate to="/admin/products" /> : <AboutPage />}
            />

            <Route path="/profile" element={<ProfileInformation />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/profile/orders" element={<OrdersPage />} />
            <Route path="/profile/addresses" element={<AddressesPage />} />
            <Route path="/profile/coupons" element={<CouponsPage />} />
            <Route path="/profile/coupons/:id" element={<CouponViewPage />} />
            <Route path="/profile/wishlist" element={<WishlistPage />} />
            <Route path="/profile/change-password" element={<ForgotPasswordPage />} />

          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <AppRoutes />

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1a1815",
                color: "#f0ece4",
                border: "1px solid #2a2825",
                borderRadius: "2px",
                fontSize: "13px",
                fontFamily: '"DM Sans", sans-serif',
              },
              success: {
                iconTheme: { primary: "#e4a823", secondary: "#0d0c0a" },
              },
              error: {
                iconTheme: { primary: "#f87171", secondary: "#0d0c0a" },
              },
            }}
          />

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}