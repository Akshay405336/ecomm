"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"

import { CategoryListItem } from "@/modules/categories/types/category.types"

type Props = {
  category: CategoryListItem
  onEdit: (category: CategoryListItem) => void
  onDelete: (category: CategoryListItem) => void
}

export default function SortableRow({
  category,
  onEdit,
  onDelete
}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b"
    >

      {/* DRAG HANDLE */}
      <td
        className="p-3 cursor-grab font-bold text-gray-400"
        {...attributes}
        {...listeners}
      >
        ☰
      </td>

      {/* IMAGE */}
      <td className="p-3">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            width={40}
            height={40}
            className="object-cover rounded"
          />
        )}
      </td>

      {/* NAME */}
      <td>
        {category.name}
      </td>

      {/* SLUG */}
      <td className="text-gray-500">
        {category.slug}
      </td>

      {/* PARENT */}
      <td className="text-gray-500">
        {category.parent?.name ?? "-"}
      </td>

      {/* ACTIONS */}
      <td className="space-x-3 p-3">

        <button
          onClick={() => onEdit(category)}
          className="text-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(category)}
          className="text-red-500"
        >
          Delete
        </button>

      </td>

    </tr>
  )
}