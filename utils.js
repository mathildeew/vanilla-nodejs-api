import fs from "fs";

/**
 * Writes data to a file in JSON format
 * @param {string} filename - Filename to write data
 * @param {Object} content - Data to be written
 * @throws {Error} Throws error if theres an error
 */
export function writeDataToFile(filename, content) {
  try {
    fs.writeFileSync(filename, JSON.stringify(content), "utf8");
  } catch (error) {
    console.error("Error writing to file:", error);
    throw new Error("Could not write data to file");
  }
}

/**
 * Gets POST-data from HTTP request
 * @param {IncomingMessage} req - HTTP request
 * @returns {Promise<string>} A promise thats solved with the POST data as a string
 * @throws {Error} Throws error if theres an error
 */
export function getPostData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}
