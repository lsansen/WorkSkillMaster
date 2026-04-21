import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme()
  
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'zh-CN',
    defaultModel: localStorage.getItem('defaultModel') || 'ollama-llama3',
    backendUrl: localStorage.getItem('backendUrl') || 'http://localhost:8000',
    fileSizeLimit: localStorage.getItem('fileSizeLimit') || '10',
    temperature: localStorage.getItem('temperature') || '0.7',
    maxTokens: localStorage.getItem('maxTokens') || '1000',
    offlineMode: localStorage.getItem('offlineMode') === 'true',
    privacyMode: localStorage.getItem('privacyMode') === 'true'
  })
  
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('openaiApiKey') || '',
    deepseek: localStorage.getItem('deepseekApiKey') || '',
    ollamaUrl: localStorage.getItem('ollamaUrl') || 'http://localhost:11434'
  })

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiKeys(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveSettings = () => {
    // 保存通用设置
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, String(value))
    })
    
    // 保存API密钥
    Object.entries(apiKeys).forEach(([key, value]) => {
      localStorage.setItem(`${key}ApiKey`, value)
    })
    
    // 更新主题
    if (settings.theme !== theme && settings.theme !== 'system') {
      setTheme(settings.theme as 'light' | 'dark')
    } else if (settings.theme === 'system') {
      // 检测系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
    
    alert('设置保存成功！')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        设置
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          通用设置
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              主题
            </label>
            <select 
              name="theme"
              value={settings.theme}
              onChange={handleSettingChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="system">跟随系统</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              语言
            </label>
            <select 
              name="language"
              value={settings.language}
              onChange={handleSettingChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              默认模型
            </label>
            <select 
              name="defaultModel"
              value={settings.defaultModel}
              onChange={handleSettingChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="ollama-llama3">本地模型 (Llama 3)</option>
              <option value="openai-gpt4">OpenAI GPT-4</option>
              <option value="openai-gpt3.5">OpenAI GPT-3.5</option>
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              离线模式
            </label>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="offlineMode"
                checked={settings.offlineMode}
                onChange={handleSettingChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                仅使用本地模型，不连接云端API
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              隐私模式
            </label>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="privacyMode"
                checked={settings.privacyMode}
                onChange={handleSettingChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                不在本地存储历史记录
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          后端服务配置
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              后端服务地址
            </label>
            <input 
              type="text" 
              name="backendUrl"
              value={settings.backendUrl}
              onChange={handleSettingChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="http://localhost:8000"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          模型配置
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              温度 (0-1)
            </label>
            <input 
              type="number" 
              name="temperature"
              value={settings.temperature}
              onChange={handleSettingChange}
              min="0"
              max="1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              最大 tokens
            </label>
            <input 
              type="number" 
              name="maxTokens"
              value={settings.maxTokens}
              onChange={handleSettingChange}
              min="100"
              max="4096"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          文件上传设置
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              文件大小限制 (MB)
            </label>
            <input 
              type="number" 
              name="fileSizeLimit"
              value={settings.fileSizeLimit}
              onChange={handleSettingChange}
              min="1"
              max="50"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          API密钥
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OpenAI API密钥
            </label>
            <input 
              type="password" 
              name="openai"
              value={apiKeys.openai}
              onChange={handleApiKeyChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="sk-..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              DeepSeek API密钥
            </label>
            <input 
              type="password" 
              name="deepseek"
              value={apiKeys.deepseek}
              onChange={handleApiKeyChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="sk-..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ollama API地址
            </label>
            <input 
              type="text" 
              name="ollamaUrl"
              value={apiKeys.ollamaUrl}
              onChange={handleApiKeyChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="http://localhost:11434"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          数据备份与恢复
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            备份你的技能包配置和设置，以便在需要时恢复。
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => {
                const backupData = {
                  settings: settings,
                  apiKeys: {
                    openai: apiKeys.openai ? '***' : '',
                    deepseek: apiKeys.deepseek ? '***' : '',
                    ollamaUrl: apiKeys.ollamaUrl
                  },
                  version: '1.0.0'
                };
                const dataStr = JSON.stringify(backupData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `workskillmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex-1"
            >
              备份数据
            </button>
            
            <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex-1 text-center cursor-pointer">
              恢复数据
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const data = JSON.parse(event.target?.result as string);
                        if (data.settings) {
                          setSettings(data.settings);
                          // 保存到本地存储
                          Object.entries(data.settings).forEach(([key, value]) => {
                            localStorage.setItem(key, String(value));
                          });
                          // 更新主题
                          if (data.settings.theme !== theme) {
                            setTheme(data.settings.theme);
                          }
                        }
                        if (data.apiKeys) {
                          setApiKeys({
                            openai: data.apiKeys.openai === '***' ? apiKeys.openai : data.apiKeys.openai || '',
                            deepseek: data.apiKeys.deepseek === '***' ? apiKeys.deepseek : data.apiKeys.deepseek || '',
                            ollamaUrl: data.apiKeys.ollamaUrl || 'http://localhost:11434'
                          });
                          // 保存API密钥
                          if (data.apiKeys.openai && data.apiKeys.openai !== '***') {
                            localStorage.setItem('openaiApiKey', data.apiKeys.openai);
                          }
                          if (data.apiKeys.deepseek && data.apiKeys.deepseek !== '***') {
                            localStorage.setItem('deepseekApiKey', data.apiKeys.deepseek);
                          }
                          if (data.apiKeys.ollamaUrl) {
                            localStorage.setItem('ollamaUrlApiKey', data.apiKeys.ollamaUrl);
                          }
                        }
                        alert('数据恢复成功！');
                      } catch (error) {
                        alert('恢复失败：无效的备份文件');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full"
        >
          保存所有设置
        </button>
      </div>
    </div>
  )
}

export default Settings
