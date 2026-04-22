import express from "express";
import { generateFakeData } from "./utils/fakeData";
import { IProduct } from "./interfaces";

const app = express();

const FAKE_PRODUCTS = generateFakeData();

app.get("/", (req, res) => {
  res.send(`<h1>Hello Express</h1>`);
});

app.get("/products", (req, res) => {
  // * Dealing With Query Params Example
  const filterQuery = req.query.filter as string;
  console.log(filterQuery);

  if (filterQuery) {
    const propertiesToFilter = filterQuery.split(",");
    let filteredProducts = [];
    filteredProducts = FAKE_PRODUCTS.map((product) => {
      const filteredProduct: any = {};
      propertiesToFilter.forEach((property) => {
        if (property in product) {
          filteredProduct[property as keyof IProduct] =
            product[property as keyof IProduct];
        }
      });
      return { id: product.id, ...filteredProduct };
    });
    res.send(filteredProducts);
    return;
  }

  res.send(FAKE_PRODUCTS);
});

app.get(`/products/:id`, (req, res) => {
  console.log(req.params);
  const productId = +req.params.id;
  if (isNaN(productId)) {
    res.status(404).send({ message: "Invalid Id" });
  }
  const findProduct = FAKE_PRODUCTS.find((product) => product.id === productId);

  findProduct
    ? res.send(findProduct)
    : res.status(404).send({ message: "Product not found" });
});

const PORT: number = 5000;

app.listen(PORT, () => {
  console.log(`Server is http://localhost:${PORT}`);
});
