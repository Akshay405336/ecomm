import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"

import { updateCategory } from "@/modules/categories/actions/update-category"
import { deleteCategory } from "@/modules/categories/actions/delete-category"
import { categoryRepository } from "@/modules/categories/repository/category-repository"

import fs from "fs/promises"
import path from "path"


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    const category = await categoryRepository.findById(id)

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)

  } catch (error) {

    console.error("Fetch category failed:", error)

    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 }
    )
  }
}


export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const name = formData.get("name") as string | null
    const description = formData.get("description") as string | null
    const parentIdRaw = formData.get("parentId")
    const sortOrderRaw = formData.get("sortOrder")

    const parentId =
      parentIdRaw && parentIdRaw !== "null"
        ? String(parentIdRaw)
        : null

    const sortOrder =
      sortOrderRaw !== null ? Number(sortOrderRaw) : undefined

    const file = formData.get("image") as File | null

    let imagePath: string | undefined

    if (file) {

      const existingCategory = await categoryRepository.findById(id)

      if (existingCategory?.image) {

        const oldPath = path.join(
          process.cwd(),
          "public",
          existingCategory.image
        )

        try {
          await fs.unlink(oldPath)
          console.log("Old image deleted:", oldPath)
        } catch {
          console.log("Old image not found, skipping delete")
        }

      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`

      const uploadDir = path.join(
        process.cwd(),
        "public/images/category"
      )

      await fs.mkdir(uploadDir, { recursive: true })

      const filePath = path.join(uploadDir, fileName)

      await fs.writeFile(filePath, buffer)

      imagePath = `/images/category/${fileName}`
    }

    const category = await updateCategory(id, {
      ...(name && { name }),
      ...(description !== null && { description }),
      ...(parentId !== undefined && { parentId }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(imagePath && { image: imagePath })
    })

    return NextResponse.json(category)

  } catch (error) {

    console.error("Update category failed:", error)

    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 }
    )
  }
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    await deleteCategory(id)

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error("Delete category failed:", error)

    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 }
    )
  }
}