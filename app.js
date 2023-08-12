require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

require("./config/conn");

const port = process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(morgan("tiny"));

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/user", userRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.status(201).send("Hello from server");
});
app.get("/home", (req, res) => {
  console.log("Hello server");
  res.status(201).send("Hello from server");
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
