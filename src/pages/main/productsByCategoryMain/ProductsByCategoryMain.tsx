import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {
  Category,
  Product,
  ProductsByCategory as PBCType,
  Dolar,
} from "../../../types/types";
import axios from "axios";
import SearchProducts from "../../../common/admin/searchProducts/SearchProducts";
import { useApiGet } from "../../../logic/admin/useApiGet";
import Grid from "../../../common/main/grid/GridMain";
import Header from "../../../common/main/header/Header";
import Hero from "../../../common/main/hero/Hero";

type Monedas = "USD" | "CUP";

function ProductsByCategoryMain() {
  const { id } = useParams();
  const { response } = useApiGet<Category[]>("categories");
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [sendedCategory, setSendedCategory] = useState<Category>();
  const [products, setProducts] = useState<Product[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);
  const { changeFromApi } = useApiGet<Dolar[]>("dolar");
  const [cambio, setCambio] = useState<number | null>(null);

  const getProducts = useCallback(async () => {
    if (isLoadingRef.current || !nextUrl) return;

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const resp = await axios.get<PBCType>(nextUrl);
      setProducts((prev) => [...prev, ...resp.data.result]);
      setSendedCategory(resp.data.category);
      setNextUrl(resp.data.next);
    } catch (e) {
      console.error("Error al cargar:", e);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [nextUrl]);

  useEffect(() => {
    isLoadingRef.current = false;
    setProducts([]);
    setSendedCategory(undefined);
    setNextUrl(`${baseUrl}/products/category/${id}`);
  }, [id, baseUrl]);

  useEffect(() => {
    if (nextUrl) {
      getProducts();
    }
  }, [nextUrl]);

  useEffect(() => {
    if (!nextUrl || isLoadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextUrl && !isLoadingRef.current) {
          getProducts();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;

    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
        observer.disconnect();
      }
    };
  }, [nextUrl, getProducts]);

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
        <Link className="productsadmin-category" to={"/"}>
          Todos
        </Link>
        {response &&
          response.map(
            (category) =>
              category.products > 0 && (
                <Link
                  className={
                    category.id === sendedCategory?.id
                      ? "productsadmin-category isActive"
                      : "productsadmin-category"
                  }
                  key={category.id}
                  to={`/category/${category.id}`}
                >
                  {category.name}
                </Link>
              )
          )}
      </section>
      <section className="productsadmin-h3-monedas">
        <h3> {sendedCategory?.name} </h3>
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

      <div ref={sentinelRef} style={{ height: "20px" }} />

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

export default ProductsByCategoryMain;
