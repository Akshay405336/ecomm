import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"
import { createCategory } from "@/modules/categories/actions/create-category"
import { getCategories } from "@/modules/categories/actions/get-categories"

import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    console.log("GET /api/admin/categories")

    const categories = await getCategories()

    console.log("Categories fetched:", categories.length)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)

    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log("POST /api/admin/categories")

    const admin = await getCurrentAdmin()

    console.log("Admin:", admin)

    if (!admin) {
      console.warn("Unauthorized category creation attempt")

      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const parentIdRaw = formData.get("parentId")
    const sortOrderRaw = formData.get("sortOrder")

    console.log("FormData received:", {
      name,
      description,
      parentIdRaw,
      sortOrderRaw
    })

    if (!name) {
      console.warn("Category name missing")

      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      )
    }

    const parentId =
      parentIdRaw && parentIdRaw !== "null"
        ? String(parentIdRaw)
        : null

    const sortOrder = Number(sortOrderRaw ?? 0)

    console.log("Parsed values:", {
      name,
      description,
      parentId,
      sortOrder
    })

    const file = formData.get("image") as File | null

    let imagePath: string | undefined

    if (file) {
      console.log("Image uploaded:", file.name)

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

      console.log("Image saved at:", imagePath)
    }

    console.log("Creating category with data:", {
      name,
      description,
      parentId,
      sortOrder,
      imagePath
    })

    const category = await createCategory({
      name,
      description,
      parentId,
      sortOrder,
      image: imagePath
    })

    console.log("Category created:", category)

    return NextResponse.json(category)

  } catch (error) {
    console.error("Create category failed:", error)

    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 }
    )
  }
}