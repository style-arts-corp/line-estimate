"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { SelectedItem, CustomerInfo } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Save, ArrowLeft, Check, ClipboardList, ExternalLink } from "lucide-react"

export default function InstructionsPage() {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    disposalDate: "",
  })
  const [totalAmount, setTotalAmount] = useState(0)

  // 指示書用の追加情報
  const [collectionDate, setCollectionDate] = useState("")
  const [notes, setNotes] = useState("")

  // 指示書が保存されたかどうかを追跡
  const [instructionsSaved, setInstructionsSaved] = useState(false)

  // 外部リンク
  const INSTRUCTIONS_URL =
    "https://docs.google.com/spreadsheets/d/1GwyUeSqpHi7qYJTYmyB2SswIkfp388pMyq9bgfKG9Jw/edit?usp=drive_link"
  const QUOTE_URL = "https://drive.google.com/file/d/1PjaDRt3vvEs4wBPKz0JMaTzcmMLrKPOl/view?usp=drive_link"

  useEffect(() => {
    // Retrieve data from localStorage
    const storedItems = localStorage.getItem("selectedItems")
    const storedCustomerInfo = localStorage.getItem("customerInfo")
    const storedTotal = localStorage.getItem("totalAmount")

    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems))
    }
    if (storedCustomerInfo) {
      setCustomerInfo(JSON.parse(storedCustomerInfo))
    }
    if (storedTotal) {
      setTotalAmount(Number(storedTotal))
    }
  }, [])

  const handleSaveInstructions = () => {
    // 指示書を保存する処理
    // 実際のアプリでは、ここでデータベースへの保存などを行う

    // 収集日と備考をlocalStorageに保存（実際のアプリではデータベースに保存）
    localStorage.setItem("collectionDate", collectionDate)
    localStorage.setItem("notes", notes)

    // 保存完了をマーク
    setInstructionsSaved(true)

    // アラートを削除
    // alert("指示書を保存しました。")
  }

  const handleNavigateToQuote = () => {
    // 見積書ページへ遷移する処理
    window.open(QUOTE_URL, "_blank")
  }

  const handleNavigateToInstructions = () => {
    // 指示書ページへ遷移する処理
    window.open(INSTRUCTIONS_URL, "_blank")
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">作業指示書</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">顧客情報</h2>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">名前:</span> {customerInfo.name}
                  </p>
                  <p>
                    <span className="font-medium">住所:</span> {customerInfo.address}
                  </p>
                  <p>
                    <span className="font-medium">電話番号:</span> {customerInfo.phone}
                  </p>
                  {customerInfo.email && (
                    <p>
                      <span className="font-medium">メール:</span> {customerInfo.email}
                    </p>
                  )}
                  {customerInfo.disposalDate && (
                    <p>
                      <span className="font-medium">廃棄予定日:</span> {customerInfo.disposalDate}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* 収集日と備考の入力フォーム */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="collection-date">収集日</Label>
                  <Input
                    id="collection-date"
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    placeholder="例: 2023年5月1日 午前10時"
                    disabled={instructionsSaved}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">備考</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="特記事項や注意点などを入力してください"
                    rows={4}
                    disabled={instructionsSaved}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-semibold mb-2">廃棄品リスト</h2>
                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-start">
                      {item.imageUrl && (
                        <div className="h-16 w-16 mr-3 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={`${item.name}の写真`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow flex justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <div>¥{(item.customPrice * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>合計金額(税込)</span>
                <span>¥{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col space-y-4">
          {instructionsSaved ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  指示書が保存されました。次のステップに進んでください。
                </div>
              </div>

              <Button
                onClick={handleNavigateToInstructions}
                size="lg"
                className="w-full flex items-center justify-center"
                variant="default"
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                指示書へ遷移
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={handleNavigateToQuote}
                size="lg"
                className="w-full flex items-center justify-center"
                variant="outline"
              >
                <FileText className="mr-2 h-5 w-5" />
                見積書へ遷移
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button onClick={handleSaveInstructions} size="lg" className="w-full flex items-center justify-center">
              <Save className="mr-2 h-5 w-5" />
              指示書を保存
            </Button>
          )}

          <Button
            onClick={() => router.push("/confirmation")}
            variant={instructionsSaved ? "outline" : "ghost"}
            size="lg"
            className="w-full flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            確認画面に戻る
          </Button>
        </div>
      </div>
    </main>
  )
}
