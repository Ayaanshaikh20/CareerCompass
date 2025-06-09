const { MongoClient } = require("mongodb");

const dbConnect = async () => {
  try {
    //client
    const client = await new MongoClient(process.env.MONGODB_URI_LOCAL);
    // Database Name
    const dbName = "career-compass";

    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

module.exports = dbConnect;
