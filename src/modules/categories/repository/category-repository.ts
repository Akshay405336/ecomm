import { prisma } from "@/infrastructure/database/prisma"
import {
  CreateCategoryInput,
  UpdateCategoryInput
} from "../types/category.types"

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")

export const categoryRepository = {

  // GET ALL CATEGORIES
  async findAll() {
    return prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ]
    })
  },

  // GET ROOT CATEGORIES
  async findRootCategories() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { sortOrder: "asc" }
    })
  },

  // FIND BY ID
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  },

  // FIND BY SLUG
  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug }
    })
  },

  // CREATE CATEGORY
  async create(data: CreateCategoryInput) {

    const { parentId, slug, name, ...rest } = data

    const safeSlug = slug ?? generateSlug(name)

    // prevent duplicate slug
    const existing = await prisma.category.findUnique({
      where: { slug: safeSlug }
    })

    if (existing) {
      throw new Error("Category with this slug already exists")
    }

    return prisma.category.create({
      data: {
        name,
        slug: safeSlug,
        parentId: parentId ?? null,
        ...rest
      }
    })
  },

  // UPDATE CATEGORY
  async update(id: string, data: UpdateCategoryInput) {

    const { parentId, slug, name, ...rest } = data

    let safeSlug = slug

    if (!slug && name) {
      safeSlug = generateSlug(name)
    }

    if (safeSlug) {
      const existing = await prisma.category.findFirst({
        where: {
          slug: safeSlug,
          NOT: { id }
        }
      })

      if (existing) {
        throw new Error("Category slug already exists")
      }
    }

    return prisma.category.update({
      where: { id },
      data: {
        ...rest,

        ...(name !== undefined && { name }),
        ...(safeSlug !== undefined && { slug: safeSlug }),

        ...(parentId !== undefined && {
          parentId: parentId ?? null
        })
      }
    })
  },

  // DELETE CATEGORY
  async delete(id: string) {
    return prisma.category.delete({
      where: { id }
    })
  },

  // FIND CHILDREN
  async findChildren(parentId: string) {
    return prisma.category.findMany({
      where: { parentId },
      orderBy: { sortOrder: "asc" }
    })
  }

}