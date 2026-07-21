import { Link } from "react-router-dom";
import AngelLogo from "../../../svg/AngelLogo";
import CarSvg from "../../../svg/CarSvg";
import HomeSvg from "../../../svg/HomeSvg";
import "./header.css";
import { useEffect, useState } from "react";
import { isAuth } from "../../../auth/services/authService";

function Header() {
  const [auth, setAuth] = useState<boolean>()

  useEffect(() => {
      isAuth().then(authenticated => {
        if (authenticated) {
          setAuth(true)
        } else {
          setAuth(false)
        }
      })
    }, [])

  return (
    <main className="header-main">
      <section className="header-title">
        <div className="header-logo">
          <AngelLogo />
        </div>
        <h3>MultiServi<span>.Z</span></h3>
      </section>

      <section className="header-btns">
        <Link to={auth ? "/admin" : "/"} className="header-HomeBtn">
          <HomeSvg />
          <p> {auth ? "Admin" : "Inicio"} </p>
        </Link>
        <Link to={"/carrito"} className="header-carBtn">
          <CarSvg />
        </Link>
      </section>
    </main>
  );
}

export default Header;
