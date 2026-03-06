"use client"

import { useState, useEffect } from "react"

import { Product } from "@/modules/products/types/product.types"

import ProductImageUpload from "./product-image-upload"
import CategorySelect from "./category-select"

type Props = {
  product?: Product
  onClose: () => void
  onSuccess: () => void
}

export default function ProductFormModal({
  product,
  onClose,
  onSuccess
}: Props) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [shortDesc, setShortDesc] = useState("")

  const [originalPrice, setOriginalPrice] = useState(0)
  const [discountPrice, setDiscountPrice] = useState<number | null>(null)

  const [quantity, setQuantity] = useState(0)
  const [quantityUnit, setQuantityUnit] = useState("PCS")

  const [tags, setTags] = useState("")

  const [categoryId, setCategoryId] = useState<string | null>(null)

  const [isAvailable, setIsAvailable] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])

  const [removeMainImage, setRemoveMainImage] = useState(false)
  const [removedGallery, setRemovedGallery] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (product) {

      setName(product.name ?? "")
      setDescription(product.description ?? "")
      setShortDesc(product.shortDesc ?? "")

      setOriginalPrice(product.originalPrice ?? 0)
      setDiscountPrice(product.discountPrice ?? null)

      setQuantity(product.quantity ?? 0)
      setQuantityUnit(product.quantityUnit ?? "PCS")

      setTags(product.tags?.join(",") ?? "")

      setCategoryId(product.categoryId ?? null)

      setIsAvailable(product.isAvailable ?? true)
      setIsFeatured(product.isFeatured ?? false)
      setIsTrending(product.isTrending ?? false)
      setIsActive(product.isActive ?? true)

      setMetaTitle(product.metaTitle ?? "")
      setMetaDescription(product.metaDescription ?? "")

    } else {

      // Reset form when creating new product
      setName("")
      setDescription("")
      setShortDesc("")

      setOriginalPrice(0)
      setDiscountPrice(null)

      setQuantity(0)
      setQuantityUnit("PCS")

      setTags("")

      setCategoryId(null)

      setIsAvailable(true)
      setIsFeatured(false)
      setIsTrending(false)
      setIsActive(true)

      setMetaTitle("")
      setMetaDescription("")
    }

    // reset images
    setMainImage(null)
    setGalleryImages([])
    setRemoveMainImage(false)
    setRemovedGallery([])

  }, [product])

  const submit = async () => {

    if (loading) return

    if (!name.trim()) {
      alert("Product name is required")
      return
    }

    if (!categoryId) {
      alert("Category is required")
      return
    }

    if (originalPrice <= 0) {
      alert("Price must be greater than 0")
      return
    }

    try {

      setLoading(true)

      const formData = new FormData()

      formData.append("name", name.trim())
      formData.append("description", description.trim())
      formData.append("shortDesc", shortDesc.trim())

      formData.append("originalPrice", String(originalPrice))

      if (discountPrice !== null) {
        formData.append("discountPrice", String(discountPrice))
      }

      formData.append("quantity", String(quantity))
      formData.append("quantityUnit", quantityUnit)

      // clean tags
      const cleanedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(",")

      formData.append("tags", cleanedTags)

      formData.append("categoryId", categoryId)

      formData.append("isAvailable", String(isAvailable))
      formData.append("isFeatured", String(isFeatured))
      formData.append("isTrending", String(isTrending))
      formData.append("isActive", String(isActive))

      formData.append("metaTitle", metaTitle)
      formData.append("metaDescription", metaDescription)

      if (mainImage) {
        formData.append("mainImage", mainImage)
      }

      galleryImages.forEach((img) => {
        formData.append("galleryImages", img)
      })

      if (removeMainImage) {
        formData.append("removeMainImage", "true")
      }
      removedGallery.forEach((img) => {
  formData.append("removeGalleryImages", img)
})

      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"

      const method = product ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        body: formData
      })

      if (!res.ok) {
        throw new Error("Failed to save product")
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center overflow-y-auto">

      <div className="bg-white p-6 rounded w-[600px] max-h-[90vh] overflow-y-auto space-y-4">

        <h2 className="text-lg font-bold">
          {product ? "Edit Product" : "Create Product"}
        </h2>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="border w-full p-2 rounded"
        />

        {/* Short Description */}
        <textarea
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          placeholder="Short description"
          className="border w-full p-2 rounded"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border w-full p-2 rounded"
        />

        {/* Category */}
        <CategorySelect
          value={categoryId}
          onChange={setCategoryId}
        />

        {/* Price */}
        <div className="grid grid-cols-2 gap-3">

          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            placeholder="Original Price"
            className="border p-2 rounded"
          />

          <input
            type="number"
            value={discountPrice ?? ""}
            onChange={(e) =>
              setDiscountPrice(
                e.target.value ? Number(e.target.value) : null
              )
            }
            placeholder="Discount Price"
            className="border p-2 rounded"
          />

        </div>

        {/* Quantity */}
        <div className="grid grid-cols-2 gap-3">

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
            className="border p-2 rounded"
          />

          <select
            value={quantityUnit}
            onChange={(e) => setQuantityUnit(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="PCS">PCS</option>
            <option value="ML">ML</option>
            <option value="L">L</option>
            <option value="G">G</option>
            <option value="KG">KG</option>
          </select>

        </div>

        {/* Tags */}
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="border w-full p-2 rounded"
        />

        {/* Images */}
        <ProductImageUpload
  initialImages={product?.images}
  onMainChange={setMainImage}
  onGalleryChange={setGalleryImages}
  onRemoveMain={() => setRemoveMainImage(true)}
  onRemoveGallery={(url) =>
    setRemovedGallery(prev => [...prev, url])
  }
/>

        {/* Toggles */}
        <div className="flex gap-4 text-sm">

          <label>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Available
          </label>

          <label>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured
          </label>

          <label>
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
            />
            Trending
          </label>

          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>

        </div>

        {/* SEO */}
        <input
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="Meta Title"
          className="border w-full p-2 rounded"
        />

        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Meta Description"
          className="border w-full p-2 rounded"
        />

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