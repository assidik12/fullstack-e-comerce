const express = require("express");
const transactions = express.Router();
const response = require("../helpers/response");
const { randomOrderNumber } = require("../helpers/utils");
const midtrans = require("midtrans-client");
const { fetchTransaction, addTransaction } = require("../controllers/transactions");

let snap = new midtrans.Snap({
  isProduction: false,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

transactions.route("/").post(async (req, res) => {
  const { total_price, paid_amount, products } = req.body;

  const order = {
    no_order: randomOrderNumber(),
    total_price,
    paid_amount,
  };

  try {
    const token = await snap.createTransaction({ transaction_details: { order_id: order.no_order, gross_amount: order.total_price } });
    const result = await addTransaction(order, products);
    response.success({ data: result, token }, "transaction created!", res);
  } catch (err) {
    response.error({ error: err.message }, req.originalUrl, 403, res);
  }
});

transactions.route("/").get(async (req, res) => {
  try {
    const result = await fetchTransaction();
    response.success(result, "tranasaction fatched!", res);
  } catch (err) {
    response.error({ error: err.message }, req.originalUrl, 403, res);
  }
});

module.exports = transactions;
