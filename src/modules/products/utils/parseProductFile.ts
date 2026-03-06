import * as XLSX from "xlsx"

export type ParsedProductRow = {
  name: string
  description?: string
  shortDesc?: string

  originalPrice: number
  discountPrice?: number

  quantity: number
  quantityUnit: "PCS" | "ML" | "L" | "G" | "KG"

  categorySlug: string

  tags?: string[]

  isFeatured?: boolean
  isTrending?: boolean
  isAvailable?: boolean

  metaTitle?: string
  metaDescription?: string

  // 🔥 ADD THESE
  mainImage?: string
  galleryImages?: string
}

export async function parseProductFile(
  buffer: Buffer
): Promise<ParsedProductRow[]> {

  const workbook = XLSX.read(buffer, { type: "buffer" })

  const sheetName = workbook.SheetNames[0]

  const sheet = workbook.Sheets[sheetName]

  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)

  return rows.map((row) => ({

    name: String(row.name ?? "").trim(),

    description: row.description ?? undefined,

    shortDesc: row.shortDesc ?? undefined,

    originalPrice: Number(row.originalPrice ?? 0),

    discountPrice: row.discountPrice
      ? Number(row.discountPrice)
      : undefined,

    quantity: Number(row.quantity ?? 1),

    quantityUnit: (row.quantityUnit ?? "PCS") as ParsedProductRow["quantityUnit"],

    categorySlug: String(row.categorySlug ?? "").trim(),

    tags: row.tags
      ? String(row.tags)
          .split(",")
          .map((t) => t.trim())
      : [],

    isFeatured: row.isFeatured === true || row.isFeatured === "true",

    isTrending: row.isTrending === true || row.isTrending === "true",

    isAvailable:
      row.isAvailable === undefined
        ? true
        : row.isAvailable === true || row.isAvailable === "true",

    metaTitle: row.metaTitle ?? undefined,

    metaDescription: row.metaDescription ?? undefined,

    // 🔥 ADD IMAGE MAPPING
    mainImage: row.mainImage
      ? String(row.mainImage).trim()
      : undefined,

    galleryImages: row.galleryImages
      ? String(row.galleryImages).trim()
      : undefined

  }))
}