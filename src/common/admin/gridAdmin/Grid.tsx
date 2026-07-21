//import { addProduct } from "../custom/carritoLogic";
//import CarSvg from "../../../svg/CarSvg";
import { useNavigate } from "react-router-dom";
import DeleteSvg from "../../../svg/DeleteSvg";
import EditSvg from "../../../svg/EditSvg";
import EyeClosed from "../../../svg/EyeClosed";
import EyeOpened from "../../../svg/EyeOpened";
import type { Product } from "../../../types/types";
import "./grid.css";

interface Props {
  productos: Product[];
  cambio: number | null,
  toggleAvailability: (id: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

function Grid({ productos, cambio, toggleAvailability, deleteProduct }: Props) {
  const nav = useNavigate();

  return (
    <main className="grid-main">
      {productos.map((producto) => (
        <section key={producto.id} className="grid-section">
          <a href={`products/${producto.id}`} className="grid-a">
            <img
              src={producto.image}
              className="grid-img"
              alt={producto.name}
              loading="lazy"
            />
          </a>

          <div className="grid-div">
            <a href={`products/${producto.id}`} className="grid-a">
              <p className="grid-categ"> {producto.category.name} </p>
              <p style={{ color: "#ff0000" }}>
                {!producto.available ? "Agotado" : ""}
              </p>
              <p className="grid-nombre"> {producto.name} </p>
            </a>
            <div>
              {cambio ? (
                <p className="grid-precio"> {producto.price * cambio} CUP </p>
              ) : (
                <p className="grid-precio"> {producto.price} USD </p>
              )}
              <div className="grid-options">
                <button
                  className="grid-delete"
                  onClick={() => deleteProduct(producto.id)}
                >
                  <DeleteSvg />
                </button>
                <button
                  className="grid-edit"
                  onClick={() => nav(`/admin/products/update/${producto.id}`)}
                >
                  <EditSvg />
                </button>
                {producto.available ? (
                  <button
                    className="grid-disponibility"
                    onClick={() => toggleAvailability(producto.id)}
                  >
                    <EyeOpened />
                  </button>
                ) : (
                  <button
                    className="grid-disponibility"
                    onClick={() => toggleAvailability(producto.id)}
                  >
                    <EyeClosed />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}

export default Grid;
