import type { Pedido } from "../../types/types";
import { getCar, TotalPedido } from "./carrito";

export function preparewhatsapp(data: Pedido) {
  const carrito = getCar();

  if (carrito.length < 1) {
    return;
  }

  let msg = "*Nuevo Pedido:*\n\n";
  const total = TotalPedido();

  carrito.forEach((item) => {
    msg += `*-Producto: ${item.name}*\n *-Cantidad: ${item.amount} unidades.*\n\n`;
  });

   msg += `*Enviar producto a:* \n *-Nombre: ${data.nombre}* \n *-Teléfono: ${data.telefono}* \n *-Dirección: ${data.direccion}* \n *-Información relevante: ${data.otro}* \n\n *Total a pagar: $ ${total}* `

   const clientPhone = "5356563783"

   return `https://wa.me/${clientPhone}?text=${encodeURIComponent(msg)}`
}
