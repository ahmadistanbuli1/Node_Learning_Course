import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { IProduct } from "./interfaces";
import { promises as fsPromises } from "fs";

const server = http.createServer((req, res) => {
  const productsFilePath = path.join(__dirname, "data", "product.json");
  const assetsPath = path.join(__dirname, "assets");
  console.log(assetsPath);
  if (req.url === "/product") {
    fs.access(productsFilePath, (err) => {
      if (err) return;
      fs.readFile(productsFilePath, { encoding: "utf-8" }, (err, data) => {
        // [1] Store Data In jsonProducts And Convert To JavaScript Object
        const jsonProducts: { products: IProduct[] } = JSON.parse(data);

        res.writeHead(200, { "content-type": "application/json" });
        res.write(data);
        console.log(`Data Is : \n ${data}`);
        res.end();
      });
    });

    //
  } else if (req.url === "/products/new") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write(`<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Simple Form</title>
                </head>
                <body>
                  <h1>Contact Form</h1>
                  <form action="/add-product" method="post">
                    <label for="title">Title:</label><br>
                    <input type="text" id="title" name="title" required><br><br>

                    <button type="submit">Send</button>
                  </form>
                </body>
                </html>`);
    res.end();
    //
  } else if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end("Hi\n");
  } else if (req.method === "POST" && req.url === "/add-product") {
    let body = "";
    req.on("data", (chunk) => {
      body = chunk.toString();
      console.log(chunk.toString());
    });
    req.on("end", async () => {
      const formData = new URLSearchParams(body);
      console.log(formData.get("title"));
      const title = formData.get("title") ?? "";

      try {
        const jsonData = await fsPromises.readFile(productsFilePath, "utf-8");
        const jsonProducts: { products: IProduct[] } = JSON.parse(jsonData);

        jsonProducts.products.push({
          id: jsonProducts.products.length + 1,
          title: title,
        });

        const updatedData = JSON.stringify(jsonProducts, null, 2);
        await fsPromises.writeFile(productsFilePath, updatedData, "utf-8");
      } catch (error) {
        console.log(error);
      }

      res.writeHead(200, { "content-type": "text/html" });
      res.write(`<div>
      <h2>${formData.get("title")}</h2>
      </div>`);

      res.end("Add A New Product\n");
    });
    //
  } else if (req.method === "GET" && req.url === "/assets") {
    fs.access(assetsPath, (err) => {
      // Check If There Is Error In Dir
      if (err) {
        console.log(`Error Is ${assetsPath}`);
        return;
      }

      fs.readdir(assetsPath, "utf-8", (err, files) => {
        if (err) return;

        res.writeHead(200, { "content-type": "text/html" });
        res.write(`<h2>FILES IS:</h2>`);
        res.write(`<ul>`);
        files.forEach((file) => {
          res.write(`<li>
                        <span>${file} <button>Delete</button></span>
                    </li>`);
        });
        res.write(`</ul>`);
        res.end();
      });
    });
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("Error\n");
  }
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// "scripts": {
//   "build": "tsc -p .",
//   "start": "node dist/index.js",
//   "dev": "nodemon --watch src --ext ts --exec ts-node ./src/index.ts"
// }
