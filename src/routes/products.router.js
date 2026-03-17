import express from 'express';
import productsModel from '../models/products.model.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// ruta para obtener todos los productos

router.get('/', async (req, res) => {

  try {
    const products = await productsModel.find();
    res.json({ status: 'success', data: products });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// ruta para filtrar productos por título, categoría, precio máximo o código

router.get('/filter', async (req, res) => {

  try {
    const {title, category, minPrice, maxPrice, code } = req.query;
    const filter = {};

    if (title) {
      filter.$or = [
      { title: { $regex: title, $options: "i" } },
      { category: { $regex: title, $options: "i" } }
      ];
    }
    if (minPrice || maxPrice) { 
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
    if (code) filter.code = code;

    const products = await productsModel.find(filter);

    res.json({ status: 'success', data: products });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// ruta para obtener un producto por id

router.get('/:id', async (req, res) => {
  
  try {
    const { id } = req.params;
    const product = await productsModel.findById(id);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', data: product });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



// guardar un nuevo producto

router.post("/", upload.single("thumbnail"), async (req, res) => {

  try {

    const newProduct = await productsModel.create({
      ...req.body,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : null
    });

    const updatedProducts = await productsModel.find();

    const io = req.app.get("io");
    if (io) io.emit("updateProducts", updatedProducts);

    res.status(201).json({ status: "success", data: newProduct });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ status: "error", message: "El código del producto ya existe" });
    }

    res.status(400).json({ status: "error", message: "Error creating product" });
  }

});


// eliminar un producto

router.delete('/:id', async (req, res) => {
  try {

    const { id } = req.params;
    const deletedProduct = await productsModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    const updatedProducts = await productsModel.find();

    const io = req.app.get("io");
    if (io) io.emit("updateProducts", updatedProducts);

    res.json({ status: 'success', message: 'Product deleted' });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


// actualizar un producto

router.put('/:id', async (req, res) => {
  try {

    const { id } = req.params;

    const updatedProduct = await productsModel.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', data: updatedProduct });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'internal server error' });
  }
});

export default router;