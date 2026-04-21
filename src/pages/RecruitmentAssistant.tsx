import React, { useState } from 'react'
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework'

const RecruitmentAssistant: React.FC = () => {
  const [formData, setFormData] = useState({
    position: '',
    requirements: '',
    interview_type: 'technical',
    question_count: 5,
    difficulty: 'medium',
    output_format: 'markdown',
    resumeFile: null
  })

  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'question_count' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // 模拟AI生成过程
    setTimeout(() => {
      const generatedContent = `# 招聘面试助手结果

## 面试问题列表

1. **技术问题1**：请详细描述您在前端开发中使用过的框架和库
2. **技术问题2**：如何优化前端应用的性能？
3. **行为问题**：请分享一次您解决复杂技术问题的经历
4. **技术问题3**：如何处理跨浏览器兼容性问题？
5. **技术问题4**：请解释RESTful API的设计原则

## 评估要点

1. **技术问题1**：
   - 框架使用经验
   - 技术栈广度
   - 对框架原理的理解

2. **技术问题2**：
   - 性能优化策略
   - 实际优化经验
   - 对性能瓶颈的识别能力

3. **行为问题**：
   - 问题解决能力
   - 沟通表达能力
   - 团队协作能力

4. **技术问题3**：
   - 跨浏览器兼容性经验
   - 调试能力
   - 解决方案的有效性

5. **技术问题4**：
   - API设计理解
   - RESTful原则掌握
   - 实际API设计经验

## 候选人评分模板

| 评估维度 | 评分（1-5） | 备注 |
|---------|------------|------|
| 技术能力 |            |      |
| 问题解决 |            |      |
| 沟通表达 |            |      |
| 团队协作 |            |      |
| 学习能力 |            |      |
| 综合素质 |            |      |

## 面试总结建议

- 重点关注候选人的实际项目经验
- 评估技术深度和广度
- 考察解决问题的思路和方法
- 了解候选人的学习能力和适应性
- 评估与团队文化的匹配度`
      
      setResult(generatedContent)
      setLoading(false)
    }, 1500)
  }

  const parameters = [
    {
      id: 'position',
      name: 'position',
      type: 'text',
      label: '职位名称',
      description: '招聘的职位名称',
      required: true,
      placeholder: '例如：前端开发工程师'
    },
    {
      id: 'requirements',
      name: 'requirements',
      type: 'textarea',
      label: '职位要求',
      description: '职位的具体要求',
      required: true,
      placeholder: '请输入职位的技能要求、经验要求等'
    },
    {
      id: 'resumeFile',
      name: 'resumeFile',
      type: 'file',
      label: '简历文件',
      description: '上传候选人简历，支持PDF、DOCX、TXT格式',
      required: false,
      accept: '.pdf,.docx,.txt'
    },
    {
      id: 'interview_type',
      name: 'interview_type',
      type: 'select',
      label: '面试类型',
      description: '面试的类型',
      required: true,
      default: 'technical',
      options: [
        { value: 'technical', label: '技术面试' },
        { value: 'behavioral', label: '行为面试' },
        { value: 'case', label: '案例面试' }
      ]
    },
    {
      id: 'question_count',
      name: 'question_count',
      type: 'number',
      label: '问题数量',
      description: '生成的面试问题数量',
      required: true,
      default: 5,
      min: 3,
      max: 10
    },
    {
      id: 'difficulty',
      name: 'difficulty',
      type: 'select',
      label: '难度级别',
      description: '面试问题的难度级别',
      required: true,
      default: 'medium',
      options: [
        { value: 'easy', label: '简单' },
        { value: 'medium', label: '中等' },
        { value: 'hard', label: '困难' }
      ]
    },
    {
      id: 'output_format',
      name: 'output_format',
      type: 'select',
      label: '输出格式',
      description: '输出的格式',
      required: true,
      default: 'markdown',
      options: [
        { value: 'markdown', label: 'Markdown' },
        { value: 'text', label: '纯文本' }
      ]
    }
  ]

  return (
    <SkillPackageFramework
      title="招聘面试助手"
      description="智能招聘面试助手，帮助HR生成面试问题和评估候选人"
      parameters={parameters}
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      result={result}
      loading={loading}
    />
  )
}

export default RecruitmentAssistant