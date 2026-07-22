import { useForm } from "react-hook-form";
import { useApiGet } from "../../../../logic/admin/useApiGet";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuth } from "../../../../auth/services/authService";
import { apiProducts } from "../../../../api/api";
import type { Category, Product } from "../../../../types/types";

interface FormData {
  name: string;
  price: number;
  details?: string;
  image: FileList;
  category_id: number;
  available: boolean;
}

function ProductUpdate() {
  const { response, loading } = useApiGet<Category[]>("categories");
  const { register, handleSubmit, watch, reset } = useForm<FormData>();
  const nav = useNavigate();
  const file = watch("image");
  const preview = file?.[0] ? URL.createObjectURL(file[0]) : null;
  const { id } = useParams();
  const [updateProduct, setUpdateProduct] = useState<Product>();

  useEffect(() => {
    isAuth().then((authenticated) => {
      if (!authenticated) nav("/login");
    });
  }, [nav]);

  useEffect(() => {
    if (id) getProductData(+id);
  }, [id]);

  async function getProductData(id: number) {
    const resp = await apiProducts.getProduct(id);
    if (resp.data) {
      setUpdateProduct(resp.data);

      reset({
        name: resp.data.name,
        price: resp.data.price,
        details: resp.data.details,
        category_id: resp.data.category_id,
        available: resp.data.available,
      });
    }
  }

  async function onSubmit(data: FormData) {
    const idCategory = response?.[0].id as number;
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append(
        "category_id",
        data.category_id.toString() || idCategory.toString()
      );
      formData.append("details", data.details || "");

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      formData.append("available", data.available.toString());

      if (id) {
        const resp = await apiProducts.updateProduct(+id, formData);
        console.log(resp.data);
      } else {
        alert("El producto no existe");
      }
      nav("/admin/products");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <main className="productcreate-main">
      <form className="productcreate-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Actualizar Producto</h2>
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

        <div className="productcreate-imagepreview">
          {preview ? (
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
          ) : (
            updateProduct?.image && (
              <img
                src={updateProduct.image}
                alt={updateProduct?.name}
                style={{
                  maxWidth: "200px",
                  width: "100%",
                  borderRadius: "10px",
                  marginTop: "5px",
                }}
              />
            )
          )}
        </div>

        <section>
          <label htmlFor="available" className="productcreate-label">
            Disponibilidad
          </label>
          <input
            type="checkbox"
            className="productupdate-disponinput"
            id="available"
            {...register("available")}
          />
        </section>

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
              <option
                className="productcreate-option"
                key={0}
                value={updateProduct?.category_id}
              >
                {updateProduct?.category.name}
              </option>
              {response?.map(
                (categ) =>
                  categ.id !== updateProduct?.category_id && (
                    <option
                      className="productcreate-option"
                      key={categ.id}
                      value={categ.id}
                    >
                      {categ.name}
                    </option>
                  )
              )}
            </select>
          )}
        </section>

        <button className="productcreate-send">Actualizar</button>
      </form>
    </main>
  );
}

export default ProductUpdate;
