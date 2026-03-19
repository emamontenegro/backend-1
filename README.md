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
  - [Gestión de productos](#gestión-de-productos)
  - [Gestión de carrito](#gestión-de-carrito)
  - [Funcionalidades en tiempo real](#funcionalidades-en-tiempo-real)
  - [Subida de archivos](#subida-de-archivos)
  - [Paginación y filtros](#paginación-y-filtros)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura de datos (Schemas MongoDB)](#estructura-de-datos-schemas-mongodb)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Diagrama de flujo (ASCII)](#diagrama-de-flujo-ascii)
- [Roadmap de mejoras](#roadmap-de-mejoras)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 📝 Descripción

Este proyecto es una tienda online didáctica que incluye:

- **API REST completa** (productos + carrito) con **Express + MongoDB (Mongoose)**.
- **Frontend renderizado** con **Handlebars** y **JavaScript cliente**.
- **Funcionalidad en tiempo real** usando **Socket.IO** (actualiza la lista de productos sin recargar la página).
- **Subida de imágenes** de producto usando **Multer**.
- **Paginación y filtros avanzados** para búsqueda de productos.
- **Gestión de carrito de compras** con persistencia en base de datos.
- **Panel de administración** para agregar, editar y eliminar productos en tiempo real.
- **Script de seed** para cargar productos de ejemplo.

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
| `npm run dev` | Inicia el servidor en modo desarrollo (recomendado) con recarga automática |
| `npm start` | Inicia el servidor en modo producción |
| `node src/scripts/seed.products.js` | Carga productos de ejemplo en la base de datos (64 productos) |

---

## 🚀 Uso

### Ejecutar el proyecto completo

1. Inicia MongoDB (Atlas o local).
2. Ejecuta el servidor:

```bash
npm run dev
```

3. Abre en el navegador:

- `http://localhost:8080/` → Panel principal (agregar / eliminar productos en tiempo real).
- `http://localhost:8080/products` → Listado paginado + filtros de búsqueda.
- `http://localhost:8080/realtimeproducts` → Lista en tiempo real con búsqueda.
- `http://localhost:8080/carts` → Carrito de compras.

---

## 🧩 Endpoints del backend (API REST)

### Productos

#### `GET /api/products`
Obtiene productos paginados con filtros.

**Query params:**
- `limit` (número) — cantidad por página (default: 10).
- `page` (número) — página actual (default: 1).
- `sort` ("asc"|"desc") — ordenar por precio.
- `query` (string) — búsqueda por título o categoría.
- `minPrice` (número) — precio mínimo.
- `maxPrice` (número) — precio máximo.

**Respuesta:**
```json
{
  "status": "success",
  "payload": [...productos],
  "totalPages": 5,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?page=2"
}
```

#### `GET /api/products/filter`
Filtra productos por título, categoría, código o rango de precios.

#### `GET /api/products/:id`
Obtiene un producto específico por ID.

#### `POST /api/products`
Crea un nuevo producto. Soporta subida de imagen (`thumbnail`).

**Body (form-data):**
- title, description, price, code, stock, category (requeridos)
- thumbnail (archivo imagen)

#### `PUT /api/products/:id`
Actualiza un producto existente.

#### `DELETE /api/products/:id`
Elimina un producto.

### Carrito

#### `POST /api/carts`
Crea un nuevo carrito vacío.

#### `GET /api/carts/:cid`
Obtiene un carrito con productos poblados.

#### `POST /api/carts/:cid/product/:pid`
Agrega un producto al carrito (incrementa cantidad si ya existe).

#### `PUT /api/carts/:cid/products/:pid`
Actualiza la cantidad de un producto en el carrito.

#### `DELETE /api/carts/:cid/products/:pid`
Elimina un producto del carrito.

#### `DELETE /api/carts/:cid`
Vacía completamente el carrito.

---

## 🎯 Interacción con el frontend

### Panel de Administración (`/`)
- **Agregar productos**: Formulario con subida de imagen.
- **Lista en tiempo real**: Tabla que se actualiza automáticamente con Socket.IO.
- **Búsqueda**: Filtrar productos por título/categoría/código.
- **Edición inline**: Hacer clic en campos para editar.
- **Eliminar**: Botón con confirmación.

### Página de Productos (`/products`)
- **Paginación**: Navegación entre páginas.
- **Filtros**: Búsqueda, rango de precios, ordenamiento.
- **Agregar al carrito**: Botón para cada producto.

### Productos en Tiempo Real (`/realtimeproducts`)
- **Lista live**: Actualizaciones sin recargar página.
- **Búsqueda debounced**: 300ms de delay para evitar llamadas excesivas.
- **Eliminar productos**: Con confirmación.

### Carrito (`/carts`)
- **Visualización**: Lista de productos con cantidad y precio total.
- **Eliminar items**: Remover productos del carrito.

---

## ✨ Funcionalidades / Features

### Gestión de Productos
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar).
- ✅ Validación de campos requeridos y códigos únicos.
- ✅ Subida de imágenes de producto.
- ✅ Búsqueda y filtros avanzados.

### Gestión de Carrito
- ✅ Crear carrito automáticamente al visitar la página.
- ✅ Agregar productos con control de cantidad.
- ✅ Actualizar cantidades en el carrito.
- ✅ Vaciar carrito completo.
- ✅ Persistencia en base de datos.
- ✅ Validación de existencia de productos.

### Funcionalidades en Tiempo Real
- ✅ Actualización automática de listas con Socket.IO.
- ✅ Sin recarga de página para mejor UX.
- ✅ Eventos emitidos en creación/edición/eliminación.

### Subida de Archivos
- ✅ Multer para manejo de archivos.
- ✅ Almacenamiento en `/public/uploads/`.
- ✅ Nombres únicos con timestamp.

### Paginación y Filtros
- ✅ Paginación con mongoose-paginate-v2.
- ✅ Filtros por precio, categoría, búsqueda de texto.
- ✅ Ordenamiento ascendente/descendente.

---

## 🛠️ Tecnologías utilizadas

### Backend
- **Node.js** - Runtime de JavaScript.
- **Express.js** - Framework web.
- **MongoDB** - Base de datos NoSQL.
- **Mongoose** - ODM para MongoDB.
- **Socket.IO** - Comunicación en tiempo real.
- **Multer** - Manejo de archivos multipart.
- **dotenv** - Variables de entorno.

### Frontend
- **Handlebars** - Motor de plantillas.
- **Vanilla JavaScript** - Lógica cliente.
- **SweetAlert2** - Alertas y confirmaciones.
- **CSS** - Estilos personalizados.

### DevOps
- **ES Modules** - Sistema de módulos moderno.
- **Nodemon** - Recarga automática en desarrollo.

---

## 📊 Estructura de datos (Schemas MongoDB)

### Producto
```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true, index: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String }, // Ruta del archivo
  status: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }
}
```

### Carrito
```javascript
{
  products: [
    {
      product: { type: ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ]
}
```

---

## 📁 Estructura del proyecto

```
backend-1/
├── package.json
├── README.md
├── .env.example
├── public/
│   ├── js/
│   │   ├── admin.js          # Lógica panel admin
│   │   ├── products.js       # Paginación y filtros
│   │   ├── realtimeProducts.js # Tiempo real
│   │   ├── carts.js          # Gestión carrito
│   │   └── helpers/
│   │       └── debounce.js   # Utilidad debounce
│   ├── styles/
│   │   ├── main.css
│   │   ├── header.css
│   │   ├── home.css
│   │   ├── products.css
│   │   ├── realtime.css
│   │   └── carts.css
│   └── uploads/              # Imágenes subidas
├── src/
│   ├── app.js                # Servidor principal
│   ├── config/
│   │   └── db.js             # Conexión MongoDB
│   ├── middleware/
│   │   └── multer.js         # Config Multer
│   ├── models/
│   │   ├── products.model.js
│   │   └── cart.model.js
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   ├── scripts/
│   │   └── seed.products.js  # Cargar datos ejemplo
│   ├── utils/
│   │   └── utils.js          # Utilidades (__dirname)
│   └── views/
│       ├── layouts/
│       │   └── main.handlebars
│       ├── partials/
│       │   └── header.handlebars
│       └── *.handlebars      # Vistas
```

---

## 📜 Scripts disponibles

### Seed de productos
```bash
node src/scripts/seed.products.js
```
Carga 64 productos de ejemplo en categorías:
- **Smartphones** (18): iPhone, Samsung, Xiaomi, etc.
- **Laptops** (10): MacBook, Dell, HP, Lenovo.
- **Tablets** (10): iPad, Samsung Tab, etc.
- **Audio** (10): AirPods, Sony, Bose, JBL.
- **Wearables** (10): Apple Watch, Samsung Watch.
- **Cámaras** (6): GoPro, Sony, Canon.

---

## 🔄 Diagrama de flujo (ASCII)

```
Cliente Browser
    ↓
Handlebars Views (/, /products, /realtimeproducts, /carts)
    ↓
Express Routes (views.router.js)
    ↓
API Endpoints (/api/products, /api/carts)
    ↓
Mongoose Models (products.model.js, cart.model.js)
    ↓
MongoDB Database
    ↙        ↘
Socket.IO    Multer
(Real-time)  (Uploads)
```

---

## 🚀 Roadmap de mejoras

- [ ] Autenticación y autorización de usuarios.
- [ ] Roles de usuario (admin, cliente).
- [ ] Checkout y procesamiento de pagos.
- [ ] Inventario automático (reducir stock al comprar).
- [ ] Validaciones más robustas en frontend.
- [ ] Tests unitarios e integración.
- [ ] Dockerización del proyecto.
- [ ] API documentation con Swagger.
- [ ] Notificaciones push con Socket.IO.
- [ ] Búsqueda avanzada con Elasticsearch.

---

## 🤝 Contribución

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

*Proyecto desarrollado como parte del curso de Backend. Última actualización: Marzo 2026*
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
