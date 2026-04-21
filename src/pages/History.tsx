import React, { useState, useEffect } from 'react'

const History: React.FC = () => {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载历史记录数据
    setTimeout(() => {
      setHistory([
        {
          id: '1',
          skillPackageId: 'email-writer',
          skillPackageName: '邮件写作助手',
          input: { recipient: '张三', subject: '项目延期通知', content: '项目需要延期2周', tone: '专业正式' },
          output: 'To: 张三\nSubject: 项目延期通知\n\n尊敬的张三：\n\n您好！\n\n关于我们正在进行的项目，我需要向您通知一个重要事项。经过团队的评估，我们遗憾地发现项目需要进行延期调整。\n\n项目进度回顾：\n截至目前，我们已完成了项目的核心功能开发，但在测试阶段发现了一些需要优化的问题。\n\n延期原因：\n主要是由于第三方API的集成遇到了一些技术挑战，需要额外的时间进行调试和优化。\n\n新的时间安排：\n项目预计将延期2周，新的交付日期为2024年1月30日。\n\n后续工作计划：\n我们已制定了详细的工作计划，确保在新的时间内高质量完成项目。团队将每周向您汇报进展情况。\n\n如有任何疑问，请随时与我联系。\n\n此致\n敬礼\n\n[您的姓名]\n[您的职位]',
          modelId: 'ollama-llama3',
          modelName: '本地模型 (Llama 3)',
          tokenUsage: { prompt: 120, completion: 280, total: 400 },
          cost: 0,
          duration: 3500,
          createdAt: '2024-01-15T10:30:00Z',
          favorited: false
        },
        {
          id: '2',
          skillPackageId: 'meeting-notes',
          skillPackageName: '会议纪要助手',
          input: { meeting_topic: '项目进度评审', participants: '张三、李四、王五', meeting_date: '2024-01-15', meeting_content: '项目当前进度回顾\n遇到的技术挑战\n资源分配问题\n下一阶段计划' },
          output: '# 会议纪要\n\n## 基本信息\n- **主题**：项目进度评审\n- **日期**：2024-01-15\n- **地点**：会议室A\n- **记录人**：系统\n\n## 参会人员\n张三、李四、王五\n\n## 会议议程\n1. 项目当前进度回顾\n2. 技术挑战讨论\n3. 资源分配问题\n4. 下一阶段计划\n\n## 讨论要点\n- **项目进度**：目前完成了总体进度的60%，核心功能已实现\n- **技术挑战**：第三方API集成遇到了兼容性问题，需要额外时间解决\n- **资源分配**：前端开发人员不足，影响了UI开发进度\n- **下一阶段**：需要重点关注测试和优化工作\n\n## 决议事项\n1. 技术团队将在3天内解决API集成问题\n2. 从其他项目临时借调一名前端开发人员\n3. 调整项目计划，将测试阶段延长1周\n\n## 后续行动\n| 行动项 | 负责人 | 截止日期 |\n|--------|--------|----------|\n| API集成问题解决 | 李四 | 2024-01-18 |\n| 前端资源协调 | 张三 | 2024-01-16 |\n| 测试计划制定 | 王五 | 2024-01-17 |\n\n## 下次会议安排\n- **时间**：2024-01-22 10:00\n- **地点**：会议室A\n- **主题**：项目进度跟进',
          modelId: 'openai-gpt3.5',
          modelName: 'OpenAI GPT-3.5',
          tokenUsage: { prompt: 150, completion: 450, total: 600 },
          cost: 0.0015,
          duration: 2000,
          createdAt: '2024-01-14T15:45:00Z',
          favorited: true
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          历史记录
        </h2>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          清空历史
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  技能包
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  模型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  成本
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.skillPackageName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {item.modelName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.tokenUsage.total} tokens
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {Math.round(item.duration / 1000)}s
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${item.cost.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.tokenUsage.prompt} + {item.tokenUsage.completion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-3">
                      查看
                    </button>
                    <button className={`${item.favorited ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'} hover:text-yellow-600 dark:hover:text-yellow-400`}>
                      ⭐
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default History
