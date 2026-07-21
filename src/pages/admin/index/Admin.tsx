import { useEffect } from "react";
import { isAuth } from "../../../auth/services/authService";
import { Link, useNavigate } from "react-router-dom";
import ProductSvg from "../../../svg/ProductSvg";
import CategorySvg from "../../../svg/CategorySvg";
import OrderSvg from "../../../svg/OrderSvg";
import MoreSvg from "../../../svg/MoreSvg";
import "./admin.css"

function Admin() {
  const nav = useNavigate();

  useEffect(() => {
    isAuth().then((auth) => {
      if (!auth) nav("/login");
    });
  });

  return (
    <>
      <main className="admin-main">
        <h1 className="admin-h1">Admin</h1>
        <section className="admin-section">
          <Link
            to={"/admin/products"}
            className="admin-article admin-productos"
          >
            <div className="admin-svg admin-productsvg">
              <ProductSvg />
            </div>
            <p>Productos</p>
            <p className="admin-p">Añade, edita y elimina productos</p>
          </Link>

          <Link
            to={"/admin/categories"}
            className="admin-article admin-categorias"
          >
            <div className="admin-svg admin-categsvg">
              <CategorySvg />
            </div>
            <p>Categorías</p>
            <p className="admin-p">Organiza tus productos</p>
          </Link>

          <Link to={"/admin/pedidos"} className="admin-article admin-pedidos">
            <div className="admin-svg admin-pedidosvg">
              <OrderSvg />
            </div>
            <p>Pedidos</p>
            <p className="admin-p">Información sobre los pedidos realizados</p>
          </Link>
        </section>

        <a href="/admin/products/create" className="admin-a">
          Agregar nuevo producto
          <div className="admin-div">
            <MoreSvg />
          </div>
        </a>
      </main>
    </>
  );
}

export default Admin;
