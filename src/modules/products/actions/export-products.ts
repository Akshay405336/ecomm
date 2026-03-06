import { prisma } from "@/infrastructure/database/prisma"
import * as XLSX from "xlsx"

export async function exportProducts() {

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const rows = products.map((p) => {

    const mainImage = p.images.find(i => i.type === "MAIN")?.url ?? ""

    const galleryImages = p.images
      .filter(i => i.type === "GALLERY")
      .map(i => i.url)
      .join(",")

    return {
      name: p.name,
      description: p.description ?? "",
      shortDesc: p.shortDesc ?? "",

      originalPrice: Number(p.originalPrice),
      discountPrice: p.discountPrice
        ? Number(p.discountPrice)
        : "",

      quantity: p.quantity,
      quantityUnit: p.quantityUnit,

      categorySlug: p.category?.slug ?? "",

      tags: p.tags?.join(",") ?? "",

      isFeatured: p.isFeatured,
      isTrending: p.isTrending,
      isAvailable: p.isAvailable,

      metaTitle: p.metaTitle ?? "",
      metaDescription: p.metaDescription ?? "",

      mainImage,
      galleryImages
    }

  })

  const worksheet = XLSX.utils.json_to_sheet(rows)

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  })

  return buffer

}