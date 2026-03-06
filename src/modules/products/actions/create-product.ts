import { ProductSchema } from "../schemas/product.schema"
import { productService } from "../services/product.service"

export async function createProduct(
  data: unknown,
  mainImage?: string,
  galleryImages?: string[]
) {

  const validated = ProductSchema.parse(data)

  return productService.create(
    validated,
    mainImage,
    galleryImages
  )

}