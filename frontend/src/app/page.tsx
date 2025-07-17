'use client'

import { useState, useEffect } from 'react'
import { CustomerForm } from '@/components/customer-form'
import { CategoryAccordion } from '@/components/category-accordion'
import { SelectedItemsList } from '@/components/selected-items-list'
import { QuoteSummary } from '@/components/quote-summary'
import { CustomItemForm } from '@/components/custom-item-form'
import { useRouter } from 'next/navigation'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import { customerInfoSchema } from '@/lib/validation'
import { useAppContext } from '@/contexts/AppContext'
import type { Item, CustomerInfo } from '@/lib/types'

export default function Home() {
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    disposalDate: '',
  })
  const [showCustomerForm, setShowCustomerForm] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null)

  useEffect(() => {
    setCustomerInfo(state.customerInfo)
  }, [state.customerInfo])

  const showToast = (message: string) => {
    setToast({ show: true, message })
    setTimeout(() => setToast(null), 5000)
  }

  const addItem = (item: Item) => {
    const existingItem = state.selectedItems.find((i) => i.id === item.id)

    if (existingItem) {
      dispatch({
        type: 'UPDATE_SELECTED_ITEM',
        payload: { id: item.id, updates: { quantity: existingItem.quantity + 1 } }
      })
    } else {
      dispatch({
        type: 'ADD_SELECTED_ITEM',
        payload: { ...item, quantity: 1, customPrice: item.price }
      })
    }
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_SELECTED_ITEM', payload: id })
    } else {
      dispatch({
        type: 'UPDATE_SELECTED_ITEM',
        payload: { id, updates: { quantity } }
      })
    }
  }

  const updateItemPrice = (id: string, customPrice: number) => {
    dispatch({
      type: 'UPDATE_SELECTED_ITEM',
      payload: { id, updates: { customPrice } }
    })
  }

  const updateItemName = (id: string, name: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_ITEM',
      payload: { id, updates: { name } }
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_SELECTED_ITEM', payload: id })
  }

  const addItemImage = (id: string, imageUrl: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_ITEM',
      payload: { id, updates: { imageUrl } }
    })
  }

  const removeItemImage = (id: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_ITEM',
      payload: { id, updates: { imageUrl: undefined } }
    })
  }

  const calculateTotal = () => {
    return state.selectedItems.reduce((total, item) => total + item.customPrice * item.quantity, 0)
  }

  const handleGenerateQuote = () => {
    setFormSubmitted(true)

    const missingFields = []

    if (state.selectedItems.length === 0) {
      missingFields.push('廃棄品')
    }

    // Zodスキーマを使用してバリデーション
    const validationResult = customerInfoSchema.safeParse(customerInfo)
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues
      errors.forEach((error) => {
        if (error.path[0] === 'name') missingFields.push('顧客名')
        if (error.path[0] === 'address') missingFields.push('住所')
        if (error.path[0] === 'phone') missingFields.push('電話番号')
      })
    }

    if (missingFields.length > 0) {
      showToast(`${missingFields.join('、')}を入力してください。`)

      if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
        setShowCustomerForm(true)
      }

      return
    }

    dispatch({ type: 'SET_CUSTOMER_INFO', payload: customerInfo })
    dispatch({ type: 'SET_TOTAL_AMOUNT', payload: calculateTotal() })
    router.push('/confirmation')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">廃棄品見積もりアプリ</h1>
          <div className="text-lg font-semibold text-gray-900">合計(税込): ¥{calculateTotal().toLocaleString()}</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="bg-white rounded-lg shadow p-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowCustomerForm(!showCustomerForm)}
          >
            <h2 className="text-lg font-semibold text-gray-900">顧客情報</h2>
            <span>{showCustomerForm ? '▲' : '▼'}</span>
          </div>

          {showCustomerForm && <CustomerForm customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">廃棄品選択</h2>
          <CategoryAccordion categories={MOCK_CATEGORIES} onItemSelect={addItem} />
          <CustomItemForm onAddCustomItem={addItem} />
        </div>

        {state.selectedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">選択済みアイテム</h2>
            <SelectedItemsList
              items={state.selectedItems}
              onQuantityChange={updateItemQuantity}
              onPriceChange={updateItemPrice}
              onNameChange={updateItemName}
              onRemove={removeItem}
              onImageAdd={addItemImage}
              onImageRemove={removeItemImage}
            />
          </div>
        )}

        {formSubmitted && state.selectedItems.length === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            廃棄品を1つ以上選択してください
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <QuoteSummary total={calculateTotal()} itemCount={state.selectedItems.length} />
          <button
            onClick={handleGenerateQuote}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            見積書生成
          </button>
        </div>
      </div>

      {toast?.show && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2">
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  )
}