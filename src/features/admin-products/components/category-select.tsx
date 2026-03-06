"use client"

import { CategoryListItem } from "@/modules/categories/types/category.types"
import { useCategories } from "@/features/admin-categories/hooks/use-categories"

type Props = {
  value: string | null
  onChange: (value: string | null) => void
}

export default function CategorySelect({
  value,
  onChange
}: Props) {

  const { categories, loading } = useCategories()

  if (loading) {
    return (
      <select
        disabled
        className="border w-full p-2 rounded"
      >
        <option>Loading categories...</option>
      </select>
    )
  }

  return (
    <div className="space-y-1">

      <label className="text-sm font-medium">
        Category
      </label>

      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value || null)
        }
        className="border w-full p-2 rounded"
      >

        <option value="">Select category</option>

        {categories.length === 0 && (
          <option disabled>No categories available</option>
        )}

        {categories.map((cat: CategoryListItem) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}

      </select>

    </div>
  )
}