"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Item } from "@/lib/types"
import { PlusCircle } from "lucide-react"

interface CustomItemFormProps {
  onAddCustomItem: (item: Item) => void
}

export function CustomItemForm({ onAddCustomItem }: CustomItemFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || price <= 0) {
      alert("名前と価格を正しく入力してください")
      return
    }

    // カスタムIDを生成（タイムスタンプ + ランダム文字列）
    const customId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // 新しいアイテムを作成（カテゴリーは固定で "other" を使用）
    const newItem: Item = {
      id: customId,
      name,
      price,
      category: "other",
    }

    // 親コンポーネントに新しいアイテムを渡す
    onAddCustomItem(newItem)

    // フォームをリセット
    setName("")
    setPrice(0)
    setShowForm(false)
  }

  return (
    <div className="mt-4 border-t pt-4">
      {!showForm ? (
        <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => setShowForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          カスタムアイテムを追加
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-medium">カスタムアイテムを追加</h3>

          <div className="grid gap-2">
            <Label htmlFor="item-name">アイテム名</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 大型家具"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="item-price">価格 (円)</Label>
            <Input
              id="item-price"
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="例: 2000"
              min="1"
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              追加
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
              キャンセル
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
