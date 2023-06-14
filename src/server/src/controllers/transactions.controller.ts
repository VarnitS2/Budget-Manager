import dbPromise from "../utils/database";
import {
  Transaction,
  TransactionRequest,
  TransactionResponse,
  TransactionMetrics,
} from "../models/transaction.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import {
  addMerchant,
  getMerchantByID,
  getMerchantByName,
  getMerchantsByCategoryName,
} from "./merchants.controller";
import { getCategoryByID } from "./categories.controller";

/**
 * Helper function to calculate metrics for an array of transactions.
 * @param transactions - array of transactions of type TransactionRequest to calculate metrics for
 * @returns a TransactionMetrics object with the calculated metrics
 */
function calculateMetrics(transactions: TransactionRequest[]): TransactionMetrics {
  const metrics: TransactionMetrics = {};

  if (transactions.length === 0) {
    return metrics;
  }

  metrics.transactionCount = transactions.length;
  metrics.positiveTransactionCount = transactions.filter((t) => t.categoryMultiplier! > 0).length;
  metrics.negativeTransactionCount = transactions.filter((t) => t.categoryMultiplier! < 0).length;

  const merchantSet = new Set<string>();
  const categorySet = new Set<string>();
  transactions.forEach((t) => {
    merchantSet.add(t.merchantName!);
    categorySet.add(t.categoryName!);
  });
  metrics.merchantCount = merchantSet.size;
  metrics.categoryCount = categorySet.size;

  const firstDate = new Date(transactions[0].date!);
  const lastDate = new Date(transactions[transactions.length - 1].date!);
  metrics.dayCount =
    Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24)) + 1;

  metrics.balance = transactions.reduce((acc, t) => acc + t.amount! * t.categoryMultiplier!, 0);
  metrics.netPositive = transactions.reduce(
    (acc, t) => acc + (t.categoryMultiplier! > 0 ? t.amount! : 0),
    0
  );
  metrics.netNegative = transactions.reduce(
    (acc, t) => acc + (t.categoryMultiplier! < 0 ? t.amount! : 0),
    0
  );

  metrics.averagePositive = metrics.netPositive / metrics.positiveTransactionCount!;
  metrics.averageNegative = metrics.netNegative / metrics.negativeTransactionCount!;

  metrics.maximumNegative = Math.max(
    ...transactions.filter((t) => t.categoryMultiplier! < 0).map((t) => t.amount!)
  );
  metrics.minimumNegative = Math.min(
    ...transactions.filter((t) => t.categoryMultiplier! < 0).map((t) => t.amount!)
  );

  metrics.positivePerDay = metrics.netPositive / metrics.dayCount!;
  metrics.negativePerDay = metrics.netNegative / metrics.dayCount!;

  return metrics;
}

/**
 * Asynchronous helper function to retrieve merchantID from the database, adding the merchant if it does not exist.
 * @param merchantName - name of the merchant to retrieve the ID for
 * @param categoryName - name of the category of the merchant
 * @param categoryMultiplier - multiplier of the category of the merchant
 * @returns the ID of the merchant if the query was successful, a FailureResponse otherwise
 */
