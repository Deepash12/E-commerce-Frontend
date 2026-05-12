import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/coupon",
});

// attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export interface CreateCouponDTO {
  code: string;
  discountAmount: number;
  maximumDiscountAmount?: number;
  couponType?: string;
}

export interface CouponFilterRequestAdmin {
  code?: string;
  active?: boolean;
}

const couponAPI = {

  create: (data: CreateCouponDTO) =>
    API.post("/createCoupon", data),

  update: (id: number, data: CreateCouponDTO) =>
    API.put(`/updateCoupon/${id}`, data),

  getAll: (
    pageNumber: number = 0,
    pageSize: number = 5,
    filter: CouponFilterRequestAdmin
  ) =>
    API.get(`/all?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      data: filter,
    }),

  getById: (id: number) =>
    API.get(`/view/${id}`),

  delete: (id: number) =>
    API.delete(`/delete/${id}`),
};

export default couponAPI;