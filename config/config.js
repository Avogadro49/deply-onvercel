class Config {
  static corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true,
    optionsSuccessStatus: 200,
  };
}

module.exports = Config;
