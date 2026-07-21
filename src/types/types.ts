export interface ProductResponse {
  page: number;
  previous: string | null;
  next: string | null;
  result: Product[];
}

export interface ProductsByCategory {
  category: Category;
  page: number;
  previous: string | null;
  next: string | null;
  result: Product[];
}

export interface Category {
  id: number;
  name: string;
  products: number;
}

export interface Product {
  id: number;
  image: string;
  details?: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  price: number;
  available: boolean;
  amount: number;
}

export interface Dolar {
  id: number;
  cambio: string;
}

export interface SearchProducts {
  query: string;
  count: number;
  results: Product[];
}

export interface Pedido {
  nombre: string;
  telefono: number;
  direccion: string;
  otro: string;
}

export type Endpoint = "products" | "categories" | "dolar";

/////////////////////////////////////////////////////////////////////////////

export interface User {
  id: number;
  user_name: string;
  password: string;
}

export interface UserCreateResponse {
  id: number;
  user_name: string;
}

export interface LoginRes {
  access_token: string;
}

export interface AuthRes {
  auth: boolean;
}
