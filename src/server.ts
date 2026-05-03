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

app.get("/products", (req, res) => {
  res.send(PRODUCTS);
});

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

app.get("/products/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(404).send(`Invalid ID`);
    return;
  }

  const product: IProduct | undefined = PRODUCTS.find((p) => p.id === id);
  product ? res.send(product) : res.send(`Product Not Found`);
});

const PORT: number = 5000;

app.listen(PORT, () => {
  console.log(`Server Starting with => http://localhost:${PORT}`);
});
