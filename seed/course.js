const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const path = require("path");

//? Load env vars
// dotenv.config({ path: __dirname + "/../config/config.env" });
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

//? Load Models
const Course = require("../models/Course");

//? Connect to DB
mongoose.connect(process.env.MONGO_URI);

//? Read JSON file
const course = JSON.parse(
  fs.readFileSync(
    [__dirname, "..", "_data", "courses_data.json"].join("/"),
    "utf-8"
  )
);

//? Import into Db
const importData = async () => {
  try {
    await Course.create(course);

    console.log("Data Imported...".bgGreen);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//? Delete from Db
const deleteData = async () => {
  try {
    await Course.deleteMany();

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
