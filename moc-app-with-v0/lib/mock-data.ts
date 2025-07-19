import type { Category } from "./types"
import { fetchCategoriesFromBackend } from "./google-sheets"

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "chairs",
    name: "椅子",
    items: [
      { id: "pipe-chair", name: "パイプ椅子", price: 500, category: "chairs" },
      { id: "office-chair", name: "オフィスチェア", price: 800, category: "chairs" },
      { id: "sofa-1p", name: "ソファー（1人掛け）", price: 2000, category: "chairs" },
      { id: "sofa-2p", name: "ソファー（2人掛け）", price: 3000, category: "chairs" },
      { id: "sofa-3p", name: "ソファー（3人掛け）", price: 4000, category: "chairs" },
    ],
  },
  {
    id: "tables",
    name: "机・テーブル",
    items: [
      { id: "work-desk", name: "事務机", price: 1500, category: "tables" },
      { id: "dining-table", name: "ダイニングテーブル", price: 2500, category: "tables" },
      { id: "coffee-table", name: "コーヒーテーブル", price: 1000, category: "tables" },
      { id: "side-table", name: "サイドテーブル", price: 700, category: "tables" },
    ],
  },
  {
    id: "cabinets",
    name: "タンス・収納",
    items: [
      { id: "clothes-cabinet", name: "洋服タンス", price: 3000, category: "cabinets" },
      { id: "bookshelf", name: "本棚", price: 1500, category: "cabinets" },
      { id: "tv-stand", name: "テレビ台", price: 2000, category: "cabinets" },
      { id: "chest", name: "引き出し（4段）", price: 2500, category: "cabinets" },
    ],
  },
  {
    id: "appliances",
    name: "家電製品",
    items: [
      { id: "tv", name: "テレビ", price: 3500, category: "appliances" },
      { id: "refrigerator", name: "冷蔵庫", price: 5000, category: "appliances" },
      { id: "washing-machine", name: "洗濯機", price: 4000, category: "appliances" },
      { id: "microwave", name: "電子レンジ", price: 2000, category: "appliances" },
    ],
  },
  {
    id: "beds",
    name: "ベッド・寝具",
    items: [
      { id: "single-bed", name: "シングルベッド", price: 3000, category: "beds" },
      { id: "double-bed", name: "ダブルベッド", price: 4500, category: "beds" },
      { id: "mattress", name: "マットレス", price: 2000, category: "beds" },
      { id: "futon", name: "布団", price: 1500, category: "beds" },
    ],
  },
  {
    id: "other",
    name: "その他",
    items: [
      { id: "other-small", name: "その他（小）", price: 500, category: "other" },
      { id: "other-medium", name: "その他（中）", price: 1500, category: "other" },
      { id: "other-large", name: "その他（大）", price: 3000, category: "other" },
      { id: "other-custom", name: "その他（カスタム）", price: 0, category: "other" },
    ],
  },
]

// Hook to fetch categories from backend (which decides between Google Sheets or mock data)
export async function getCategories(sortDescending: boolean = false): Promise<Category[]> {
  try {
    // Fetch from backend API (backend will decide between Google Sheets or mock data)
    const categories = await fetchCategoriesFromBackend(sortDescending)

    // If backend returns data, use it; otherwise use local mock data
    return categories.length > 0 ? categories : MOCK_CATEGORIES
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Fallback to local mock data if backend fails
    return MOCK_CATEGORIES
  }
}
