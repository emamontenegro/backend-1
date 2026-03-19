
// admin.js

const socket = io();

let isFiltering = false;

// Escuchar actualizaciones de productos
socket.on("updateProducts", (products) => {
  if (isFiltering) return;
  renderProducts(products);
});

// Renderizar lista
const renderProducts = (products) => {

  const container = document.getElementById("productList");

  container.innerHTML = `
    <div class="product-item product-header">
      <span>Producto</span>
      <span>Descripción</span>
      <span>Código</span>
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
      <span class="editable" data-field="title" data-id="${product._id}">
        <span class="text">${product.title}</span>
        <input class="input hidden" type="text" value="${product.title}">
      </span>

      <span class="editable" data-field="description" data-id="${product._id}">
        <span class="text">${product.description}</span>
        <input class="input hidden" type="text" value="${product.description}">
      </span>

      <span class="editable" data-field="code" data-id="${product._id}">
        <span class="text">${product.code}</span>
        <input class="input hidden" type="text" value="${product.code}">
      </span>

      <span class="editable" data-field="price" data-id="${product._id}">
        <span class="text">$${product.price}</span>
        <input class="input hidden" type="number" value="${product.price}">
      </span>

      <span class="editable" data-field="stock" data-id="${product._id}">
        <span class="text">${product.stock}</span>
        <input class="input hidden" type="number" value="${product.stock}">
      </span>

      <span class="editable" data-field="category" data-id="${product._id}">
        <span class="text">${product.category}</span>
        <input class="input hidden" type="text" value="${product.category}">
      </span>

      <span>
        <button class="delete-btn" data-id="${product._id}">
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

    await fetch("/api/products", { method: "POST", body: formData });

    form.reset();
  });
}

// Buscar productos
const searchProductsAdmin = async () => {

  try {
    const value = document.getElementById("searchAdmin").value;

    if (!value) {
      isFiltering = false;
      return;
    }

    isFiltering = true;

    const query = new URLSearchParams();
    query.append("title", value);

    const res = await fetch(`/api/products/filter?${query}`);

    if (!res.ok) throw new Error();

    const data = await res.json();

    renderProducts(data.data);

  } catch (error) {
    console.error(error);
    showToast("Error al buscar", "error");
  }
};

document.getElementById("searchAdmin").addEventListener("input", searchProductsAdmin);

// Resetear filtros
document.getElementById("resetAdminBtn").addEventListener("click", async () => {

  isFiltering = false;

  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    renderProducts(data.payload);

    document.getElementById("searchAdmin").value = "";

  } catch (error) {
    console.error(error);
    showToast("Error al resetear", "error");
  }
});

// Eliminar producto
document.addEventListener("click", async (e) => {

  if (e.target.classList.contains("delete-btn")) {

    const id = e.target.dataset.id;

    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "No se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      showToast("Producto eliminado");
    }
  }
});

// Activar edición
let editing = null;

document.addEventListener("click", (e) => {

  const editable = e.target.closest(".editable");

  // Si no se hizo click en un elemento editable, salir
  if (!editable) {
    if (editing) {
      const text = editing.querySelector(".text");
      const input = editing.querySelector(".input");

      input.classList.add("hidden");
      text.classList.remove("hidden");
      editing = null;
    }
    return;
  }

  // Si se hizo click en un nuevo elemento editable, mostrar input
  if (editing && editing !== editable) {
    const text = editing.querySelector(".text");
    const input = editing.querySelector(".input");

    input.classList.add("hidden");
    text.classList.remove("hidden");
  }

  const text = editable.querySelector(".text");
  const input = editable.querySelector(".input");

  text.classList.add("hidden");
  input.classList.remove("hidden");

  input.focus();

  editing = editable;
});

// Enter guarda cambios
document.addEventListener("keydown", async (e) => {

  if (!e.target.classList.contains("input")) return;
  if (e.key === "Enter") {

    const input = e.target;
    const container = input.closest(".editable");
    const text = container.querySelector(".text");

    const id = container.dataset.id;
    const field = container.dataset.field;

    let value = input.value;

    try {
      if (!value || value.trim() === "") {
        showToast("Campo vacío", "error");
        return;
      }

      if ((field === "price" || field === "stock") && isNaN(value)) {
        showToast("Número inválido", "error");
        return;
      }

      if (field === "price" || field === "stock") {
        value = Number(value);
      }

      if (field === "code") {
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          showToast("El código solo puede tener letras y números", "error");
          return;
        }
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });

      const data = await response.json();

      if (data.status === "error") {
        showToast(data.message, "error");
        return;
      }

      text.textContent = field === "price" ? `$${value}` : value;

      input.classList.add("hidden");
      text.classList.remove("hidden");

      container.classList.add("updated");
      setTimeout(() => container.classList.remove("updated"), 800);

      editing = null;

      showToast("Actualizado");

    } catch (error) {
      console.error(error);
      showToast("Error al actualizar", "error");
    }
  }
});

// Escape cancela edición
document.addEventListener("keydown", (e) => {

  if (!e.target.classList.contains("input")) return;

  if (e.key === "Escape") {

    const input = e.target;
    const container = input.closest(".editable");
    const text = container.querySelector(".text");

    input.value = text.textContent.replace("$", "");

    input.classList.add("hidden");
    text.classList.remove("hidden");

    editing = null;
  }
});

// Función para mostrar toast notifications
const showToast = (message, type = "success") => {

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}