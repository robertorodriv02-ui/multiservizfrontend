import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css"
import Login from "./pages/auth/Login/Login";
import Admin from "./pages/admin/index/Admin";
import CategoiesAdmin from "./pages/admin/categories/categoriesAdmin/CategoiesAdmin";
import ProductsCreate from "./pages/admin/products/ProductsCreate/ProductsCreate";
import CategoryCreate from "./pages/admin/categories/categoriesCreate/CategoryCreate";
import ProductAdmin from "./pages/admin/products/productAdmin/ProductAdmin";
import ProductUpdate from "./pages/admin/products/productUpdate/ProductUpdate";
import Register from "./pages/auth/Register/Register";
import ProductsPagination from "./pages/admin/products/productsAdmin/ProductsPagination";
import ProductsByCategory from "./pages/admin/products/productsByCategory/ProductsByCategory";
import Dolar from "./pages/admin/dolar/index/Dolar";
import DolarUpdate from "./pages/admin/dolar/dolarUpdate/DolarUpdate";
import DolarCreate from "./pages/admin/dolar/dolarCreate/DolarCreate";
import ProductsList from "./pages/main/ProducstList/ProductsList";
import ProductsByCategoryMain from "./pages/main/productsByCategoryMain/ProductsByCategoryMain";
import ProductMain from "./pages/main/productMain/ProductMaint";
import Carrito from "./pages/main/carrito/Carrito";
import Pedidos from "./pages/main/pedidos/Pedidos";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<ProductsList/>} />
          <Route path="/category/:id" element={<ProductsByCategoryMain />} />
          <Route path="/products/:id" element={<ProductMain/>} />
          <Route path="/carrito" element={<Carrito/>} />
          <Route path="/pedidos" element={<Pedidos/>} />

          {/* ///////////////////////////////////////////////////////////////////// */}

          {/* ADMIN ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products" element={<ProductsPagination />} />
          <Route path="/admin/products/:id" element={<ProductAdmin />} />
          <Route path="/admin/products/create" element={<ProductsCreate />} />
          <Route path="/admin/products/update/:id" element={<ProductUpdate />} />
          <Route path="/admin/products/category/:id" element={<ProductsByCategory />} />
          <Route path="/admin/categories" element={<CategoiesAdmin />} />
          <Route path="/admin/categories/create" element={<CategoryCreate />} />
          <Route path="/admin/dolar" element={<Dolar/>} />
          <Route path="/admin/dolar/update" element={<DolarUpdate/>} />
          <Route path="/admin/dolar/create" element={<DolarCreate/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
