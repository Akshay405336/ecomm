import { ProductSchema } from "../schemas/product.schema"
import { productService } from "../services/product.service"

export async function updateProduct(
  id: string,
  data: unknown,
  mainImage?: string | null,
  galleryImages?: string[]
) {

  const validated = ProductSchema.partial().parse(data)

  return productService.update(
    id,
    validated,
    mainImage,
    galleryImages
  )

}