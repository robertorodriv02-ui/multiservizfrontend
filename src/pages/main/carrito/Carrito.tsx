import { useEffect, useState } from "react";
import type { Dolar, Product } from "../../../types/types";
import { Link, useNavigate } from "react-router-dom";
import {
  addProduct,
  deleteProducto,
  getCar,
  TotalPedido,
} from "../../../logic/main/carrito";
import LessSvg from "../../../svg/LessSvg";
import MoreSvg from "../../../svg/MoreSvg";
import "./carrito.css";
import Header from "../../../common/main/header/Header";
import { useApiGet } from "../../../logic/admin/useApiGet";

function Carrito() {
  const [carrito, setCarrito] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>();
  const [cambio, setCambio] = useState<number | null>(null);
  const { changeFromApi, loading } = useApiGet<Dolar[]>("dolar");
  const nav = useNavigate();

  useEffect(() => {
    setCarrito(getCar());
  }, []);

  useEffect(() => {
    setTotal(TotalPedido());
  }, [carrito]);

  useEffect(() => {
    if (changeFromApi) {
      const toNumber = changeFromApi.at(-1)?.cambio;
      setCambio(toNumber ? +toNumber : null);
    }
  }, [changeFromApi]);

  function handleAddProduct(product: Product, cantidad: number) {
    addProduct(product, cantidad);
    setCarrito(getCar());
  }

  function handleDeleteProduct(id: number) {
    deleteProducto(id);
    setCarrito(getCar());
  }

  function goPedidoPage() {
    nav("/pedidos");
  }

  if (carrito.length < 1) {
    return (
      <main className="carpage-component">
        <Header />
        <section className="carpage-empty">
          <p>No tienes productos en el carrito</p>
          <Link to={"/"} className="producto-link">
            Tienda
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="carpage-component">
      <Header />
      <h2 className="carpage-h2">Carrito</h2>
      {carrito.map((product) => (
        <section key={product.id} className="carpage-product">
          <div className="carpage-imgtext">
            <img
              src={product.image}
              className="carpage-img"
              alt={product.name}
              loading="lazy"
            />
            <div className="carpage-text">
              <div>
                <p>{product.name}</p>
                <p className="carpage-price">{product.price} USD</p>
              </div>
              <p className="carpage-total">
                Total: <span>{product.price * product.amount} USD</span>
              </p>
            </div>
          </div>

          <div className="carpage-btns">
            <button
              className="carpage-less"
              onClick={
                product.amount > 1
                  ? () => handleAddProduct(product, -1)
                  : () => handleDeleteProduct(product.id)
              }
            >
              <LessSvg />
            </button>

            <p> {product.amount} </p>

            <button
              className="carpage-mor"
              onClick={() => handleAddProduct(product, 1)}
            >
              <MoreSvg />
            </button>
          </div>
        </section>
      ))}
      <hr className="carpage-hr" />

      <section className="carpage-pay">
        <h4>
          Domicilio: <span className="carpage-price">$0</span>
        </h4>
        {loading ? (
          <h4>Calculando Total...</h4>
        ) : (
          total &&
          cambio && (
            <h4>
              Total a pagar:{" "}
              <span className="carpage-price">
                {total} USD / {total * cambio} CUP
              </span>
            </h4>
          )
        )}

        <div>
          <button className="carpage-pedido" onClick={() => goPedidoPage()}>
            Realizar pedido
          </button>
        </div>
      </section>
    </main>
  );
}

export default Carrito;
