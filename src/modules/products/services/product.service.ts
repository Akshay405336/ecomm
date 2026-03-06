import slugify from "slugify"
import { productRepository } from "../repository/product.repository"
import {
  CreateProductInput,
  UpdateProductInput
} from "../types/product.types"

export const productService = {

  // LIST PRODUCTS
  async list() {
    return productRepository.findAll()
  },

  async paginate(page: number, limit: number) {

  return productRepository.findPaginated(page, limit)

},

  // CREATE PRODUCT
  async create(
    data: CreateProductInput,
    mainImage?: string,
    galleryImages?: string[]
  ) {

    const slug =
      data.slug ??
      slugify(data.name, { lower: true, strict: true })

    const existing = await productRepository.findBySlug(slug)

    if (existing) {
      throw new Error("Product with this slug already exists")
    }

    if (galleryImages && galleryImages.length > 4) {
      throw new Error("Maximum 4 gallery images allowed")
    }

    return productRepository.create(
      {
        ...data,
        slug
      },
      mainImage,
      galleryImages
    )
  },

  // UPDATE PRODUCT
  async update(
    id: string,
    data: UpdateProductInput,
    mainImage?: string | null,
    galleryImages?: string[]
  ) {

    const product = await productRepository.findById(id)

    if (!product) {
      throw new Error("Product not found")
    }

    let slug = data.slug

    if (!slug && data.name) {
      slug = slugify(data.name, { lower: true, strict: true })
    }

    // slug uniqueness
    if (slug) {

      const existing = await productRepository.findBySlug(slug)

      if (existing && existing.id !== id) {
        throw new Error("Another product already uses this slug")
      }

    }

    if (galleryImages && galleryImages.length > 4) {
      throw new Error("Maximum 4 gallery images allowed")
    }

    return productRepository.update(
      id,
      {
        ...data,
        ...(slug && { slug })
      },
      mainImage,
      galleryImages
    )
  },

  // DELETE PRODUCT
  async delete(id: string) {

    const product = await productRepository.findById(id)

    if (!product) {
      throw new Error("Product not found")
    }

    return productRepository.delete(id)
  }

}