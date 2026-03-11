import { MongoClient } from "mongodb";

let db;

export const connectToMongoDB = async (uri, dbName) => {
  
  try {
    const mongoClient = new MongoClient(uri);

    await mongoClient.connect();

    db = mongoClient.db(dbName);
    
    console.log("Connected to MongoDB");
  } catch (error) {
    
    console.log("Error connecting to MongoDB:", error);
  }};

  export const getDB = () => db;
