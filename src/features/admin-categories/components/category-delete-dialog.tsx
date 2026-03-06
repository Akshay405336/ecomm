"use client"

import { useState } from "react"
import { Category } from "@/modules/categories/types/category.types"

type Props = {
  category?: Category
  bulkIds?: string[]
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryDeleteDialog({
  category,
  bulkIds,
  onClose,
  onSuccess
}: Props) {

  const [loading, setLoading] = useState(false)

  const remove = async () => {

    try {

      setLoading(true)

      let res: Response

      // BULK DELETE
      if (bulkIds && bulkIds.length > 0) {

        res = await fetch(
          "/api/admin/categories/bulk-delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ids: bulkIds
            })
          }
        )

      } 
      
      // SINGLE DELETE
      else if (category) {

        res = await fetch(
          `/api/admin/categories/${category.id}`,
          {
            method: "DELETE"
          }
        )

      } 
      
      else {
        throw new Error("No category provided")
      }

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

          {bulkIds && bulkIds.length > 0 ? (
            <>Delete <b>{bulkIds.length}</b> selected categories?</>
          ) : (
            <>Delete <b>{category?.name}</b>?</>
          )}

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