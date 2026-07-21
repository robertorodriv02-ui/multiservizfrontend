import { useForm } from "react-hook-form";
import "./register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, } from "../../../auth/services/authService";

interface FormData {
  user_name: string;
  password: string;
}

function Register() {
  const { register, handleSubmit } = useForm<FormData>();
  const [errors, setErrors] = useState<string>();
  const nav = useNavigate();

  async function onSubmit(data: FormData) {
    try {
      const registered = await registerUser(data);
      if (typeof registered == "boolean") {
        nav("/login");
      } else if (typeof registered == "string") {
        setErrors(registered);
      }
    } catch {
      setErrors("Error al iniciar sesión");
    }
  }

  return (
    <>
      <main className="login-main">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="login-h1">Crear Cuenta</h1>

          {errors && <div className="login-errors"> {errors} </div>}

          <section className="login-section login-usuario">
            <label htmlFor="user_name" className="login-label">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="user_name"
              className="login-input"
              {...register("user_name")}
            />
          </section>

          <section className="login-section login-password">
            <label htmlFor="password" className="login-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="login-input"
              {...register("password")}
            />
          </section>

          <div className="login-btncontent">
            <button className="login-btn">Registrarse</button>
          </div>

          {/* <section className="info">
                <p>Sin cuenta? <a href="#">Regístrate</a></p> 
            </section> */}
        </form>
      </main>
    </>
  );
}

export default Register;
