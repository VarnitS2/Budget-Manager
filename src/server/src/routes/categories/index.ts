import express, { Router } from "express";
import { FailureResponse } from "../../utils/responses";
import {
  addCategory,
  getAllCategories,
  getCategoryByID,
  getCategoryByName,
  updateCategory,
  deleteCategory,
} from "../../controllers/categories.controller";
import { Category } from "../../models/category.model";

const categoriesRoute: Router = express.Router();

categoriesRoute.get("/", (req, res) => {
  res.status(200).send({ message: "You've reached the categories endpoint" });
});

/**
 * @swagger
 * /categories/add/{name}/{multiplier}:
 *  post:
 *    description: Adds a category to the database
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: name of the category to be added to the database
 *        schema:
 *          type: string
 *      - in: path
 *        name: multiplier
 *        required: true
 *        description: transaction amount multiplier of the category to be added to the database (-1 or 1)
 *        schema:
 *          type: number
 *    operationId: addCategory
 *    responses:
 *      201:
 *        description: success message for adding a category
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: successfully added category
 *      500:
 *        description: failure message for adding a category
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to add category
 */
categoriesRoute.post("/add/:name/:multiplier", async (req, res) => {
  try {
    const response = await addCategory({
      name: req.params.name,
      multiplier: parseInt(req.params.multiplier),
    });
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
 * /categories/all:
 *  get:
 *    description: Gets all categories from the database
 *    operationId: getAllCategories
 *    responses:
 *      200:
 *        description: success response containing an array of all categories
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
 *                      description: the serial ID of the category
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: the name of the category
 *                      example: "Food"
 *                    multiplier:
 *                      type: number
 *                      description: the transaction amount multiplier of the category
 *                      example: 1.0
 *      500:
 *        description: failure message for getting all categories
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get categories
 */
categoriesRoute.get("/all", async (req, res) => {
  try {
    const response = await getAllCategories();
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ categories: response });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /categories/by-id/{id}:
 *  get:
 *    description: Gets a category by ID from the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the category to be retrieved from the database
 *        schema:
 *          type: integer
 *    operationId: getCategoryByID
 *    responses:
 *      200:
 *        description: success response containing an array of categories with the specified ID
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
 *                      description: the serial ID of the category
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: the name of the category
 *                      example: "Food"
 *                    multiplier:
 *                      type: number
 *                      description: the transaction amount multiplier of the category
 *                      example: 1.0
 *      500:
 *        description: failure message for getting category by id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get categories
 */
categoriesRoute.get("/by-id/:id", async (req, res) => {
  try {
    const response = await getCategoryByID(parseInt(req.params.id));
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ categories: response });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /categories/by-name/{name}:
 *  get:
 *    description: Gets a category by name from the database
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: the name of the category to be retrieved from the database
 *        schema:
 *          type: string
 *    operationId: getCategoryByName
 *    responses:
 *      200:
 *        description: success response containing an array of categories with the specified name
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
 *                      description: the serial ID of the category
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: the name of the category
 *                      example: "Food"
 *                    multiplier:
 *                      type: number
 *                      description: the transaction amount multiplier of the category
 *                      example: 1.0
 *      500:
 *        description: failure message for getting category by name
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to get categories
 */
categoriesRoute.get("/by-name/:name", async (req, res) => {
  try {
    const response = await getCategoryByName(req.params.name);
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(200).send({ categories: response });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

/**
 * @swagger
 * /categories/update/{id}/{name}/{multiplier}:
 *  put:
 *    description: Updates a category by ID in the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the category to be updated in the database
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: the new name of the category to be updated in the database
 *                example: "Food"
 *              multiplier:
 *                type: number
 *                description: the new transaction amount multiplier of the category to be updated in the database
 *                example: 1.0
 *    operationId: updateCategory
 *    responses:
 *      200:
 *        description: success message for updating a category
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: category updated successfully
 *      500:
 *        description: failure message for updating a category
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to update category
 */
categoriesRoute.put("/update/:id", async (req, res) => {
  try {
    const category: Category = req.body;
    category.id = parseInt(req.params.id);
    const response = await updateCategory(category);
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
 * /categories/delete/{id}:
 *  delete:
 *    description: Deletes a category by ID from the database
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: the ID of the category to be deleted from the database
 *        schema:
 *          type: integer
 *    operationId: deleteCategory
 *    responses:
 *      200:
 *        description: success message for deleting a category
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: category deleted successfully
 *      500:
 *        description: failure message for deleting a category
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: failed to delete category
 */
categoriesRoute.delete("/delete/:id", async (req, res) => {
  try {
    const response = await deleteCategory(parseInt(req.params.id));
    if (response instanceof FailureResponse) {
      res.status(response.status).send({ error: response.error });
    } else {
      res.status(response.status).send({ message: response.message });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

export default categoriesRoute;
