import axios from "axios";
import { Category } from "../utils/category.model";

export async function addCategory(
  category: Pick<Category, "name" | "multiplier">
): Promise<number | string> {
  try {
    const response = await axios.post("/categories/add", category);
    return response.data.id;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllCategories(): Promise<Category[] | string> {
  try {
    const response = await axios.get("/categories/all");
    return response.data.categories;
  } catch (err) {
    return `${err}`;
  }
}
