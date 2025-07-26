import type { AppState, AppAction } from './types'

export const initialState: AppState = {
  selectedItems: [],
  customerInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
    disposalDate: '',
  },
  totalAmount: 0,
  collectionDate: '',
  notes: '',
  quoteGenerated: false,
  instructionsSaved: false,
  workSlip: false,
  weighing: false,
  manifest: false,
  recycleTicket: false,
  collectionAmountTaxIncluded: 0,
  collectionAmountTaxExcluded: 0,
  vPointAvailable: false,
  vPointUsage: 0,
  quoteImages: [],
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SELECTED_ITEMS':
      return {
        ...state,
        selectedItems: action.payload,
      }
    
    case 'ADD_SELECTED_ITEM':
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.payload],
      }
    
    case 'UPDATE_SELECTED_ITEM':
      return {
        ...state,
        selectedItems: state.selectedItems.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      }
    
    case 'REMOVE_SELECTED_ITEM':
      return {
        ...state,
        selectedItems: state.selectedItems.filter(item => item.id !== action.payload),
      }
    
    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: action.payload,
      }
    
    case 'UPDATE_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: {
          ...state.customerInfo,
          ...action.payload,
        },
      }
    
    case 'SET_TOTAL_AMOUNT':
      return {
        ...state,
        totalAmount: action.payload,
      }
    
    case 'SET_COLLECTION_DATE':
      return {
        ...state,
        collectionDate: action.payload,
      }
    
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
      }
    
    case 'SET_QUOTE_GENERATED':
      return {
        ...state,
        quoteGenerated: action.payload,
      }
    
    case 'SET_INSTRUCTIONS_SAVED':
      return {
        ...state,
        instructionsSaved: action.payload,
      }
    
    case 'SET_WORK_SLIP':
      return {
        ...state,
        workSlip: action.payload,
      }
    
    case 'SET_WEIGHING':
      return {
        ...state,
        weighing: action.payload,
      }
    
    case 'SET_MANIFEST':
      return {
        ...state,
        manifest: action.payload,
      }
    
    case 'SET_RECYCLE_TICKET':
      return {
        ...state,
        recycleTicket: action.payload,
      }
    
    case 'SET_COLLECTION_AMOUNT_TAX_INCLUDED':
      return {
        ...state,
        collectionAmountTaxIncluded: action.payload,
      }
    
    case 'SET_COLLECTION_AMOUNT_TAX_EXCLUDED':
      return {
        ...state,
        collectionAmountTaxExcluded: action.payload,
      }
    
    case 'SET_V_POINT_AVAILABLE':
      return {
        ...state,
        vPointAvailable: action.payload,
      }
    
    case 'SET_V_POINT_USAGE':
      return {
        ...state,
        vPointUsage: action.payload,
      }
    
    case 'ADD_QUOTE_IMAGE':
      return {
        ...state,
        quoteImages: [...state.quoteImages, action.payload],
      }
    
    case 'REMOVE_QUOTE_IMAGE':
      return {
        ...state,
        quoteImages: state.quoteImages.filter(image => image.id !== action.payload),
      }
    
    case 'SET_QUOTE_IMAGES':
      return {
        ...state,
        quoteImages: action.payload,
      }
    
    case 'RESET_STATE':
      return initialState
    
    default:
      return state
  }
}