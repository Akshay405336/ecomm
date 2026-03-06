import { categoryService } from "../services/category-service"
import { Category } from "../types/category.types"

export async function getCategories(): Promise<Category[]> {

  return categoryService.list()

}