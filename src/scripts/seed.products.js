import mongoose from "mongoose";
import productsModel from "../models/products.model.js";
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;

const products = [
{ title:"iPhone 14", description:"Apple smartphone 128GB", price:1099000, code:"TEL002", stock:22, category:"smartphones", thumbnail: "null"},
{ title:"iPhone 15", description:"Apple smartphone 128GB", price:1199000, code:"TEL003", stock:18, category:"smartphones", thumbnail: "null"},
{ title:"Samsung Galaxy S21", description:"Samsung flagship phone", price:850000, code:"TEL004", stock:30, category:"smartphones", thumbnail: "null"},
{ title:"Samsung Galaxy S22", description:"Samsung flagship phone", price:950000, code:"TEL005", stock:28, category:"smartphones", thumbnail: "null"},
{ title:"Samsung Galaxy S23", description:"Samsung flagship phone", price:1050000, code:"TEL006", stock:21, category:"smartphones", thumbnail: "null"},
{ title:"Xiaomi Redmi Note 11", description:"Xiaomi smartphone 128GB", price:320000, code:"TEL007", stock:40, category:"smartphones", thumbnail: "null"},
{ title:"Xiaomi Redmi Note 12", description:"Xiaomi smartphone 128GB", price:350000, code:"TEL008", stock:38, category:"smartphones", thumbnail: "null"},
{ title:"Motorola Edge 30", description:"Motorola premium smartphone", price:610000, code:"TEL009", stock:20, category:"smartphones", thumbnail: "null"},
{ title:"Motorola G82", description:"Motorola mid range smartphone", price:370000, code:"TEL010", stock:34, category:"smartphones", thumbnail: "null"},
{ title:"OnePlus 9", description:"OnePlus flagship phone", price:700000, code:"TEL011", stock:25, category:"smartphones", thumbnail: "null"},
{ title:"OnePlus 10", description:"OnePlus flagship phone", price:800000, code:"TEL012", stock:22, category:"smartphones", thumbnail: "null"},
{ title:"Google Pixel 6", description:"Google smartphone with pure Android", price:650000, code:"TEL013", stock:27, category:"smartphones", thumbnail: "null"},
{ title:"Google Pixel 7", description:"Google smartphone with pure Android", price:750000, code:"TEL014", stock:24, category:"smartphones", thumbnail: "null"},
{ title:"Sony Xperia 1 III", description:"Sony premium smartphone", price:900000, code:"TEL015", stock:15, category:"smartphones", thumbnail: "null"},
{ title:"Sony Xperia 5 III", description:"Sony compact smartphone", price:800000, code:"TEL016", stock:18, category:"smartphones", thumbnail: "null"},
{ title:"Asus ROG Phone 5", description:"Asus gaming smartphone", price:1200000, code:"TEL017", stock:10, category:"smartphones", thumbnail: "null"},
{ title:"Asus Zenfone 8", description:"Asus compact smartphone", price:600000, code:"TEL018", stock:20, category:"smartphones", thumbnail: "null"},
{ title:"Asus Zenfone 9", description:"Asus compact smartphone", price:650000, code:"TEL019", stock:18, category:"smartphones", thumbnail: "null"},

{ title:"MacBook Air M1", description:"Apple laptop 13 inches", price:1299000, code:"LAP011", stock:15, category:"laptops", thumbnail: "null"},
{ title:"MacBook Air M2", description:"Apple laptop new generation", price:1499000, code:"LAP012", stock:14, category:"laptops", thumbnail: "null"},
{ title:"MacBook Pro 14", description:"Apple professional laptop", price:1999000, code:"LAP013", stock:10, category:"laptops", thumbnail: "null"},
{ title:"Dell XPS 13", description:"Dell ultrabook premium", price:1400000, code:"LAP014", stock:16, category:"laptops", thumbnail: "null"},
{ title:"Dell Inspiron 15", description:"Dell everyday laptop", price:780000, code:"LAP015", stock:20, category:"laptops", thumbnail: "null"},
{ title:"HP Pavilion 15", description:"HP laptop for work", price:750000, code:"LAP016", stock:22, category:"laptops", thumbnail: "null"},
{ title:"HP Omen 16", description:"HP gaming laptop", price:1600000, code:"LAP017", stock:12, category:"laptops", thumbnail: "null"},
{ title:"Lenovo ThinkPad X1", description:"Business laptop Lenovo", price:1700000, code:"LAP018", stock:13, category:"laptops", thumbnail: "null"},
{ title:"Lenovo IdeaPad 3", description:"Affordable Lenovo laptop", price:650000, code:"LAP019", stock:25, category:"laptops", thumbnail: "null"},
{ title:"Asus Zenbook 14", description:"Premium ultrabook Asus", price:1200000, code:"LAP020", stock:18, category:"laptops", thumbnail: "null"},

{ title:"iPad 9th Gen", description:"Apple tablet 10 inches", price:450000, code:"TAB021", stock:28, category:"tablets", thumbnail: "null"},
{ title:"iPad Air", description:"Apple powerful tablet", price:650000, code:"TAB022", stock:24, category:"tablets", thumbnail: "null"},
{ title:"iPad Pro", description:"Apple professional tablet", price:999000, code:"TAB023", stock:18, category:"tablets", thumbnail: "null"},
{ title:"Samsung Galaxy Tab S7", description:"Samsung premium tablet", price:720000, code:"TAB024", stock:17, category:"tablets", thumbnail: "null"},
{ title:"Samsung Galaxy Tab S8", description:"Samsung high end tablet", price:800000, code:"TAB025", stock:16, category:"tablets", thumbnail: "null"},
{ title:"Lenovo Tab P11", description:"Lenovo entertainment tablet", price:330000, code:"TAB026", stock:21, category:"tablets", thumbnail: "null"},
{ title:"Huawei MatePad", description:"Huawei multimedia tablet", price:400000, code:"TAB027", stock:19, category:"tablets", thumbnail: "null"},
{ title:"Amazon Fire HD 10", description:"Amazon affordable tablet", price:180000, code:"TAB028", stock:32, category:"tablets", thumbnail: "null"},
{ title:"Xiaomi Pad 6", description:"Xiaomi performance tablet", price:420000, code:"TAB029", stock:23, category:"tablets", thumbnail: "null"},
{ title:"Realme Pad", description:"Realme slim tablet", price:290000, code:"TAB030", stock:26, category:"tablets", thumbnail: "null"},

{ title:"AirPods Pro", description:"Apple wireless earbuds", price:249000, code:"AUD031", stock:35, category:"audio", thumbnail: "null"},
{ title:"AirPods 3", description:"Apple wireless earbuds", price:199000, code:"AUD032", stock:33, category:"audio", thumbnail: "null"},
{ title:"Sony WH-1000XM4", description:"Sony noise cancelling headphones", price:350000, code:"AUD033", stock:20, category:"audio", thumbnail: "null"},
{ title:"Sony WH-1000XM5", description:"Sony premium headphones", price:400000, code:"AUD034", stock:18, category:"audio", thumbnail: "null"},
{ title:"Bose QC45", description:"Bose noise cancelling headphones", price:330000, code:"AUD035", stock:19, category:"audio", thumbnail: "null"},
{ title:"JBL Tune 510BT", description:"JBL wireless headphones", price:80000, code:"AUD036", stock:40, category:"audio", thumbnail: "null"},
{ title:"JBL Charge 5", description:"Portable bluetooth speaker", price:180000, code:"AUD037", stock:29, category:"audio", thumbnail: "null"},
{ title:"Marshall Emberton", description:"Marshall bluetooth speaker", price:170000, code:"AUD038", stock:22, category:"audio", thumbnail: "null"},
{ title:"Anker Soundcore", description:"Affordable bluetooth earbuds", price:70000, code:"AUD039", stock:41, category:"audio", thumbnail: "null"},
{ title:"Beats Studio 3", description:"Beats wireless headphones", price:299000, code:"AUD040", stock:17, category:"audio", thumbnail: "null"},

{ title:"Apple Watch Series 8", description:"Apple smartwatch", price:499000, code:"WAT041", stock:20, category:"wearables", thumbnail: "null"},
{ title:"Apple Watch Ultra", description:"Apple rugged smartwatch", price:799000, code:"WAT042", stock:12, category:"wearables", thumbnail: "null"},
{ title:"Samsung Galaxy Watch 5", description:"Samsung smartwatch", price:320000, code:"WAT043", stock:23, category:"wearables", thumbnail: "null"},
{ title:"Samsung Galaxy Watch 6", description:"Samsung smartwatch new gen", price:380000, code:"WAT044", stock:21, category:"wearables", thumbnail: "null"},
{ title:"Garmin Fenix 7", description:"Garmin sport watch", price:700000, code:"WAT045", stock:10, category:"wearables", thumbnail: "null"},
{ title:"Garmin Forerunner 255", description:"Running smartwatch", price:350000, code:"WAT046", stock:18, category:"wearables", thumbnail: "null"},
{ title:"Xiaomi Mi Band 8", description:"Fitness smart band", price:60000, code:"WAT047", stock:45, category:"wearables", thumbnail: "null"},
{ title:"Fitbit Charge 5", description:"Fitbit fitness tracker", price:150000, code:"WAT048", stock:30, category:"wearables", thumbnail: "null"},
{ title:"Huawei Watch GT 3", description:"Huawei smartwatch", price:280000, code:"WAT049", stock:24, category:"wearables", thumbnail: "null"},
{ title:"Amazfit GTR 4", description:"Amazfit premium smartwatch", price:220000, code:"WAT050", stock:27, category:"wearables", thumbnail: "null"},
{ title:"GoPro Hero 10", description:"GoPro action camera", price:450000, code:"CAM051", stock:15, category:"cameras", thumbnail: "null"},
{ title:"GoPro Hero 11", description:"GoPro latest action camera", price:550000, code:"CAM052", stock:12, category:"cameras", thumbnail: "null"},
{ title:"Sony Alpha a7 III", description:"Sony mirrorless camera", price:1200000, code:"CAM053", stock:8, category:"cameras", thumbnail: "null"},
{ title:"Canon EOS R6", description:"Canon mirrorless camera", price:1300000, code:"CAM054", stock:9, category:"cameras", thumbnail: "null"},
{ title:"Nikon Z6 II", description:"Nikon mirrorless camera", price:1100000, code:"CAM055", stock:10, category:"cameras", thumbnail: "null"},
{ title:"Fujifilm X-T4", description:"Fujifilm mirrorless camera", price:900000, code:"CAM056", stock:14, category:"cameras", thumbnail: "null"},

];

const seed = async () => {

  try {

    await mongoose.connect(MONGO_URI);

    await productsModel.deleteMany();

    await productsModel.insertMany(products);

    console.log(" Productos cargados correctamente");

    process.exit();

  } catch (error) {

    console.error(" Error cargando productos:", error);
    process.exit(1);

  }
}

seed();