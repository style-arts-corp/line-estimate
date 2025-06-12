"use client"

import { useState, useEffect } from "react"
import { CustomerForm } from "@/components/customer-form"
import { CategoryAccordion } from "@/components/category-accordion"
import { SelectedItemsList } from "@/components/selected-items-list"
import { QuoteSummary } from "@/components/quote-summary"
import { CustomItemForm } from "@/components/custom-item-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MOCK_CATEGORIES } from "@/lib/mock-data"
import type { Item, SelectedItem, CustomerInfo } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function Home() {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    disposalDate: "",
  })
  const [showCustomerForm, setShowCustomerForm] = useState(true)
  // フォーム送信が試行されたかどうかを追跡
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    // localStorageからデータを読み込む
    const storedItems = localStorage.getItem("selectedItems")
    const storedCustomerInfo = localStorage.getItem("customerInfo")

    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems))
    }
    if (storedCustomerInfo) {
      setCustomerInfo(JSON.parse(storedCustomerInfo))
    }
  }, [])

  const addItem = (item: Item) => {
    const existingItem = selectedItems.find((i) => i.id === item.id)

    if (existingItem) {
      setSelectedItems(selectedItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)))
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1, customPrice: item.price }])
    }
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((item) => item.id !== id))
    } else {
      setSelectedItems(selectedItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const updateItemPrice = (id: string, customPrice: number) => {
    setSelectedItems(selectedItems.map((item) => (item.id === id ? { ...item, customPrice } : item)))
  }

  const updateItemName = (id: string, name: string) => {
    setSelectedItems(selectedItems.map((item) => (item.id === id ? { ...item, name } : item)))
  }

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id))
  }

  const addItemImage = (id: string, imageUrl: string) => {
    setSelectedItems(selectedItems.map((item) => (item.id === id ? { ...item, imageUrl } : item)))
  }

  const removeItemImage = (id: string) => {
    setSelectedItems(selectedItems.map((item) => (item.id === id ? { ...item, imageUrl: undefined } : item)))
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.customPrice * item.quantity, 0)
  }

  const handleGenerateQuote = () => {
    // フォーム送信が試行されたことをマーク
    setFormSubmitted(true)

    // 入力チェック
    const missingFields = []

    if (selectedItems.length === 0) {
      missingFields.push("廃棄品")
    }

    if (!customerInfo.name) {
      missingFields.push("顧客名")
    }

    if (!customerInfo.address) {
      missingFields.push("住所")
    }

    if (!customerInfo.phone) {
      missingFields.push("電話番号")
    }

    if (missingFields.length > 0) {
      // 必須項目が入力されていない場合は通知を表示
      toast({
        title: "入力が必要な項目があります",
        description: `${missingFields.join("、")}を入力してください。`,
        variant: "destructive",
        action: <ToastAction altText="閉じる">閉じる</ToastAction>,
      })

      // 顧客情報が不足している場合は、顧客情報フォームを表示
      if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
        setShowCustomerForm(true)
      }

      return
    }

    // 入力チェックが通ったら確認画面に遷移
    router.push("/confirmation")
    // For this demo, we'll just store the data in localStorage
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems))
    localStorage.setItem("customerInfo", JSON.stringify(customerInfo))
    localStorage.setItem("totalAmount", calculateTotal().toString())
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">廃棄品見積もりアプリ</h1>
          <div className="text-lg font-semibold">合計(税込): ¥{calculateTotal().toLocaleString()}</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="bg-white rounded-lg shadow p-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowCustomerForm(!showCustomerForm)}
          >
            <h2 className="text-lg font-semibold">顧客情報</h2>
            <span>{showCustomerForm ? "▲" : "▼"}</span>
          </div>

          {showCustomerForm && <CustomerForm customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">廃棄品選択</h2>
          <CategoryAccordion categories={MOCK_CATEGORIES} onItemSelect={addItem} />
          <CustomItemForm onAddCustomItem={addItem} />
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">選択済みアイテム</h2>
            <SelectedItemsList
              items={selectedItems}
              onQuantityChange={updateItemQuantity}
              onPriceChange={updateItemPrice}
              onNameChange={updateItemName}
              onRemove={removeItem}
              onImageAdd={addItemImage}
              onImageRemove={removeItemImage}
            />
          </div>
        )}

        {formSubmitted && selectedItems.length === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            廃棄品を1つ以上選択してください
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <QuoteSummary total={calculateTotal()} itemCount={selectedItems.length} />
          <Button onClick={handleGenerateQuote} size="lg">
            見積書生成
          </Button>
        </div>
      </div>
    </main>
  )
}
