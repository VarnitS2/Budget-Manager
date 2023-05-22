import express, { Router } from "express";
import { FailureResponse } from "../../utils/responses";
import {
  addMerchant,
  getAllMerchants,
  getMerchantByID,
  getMerchantByName,
  updateMerchant,
  deleteMerchant,
} from "../../controllers/merchants.controller";

const merchantsRoute: Router = express.Router();

merchantsRoute.get("/", (req, res) => {
  res.status(200).send({ message: "You've reached the merchants endpoint" });
});

/**
 * @swagger
 * /merchants/add/{name}:
 *  post:
 *    description: Adds a merchant to the database
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: name of the merchant to be added to the database
 *        schema:
 *          type: string
 *    operationId: addMerchant
 *    responses:
 *      201:
 *        description: success message for adding a merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: successfully added merchant
 *      500:
 *        description: failure message for adding a merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to add merchant
 */
merchantsRoute.post("/add/:name", async (req, res) => {
  try {
    const response = await addMerchant(req.params.name);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(response.status).send({ message: response.message });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /merchants/all:
 *  get:
 *    description: Gets all merchants from the database
 *    operationId: getAllMerchants
 *    responses:
 *      200:
 *        description: success response containing an array of merchants
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                merchants:
 *                  type: array
 *                  items:
 *                    id:
 *                      type: integer
 *                      description: the serial ID of the merchant
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: the name of the merchant
 *                      example: "Amazon"
 *      500:
 *        description: failure message for getting all merchants
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get merchants
 */
merchantsRoute.get("/all", async (req, res) => {
  try {
    const response = await getAllMerchants();
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ merchants: response });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /merchants/by-id/{id}:
 *  get:
 *    description: Gets a merchant by ID from the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the merchant to be retrieved from the database
 *        schema:
 *          type: integer
 *    operationId: getMerchantByID
 *    responses:
 *      200:
 *        description: success response containing an array of merchants
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                merchants:
 *                  type: array
 *                  items:
 *                    id:
 *                      type: integer
 *                      description: the serial ID of the merchant
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: the name of the merchant
 *                      example: "Amazon"
 *      500:
 *        description: failure message for getting merchant by id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get merchants
 */
merchantsRoute.get("/by-id/:id", async (req, res) => {
  try {
    const response = await getMerchantByID(parseInt(req.params.id));
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ merchants: response });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /merchants/by-name/{name}:
 *  get:
 *    description: Gets a merchant by name from the database
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: the name of the merchant to be retrieved from the database
 *        schema:
 *          type: string
 *    operationId: getMerchantByName
 *    responses:
 *      200:
 *        description: success response containing an array of merchants
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                merchants:
 *                  type: array
 *                  items:
 *                    id:
 *                      type: integer
 *                      description: the serial ID of the merchant
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: the name of the merchant
 *                      example: "Amazon"
 *      500:
 *        description: failure message for getting merchant by name
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get merchants
 */
merchantsRoute.get("/by-name/:name", async (req, res) => {
  try {
    const response = await getMerchantByName(req.params.name);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ merchants: response });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /merchants/update/{id}/{name}:
 *  put:
 *    description: Updates a merchant by ID in the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the merchant to be updated in the database
 *        schema:
 *          type: integer
 *      - in: path
 *        name: name
 *        required: true
 *        description: the new name of the merchant to be updated in the database
 *        schema:
 *          type: string
 *    operationId: updateMerchant
 *    responses:
 *      200:
 *        description: success message for updating a merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: merchant updated successfully
 *      500:
 *        description: failure message for updating a merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to update merchant
 */
merchantsRoute.put("/update/:id/:name", async (req, res) => {
  try {
    const response = await updateMerchant({ id: parseInt(req.params.id), name: req.params.name });
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ message: response.message });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /merchants/delete/{id}:
 *  delete:
 *    description: Deletes a merchant by ID from the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the merchant to be deleted from the database
 *        schema:
 *          type: integer
 *    operationId: deleteMerchant
 *    responses:
 *      200:
 *        description: success message for deleting a merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: merchant deleted successfully
 *      500:
 *        description: failure message for deleting a merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to delete merchant
 */
merchantsRoute.delete("/delete/:id", async (req, res) => {
  try {
    const response = await deleteMerchant(parseInt(req.params.id));
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ message: response.message });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

export default merchantsRoute;
