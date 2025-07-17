'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Save, ArrowLeft, Check, ClipboardList, ExternalLink } from 'lucide-react'
import type { SelectedItem, CustomerInfo } from '@/lib/types'

export default function InstructionsPage() {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    disposalDate: '',
  })
  const [totalAmount, setTotalAmount] = useState(0)
  const [collectionDate, setCollectionDate] = useState('')
  const [notes, setNotes] = useState('')
  const [instructionsSaved, setInstructionsSaved] = useState(false)

  const INSTRUCTIONS_URL =
    'https://docs.google.com/spreadsheets/d/1GwyUeSqpHi7qYJTYmyB2SswIkfp388pMyq9bgfKG9Jw/edit?usp=drive_link'
  const QUOTE_URL = 'https://drive.google.com/file/d/1PjaDRt3vvEs4wBPKz0JMaTzcmMLrKPOl/view?usp=drive_link'

  useEffect(() => {
    const storedItems = localStorage.getItem('selectedItems')
    const storedCustomerInfo = localStorage.getItem('customerInfo')
    const storedTotal = localStorage.getItem('totalAmount')

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
    localStorage.setItem('collectionDate', collectionDate)
    localStorage.setItem('notes', notes)
    setInstructionsSaved(true)
  }

  const handleNavigateToQuote = () => {
    window.open(QUOTE_URL, '_blank')
  }

  const handleNavigateToInstructions = () => {
    window.open(INSTRUCTIONS_URL, '_blank')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-center text-gray-900">作業指示書</h1>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">顧客情報</h2>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">名前:</span> {customerInfo.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">住所:</span> {customerInfo.address}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">電話番号:</span> {customerInfo.phone}
                  </p>
                  {customerInfo.email && (
                    <p className="text-gray-700">
                      <span className="font-medium">メール:</span> {customerInfo.email}
                    </p>
                  )}
                  {customerInfo.disposalDate && (
                    <p className="text-gray-700">
                      <span className="font-medium">廃棄予定日:</span> {customerInfo.disposalDate}
                    </p>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="collection-date" className="block text-sm font-medium text-gray-700">
                    収集日
                  </label>
                  <input
                    type="text"
                    id="collection-date"
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    placeholder="例: 2023年5月1日 午前10時"
                    disabled={instructionsSaved}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    備考
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="特記事項や注意点などを入力してください"
                    rows={4}
                    disabled={instructionsSaved}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">廃棄品リスト</h2>
                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-start">
                      {item.imageUrl && (
                        <div className="h-16 w-16 mr-3 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                          <img
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={`${item.name}の写真`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow flex justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <div className="text-gray-900">¥{(item.customPrice * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>合計金額(税込)</span>
                <span>¥{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {instructionsSaved ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  指示書が保存されました。次のステップに進んでください。
                </div>
              </div>

              <button
                onClick={handleNavigateToInstructions}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                指示書へ遷移
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>

              <button
                onClick={handleNavigateToQuote}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <FileText className="mr-2 h-5 w-5" />
                見積書へ遷移
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleSaveInstructions}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Save className="mr-2 h-5 w-5" />
              指示書を保存
            </button>
          )}

          <button
            onClick={() => router.push('/confirmation')}
            className={`w-full px-6 py-3 font-medium rounded-md transition-colors flex items-center justify-center ${
              instructionsSaved
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            確認画面に戻る
          </button>
        </div>
      </div>
    </main>
  )
}