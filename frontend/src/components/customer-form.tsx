'use client'

import React, { useState } from 'react'
import type { CustomerInfo } from '@/lib/types'

interface CustomerFormProps {
  customerInfo: CustomerInfo
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>
}

export function CustomerForm({ customerInfo, setCustomerInfo }: CustomerFormProps) {
  const [touched, setTouched] = useState({
    name: false,
    address: false,
    phone: false,
    email: false,
    disposalDate: false,
  })

  const handleChange = (field: keyof CustomerInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerInfo({ ...customerInfo, [field]: e.target.value })
  }

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched({ ...touched, [field]: true })
  }

  const isFieldError = (field: keyof CustomerInfo) => {
    return touched[field] && !customerInfo[field] && field !== 'email' && field !== 'disposalDate'
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          顧客名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={customerInfo.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          placeholder="山田太郎"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
            isFieldError('name') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {isFieldError('name') && (
          <p className="mt-1 text-sm text-red-500">顧客名は必須です</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          住所 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          value={customerInfo.address}
          onChange={handleChange('address')}
          onBlur={handleBlur('address')}
          placeholder="東京都渋谷区..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
            isFieldError('address') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {isFieldError('address') && (
          <p className="mt-1 text-sm text-red-500">住所は必須です</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          電話番号 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={customerInfo.phone}
          onChange={handleChange('phone')}
          onBlur={handleBlur('phone')}
          placeholder="03-1234-5678"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
            isFieldError('phone') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {isFieldError('phone') && (
          <p className="mt-1 text-sm text-red-500">電話番号は必須です</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          value={customerInfo.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="example@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="disposalDate" className="block text-sm font-medium text-gray-700 mb-1">
          廃棄予定日
        </label>
        <input
          type="date"
          id="disposalDate"
          value={customerInfo.disposalDate}
          onChange={handleChange('disposalDate')}
          onBlur={handleBlur('disposalDate')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
        />
      </div>
    </div>
  )
}