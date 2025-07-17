export interface Item {
  id: string
  name: string
  price: number
  category: string
}

export interface SelectedItem extends Item {
  quantity: number
  customPrice: number
  imageUrl?: string
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