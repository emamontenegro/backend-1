import express from 'express';
// import ProductsManager from '../productsManager.js';
// import { upload } from '../utils/utils.js';
import { getDB } from '../db/mongo.js';
import { ObjectId } from 'mongodb';

const collection = () => getDB().collection('Products');

const router = express.Router();

// const productsManager = new ProductsManager();

// ruta para obtener todos los productos

router.get('/', async (req, res) => {
  const products = await collection().find().toArray();
  res.json(products);
});

// ruta para obtener un producto por id

router.get('/:id', async (req, res) => {
  
  const { id } = req.params;

  const product = await collection().findOne({ _id: new ObjectId(id) });
  
  if (!product) {
    
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado',
    });

  }

    res.json({
      status: 'success',
      data: product
    });
});

// guardar un nuevo producto

router.post('/', async (req, res) => {
  try {

    // Validar que todos los campos requeridos estén presentes y sean del tipo correcto
    const { title, description, price, code, stock, category, thumbnail } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Validar que price y stock sean números válidos
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({
        status: 'error',
        message: 'Price and stock must be valid numbers'
      });
    }

    // Insertar el nuevo producto en la base de datos
    const newProduct = await collection().insertOne({
      title,
      description,
      price: parsedPrice,
      code,
      stock: parsedStock,
      category,
      thumbnail: thumbnail || null
    });

    res.status(201).json({
      status: 'success',
      data: newProduct
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// eliminar un producto

router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  const result = await collection().deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }

  // Emitir actualización por Socket.IO después de eliminar el producto

  const updatedProducts = await collection().find().toArray();

  // Obtener la instancia de Socket.IO desde la aplicación y emitir el evento de actualización

  const io = req.app.get("io");
  if (io) io.emit("updateProducts", updatedProducts);

  res.json({
    status: 'success',
    message: 'Producto eliminado'
  });

});


// actualizar un producto

router.put('/:id', async (req, res) => {
  
  const { id } = req.params;

  const products = await collection().find().toArray();

  const productIndex = products.findIndex(item => item._id === new ObjectId(id));

  if (productIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }

  products[productIndex] = { 
    ...products[productIndex],
    ...req.body,
    id
  };

  await collection().replaceOne({ _id: id }, products[productIndex]);

  res.json({
    status: 'success',
    data: products[productIndex]
  });
});

export default router;