async function getMerchantID(
  merchantName: string,
  categoryName?: string,
  categoryMultiplier?: number
): Promise<number | FailureResponse> {
  try {
    if (!merchantName) {
      return new FailureResponse(400, "missing required parameter [merchantName]");
    }

    const merchantRes = await getMerchantByName(merchantName);
    if (merchantRes instanceof FailureResponse) {
      return merchantRes;
    }

    let merchantID: number;
    if (merchantRes.length === 0) {
      if (!categoryName || !categoryMultiplier) {
        return new FailureResponse(
          400,
          "missing required parameters [categoryName, categoryMultiplier]"
        );
      }
      const merchantCreateRes = await addMerchant({
        name: merchantName,
        categoryName: categoryName,
        multiplier: categoryMultiplier,
      });
      if (merchantCreateRes instanceof FailureResponse) {
        return merchantCreateRes;
      }
      merchantID = merchantCreateRes;
    } else {
      merchantID = merchantRes[0].id!;
    }

    return merchantID;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous helper function to convert a Transaction to a TransactionRequest.
 * @param transaction - transaction of type Transaction to be converted
 * @returns a TransactionRequest if the conversion was successful, a FailureResponse otherwise
 */
async function convertTransactionToTransactionRequest(
  transaction: Transaction
): Promise<TransactionRequest | FailureResponse> {
  try {
    const merchantRes = await getMerchantByID(transaction.merchantID!);
    if (merchantRes instanceof FailureResponse) {
      return merchantRes;
    }
    const categoryRes = await getCategoryByID(merchantRes[0].categoryID!);
    if (categoryRes instanceof FailureResponse) {
      return categoryRes;
    }
    return {
      id: transaction.id,
      merchantName: merchantRes[0].name,
      categoryName: categoryRes[0].name,
      categoryMultiplier: categoryRes[0].multiplier,
      amount: transaction.amount,
      date: transaction.date,
    };
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to add a transaction to the database.
 * @param transaction - transaction of type TransactionRequest to be added to the database
 * @returns the ID of the added transaction if the query was successful, a FailureResponse otherwise
 */
export async function addTransaction(
  transaction: TransactionRequest
): Promise<number | FailureResponse> {
  if (!transaction.merchantName || transaction.amount === 0 || !transaction.date) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const merchantIDRes = await getMerchantID(
      transaction.merchantName,
      transaction.categoryName,
      transaction.categoryMultiplier
    );
    if (merchantIDRes instanceof FailureResponse) {
      return merchantIDRes;
    }

    const db = await dbPromise;
    const query = "INSERT INTO transactions (merchantID, amount, date) VALUES (?, ?, ?)";
    const params = [merchantIDRes, transaction.amount, transaction.date];

    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to add transaction");
    }

    return res.lastID;
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all transactions from the database.
 * @returns a TransactionResponse containing transactions and metrics if the query was successful, a FailureResponse otherwise
 */
export async function getAllTransactions(): Promise<TransactionResponse | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM transactions ORDER BY date ASC";

    const transactions = await db.all<Transaction[]>(query);
    let transactionsResponse: TransactionRequest[] = [];

    for (const transaction of transactions) {
      const convertedTransaction = await convertTransactionToTransactionRequest(transaction);
      if (convertedTransaction instanceof FailureResponse) {
        return convertedTransaction;
      }
      transactionsResponse.push(convertedTransaction);
    }

    const metrics = calculateMetrics(transactionsResponse);

    return {
      transactions: transactionsResponse,
      metrics: metrics,
    };
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get a transaction by ID from the database
 * @param id - ID of the transaction to be retrieved
 * @returns an array containing the transaction if the query was successful, a FailureResponse otherwise
 */
export async function getTransactionByID(
  id: number
): Promise<TransactionRequest[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM transactions WHERE id = ?";
    const params = [id];

    const transactions = await db.all<Transaction[]>(query, params);

    if (transactions.length === 0) {
      return new FailureResponse(404, "no transactions found");
    }

    const convertedTransaction = await convertTransactionToTransactionRequest(transactions[0]);
    if (convertedTransaction instanceof FailureResponse) {
      return convertedTransaction;
    }
    return [convertedTransaction];
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all transactions by merchant ID from the database
 * @param merchantID - ID of the merchant whose transactions are to be retrieved
 * @returns a TransactionResponse containing transactions and metrics if the query was successful, a FailureResponse otherwise
 */
export async function getTransactionsByMerchantID(
  merchantID: number
): Promise<TransactionResponse | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM transactions WHERE merchantID = ? ORDER BY date ASC";
    const params = [merchantID];

    const transactions = await db.all<Transaction[]>(query, params);
    let transactionsResponse: TransactionRequest[] = [];

    for (const transaction of transactions) {
      const convertedTransaction = await convertTransactionToTransactionRequest(transaction);
      if (convertedTransaction instanceof FailureResponse) {
        return convertedTransaction;
      }
      transactionsResponse.push(convertedTransaction);
    }

    const metrics = calculateMetrics(transactionsResponse);

    return {
      transactions: transactionsResponse,
      metrics: metrics,
    };
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all transactions by merchant name from the database
 * @param merchantName - name of the merchant whose transactions are to be retrieved
 * @returns a TransactionResponse containing transactions and metrics if the query was successful, a FailureResponse otherwise
 */
export async function getTransactionsByMerchantName(
  merchantName: string
): Promise<TransactionResponse | FailureResponse> {
  try {
    const merchantRes = await getMerchantByName(merchantName);
    if (merchantRes instanceof FailureResponse) {
      return merchantRes;
    }
    if (merchantRes.length === 0) {
      return new FailureResponse(404, "merchant not found");
    }

    return await getTransactionsByMerchantID(merchantRes[0].id!);
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all transactions by category name from the database
 * @param categoryName - name of the category whose transactions are to be retrieved
 * @returns a TransactionResponse containing transactions and metrics if the query was successful, a FailureResponse otherwise
 */
export async function getTransactionsByCategoryName(
  categoryName: string
): Promise<TransactionResponse | FailureResponse> {
  try {
    const merchantRes = await getMerchantsByCategoryName(categoryName);
    if (merchantRes instanceof FailureResponse) {
      return merchantRes;
    }
    if (merchantRes.length === 0) {
      return new FailureResponse(404, "no merchants found for category");
    }

    let transactionsReq: TransactionRequest[] = [];

    for (const merchant of merchantRes) {
      const transactions = await getTransactionsByMerchantID(merchant.id!);
      if (transactions instanceof FailureResponse) {
        return transactions;
      }

      transactionsReq = transactionsReq.concat(transactions.transactions!);
    }
    transactionsReq.sort((a, b) => (a.date! > b.date! ? 1 : -1));

    const metrics = calculateMetrics(transactionsReq);

    return {
      transactions: transactionsReq,
      metrics: metrics,
    };
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to get all transactions between two dates from the database
 * @param startDate - start date of the range of transactions to be retrieved
 * @param endDate - end date of the range of transactions to be retrieved
 * @returns a TransactionResponse containing transactions and metrics if the query was successful, a FailureResponse otherwise
 */
export async function getTransactionsByDateRange(
  startDate: string,
  endDate: string
): Promise<TransactionResponse | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = "SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY date ASC";
    const params = [startDate, endDate];

    const transactions = await db.all<Transaction[]>(query, params);
    let transactionsResponse: TransactionRequest[] = [];

    for (const transaction of transactions) {
      const convertedTransaction = await convertTransactionToTransactionRequest(transaction);
      if (convertedTransaction instanceof FailureResponse) {
        return convertedTransaction;
      }
      transactionsResponse.push(convertedTransaction);
    }

    const metrics = calculateMetrics(transactionsResponse);

    return {
      transactions: transactionsResponse,
      metrics: metrics,
    };
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to update a transaction in the database
 * @param newTransaction - updated transaction of type TransactionRequest
 * @returns a SuccessResponse if the query was successful, a FailureResponse otherwise
 */
export async function updateTransaction(
  newTransaction: TransactionRequest
): Promise<SuccessResponse | FailureResponse> {
  if (!newTransaction.id) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;

    if (newTransaction.merchantName) {
      const merchantIDRes = await getMerchantID(
        newTransaction.merchantName,
        newTransaction.categoryName,
        newTransaction.categoryMultiplier
      );
      if (merchantIDRes instanceof FailureResponse) {
        return merchantIDRes;
      }
      const query = "UPDATE transactions SET merchantID = ? WHERE id = ?";
      const params = [merchantIDRes, newTransaction.id];
      await db.run(query, params);
    }

    if (newTransaction.amount) {
      const query = "UPDATE transactions SET amount = ? WHERE id = ?";
      const params = [newTransaction.amount, newTransaction.id];
      await db.run(query, params);
    }

    if (newTransaction.date) {
      const query = "UPDATE transactions SET date = ? WHERE id = ?";
      const params = [newTransaction.date, newTransaction.id];
      await db.run(query, params);
    }

    return new SuccessResponse(200, "transaction updated");
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}

/**
 * Asynchronous controller function to delete a transaction from the database
 * @param id - ID of the transaction to be deleted
 * @returns a SuccessResponse if the query was successful, a FailureResponse otherwise
 */
export async function deleteTransaction(id: number): Promise<SuccessResponse | FailureResponse> {
  if (!id) {
    return new FailureResponse(400, "missing required parameters");
  }

  try {
    const db = await dbPromise;
    const query = "DELETE FROM transactions WHERE id = ?";
    const params = [id];

    await db.run(query, params);
    return new SuccessResponse(200, "transaction deleted");
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}
