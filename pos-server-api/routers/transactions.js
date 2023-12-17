const express = require("express");
const transactions = express.Router();
const response = require("../helpers/response");
const { randomOrderNumber } = require("../helpers/utils");
const midtrans = require("midtrans-client");
const { fetchTransaction, addTransaction } = require("../controllers/transactions");

let snap = new midtrans.Snap({
  isProduction: false,
  clientKey: process.env.EXPRESS_PUBLIC_CLIENT,
  serverKey: process.env.SECRET,
});

transactions.route("/").post(async (req, res) => {
  const { total_price, paid_amount, products } = req.body;
  console.log(products);

  const order = {
    no_order: randomOrderNumber(),
    total_price,
    paid_amount,
  };

  try {
    const result = await addTransaction(order, products);
    response.success(result, "transaction created!", res);
  } catch (err) {
    response.error({ error: err.message }, req.originalUrl, 403, res);
  }
});

transactions.route("/").get(async (req, res) => {
  try {
    const result = await fetchTransaction();
    const field = result.transactions.pop();

    const token = await snap.createTransaction({ transaction_details: { order_id: field.no_order, gross_amount: field.total_price } });
    response.success(result, token, res);
  } catch (err) {
    response.error({ error: err.message }, req.originalUrl, 403, res);
  }
});

module.exports = transactions;
