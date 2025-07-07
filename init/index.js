const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
};
main().then((res) => {
  console.log("connected to mongodb");
}).catch((err) => {
  console.log(err);

});

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "686215bdfb6d799df519e01f" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}
initDB();
