import fs from 'fs/promises';
import crypto from 'crypto';

// promesa para leer productos desde el archivo JSON

class ProductsManager {
  constructor() {
    this.products = [];
    this.path = './src/products.json';
  }

  async createProduct(productData) {
    
    const id = crypto.randomUUID();

    const newProduct = { id, ...productData };
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
      this.products = [];
      return this.products;
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
      this.products.splice(productIndex, 1);
      await this.saveProductsToFile();
      return true;
    }
    return false;
  }

  async saveProductsToFile() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }
}

export default ProductsManager;