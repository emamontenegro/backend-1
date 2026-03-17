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

    const { title, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };

    if (category) filter.category = category;

    if (minPrice || maxPrice) {

      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);

      if (maxPrice) filter.price.$lte = Number(maxPrice);

    }

    const products = await productsModel.find(filter).lean();

    res.render('home', {
      title: 'Productos',
      styles: ['home.css'],
      products,
      emptyMessage: products.length === 0 ? "No se encontraron productos." : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error filtrando productos");
  }
});



export default router;
