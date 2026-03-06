// features/products/types/product.types.ts

/**
 * Product Image entity
 */
export type ProductImage = {
  id: string
  url: string
  type: "MAIN" | "GALLERY"
  sortOrder: number

  productId: string

  createdAt: Date
}

/**
 * Base Product entity (matches Prisma model)
 */
export type Product = {
  id: string

  name: string
  slug: string

  description?: string | null
  shortDesc?: string | null

  originalPrice: number
  discountPrice?: number | null

  quantity: number
  quantityUnit: "PCS" | "ML" | "L" | "G" | "KG"

  tags: string[]

  isAvailable: boolean
  isFeatured: boolean
  isTrending: boolean
  isActive: boolean

  ratingAverage: number
  ratingCount: number

  categoryId: string

  metaTitle?: string | null
  metaDescription?: string | null

  createdAt: Date
  updatedAt: Date

  images?: ProductImage[]
}

/**
 * Product list item used in admin tables
 */
export type ProductListItem = Product & {
  category?: {
    id: string
    name: string
  }

  mainImage?: string | null
}

/**
 * Input when creating a product
 */
export type CreateProductInput = {
  name: string
  slug?: string

  description?: string | null
  shortDesc?: string | null

  originalPrice: number
  discountPrice?: number | null

  quantity: number
  quantityUnit: "PCS" | "ML" | "L" | "G" | "KG"

  tags?: string[]

  isAvailable?: boolean
  isFeatured?: boolean
  isTrending?: boolean
  isActive?: boolean

  categoryId: string

  metaTitle?: string | null
  metaDescription?: string | null
}

/**
 * Input when updating a product
 */
export type UpdateProductInput = {
  name?: string
  slug?: string

  description?: string | null
  shortDesc?: string | null

  originalPrice?: number
  discountPrice?: number | null

  quantity?: number
  quantityUnit?: "PCS" | "ML" | "L" | "G" | "KG"

  tags?: string[]

  isAvailable?: boolean
  isFeatured?: boolean
  isTrending?: boolean
  isActive?: boolean

  categoryId?: string

  metaTitle?: string | null
  metaDescription?: string | null
}