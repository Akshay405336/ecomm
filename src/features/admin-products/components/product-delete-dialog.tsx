"use client"

import { useState } from "react"
import { Product } from "@/modules/products/types/product.types"

type Props = {
  product?: Product
  bulkIds?: string[]
  onClose: () => void
  onSuccess: () => void
}

export default function ProductDeleteDialog({
  product,
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
          "/api/admin/products/bulk-delete",
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
      else if (product) {

        res = await fetch(
          `/api/admin/products/${product.id}`,
          {
            method: "DELETE"
          }
        )

      }

      else {
        throw new Error("No product provided")
      }

      if (!res.ok) {
        throw new Error("Failed to delete product")
      }

      onSuccess()
      onClose()

    } catch (err) {

      console.error(err)
      alert("Could not delete product")

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded space-y-4 w-80">

        <p className="text-sm">

          {bulkIds && bulkIds.length > 0 ? (
            <>Delete <b>{bulkIds.length}</b> selected products?</>
          ) : (
            <>Delete <b>{product?.name}</b>?</>
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