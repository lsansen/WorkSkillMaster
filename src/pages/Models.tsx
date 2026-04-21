import React, { useState, useEffect } from 'react'

interface Model {
  id: string
  name: string
  provider: string
  type: string
  enabled: boolean
  healthy: boolean
  monthly_budget: number
  current_usage: number
  budget_usage: number
}

const Models: React.FC = () => {
  const [models, setModels] = useState<Model[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingModel, setEditingModel] = useState<Model | null>(null)
  
  useEffect(() => {
    fetchModels()
  }, [])
  
  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/models')
      const data = await response.json()
      setModels(data.data || [])
    } catch (error) {
      console.error('Failed to fetch models:', error)
      setModels([
        {
          id: 'ollama-llama3',
          name: 'Ollama Llama 3',
          provider: 'ollama',
          type: 'text',
          enabled: true,
          healthy: true,
          monthly_budget: 0,
          current_usage: 0,
          budget_usage: 0
        },
        {
          id: 'openai-gpt4',
          name: 'OpenAI GPT-4',
          provider: 'openai',
          type: 'text',
          enabled: false,
          healthy: false,
          monthly_budget: 10,
          current_usage: 2.5,
          budget_usage: 25
        }
      ])
    }
  }
  
  const handleAddModel = () => {
    setEditingModel(null)
    setShowAddModal(true)
  }
  
  const handleEditModel = (model: Model) => {
    setEditingModel(model)
    setShowAddModal(true)
  }
  
  const handleDeleteModel = async (modelId: string) => {
    if (!confirm('确定要删除这个模型吗？')) return
    
    try {
      await fetch(`http://localhost:8000/api/v1/models/${modelId}`, {
        method: 'DELETE'
      })
      fetchModels()
    } catch (error) {
      console.error('Failed to delete model:', error)
    }
  }
  
  const handleSaveModel = async (formData: any) => {
    try {
      const method = editingModel ? 'PUT' : 'POST'
      const url = editingModel 
        ? `http://localhost:8000/api/v1/models/${editingModel.id}`
        : 'http://localhost:8000/api/v1/models'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      setShowAddModal(false)
      fetchModels()
    } catch (error) {
      console.error('Failed to save model:', error)
    }
  }
  
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'ollama':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'openai':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }
  
  const getBudgetProgressColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500'
    if (usage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          模型管理
        </h2>
        <button
          onClick={handleAddModel}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          添加模型
        </button>
      </div>
      
      <div className="grid gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {model.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(model.provider)}`}>
                    {model.provider}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model.enabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {model.enabled ? '启用' : '禁用'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model.healthy 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {model.healthy ? '健康' : '离线'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  ID: {model.id}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditModel(model)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDeleteModel(model.id)}
                  className="px-3 py-1 text-sm border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
            
            {model.monthly_budget > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    月度预算使用
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${model.current_usage.toFixed(2)} / ${model.monthly_budget.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getBudgetProgressColor(model.budget_usage)}`}
                    style={{ width: `${Math.min(model.budget_usage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showAddModal && (
        <ModelModal
          model={editingModel}
          onSave={handleSaveModel}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

interface ModelModalProps {
  model: Model | null
  onSave: (data: any) => void
  onClose: () => void
}

const ModelModal: React.FC<ModelModalProps> = ({ model, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: model?.id || '',
    name: model?.name || '',
    provider: model?.provider || 'ollama',
    type: model?.type || 'text',
    enabled: model?.enabled ?? true,
    api_key: '',
    api_base: '',
    max_tokens: 2048,
    temperature: 0.7,
    top_p: 0.9,
    cost_per_token_input: 0,
    cost_per_token_output: 0,
    monthly_budget: 0,
    alert_threshold: 0.8
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {model ? '编辑模型' : '添加模型'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!model && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  模型ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="例如: ollama-llama3"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                模型名称
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="例如: Llama 3"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  提供商
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="ollama">Ollama (本地)</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="custom">自定义</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  模型类型
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="text">文本</option>
                  <option value="image">图像</option>
                  <option value="audio">音频</option>
                  <option value="multimodal">多模态</option>
                </select>
              </div>
            </div>
            
            {formData.provider !== 'ollama' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API密钥
                  </label>
                  <input
                    type="password"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="sk-..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API基础URL (可选)
                  </label>
                  <input
                    type="text"
                    value={formData.api_base}
                    onChange={(e) => setFormData({ ...formData, api_base: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
              </>
            )}
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  最大Token数
                </label>
                <input
                  type="number"
                  value={formData.max_tokens}
                  onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  温度 (Temperature)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Top P
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top_p}
                  onChange={(e) => setFormData({ ...formData, top_p: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {formData.provider !== 'ollama' && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    成本配置
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        输入Token成本 ($/1k)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.cost_per_token_input}
                        onChange={(e) => setFormData({ ...formData, cost_per_token_input: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        输出Token成本 ($/1k)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.cost_per_token_output}
                        onChange={(e) => setFormData({ ...formData, cost_per_token_output: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    预算配置
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        月度预算 ($)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.monthly_budget}
                        onChange={(e) => setFormData({ ...formData, monthly_budget: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        预警阈值 (%)
                      </label>
                      <input
                        type="number"
                        step="5"
                        max="100"
                        value={formData.alert_threshold * 100}
                        onChange={(e) => setFormData({ ...formData, alert_threshold: parseInt(e.target.value) / 100 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
              />
              <label htmlFor="enabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                启用模型
              </label>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Models
