import { z } from 'zod'

export const customerInfoSchema = z.object({
  name: z.string().min(1, '顧客名は必須です'),
  address: z.string().min(1, '住所は必須です'),
  phone: z.string().min(1, '電話番号は必須です'),
  email: z.string().optional(),
  disposalDate: z.string().optional(),
})

export const instructionsSchema = z.object({
  collectionDate: z.string().min(1, '収集日は必須です'),
  notes: z.string().optional(),
  workSlip: z.boolean(),
  weighing: z.boolean(),
  manifest: z.boolean(),
  recycleTicket: z.boolean(),
  collectionAmountTaxIncluded: z.number().min(0, '集金額（税込）は0以上である必要があります'),
  collectionAmountTaxExcluded: z.number().min(0, '集金額（税抜）は0以上である必要があります'),
  vPointAvailable: z.boolean(),
  vPointUsage: z.number().min(0, 'Vポイント使用数は0以上である必要があります'),
})

export const customItemSchema = z.object({
  name: z.string().min(1, 'アイテム名は必須です'),
  price: z.number().min(0, '価格は0以上である必要があります'),
})

export type CustomerInfoForm = z.infer<typeof customerInfoSchema>
export type InstructionsForm = z.infer<typeof instructionsSchema>
export type CustomItemForm = z.infer<typeof customItemSchema>