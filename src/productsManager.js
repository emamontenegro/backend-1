import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import __dirname from './utils/utils.js';


// promesa para leer productos desde el archivo JSON

class ProductsManager {
  constructor() {
    this.products = [];
    this.path = path.join(__dirname, '../../data/products.json');
  }

  async createProduct(productData) {

    await this.getProducts();

  // Validar campos obligatorios
    const requiredFields = ['title', 'description', 'code', 'category'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    if (productData.title.length > 100) {
      throw new Error('Título demasiado largo');
    }

  // Validar código único
    const codeExists = this.products.some(
      product => product.code === productData.code
    );

    if (codeExists) {
      throw new Error('El código ya existe');
    }

  // Validar precio y stock
    const price = Number(productData.price);
    const stock = Number(productData.stock);

    if (Number.isNaN(price) || price < 0) {
      throw new Error('Precio inválido');
    }

    if (Number.isNaN(stock) || stock < 0) {
      throw new Error('Stock inválido');
    }

    const id = crypto.randomUUID();

    const newProduct = {
      id,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      category: productData.category,
      thumbnail: productData.thumbnail || null,
      price,
      stock,
      status: true
    };

    this.products.push(newProduct);
    await this.saveProductsToFile();

    return newProduct;
  }


  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      return this.products;
  } catch (error) {
      if (error.code === 'ENOENT') {
      this.products = [];
      return this.products;
    }
    throw error;
}
  }

  async getProductById(id) {
    await this.getProducts();
    return this.products.find(item => item.id === id);
  }

  async deleteProductById(id) {

    await this.getProducts();
    const productIndex = this.products.findIndex(item => item.id === id);

    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      await this.saveProductsToFile();
      return deletedProduct;
    }
    return false;
  }

  async saveProductsToFile() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }
}

export default ProductsManager;