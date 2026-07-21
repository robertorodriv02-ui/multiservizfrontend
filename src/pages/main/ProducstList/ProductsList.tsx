import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Category,
  Dolar,
  Product,
  ProductResponse,
} from "../../../types/types";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchProducts from "../../../common/admin/searchProducts/SearchProducts";
import { useApiGet } from "../../../logic/admin/useApiGet";
import Grid from "../../../common/main/grid/GridMain";
import "./productslist.css";
import Header from "../../../common/main/header/Header";
import Hero from "../../../common/main/hero/Hero";

type Monedas = "USD" | "CUP";

function ProductsList() {
  const { response } = useApiGet<Category[]>("categories");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(`${baseUrl}/products`);
  const [loading, setLoading] = useState<boolean>(true);
  // Ref para evitar cargas duplicadas
  const isLoadingRef = useRef<boolean>(false);
  const { changeFromApi } = useApiGet<Dolar[]>("dolar");
  const [cambio, setCambio] = useState<number | null>(null);
  // 1. Función para cargar productos (memoizada)
  const getProductosPages = useCallback(async () => {
    // Evitar cargas simultáneas
    if (isLoadingRef.current || !nextUrl) return;

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const resp = await axios.get<ProductResponse>(nextUrl);
      setProducts((prev) => [...prev, ...resp.data.result]);
      setNextUrl(resp.data.next);
    } catch (e) {
      console.error("Error al cargar:", e);
    } finally {
      setLoading(false);
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
      <Header />
      <Hero />
      <section className="productsadmin-searchandmore">
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
        {response &&
          response.map(
            (category) =>
              category.products > 0 && (
                <Link
                  className="productsadmin-category"
                  key={category.id}
                  to={`/category/${category.id}`}
                  onClick={() => getProductosPages}
                >
                  {category.name}
                </Link>
              )
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
      <Grid productos={products} cambio={cambio} />

      {/* Sentinel: elemento que activa la carga */}
      <div ref={sentinelRef} style={{ height: "20px" }} />

      {/* Estado de carga */}
      {loading && (
        <div className="loader-container">
          <div className="spinner" />
          <p className="productsadmin-loading">Cargando...</p>
        </div>
      )}
      {!nextUrl && products.length > 0 && (
        <p className="productsadmin-noproductos">No hay más productos</p>
      )}
      {products.length === 0 && !loading && (
        <p className="productsadmin-noproductos">
          No hay productos disponibles
        </p>
      )}
    </main>
  );
}

export default ProductsList;
