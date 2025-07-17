'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { customerInfoSchema, type CustomerInfoForm } from '@/lib/validation'
import type { CustomerInfo } from '@/lib/types'

interface CustomerFormProps {
  customerInfo: CustomerInfo
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>
}

export function CustomerForm({ customerInfo, setCustomerInfo }: CustomerFormProps) {
  const form = useForm({
    defaultValues: {
      name: customerInfo.name,
      address: customerInfo.address,
      phone: customerInfo.phone,
      email: customerInfo.email,
      disposalDate: customerInfo.disposalDate,
    } as CustomerInfoForm,
    onSubmit: async ({ value }) => {
      setCustomerInfo({
        name: value.name,
        address: value.address,
        phone: value.phone,
        email: value.email || '',
        disposalDate: value.disposalDate || '',
      })
    },
  })

  useEffect(() => {
    form.setFieldValue('name', customerInfo.name)
    form.setFieldValue('address', customerInfo.address)
    form.setFieldValue('phone', customerInfo.phone)
    form.setFieldValue('email', customerInfo.email)
    form.setFieldValue('disposalDate', customerInfo.disposalDate)
  }, [customerInfo, form])

  const handleFieldChange = (field: keyof CustomerInfoForm, value: string) => {
    form.setFieldValue(field, value)
    setCustomerInfo({ ...customerInfo, [field]: value })
  }

  return (
    <div className="mt-4 space-y-4">
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const result = customerInfoSchema.shape.name.safeParse(value)
            return result.success ? undefined : result.error.issues[0]?.message
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              顧客名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id={field.name}
              value={field.state.value}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={field.handleBlur}
              placeholder="山田太郎"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="address"
        validators={{
          onChange: ({ value }) => {
            const result = customerInfoSchema.shape.address.safeParse(value)
            return result.success ? undefined : result.error.issues[0]?.message
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              住所 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id={field.name}
              value={field.state.value}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              onBlur={field.handleBlur}
              placeholder="東京都渋谷区..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="phone"
        validators={{
          onChange: ({ value }) => {
            const result = customerInfoSchema.shape.phone.safeParse(value)
            return result.success ? undefined : result.error.issues[0]?.message
          },
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id={field.name}
              value={field.state.value}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={field.handleBlur}
              placeholder="03-1234-5678"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 ${
                field.state.meta.errors.length > 0 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id={field.name}
              value={field.state.value}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={field.handleBlur}
              placeholder="example@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="disposalDate">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              廃棄予定日
            </label>
            <input
              type="date"
              id={field.name}
              value={field.state.value}
              onChange={(e) => handleFieldChange('disposalDate', e.target.value)}
              onBlur={field.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
            />
          </div>
        )}
      </form.Field>
    </div>
  )
}