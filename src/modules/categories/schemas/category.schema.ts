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
    .string()
    .refine(
      (val) => val.startsWith("/") || val.startsWith("http"),
      { message: "Image must be a valid path or URL" }
    )
    .optional(),

  icon: z
    .string()
    .refine(
      (val) => val.startsWith("/") || val.startsWith("http"),
      { message: "Icon must be a valid path or URL" }
    )
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