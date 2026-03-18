# 🛒 E-Commerce Backend + Frontend (Curso de Backend)

Proyecto full-stack de ejemplo para una tienda online (productos + carrito) con **backend en Node/Express** y **frontend sencillo usando Handlebars + Vanilla JS**.

## 📌 Tabla de contenido

- [Descripción](#descripción)
- [Instalación](#instalación)
  - [Dependencias](#dependencias)
  - [Variables de entorno](#variables-de-entorno)
  - [Comandos](#comandos)
- [Uso](#uso)
  - [Ejecutar el proyecto](#ejecutar-el-proyecto)
  - [Endpoints del backend (API REST)](#endpoints-del-backend-api-rest)
  - [Interacción con el frontend](#interacción-con-el-frontend)
- [Funcionalidades / Features](#funcionalidades--features)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura de datos (Schemas MongoDB)](#estructura-de-datos-schemas-mongodb)
- [Diagrama de flujo (ASCII)](#diagrama-de-flujo-ascii)
- [Roadmap de mejoras](#roadmap-de-mejoras)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 📝 Descripción

Este proyecto es una tienda online didáctica que incluye:

- API REST (productos + carrito) con **Express + MongoDB (Mongoose)**.
- Frontend renderizado con **Handlebars** y **JavaScript cliente**.
- Funcionalidad en tiempo real usando **Socket.IO** (actualiza la lista de productos sin recargar la página).
- Subida de imágenes de producto usando **Multer**.

---

## ⚙️ Instalación

### Dependencias

Todo el proyecto se ejecuta desde un único repositorio (backend + frontend). Para instalar dependencias:

```bash
npm install
```

### Variables de entorno

Copia la plantilla y configura tu conexión a MongoDB:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
PORT=8080
MONGO_URI=<TU_URI_DE_MONGODB>
```

### Comandos

| Comando | Descripción |
| ------- | ----------- |
| `npm run dev` | Inicia el servidor en modo desarrollo (recomendado) |
| `npm start` | Inicia el servidor en modo producción |
| `node src/scripts/seed.products.js` | Carga productos de ejemplo en la base de datos |

---

## 🚀 Uso

### Ejecutar el proyecto completo

1. Inicia MongoDB (Atlas o local).
2. Ejecuta el servidor:

```bash
npm run dev
```

3. Abre en el navegador:

- `http://localhost:8080/` → Panel principal (agregar / eliminar productos).
- `http://localhost:8080/products` → Listado paginado + filtros.
- `http://localhost:8080/realtimeproducts` → Lista en tiempo real.
- `http://localhost:8080/carts` → Carrito de compras.

---

## 🧩 Endpoints del backend (API REST)

### Productos

#### `GET /api/products`
Obtiene productos paginados con filtros.

**Query params:**
- `limit` (número) — cantidad por página.
- `page` (número) — página actual.
- `sort` (`asc`|`desc`) — orden por precio.
- `query` (texto) — busca en `title` o `category`.
- `minPrice` (número) — precio mínimo.
- `maxPrice` (número) — precio máximo.

**Ejemplo request:**

```http
GET /api/products?limit=5&page=1&sort=asc&query=smartphones
```

**Ejemplo response:**

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "642...",
      "title": "iPhone 14",
      "price": 1099000,
      "category": "smartphones"
    }
  ],
  "totalPages": 5,
  "page": 1,
  "hasNextPage": true,
  "nextPage": 2
}
```

---

#### `GET /api/products/filter`
Filtra productos por campos específicos.

**Query params:**
- `title` (texto) — busca en título y categoría.
- `category` (texto) — filtra por categoría exacta.
- `minPrice`, `maxPrice` (números)
- `code` (texto)

**Ejemplo request:**

```http
GET /api/products/filter?title=iphone&minPrice=500000
```

**Ejemplo response:**

```json
{
  "status": "success",
  "data": [
    {
      "_id": "642...",
      "title": "iPhone 14",
      "price": 1099000
    }
  ]
}
```

---

#### `GET /api/products/:id`
Retorna un producto por ID.

**Ejemplo request:**

```http
GET /api/products/642...
```

**Ejemplo response:**

```json
{
  "status": "success",
  "data": {
    "_id": "642...",
    "title": "iPhone 14",
    "price": 1099000,
    "stock": 22,
    "category": "smartphones"
  }
}
```

---

#### `POST /api/products`
Crea un producto nuevo.

**Tipo de request:** `multipart/form-data`

**Campos esperados:**
- `title` (string)
- `description` (string)
- `price` (number)
- `code` (string, único)
- `stock` (number)
- `category` (string)
- `thumbnail` (archivo de imagen)

**Ejemplo curl:**

```bash
curl -X POST http://localhost:8080/api/products \
  -F "title=Test" \
  -F "description=Desc" \
  -F "price=123" \
  -F "code=TEST123" \
  -F "stock=10" \
  -F "category=test" \
  -F "thumbnail=@/ruta/a/imagen.jpg"
```

**Ejemplo response:**

```json
{
  "status": "success",
  "data": {
    "_id": "642...",
    "title": "Test",
    "thumbnail": "/uploads/thumbnail-...jpg"
  }
}
```

---

#### `PUT /api/products/:id`
Actualiza un producto existente.

**Ejemplo request:**

```http
PUT /api/products/642... 
Content-Type: application/json

{ "price": 1200000 }
```

**Ejemplo response:**

```json
{
  "status": "success",
  "data": {
    "_id": "642...",
    "price": 1200000
  }
}
```

---

#### `DELETE /api/products/:id`
Elimina un producto.

**Ejemplo request:**

```http
DELETE /api/products/642...
```

**Ejemplo response:**

```json
{
  "status": "success",
  "message": "Product deleted"
}
```

---

### Carrito

#### `POST /api/carts`
Crea un carrito nuevo.

**Ejemplo response:**

```json
{
  "status": "success",
  "data": { "_id": "642...", "products": [] }
}
```

---

#### `GET /api/carts/:cid`
Obtiene un carrito por su ID (incluye productos con datos completos).

**Ejemplo response:**

```json
{
  "status": "success",
  "data": {
    "_id": "642...",
    "products": [
      {
        "product": {
          "_id": "642...",
          "title": "iPhone 14",
          "price": 1099000
        },
        "quantity": 1
      }
    ]
  }
}
```

---

#### `POST /api/carts/:cid/product/:pid`
Agrega un producto al carrito (incrementa cantidad si ya existe).

**Ejemplo curl:**

```bash
curl -X POST http://localhost:8080/api/carts/642.../product/642...
```

---

#### `DELETE /api/carts/:cid/products/:pid`
Elimina un producto del carrito.

**Ejemplo curl:**

```bash
curl -X DELETE http://localhost:8080/api/carts/642.../products/642...
```

---

#### `PUT /api/carts/:cid/products/:pid`
Actualiza la cantidad de un producto en el carrito.

**Body (JSON):**

```json
{ "quantity": 3 }
```

**Ejemplo curl:**

```bash
curl -X PUT http://localhost:8080/api/carts/642.../products/642... \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

---

#### `DELETE /api/carts/:cid`
Vacía el carrito (elimina todos los productos).

**Ejemplo curl:**

```bash
curl -X DELETE http://localhost:8080/api/carts/642...
```

---

## 🖥️ Interacción con el frontend

El frontend está implementado con **Handlebars** y **JavaScript en el cliente** (archivos en `public/js/`).

### Páginas principales

- **Home** (`/`) – Formulario para agregar productos y listado con botones de eliminación.
- **Productos** (`/products`) – Ver productos con filtros (texto, precio, orden) y paginación.
- **Productos en tiempo real** (`/realtimeproducts`) – Elimina productos y actualiza la lista automáticamente con Socket.IO.
- **Carrito** (`/carts`) – Muestra el carrito actual (se guarda `cartId` en `localStorage`), permite eliminar ítems y vaciar el carrito.

### Flujo básico de frontend

1. Usuario carga `products.js` o `realtimeProducts.js`.
2. El JS realiza peticiones a `/api/products` para obtener datos.
3. El backend responde JSON y el cliente renderiza en HTML.
4. Al agregar/eliminar productos se usan endpoints de la API (`/api/products`, `/api/carts/...`).

---

## ✅ Funcionalidades / Features

- **CRUD de productos** (crear / leer / actualizar / eliminar).
- **Paginación y filtros** en listado de productos.
- **Subida de imagen** de producto con Multer (almacena en `public/uploads`).
- **Carrito persistente** (MongoDB) con:
  - Agregar producto (incrementa cantidad si ya está).
  - Eliminar producto.
  - Actualizar cantidad.
  - Vaciar carrito.
- **Sincronización en tiempo real** de la lista de productos con Socket.IO.
- **Front-end básico** con Handlebars + Vanilla JS.

---

## 🛠 Tecnologías utilizadas

### Backend

- Node.js (ESModules)
- Express
- MongoDB (Atlas/local)
- Mongoose
- Socket.IO
- Multer (uploads)
- mongoose-paginate-v2
- dotenv

### Frontend

- Handlebars (renderizado de vistas)
- Vanilla JavaScript (fetch API)

---

## � Estructura de datos (Schemas MongoDB)

### Schema de Producto (`Product`)

```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true, index: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String }, // Ruta de la imagen subida
  status: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }
}
```

- **Campos clave:** `code` es único e indexado para búsquedas rápidas.
- **Thumbnail:** Almacena la ruta relativa del archivo subido (ej. `/uploads/thumbnail-...jpg`).

### Schema de Carrito (`Cart`)

```javascript
{
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}
```

- **Relación:** Usa referencias (`ObjectId`) a productos para evitar duplicación de datos.
- **Populate:** Al consultar, se puede poblar con datos completos del producto.

---

## �🔄 Diagrama de flujo (ASCII)

### 1) Flujo general (frontend → backend → base de datos)

```
[Usuario] 
   │
   │  (1) Navega a /products (GET)
   ▼
[Servidor Express] ──> renderiza Handlebars (vistas)  
   │
   │  (2) JS en cliente hace fetch a /api/products
   ▼
[API REST] (productos) 
   │
   │  (3) Consulta MongoDB (Mongoose)
   ▼
[MongoDB] ←─ responde datos ──
```

### 2) Flujo realtime (Socket.IO)

```
[Cliente] -- (socket connect) --> [Servidor]
[Cliente] -- (DELETE /api/products/:id) --> [Servidor]
[Servidor] -- (emite "updateProducts") --> [Todos los clientes conectados]
[Cliente] -- (recibe updateProducts) --> actualiza UI
```

---

## 🤝 Contribución

1. Haz fork del repositorio.
2. Crea una rama con tu mejora (`feature/mi-mejora`).
3. Realiza tus cambios y haz commit.
4. Envía un pull request describiendo los cambios.

Algunas ideas de mejora:

- Autenticación (login/roles) y protección de rutas.
- Permitir edición de productos desde la UI.
- Agregar tests unitarios / integración.
- Mejorar validaciones y manejo de errores.

---

## � Roadmap de mejoras

Este roadmap incluye mejoras sugeridas para practicar desarrollo colaborativo (GitHub Flow). Cada ítem puede ser un issue en GitHub.

### 🔐 Autenticación y Autorización
- **Issue #1:** Implementar sistema de login/registro con JWT.
- **Issue #2:** Agregar roles (admin/usuario) y proteger rutas (solo admin puede CRUD productos).
- **Issue #3:** Middleware para verificar tokens en rutas protegidas.

### 🖥️ Mejoras en Frontend
- **Issue #4:** Agregar formulario para editar productos desde la UI (usar PUT /api/products/:id).
- **Issue #5:** Mostrar imágenes de productos en las vistas (renderizar `thumbnail`).
- **Issue #6:** Mejorar diseño con CSS responsivo (mobile-friendly).

### 🧪 Testing y Calidad
- **Issue #7:** Agregar tests unitarios para rutas (usar Jest o Mocha).
- **Issue #8:** Tests de integración para API completa.
- **Issue #9:** Validaciones robustas con Joi o express-validator.

### 📊 Funcionalidades Avanzadas
- **Issue #10:** Agregar categorías dinámicas (CRUD de categorías).
- **Issue #11:** Historial de compras (órdenes) para usuarios.
- **Issue #12:** Notificaciones en tiempo real con Socket.IO (ej. stock bajo).

### 🚀 Despliegue y Producción
- **Issue #13:** Configurar despliegue en Heroku/Vercel/Render.
- **Issue #14:** Agregar logging con Winston.
- **Issue #15:** Optimizar performance (caching, índices en MongoDB).

---

## �📄 Licencia

Este proyecto está pensado para uso educativo. Puedes añadir la licencia que prefieras (por ejemplo MIT) o dejar este espacio en blanco.

---

© 2026

- Agregar tests unitarios/integración.

---

## 🤝 Contribuciones

¡Bienvenido! Si deseas mejorar el proyecto, abre un issue o contribuye con un PR. Algunas ideas:

- Crear UI para editar productos.
- Agregar autenticación (JWT + login).
- Añadir carritos temporales para usuarios anónimos.

---

## 📄 Licencia

Este proyecto no incluye licencia explícita (usa `ISC` por default en `package.json`).

---

© 2026
