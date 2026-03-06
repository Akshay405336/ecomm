"use client"

import Image from "next/image"
import { Product } from "@/modules/products/types/product.types"

type Props = {
  product: Product
  selected: boolean
  onSelect: () => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductRow({
  product,
  selected,
  onSelect,
  onEdit,
  onDelete
}: Props) {

  const mainImage = product.images?.find(
    (img) => img.type === "MAIN"
  )

  return (
    <tr className="border-b">

      {/* SELECT */}
      <td className="p-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
        />
      </td>

      {/* IMAGE */}
      <td className="p-3">

        {mainImage && (
          <Image
            src={mainImage.url}
            alt={product.name}
            width={40}
            height={40}
            className="object-cover rounded"
          />
        )}

      </td>

      {/* NAME */}
      <td>
        {product.name}
      </td>

      {/* PRICE */}
      <td className="text-gray-600">
        ₹{product.originalPrice}
      </td>

      {/* DISCOUNT */}
      <td className="text-gray-600">
        {product.discountPrice
          ? `₹${product.discountPrice}`
          : "-"
        }
      </td>

      {/* QUANTITY */}
      <td className="text-gray-500">
        {product.quantity} {product.quantityUnit}
      </td>

      {/* STATUS */}
      <td className="text-gray-500">
        {product.isActive ? "Active" : "Inactive"}
      </td>

      {/* ACTIONS */}
      <td className="space-x-3 p-3">

        <button
          onClick={() => onEdit(product)}
          className="text-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(product)}
          className="text-red-500"
        >
          Delete
        </button>

      </td>

    </tr>
  )
}