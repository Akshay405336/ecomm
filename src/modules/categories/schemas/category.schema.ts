import { z } from "zod"

export const CategorySchema = z.object({

  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .trim(),

  slug: z
    .string()
    .trim()
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  image: z
    .union([
      z.string().url(),   // remote images
      z.string().startsWith("/") // local images
    ])
    .nullable()
    .optional(),

  icon: z
    .union([
      z.string().url(),
      z.string().startsWith("/")
    ])
    .optional(),

  parentId: z
    .string()
    .nullable()
    .optional(),

  sortOrder: z
    .coerce
    .number()
    .optional(),

  isActive: z
    .coerce
    .boolean()
    .optional(),

  metaTitle: z
    .string()
    .max(60, "Meta title should be under 60 characters")
    .optional(),

  metaDescription: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional(),

})

export type CategoryInput = z.infer<typeof CategorySchema>