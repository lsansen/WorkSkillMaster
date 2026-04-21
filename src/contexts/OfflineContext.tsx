import React, { createContext, useState, useEffect, useContext } from 'react'

interface OfflineContextType {
  isOffline: boolean
  toggleOfflineMode: () => void
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export const useOffline = () => {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}

interface OfflineProviderProps {
  children: React.ReactNode
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // 检测网络连接状态
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 初始检测
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const toggleOfflineMode = () => {
    setIsOffline(!isOffline)
  }

  return (
    <OfflineContext.Provider value={{ isOffline, toggleOfflineMode }}>
      {children}
    </OfflineContext.Provider>
  )
}
