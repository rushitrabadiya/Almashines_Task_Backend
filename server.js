const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routers/productRoutes");
const { DB, PORT } = require("./config/config");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error(err));
app.use("/api/v1/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
