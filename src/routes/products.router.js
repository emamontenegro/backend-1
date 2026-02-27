import express from 'express';
import ProductsManager from '../productsManager.js';
import { upload } from '../utils/utils.js';

const router = express.Router();

const productsManager = new ProductsManager();

// ruta para obtener todos los productos

router.get('/', async (req, res) => {
  const products = await productsManager.getProducts();
  res.json(products);
});

// ruta para obtener un producto por id

router.get('/:id', async (req, res) => {
  
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
      data: product
    });
});

// guardar un nuevo producto

router.post('/', upload.single('thumbnail'), async (req, res) => {
  try {
    
    // Validar archivo
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Thumbnail image is required'
      });
    }

    // Extraer datos del body
    const { title, description, price, code, stock, category } = req.body;

    // Validaciones básicas
    if (!title || !description || !price || !code || !stock || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Convertir tipos correctamente
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({
        status: 'error',
        message: 'Price and stock must be valid numbers'
      });
    }

    //  Construir URL de la imagen subida
    const imageUrl = `/uploads/${req.file.filename}`;

    //  Crear producto
    const newProduct = await productsManager.createProduct({
      title,
      description,
      price: parsedPrice,
      code,
      stock: parsedStock,
      category,
      thumbnail: imageUrl
    });

    // Emitir actualización por Socket.IO
    const io = req.app.get("io");
    if (io) {
      const products = await productsManager.getProducts();
      io.emit("updateProducts", products);
    }

    // Respuesta
    return res.status(201).json({
      status: 'success',
      data: newProduct
    });

  } catch (error) {
    console.error("Error creating product:", error);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// eliminar un producto

router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  const deleted = await productsManager.deleteProductById(id);

  if (!deleted) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }

  // Socket.IO: Emitir evento para actualizar la lista de productos en tiempo real
  const io = req.app.get("io");
  const products = await productsManager.getProducts();
  io.emit("updateProducts", products);

  res.json({
    status: 'success',
    message: 'Producto eliminado'
  });
});


// actualizar un producto

router.put('/:id', async (req, res) => {
  
  const { id } = req.params;

  const products = await productsManager.getProducts();

  const productIndex = products.findIndex(item => item.id === id);

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

  await productsManager.saveProductsToFile();

  res.json({
    status: 'success',
    data: products[productIndex]
  });
});

export default router;