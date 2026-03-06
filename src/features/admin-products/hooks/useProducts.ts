"use client"

import { useEffect, useState, useCallback } from "react"
import { Product } from "@/modules/products/types/product.types"

type ProductResponse = {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function useProducts(page: number = 1, limit: number = 10) {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = useCallback(async () => {

    try {

      setLoading(true)
      setError(null)

      const res = await fetch(
        `/api/admin/products?page=${page}&limit=${limit}`
      )

      if (!res.ok) {
        throw new Error("Failed to fetch products")
      }

      const data: ProductResponse = await res.json()

      setProducts(data.products)
      setTotal(data.total)
      setTotalPages(data.totalPages)

    } catch (err) {

      console.error(err)
      setError("Failed to load products")

    } finally {

      setLoading(false)

    }

  }, [page, limit])

  useEffect(() => {
    load()
  }, [load])

  return {
    products,
    total,
    totalPages,
    loading,
    error,
    reload: load
  }

}