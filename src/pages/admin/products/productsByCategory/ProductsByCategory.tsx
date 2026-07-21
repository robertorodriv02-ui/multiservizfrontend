import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {
  Category,
  Product,
  ProductsByCategory as PBCType,
  Dolar,
} from "../../../../types/types";
import axios from "axios";
import { apiProducts } from "../../../../api/api";
import NavAdmin from "../../../../common/admin/navAdmin/NavAdmin";
import MoreSvg from "../../../../svg/MoreSvg";
import SearchProducts from "../../../../common/admin/searchProducts/SearchProducts";
import { useApiGet } from "../../../../logic/admin/useApiGet";
import Grid from "../../../../common/admin/gridAdmin/Grid";

type Monedas = "USD" | "CUP";

function ProductsByCategory() {
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
        <Link className="productsadmin-category" to={"/admin/products"}>
          Todos
        </Link>
        {response &&
          response.map((category) => (
            <Link
              className={
                category.id === sendedCategory?.id
                  ? "productsadmin-category isActive"
                  : "productsadmin-category"
              }
              key={category.id}
              to={`/admin/products/category/${category.id}`}
            >
              {category.name}
            </Link>
          ))}
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
      <Grid
        productos={products}
        cambio={cambio}
        toggleAvailability={toggleAvailability}
        deleteProduct={deleProduct}
      />

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

export default ProductsByCategory;
