"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CustomerInfo } from "@/lib/types"

interface CustomerFormProps {
  customerInfo: CustomerInfo
  setCustomerInfo: (info: CustomerInfo) => void
}

export function CustomerForm({ customerInfo, setCustomerInfo }: CustomerFormProps) {
  // フィールドがタッチされたかどうかを追跡
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    name: false,
    address: false,
    phone: false,
    email: false,
    disposalDate: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    })
  }

  // フィールドがフォーカスを失った時にタッチされたとマーク
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    })
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className="flex items-center">
          顧客名 <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={customerInfo.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="山田 太郎"
          required
          className={touchedFields.name && !customerInfo.name ? "border-red-300 focus:ring-red-500" : ""}
        />
        {touchedFields.name && !customerInfo.name && <p className="text-sm text-red-500">顧客名は必須です</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address" className="flex items-center">
          住所 <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="address"
          name="address"
          value={customerInfo.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="東京都新宿区西新宿2-8-1"
          required
          className={touchedFields.address && !customerInfo.address ? "border-red-300 focus:ring-red-500" : ""}
        />
        {touchedFields.address && !customerInfo.address && <p className="text-sm text-red-500">住所は必須です</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone" className="flex items-center">
          電話番号 <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          value={customerInfo.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="03-1234-5678"
          required
          className={touchedFields.phone && !customerInfo.phone ? "border-red-300 focus:ring-red-500" : ""}
        />
        {touchedFields.phone && !customerInfo.phone && <p className="text-sm text-red-500">電話番号は必須です</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">
          メールアドレス <span className="text-gray-500">(任意)</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={customerInfo.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="example@example.com"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="disposalDate">
          廃棄予定日 <span className="text-gray-500">(任意)</span>
        </Label>
        <Input
          id="disposalDate"
          name="disposalDate"
          type="date"
          value={customerInfo.disposalDate}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  )
}
