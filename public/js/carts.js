const cartId = localStorage.getItem("cartId");

const loadCart = async () => {
 
  try {

    if (!cartId) {
      console.warn("No hay carrito");
      return;
    }

    const res = await fetch(`/api/carts/${cartId}`);

    if (!res.ok) throw new Error("Error obteniendo carrito");

    const data = await res.json();

    const container = document.getElementById("cart-container");
    const totalContainer = document.getElementById("cart-total");

    container.innerHTML = "";

    let total = 0;

    data.data.products.forEach(item => {

      const product = item.product;

      if (!product) return;

      total += product.price * item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <h3 class="cart-item-title">${product.title}</h3>
        <p class="cart-item-price">Precio: $${product.price}</p>
        <p class="cart-item-quantity">Cantidad: ${item.quantity}</p>

        <button class="delete-btn" data-id="${product._id}">
          Eliminar
        </button>
      `;

      container.appendChild(div);
    });

    totalContainer.innerHTML = `<h4 class="cart-total">Total: $${total}</h4>`;

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cargar el carrito",
      background: "#1e1e2a",
      color: "#fff"
    });
  }
};



// eliminar producto
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {

    const pid = e.target.dataset.id;

    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Se quitará del carrito",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1e1e2a",
      color: "#fff"
    });

    if (!result.isConfirmed) return;

    try {

      const res = await fetch(`/api/carts/${cartId}/products/${pid}`, { method: "DELETE" });

      if (!res.ok) throw new Error();

      await loadCart();

      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        showConfirmButton: false,
        timer: 1200,
        background: "#1e1e2a",
        color: "#fff"
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el producto",
        background: "#1e1e2a",
        color: "#fff"
      });
    }
  }
});

loadCart();