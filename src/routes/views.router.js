import express from 'express';
import ProductsManager from '../productsManager.js';

const router = express.Router();
const productsManager = new ProductsManager();

// Ruta para la página de admin
router.get('/', (req, res) => {
    const user = {
        name: 'Emanuel',
        email: 'montenegroemanuel995@gmail.com',
        role: 'admin'
    };

    let roleLabel;

    if (user.role === 'admin') {
        roleLabel = 'Administrador';
    } else { roleLabel = 'Usuario'; }

    res.render('home', {
        title: 'Home Page',
        styles: ['home.css'],
        user,
        roleLabel
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