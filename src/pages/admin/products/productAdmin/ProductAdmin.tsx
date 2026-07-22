import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product as ProductType } from "../../../../types/types";
import { apiProducts } from "../../../../api/api";
import "./productadmin.css";
import DeleteSvg from "../../../../svg/DeleteSvg";
import EditSvg from "../../../../svg/EditSvg";
import EyeOpened from "../../../../svg/EyeOpened";
import EyeClosed from "../../../../svg/EyeClosed";

function ProductAdmin() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const nav = useNavigate();

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

  async function toggleAvailability(id: number) {
    try {
      await apiProducts.toggleAvailability(id);
      setProduct((prev) =>
        prev ? { ...prev, available: !prev?.available } : null
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function deleProduct(id: number) {
    const comfirm = window.confirm("Seguro q quieres eiminar el producto.");
    if (comfirm) {
      try {
        await apiProducts.deleteProduct(id);
        nav("/admin/products");
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <main className="productadmin-main">
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
                <div className="grid-options" id="productoadmin-options-btn">
                  <button
                    className="grid-delete"
                    id="btn-options"
                    onClick={() => deleProduct(product.id)}
                  >
                    <DeleteSvg />
                  </button>
                  <button
                    className="grid-edit"
                    id="btn-options"
                    onClick={() => nav(`/admin/products/update/${product.id}`)}
                  >
                    <EditSvg />
                  </button>
                  {product.available ? (
                    <button
                      id="btn-options"
                      className="grid-disponibility"
                      onClick={() => toggleAvailability(product.id)}
                    >
                      <EyeOpened />
                    </button>
                  ) : (
                    <button
                      id="btn-options"
                      className="grid-disponibility"
                      onClick={() => toggleAvailability(product.id)}
                    >
                      <EyeClosed />
                    </button>
                  )}
                </div>
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
              {/* <button
                className="producto-caradd"
                onClick={() => addProduct(producto, 1)}
              >
                <CarSvg />
                Añadir al carrito
              </button> */}
            </section>
          </>
        )
      )}
    </main>
  );
}

export default ProductAdmin;
