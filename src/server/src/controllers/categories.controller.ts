import dbPromise from "../utils/database";
import { Category } from "../models/category.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";

/**
 * Asynchronous controller function to add a category to the database.
 * @param category - category of type Category to be added to the database
 * @returns the ID of the added category if the query was successful, a FailureResponse otherwise
 */
export async function addCategory(
  category: Category
): Promise<number | FailureResponse> {
  if (!category.name || !category.multiplier) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;
    const query = "INSERT INTO categories (name, multiplier) VALUES (?, ?)";
    const params = [category.name, category.multiplier];

    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to add category");
    }
    
    return res.lastID;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all categories from the database.
 * @returns an array of categories if the query was successful, a FailureResponse otherwise
 */
export async function getAllCategories(): Promise<Category[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM categories";

    const categories = await db.all<Category[]>(query);
    return categories;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get a category by ID from the database.
 * @param id - the ID of the category to be retrieved
 * @returns an array containing a category if the query was successful, a FailureResponse otherwise
 */
export async function getCategoryByID(id: number): Promise<Category[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM categories WHERE id = ?";
    const params = [id];

    const categories = await db.all<Category[]>(query, params);
    return categories;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get a category by name from the database.
 * @param name - the name of the category to be retrieved
 * @returns an array containing a category if the query was successful, a FailureResponse otherwise
 */
export async function getCategoryByName(name: string): Promise<Category[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM categories WHERE name = ?";
    const params = [name];

    const categories = await db.all<Category[]>(query, params);
    return categories;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to update a category in the database.
 * @param category - category of type Category to be updated in the database
 * @returns a SuccessResponse if the category was updated successfully, a FailureResponse otherwise
 */
export async function updateCategory(
  category: Category
): Promise<SuccessResponse | FailureResponse> {
  if (!category.id) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;

    if (category.name) {
      const query = "UPDATE categories SET name = ? WHERE id = ?";
      const params = [category.name, category.id];
      await db.run(query, params);
    }
    if (category.multiplier) {
      const query = "UPDATE categories SET multiplier = ? WHERE id = ?";
      const params = [category.multiplier, category.id];
      await db.run(query, params);
    }
    
    return new SuccessResponse(200, "successfully updated category");
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to delete a category from the database.
 * @param id - the ID of the category to be deleted
 * @returns a SuccessResponse if the category was deleted successfully, a FailureResponse otherwise
 */
export async function deleteCategory(id: number): Promise<SuccessResponse | FailureResponse> {
  if (!id) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;
    const query = "DELETE FROM categories WHERE id = ?";
    const params = [id];

    await db.run(query, params);
    return new SuccessResponse(200, "successfully deleted category");
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}
