const Product = require("./../model/productModel");
const { scrapeProduct } = require("./../helpers/scrapeHelper");
const { handleError } = require("./../helpers/errorHandler");
const { sendResponse } = require("./../helpers/responseHandler");
const { validateAddProduct } = require("./../validation/productValidation");

exports.addProduct = async (req, res) => {
  const productData = req.body;

  const validation = validateAddProduct(productData);
  if (!validation.isValid) {
    return handleError(res, null, 400, validation.message);
  }

  const { url } = req.body;
  try {
    const existingProduct = await Product.findOne({ url });
    if (existingProduct) {
      return handleError(
        res,
        null,
        400,
        "Product with this URL already exists"
      );
    }
    const scrapedData = await scrapeProduct(url);
    const product = new Product({ ...scrapedData, ...productData });
    await product.save();

    return sendResponse(res, product, 201, "Product added successfully");
  } catch (error) {
    return handleError(res, error, 500, "Failed to scrape product");
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().select(
      "-priceHistory -url -createdAt -updatedAt"
    );
    return sendResponse(res, products, 200, "Products fetched successfully");
  } catch (error) {
    return handleError(res, error, 500, "Failed to scrape product");
  }
};
exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).select(
      "-priceHistory -url -createdAt -updatedAt"
    );
    if (!product) {
      return handleError(res, null, 404, "Product not found");
    }
    return sendResponse(res, product, 200, "Product fetched successfully");
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch product");
  }
};

exports.checkPrice = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return handleError(res, null, 404, "Product not found");
    }

    const currentPriceData = await scrapeProduct(product.url);

    if (currentPriceData && currentPriceData.price) {
      const oldPrice = product.price;
      const newPrice = currentPriceData.price;
      if (oldPrice === newPrice) {
        return sendResponse(
          res,
          { oldPrice, newPrice },
          200,
          "Price remains unchanged."
        );
      } else {
        product.priceHistory.push({ price: oldPrice });
        product.price = newPrice;
        await product.save();
        return sendResponse(
          res,
          { oldPrice, newPrice },
          200,
          "Price updated successfully."
        );
      }
    } else {
      return handleError(res, null, 500, "Failed to retrieve current price");
    }
  } catch (error) {
    return handleError(res, error, 500, "Failed to check price");
  }
};
exports.searchAndFilterProducts = async (req, res) => {
  try {
    const { title, minPrice, maxPrice, sortRating, sortPrice } = req.query;

    let filter = {};

    if (title) {
      filter.title = { $regex: title.trim(), $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }
    let query = Product.find(filter).select(
      "-priceHistory -url -createdAt -updatedAt"
    );

    let sortOptions = {};
    if (sortRating) {
      const sortDirection = sortRating === "lowToHigh" ? 1 : -1;
      // 1 for ascending, -1 for descending
      sortOptions.rating = sortDirection;
      // query = query.sort({ rating: sortDirection, price: 1 });
    }
    if (sortPrice) {
      const priceSortDirection = sortPrice === "lowToHigh" ? 1 : -1;
      sortOptions.price = priceSortDirection;
      // query = query.sort({ price: priceSortDirection, rating: -1 });
    }

    if (Object.keys(sortOptions).length > 0) {
      query = query.sort(sortOptions);
    }

    const products = await query;

    if (!products.length) {
      return sendResponse(
        res,
        null,
        200,
        "No products found matching your criteria."
      );
    }
    return sendResponse(res, products, 200, "Products fetched successfully");
  } catch (error) {
    return handleError(res, error, 500, "Error fetching products");
  }
};

exports.getShowcaseProductsFiled = async (req, res) => {
  try {
    const { fields } = req.query;

    let selectFields = "";

    if (fields) {
      selectFields = fields.split(",").join(" ");
    }
    const products = await Product.find().select(selectFields);

    if (!products.length) {
      return handleError(res, null, 404, "No products found for showcase.");
    }

    return sendResponse(
      res,
      products,
      200,
      "Showcase products fetched successfully"
    );
  } catch (error) {
    return handleError(res, error, 500, "Error fetching showcase products");
  }
};
