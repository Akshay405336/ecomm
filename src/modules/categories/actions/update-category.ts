import { CategorySchema } from "../schemas/category.schema"
import { categoryService } from "../services/category-service"

export async function updateCategory(id: string, data: unknown) {

  const validated = CategorySchema.partial().parse(data)

  return categoryService.update(id, validated)

}