export interface Item {
  id: string
  name: string
  price: number
  category: string
}

export interface SelectedItem extends Item {
  quantity: number
  customPrice: number
  imageUrl?: string // 写真のURLまたはBase64文字列
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
  applicationNumber: string
  companyName: string
  applicantName: string
  applicationDate: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  items: ConsignmentItem[]
  totalAmount: number
  notes?: string
}

export interface ConsignmentItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  amount: number
  description?: string
}

export interface ConsignmentSearchResult {
  applications: ConsignmentApplication[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface LoanApplication {
  id: string
  applicationNumber: string
  companyName: string
  applicantName: string
  applicationDate: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'returned'
  items: LoanItem[]
  totalAmount: number
  notes?: string
  loanPeriod: {
    startDate: string
    endDate: string
  }
  returnDate?: string
}

export interface LoanItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  amount: number
  description?: string
  serialNumber?: string
  condition?: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface LoanSearchResult {
  applications: LoanApplication[]
  totalCount: number
  currentPage: number
  totalPages: number
}
