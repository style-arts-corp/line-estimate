'use client'

import React, { useRef, useState } from 'react'
import { Trash2, Camera, X, Edit, Check } from 'lucide-react'
import type { SelectedItem } from '@/lib/types'

interface SelectedItemsListProps {
  items: SelectedItem[]
  onQuantityChange: (id: string, quantity: number) => void
  onPriceChange: (id: string, price: number) => void
  onNameChange: (id: string, name: string) => void
  onRemove: (id: string) => void
  onImageAdd: (id: string, imageUrl: string) => void
  onImageRemove: (id: string) => void
}

export function SelectedItemsList({
  items,
  onQuantityChange,
  onPriceChange,
  onNameChange,
  onRemove,
  onImageAdd,
  onImageRemove,
}: SelectedItemsListProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const [editingName, setEditingName] = useState<string | null>(null)
  const [tempName, setTempName] = useState('')

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      onImageAdd(id, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

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
            {/* 画像セクション */}
            <div className="flex-shrink-0">
              {item.imageUrl ? (
                <div className="relative w-24 h-24">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => onImageRemove(item.id)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    ref={(el) => {
                      fileInputRefs.current[item.id] = el
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(item.id, file)
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRefs.current[item.id]?.click()}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Camera className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">写真追加</span>
                  </button>
                </div>
              )}
            </div>

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