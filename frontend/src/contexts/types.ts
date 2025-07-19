import type { SelectedItem, CustomerInfo } from '@/lib/types'

export interface AppState {
  selectedItems: SelectedItem[]
  customerInfo: CustomerInfo
  totalAmount: number
  collectionDate: string
  notes: string
  quoteGenerated: boolean
  pdfUrl: string
  instructionsSaved: boolean
  workSlip: boolean
  weighing: boolean
  manifest: boolean
  recycleTicket: boolean
  collectionAmountTaxIncluded: number
  collectionAmountTaxExcluded: number
  tPointAvailable: boolean
  tPointUsage: number
}

export type AppAction =
  | { type: 'SET_SELECTED_ITEMS'; payload: SelectedItem[] }
  | { type: 'ADD_SELECTED_ITEM'; payload: SelectedItem }
  | { type: 'UPDATE_SELECTED_ITEM'; payload: { id: string; updates: Partial<SelectedItem> } }
  | { type: 'REMOVE_SELECTED_ITEM'; payload: string }
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo }
  | { type: 'UPDATE_CUSTOMER_INFO'; payload: Partial<CustomerInfo> }
  | { type: 'SET_TOTAL_AMOUNT'; payload: number }
  | { type: 'SET_COLLECTION_DATE'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_QUOTE_GENERATED'; payload: boolean }
  | { type: 'SET_PDF_URL'; payload: string }
  | { type: 'SET_INSTRUCTIONS_SAVED'; payload: boolean }
  | { type: 'SET_WORK_SLIP'; payload: boolean }
  | { type: 'SET_WEIGHING'; payload: boolean }
  | { type: 'SET_MANIFEST'; payload: boolean }
  | { type: 'SET_RECYCLE_TICKET'; payload: boolean }
  | { type: 'SET_COLLECTION_AMOUNT_TAX_INCLUDED'; payload: number }
  | { type: 'SET_COLLECTION_AMOUNT_TAX_EXCLUDED'; payload: number }
  | { type: 'SET_T_POINT_AVAILABLE'; payload: boolean }
  | { type: 'SET_T_POINT_USAGE'; payload: number }
  | { type: 'RESET_STATE' }

export interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}