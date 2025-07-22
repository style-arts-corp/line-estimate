'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FileText, FileOutput, ExternalLink } from 'lucide-react'
import { useAppContext } from '@/contexts/AppContext'
import {usePostApiV1EstimatesPdf} from '@/orval/generated/estimates/estimates'

export default function ConfirmationPage() {
  const router = useRouter()
  const { state } = useAppContext()
  const [quoteGenerated, setQuoteGenerated] = useState(false)

  useEffect(() => {
    // quoteGenerated 状態を Context から取得
    setQuoteGenerated(state.quoteGenerated)
  }, [state.quoteGenerated])

  const { mutate: generateEstimatePDF, isPending: isGenerating, error } = usePostApiV1EstimatesPdf()

  const handleGenerateQuote = async () => {
      // 見積書データを準備
        const customer=  {
          name: state.customerInfo.name || '顧客名未設定',
          address: state.customerInfo.address || '住所未設定',
          phone: state.customerInfo.phone || '電話番号未設定',
          email: state.customerInfo.email || 'メール未設定',
          disposalDate: state.customerInfo.disposalDate || '廃棄予定日未設定',
        }
        const items= state.selectedItems.map(item => ({
          id: item.name, // id
          quantity: item.quantity, //数量
          customPrice: item.customPrice, // 単価
          amount: item.customPrice * item.quantity // 小計
        }))

      // カスタムクライアントを使用してAPIを呼び出す
      generateEstimatePDF({
        data: {
          customer,
          items
        }
      },{
        onSuccess: (data) => {
          console.log(data)
        },
        onError: (error) => {
          console.error(error)
        }
      })
  }

  const handleNavigateToQuote = () => {
    // APIから返されたPDFのURLを使用、なければデフォルトURL
    // window.open(pdfUrl || QUOTE_URL, '_blank')
    alert("PDFへ遷移する")
  }

  const handleNavigateToInstructions = () => {
    router.push('/instructions')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-center text-gray-900">見積書確認</h1>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">顧客情報</h2>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">名前:</span> {state.customerInfo.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">住所:</span> {state.customerInfo.address}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">電話番号:</span> {state.customerInfo.phone}
                  </p>
                  {state.customerInfo.email && (
                    <p className="text-gray-700">
                      <span className="font-medium">メール:</span> {state.customerInfo.email}
                    </p>
                  )}
                  {state.customerInfo.disposalDate && (
                    <p className="text-gray-700">
                      <span className="font-medium">廃棄予定日:</span> {state.customerInfo.disposalDate}
                    </p>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">廃棄品リスト</h2>
                <div className="space-y-4">
                  {state.selectedItems.map((item) => (
                    <div key={item.id} className="flex items-start">
                      {item.imageUrl && (
                        <div className="h-16 w-16 mr-3 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={`${item.name}の写真`}
                            width={64}
                            height={64}
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
                <span>¥{state.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {error != null && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
            {/* TODO: 適切に処理する */}
            エラーが発生しました。
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {!quoteGenerated ? (
            <button
              onClick={handleGenerateQuote}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? '生成中...' : '見積書生成'}
            </button>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-4">
                見積書が生成されました。以下のオプションから選択してください。
              </div>

              <button
                onClick={handleNavigateToQuote}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FileText className="mr-2 h-5 w-5" />
                見積書へ遷移
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>

              <button
                onClick={handleNavigateToInstructions}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <FileOutput className="mr-2 h-5 w-5" />
                指示書生成
              </button>
            </>
          )}

          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            編集に戻る
          </button>
        </div>
      </div>
    </main>
  )
}