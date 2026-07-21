import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Pedido, Product } from "../../../types/types";
import { clearCar, getCar } from "../../../logic/main/carrito";
import { Link } from "react-router-dom";
import { preparewhatsapp } from "../../../logic/main/pedido";
import "./pedidos.css";
import Header from "../../../common/main/header/Header";

interface Errors {
  nombre?: string[];
  telefono?: string[];
  direccion?: string[];
}

function Pedidos() {
  const [carrito, setCarrito] = useState<Product[]>([]);
  const { register, handleSubmit } = useForm<Pedido>();
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setCarrito(getCar());
  }, []);

  async function onSubmit(data: Pedido) {
    let productos = "";

    carrito.map((item) => {
      return (productos += `${item.amount} x ${item.name} \n`);
    });

    if (data.nombre.trim() === "") {
      setErrors({ nombre: ["Este campo no puede estar vacío"] });
      return;
    } else if (data.telefono.toString().trim() === "") {
      setErrors({ telefono: ["Este campo no puede estar vacío"] });
      return;
    } else if (data.direccion.trim() === "") {
      setErrors({ direccion: ["Este campo no puede estar vacío"] });
      return;
    }

    function sendPedido() {
      const url = preparewhatsapp(data);
      if (url) {
        window.open(url, "_blanck");
        clearCar();
      }
    }

    sendPedido();
  }

  if (carrito.length < 1) {
    return (
      <>
        <Header />

        <main className="pedido-main">
          <section className="pedido-nocar">
            <p>
              No tienes productos en el carrito por el momento. Ve a la tienda
              para comprar.
            </p>

            <Link to={"/"} className="producto-link pedido-link">
              Tienda
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <main className="pedido-main">
      <Header />
      <form className="pedido-form" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="pedido-h2">Realizar pedido</h3>

        <label htmlFor="nombre" className="pedido-lname pedido-label">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          className="pedido-iname pedido-input"
          {...register("nombre")}
        />
        {errors.nombre && <p className="pedido-error"> {errors.nombre[0]} </p>}

        <label htmlFor="phone" className="pedido-lphone pedido-label">
          Teléfono
        </label>
        <input
          type="number"
          id="phone"
          className="pedido-iphone pedido-input"
          {...register("telefono")}
        />
        {errors.telefono && (
          <p className="pedido-error"> {errors.telefono[0]} </p>
        )}

        <label className="pedido-laddress pedido-label">Dirección</label>
        <textarea
          className="pedido-iaddress pedido-input"
          {...register("direccion")}
        ></textarea>
        {errors.direccion && (
          <p className="pedido-error"> {errors.direccion[0]} </p>
        )}

        <label className="pedido-lother pedido-label">
          Información relevante
        </label>
        <textarea
          className="pedido-iother pedido-input"
          {...register("otro")}
        ></textarea>

        <button className="pedido-send">Enviar</button>
      </form>
    </main>
  );
}

export default Pedidos;
