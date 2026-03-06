import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/database/prisma"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"

import fs from "fs/promises"
import path from "path"

export async function POST(req: Request) {

  try {

    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { ids } = await req.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid ids" },
        { status: 400 }
      )
    }

    // get product images first
    const images = await prisma.productImage.findMany({
      where: {
        productId: { in: ids }
      },
      select: {
        url: true
      }
    })

    // delete images from disk
    for (const img of images) {

      const filePath = path.join(
        process.cwd(),
        "public",
        img.url
      )

      try {
        await fs.unlink(filePath)
      } catch {
        console.log("Image not found, skipping:", filePath)
      }

    }

    // delete products
    await prisma.product.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error("Bulk delete products failed:", error)

    return NextResponse.json(
      { message: "Failed to delete products" },
      { status: 500 }
    )

  }

}