
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const API = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/api/coupon`,
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export interface CreateCouponDTO {
  couponCode: string;
  couponType: "FLAT" | "PERCENTAGE";
  description: string;
  minOrderAmount: number;
  discountAmount: number;
  maximumDiscountAmount: number;
  validFrom: string;
  expiryAt: string;
  perUserLimit: number;
  globalUsageLimit: number;
  isActive: boolean;
}

export interface CouponFilterRequestAdmin {
  couponCode?: string;
  couponType?: "FLAT" | "PERCENTAGE";
  isActive?: boolean;
  status?: string;
}

const couponAPI = {
  // Create coupon
  create: (data: CreateCouponDTO) =>
    API.post("/createCoupon", data),

  // Update coupon
  update: (id: number, data: CreateCouponDTO) =>
    API.put(`/updateCoupon/${id}`, data),

  // Get all coupons with pagination and filters
  getAll: (
    pageNumber: number = 0,
    pageSize: number = 5,
    filter: CouponFilterRequestAdmin = {}
  ) =>
    API.get("/all", {
      params: {
        pageNumber,
        pageSize,
        ...filter,
      },
    }),

  // Get coupon by ID
  getById: (id: number) =>
    API.get(`/view/${id}`),

  // Enable / Disable coupon
  toggle: (id: number) =>
    API.patch(`/toggle/${id}`),
};

export default couponAPI;
