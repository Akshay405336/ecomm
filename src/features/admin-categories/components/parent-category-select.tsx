"use client"

import { CategoryListItem } from "@/modules/categories/types/category.types"
import { useCategories } from "../hooks/use-categories"

type Props = {
  value: string | null
  onChange: (value: string | null) => void
  excludeId?: string
}

export default function ParentCategorySelect({
  value,
  onChange,
  excludeId
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

  const availableCategories = categories.filter(
    (cat: CategoryListItem) => cat.id !== excludeId
  )

  return (
    <div className="space-y-1">

      <label className="text-sm font-medium">
        Parent Category
      </label>

      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value || null)
        }
        className="border w-full p-2 rounded"
      >

        <option value="">No Parent</option>

        {availableCategories.length === 0 && (
          <option disabled>No categories available</option>
        )}

        {availableCategories.map((cat: CategoryListItem) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}

      </select>

    </div>
  )
}