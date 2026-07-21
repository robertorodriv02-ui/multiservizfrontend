import { addProduct } from "../../../logic/main/carrito";
import CarSvg from "../../../svg/CarSvg";
import type { Product } from "../../../types/types";
import "./gridmain.css";

interface Props {
  productos: Product[];
  cambio: number | null;
}

function GridMain({ productos, cambio }: Props) {
  return (
    <main className="gridmain-main">
      {productos.map(
        (producto) =>
          producto.available && (
            <section key={producto.id} className="gridmain-section">
              <a href={`products/${producto.id}`} className="gridmain-a">
                <img
                  src={producto.image}
                  className="gridmain-img"
                  alt={producto.name}
                  loading="lazy"
                />
              </a>

              <div className="gridmain-div">
                <a href={`products/${producto.id}`} className="gridmain-a">
                  <p className="gridmain-categ"> {producto.category.name} </p>
                  <p className="gridmain-nombre"> {producto.name} </p>
                </a>
                <div>
                  {cambio ? (
                    <p className="gridmain-precio">
                      {" "}
                      {producto.price * cambio} CUP{" "}
                    </p>
                  ) : (
                    <p className="gridmain-precio"> {producto.price} USD </p>
                  )}
                  <button
                    className="gridmain-addbtn"
                    onClick={() => addProduct(producto, 1)}
                  >
                    <CarSvg />
                    <p>Comprar</p>
                  </button>
                </div>
              </div>
            </section>
          )
      )}
    </main>
  );
}

export default GridMain;
