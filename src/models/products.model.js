import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true, index: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String },
  status: { type: Boolean, default: true }, // 👈 importante
  created: { type: Date, default: Date.now }
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model('Product', productSchema);

export default productModel;