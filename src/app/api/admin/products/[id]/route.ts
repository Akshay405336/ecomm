import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"

import { updateProduct } from "@/modules/products/actions/update-product"
import { deleteProduct } from "@/modules/products/actions/delete-product"
import { productRepository } from "@/modules/products/repository/product.repository"

import { prisma } from "@/infrastructure/database/prisma"

import fs from "fs/promises"
import path from "path"


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

    const product = await productRepository.findById(id)

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)

  } catch (error) {

    console.error("Fetch product failed:", error)

    return NextResponse.json(
      { message: "Failed to fetch product" },
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()

    const name = formData.get("name") as string | null
    const description = formData.get("description") as string | null
    const shortDesc = formData.get("shortDesc") as string | null

    const originalPriceRaw = formData.get("originalPrice")
    const discountPriceRaw = formData.get("discountPrice")

    const quantityRaw = formData.get("quantity")
    const quantityUnit = formData.get("quantityUnit") as string | null

    const categoryId = formData.get("categoryId") as string | null

    const tagsRaw = formData.get("tags") as string | null

    const isFeatured = formData.get("isFeatured")
    const isTrending = formData.get("isTrending")
    const isAvailable = formData.get("isAvailable")

    const metaTitle = formData.get("metaTitle") as string | null
    const metaDescription = formData.get("metaDescription") as string | null

    const removeMainImage = formData.get("removeMainImage") === "true"

    const removedGallery = formData.getAll("removeGalleryImages") as string[]

    const existingProduct = await productRepository.findById(id)

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    const uploadDir = path.join(
      process.cwd(),
      "public/images/products"
    )

    await fs.mkdir(uploadDir, { recursive: true })

    /*
      MAIN IMAGE REMOVE
    */

    const main = existingProduct.images?.find(i => i.type === "MAIN")

    if (removeMainImage && main) {

      const oldPath = path.join(
        process.cwd(),
        "public",
        main.url
      )

      try {
        await fs.unlink(oldPath)
      } catch {}

      await prisma.productImage.delete({
        where: { id: main.id }
      })

    }

    /*
  REMOVE GALLERY IMAGES
*/

console.log("Removed gallery images:", removedGallery)

for (const img of removedGallery) {

  // remove domain if frontend sends full URL
  const cleanPath = img.replace(/^https?:\/\/[^\/]+/, "")

  const filePath = path.join(
    process.cwd(),
    "public",
    cleanPath
  )

  try {
    await fs.unlink(filePath)
  } catch (err) {
    console.log("Gallery file delete failed:", filePath)
  }

  await prisma.productImage.deleteMany({
    where: { url: cleanPath }
  })

}

    /*
      MAIN IMAGE UPLOAD
    */

    let mainImagePath: string | undefined

    const mainFile = formData.get("mainImage") as File | null

    if (mainFile) {

      const bytes = await mainFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${mainFile.name.replace(/\s/g, "-")}`

      const filePath = path.join(uploadDir, fileName)

      await fs.writeFile(filePath, buffer)

      mainImagePath = `/images/products/${fileName}`

    }

    /*
      GALLERY IMAGE UPLOAD
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

    const product = await updateProduct(
      id,
      {
        ...(name && { name }),
        ...(description !== null && { description }),
        ...(shortDesc !== null && { shortDesc }),

        ...(originalPriceRaw && { originalPrice: Number(originalPriceRaw) }),
        ...(discountPriceRaw && { discountPrice: Number(discountPriceRaw) }),

        ...(quantityRaw && { quantity: Number(quantityRaw) }),
        ...(quantityUnit && { quantityUnit }),

        ...(categoryId && { categoryId }),

        ...(tagsRaw && { tags: tagsRaw.split(",") }),

        ...(isFeatured !== null && { isFeatured: isFeatured === "true" }),
        ...(isTrending !== null && { isTrending: isTrending === "true" }),
        ...(isAvailable !== null && { isAvailable: isAvailable === "true" }),

        ...(metaTitle !== null && { metaTitle }),
        ...(metaDescription !== null && { metaDescription })

      },
      mainImagePath,
      galleryPaths.length ? galleryPaths : undefined
    )

    return NextResponse.json(product)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { message: "Failed to update product" },
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const product = await productRepository.findById(id)

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    for (const image of product.images ?? []) {

      const imagePath = path.join(
        process.cwd(),
        "public",
        image.url
      )

      try {
        await fs.unlink(imagePath)
      } catch {}

    }

    await deleteProduct(id)

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    )

  }

}