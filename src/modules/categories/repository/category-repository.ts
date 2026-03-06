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

    const { parentId, slug, name, sortOrder, ...rest } = data

    const safeSlug = slug ?? generateSlug(name)

    const existing = await prisma.category.findUnique({
      where: { slug: safeSlug }
    })

    if (existing) {
      throw new Error("Category with this slug already exists")
    }

    const position = sortOrder ?? 1

    // shift categories down
    await prisma.category.updateMany({
      where: {
        sortOrder: { gte: position }
      },
      data: {
        sortOrder: { increment: 1 }
      }
    })

    return prisma.category.create({
      data: {
        name,
        slug: safeSlug,
        parentId: parentId ?? null,
        sortOrder: position,
        ...rest
      }
    })
  },

  // UPDATE CATEGORY
  async update(id: string, data: UpdateCategoryInput) {

    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    const { parentId, slug, name, sortOrder, ...rest } = data

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

    // HANDLE SORTING
    if (sortOrder !== undefined && sortOrder !== category.sortOrder) {

      if (sortOrder < category.sortOrder) {

        await prisma.category.updateMany({
          where: {
            sortOrder: {
              gte: sortOrder,
              lt: category.sortOrder
            }
          },
          data: {
            sortOrder: { increment: 1 }
          }
        })

      } else {

        await prisma.category.updateMany({
          where: {
            sortOrder: {
              gt: category.sortOrder,
              lte: sortOrder
            }
          },
          data: {
            sortOrder: { decrement: 1 }
          }
        })

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
        }),

        ...(sortOrder !== undefined && { sortOrder })
      }
    })
  },

  // DELETE CATEGORY
  async delete(id: string) {

    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    const deletedPosition = category.sortOrder

    await prisma.category.delete({
      where: { id }
    })

    // close gap in sorting
    await prisma.category.updateMany({
      where: {
        sortOrder: { gt: deletedPosition }
      },
      data: {
        sortOrder: { decrement: 1 }
      }
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