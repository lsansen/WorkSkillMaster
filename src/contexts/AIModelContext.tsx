import React, { createContext, useState, useContext, useEffect } from 'react'

interface AIModelContextType {
  hasAIModel: boolean
  checkAIModelStatus: () => boolean
  isGenerating: boolean
  setIsGenerating: (status: boolean) => void
}

const AIModelContext = createContext<AIModelContextType | undefined>(undefined)

export const useAI = () => {
  const context = useContext(AIModelContext)
  if (!context) {
    throw new Error('useAI must be used within an AIModelProvider')
  }
  return context
}

interface AIModelProviderProps {
  children: React.ReactNode
}

export const AIModelProvider: React.FC<AIModelProviderProps> = ({ children }) => {
  const [hasAIModel, setHasAIModel] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const checkAIModelStatus = (): boolean => {
    // 检查是否有配置的AI模型
    const openaiKey = localStorage.getItem('openaiApiKey')
    const deepseekKey = localStorage.getItem('deepseekApiKey')
    const ollamaUrl = localStorage.getItem('ollamaUrl')
    const offlineMode = localStorage.getItem('offlineMode') === 'true'

    // 如果是离线模式，检查是否配置了Ollama
    if (offlineMode) {
      return !!ollamaUrl
    }
    // 在线模式，检查是否配置了至少一个API密钥
    return !!openaiKey || !!deepseekKey || !!ollamaUrl
  }

  useEffect(() => {
    // 初始检查AI模型状态
    setHasAIModel(checkAIModelStatus())
  }, [])

  return (
    <AIModelContext.Provider value={{ hasAIModel, checkAIModelStatus, isGenerating, setIsGenerating }}>
      {children}
    </AIModelContext.Provider>
  )
}
