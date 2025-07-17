import type { Category } from "./types"

// Backend API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

interface ApiResponse {
  success: boolean
  data: {
    categories: Category[]
    source: 'google_sheets' | 'mock_data'
    sorted: boolean
  }
  error?: string
}

export async function fetchCategoriesFromBackend(sortDescending: boolean = false): Promise<Category[]> {
  try {
    const params = new URLSearchParams()
    if (sortDescending) {
      params.append('sort', 'true')
    }

    const url = `${API_BASE_URL}/categories${params.toString() ? `?${params.toString()}` : ''}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse: ApiResponse = await response.json()

    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'API request failed')
    }

    return apiResponse.data.categories
  } catch (error) {
    console.error('Error fetching data from backend:', error)
    return []
  }
}

// Legacy function name for backward compatibility
export async function fetchCategoriesFromGoogleSheets(): Promise<Category[]> {
  return fetchCategoriesFromBackend(false)
}

export function sortCategoriesDescending(categories: Category[]): Category[] {
  return categories.map(category => ({
    ...category,
    items: [...category.items].sort((a, b) => b.price - a.price)
  }))
}
