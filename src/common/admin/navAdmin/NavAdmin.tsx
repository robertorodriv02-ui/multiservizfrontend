import { Link, useLocation } from "react-router-dom";
import "./navadmin.css";

function NavAdmin() {
  const location = useLocation();

  return (
    <>
      <main className="admin-nav-main">
        <Link
          className={
            location.pathname === "/admin/products"
              ? "active admin-nav-a"
              : "admin-nav-a"
          }
          to={"/admin/products"}
        >
          Productos
        </Link>

        <Link
          className={
            location.pathname === "/admin/categories"
              ? "active admin-nav-a"
              : "admin-nav-a"
          }
          to={"/admin/categories"}
        >
          Categorias
        </Link>

        <Link
          className={
            location.pathname === "/admin/pedidos"
              ? "active admin-nav-a"
              : "admin-nav-a"
          }
          to={"/admin/dolar"}
        >
          Dólar
        </Link>
      </main>
      <hr className="admin-nav-hr" />
    </>
  );
}

export default NavAdmin;
