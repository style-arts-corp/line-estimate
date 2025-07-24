'use client'

import React, { useState } from 'react'
import { Trash2, Edit, Check, X } from 'lucide-react'
import type { SelectedItem } from '@/lib/types'

interface SelectedItemsListProps {
  items: SelectedItem[]
  onQuantityChange: (id: string, quantity: number) => void
  onPriceChange: (id: string, price: number) => void
  onNameChange: (id: string, name: string) => void
  onRemove: (id: string) => void
}

export function SelectedItemsList({
  items,
  onQuantityChange,
  onPriceChange,
  onNameChange,
  onRemove,
}: SelectedItemsListProps) {
  const [editingName, setEditingName] = useState<string | null>(null)
  const [tempName, setTempName] = useState('')

  const startEditingName = (id: string, currentName: string) => {
    setEditingName(id)
    setTempName(currentName)
  }

  const saveNameEdit = (id: string) => {
    onNameChange(id, tempName)
    setEditingName(null)
    setTempName('')
  }

  const cancelNameEdit = () => {
    setEditingName(null)
    setTempName('')
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 商品情報セクション */}
            <div className="flex-1 space-y-2">
              {/* 商品名 */}
              <div className="flex items-center gap-2">
                {editingName === item.id ? (
                  <>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    <button
                      onClick={() => saveNameEdit(item.id)}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelNameEdit}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <button
                      onClick={() => startEditingName(item.id, item.name)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* 数量と価格 */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">数量:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">単価:</label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">¥</span>
                    <input
                      type="number"
                      min="0"
                      value={item.customPrice}
                      onChange={(e) => onPriceChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">小計:</span>
                  <span className="font-semibold text-gray-900">
                    ¥{(item.customPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 削除ボタン */}
            <button
              onClick={() => onRemove(item.id)}
              className="self-start sm:self-center p-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}