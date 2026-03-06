"use client"

import { useState, useEffect } from "react"
import { CategoryListItem } from "@/modules/categories/types/category.types"

import CategoryImageUpload from "./category-image-upload"
import ParentCategorySelect from "./parent-category-select"

type Props = {
  category?: CategoryListItem
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryFormModal({
  category,
  onClose,
  onSuccess
}: Props) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)

  const [parentId, setParentId] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (category) {
      setName(category.name ?? "")
      setDescription(category.description ?? "")
      setParentId(category.parentId ?? null)
      setSortOrder(category.sortOrder ?? 0)
      setIsActive(category.isActive ?? true)
    } else {
      setName("")
      setDescription("")
      setParentId(null)
      setSortOrder(0)
      setIsActive(true)
    }

    setImage(null)
    setRemoveImage(false)

  }, [category])

  const submit = async () => {

    if (loading) return

    if (!name.trim()) {
      alert("Category name is required")
      return
    }

    try {

      setLoading(true)

      const formData = new FormData()

      formData.append("name", name.trim())
      formData.append("description", description.trim())
      formData.append("sortOrder", String(sortOrder))
      formData.append("isActive", String(isActive))
      formData.append("parentId", parentId ?? "null")

      if (image) {
        formData.append("image", image)
      }

      if (removeImage) {
        formData.append("removeImage", "true")
      }

      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories"

      const method = category ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        body: formData
      })

      if (!res.ok) {
        throw new Error("Failed to save category")
      }

      onSuccess()
      onClose()

    } catch (err) {

      console.error(err)
      alert("Something went wrong")

    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-96 space-y-4">

        <h2 className="text-lg font-bold">
          {category ? "Edit Category" : "Create Category"}
        </h2>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="border w-full p-2 rounded"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border w-full p-2 rounded"
        />

        {/* Parent Category */}
        <ParentCategorySelect
          value={parentId}
          onChange={setParentId}
          excludeId={category?.id}
        />

        {/* Image Upload */}
        <CategoryImageUpload
          initialImage={category?.image}
          onChange={(file, removed) => {
            setImage(file)
            if (removed) setRemoveImage(true)
          }}
        />

        {/* Sort Order */}
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          placeholder="Sort order"
          className="border w-full p-2 rounded"
        />

        {/* Active Toggle */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active Category
        </label>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="border px-3 py-1 rounded"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

      </div>

    </div>
  )
}