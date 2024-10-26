import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { writeDataToFile } from "../utils.js";

/**
 * Reads data from JSON file
 * @returns {Promise<Object[]} List of all data
 */
export async function readFile() {
  try {
    const products = await fs.readFile("./data/products.json", "utf8");
    return JSON.parse(products);
  } catch (error) {
    console.log("Error reading products file:", error);
    throw new Error("Could not read products file");
  }
}

/**
 * Gets all products
 * @returns {Promise<Object[]>} List of all data
 */
export async function findAll() {
  const products = await readFile();
  return products;
}

/**
 * Gets product based on id
 * @param {string} id - ID to product
 * @returns {Promise<Object|null>}  Product with given ID, or null if not found
 */
export async function findById(id) {
  const products = await readFile();
  return products.find((product) => product.id === id) || null;
}

/**
 * Creates new product
 * @param {Object} newProduct - Productdata to create
 * @returns {Promise<Object>} New product with generated ID
 */
export async function create(newProduct) {
  const products = await readFile();
  const newProductWithId = { id: uuidv4(), ...newProduct };
  products.push(newProductWithId);
  writeDataToFile("./data/products.json", products);

  return newProductWithId;
}

/**
 * Updates existing product
 * @param {string} id - ID to product thats updated
 * @param {Object} updatedProduct Updated products data
 * @returns {Promise<Object|null>} Updated product or null
 */
export async function update(id, updatedProduct) {
  const products = await readFile();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  products[index] = { id, ...updatedProduct };
  writeDataToFile("./data/products.json", products);

  return products[index];
}

/**
 * Removes/deletes a product
 * @param {string} id - ID to product to be deleted
 * @returns {Promise<Object|null>} Success message, or null if product not found
 */
export async function remove(id) {
  const products = await readFile();
  const filteredProducts = products.filter((product) => product.id !== id);

  if (filteredProducts.length === products.length) {
    return null;
  }

  writeDataToFile("./data/products.json", filteredProducts);
  return { message: `Product ${id} removed suvvessfully` };
}
