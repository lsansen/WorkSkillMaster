import React, { useState, useEffect } from 'react'

interface UsageRecord {
  id: string
  model_id: string
  model_name: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  cost: number
  duration: number
  timestamp: string
}

interface MonthlyStats {
  total_cost: number
  total_tokens: number
  usage_count: number
}

const Stats: React.FC = () => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null)
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([])
  const [filterModel, setFilterModel] = useState<string>('')
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('month')
  
  useEffect(() => {
    fetchStats()
    fetchUsageRecords()
  }, [filterModel])
  
  const fetchStats = async () => {
    try {
      let url = 'http://localhost:8000/api/v1/stats/monthly'
      if (filterModel) {
        url += `?model_id=${filterModel}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      setMonthlyStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setMonthlyStats({
        total_cost: 0,
        total_tokens: 0,
        usage_count: 0
      })
    }
  }
  
  const fetchUsageRecords = async () => {
    try {
      let url = 'http://localhost:8000/api/v1/usage'
      if (filterModel) {
        url += `?model_id=${filterModel}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      setUsageRecords(data.data || [])
    } catch (error) {
      console.error('Failed to fetch usage records:', error)
      setUsageRecords([
        {
          id: '1',
          model_id: 'ollama-llama3',
          model_name: 'Ollama Llama 3',
          prompt_tokens: 512,
          completion_tokens: 1024,
          total_tokens: 1536,
          cost: 0,
          duration: 2.5,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          model_id: 'openai-gpt4',
          model_name: 'OpenAI GPT-4',
          prompt_tokens: 256,
          completion_tokens: 512,
          total_tokens: 768,
          cost: 0.015,
          duration: 1.8,
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ])
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN')
  }
  
  const getCostColor = (cost: number) => {
    if (cost > 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }
  
  const getProviderColor = (modelId: string) => {
    if (modelId.includes('ollama')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
    if (modelId.includes('openai')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          成本统计
        </h2>
        <select
          value={filterModel}
          onChange={(e) => setFilterModel(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="">全部模型</option>
          <option value="ollama-llama3">Ollama Llama 3</option>
          <option value="openai-gpt4">OpenAI GPT-4</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                本月总花费
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${monthlyStats?.total_cost.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                总Token数
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {(monthlyStats?.total_tokens || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                使用次数
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {monthlyStats?.usage_count || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          使用记录
        </h3>
        
        {usageRecords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              暂无使用记录
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    模型
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Token使用
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    花费
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    耗时
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    时间
                  </th>
                </tr>
              </thead>
              <tbody>
                {usageRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(record.model_id)}`}>
                          {record.model_id.includes('ollama') ? '本地' : '云端'}
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {record.model_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                      <div>
                        <span className="text-green-600 dark:text-green-400">
                          {record.prompt_tokens.toLocaleString()}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          {record.completion_tokens.toLocaleString()}
                        </span>
                        <span className="text-gray-400 mx-1">=</span>
                        <span className="font-medium">
                          {record.total_tokens.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className={getCostColor(record.cost)}>
                        {record.cost > 0 ? `$${record.cost.toFixed(4)}` : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {record.duration.toFixed(2)}s
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(record.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            按模型统计
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-900 dark:text-white">Ollama Llama 3</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">$0.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-900 dark:text-white">OpenAI GPT-4</span>
              </div>
              <span className="text-red-600 dark:text-red-400">$0.015</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            预算监控
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">OpenAI GPT-4</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">$0.015 / $10.00</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all"
                  style={{ width: '0.15%' }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
              本月还剩 $9.98 (99.85%) 预算
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
