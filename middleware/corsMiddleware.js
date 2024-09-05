// middleware/corsMiddleware.js
const corsHeaders = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*"); // Allow all origins
  res.header("Access-Control-Allow-Credentials", "true"); // Allow Credentials
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); // Allowed methods
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};

module.exports = corsHeaders;
