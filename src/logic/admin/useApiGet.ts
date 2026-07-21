import { useEffect, useState } from "react";
import type { Endpoint } from "../../types/types";
import { apiCategories, apiDolar } from "../../api/api";

export function useApiGet<T>(request: Endpoint) {
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [response, setResponse] = useState<T>();
  const [changeFromApi, setChangeFromApi] = useState<T>();

  useEffect(() => {
    async function getApiResponse() {
      try {
        if (request === "categories") {
          const resp = await apiCategories.getCategories();
          setResponse(resp.data as T);
        }

        if (request === "dolar") {
          const resp = await apiDolar.getCambios();
          setChangeFromApi(resp.data as T);
        }
      } catch (e) {
        console.log(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    getApiResponse();
  }, [request]);

  return { response, changeFromApi, loading, notFound };
}
