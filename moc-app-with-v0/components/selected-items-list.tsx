"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Trash2, Camera, X, Edit, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SelectedItem } from "@/lib/types"

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
  // ファイル入力への参照を作成
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // 編集中のアイテムIDと名前を管理
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>("")

  // 画像ファイルを選択したときの処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください")
      return
    }

    // 画像ファイルかチェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください")
      return
    }

    // FileReaderでBase64エンコード
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageAdd(itemId, event.target.result.toString())
      }
    }
    reader.readAsDataURL(file)

    // 入力フィールドをリセット
    e.target.value = ""
  }

  // 写真追加ボタンをクリックしたときの処理
  const handleAddPhotoClick = (itemId: string) => {
    // ファイル入力要素をクリック
    fileInputRefs.current[itemId]?.click()
  }

  // 名前編集を開始
  const startEditing = (item: SelectedItem) => {
    setEditingItemId(item.id)
    setEditingName(item.name)
  }

  // 名前編集を保存
  const saveEditing = () => {
    if (editingItemId && editingName.trim()) {
      onNameChange(editingItemId, editingName)
      setEditingItemId(null)
      setEditingName("")
    }
  }

  // 名前編集をキャンセル
  const cancelEditing = () => {
    setEditingItemId(null)
    setEditingName("")
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col p-3 border border-gray-200 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex-grow mb-2 sm:mb-0">
              {editingItemId === item.id ? (
                <div className="flex items-center">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="mr-2"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditing()
                      if (e.key === "Escape") cancelEditing()
                    }}
                  />
                  <Button variant="ghost" size="icon" onClick={saveEditing} className="h-8 w-8">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={cancelEditing} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="font-medium">{item.name}</div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={() => startEditing(item)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="text-sm text-gray-500">単価(税込): ¥{item.customPrice.toLocaleString()}</div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onQuantityChange(item.id, Number.parseInt(e.target.value) || 0)}
                  className="h-8 w-16 rounded-none text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>

              <div className="flex items-center">
                <span className="mr-2 text-sm">¥</span>
                <Input
                  type="number"
                  value={item.customPrice}
                  onChange={(e) => onPriceChange(item.id, Number.parseInt(e.target.value) || 0)}
                  className="h-8 w-24"
                  min="0"
                />
              </div>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onRemove(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 小計表示 */}
          <div className="mt-1 text-right text-sm font-medium">
            <span>小計(税込): ¥{(item.customPrice * item.quantity).toLocaleString()}</span>
          </div>

          {/* 写真表示/アップロードエリア */}
          <div className="mt-3 flex items-center">
            {item.imageUrl ? (
              <div className="relative">
                <div className="relative h-20 w-20 rounded overflow-hidden border border-gray-200">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={`${item.name}の写真`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 absolute -top-2 -right-2 rounded-full"
                  onClick={() => onImageRemove(item.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => handleAddPhotoClick(item.id)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  写真を追加
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`file-upload-${item.id}`}
                  onChange={(e) => handleFileChange(e, item.id)}
                  ref={(el) => (fileInputRefs.current[item.id] = el)}
                />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
