'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, FileOutput, ExternalLink, ImageIcon } from 'lucide-react'
import { useAppContext } from '@/contexts/AppContext'
import { usePostApiV1EstimatesPdf } from '@/orval/generated/estimates/estimates'
import { ImageUpload } from '@/components/image-upload'
import type { QuoteImage } from '@/lib/types'
import { convertQuoteImagesToPDFImages, validateTotalImageSize } from '@/utils/image-converter'
import type { ModelsPDFImage } from '@/orval/generated/model/modelsPDFImage'

export default function ConfirmationPage() {
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const [quoteGenerated, setQuoteGenerated] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isConvertingImages, setIsConvertingImages] = useState(false)
  const [imageConversionProgress, setImageConversionProgress] = useState({ completed: 0, total: 0 })

  useEffect(() => {
    // quoteGenerated 状態を Context から取得
    setQuoteGenerated(state.quoteGenerated)
  }, [state.quoteGenerated])

  // PDFのBlobからオブジェクトURLを作成
  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [pdfBlob])

  const { mutate: generateEstimatePDF, isPending: isGenerating, error } = usePostApiV1EstimatesPdf()

  const handleGenerateQuote = async () => {
    try {
      // 画像の合計サイズを検証
      if (state.quoteImages.length > 0 && !validateTotalImageSize(state.quoteImages, 50)) {
        alert('画像の合計サイズが50MBを超えています。画像を削除するか、より小さい画像を使用してください。')
        return
      }

      // 画像変換の開始
      setIsConvertingImages(true)
      setImageConversionProgress({ completed: 0, total: state.quoteImages.length })

      // 画像をBase64に変換
      let convertedImages: ModelsPDFImage[] = []
      if (state.quoteImages.length > 0) {
        convertedImages = await convertQuoteImagesToPDFImages(state.quoteImages)
      }

      setIsConvertingImages(false)

      // 見積書データを準備
      const customer = {
        name: state.customerInfo.name || '顧客名未設定',
        address: state.customerInfo.address || '住所未設定',
        phone: state.customerInfo.phone || '電話番号未設定',
        email: state.customerInfo.email || 'メール未設定',
        disposalDate: state.customerInfo.disposalDate || '廃棄予定日未設定',
      }
      const items = state.selectedItems.map(item => ({
        id: item.name,
        quantity: item.quantity,
        customPrice: item.customPrice,
        amount: item.customPrice * item.quantity
      }))

      // APIを呼び出す
      generateEstimatePDF({
        data: {
          customer,
          items,
          images: convertedImages
        }
      }, {
        onSuccess: (data) => {
          setPdfBlob(data as Blob)
          setQuoteGenerated(true)
        },
        onError: (error) => {
          console.error(error)
          alert('PDFの生成に失敗しました。もう一度お試しください。')
        }
      })
    } catch (error) {
      setIsConvertingImages(false)
      console.error('Error generating quote:', error)
      alert('画像の処理中にエラーが発生しました。')
    }
  }

  const handleNavigateToQuote = () => {
    if (pdfUrl) {
      // 新しいタブでPDFを開く
      window.open(pdfUrl, '_blank')
    } else {
      alert("PDFが生成されていません")
    }
  }

  const handleNavigateToInstructions = () => {
    router.push('/instructions')
  }

  const handleImageAdd = (image: QuoteImage) => {
    dispatch({ type: 'ADD_QUOTE_IMAGE', payload: image })
  }

  const handleImageRemove = (id: string) => {
    dispatch({ type: 'REMOVE_QUOTE_IMAGE', payload: id })
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

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  画像アップロード
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  廃棄品の画像をまとめてアップロードできます（最大合計50MB）
                </p>
                {state.quoteImages.length > 0 && (
                  <div className="text-xs text-gray-500 mb-2">
                    ※ 画像はPDFに含まれます
                  </div>
                )}
                <ImageUpload
                  images={state.quoteImages}
                  onImageAdd={handleImageAdd}
                  onImageRemove={handleImageRemove}
                />
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
            <>
              {isConvertingImages && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                    <span>画像を処理中... ({imageConversionProgress.completed}/{imageConversionProgress.total})</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleGenerateQuote}
                disabled={isGenerating || isConvertingImages}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating || isConvertingImages ? '生成中...' : '見積書生成'}
              </button>
            </>
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
                見積書を新しいタブで開く
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>

              {pdfUrl && (
                <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                    見積書プレビュー
                  </div>
                  <iframe
                    src={pdfUrl}
                    className="w-full h-96"
                    title="見積書PDF"
                  />
                </div>
              )}

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