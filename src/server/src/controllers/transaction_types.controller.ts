import dbPromise from "../utils/database";
import { TransactionType } from "../models/transaction_type.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";

/**
 * Asynchronous controller function to add a transaction type to the database.
 * @param type - transaction type to be added to the database
 * @returns a SuccessResponse if the transaction type was added successfully, a FailureResponse otherwise
 */
export async function addTransactionType(type: string): Promise<SuccessResponse | FailureResponse> {
  if (!type) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;
    const query = "INSERT INTO transaction-types (type) VALUES (?)";
    const params = [type];

    await db.run(query, params);
    return new SuccessResponse(201, "successfully added transaction type");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to get all transaction types from the database.
 * @returns an array of transaction types if the query was successful, a FailureResponse otherwise
 */
export async function getAllTransactionTypes(): Promise<TransactionType[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM transaction-types";

    const types = await db.all<TransactionType[]>(query);
    return types;
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to get a transaction type by ID from the database.
 * @param id - the ID of the transaction type to be retrieved
 * @returns an array containing a transaction type if the query was successful, a FailureResponse otherwise
 */
export async function getTransactionTypeByID(
  id: number
): Promise<TransactionType[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM transaction-types WHERE id = ?";
    const params = [id];

    const types = await db.all<TransactionType[]>(query, params);
    return types;
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to get a transaction type by type from the database.
 * @param type - the type of the transaction type to be retrieved
 * @returns an array containing a transaction type if the query was successful, a FailureResponse otherwise
 */
export async function getTransactionTypeByType(
  type: string
): Promise<TransactionType[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM transaction-types WHERE type = ?";
    const params = [type];

    const types = await db.all<TransactionType[]>(query, params);
    return types;
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to update a transaction type in the database.
 * @param type - transaction type of type TransactionType to be updated in the database
 * @returns a SuccessResponse if the transaction type was updated successfully, a FailureResponse otherwise
 */
export async function updateTransactionType(
  type: TransactionType
): Promise<SuccessResponse | FailureResponse> {
  if (!type.id || !type.type) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;
    const query = "UPDATE transaction-types SET type = ? WHERE id = ?";
    const params = [type.type, type.id];

    await db.run(query, params);
    return new SuccessResponse(200, "successfully updated transaction type");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}

/**
 * Asynchronous controller function to delete a transaction type from the database.
 * @param id - the ID of the transaction type to be deleted
 * @returns a SuccessResponse if the transaction type was deleted successfully, a FailureResponse otherwise
 */
export async function deleteTransactionType(
  id: number
): Promise<SuccessResponse | FailureResponse> {
  if (!id) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;
    const query = "DELETE FROM transaction-types WHERE id = ?";
    const params = [id];

    await db.run(query, params);
    return new SuccessResponse(200, "successfully deleted transaction type");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}
