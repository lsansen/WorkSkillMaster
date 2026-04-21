import React, { useState, useEffect } from 'react'

const Settings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('openaiApiKey') || '',
    deepseek: localStorage.getItem('deepseekApiKey') || ''
  })

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiKeys(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem('openaiApiKey', apiKeys.openai)
    localStorage.setItem('deepseekApiKey', apiKeys.deepseek)
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
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="system">跟随系统</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              语言
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              默认模型
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="ollama-llama3">本地模型 (Llama 3)</option>
              <option value="openai-gpt4">OpenAI GPT-4</option>
              <option value="openai-gpt3.5">OpenAI GPT-3.5</option>
            </select>
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
          
          <button 
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            保存设置
          </button>
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
                // 模拟备份功能
                const backupData = {
                  settings: {
                    theme: localStorage.getItem('theme') || 'light',
                    language: 'zh-CN',
                    defaultModel: 'ollama-llama3'
                  },
                  skills: [],
                  history: []
                };
                const dataStr = JSON.stringify(backupData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `skill-backup-${new Date().toISOString().split('T')[0]}.json`;
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
                        // 模拟恢复功能
                        if (data.settings?.theme) {
                          localStorage.setItem('theme', data.settings.theme);
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
    </div>
  )
}

export default Settings
