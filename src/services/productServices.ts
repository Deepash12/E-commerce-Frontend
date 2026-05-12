import axios from "axios"
import { Product } from "../types/Product"

const API = "http://localhost:8080/api/admin/products"

export const getProducts = () => {
  return axios.get<Product[]>(API)
}

export const createProduct = (product: Product) => {
  return axios.post(API, product)
}