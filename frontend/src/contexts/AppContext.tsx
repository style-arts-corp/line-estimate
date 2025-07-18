'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { appReducer, initialState } from './AppReducer'
import type { AppContextType } from './types'

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // 必要最小限のデータのみ永続化（重要な顧客情報のみ）
  useEffect(() => {
    if (state.customerInfo.name && state.customerInfo.address && state.customerInfo.phone) {
      try {
        localStorage.setItem('customerInfo', JSON.stringify(state.customerInfo))
      } catch (error) {
        console.error('顧客情報の保存に失敗しました:', error)
      }
    }
  }, [state.customerInfo])

  // アプリ起動時に保存された顧客情報のみ復元
  useEffect(() => {
    try {
      const storedCustomerInfo = localStorage.getItem('customerInfo')
      if (storedCustomerInfo) {
        dispatch({ type: 'SET_CUSTOMER_INFO', payload: JSON.parse(storedCustomerInfo) })
      }
    } catch (error) {
      console.error('顧客情報の読み込みに失敗しました:', error)
    }
  }, [])

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