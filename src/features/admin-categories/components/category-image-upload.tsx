"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Props = {
  onChange: (file: File | null, removed?: boolean) => void
  initialImage?: string | null
}

export default function CategoryImageUpload({
  onChange,
  initialImage
}: Props) {

  const [preview, setPreview] = useState<string | null>(initialImage ?? null)

  // sync when editing different category
  useEffect(() => {
    setPreview(initialImage ?? null)
  }, [initialImage])

  const handleFile = (file: File | null) => {

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB")
      return
    }

    const url = URL.createObjectURL(file)

    setPreview(url)

    onChange(file, false)
  }

  const removeImage = () => {

    setPreview(null)

    // tell parent image was removed
    onChange(null, true)
  }

  // cleanup blob URLs
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">
        Category Image
      </label>

      {preview && (
        <div className="relative w-24 h-24">

          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded border"
          />

          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
          >
            ✕
          </button>

        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleFile(e.target.files?.[0] || null)
        }
      />

    </div>
  )
}