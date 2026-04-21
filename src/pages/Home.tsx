import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [skillPackages, setSkillPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载技能包数据
    setTimeout(() => {
      setSkillPackages([
        {
          id: 'email-master',
          name: '智能邮件大师',
          description: '智能邮件写作助手，支持多种场景和语气的专业邮件生成',
          category: 'general',
          tags: ['邮件', '写作', '商务', '沟通'],
          icon: '📧',
          path: '/skill/email-master'
        },
        {
          id: 'meeting-notes-expert',
          name: '会议纪要专家',
          description: '智能会议纪要生成专家，支持音频上传和文字输入',
          category: 'general',
          tags: ['会议', '纪要', '整理', '音频'],
          icon: '📝',
          path: '/skill/meeting-notes-expert'
        },
        {
          id: 'report-generator',
          name: '周报/月报生成器',
          description: '智能周报和月报生成助手，快速生成专业的工作总结报告',
          category: 'general',
          tags: ['报告', '周报', '月报', '总结'],
          icon: '📊',
          path: '/skill/report-generator'
        },
        {
          id: 'ppt-outline',
          name: 'PPT大纲设计师',
          description: '智能PPT大纲设计助手，根据主题和需求生成专业的演示文稿大纲',
          category: 'general',
          tags: ['PPT', '演示', '大纲', '设计'],
          icon: '🎯',
          path: '/skill/ppt-outline'
        },
        {
          id: 'data-analyst',
          name: '数据分析师',
          description: '智能数据分析助手，支持Excel/CSV上传和数据可视化',
          category: 'general',
          tags: ['数据', '分析', 'Excel', 'CSV', '可视化'],
          icon: '📈',
          path: '/skill/data-analyst'
        },
        {
          id: 'task-management',
          name: '任务拆解与时间管理大师',
          description: '智能任务拆解和时间管理助手，帮助规划和跟踪任务进度',
          category: 'general',
          tags: ['任务', '时间', '管理', '规划'],
          icon: '✅',
          path: '/skill/task-management'
        },
        {
          id: 'recruitment-assistant',
          name: '招聘面试助手',
          description: '智能招聘面试助手，帮助HR生成面试问题和评估候选人',
          category: 'hr',
          tags: ['招聘', '面试', 'HR', '候选人评估'],
          icon: '👥',
          path: '/skill/recruitment-assistant'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleUseSkill = (path: string) => {
    navigate(path)
  }

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
          技能包
        </h2>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          新建技能包
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillPackages.map((skill) => (
          <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl mr-4">
                {skill.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {skill.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {skill.category === 'general' ? '通用技能' : '专业技能'}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {skill.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {skill.tags.map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
            <button 
              onClick={() => handleUseSkill(skill.path)}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              使用
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
