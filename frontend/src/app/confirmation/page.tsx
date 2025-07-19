'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FileText, FileOutput, ExternalLink, Loader2 } from 'lucide-react'
import { useAppContext } from '@/contexts/AppContext'
import { PDFService } from '@/lib/pdf-service'

export default function ConfirmationPage() {
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const [quoteGenerated, setQuoteGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // quoteGenerated 状態を Context から取得
    setQuoteGenerated(state.quoteGenerated)
    if (state.pdfUrl) {
      setPdfUrl(state.pdfUrl)
    }
  }, [state.quoteGenerated, state.pdfUrl])

  const handleGenerateQuote = async () => {
    setIsGenerating(true)
    setError('')
    
    try {
      // Use the PDF service to generate the estimate
      const result = await PDFService.generateEstimatePDF(
        state.customerInfo,
        state.selectedItems,
        state.totalAmount
      )

      if (result.success && result.pdfUrl) {
        setQuoteGenerated(true)
        setPdfUrl(result.pdfUrl)
        dispatch({ type: 'SET_QUOTE_GENERATED', payload: true })
        dispatch({ type: 'SET_PDF_URL', payload: result.pdfUrl })
      } else {
        setError(result.error || 'PDF生成に失敗しました')
      }
    } catch (err) {
      console.error('Quote generation error:', err)
      setError('システムエラーが発生しました')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNavigateToQuote = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
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

        <div className="flex flex-col space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              エラー: {error}
            </div>
          )}

          {!quoteGenerated ? (
            <button
              onClick={handleGenerateQuote}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  PDF生成中...
                </>
              ) : (
                '見積書生成'
              )}
            </button>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-4">
                見積書が生成されました。以下のオプションから選択してください。
              </div>

              <button
                onClick={handleNavigateToQuote}
                disabled={!pdfUrl}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
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