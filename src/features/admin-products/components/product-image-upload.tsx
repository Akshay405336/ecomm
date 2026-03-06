"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type ProductImage = {
  id: string
  url: string
  type: "MAIN" | "GALLERY"
}

type Props = {
  initialImages?: ProductImage[]
  onMainChange: (file: File | null) => void
  onGalleryChange: (files: File[]) => void
  onRemoveMain?: () => void
  onRemoveGallery?: (url: string) => void
}

export default function ProductImageUpload({
  initialImages,
  onMainChange,
  onGalleryChange,
  onRemoveMain,
  onRemoveGallery
}: Props) {

  const [mainPreview, setMainPreview] = useState<string | null>(null)
  const [galleryPreview, setGalleryPreview] = useState<string[]>([])

  useEffect(() => {

    if (!initialImages) return

    const main = initialImages.find(i => i.type === "MAIN")
    const gallery = initialImages
      .filter(i => i.type === "GALLERY")
      .map(i => i.url)

    setMainPreview(main?.url ?? null)
    setGalleryPreview(gallery)

  }, [initialImages])


  const handleMainFile = (file: File | null) => {

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB")
      return
    }

    const url = URL.createObjectURL(file)

    setMainPreview(url)

    onMainChange(file)
  }


  const handleGalleryFiles = (files: FileList | null) => {

  if (!files) return

  const fileArray = Array.from(files)

  const newPreviews = fileArray.map(file => URL.createObjectURL(file))

  const updatedPreviews = [...galleryPreview, ...newPreviews].slice(0, 4)

  setGalleryPreview(updatedPreviews)

  const updatedFiles = [...fileArray].slice(0, 4)

  onGalleryChange(updatedFiles)
}


  const removeMain = () => {

    setMainPreview(null)

    onMainChange(null)

    onRemoveMain?.()
  }


  const removeGalleryImage = (index: number) => {

    const removedUrl = galleryPreview[index]

    const updated = [...galleryPreview]

    updated.splice(index, 1)

    setGalleryPreview(updated)

    // notify parent which gallery image was removed
    if (removedUrl) {
      onRemoveGallery?.(removedUrl)
    }

  }


  return (
    <div className="space-y-4">

      {/* MAIN IMAGE */}

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Main Image
        </label>

        {mainPreview && (
          <div className="relative w-24 h-24">

            <Image
              src={mainPreview}
              alt="Main"
              fill
              sizes="96px"
              className="object-cover rounded border"
            />

            <button
              type="button"
              onClick={removeMain}
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
            handleMainFile(e.target.files?.[0] || null)
          }
        />

      </div>


      {/* GALLERY */}

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Gallery Images (max 4)
        </label>

        <div className="flex gap-3 flex-wrap">

          {galleryPreview.map((img, index) => (

            <div key={index} className="relative w-20 h-20">

              <Image
                src={img}
                alt="Gallery"
                fill
                sizes="80px"
                className="object-cover rounded border"
              />

              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
              >
                ✕
              </button>

            </div>

          ))}

        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            handleGalleryFiles(e.target.files)
          }
        />

      </div>

    </div>
  )
}