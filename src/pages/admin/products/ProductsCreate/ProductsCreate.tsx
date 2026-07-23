import { useApiGet } from "../../../../logic/admin/useApiGet";
import { useForm } from "react-hook-form";
import "./productcreate.css";
//import { apiProducts } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuth } from "../../../../auth/services/authService";
import type { Category } from "../../../../types/types";

interface FormData {
  name: string;
  price: number;
  details?: string;
  image: FileList;
  category_id: number;
}

function ProductsCreate() {
  const { response, loading } = useApiGet<Category[]>("categories");
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [sending, setSending] = useState<boolean>(false);
  const nav = useNavigate();
  const file = watch("image");
  const preview = file?.[0] ? URL.createObjectURL(file[0]) : null;
  const baseUrl = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    isAuth().then((authenticated) => {
      if (!authenticated) nav("/login");
    });
  }, [nav]);

  async function onSubmit(data: FormData) {
    const id = response?.[0].id as number;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append(
        "category_id",
        data.category_id.toString() || id.toString()
      );
      formData.append("details", data.details || "");
      formData.append("image", data.image[0]);

      console.log("Enviando...")
      //await apiProducts.createProduct(formData);
      const response = await fetch(`${baseUrl}/products`, {
        method: "POST",
        body: formData
      })
      console.log("Status: ", response.status)
      const resp = await response.json()
      console.log(resp)
      //nav("/admin/products");
    } catch (e) {
      console.log(e);
    }
    setSending(false);
  }

  return (
    <main className="productcreate-main">
      <form className="productcreate-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Crear Producto</h2>
        <label
          className="productcreate-img productcreate-input"
          htmlFor="image"
        >
          Imagen
        </label>
        <input
          type="file"
          id="image"
          className="productcreate-imginput"
          {...register("image")}
        />

        {preview && (
          <div className="productcreate-imagepreview">
            <img
              src={preview}
              alt="Vista previa"
              style={{
                maxWidth: "200px",
                width: "100%",
                borderRadius: "10px",
                marginTop: "5px",
              }}
            />
          </div>
        )}

        <label className="productcreate-label" htmlFor="name">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          className="productcreate-input"
          {...register("name")}
        />

        <label className="productcreate-label" htmlFor="price">
          Precio
        </label>
        <input
          type="number"
          id="price"
          className="productcreate-input"
          {...register("price")}
        />

        <label className="productcreate-label" htmlFor="details">
          Detalles
        </label>
        <textarea
          id="details"
          className="productcreate-input productcreate-details"
          {...register("details")}
        />

        <section className="productcreate-section">
          <label className="productcreate-label">Categoría</label>
          {loading ? (
            <p>Cargando categorías...</p>
          ) : (
            <select
              className="productcreate-select productcreate-input"
              id="category_id"
              {...register("category_id")}
            >
              {response?.map((categ) => (
                <option
                  className="productcreate-option"
                  key={categ.id}
                  value={categ.id}
                >
                  {categ.name}
                </option>
              ))}
            </select>
          )}
        </section>

        {!sending ? (
          <button className="productcreate-send">Crear</button>
        ) : (
          <p id="productcreate-sending" className="productcreate-send">
            Enviando...
          </p>
        )}
      </form>
    </main>
  );
}

export default ProductsCreate;
