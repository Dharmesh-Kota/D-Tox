const mongoose = require("mongoose");
const env = require('./environment');

const db = mongoose.connection;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
  console.log("Successlly Connected to Database...!");
}

// module.exports = db;