import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiDolar } from "../../../../api/api";

function DolarCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ cambio: string }>();
  const nav = useNavigate()

  async function onSubmit(data: { cambio: string }) {
    try {
        await apiDolar.createCambio(data)
        nav("/admin/dolar")
    } catch (e) {
        console.log(e)
        alert("Error al crear el cambio")
    }
  }

  return (
    <main className="categorycreate-main">
      <form className="categorycreate-form" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="categorycreate-h3">Nuevo Cambio</h3>
        <label className="categorycreate-label" htmlFor="cambio">
          Cambio
        </label>
        <input
          className="categorycreate-input"
          id="cambio"
          type="number"
          {...register("cambio", { required: true })}
        />
        {errors && <span> {errors.root?.message} </span>}
        <button className="categorycreate-btn">Crear</button>
      </form>
    </main>
  );
}

export default DolarCreate;
