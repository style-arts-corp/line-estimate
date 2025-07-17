import type { SelectedItem, CustomerInfo } from '@/lib/types'

export interface AppState {
  selectedItems: SelectedItem[]
  customerInfo: CustomerInfo
  totalAmount: number
  collectionDate: string
  notes: string
  quoteGenerated: boolean
  instructionsSaved: boolean
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
  | { type: 'SET_INSTRUCTIONS_SAVED'; payload: boolean }
  | { type: 'RESET_STATE' }

export interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}