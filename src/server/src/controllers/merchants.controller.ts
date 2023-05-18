import db from "../utils/database";
import { Merchant } from "../models/merchant.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";

/**
 * Asynchronous controller function to add a merchant to the database.
 * @param name - name of the merchant to be added to the database
 * @returns a SuccessResponse if the merchant was added successfully, a FailureResponse otherwise
 */
export async function addMerchant(name: string): Promise<SuccessResponse | FailureResponse> {
  if (!name) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const query = "INSERT INTO merchants (name) VALUES (?)";
    const params = [name];

    db.run(query, params, (err, res) => {
      if (err) {
        return new FailureResponse(500, err.message);
      }
      return new SuccessResponse(201, "successfully added merchant");
    });

    return new FailureResponse(500, "failed to add merchant");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to get all merchants from the database.
 * @returns an array of merchants if the query was successful, a FailureResponse otherwise
 */
export async function getAllMerchants(): Promise<Merchant[] | FailureResponse> {
  try {
    const query = "SELECT * FROM merchants";
    const params = [];

    db.all(query, params, (err, res) => {
      if (err) {
        return new FailureResponse(500, err.message);
      }
      return res;
    });

    return new FailureResponse(500, "failed to get merchants");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to get a merchant by ID from the database.
 * @param id - the ID of the merchant to be retrieved
 * @returns an array containing a merchant if the query was successful, a FailureResponse otherwise
 */
export async function getMerchantByID(id: number): Promise<Merchant[] | FailureResponse> {
  try {
    const query = "SELECT * FROM merchants WHERE id = ?";
    const params = [id];

    db.all(query, params, (err, res) => {
      if (err) {
        return new FailureResponse(500, err.message);
      }
      return res;
    });

    return new FailureResponse(500, "failed to get merchant");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to get a merchant by name from the database.
 * @param name - the name of the merchant to be retrieved
 * @returns an array containing a merchant if the query was successful, a FailureResponse otherwise
 */
export async function getMerchantByName(name: string): Promise<Merchant[] | FailureResponse> {
  try {
    const query = "SELECT * FROM merchants WHERE name = ?";
    const params = [name];

    db.all(query, params, (err, res) => {
      if (err) {
        return new FailureResponse(500, err.message);
      }
      return res;
    });

    return new FailureResponse(500, "failed to get merchant");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to update a merchant in the database.
 * @param merchant - merchant of type Merchant to be updated in the database
 * @returns a SuccessResponse if the merchant was updated successfully, a FailureResponse otherwise
 */
export async function updateMerchant(
  merchant: Merchant
): Promise<SuccessResponse | FailureResponse> {
  if (!merchant.id || !merchant.name) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const query = "UPDATE merchants SET name = ? WHERE id = ?";
    const params = [merchant.name, merchant.id];

    db.run(query, params, (err, res) => {
      if (err) {
        return new FailureResponse(500, err.message);
      }
      return new SuccessResponse(200, "successfully updated merchant");
    });

    return new FailureResponse(500, "failed to update merchant");
  } catch (err) {
    return new FailureResponse(500, err);
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
    const query = "DELETE FROM merchants WHERE id = ?";
    const params = [id];

    db.run(query, params, (err, res) => {
      if (err) {
        return new FailureResponse(500, err.message);
      }
      return new SuccessResponse(200, "successfully deleted merchant");
    });

    return new FailureResponse(500, "failed to delete merchant");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}
