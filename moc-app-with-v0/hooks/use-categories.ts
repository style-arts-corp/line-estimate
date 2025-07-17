import { useState, useEffect } from 'react'
import type { Category } from '../lib/types'
import { getCategories } from '../lib/mock-data'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [sortDescending, setSortDescending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getCategories(sortDescending)
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sortDescending])

  const toggleSort = () => {
    setSortDescending(!sortDescending)
  }

  return {
    categories,
    loading,
    error,
    sortDescending,
    toggleSort
  }
}
