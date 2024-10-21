const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: String,
      trim: true,
      default: "N/A",
    },
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    imgUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    priceHistory: {
      type: [priceHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
