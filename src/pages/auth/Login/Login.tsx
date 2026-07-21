import { useForm } from "react-hook-form";
import "./login.css";
import { isAuth, login } from "../../../auth/services/authService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


interface FormData {
  user_name: string,
  password: string
}

function Login() {
  const {register, handleSubmit} = useForm<FormData>()
  const [errors, setErrors] = useState<string>()
  const nav = useNavigate()

  useEffect(() => {
    isAuth().then(authenticated => {
      if (authenticated)  nav("/admin")
    })
  }, [nav])

  async function onSubmit(data: FormData) {
    try {
      const loged = await login(data)
      if (typeof(loged) == "boolean") {
        nav("/admin")
      } else if (typeof(loged) == "string") {
        setErrors(loged)
      }
    } catch {
      setErrors("Error al iniciar sesión")
    }
  }

  return (
    <>
      <main className="login-main">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="login-h1">Iniciar Sesión</h1>

          {errors && <div className="login-errors"> {errors} </div>}

          <section className="login-section login-usuario">
            <label htmlFor="user_name" className="login-label">Nombre de Usuario</label>
            <input type="text" id="user_name" className="login-input" {...register("user_name")} />
          </section>

          <section className="login-section login-password">
            <label htmlFor="password" className="login-label">Contraseña</label>
            <input type="password" id="password" className="login-input" {...register("password")} />
          </section>

          <div className="login-btncontent">
            <button className="login-btn">Iniciar Sesión</button>
          </div>

          {/* <section className="info">
                <p>Sin cuenta? <a href="#">Regístrate</a></p> 
            </section> */}
        </form>
      </main>
    </>
  );
}

export default Login;
