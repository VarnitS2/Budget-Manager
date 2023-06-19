import axios from "axios";
import { Transaction } from "../utils/transaction.model";

export async function addTransaction(
  transaction: Pick<
    Transaction,
    "merchantName" | "categoryName" | "categoryMultiplier" | "amount" | "date"
  >
): Promise<number | string> {
  try {
    const response = await axios.post("/transactions/add", transaction);
    return response.data.id;
  } catch (err) {
    return `${err}`;
  }
}
