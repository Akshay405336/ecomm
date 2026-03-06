"use client"

import { useState } from "react"
import { Category } from "@/modules/categories/types/category.types"

type Props = {
  category: Category
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryDeleteDialog({
  category,
  onClose,
  onSuccess
}: Props) {

  const [loading, setLoading] = useState(false)

  const remove = async () => {

    try {

      setLoading(true)

      const res = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "DELETE"
        }
      )

      if (!res.ok) {
        throw new Error("Failed to delete category")
      }

      onSuccess()
      onClose()

    } catch (err) {

      console.error(err)
      alert("Could not delete category")

    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded space-y-4 w-80">

        <p className="text-sm">
          Delete <b>{category.name}</b>?
        </p>

        <div className="flex gap-3 justify-end">

          <button
            onClick={onClose}
            disabled={loading}
            className="border px-3 py-1 rounded"
          >
            Cancel
          </button>

          <button
            onClick={remove}
            disabled={loading}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  )
}