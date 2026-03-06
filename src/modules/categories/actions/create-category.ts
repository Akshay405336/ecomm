import { CategorySchema } from "../schemas/category.schema"
import { categoryService } from "../services/category-service"

export async function createCategory(data: unknown) {

  const validated = CategorySchema.parse(data)

  return categoryService.create(validated)

}