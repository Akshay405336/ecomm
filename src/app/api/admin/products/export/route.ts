import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"
import { exportProducts } from "@/modules/products/actions/export-products"

export async function GET() {

  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  const buffer = await exportProducts()

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        "attachment; filename=products.xlsx"
    }
  })

}