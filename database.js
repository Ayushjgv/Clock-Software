// db.js
const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017/clock";
const client = new MongoClient(url);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("clock");
    console.log("MongoDB connected");
  }
  return db;
}

module.exports = connectDB;