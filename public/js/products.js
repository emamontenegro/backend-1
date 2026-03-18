let page = 1;
let limit = 10;
let CART_ID = null;

// init carrito si no existe, crear uno nuevo
const initCart = async () => {

  CART_ID = localStorage.getItem("cartId");

  if (!CART_ID) {
    try {
      const res = await fetch("/api/carts", { method: "POST" });
      const data = await res.json();

      CART_ID = data.data._id;

      localStorage.setItem("cartId", CART_ID);

      console.log("🛒 Nuevo carrito:", CART_ID);

    } catch (error) {
      console.error("Error creando carrito:", error);
    }
  }
};

// validar carrito (si no existe en backend, eliminar localStorage)
const validateCart = async () => {
  try {
    const res = await fetch(`/api/carts/${CART_ID}`);
    if (!res.ok) {
      throw new Error("Carrito inválido");
    }
  } catch (error) {
    localStorage.removeItem("cartId");
    await initCart();
  }
};

// carga productos con filtros y paginación
const loadProducts = async () => {

  try {

    const query = document.getElementById("searchQuery").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    const sort = document.getElementById("sortPrice").value;

    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (query) params.append("query", query);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sort) params.append("sort", sort);

    const res = await fetch(`/api/products?${params}`);
    if (!res.ok) throw new Error("Error en API");
    const data = await res.json();

    renderProducts(data.payload);

    document.getElementById("prevBtn").disabled = !data.hasPrevPage;
    document.getElementById("nextBtn").disabled = !data.hasNextPage;

    document.getElementById("pageInfo").innerText =
      `Página ${data.page} de ${data.totalPages}`;

  } catch (error) { console.error(error); alert("Error cargando productos");}
};

// render productos
const renderProducts = (products) => {

  const container = document.querySelector(".products-grid");
  container.innerHTML = "";

  products.forEach(product => {

    const div = document.createElement("div");
    div.classList.add("product-card");

    div.innerHTML = `
      <h3 class="product-title">${product.title}</h3>
      <p class="product-description">${product.description}</p>
      <p class="product-price">$${product.price}</p>
      <p class="product-category">Categoría: ${product.category}</p>
      <button class="add-to-cart-btn" data-id="${product._id}">
        Agregar al carrito
      </button>
    `;

    container.appendChild(div);
  });
};

// agregar producto al carrito
document.addEventListener("click", async (e) => {

  if (e.target.classList.contains("add-to-cart-btn")) {

    const pid = e.target.dataset.id;

    try {
      const res = await fetch(`/api/carts/${CART_ID}/product/${pid}`, { method: "POST" });

      if (!res.ok) throw new Error();

      alert("Producto agregado 🛒");

    } catch (error) { console.error(error); alert("Error agregando producto");}
  }
});

// filtros
document.getElementById("searchQuery").addEventListener("input", () => {
  page = 1;
  loadProducts();
});

document.getElementById("minPrice").addEventListener("input", () => {
  page = 1;
  loadProducts();
});

document.getElementById("maxPrice").addEventListener("input", () => {
  page = 1;
  loadProducts();
});

document.getElementById("sortPrice").addEventListener("change", () => {
  page = 1;
  loadProducts();
});

// paginación
document.getElementById("prevBtn").addEventListener("click", () => {
  page--;
  loadProducts();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  page++;
  loadProducts();
});

// reset filtros
document.getElementById("resetBtn").addEventListener("click", () => {

  document.getElementById("searchQuery").value = "";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("sortPrice").value = "";

  page = 1;
  loadProducts();
});

// init
const init = async () => {
  await initCart();
  await validateCart();
  loadProducts();
};

init();