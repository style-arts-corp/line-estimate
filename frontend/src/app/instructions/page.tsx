'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import Image from 'next/image'
import { FileText, Save, ArrowLeft, Check, ClipboardList, ExternalLink } from 'lucide-react'
import { instructionsSchema, type InstructionsForm } from '@/lib/validation'
import { useAppContext } from '@/contexts/AppContext'

export default function InstructionsPage() {
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const [instructionsSaved, setInstructionsSaved] = useState(false)

  const INSTRUCTIONS_URL =
    'https://docs.google.com/spreadsheets/d/1GwyUeSqpHi7qYJTYmyB2SswIkfp388pMyq9bgfKG9Jw/edit?usp=drive_link'
  const QUOTE_URL = 'https://drive.google.com/file/d/1PjaDRt3vvEs4wBPKz0JMaTzcmMLrKPOl/view?usp=drive_link'

  const form = useForm({
    defaultValues: {
      collectionDate: state.collectionDate,
      notes: state.notes,
      workSlip: state.workSlip,
      weighing: state.weighing,
      manifest: state.manifest,
      recycleTicket: state.recycleTicket,
      collectionAmountTaxIncluded: state.collectionAmountTaxIncluded,
      collectionAmountTaxExcluded: state.collectionAmountTaxExcluded,
      tPointAvailable: state.tPointAvailable,
      tPointUsage: state.tPointUsage,
    } as InstructionsForm,
    onSubmit: async ({ value }) => {
      dispatch({ type: 'SET_COLLECTION_DATE', payload: value.collectionDate })
      dispatch({ type: 'SET_NOTES', payload: value.notes || '' })
      dispatch({ type: 'SET_WORK_SLIP', payload: value.workSlip })
      dispatch({ type: 'SET_WEIGHING', payload: value.weighing })
      dispatch({ type: 'SET_MANIFEST', payload: value.manifest })
      dispatch({ type: 'SET_RECYCLE_TICKET', payload: value.recycleTicket })
      dispatch({ type: 'SET_COLLECTION_AMOUNT_TAX_INCLUDED', payload: value.collectionAmountTaxIncluded })
      dispatch({ type: 'SET_COLLECTION_AMOUNT_TAX_EXCLUDED', payload: value.collectionAmountTaxExcluded })
      dispatch({ type: 'SET_T_POINT_AVAILABLE', payload: value.tPointAvailable })
      dispatch({ type: 'SET_T_POINT_USAGE', payload: value.tPointUsage })
      dispatch({ type: 'SET_INSTRUCTIONS_SAVED', payload: true })
      setInstructionsSaved(true)
    },
  })

  useEffect(() => {
    // instructionsSaved 状態を Context から取得
    setInstructionsSaved(state.instructionsSaved)
  }, [state.instructionsSaved])

  const handleSaveInstructions = () => {
    form.handleSubmit()
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

              <div className="space-y-4">
                <form.Field
                  name="collectionDate"
                  validators={{
                    onChange: ({ value }) => {
                      const result = instructionsSchema.shape.collectionDate.safeParse(value)
                      return result.success ? undefined : result.error.issues[0]?.message
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        収集日 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="例: 2023年5月1日 午前10時"
                        disabled={instructionsSaved}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="notes">
                  {(field) => (
                    <div className="space-y-2">
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        備考
                      </label>
                      <textarea
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="特記事項や注意点などを入力してください"
                        rows={4}
                        disabled={instructionsSaved}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">作業詳細</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field name="workSlip">
                      {(field) => (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={field.name}
                            checked={field.state.value}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            onBlur={field.handleBlur}
                            disabled={instructionsSaved}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                          />
                          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                            作業伝票
                          </label>
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="weighing">
                      {(field) => (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={field.name}
                            checked={field.state.value}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            onBlur={field.handleBlur}
                            disabled={instructionsSaved}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                          />
                          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                            計量
                          </label>
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="manifest">
                      {(field) => (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={field.name}
                            checked={field.state.value}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            onBlur={field.handleBlur}
                            disabled={instructionsSaved}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                          />
                          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                            マニフェスト
                          </label>
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="recycleTicket">
                      {(field) => (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={field.name}
                            checked={field.state.value}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            onBlur={field.handleBlur}
                            disabled={instructionsSaved}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                          />
                          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                            リサイクル券
                          </label>
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">集金情報</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <form.Field
                        name="collectionAmountTaxIncluded"
                        validators={{
                          onChange: ({ value }) => {
                            const result = instructionsSchema.shape.collectionAmountTaxIncluded.safeParse(value)
                            return result.success ? undefined : result.error.issues[0]?.message
                          },
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                              集金額（税込）
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">¥</span>
                              <input
                                type="number"
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                onBlur={field.handleBlur}
                                placeholder="0"
                                min="0"
                                disabled={instructionsSaved}
                                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                  field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="collectionAmountTaxExcluded"
                        validators={{
                          onChange: ({ value }) => {
                            const result = instructionsSchema.shape.collectionAmountTaxExcluded.safeParse(value)
                            return result.success ? undefined : result.error.issues[0]?.message
                          },
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                              集金額（税抜）
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">¥</span>
                              <input
                                type="number"
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                onBlur={field.handleBlur}
                                placeholder="0"
                                min="0"
                                disabled={instructionsSaved}
                                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                  field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-2">Tポイント</h3>
                      <div className="space-y-3">
                        <form.Field name="tPointAvailable">
                          {(field) => (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={field.name}
                                checked={field.state.value}
                                onChange={(e) => field.handleChange(e.target.checked)}
                                onBlur={field.handleBlur}
                                disabled={instructionsSaved}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                              />
                              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                Tポイントを使用する
                              </label>
                            </div>
                          )}
                        </form.Field>

                        <form.Field
                          name="tPointUsage"
                          validators={{
                            onChange: ({ value }) => {
                              const result = instructionsSchema.shape.tPointUsage.safeParse(value)
                              return result.success ? undefined : result.error.issues[0]?.message
                            },
                          }}
                        >
                          {(field) => (
                            <div className="space-y-2">
                              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                                使用するポイント数
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  id={field.name}
                                  value={field.state.value}
                                  onChange={(e) => field.handleChange(Number(e.target.value))}
                                  onBlur={field.handleBlur}
                                  placeholder="0"
                                  min="0"
                                  disabled={instructionsSaved}
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                    field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700">ポイント</span>
                                {field.state.meta.errors.length > 0 && (
                                  <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </form.Field>
                      </div>
                    </div>
                  </div>
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
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  onClick={handleSaveInstructions}
                  disabled={!canSubmit}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSubmitting ? '保存中...' : '指示書を保存'}
                </button>
              )}
            </form.Subscribe>
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