import express from 'express';
import ProductsManager from '../productsManager.js';

const router = express.Router();
const productsManager = new ProductsManager();

// Ruta para la página de admin

router.get('/', async (req, res) => {

  const products = await productsManager.getProducts();

  const user = {
    name: 'Emanuel',
    email: 'montenegroemanuel995@gmail.com',
    role: 'admin'
  };

  const roleLabel = user.role === 'admin' ? 'Administrador' : 'Usuario';

  res.render('home', {
    title: 'Home Page',
    styles: ['home.css'],
    user,
    roleLabel,
    products,
    emptyMessage: products.length === 0 ? "No hay productos cargados." : null
  });
});

// Ruta para la página de productos en tiempo real

router.get('/realtimeproducts', async (req, res) => {
  const products = await productsManager.getProducts();
  res.render('realTimeProducts', { 
    title: 'Real Time Products',
    products: products || [],
    styles: ['realTime.css']});
});

export default router;