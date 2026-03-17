import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true, index: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String },
  created: { type: Date, default: Date.now }
});

const productModel = mongoose.model('Product', productSchema);

export default productModel;