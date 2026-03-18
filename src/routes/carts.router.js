import express from "express";
import cartModel from "../models/cart.model.js";
import productModel from "../models/products.model.js";

const router = express.Router();


// crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });

    res.status(201).json({
      status: "success",
      data: newCart
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error creando carrito" });
  }
});


// obtener carrito
router.get("/:cid", async (req, res) => {
  try {

    const cart = await cartModel
      .findById(req.params.cid)
      .populate("products.product");

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    res.json({ status: "success", data: cart });

  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});


// ➕ agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
 
  try {
    const { cid, pid } = req.params;

    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const product = await productModel.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const index = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (index !== -1) {
      cart.products[index].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.json({ status: "success", data: cart });

  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});


// eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  
  try {
    const { cid, pid } = req.params;

    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== pid
    );

    await cart.save();

    res.json({ status: "success", data: cart });

  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});


// actualizar cantidad
router.put("/:cid/products/:pid", async (req, res) => {
 
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: "error" });
    }

    const product = cart.products.find(
      p => p.product.toString() === pid
    );

    if (!product) {
      return res.status(404).json({ status: "error" });
    }

    product.quantity = quantity;

    await cart.save();

    res.json({ status: "success", data: cart });

  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});


// vaciar carrito
router.delete("/:cid", async (req, res) => {
 
  try {
    const cart = await cartModel.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ status: "error" });
    }

    cart.products = [];
    await cart.save();

    res.json({ status: "success", data: cart });

  } catch (error) {
     res.status(500).json({ status: "error" }); }
});


export default router;