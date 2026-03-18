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
    console.error("Error cargando carrito:", error);
  }
};



// eliminar producto
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {

    try {
      const pid = e.target.dataset.id;

      const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Error eliminando producto");

      loadCart();

    } catch (error) {
      console.error("Error eliminando:", error);
    }
  }
});



// vaciar carrito
document.getElementById("clearCartBtn").addEventListener("click", async () => {

  try {
    const res = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Error vaciando carrito");

    loadCart();

  } catch (error) {
    console.error("Error vaciando carrito:", error);
  }
});

loadCart();