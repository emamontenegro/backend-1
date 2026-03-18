import { debounce } from "./helpers/debounce.js";

// Archivo JavaScript para manejar la actualización en tiempo real de productos, eliminación y búsqueda

const socket = io();

let isFiltering = false;

socket.on("updateProducts", products => {
  if (isFiltering) return;
  renderProducts(products);
});

// Eliminar producto

document.addEventListener("click", async (e) => {

  if (e.target.classList.contains("delete-btn")) {

    try {
      const id = e.target.dataset.id;
      const res = await fetch(`/api/products/${id}`, { method: "DELETE"});

      if (!res.ok) throw new Error("Error eliminando producto");
      if (isFiltering) { searchProducts() };

    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  }
});

// Búsqueda de productos

const searchProducts = async () => {

  try {
    const title = document.getElementById("searchTitle").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;

    if (!title && !minPrice && !maxPrice) {
      isFiltering = false;
      return;
    }

    isFiltering = true;

    const query = new URLSearchParams();

    if (title) query.append("title", title);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);

    const res = await fetch(`/api/products/filter?${query}`);

    if (!res.ok) throw new Error("Error en la búsqueda");

    const data = await res.json();

    renderProducts(data.data);

  } catch (error) {
    console.error("Error buscando productos:", error);
  }
};

// Se agrega debounce para evitar demasiadas solicitudes al servidor mientras el usuario escribe
const searchProductsDebounced = debounce(searchProducts, 300);

document.getElementById("searchTitle").addEventListener("input", searchProductsDebounced);
document.getElementById("minPrice").addEventListener("input", searchProductsDebounced);
document.getElementById("maxPrice").addEventListener("input", searchProductsDebounced);

// Función para renderizar productos en la página

const renderProducts = (products) => {

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
      <button class="delete-btn" data-id="${product._id}">
        Eliminar Producto
      </button>
    `;

    container.appendChild(card);
  });
}

// Volver a mostrar todos los productos 

const resetBtn = async () => {

  isFiltering = false;

  try {
    const res = await fetch("/api/products");

    if (!res.ok) throw new Error("Error al cargar productos");
    const data = await res.json();
    renderProducts(data.payload);

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};

document.getElementById("resetBtn").addEventListener("click", resetBtn);
