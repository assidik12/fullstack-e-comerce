const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    swagger: "2.0",
    title: "ONLINE-STORE API DOCS",
    openapi: "3.1.0",
    info: {
      title: "ONLINE-STORE API DOCS",
      description: "POS-SERVER API Documentation For People",
    },
    schemes: ["dev-sandbox", "stagging", "production"],
  },
  apis: ["./routers/*.js"],
};
const PORT = 3000;
const app = express();

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Ready To GO!");
});

const product = require("./routers/products");
const transactions = require("./routers/transactions");

app.use("/products", product);
app.use("/transactions", transactions);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
