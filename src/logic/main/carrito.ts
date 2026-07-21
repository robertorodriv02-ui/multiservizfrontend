import toast from "react-hot-toast";
import type { Product } from "../../types/types";

const carKey = "carrito";

export function getCar(): Product[] {
  const carrito = localStorage.getItem(carKey);
  return carrito ? JSON.parse(carrito) : [];
}

export function addProduct(producto: Product, amount: number) {
  const carrito = getCar();
  const productoExiste = carrito.find((p) => p.id === producto.id);

  if (productoExiste) {
    if (amount < 0) {
      productoExiste.amount += amount;
    } else {
      const newCantidad = productoExiste.amount + amount;
      productoExiste.amount = newCantidad;
    }
  } else {
    carrito.push({ ...producto });
    localStorage.setItem(carKey, JSON.stringify(carrito));

    toast.success("Producto añadido al carrito");
  }

  localStorage.setItem(carKey, JSON.stringify(carrito))
}

export function deleteProducto(id: number) {
  const carrito = getCar().filter((item) => item.id !== id);
  localStorage.setItem(carKey, JSON.stringify(carrito));
}

export function TotalPedido() {
  const carrito = getCar();
  return carrito.reduce(
    (total, producto) => total + producto.price * producto.amount,
    0
  );
}

export function clearCar() {
  localStorage.setItem(carKey, JSON.stringify([]))
}
