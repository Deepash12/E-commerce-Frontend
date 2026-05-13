import axios from "axios"
import { Product } from "../types/Product"
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API = `${BASE_URL}/api/admin/products`

export const getProducts = () => {
  return axios.get<Product[]>(API)
}

export const createProduct = (product: Product) => {
  return axios.post(API, product)
}