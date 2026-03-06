"use client"

import { useEffect, useState, useCallback } from "react"
import { CategoryListItem } from "@/modules/categories/types/category.types"

export function useCategories() {

  const [categories, setCategories] = useState<CategoryListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {

    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/admin/categories")

      if (!res.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data: CategoryListItem[] = await res.json()

      setCategories(data)

    } catch (err) {

      console.error(err)
      setError("Failed to load categories")

    } finally {
      setLoading(false)
    }

  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    categories,
    loading,
    error,
    reload: load
  }

}