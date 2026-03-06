import * as XLSX from "xlsx"

export function generateImportTemplate(): Buffer {

  const headers = [
    {
      name: "",
      description: "",
      shortDesc: "",
      originalPrice: "",
      discountPrice: "",
      quantity: "",
      quantityUnit: "",
      categorySlug: "",
      tags: "",
      mainImage: "",
      galleryImages: "",
      metaTitle: "",
      metaDescription: ""
    }
  ]

  const worksheet = XLSX.utils.json_to_sheet(headers)

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  })
}