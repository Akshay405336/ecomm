import { z } from "zod"

export const ProductSchema = z.object({

  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .trim(),

  slug: z
    .string()
    .trim()
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  shortDesc: z
    .string()
    .max(200, "Short description should be under 200 characters")
    .trim()
    .optional(),

  originalPrice: z
    .coerce
    .number()
    .positive("Original price must be greater than 0"),

  discountPrice: z
    .coerce
    .number()
    .nullable()
    .optional(),

  quantity: z
    .coerce
    .number()
    .positive("Quantity must be greater than 0"),

  quantityUnit: z.enum([
    "PCS",
    "ML",
    "L",
    "G",
    "KG"
  ]),

  tags: z
    .array(z.string().trim())
    .optional(),

  isAvailable: z
    .coerce
    .boolean()
    .optional(),

  isFeatured: z
    .coerce
    .boolean()
    .optional(),

  isTrending: z
    .coerce
    .boolean()
    .optional(),

  isActive: z
    .coerce
    .boolean()
    .optional(),

  categoryId: z
    .string(),

  metaTitle: z
    .string()
    .max(60, "Meta title should be under 60 characters")
    .optional(),

  metaDescription: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional(),

  /*
    Images
  */

  mainImage: z
    .union([
      z.string().url(),
      z.string().startsWith("/")
    ])
    .optional(),

  galleryImages: z
    .array(
      z.union([
        z.string().url(),
        z.string().startsWith("/")
      ])
    )
    .max(4, "Maximum 4 gallery images allowed")
    .optional(),

})

export type ProductInput = z.infer<typeof ProductSchema>