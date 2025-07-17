'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import type { Category, Item } from '@/lib/types'

interface CategoryAccordionProps {
  categories: Category[]
  onItemSelect: (item: Item) => void
}

export function CategoryAccordion({ categories, onItemSelect }: CategoryAccordionProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-gray-900"
          >
            <span className="font-medium">{category.name}</span>
            <span
              className={`transform transition-transform ${
                openCategories.includes(category.id) ? 'rotate-90' : ''
              }`}
            >
              ▶
            </span>
          </button>
          
          {openCategories.includes(category.id) && (
            <div className="p-4 bg-white">
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-700">¥{item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => onItemSelect(item)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <PlusCircle className="h-4 w-4" />
                      追加
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}