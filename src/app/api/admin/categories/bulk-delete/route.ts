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

    // get categories first (to know image paths)
    const categories = await prisma.category.findMany({
      where: {
        id: { in: ids }
      },
      select: {
        image: true
      }
    })

    // delete images
    for (const cat of categories) {

      if (!cat.image) continue

      const filePath = path.join(
        process.cwd(),
        "public",
        cat.image
      )

      try {
        await fs.unlink(filePath)
      } catch {
        console.log("Image not found, skipping:", filePath)
      }

    }

    // delete categories
    await prisma.category.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error("Bulk delete failed:", error)

    return NextResponse.json(
      { message: "Failed to delete categories" },
      { status: 500 }
    )

  }

}