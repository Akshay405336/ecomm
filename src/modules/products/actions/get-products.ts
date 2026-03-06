import { productService } from "../services/product.service"
import { Product } from "../types/product.types"

export async function getProducts(): Promise<Product[]> {

  return productService.list()

}