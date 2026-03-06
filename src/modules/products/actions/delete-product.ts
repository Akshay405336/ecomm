import { productService } from "../services/product.service"

export async function deleteProduct(id: string) {

  if (!id) {
    throw new Error("Product ID is required")
  }

  return productService.delete(id)

}