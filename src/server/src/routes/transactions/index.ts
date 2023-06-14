import express, { Router } from "express";
import { FailureResponse } from "../../utils/responses";
import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionByID,
  getTransactionsByCategoryName,
  getTransactionsByDateRange,
  getTransactionsByMerchantID,
  getTransactionsByMerchantName,
  updateTransaction,
} from "../../controllers/transactions.controller";
import { TransactionRequest } from "../../models/transaction.model";

const transactionsRoute: Router = express.Router();

transactionsRoute.get("/", (req, res) => {
  res.status(200).send({ message: "You've reached the transactions endpoint" });
});

/**
 * @swagger
 * /transactions/add:
 *  post:
 *    description: add a transaction to the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              merchantName:
 *                type: string
 *                description: the name of the merchant of the transaction to be added to the database
 *                example: "Target"
 *              categoryName:
 *                type: string
 *                description: the name of the category of the merchant
 *                example: "Groceries"
 *              categoryMultiplier:
 *                type: number
 *                description: the multiplier of the category
 *                example: -1
 *              amount:
 *                type: number
 *                description: the amount of the transaction
 *                example: 100.00
 *              date:
 *                type: string
 *                description: the date of the transaction
 *                example: "06/13/2023"
 *    operationId: addTransaction
 *    responses:
 *      200:
 *        description: success message for adding a transaction
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: transaction added successfully
 *      500:
 *        description: error message for failing to add a transaction
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: error adding transaction
 */
