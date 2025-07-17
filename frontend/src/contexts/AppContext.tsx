'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { appReducer, initialState } from './AppReducer'
import type { AppContextType } from './types'

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // LocalStorage からの初期データ読み込み（段階的移行のため）
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const storedItems = localStorage.getItem('selectedItems')
        const storedCustomerInfo = localStorage.getItem('customerInfo')
        const storedTotal = localStorage.getItem('totalAmount')
        const storedCollectionDate = localStorage.getItem('collectionDate')
        const storedNotes = localStorage.getItem('notes')

        if (storedItems) {
          dispatch({ type: 'SET_SELECTED_ITEMS', payload: JSON.parse(storedItems) })
        }
        if (storedCustomerInfo) {
          dispatch({ type: 'SET_CUSTOMER_INFO', payload: JSON.parse(storedCustomerInfo) })
        }
        if (storedTotal) {
          dispatch({ type: 'SET_TOTAL_AMOUNT', payload: Number(storedTotal) })
        }
        if (storedCollectionDate) {
          dispatch({ type: 'SET_COLLECTION_DATE', payload: storedCollectionDate })
        }
        if (storedNotes) {
          dispatch({ type: 'SET_NOTES', payload: storedNotes })
        }
      } catch (error) {
        console.error('LocalStorage からのデータ読み込みに失敗しました:', error)
      }
    }

    loadFromLocalStorage()
  }, [])

  // 状態が変更されたときに LocalStorage に保存（段階的移行のため）
  useEffect(() => {
    if (state.selectedItems.length > 0) {
      localStorage.setItem('selectedItems', JSON.stringify(state.selectedItems))
    }
  }, [state.selectedItems])

  useEffect(() => {
    if (state.customerInfo.name || state.customerInfo.address || state.customerInfo.phone) {
      localStorage.setItem('customerInfo', JSON.stringify(state.customerInfo))
    }
  }, [state.customerInfo])

  useEffect(() => {
    if (state.totalAmount > 0) {
      localStorage.setItem('totalAmount', state.totalAmount.toString())
    }
  }, [state.totalAmount])

  useEffect(() => {
    if (state.collectionDate) {
      localStorage.setItem('collectionDate', state.collectionDate)
    }
  }, [state.collectionDate])

  useEffect(() => {
    if (state.notes) {
      localStorage.setItem('notes', state.notes)
    }
  }, [state.notes])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}