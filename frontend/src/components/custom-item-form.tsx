'use client'

import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import type { Item } from '@/lib/types'

interface CustomItemFormProps {
  onAddCustomItem: (item: Item) => void
}

export function CustomItemForm({ onAddCustomItem }: CustomItemFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customItem, setCustomItem] = useState({
    name: '',
    price: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customItem.name || !customItem.price) return

    const newItem: Item = {
      id: `custom-${Date.now()}`,
      name: customItem.name,
      price: parseInt(customItem.price),
      category: 'カスタム',
    }

    onAddCustomItem(newItem)
    setCustomItem({ name: '', price: '' })
    setIsOpen(false)
  }

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          カスタムアイテムを追加
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div>
            <label htmlFor="customItemName" className="block text-sm font-medium text-gray-700 mb-1">
              アイテム名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customItemName"
              value={customItem.name}
              onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
              placeholder="カスタムアイテム名"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="customItemPrice" className="block text-sm font-medium text-gray-700 mb-1">
              価格 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">¥</span>
              <input
                type="number"
                id="customItemPrice"
                value={customItem.price}
                onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setCustomItem({ name: '', price: '' })
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  )
}