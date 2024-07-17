const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
//?rout files
const bootcamps = require("./routes/bootcamps");

//? Load environment variables from the config file
dotenv.config({ path: "./config/config.env" });

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//! initialize middleware
// app.use(logger);

//? Mount Routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
