import React, { useState, useRef } from 'react'
import { exportToText, exportToMarkdown, exportToDocx } from '../../utils/exportUtils'

interface SkillParameter {
  id: string
  name: string
  type: 'text' | 'textarea' | 'select' | 'file' | 'number' | 'date'
  label: string
  description: string
  required: boolean
  placeholder?: string
  default?: string
  options?: Array<{ [key: string]: string }>
}

interface SkillPackage {
  id: string
  name: string
  description: string
  category: string
  version: string
  author: string
  parameters: SkillParameter[]
  tags: string[]
}

interface SkillPackageFrameworkProps {
  skillPackage: SkillPackage
  onGenerate: (params: any) => Promise<string>
  isLoading?: boolean
}

const SkillPackageFramework: React.FC<SkillPackageFrameworkProps> = ({
  skillPackage,
  onGenerate,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<any>({})
  const [result, setResult] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const resultRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }))
    // 清除该字段的错误
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const handleFileUpload = (id: string, file: File) => {
    // 限制文件大小为10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({
        ...prev,
        [id]: `文件大小不能超过10MB，当前文件大小: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      }))
      return
    }
    
    setFormData(prev => ({ ...prev, [id]: file }))
    // 清除该字段的错误
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    skillPackage.parameters.forEach(param => {
      if (param.required && !formData[param.id] && !param.default) {
        newErrors[param.id] = '此字段为必填项'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsGenerating(true)
    try {
      const generatedResult = await onGenerate(formData)
      setResult(generatedResult)
      // 滚动到结果区域
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = (format: 'txt' | 'md' | 'docx') => {
    if (!result) return
    
    const filename = `${skillPackage.id}_${Date.now()}.${format}`
    switch (format) {
      case 'txt':
        exportToText(result, filename)
        break
      case 'md':
        exportToMarkdown(result, filename)
        break
      case 'docx':
        exportToDocx(result, filename)
        break
    }
  }

  const handleCopyResult = () => {
    if (!result) return
    navigator.clipboard.writeText(result).then(() => {
      alert('结果已复制到剪贴板')
    })
  }

  const renderParameterInput = (param: SkillParameter) => {
    switch (param.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <input
            type={param.type}
            id={param.id}
            name={param.name}
            value={formData[param.id] || param.default || ''}
            onChange={(e) => handleInputChange(param.id, e.target.value)}
            placeholder={param.placeholder}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors[param.id] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required={param.required}
          />
        )
      case 'textarea':
        return (
          <textarea
            id={param.id}
            name={param.name}
            value={formData[param.id] || param.default || ''}
            onChange={(e) => handleInputChange(param.id, e.target.value)}
            placeholder={param.placeholder}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors ${
              errors[param.id] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required={param.required}
          />
        )
      case 'select':
        return (
          <select
            id={param.id}
            name={param.name}
            value={formData[param.id] || param.default || ''}
            onChange={(e) => handleInputChange(param.id, e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors[param.id] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required={param.required}
          >
            <option value="">请选择...</option>
            {param.options?.map((option, index) => {
              const key = Object.keys(option)[0]
              return (
                <option key={index} value={key}>
                  {option[key]}
                </option>
              )
            })}
          </select>
        )
      case 'file':
        return (
          <div 
            className={`border-2 rounded-lg p-6 text-center transition-colors ${
              errors[param.id] 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-primary-500');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary-500');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary-500');
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(param.id, e.dataTransfer.files[0]);
              }
            }}
          >
            <input
              type="file"
              id={param.id}
              name={param.name}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(param.id, e.target.files[0])
                }
              }}
              className="hidden"
              accept=".mp3,.txt,.md,.csv,.xlsx,.xls"
            />
            <label
              htmlFor={param.id}
              className="cursor-pointer"
            >
              <div className="text-4xl mb-2">📁</div>
              <p className="text-gray-600 dark:text-gray-400">
                {formData[param.id] ? formData[param.id].name : '点击或拖拽上传文件'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                支持 .mp3, .txt, .md, .csv, .xlsx 格式
              </p>
            </label>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {skillPackage.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {skillPackage.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {skillPackage.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            输入参数
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {skillPackage.parameters.map((param) => (
                <div key={param.id}>
                  <label
                    htmlFor={param.id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {param.label}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {param.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {param.description}
                    </p>
                  )}
                  {renderParameterInput(param)}
                  {errors[param.id] && (
                    <p className="text-sm text-red-500 mt-1">{errors[param.id]}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full mt-8 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  生成中...
                </>
              ) : (
                '生成内容'
              )}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg" ref={resultRef}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              生成结果
            </h2>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopyResult}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="复制到剪贴板"
                >
                  📋 复制
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="导出为TXT"
                >
                  📄 TXT
                </button>
                <button
                  onClick={() => handleExport('md')}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="导出为Markdown"
                >
                  📝 MD
                </button>
                <button
                  onClick={() => handleExport('docx')}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="导出为DOCX"
                >
                  📚 DOCX
                </button>
              </div>
            )}
          </div>
          <div className="min-h-96">
            {result ? (
              <div className="prose dark:prose-invert max-w-none">
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap transition-all duration-300 hover:shadow-inner">
                  {result}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400 dark:text-gray-500 transition-all duration-300">
                <div className="text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-lg">填写参数后，点击生成内容</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillPackageFramework
