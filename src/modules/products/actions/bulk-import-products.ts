import { prisma } from "@/infrastructure/database/prisma"

import { productService } from "../services/product.service"

import { ParsedProductRow } from "../utils/parseProductFile"
import { downloadImage } from "../utils/downloadImage"

export type BulkImportResult = {
  total: number
  success: number
  failed: number
  errors: {
    row: number
    name?: string
    error: string
  }[]
}

export async function bulkImportProducts(
  rows: ParsedProductRow[]
): Promise<BulkImportResult> {

  const result: BulkImportResult = {
    total: rows.length,
    success: 0,
    failed: 0,
    errors: []
  }

  for (let i = 0; i < rows.length; i++) {

    const row = rows[i]

    try {

      /*
        FIND CATEGORY
      */

      const category = await prisma.category.findUnique({
        where: { slug: row.categorySlug }
      })

      if (!category) {
        throw new Error(`Category not found: ${row.categorySlug}`)
      }

      /*
        DOWNLOAD MAIN IMAGE
      */

      let mainImagePath: string | undefined


      if ((row as any).mainImage) {
        mainImagePath = await downloadImage((row as any).mainImage) ?? undefined
        
      }

      /*
        DOWNLOAD GALLERY IMAGES
      */

      let galleryImages: string[] | undefined

      if ((row as any).galleryImages) {

        const urls = String((row as any).galleryImages)
          .split(",")
          .map((u: string) => u.trim())
          .slice(0, 4)

        const downloaded = await Promise.all(
          urls.map(url => downloadImage(url))
        )

        galleryImages = downloaded.filter(Boolean) as string[]

      }

      /*
        CREATE PRODUCT
      */

      await productService.create(
        {
          name: row.name,
          description: row.description,
          shortDesc: row.shortDesc,
          originalPrice: row.originalPrice,
          discountPrice: row.discountPrice,
          quantity: row.quantity,
          quantityUnit: row.quantityUnit,
          categoryId: category.id,
          tags: row.tags,
          isFeatured: row.isFeatured,
          isTrending: row.isTrending,
          isAvailable: row.isAvailable,
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription
        },
        mainImagePath,
        galleryImages
      )

      result.success++

    } catch (error: any) {

      result.failed++

      result.errors.push({
        row: i + 2, // Excel row (header offset)
        name: row.name,
        error: error.message ?? "Unknown error"
      })

    }

  }

  return result
}