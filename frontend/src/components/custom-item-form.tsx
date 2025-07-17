'use client'

import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { customItemSchema, type CustomItemForm } from '@/lib/validation'
import type { Item } from '@/lib/types'

interface CustomItemFormProps {
  onAddCustomItem: (item: Item) => void
}

export function CustomItemForm({ onAddCustomItem }: CustomItemFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      price: 0,
    } as CustomItemForm,
    onSubmit: async ({ value }) => {
      const newItem: Item = {
        id: `custom-${Date.now()}`,
        name: value.name,
        price: value.price,
        category: 'カスタム',
      }

      onAddCustomItem(newItem)
      form.reset()
      setIsOpen(false)
    },
  })

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          カスタムアイテムを追加
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = customItemSchema.shape.name.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
          >
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  アイテム名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="カスタムアイテム名"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
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
            name="price"
            validators={{
              onChange: ({ value }) => {
                const result = customItemSchema.shape.price.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
          >
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  価格 <span className="text-red-500">*</span>
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
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
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

          <div className="flex gap-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '追加中...' : '追加'}
                </button>
              )}
            </form.Subscribe>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                form.reset()
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  )
}