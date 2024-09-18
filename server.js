const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const hpp = require("hpp");
const { IPinfoWrapper } = require("node-ipinfo");
const Config = require("./config/config");
const corsMiddleware = require("./middleware/corsMiddleware");

const ipinfo = new IPinfoWrapper(process.env.IPINFO_API_KEY);

// console.log(ipinfo);

const connectDB = require("./config/db");

//! error Middleware
const errorMiddleware = require("./middleware/errorMiddleware");

//?rout files
const bootcamps = require("./routes/bootcampsRoutes");
const courses = require("./routes/coursesRoutes");
const auth = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

//? Load environment variables from the config file
dotenv.config({ path: "./config/config.env" });

connectDB();

//? initial app
const app = express();

//? using body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//set cors options
app.use(cors(Config.corsOptions));

//set cors headers
app.use(corsMiddleware);

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = expressRateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

//Prevent http param pollution
app.use(hpp());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//! initialize middleware
// app.use(logger);

//? Mount Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", userRoute);
//! Mount Error
app.use(errorMiddleware);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgMagenta
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //? close server and exit
  server.close(() => process.exit(1));
});
