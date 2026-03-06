// features/categories/types/category.types.ts

/**
 * Base Category entity (matches Prisma model)
 */
export type Category = {
  id: string
  name: string
  slug: string

  description?: string | null

  image?: string | null
  icon?: string | null

  parentId?: string | null

  sortOrder: number
  isActive: boolean

  metaTitle?: string | null
  metaDescription?: string | null

  createdAt: Date
  updatedAt: Date
}

/**
 * Category list item used in admin tables
 * (parent + children contain only minimal fields)
 */
export type CategoryListItem = Category & {
  parent?: {
    id: string
    name: string
  } | null

  children?: {
    id: string
    name: string
  }[]
}

/**
 * Category tree structure (for menus / nested display)
 */
export type CategoryTree = Category & {
  children?: CategoryTree[]
}

/**
 * Input when creating a category
 */
export type CreateCategoryInput = {
  name: string
  slug?: string

  description?: string | null
  image?: string | null
  icon?: string | null

  parentId?: string | null

  sortOrder?: number
  isActive?: boolean

  metaTitle?: string | null
  metaDescription?: string | null
}

/**
 * Input when updating a category
 */
export type UpdateCategoryInput = {
  name?: string
  slug?: string

  description?: string | null
  image?: string | null
  icon?: string | null

  parentId?: string | null

  sortOrder?: number
  isActive?: boolean

  metaTitle?: string | null
  metaDescription?: string | null
}