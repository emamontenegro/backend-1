// admin.js

const socket = io();

// Escuchar actualizaciones de productos
socket.on("updateProducts", (products) => {
  renderProducts(products);
});

// Renderizar lista
function renderProducts(products) {

  const container = document.getElementById("productList");

  container.innerHTML = `
    <div class="product-item product-header">
      <span>Producto</span>
      <span>Precio</span>
      <span>Stock</span>
      <span>Categoría</span>
      <span>Acción</span>
    </div>
  `;

  products.forEach(product => {

    const row = document.createElement("div");
    row.classList.add("product-item");

    row.innerHTML = `
      <span>${product.title}</span>
      <span>$${product.price}</span>
      <span>${product.stock}</span>
      <span>${product.category}</span>
      <span>
        <button class="delete-btn" data-id="${product.id}">
          Eliminar
        </button>
      </span>
    `;

    container.appendChild(row);
  });
}

// Agregar nuevo producto
const form = document.getElementById("addProductForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    await fetch("/api/products", {
      method: "POST",
      body: formData
    });

    form.reset();
  });
}

// Eliminar producto
document.addEventListener("click", async (e) => {

  if (e.target.classList.contains("delete-btn")) {

    const id = e.target.dataset.id;

    await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

  }

});