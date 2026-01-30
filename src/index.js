import express from 'express';
import ProductsManager from './productsManager.js';
import CartsManager from './cartsManager.js';


const app = express();

app.use(express.json());
 
const PORT = 8080;

const productsManager = new ProductsManager();

const cartsManager = new CartsManager();

// ruta de inicio
app.get('/', (req, res) => {
  res.send('Bienvenidos a la tienda de celulares');
});

// ruta para obtener todos los productos

app.get('/products', async (req, res) => {
  const products = await productsManager.getProducts();
  res.json(products);
});

// ruta para obtener un producto por id

app.get('/products/:id', async (req, res) => {
  
  const products = await productsManager.getProducts();
  
  const { id } = req.params;
  
  const product = products.find(item => item.id === id);
  
  if (!product) {
    
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado',
    });

  }

    res.json({
      status: 'success',
      message: 'Producto encontrado',
      data: product
    });
});

// guardar un nuevo producto

app.post('/products', async (req, res) => {
  const newProdcut = await productsManager.createProduct(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Producto agregado',
    data: newProdcut
  });
});

// eliminar un producto

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  await productsManager.getProducts();

  const deleted = await productsManager.deleteProductById(id);

  if (!deleted) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }

  res.json({
    status: 'success',
    message: 'Producto eliminado'
  });
});


// actualizar un producto

app.put('/products/:id', async (req, res) => {
  
  const { id } = req.params;

  const products = await productsManager.getProducts();

  const productIndex = products.findIndex(item => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }

  products[productIndex] = { id, ...req.body };

  await productsManager.saveProductsToFile();

  res.json({
    status: 'success',
    message: 'Producto actualizado',
    data: products[productIndex]
  });
});

// CARTS ROUTES

// carrito por id

app.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  const cart = await cartsManager.getCartById(cid);

  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado'
    });
  }

  res.json({
    status: 'success',
    data: cart
  });
});


// crear ruta para el carrito de compras

app.post('/carts', async (req, res) => {
  const newCart = await cartsManager.createCart();
  res.status(201).json({
    status: 'success',
    message: 'Carrito creado',
    data: newCart
  });
});

// lista de productos en el carrito

app.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  const cart = await cartsManager.getCartById(cid);

  if (!cart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado'
    });
  }

  res.json({
    status: 'success',
    data: cart.products
  });
});

// agregar producto al carrito

app.post('/carts/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  const product = await productsManager.getProductById(pid);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }

  const updatedCart = await cartsManager.addProductToCart(cid, pid);

  if (!updatedCart) {
    return res.status(404).json({
      status: 'error',
      message: 'Carrito no encontrado'
    });
  }

  res.json({
    status: 'success',
    message: 'Producto agregado al carrito',
    data: updatedCart
  });
});


// iniciar el servidor

app.listen(PORT, () => {console.log(`El servidor se corre en http://localhost:${PORT}`);});


