import apiClient from './client';
import type {
  RegisterRequest, LoginRequest,
  ProductFilters, Product,
  AddressRequest,
  Order, Payment, PaymentMethod, Coupon,
} from '../types';

// Auth
export const authAPI = {
  register: (data: RegisterRequest) => apiClient.post('/auth/register', data),
  login: (data: LoginRequest) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout', {
    refreshToken: localStorage.getItem("refreshToken")
  }),
  forgotPassword: (email: string) =>
    apiClient.post(`/auth/forget-password?email=${encodeURIComponent(email)}`),
  resetPassword: (data: { newPassword: string; token: string }) =>
    apiClient.post('/auth/reset-password', data),
};

// Products
export const productAPI = {
  getAll: (params?: ProductFilters) => apiClient.get('/products/all', { params }),
  getById: (id: number) => apiClient.get<Product>(`/products/view/${id}`),
  create: (data: Partial<Product>) => apiClient.post('/products/add', data),
  update: (id: number, data: Partial<Product>) => apiClient.put(`/products/edit/${id}`, data),
  delete: (id: number) => apiClient.delete(`/products/delete/${id}`),
  viewAll: (params?: ProductFilters, p0?: { headers: { Authorization: string } }) =>
    apiClient.get('/products/view', { params }),
};

// Cart
export const cartAPI = {
  view: () => apiClient.get('/cart/view'),
  add: (productId: number, quantity: number) =>
    apiClient.post('/cart/addToCart', { productId, quantity }),
  update: (productId: number, quantity: number) =>
    apiClient.put('/cart/update/quantity', { productId, quantity }),
  remove: (productId: number) => apiClient.delete(`/cart/${productId}`),
};

// Address
export const addressAPI = {
  view: (params?: { pageNumber?: number; pageSize?: number }) =>
    apiClient.get('/address/view', { params }),
  add: (data: AddressRequest) => apiClient.post('/address/add', data),
  delete: (id: number) => apiClient.delete(`/address/delete/address/${id}`),
  update: (id: number, data: AddressRequest) => apiClient.put(`/address/update/${id}`, data),
  getById: (id: number) => apiClient.get(`/address/view/${id}`),
};

interface CheckoutResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    address: any;
    amount: number;
  };
}

export const orderAPI = {
  checkout: (addressId: number, couponCode: string | null) =>
    apiClient.post<Order>('/orders/checkout', { addressId, couponCode }),
  getAll: () => apiClient.get('/orders/all'),
  getById: (id: number) => apiClient.get(`/orders/view/${id}`),
  cancel: (id: number) => apiClient.delete(`/orders/cancel/${id}`),
};

export const paymentAPI = {
  initiate: (checkoutData: any, method: PaymentMethod) =>
    apiClient.post<Payment>(
      `/payment/initiate?paymentMethod=${method}`,
      checkoutData
    ),
  complete: (paymentId: number) =>
    apiClient.post<Payment>(`/payment/complete/${paymentId}`),
};

// Wishlist
export const wishlistAPI = {
  get: (page = 0, size = 10) =>
    apiClient.get(`/wishlist?pageNumber=${page}&pageSize=${size}`),
  toggle: (productId: any) =>
    apiClient.put(`/wishlist/toggleWishlist/${productId}`),
};

// export const couponAPI = {
//   create: (data: any) =>
//     apiClient.post("/coupon/createCoupon", data),

//   update: (id: number, data: any) =>
//     apiClient.put(`/coupon/updateCoupon/${id}`, data),

//   getAll: (params?: any) =>
//     apiClient.get("/coupon/all", { params }),

//   getById: (id: number) =>
//     apiClient.get(`/coupon/view/${id}`),

//   delete: (id: number) =>
//     apiClient.delete(`/coupon/delete/${id}`),

//   getAllActiveCoupons: () =>
//     apiClient.get("/user/coupons/active/all"),

//   viewActiveCoupon: (id: number) =>
//     apiClient.get(`/user/coupons/active/view/${id}`),

//   // ✅ FIX: Apply coupon to cart — backend saves coupon on cart entity
//   apply: (couponCode: string) =>
//     apiClient.post("/user/coupon/apply", { couponCode }),

//   // ✅ FIX: Remove coupon from cart — backend sets cart.coupon = null
//   remove: () =>
//     apiClient.delete("/user/coupon/remove"),
// };


export const couponAPI = {
  create: (data: any) =>
    apiClient.post("/coupon/createCoupon", data),

  update: (id: number, data: any) =>
    apiClient.put(`/coupon/updateCoupon/${id}`, data),

  getAll: (params?: any) =>
    apiClient.get("/coupon/all", { params }),

  getById: (id: number) =>
    apiClient.get(`/coupon/view/${id}`),

  delete: (id: number) =>
    apiClient.delete(`/coupon/delete/${id}`),

  getAllActiveCoupons: () =>
    apiClient.get("/user/coupons/active/all"),

  viewActiveCoupon: (id: number) =>
    apiClient.get(`/user/coupons/active/view/${id}`),

  // ✅ FIX: Correct URLs matching your controller
  apply: (couponCode: string) =>
    apiClient.post("/user/coupons/apply", { couponCode }),

  remove: () =>
  apiClient.delete("/cart/coupon"),
};

export const reviewAPI = {
  create: (data: any) =>
    apiClient.post('/reviewAndRating/create', data),

  getProductReviews: (productId: number, pageNumber = 0, pageSize = 5) =>
    apiClient.get(`/reviewAndRating/products/${productId}/reviews`, {
      params: { pageNumber, pageSize }
    }),

  getMyReviews: (pageNumber = 0, pageSize = 5) =>
    apiClient.get(`/reviewAndRating/reviews/myReviews`, {
      params: { pageNumber, pageSize }
    }),

  update: (id: number, data: any) =>
    apiClient.put(`/reviewAndRating/reviews/update/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/reviewAndRating/reviews/delete/${id}`),

  getRatingSummary: (productId: number) =>
    apiClient.get(`/reviewAndRating/products/${productId}/rating-summary`),

  updateLikes: (id: number, action: "LIKE" | "DISLIKE") =>
    apiClient.put(`/reviewAndRating/product/update/likes/${id}`, {}, {
      params: { action },
    }),
};