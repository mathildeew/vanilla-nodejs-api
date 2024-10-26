import { createServer } from "http";
import { getProducts, getProduct, createProduct, updateProduct, removeProduct } from "./controllers/productController.js";

const PORT = process.env.PORT || 3000;

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// JSON middleware
const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
};

// Not found handler
const notFoundHandler = (res) => {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
};

// Route handler
const routeHandler = (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/api/products" || req.url === "/api/products/") {
      return getProducts(req, res);
    } else if (req.url.match(/\/api\/products\/([a-zA-Z0-9-]+)/)) {
      const id = req.url.split("/")[3];
      return getProduct(req, res, id);
    }
  } else if (req.method === "POST") {
    if (req.url === "/api/products" || req.url === "/api/products/") {
      return createProduct(req, res);
    }
  } else if (req.method === "PUT" && req.url.match(/\/api\/products\/([a-zA-Z0-9-]+)/)) {
    const id = req.url.split("/")[3];
    return updateProduct(req, res, id);
  } else if (req.method === "DELETE" && req.url.match(/\/api\/products\/([a-zA-Z0-9-]+)/)) {
    const id = req.url.split("/")[3];
    return removeProduct(req, res, id);
  }

  // If no route match
  notFoundHandler(res);
};

// Create server
const server = createServer((req, res) => {
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      routeHandler(req, res);
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
