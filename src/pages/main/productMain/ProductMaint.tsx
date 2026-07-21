import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product as ProductType } from "../../../types/types";
import { apiProducts } from "../../../api/api";
import "./productmain.css";
import CarSvg from "../../../svg/CarSvg";
import { addProduct } from "../../../logic/main/carrito";
import Header from "../../../common/main/header/Header";

function ProductMain() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    async function getProduct(id: number) {
      setLoading(true);
      setNotFound(false);

      try {
        const resp = await apiProducts.getProduct(id);

        if (resp.data) {
          setProduct(resp.data);
          setNotFound(false);
        } else {
          setProduct(null);
          setNotFound(true);
        }
      } catch (e) {
        console.error(e);
        setProduct(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getProduct(+id);
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  return (
    <main className="productmain-main">
      <Header />
      {loading ? (
        <div className="loader-container">
          <div className="spinner" />
          <p className="ProductosPorCategoria-loading">Cargando...</p>
        </div>
      ) : notFound ? (
        <p className="home-notfound">No hay productos</p>
      ) : (
        product && (
          <>
            <section className="producto-card">
              <div className="productoadmin-header">
                <h3> {product.name} </h3>
              </div>
              <p style={{ color: "#ff0000" }}>
                {!product.available ? "Agotado" : ""}
              </p>
              <img
                src={product.image}
                className="producto-img"
                alt={product.name}
                loading="lazy"
              />
              <div className="producto-text">
                <div className="producto-textshort">
                  <p className="producto-categ">{product.category.name}</p>
                  <p className="producto-price"> ${product.price} </p>
                </div>
                <p className="producto-name"> {product.name} </p>
                <p className="producto-detail"> {product.details} </p>
              </div>
              <button
                className="producto-caradd"
                onClick={() => addProduct(product, 1)}
              >
                <CarSvg />
                Añadir al carrito
              </button>
            </section>
          </>
        )
      )}
    </main>
  );
}

export default ProductMain;
