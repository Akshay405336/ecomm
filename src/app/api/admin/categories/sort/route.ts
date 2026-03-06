import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/database/prisma"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"

export async function POST(req: Request) {

  try {

    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const order: {
      id: string
      sortOrder: number
    }[] = body.order

    if (!Array.isArray(order)) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      )
    }

    await prisma.$transaction(

      order.map(item =>
        prisma.category.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        })
      )

    )

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error("Category sort failed:", error)

    return NextResponse.json(
      { message: "Failed to update sorting" },
      { status: 500 }
    )

  }

}