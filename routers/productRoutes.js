const express = require("express");
const productController = require("./../controller/productController");

const router = express.Router();

router
  .route("/")
  .post(productController.addProduct)
  .get(productController.getShowcaseProductsFiled);

router.get("/search", productController.searchAndFilterProducts);

router.get("/all", productController.getProducts);

router.get("/:productId/check-price", productController.checkPrice);
router.get("/:productId", productController.getProductById);

module.exports = router;
