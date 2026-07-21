import { Link } from "react-router-dom";
import NavAdmin from "../../../../common/admin/navAdmin/NavAdmin";
import { useApiGet } from "../../../../logic/admin/useApiGet";
import type { Dolar as DType } from "../../../../types/types";
import "./dolar.css";

function Dolar() {
  const { changeFromApi, loading, notFound } = useApiGet<DType[]>("dolar");

  return (
    <main className="dolar-main">
      <h2>Gestionar Dolar</h2>
      <NavAdmin />
      {loading ? (
        <div className="loader-container">
          <div className="spinner" />
          <p className="ProductosPorCategoria-loading">Cargando...</p>
        </div>
      ) : notFound ? (
        <p>Cambio actual no establecido</p>
      ) : changeFromApi && changeFromApi.length > 0 ? (
        <>
          <section className="dolar-show">
            <p>Cambio actual</p>
            <p className="dolar-cambio">${changeFromApi.at(-1)?.cambio}</p>
          </section>
          <section className="dolar-btnwrapper">
            <Link
              className="global-btn"
              id="dolar-btn"
              to={`/admin/dolar/update?id=${changeFromApi.at(-1)?.id}`}
            >
              Actualizar Cambio
            </Link>
          </section>
        </>
      ) : (
        <section className="dolar-createbtn">
          <Link
            className="global-btn"
            id="dolar-btn"
            to={"/admin/dolar/create"}
          >
            Añadir Cambio
          </Link>
        </section>
      )}
    </main>
  );
}

export default Dolar;
