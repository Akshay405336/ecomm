"use client"

import { useState, useEffect } from "react"

import {
  DndContext,
  closestCenter,
  DragEndEvent
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable"

import { CategoryListItem } from "@/modules/categories/types/category.types"

import { useCategories } from "../hooks/use-categories"
import CategoryFormModal from "./category-form-modal"
import CategoryDeleteDialog from "./category-delete-dialog"
import SortableRow from "./sortable-row"

export default function CategoryTable() {

  const { categories, loading, reload } = useCategories()

  const [items, setItems] = useState<CategoryListItem[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryListItem | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<CategoryListItem | null>(null)

  useEffect(() => {
    setItems(categories)
  }, [categories])

  async function handleDragEnd(event: DragEndEvent) {

    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex(i => i.id === active.id)
    const newIndex = items.findIndex(i => i.id === over.id)

    const newItems = arrayMove(items, oldIndex, newIndex)

    setItems(newItems)

    try {

      await fetch("/api/admin/categories/sort", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order: newItems.map((item, index) => ({
            id: item.id,
            sortOrder: index + 1
          }))
        })
      })

      reload()

    } catch (err) {

      console.error("Sort update failed", err)

    }

  }

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

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <table className="w-full text-left">

            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="p-3">Sort</th>
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
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}

              {!loading && items.length > 0 && (

                <SortableContext
                  items={items.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >

                  {items.map(cat => (
                    <SortableRow
                      key={cat.id}
                      category={cat}
                      onEdit={setEditCategory}
                      onDelete={setDeleteCategory}
                    />
                  ))}

                </SortableContext>

              )}

            </tbody>

          </table>

        </DndContext>

      </div>

      {createOpen && (
        <CategoryFormModal
          onClose={() => setCreateOpen(false)}
          onSuccess={reload}
        />
      )}

      {editCategory && (
        <CategoryFormModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSuccess={reload}
        />
      )}

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