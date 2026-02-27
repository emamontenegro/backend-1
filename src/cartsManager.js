import fs from 'fs/promises';
import crypto from 'crypto';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartsManager {
  constructor() {   
    this.carts = [];
    this.path = path.join(__dirname, '../data/carts.json');
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
      return this.carts;
    } catch (error) {
      this.carts = [];
      return this.carts;
    }
  }

  async createCart() {
    await this.getCarts();

    const newCart = {
      id: crypto.randomUUID(),
      products: []
    };

    this.carts.push(newCart);
    await this.saveCarts();

    return newCart;
  }

  async getCartById(id) {
    await this.getCarts();
    return this.carts.find(cart => cart.id === id);
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async addProductToCart(cartId, productId) {
  await this.getCarts();

  const cart = this.carts.find(cart => cart.id === cartId);
  if (!cart) return null;

  const productInCart = cart.products.find(
    item => item.product === productId
  );

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({
      product: productId,
      quantity: 1
    });
  }

  await this.saveCarts();
  return cart;
}
}

export default CartsManager;
