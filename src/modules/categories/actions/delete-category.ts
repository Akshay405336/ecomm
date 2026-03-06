import { categoryService } from "../services/category-service"

export async function deleteCategory(id: string) {

  if (!id) {
    throw new Error("Category ID is required")
  }

  return categoryService.delete(id)

}