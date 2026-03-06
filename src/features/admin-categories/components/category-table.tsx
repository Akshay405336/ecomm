"use client"

import { useState } from "react"
import Image from "next/image"

import { CategoryListItem } from "@/modules/categories/types/category.types"

import { useCategories } from "../hooks/use-categories"
import CategoryFormModal from "./category-form-modal"
import CategoryDeleteDialog from "./category-delete-dialog"

export default function CategoryTable() {

  const { categories, loading, reload } = useCategories()

  const [createOpen, setCreateOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryListItem | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<CategoryListItem | null>(null)

  return (
    <div className="space-y-4">

      <div className="flex justify-between">

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Category
        </button>

      </div>

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Parent</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Loading categories...
                </td>
              </tr>
            )}

            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}

            {!loading && categories.map((cat) => (

              <tr key={cat.id} className="border-b">

                <td className="p-3">
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                  )}
                </td>

                <td>{cat.name}</td>

                <td className="text-gray-500">
                  {cat.slug}
                </td>

                <td className="text-gray-500">
                  {cat.parent?.name ?? "-"}
                </td>

                <td className="space-x-3 p-3">

                  <button
                    onClick={() => setEditCategory(cat)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteCategory(cat)}
                    className="text-red-500"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* CREATE MODAL */}
      {createOpen && (
        <CategoryFormModal
          onClose={() => setCreateOpen(false)}
          onSuccess={reload}
        />
      )}

      {/* EDIT MODAL */}
      {editCategory && (
        <CategoryFormModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSuccess={reload}
        />
      )}

      {/* DELETE DIALOG */}
      {deleteCategory && (
        <CategoryDeleteDialog
          category={deleteCategory}
          onClose={() => setDeleteCategory(null)}
          onSuccess={reload}
        />
      )}

    </div>
  )
}