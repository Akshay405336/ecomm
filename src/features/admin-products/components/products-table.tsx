"use client"

import { useState, useMemo } from "react"

import { Product } from "@/modules/products/types/product.types"
import { useProducts } from "../hooks/useProducts"
import { useCategories } from "@/features/admin-categories/hooks/use-categories"

import ProductFormModal from "./product-form-modal"
import BulkImportModal from "./bulk-import-modal"
import ProductDeleteDialog from "./product-delete-dialog"
import ProductRow from "./product-row"

export default function ProductsTable() {

  const { products, loading, reload } = useProducts()
  const { categories } = useCategories()

  const [createOpen, setCreateOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [bulkImportOpen, setBulkImportOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const [page, setPage] = useState(1)
  const perPage = 10

  const filteredProducts = useMemo(() => {

    let data = products

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (categoryFilter) {
      data = data.filter((p) => p.categoryId === categoryFilter)
    }

    return data

  }, [products, search, categoryFilter])

  const paginated = useMemo(() => {

    const start = (page - 1) * perPage
    return filteredProducts.slice(start, start + perPage)

  }, [filteredProducts, page])

  const totalPages = Math.ceil(filteredProducts.length / perPage)

  function toggleSelect(id: string) {

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )

  }

  function toggleSelectAll() {

    if (selectedIds.length === paginated.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginated.map((p) => p.id))
    }

  }

  return (

    <div className="space-y-4">

      {/* TOP BAR */}

      <div className="flex justify-between items-center gap-4">

        <div className="flex gap-2">

  <button
    onClick={() => setCreateOpen(true)}
    className="bg-black text-white px-4 py-2 rounded"
  >
    Add Product
  </button>

  <button
    onClick={() => setBulkImportOpen(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Bulk Import
  </button>

  <button
  onClick={() => {
    window.location.href = "/api/admin/products/export"
  }}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Export Products
</button>


</div>

        <div className="flex gap-3">

          {/* SEARCH */}
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="border p-2 rounded"
          />

          {/* CATEGORY FILTER */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}

          </select>

        </div>

      </div>

      {selectedIds.length > 0 && (
        <button
          onClick={() => setBulkDeleteOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedIds.length})
        </button>
      )}

      {/* TABLE */}

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b text-sm text-gray-500">

              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    paginated.length > 0 &&
                    selectedIds.length === paginated.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Quantity</th>
              <th>Status</th>
              <th className="p-3">Actions</th>

            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            )}

            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}

            {!loading && paginated.length > 0 && (

              <>
                {paginated.map((product) => (

                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={setEditProduct}
                    onDelete={setDeleteProduct}
                    selected={selectedIds.includes(product.id)}
                    onSelect={() => toggleSelect(product.id)}
                  />

                ))}
              </>

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-3">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border px-3 py-1 rounded"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border px-3 py-1 rounded"
          >
            Next
          </button>

        </div>

      )}

      {/* MODALS */}

      {createOpen && (
        <ProductFormModal
          onClose={() => setCreateOpen(false)}
          onSuccess={reload}
        />
      )}

      {editProduct && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={reload}
        />
      )}

      {deleteProduct && (
        <ProductDeleteDialog
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onSuccess={reload}
        />
      )}

      {bulkDeleteOpen && (
        <ProductDeleteDialog
          bulkIds={selectedIds}
          onClose={() => setBulkDeleteOpen(false)}
          onSuccess={() => {
            setSelectedIds([])
            reload()
          }}
        />
      )}

      {bulkImportOpen && (
  <BulkImportModal
    onClose={() => setBulkImportOpen(false)}
    onSuccess={reload}
  />
)}

    </div>

  )

}