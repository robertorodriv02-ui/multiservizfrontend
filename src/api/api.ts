import axios from "axios";
import type {
  AuthRes,
  LoginRes,
  User,
  Category,
  Product,
  SearchProducts,
  UserCreateResponse,
  Dolar,
  ProductResponse,
  ProductsByCategory,
} from "../types/types";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiAuth = {
  login: (user: Omit<User, "id">) => api.post<LoginRes>(`/auth/login/`, user),
  checAuth: () => api.get<AuthRes>("auth/check/"),
  register: (user: Omit<User, "id">) => api.post<UserCreateResponse>("/users", user)
};

export const apiCategories = {
  getCategories: () => api.get<Category[]>("/categories"),

  getCategory: (id: number) => api.get<Category>(`/categories/${id}`),

  createCategory: (category: Omit<Category, "id" | "products">) =>
    api.post<Category>("/categories", category),

  updateCategory: (category: Omit<Category, "id">, id: number) =>
    api.put<Category>(`/categories/${id}`, category),

  deleteCategory: (id: number) => api.delete<boolean>(`/categories/${id}`),
};

export const apiProducts = {
  getProducts: (skip: number = 0) => api.get<ProductResponse>(`/products/?skip=${skip}`),

  getProduct: (id: number) => api.get<Product>(`products/${id}`),
  // createProduct: (product: Omit<Product, "id" | "disponibility" | "amount">) =>
  //   api.post<Product>("/products", product),
  createProduct: (product: FormData) =>
    api.post<Product>("/products", product, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateProduct: (id: number, product: FormData) =>
    api.put<Product>(`products/${id}`, product, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  toggleAvailability: (id: number) => api.patch<boolean>(`products/${id}`),

  deleteProduct: (id: number) => api.delete<boolean>(`products/${id}`),

  searchProducts: (query: string) =>
    api.get<SearchProducts>(`/products/search/${query}`),

  productsByCategory: (id: number) =>
    api.get<ProductsByCategory>(`/products/category/${id}`),
};

export const apiDolar = {
  getCambios: () => api.get<Dolar[]>("/dolar"),
  createCambio: (dolar: Omit<Dolar, "id">) => api.post<Dolar>("/dolar", dolar),
  updateCambio: (id: number, dolar: Omit<Dolar, "id">) => api.put<Dolar>(`/dolar/${id}`, dolar),
  deleteCambio: (id: number) => api.delete<boolean>(`/dolar/${id}`),
}