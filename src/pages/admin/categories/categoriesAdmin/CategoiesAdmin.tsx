import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../../../auth/services/authService";
import NavAdmin from "../../../../common/admin/navAdmin/NavAdmin";
import "./categoriesadmin.css";
import { useApiGet } from "../../../../logic/admin/useApiGet";
import MoreSvg from "../../../../svg/MoreSvg";
import type { Category } from "../../../../types/types";
import { apiCategories } from "../../../../api/api";
import DeleteSvg from "../../../../svg/DeleteSvg";
import EditSvg from "../../../../svg/EditSvg";

function CategoiesAdmin() {
  const nav = useNavigate();
  const { response } = useApiGet<Category[]>("categories");
  const [categories, setCategories] = useState<Category[]>()

  useEffect(() => {
    isAuth().then((authenticated) => {
      if (!authenticated) nav("/login");
    });
  }, [nav]);

  useEffect(() => {
    setCategories(response)
  }, [response])

  async function deleCategory(id: number) {
    const comfirm = window.confirm(
      "Seguro q quieres eiminar esta categoría. Si eliminas una categoría se eliminan todos los productos que están en ella?"
    );
    if (comfirm) {
      try {
        await apiCategories.deleteCategory(id);
        if (categories) {
          setCategories((prevCategs) =>
            prevCategs
              ? prevCategs.filter((categ) => categ.id !== id)
              : prevCategs
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <main className="categoriesadmin-main">
      <h2>Categoies Admin</h2>
      <NavAdmin />
      <Link
        id="categoriesadmin-a"
        className="productsadmin-a"
        to={"/admin/categories/create"}
      >
        <div>Nueva categoría</div>
        <MoreSvg />
      </Link>
      <section className="categoriesadmin-categorysection">
        {categories &&
          categories.map((category) => (
            <main className="categorycard-main" key={category.id}>
              <p className="categorycard-p">{category.name}</p>
              <section className="categorycard-btnwrapper">
                <button
                  onClick={() => deleCategory(category.id)}
                  className="categoriesadmin-delete"
                >
                  <DeleteSvg />
                </button>
                <Link to={"#"} className="categoriesadmin-edit">
                  <EditSvg />
                </Link>
              </section>
            </main>
          ))}
      </section>
    </main>
  );
}

export default CategoiesAdmin;
