const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//? Load env vars
dotenv.config({ path: "./config/config.env" });

//? Load Models
const Bootcamp = require("./models/Bootcamp");
const { json } = require("express");

//? Connect to DB
mongoose.connect(process.env.MONGO_URI);

//? Read JSON file
const bootcamp = JSON.parse(
  fs.readFileSync([__dirname, "_data", "bootcamp_data.json"].join("/"), "utf-8")
);

//? Import into Db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamp);

    console.log("Data Imported...".bgGreen);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//? Delete from Db
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

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
