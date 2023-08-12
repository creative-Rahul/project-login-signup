const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://starAtlas:Zg8bx1FxLFzRilgx@cluster0.kzn5gzh.mongodb.net/loginSignup",
    {}
  )
  .then(() => {
    console.log("Successfully connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
