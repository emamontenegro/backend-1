// realtimeProducts.js

const socket = io();

socket.on("updateProducts", products => {

  const container = document.querySelector(".products-grid");

  container.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>$${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <p>Categoría: ${product.category}</p>
      <button class="delete-btn" data-id="${product.id}">
        Eliminar Producto
      </button>`;

    container.appendChild(card);
  });
});

// Eliminar producto

document.addEventListener("click", async (e) => {

  if (e.target.classList.contains("delete-btn")) {

    const id = e.target.dataset.id;

    await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

  }

});