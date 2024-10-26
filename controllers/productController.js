import { findAll, findById, create, update, remove } from "../models/productModel.js";
import { getPostData } from "../utils.js";

/**
 * Sends a JSON response
 *
 *  @param {Object} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Data to send a response
 */
const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

/**
 * Gets all products
 *
 * @route GET /api/products
 */
export async function getProducts(req, res) {
  try {
    const products = await findAll();
    sendResponse(res, 200, products);
  } catch (error) {
    console.log("Error when fetching products:", error);
    sendResponse(res, 500, { message: "Intern server error" });
  }
}

/**
 * Gets single product
 *
 * @route GET /api/products/:id
 */
export async function getProduct(req, res, id) {
  try {
    const product = await findById(id);

    if (!product) {
      sendResponse(res, 404, { message: "Product Not Found" });
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(product));
    }
  } catch (error) {
    console.log("Error when fetching product:", error);
    sendResponse(res, 500, { message: "Intern server error" });
  }
}

/**
 * Create product
 *
 * @route POST /api/products
 */
export async function createProduct(req, res) {
  try {
    const body = await getPostData(req);
    const { title, description, price } = JSON.parse(body);

    if (typeof price !== "number") {
      return sendResponse(res, 400, { message: "Price has to be a valid number" });
    }

    const product = {
      title,
      description,
      price,
    };

    const newProduct = await create(product);

    sendResponse(res, 201, newProduct);
  } catch (error) {
    console.log("Error when creating product:", error);
    sendResponse(res, 500, { message: "Intern server error" });
  }
}

/**
 * Update product
 *
 * @route PUT /api/products/:id
 */
export async function updateProduct(req, res, id) {
  try {
    const product = await findById(id);

    if (!product) {
      sendResponse(res, 404, { message: "Product not found" });
    } else {
      const body = await getPostData(req);
      const { title, description, price } = JSON.parse(body);

      if (typeof price !== "number") {
        return sendResponse(res, 400, { message: "Price has to be a valid number" });
      }

      const productData = {
        title: title !== undefined ? title : product.title,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? price : product.price,
      };

      const updProduct = await update(id, productData);
      sendResponse(res, 200, updProduct);
    }
  } catch (error) {
    console.error("Feil ved sletting av produkt:", error);
    sendResponse(res, 500, { message: "Intern serverfeil" });
  }
}

/**
 * Delete product
 *
 * @route DELETE /api/products/:id
 */
export async function removeProduct(req, res, id) {
  try {
    const product = await findById(id);

    if (!product) {
      endResponse(res, 404, { message: "Produkt not found" });
    } else {
      await remove(id);
      sendResponse(res, 200, { message: `Product ${id} successfully removed` });
    }
  } catch (error) {
    console.log(error);
    console.error("Error when deleting product:", error);
    sendResponse(res, 500, { message: "Intern server error" });
  }
}
