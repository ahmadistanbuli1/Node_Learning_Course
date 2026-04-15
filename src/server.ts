import express from "express";

const app = express();

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Ahmad",
  },
  {
    id: 2,
    name: "Ahm",
  },
  {
    id: 3,
    name: "A",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello Express</h1>");
});

app.get("/products", (req, res) => {
  res.send(DUMMY_PRODUCTS);
});

app.get(`/products/:id`, (req, res) => {
  console.log(req.params);
  const productId = +req.params.id;
  if (isNaN(productId)) {
    res.status(404).send({ message: "Invalid Id" });
  }
  const findProduct = DUMMY_PRODUCTS.find(
    (product) => product.id === productId,
  );

  findProduct ? res.send(findProduct) : res.send("No Products By This Id");
});

const PORT: number = 5000;

app.listen(PORT, () => {
  console.log(`Server is http://localhost:${PORT}`);
});
