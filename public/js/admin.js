// admin.js
const socket = io();

socket.on("updateProducts", products => {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(product => {
    const li = document.createElement("li");
    li.textContent = `${product.title} - $${product.price}`;
    list.appendChild(li);
  });
});

// Agregar nuevo producto desde el formulario
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