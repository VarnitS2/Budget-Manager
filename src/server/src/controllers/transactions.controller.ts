import db from "../utils/database";
import { Transaction, TransactionRequest } from "../models/transaction.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import { addMerchant, getMerchantByName } from "./merchants.controller";
import { addTransactionType, getTransactionTypeByType } from "./transaction_types.controller";

/**
 * Asynchronous controller function to add a transaction to the database.
 * @param transaction - transaction of type TransactionRequest to be added to the database
 * @returns a SuccessResponse if the transaction was added successfully, a FailureResponse otherwise
 */
export async function addTransaction(
  transaction: TransactionRequest
): Promise<SuccessResponse | FailureResponse> {
  if (!transaction.merchant || !transaction.type || !transaction.amount || !transaction.date) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    let newTransaction: Transaction = {};

    const merchantRes = await addMerchant(transaction.merchant);
    if (merchantRes instanceof FailureResponse) {
      const merchant = await getMerchantByName(transaction.merchant);
      if (merchant instanceof FailureResponse) {
        return merchant;
      }
      newTransaction.merchantID = merchant[0].id;
    }

    const typeRes = await addTransactionType(transaction.type);
    if (typeRes instanceof FailureResponse) {
      const type = await getTransactionTypeByType(transaction.type);
      if (type instanceof FailureResponse) {
        return type;
      }
      newTransaction.typeID = type[0].id;
    }

    newTransaction.amount = transaction.amount;
    newTransaction.date = transaction.date;

    const query = "INSERT INTO transactions (merchantID, typeID, amount, date) VALUES (?, ?, ?, ?)";
    const params = [
      newTransaction.merchantID,
      newTransaction.typeID,
      newTransaction.amount,
      newTransaction.date,
    ];

    db.run(query, params, (err, res) => {
      if (err) {
        return new FailureResponse(500, err.message);
      }
      return new SuccessResponse(201, "successfully added transaction");
    });

    return new FailureResponse(500, "failed to add transaction");
  } catch (err) {
    return new FailureResponse(500, err);
  }
}
