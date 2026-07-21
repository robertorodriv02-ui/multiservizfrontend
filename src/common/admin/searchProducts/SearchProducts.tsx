import { useForm } from "react-hook-form";
import type { Product } from "../../../types/types";
import "./searchproducts.css";
import { apiProducts } from "../../../api/api";
import SearchSvg from "../../../svg/SearchSvg";

interface Props {
  sendData: (products: Product[] | null) => void;
}

function SearchProducts({ sendData }: Props) {
  const { register, handleSubmit } = useForm<{ search: string }>();

  async function onSubmit(query: { search: string }) {
    try {
      const resp = await apiProducts.searchProducts(query.search);
      if (resp.data) {
        sendData(resp.data.results);
      }
    } catch (e) {
      sendData(null);
      console.log(e);
    }
  }

  return (
    <main>
      <form className="searchproducts-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          id="search"
          placeholder="Buscar productos"
          {...register("search")}
        />
        <button>
          <SearchSvg />
        </button>
      </form>
    </main>
  );
}

export default SearchProducts;
