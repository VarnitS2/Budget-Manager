import express, { Router } from "express";
import { FailureResponse } from "../../utils/responses";
import { addTransaction } from "../../controllers/transactions.controller";

const transactionsRoute: Router = express.Router();

transactionsRoute.get("/", (req, res) => {
  res.status(200).send({ message: "You've reached the transactions endpoint" });
});
