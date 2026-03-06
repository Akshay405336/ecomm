import slugify from "slugify"
import { categoryRepository } from "../repository/category-repository"
import {
  CreateCategoryInput,
  UpdateCategoryInput
} from "../types/category.types"

export const categoryService = {

  // LIST CATEGORIES
  async list() {
    return categoryRepository.findAll()
  },

  // CREATE CATEGORY
  async create(data: CreateCategoryInput) {

    const slug =
      data.slug ??
      slugify(data.name, { lower: true, strict: true })

    const existing = await categoryRepository.findBySlug(slug)

    if (existing) {
      throw new Error("Category with this slug already exists")
    }

    return categoryRepository.create({
      ...data,
      slug
    })
  },

  // UPDATE CATEGORY
  async update(id: string, data: UpdateCategoryInput) {

    const category = await categoryRepository.findById(id)

    if (!category) {
      throw new Error("Category not found")
    }

    let slug = data.slug

    if (!slug && data.name) {
      slug = slugify(data.name, { lower: true, strict: true })
    }

    // slug uniqueness
    if (slug) {

      const existing = await categoryRepository.findBySlug(slug)

      if (existing && existing.id !== id) {
        throw new Error("Another category already uses this slug")
      }

    }

    // prevent self parent
    if (data.parentId === id) {
      throw new Error("Category cannot be its own parent")
    }

    // prevent circular nesting
    if (data.parentId) {

      const parent = await categoryRepository.findById(data.parentId)

      if (!parent) {
        throw new Error("Parent category not found")
      }

      if (parent.parentId === id) {
        throw new Error("Circular category hierarchy detected")
      }

    }

    return categoryRepository.update(id, {
      ...data,
      ...(slug && { slug })
    })
  },

  // DELETE CATEGORY
  async delete(id: string) {

    const category = await categoryRepository.findById(id)

    if (!category) {
      throw new Error("Category not found")
    }

    const children = await categoryRepository.findChildren(id)

    if (children.length > 0) {
      throw new Error("Cannot delete category with subcategories")
    }

    return categoryRepository.delete(id)
  }

}