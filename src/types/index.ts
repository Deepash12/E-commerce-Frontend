// ─── Auth ───────────────────────────────────────────────────────────────────
import { ArrowLeft } from 'lucide-react';
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role?: string;
  refreshToken?: string;
}

export interface User {
  username: string;
  token: string;
  role?: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  subCategory: string;
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  finalPrice?: number;
  stockQuantity: number;
  categoryName?: Category;
  subCategoryName?: SubCategory;
  productImageUrl?: string;
  isWishlist?: boolean;
}

export interface ProductFilters {
  keyword?: string;
  subCategoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  productImageUrl: any;
  productId: number;
  productName: string;
  finalPrice: number;
  quantity: number;
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  grandTotal: number;
  totalItems: number;
  coupon?: Coupon | null; // ✅ FIX: backend saves coupon on cart, reflect it here
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

export interface AddressRequest {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  productImageUrl?: string;
}

export interface OrderDetails {
  id: number;
  orderStatus: OrderStatus;
  items?: OrderItem[];
  totalAmount?: number;
  grandTotal?: number;
  createdAt?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  address?: Address;
  discountAmount?: number;
  estimatedDeliveryDate?: string;
  coupon?: Coupon;
}

// export interface Order {
//   data: any;
//   address?: Address;
//   amount: number;
// }

export interface Order {
  id: number;
  orderStatus: OrderStatus;
  items?: OrderItem[];

  totalAmount?: number;
  grandTotal?: number;

  createdAt?: string;

  paymentStatus?: string;
  paymentMethod?: string;

  address?: Address;

  discountAmount?: number;

  estimatedDeliveryDate?: string;

  coupon?: Coupon;
}


// ─── Payment ─────────────────────────────────────────────────────────────────
export type PaymentMethod = 'CARD' | 'UPI' | 'NET_BANKING' | 'COD';

export interface Payment {
  id?: number;
  paymentId?: number;
  transactionId: string;
  expiryTime?: string;
  amount?: number;
  status?: string;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────
export interface WishlistItem {
  product: Product;
  id?: number;
}

// ─── Coupon ──────────────────────────────────────────────────────────────────
export interface Coupon {
  id?: number;
  couponCode: string;
  code?: string;
  discountPercentage?: number;
  discountAmount?: number;
  description?: string;
  expiryAt?: string;
  minOrderAmount?: number;
  calculatedStatus?: string;
  alreadyUsed?: boolean;
}

// ─── Coupon Apply Response ────────────────────────────────────────────────────
export interface CouponApplyResponse {
  couponCode: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

export interface Category {
  id: number;
  name: string;
  Description: string;
}

export interface SubCategory {
  category: Category;
  id: number;
  name: string;
  description: string;
}

export interface Review {
  id: number;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  user: User;
  createdAt: string;
  likes: number;
  dislikes: number;
  verified: boolean;
}

export interface RatingSummary {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<number, number>;
}