import express from 'express';
import productsModel from '../models/products.model.js';

const router = express.Router();

// Ruta Home

router.get('/', async (req, res) => {

  try {
    const products = await productsModel.find().lean();
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

  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando productos");
  }
});

// Ruta Real Time

router.get('/realtimeproducts', async (req, res) => {

  try {
    const products = await productsModel.find().lean();
    res.render('realTimeProducts', {
      title: 'Real Time Products',
      products,
      styles: ['realTime.css']
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando productos");
  }
});

// Ruta productos con filtros
router.get('/products', async (req, res) => {

  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else { filter.category = query };
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const result = await productsModel.paginate(filter, {
      limit: Number(limit),
      page: Number(page),
      sort: sortOption,
      lean: true
    });

    res.render('products', {
      title: 'Productos',
      styles: ['products.css'],
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando productos");
  }
});

// Ruta carrito
router.get('/carts', async (req, res) => {
  try {

    res.render('carts', {
      title: 'Carrito',
      styles: ['carts.css']
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error cargando carrito");
  }
});

export default router;
