import express from "express";
import { IProduct } from "./interfaces";
import { generateFakeData } from "./utils/fakeData";

const app = express();

//It Is A Middleware, For Parsing application/json
app.use(
  express.json({
    // type Refer To Content-Type In Header
    type: "application/json",
  }),
);

const PRODUCTS: IProduct[] = generateFakeData();

app.get("/", (req, res) => {
  res.send("<h1>Welcome In Main Page</h1>");
});

// Get Request
app.get("/products", (req, res) => {
  res.send(PRODUCTS);
});

// Post Request
app.post("/products", (req, res) => {
  const newProduct: IProduct = {
    id: PRODUCTS.length + 1,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
  };

  PRODUCTS.push(newProduct);

  res.status(201).send({
    message: "Product Created Successfully",
    product: newProduct,
  });
});

// Patch Request
app.patch("/products/:id", (req, res) => {
  const idProduct: number = parseInt(req.params.id);

  if (isNaN(idProduct)) {
    res.status(404).send({ message: `Invalid ID` });
    return;
  }

  const productIndex: number = PRODUCTS.findIndex((p) => p.id === idProduct);
  if (productIndex === -1) {
    res.status(404).send({ message: `Product Not Found` });
    return;
  }

  PRODUCTS[productIndex] = {
    ...PRODUCTS[productIndex],
    ...req.body,
  };
  res.status(200).send({
    message: "Product Updated Successfully",
    product: PRODUCTS[productIndex],
  });
});

// Delete Request
app.delete("/products/:id", (req, res) => {
  const idProduct: number = parseInt(req.params.id);
  if (isNaN(idProduct)) {
    res.status(404).send({ message: `Invalid ID` });
    return;
  }
  const productIndex: number = PRODUCTS.findIndex((p) => p.id === idProduct);
  if (productIndex === -1) {
    res.status(404).send({ message: `Product Not Found` });
    return;
  }
  PRODUCTS.splice(productIndex, 1);
  // Or By Filter Method
  // PRODUCTS = PRODUCTS.filter((p) => p.id !== idProduct);
  // Send Response
  res.status(200).send({ message: "Product Deleted Successfully" });
});

// Get Product By ID
app.get("/products/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(404).send({ message: `Invalid ID` });
    return;
  }

  const product: IProduct | undefined = PRODUCTS.find((p) => p.id === id);
  product
    ? res.send(product)
    : res.status(404).send({ message: `Product Not Found` });
});

const PORT: number = 5000;

app.listen(PORT, () => {
  console.log(`Server Starting with => http://localhost:${PORT}`);
});
