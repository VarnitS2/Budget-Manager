import axios from "axios";
import { Merchant } from "../utils/merchant.model";

export async function addMerchant(
  merchant: Pick<Merchant, "name" | "categoryName" | "multiplier">
): Promise<number | string> {
  try {
    const response = await axios.post("/merchants/add", merchant);
    return response.data.id;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllMerchants(): Promise<Merchant[] | string> {
  try {
    const response = await axios.get("/merchants/all");
    return response.data.merchants;
  } catch (err) {
    return `${err}`;
  }
}
