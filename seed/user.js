const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const path = require("path");

//? Load env vars
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

//? Load Models
const User = require("../models/User");

//? Connect to DB
mongoose.connect(process.env.MONGO_URI);

//? Read JSON file
const user = JSON.parse(
  fs.readFileSync(
    [__dirname, "..", "_data", "user_data.json"].join("/"),
    "utf-8"
  )
);

//? Import into Db
const importData = async () => {
  try {
    await User.create(user);

    console.log("Data Imported...".bgGreen);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//? Delete from Db
const deleteData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed...".bgRed);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const [, , ...args] = process.argv;
const [action] = args;

if (action === "-i") {
  importData();
} else if (action === "-d") {
  deleteData();
}
