import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Category,
  Dolar,
  Product,
  ProductResponse,
} from "../../../../types/types";
import axios from "axios";
import NavAdmin from "../../../../common/admin/navAdmin/NavAdmin";
import { Link } from "react-router-dom";
import MoreSvg from "../../../../svg/MoreSvg";
import SearchProducts from "../../../../common/admin/searchProducts/SearchProducts";
import { useApiGet } from "../../../../logic/admin/useApiGet";
import Grid from "../../../../common/admin/gridAdmin/Grid";
import { apiProducts } from "../../../../api/api";
import "./productsadmin.css";

type Monedas = "USD" | "CUP";

function ProductsPagination() {
  const { response, loading } = useApiGet<Category[]>("categories");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(`${baseUrl}/products`);
  const [loadingP, setLoadingP] = useState<boolean>(true);
  // Ref para evitar cargas duplicadas
  const isLoadingRef = useRef<boolean>(false);
  const { changeFromApi } = useApiGet<Dolar[]>("dolar");
  const [cambio, setCambio] = useState<number | null>(null);
  // 1. Función para cargar productos (memoizada)
  const getProductosPages = useCallback(async () => {
    // Evitar cargas simultáneas
    if (isLoadingRef.current || !nextUrl) return;

    isLoadingRef.current = true;
    setLoadingP(true);

    try {
      const resp = await axios.get<ProductResponse>(nextUrl);
      setProducts((prev) => [...prev, ...resp.data.result]);
      setNextUrl(resp.data.next);
    } catch (e) {
      console.error("Error al cargar:", e);
    } finally {
      setLoadingP(false);
      isLoadingRef.current = false;
    }
  }, [nextUrl]);

  useEffect(() => {
    getProductosPages();
  }, []);

  // 3. Observer para infinite scroll (con dependencias correctas)
  useEffect(() => {
    // Si no hay más páginas o ya está cargando, no crear observer
    if (!nextUrl || isLoadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextUrl && !isLoadingRef.current) {
          getProductosPages();
        }
      },
      { threshold: 0.1 } // 10% visible para activar
    );

    const currentSentinel = sentinelRef.current;

    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    // Cleanup
    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
        observer.disconnect();
      }
    };
  }, [nextUrl, getProductosPages]);

  const resetProducts = useCallback(() => {
    if (isLoadingRef.current) return;
    setProducts([]);
    setNextUrl(`${baseUrl}/products`);
  }, [baseUrl]);

  const searchData = (products: Product[] | null) => {
    if (products) {
      setProducts(products);
      setNextUrl(null);
    } else {
      alert("No hay ese producto");
    }
  };

  async function toggleAvailability(id: number) {
    try {
      await apiProducts.toggleAvailability(id);
      if (products) {
        setProducts((prevProducts) =>
          prevProducts
            ? prevProducts.map((prod) =>
                prod.id === id ? { ...prod, available: !prod.available } : prod
              )
            : prevProducts
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function deleProduct(id: number) {
    const comfirm = window.confirm("Seguro q quieres eiminar el producto.");
    if (comfirm) {
      try {
        await apiProducts.deleteProduct(id);
        if (products) {
          setProducts((prevProducts) =>
            prevProducts
              ? prevProducts.filter((prod) => prod.id !== id)
              : prevProducts
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  function cambiarMoneda(moneda: Monedas) {
    if (moneda === "USD") {
      setCambio(null);
    } else if (moneda === "CUP" && changeFromApi) {
      const toNumber = changeFromApi.at(-1)?.cambio;
      setCambio(toNumber ? +toNumber : null);
    }
  }

  return (
    <main className="productsadmin-main">
      <h2>Gestionar Productos</h2>
      <NavAdmin />
      <section className="productsadmin-searchandmore">
        <Link className="productsadmin-a" to={"/admin/products/create"}>
          <MoreSvg />
        </Link>
        <div className="productsadmin-searcform">
          <SearchProducts sendData={searchData} />
        </div>
      </section>
      <section className="productsadmin-categorysection">
        <div
          className="productsadmin-category isActive"
          onClick={() => resetProducts()}
        >
          Todos
        </div>
        {loading ? (
          <p className="categ-spinner"></p>
        ) : (
          response &&
          response.map((category) => (
            <Link
              className="productsadmin-category"
              key={category.id}
              to={`/admin/products/category/${category.id}`}
              onClick={() => getProductosPages}
            >
              {category.name}
            </Link>
          ))
        )}
      </section>
      <section className="productsadmin-h3-monedas">
        <h3>Productos</h3>
        <article className="productsadmin-monedas">
          <p
            className={
              cambio
                ? "productsadmin-moneda productsadmin-usd"
                : "productsadmin-moneda productsadmin-usd productsadmin-active"
            }
            onClick={() => cambiarMoneda("USD")}
          >
            USD
          </p>
          <p
            className={
              cambio
                ? "productsadmin-moneda productsadmin-cup productsadmin-active"
                : "productsadmin-cup productsadmin-moneda"
            }
            onClick={() => cambiarMoneda("CUP")}
          >
            CUP
          </p>
        </article>
      </section>
      <Grid
        productos={products}
        cambio={cambio}
        toggleAvailability={toggleAvailability}
        deleteProduct={deleProduct}
      />

      {/* Sentinel: elemento que activa la carga */}
      <div ref={sentinelRef} style={{ height: "20px" }} />

      {/* Estado de carga */}
      {loadingP && (
        <div className="loader-container">
          <div className="spinner" />
          <p className="productsadmin-loading">Cargando...</p>
        </div>
      )}
      {!nextUrl && products.length > 0 && (
        <p className="productsadmin-noproductos">No hay más productos</p>
      )}
      {products.length === 0 && !loadingP && (
        <p className="productsadmin-noproductos">
          No hay productos disponibles
        </p>
      )}
    </main>
  );
}

export default ProductsPagination;
