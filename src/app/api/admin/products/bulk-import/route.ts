import { NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin"

import { parseProductFile } from "@/modules/products/utils/parseProductFile"
import { bulkImportProducts } from "@/modules/products/actions/bulk-import-products"

export async function POST(req: Request) {

  try {

    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()

    const buffer = Buffer.from(bytes)

    /*
      PARSE FILE
    */

    const rows = await parseProductFile(buffer)

    if (!rows.length) {
      return NextResponse.json(
        { message: "File contains no products" },
        { status: 400 }
      )
    }

    /*
      IMPORT PRODUCTS
    */

    const result = await bulkImportProducts(rows)

    return NextResponse.json(result)

  } catch (error) {

    console.error("Bulk import failed:", error)

    return NextResponse.json(
      { message: "Bulk import failed" },
      { status: 500 }
    )

  }

}