import express from 'express';
import CartsManager from '../cartsManager.js';

const router = express.Router();

const cartsManager = new CartsManager();

// crear ruta para el carrito de compras

router.post('/', async (req, res) => {
  const newCart = await cartsManager.createCart();
  res.status(201).json({
    status: 'success',
    data: newCart
  });
});

// lista de productos en el carrito

router.get('/:cid', async (req, res) => {
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

router.post('/:cid/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  const product = await productsManager.getProductById(pid);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      data: 'Producto no encontrado'
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
    data: updatedCart
  });
});

export default router;