transactionsRoute.post("/add", async (req, res) => {
  try {
    const transaction: TransactionRequest = req.body;
    const response = await addTransaction(transaction);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ id: response });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/all:
 *  get:
 *    description: get all transactions from the database
 *    operationId: getAllTransactions
 *    responses:
 *      200:
 *        description: success response containing an array of transactions and metrics
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    transactions:
 *                      type: array
 *                      items:
 *                        id:
 *                          type: number
 *                          description: the serial id of the transaction
 *                          example: 1
 *                        merchantName:
 *                          type: string
 *                          description: the name of the merchant of the transaction
 *                          example: "Target"
 *                        categoryName:
 *                          type: string
 *                          description: the name of the category of the merchant
 *                          example: "Groceries"
 *                        categoryMultiplier:
 *                          type: number
 *                          description: the multiplier of the category
 *                          example: -1
 *                        amount:
 *                          type: number
 *                          description: the amount of the transaction
 *                          example: 100.00
 *                        date:
 *                          type: string
 *                          description: the date of the transaction
 *                          example: "06/13/2023"
 *                    metrics:
 *                      type: object
 *                      properties:
 *                        transactionCount:
 *                          type: number
 *                          description: the number of transactions
 *                          example: 1
 *                        positiveTransactionCount:
 *                          type: number
 *                          description: the number of positive transactions
 *                          example: 1
 *                        negativeTransactionCount:
 *                          type: number
 *                          description: the number of negative transactions
 *                          example: 1
 *                        merchantCount:
 *                          type: number
 *                          description: the number of merchants
 *                          example: 1
 *                        categoryCount:
 *                          type: number
 *                          description: the number of categories
 *                          example: 1
 *                        dayCount:
 *                          type: number
 *                          description: the number of days
 *                          example: 1
 *                        balance:
 *                          type: number
 *                          description: the overall balance of the transactions
 *                          example: 100.00
 *                        netPositive:
 *                          type: number
 *                          description: the sum of all positive transactions
 *                          example: 100.00
 *                        netNegative:
 *                          type: number
 *                          description: the sum of all negative transactions
 *                          example: 100.00
 *                        averagePositive:
 *                          type: number
 *                          description: the average of all positive transactions
 *                          example: 100.00
 *                        averageNegative:
 *                          type: number
 *                          description: the average of all negative transactions
 *                          example: 100.00
 *                        maximumNegative:
 *                          type: number
 *                          description: the maximum of all negative transactions
 *                          example: 100.00
 *                        minimumNegative:
 *                          type: number
 *                          description: the minimum of all negative transactions
 *                          example: 100.00
 *                        positivePerDay:
 *                          type: number
 *                          description: the average positive amount per day
 *                          example: 30.00
 *                        negativePerDay:
 *                          type: number
 *                          description: the average negative amount per day
 *                          example: 30.00
 *      500:
 *        description: failure message for getting all transactions
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get transactions
 */
transactionsRoute.get("/all", async (req, res) => {
  try {
    const response = await getAllTransactions();
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ transactions: response });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/by-id/{id}:
 *  get:
 *    description: get a transaction by id from the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the transaction to be retrieved from the database
 *        schema:
 *          type: integer
 *    operationId: getTransactionByID
 *    responses:
 *      200:
 *        description: success response containing an array of transactions
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    id:
 *                      type: integer
 *                      description: the serial ID of the transaction
 *                      example: 1
 *                    merchantName:
 *                      type: string
 *                      description: the name of the merchant of the transaction
 *                      example: "Target"
 *                    categoryName:
 *                      type: string
 *                      description: the name of the category of the merchant
 *                      example: "Groceries"
 *                    categoryMultiplier:
 *                      type: number
 *                      description: the multiplier of the category
 *                      example: -1
 *                    amount:
 *                      type: number
 *                      description: the amount of the transaction
 *                      example: 100.00
 *                    date:
 *                      type: string
 *                      description: the date of the transaction
 *                      example: "06/13/2023"
 *      500:
 *        description: failure message for getting a transaction by id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get transaction
 */
transactionsRoute.get("/by-id/:id", async (req, res) => {
  try {
    const response = await getTransactionByID(parseInt(req.params.id));
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ transactions: response });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/by-merchant-id/{id}:
 *  get:
 *    description: get all transactions by merchant id from the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the merchant of the transactions to be retrieved from the database
 *        schema:
 *          type: integer
 *    operationId: getTransactionsByMerchantID
 *    responses:
 *      200:
 *        description: success response containing an array of transactions and metrics
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    transactions:
 *                      type: array
 *                      items:
 *                        id:
 *                          type: number
 *                          description: the serial id of the transaction
 *                          example: 1
 *                        merchantName:
 *                          type: string
 *                          description: the name of the merchant of the transaction
 *                          example: "Target"
 *                        categoryName:
 *                          type: string
 *                          description: the name of the category of the merchant
 *                          example: "Groceries"
 *                        categoryMultiplier:
 *                          type: number
 *                          description: the multiplier of the category
 *                          example: -1
 *                        amount:
 *                          type: number
 *                          description: the amount of the transaction
 *                          example: 100.00
 *                        date:
 *                          type: string
 *                          description: the date of the transaction
 *                          example: "06/13/2023"
 *                    metrics:
 *                      type: object
 *                      properties:
 *                        transactionCount:
 *                          type: number
 *                          description: the number of transactions
 *                          example: 1
 *                        positiveTransactionCount:
 *                          type: number
 *                          description: the number of positive transactions
 *                          example: 1
 *                        negativeTransactionCount:
 *                          type: number
 *                          description: the number of negative transactions
 *                          example: 1
 *                        merchantCount:
 *                          type: number
 *                          description: the number of merchants
 *                          example: 1
 *                        categoryCount:
 *                          type: number
 *                          description: the number of categories
 *                          example: 1
 *                        dayCount:
 *                          type: number
 *                          description: the number of days
 *                          example: 1
 *                        balance:
 *                          type: number
 *                          description: the overall balance of the transactions
 *                          example: 100.00
 *                        netPositive:
 *                          type: number
 *                          description: the sum of all positive transactions
 *                          example: 100.00
 *                        netNegative:
 *                          type: number
 *                          description: the sum of all negative transactions
 *                          example: 100.00
 *                        averagePositive:
 *                          type: number
 *                          description: the average of all positive transactions
 *                          example: 100.00
 *                        averageNegative:
 *                          type: number
 *                          description: the average of all negative transactions
 *                          example: 100.00
 *                        maximumNegative:
 *                          type: number
 *                          description: the maximum of all negative transactions
 *                          example: 100.00
 *                        minimumNegative:
 *                          type: number
 *                          description: the minimum of all negative transactions
 *                          example: 100.00
 *                        positivePerDay:
 *                          type: number
 *                          description: the average positive amount per day
 *                          example: 30.00
 *                        negativePerDay:
 *                          type: number
 *                          description: the average negative amount per day
 *                          example: 30.00
 *      500:
 *        description: failure message for getting all transactions by merchant id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get transactions
 */
transactionsRoute.get("/by-merchant-id/:id", async (req, res) => {
  try {
    const response = await getTransactionsByMerchantID(parseInt(req.params.id));
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ transactions: response });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/by-merchant-name/{name}:
 *  get:
 *    description: get all transactions by merchant name from the database
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: the name of the merchant of the transactions to be retrieved from the database
 *        schema:
 *          type: string
 *    operationId: getTransactionsByMerchantName
 *    responses:
 *      200:
 *        description: success response containing an array of transactions and metrics
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    transactions:
 *                      type: array
 *                      items:
 *                        id:
 *                          type: number
 *                          description: the serial id of the transaction
 *                          example: 1
 *                        merchantName:
 *                          type: string
 *                          description: the name of the merchant of the transaction
 *                          example: "Target"
 *                        categoryName:
 *                          type: string
 *                          description: the name of the category of the merchant
 *                          example: "Groceries"
 *                        categoryMultiplier:
 *                          type: number
 *                          description: the multiplier of the category
 *                          example: -1
 *                        amount:
 *                          type: number
 *                          description: the amount of the transaction
 *                          example: 100.00
 *                        date:
 *                          type: string
 *                          description: the date of the transaction
 *                          example: "06/13/2023"
 *                    metrics:
 *                      type: object
 *                      properties:
 *                        transactionCount:
 *                          type: number
 *                          description: the number of transactions
 *                          example: 1
 *                        positiveTransactionCount:
 *                          type: number
 *                          description: the number of positive transactions
 *                          example: 1
 *                        negativeTransactionCount:
 *                          type: number
 *                          description: the number of negative transactions
 *                          example: 1
 *                        merchantCount:
 *                          type: number
 *                          description: the number of merchants
 *                          example: 1
 *                        categoryCount:
 *                          type: number
 *                          description: the number of categories
 *                          example: 1
 *                        dayCount:
 *                          type: number
 *                          description: the number of days
 *                          example: 1
 *                        balance:
 *                          type: number
 *                          description: the overall balance of the transactions
 *                          example: 100.00
 *                        netPositive:
 *                          type: number
 *                          description: the sum of all positive transactions
 *                          example: 100.00
 *                        netNegative:
 *                          type: number
 *                          description: the sum of all negative transactions
 *                          example: 100.00
 *                        averagePositive:
 *                          type: number
 *                          description: the average of all positive transactions
 *                          example: 100.00
 *                        averageNegative:
 *                          type: number
 *                          description: the average of all negative transactions
 *                          example: 100.00
 *                        maximumNegative:
 *                          type: number
 *                          description: the maximum of all negative transactions
 *                          example: 100.00
 *                        minimumNegative:
 *                          type: number
 *                          description: the minimum of all negative transactions
 *                          example: 100.00
 *                        positivePerDay:
 *                          type: number
 *                          description: the average positive amount per day
 *                          example: 30.00
 *                        negativePerDay:
 *                          type: number
 *                          description: the average negative amount per day
 *                          example: 30.00
 *      500:
 *        description: failure message for getting all transactions by merchant name
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get transactions
 */
transactionsRoute.get("/by-merchant-name/:name", async (req, res) => {
  try {
    const response = await getTransactionsByMerchantName(req.params.name);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ transactions: response });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/by-category-name/{name}:
 *  get:
 *    description: get all transactions by category name from the database
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: the name of the category of the transactions to be retrieved from the database
 *        schema:
 *          type: string
 *    operationId: getTransactionsByCategoryName
 *    responses:
 *      200:
 *        description: success response containing an array of transactions and metrics
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    transactions:
 *                      type: array
 *                      items:
 *                        id:
 *                          type: number
 *                          description: the serial id of the transaction
 *                          example: 1
 *                        merchantName:
 *                          type: string
 *                          description: the name of the merchant of the transaction
 *                          example: "Target"
 *                        categoryName:
 *                          type: string
 *                          description: the name of the category of the merchant
 *                          example: "Groceries"
 *                        categoryMultiplier:
 *                          type: number
 *                          description: the multiplier of the category
 *                          example: -1
 *                        amount:
 *                          type: number
 *                          description: the amount of the transaction
 *                          example: 100.00
 *                        date:
 *                          type: string
 *                          description: the date of the transaction
 *                          example: "06/13/2023"
 *                    metrics:
 *                      type: object
 *                      properties:
 *                        transactionCount:
 *                          type: number
 *                          description: the number of transactions
 *                          example: 1
 *                        positiveTransactionCount:
 *                          type: number
 *                          description: the number of positive transactions
 *                          example: 1
 *                        negativeTransactionCount:
 *                          type: number
 *                          description: the number of negative transactions
 *                          example: 1
 *                        merchantCount:
 *                          type: number
 *                          description: the number of merchants
 *                          example: 1
 *                        categoryCount:
 *                          type: number
 *                          description: the number of categories
 *                          example: 1
 *                        dayCount:
 *                          type: number
 *                          description: the number of days
 *                          example: 1
 *                        balance:
 *                          type: number
 *                          description: the overall balance of the transactions
 *                          example: 100.00
 *                        netPositive:
 *                          type: number
 *                          description: the sum of all positive transactions
 *                          example: 100.00
 *                        netNegative:
 *                          type: number
 *                          description: the sum of all negative transactions
 *                          example: 100.00
 *                        averagePositive:
 *                          type: number
 *                          description: the average of all positive transactions
 *                          example: 100.00
 *                        averageNegative:
 *                          type: number
 *                          description: the average of all negative transactions
 *                          example: 100.00
 *                        maximumNegative:
 *                          type: number
 *                          description: the maximum of all negative transactions
 *                          example: 100.00
 *                        minimumNegative:
 *                          type: number
 *                          description: the minimum of all negative transactions
 *                          example: 100.00
 *                        positivePerDay:
 *                          type: number
 *                          description: the average positive amount per day
 *                          example: 30.00
 *                        negativePerDay:
 *                          type: number
 *                          description: the average negative amount per day
 *                          example: 30.00
 *      500:
 *        description: failure message for getting all transactions by category name
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get transactions
 */
transactionsRoute.get("/by-category-name/:name", async (req, res) => {
  try {
    const response = await getTransactionsByCategoryName(req.params.name);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ transactions: response });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/by-date-range:
 *  get:
 *    description: get all transactions between a date range from the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              startDate:
 *                type: string
 *                description: the start date of the date range
 *                example: "06/13/2023"
 *              endDate:
 *                type: string
 *                description: the end date of the date range
 *                example: "06/13/2023"
 *    operationId: getTransactionsByDateRange
 *    responses:
 *      200:
 *        description: success response containing an array of transactions and metrics
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    transactions:
 *                      type: array
 *                      items:
 *                        id:
 *                          type: number
 *                          description: the serial id of the transaction
 *                          example: 1
 *                        merchantName:
 *                          type: string
 *                          description: the name of the merchant of the transaction
 *                          example: "Target"
 *                        categoryName:
 *                          type: string
 *                          description: the name of the category of the merchant
 *                          example: "Groceries"
 *                        categoryMultiplier:
 *                          type: number
 *                          description: the multiplier of the category
 *                          example: -1
 *                        amount:
 *                          type: number
 *                          description: the amount of the transaction
 *                          example: 100.00
 *                        date:
 *                          type: string
 *                          description: the date of the transaction
 *                          example: "06/13/2023"
 *                    metrics:
 *                      type: object
 *                      properties:
 *                        transactionCount:
 *                          type: number
 *                          description: the number of transactions
 *                          example: 1
 *                        positiveTransactionCount:
 *                          type: number
 *                          description: the number of positive transactions
 *                          example: 1
 *                        negativeTransactionCount:
 *                          type: number
 *                          description: the number of negative transactions
 *                          example: 1
 *                        merchantCount:
 *                          type: number
 *                          description: the number of merchants
 *                          example: 1
 *                        categoryCount:
 *                          type: number
 *                          description: the number of categories
 *                          example: 1
 *                        dayCount:
 *                          type: number
 *                          description: the number of days
 *                          example: 1
 *                        balance:
 *                          type: number
 *                          description: the overall balance of the transactions
 *                          example: 100.00
 *                        netPositive:
 *                          type: number
 *                          description: the sum of all positive transactions
 *                          example: 100.00
 *                        netNegative:
 *                          type: number
 *                          description: the sum of all negative transactions
 *                          example: 100.00
 *                        averagePositive:
 *                          type: number
 *                          description: the average of all positive transactions
 *                          example: 100.00
 *                        averageNegative:
 *                          type: number
 *                          description: the average of all negative transactions
 *                          example: 100.00
 *                        maximumNegative:
 *                          type: number
 *                          description: the maximum of all negative transactions
 *                          example: 100.00
 *                        minimumNegative:
 *                          type: number
 *                          description: the minimum of all negative transactions
 *                          example: 100.00
 *                        positivePerDay:
 *                          type: number
 *                          description: the average positive amount per day
 *                          example: 30.00
 *                        negativePerDay:
 *                          type: number
 *                          description: the average negative amount per day
 *                          example: 30.00
 *      500:
 *        description: failure message for getting all transactions between two dates
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get transactions
 */
transactionsRoute.get("/by-date-range", async (req, res) => {
  try {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const response = await getTransactionsByDateRange(startDate, endDate);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ transactions: response });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/update:
 *  put:
 *    description: update a transaction by ID in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              merchantName:
 *                type: string
 *                description: the name of the merchant of the transaction to update
 *                example: "Target"
 *              categoryName:
 *                type: string
 *                description: the name of the category of the merchant
 *                example: "Groceries"
 *              categoryMultiplier:
 *                type: number
 *                description: the multiplier of the category
 *                example: -1
 *              amount:
 *                type: number
 *                description: the amount of the transaction
 *                example: 100.00
 *              date:
 *                type: string
 *                description: the date of the transaction
 *                example: "06/13/2023"
 *    operationId: updateTransaction
 *    responses:
 *      200:
 *        description: success message for updating a transaction
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: transaction updated successfully
 *      500:
 *        description: failure message for updating a transaction
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to update transaction
 */
transactionsRoute.put("/update", async (req, res) => {
  try {
    const transaction: TransactionRequest = req.body;
    const response = await updateTransaction(transaction);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(response.status).send({ message: response.message });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

/**
 * @swagger
 * /transactions/delete/{id}:
 *  delete:
 *    description: Deletes a transaction by ID from the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the transaction to delete
 *        schema:
 *          type: integer
 *    operationId: deleteTransaction
 *    responses:
 *      200:
 *        description: success message for deleting a transaction
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: transaction deleted successfully
 *      500:
 *        description: failure message for deleting a transaction
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to delete transaction
 */
transactionsRoute.delete("/delete/:id", async (req, res) => {
  try {
    const respone = await deleteTransaction(parseInt(req.params.id));
    if (respone instanceof FailureResponse) {
      res.status(respone.status).send({ error: respone.error });
    } else {
      res.status(respone.status).send({ message: respone.message });
    }
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

export default transactionsRoute;
