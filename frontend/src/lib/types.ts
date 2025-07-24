export interface Item {
  id: string
  name: string
  price: number
  category: string
}

export interface SelectedItem extends Item {
  quantity: number
  customPrice: number
}

export interface Category {
  id: string
  name: string
  items: Item[]
}

export interface CustomerInfo {
  name: string
  address: string
  phone: string
  email: string
  disposalDate: string
}

export interface InstructionsInfo {
  collectionDate: string
  notes: string
  workSlip: boolean // 作業伝票
  weighing: boolean // 計量
  manifest: boolean // マニフェスト
  recycleTicket: boolean // リサイクル券
  collectionAmountTaxIncluded: number // 集金額（税込）
  collectionAmountTaxExcluded: number // 集金額（税抜）
  tPointAvailable: boolean // Tポイント
  tPointUsage: number // 使用するポイント数
}

export interface ConsignmentApplication {
  id: string
  customerInfo: CustomerInfo
  items: ConsignmentItem[]
  totalAmount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface ConsignmentItem {
  id: string
  name: string
  quantity: number
  price: number
  totalPrice: number
  imageUrl?: string
}

export interface ConsignmentSearchResult {
  application: ConsignmentApplication
  matchedItems: string[]
}

export interface LoanApplication {
  id: string
  customerInfo: CustomerInfo
  items: LoanItem[]
  loanAmount: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface LoanItem {
  id: string
  name: string
  appraisalValue: number
  imageUrl?: string
}

export interface LoanSearchResult {
  application: LoanApplication
  matchedItems: string[]
}

export interface QuoteImage {
  id: string
  file: File
  preview: string
  name: string
}