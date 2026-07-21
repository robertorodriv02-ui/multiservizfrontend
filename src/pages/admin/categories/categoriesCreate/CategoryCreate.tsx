import { useForm } from "react-hook-form";
import "./categorycreate.css"
import { apiCategories } from "../../../../api/api";
import { useNavigate } from "react-router-dom";

function CategoryCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{name: string}>();
  const nav = useNavigate()

  async function onSubmit(data: {name: string}) {
    try {
      await apiCategories.createCategory(data)
      nav("/admin/categories")
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <main className="categorycreate-main">
      <form className="categorycreate-form" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="categorycreate-h3">Nueva Categoría</h3>
        <label className="categorycreate-label" htmlFor="name">Nombre</label>
        <input className="categorycreate-input" id="name" type="text" {...register("name", {required: true})} />
        {errors && <span> {errors.root?.message} </span>}
        <button className="categorycreate-btn">Crear</button>
      </form>
    </main>
  );
}

export default CategoryCreate;
