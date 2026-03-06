import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"
import { generateImportTemplate } from "@/modules/products/utils/generateImportTemplate"

export async function GET() {

  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const buffer = generateImportTemplate()

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        "attachment; filename=product-import-template.xlsx"
    }
  })
}