import dbPromise from "../utils/database";
import { Merchant, MerchantRequest } from "../models/merchant.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import { addCategory, getCategoryByName } from "./categories.controller";

/**
 * Asynchronous controller function to add a merchant to the database.
 * @param merchant - merchant of type MerchantRequest to be added to the database
 * @returns the ID of the added merchant if the query was successful, a FailureResponse otherwise
 */
export async function addMerchant(merchant: MerchantRequest): Promise<number | FailureResponse> {
  if (!merchant.name || !merchant.categoryName) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const categoriesRes = await getCategoryByName(merchant.categoryName);
    if (categoriesRes instanceof FailureResponse) {
      return categoriesRes;
    }

    let categoryID: number;
    if (categoriesRes.length === 0) {
      if (!merchant.multiplier) {
        return new FailureResponse(400, "missing required parameters [multiplier]");
      }
      const categoriesCreateRes = await addCategory({
        name: merchant.categoryName,
        multiplier: merchant.multiplier,
      });
      if (categoriesCreateRes instanceof FailureResponse) {
        return categoriesCreateRes;
      }
      categoryID = categoriesCreateRes;
    } else {
      categoryID = categoriesRes[0].id!;
    }

    const db = await dbPromise;
    const query = "INSERT INTO merchants (name, categoryID) VALUES (?, ?)";
    const params = [merchant.name, categoryID];

    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to add merchant");
    }

    return res.lastID;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all merchants from the database.
 * @returns an array of merchants if the query was successful, a FailureResponse otherwise
 */
export async function getAllMerchants(): Promise<Merchant[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM merchants";

    const merchants = await db.all<Merchant[]>(query);
    return merchants;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get a merchant by ID from the database.
 * @param id - the ID of the merchant to be retrieved
 * @returns an array containing a merchant if the query was successful, a FailureResponse otherwise
 */
export async function getMerchantByID(id: number): Promise<Merchant[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM merchants WHERE id = ?";
    const params = [id];

    const merchants = await db.all<Merchant[]>(query, params);
    return merchants;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get a merchant by name from the database.
 * @param name - the name of the merchant to be retrieved
 * @returns an array containing a merchant if the query was successful, a FailureResponse otherwise
 */
export async function getMerchantByName(name: string): Promise<Merchant[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM merchants WHERE name = ?";
    const params = [name];

    const merchants = await db.all<Merchant[]>(query, params);
    return merchants;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all merchants by category ID from the database.
 * @param categoryID - the ID of the category of the merchants to be retrieved
 * @returns an array of merchants if the query was successful, a FailureResponse otherwise
 */
export async function getMerchantsByCategoryID(
  categoryID: number
): Promise<Merchant[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM merchants WHERE categoryID = ?";
    const params = [categoryID];

    const merchants = await db.all<Merchant[]>(query, params);
    return merchants;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all merchants by category name from the database.
 * @param categoryName - the name of the category of the merchants to be retrieved
 * @returns an array of merchants if the query was successful, a FailureResponse otherwise
 */
export async function getMerchantsByCategoryName(
  categoryName: string
): Promise<Merchant[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `
      SELECT merchants.id, merchants.name, merchants.categoryID
      FROM merchants
      INNER JOIN categories ON merchants.categoryID = categories.id
      WHERE categories.name = ?
    `;
    const params = [categoryName];

    const merchants = await db.all<Merchant[]>(query, params);
    return merchants;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to update a merchant in the database.
 * @param merchant - merchant of type MerchantRequest to be updated in the database
 * @returns a SuccessResponse if the merchant was updated successfully, a FailureResponse otherwise
 */
export async function updateMerchant(
  merchant: MerchantRequest
): Promise<SuccessResponse | FailureResponse> {
  if (!merchant.id) {
    return new FailureResponse(400, "missing required parameters [id]");
  }

  try {
    const db = await dbPromise;

    if (merchant.name) {
      const query = "UPDATE merchants SET name = ? WHERE id = ?";
      const params = [merchant.name, merchant.id];
      await db.run(query, params);
    }
    
    if (merchant.categoryName) {
      const categoriesRes = await getCategoryByName(merchant.categoryName);
      if (categoriesRes instanceof FailureResponse) {
        return categoriesRes;
      }
      let categoryID: number;
      if (categoriesRes.length === 0) {
        if (!merchant.multiplier) {
          return new FailureResponse(400, "missing required parameters [multiplier]");
        }
        const categoriesCreateRes = await addCategory({
          name: merchant.categoryName,
          multiplier: merchant.multiplier,
        });
        if (categoriesCreateRes instanceof FailureResponse) {
          return categoriesCreateRes;
        }
        categoryID = categoriesCreateRes;
      } else {
        categoryID = categoriesRes[0].id!;
      }

      const query = "UPDATE merchants SET categoryID = ? WHERE id = ?";
      const params = [categoryID, merchant.id];
      await db.run(query, params);
    }

    return new SuccessResponse(200, "successfully updated merchant");
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to delete a merchant from the database.
 * @param id - the ID of the merchant to be deleted
 * @returns a SuccessResponse if the merchant was deleted successfully, a FailureResponse otherwise
 */
export async function deleteMerchant(id: number): Promise<SuccessResponse | FailureResponse> {
  if (!id) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;
    const query = "DELETE FROM merchants WHERE id = ?";
    const params = [id];

    await db.run(query, params);
    return new SuccessResponse(200, "successfully deleted merchant");
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}
