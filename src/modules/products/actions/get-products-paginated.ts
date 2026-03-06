import { productService } from "../services/product.service"

export async function getProductsPaginated(
  page: number,
  limit: number
) {

  return productService.paginate(page, limit)

}