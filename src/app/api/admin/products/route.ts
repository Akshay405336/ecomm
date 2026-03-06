import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"

import { createProduct } from "@/modules/products/actions/create-product"
import { getProducts } from "@/modules/products/actions/get-products"
import { getProductsPaginated } from "@/modules/products/actions/get-products-paginated"

import fs from "fs/promises"
import path from "path"

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page") ?? 1)
    const limit = Number(searchParams.get("limit") ?? 10)

    const result = await getProductsPaginated(page, limit)

    return NextResponse.json(result)

  } catch (error) {

    console.error("Failed to fetch products:", error)

    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    )

  }

}

export async function POST(req: Request) {
  try {

    console.log("POST /api/admin/products")

    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const shortDesc = formData.get("shortDesc") as string

    const originalPrice = Number(formData.get("originalPrice"))
    const discountPrice = Number(formData.get("discountPrice"))

    const quantity = Number(formData.get("quantity"))
    const quantityUnit = formData.get("quantityUnit") as string

    const categoryId = formData.get("categoryId") as string

    const tagsRaw = formData.get("tags") as string | null
    const tags = tagsRaw ? tagsRaw.split(",") : []

    const isFeatured = formData.get("isFeatured") === "true"
    const isTrending = formData.get("isTrending") === "true"
    const isAvailable = formData.get("isAvailable") !== "false"

    const metaTitle = formData.get("metaTitle") as string
    const metaDescription = formData.get("metaDescription") as string

    if (!name) {
      return NextResponse.json(
        { message: "Product name is required" },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category is required" },
        { status: 400 }
      )
    }

    const uploadDir = path.join(
      process.cwd(),
      "public/images/products"
    )

    await fs.mkdir(uploadDir, { recursive: true })

    /*
      MAIN IMAGE
    */

    const mainImageFile = formData.get("mainImage") as File | null

    let mainImagePath: string | undefined

    if (mainImageFile) {

      const bytes = await mainImageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${mainImageFile.name.replace(/\s/g, "-")}`

      const filePath = path.join(uploadDir, fileName)

      await fs.writeFile(filePath, buffer)

      mainImagePath = `/images/products/${fileName}`
    }

    /*
      GALLERY IMAGES
    */

    const galleryFiles = formData.getAll("galleryImages") as File[]

    const galleryPaths: string[] = []

    for (const file of galleryFiles.slice(0, 4)) {

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`

      const filePath = path.join(uploadDir, fileName)

      await fs.writeFile(filePath, buffer)

      galleryPaths.push(`/images/products/${fileName}`)
    }

    const product = await createProduct(
      {
        name,
        description,
        shortDesc,
        originalPrice,
        discountPrice,
        quantity,
        quantityUnit: quantityUnit as any,
        categoryId,
        tags,
        isFeatured,
        isTrending,
        isAvailable,
        metaTitle,
        metaDescription
      },
      mainImagePath,
      galleryPaths
    )

    return NextResponse.json(product)

  } catch (error) {

    console.error("Create product failed:", error)

    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    )

  }
}