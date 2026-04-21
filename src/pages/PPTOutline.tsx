import React from 'react'
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework'

const PPTOutline: React.FC = () => {
  const skillPackage = {
    id: 'ppt-outline',
    name: 'PPT大纲设计师',
    description: '智能PPT大纲生成助手，帮助你快速创建专业的演示文稿结构',
    category: 'general',
    version: '1.0.0',
    author: '系统',
    tags: ['PPT', '演示', '大纲', '设计'],
    parameters: [
      {
        id: 'presentationTopic',
        name: 'presentationTopic',
        type: 'text',
        label: '演示主题',
        description: 'PPT的核心主题',
        required: true,
        placeholder: '例如：项目进度汇报、产品发布会、培训课程'
      },
      {
        id: 'audience',
        name: 'audience',
        type: 'text',
        label: '目标受众',
        description: '演示的目标受众',
        required: true,
        placeholder: '例如：公司领导、客户、同事、学生'
      },
      {
        id: 'duration',
        name: 'duration',
        type: 'select',
        label: '演示时长',
        description: 'PPT的预计演示时长',
        required: true,
        default: '15',
        options: [
          { '5': '5分钟' },
          { '10': '10分钟' },
          { '15': '15分钟' },
          { '20': '20分钟' },
          { '30': '30分钟' },
          { '45': '45分钟' },
          { '60': '60分钟' }
        ]
      },
      {
        id: 'presentationStyle',
        name: 'presentationStyle',
        type: 'select',
        label: '演示风格',
        description: 'PPT的整体风格',
        required: true,
        default: 'professional',
        options: [
          { 'professional': '专业正式' },
          { 'creative': '创意新颖' },
          { 'technical': '技术详细' },
          { 'marketing': '营销推广' },
          { 'training': '培训教育' }
        ]
      },
      {
        id: 'keyPoints',
        name: 'keyPoints',
        type: 'textarea',
        label: '关键要点',
        description: '演示需要包含的关键内容，每个要点占一行',
        required: true,
        placeholder: '例如：\n- 项目背景和目标\n- 主要功能和特性\n- 技术实现方案\n- 预期效果和收益\n- 实施计划和时间表'
      },
      {
        id: 'additionalInfo',
        name: 'additionalInfo',
        type: 'textarea',
        label: '补充信息',
        description: '其他需要考虑的信息',
        required: false,
        placeholder: '例如：需要突出的重点、特殊要求等'
      },
      {
        id: 'outputFormat',
        name: 'outputFormat',
        type: 'select',
        label: '输出格式',
        description: '大纲的输出格式',
        required: true,
        default: 'detailed',
        options: [
          { 'detailed': '详细大纲（含内容建议）' },
          { 'outline': '简要大纲（仅标题结构）' },
          { 'visual': '视觉大纲（含布局建议）' }
        ]
      }
    ]
  };

  const handleGenerate = async (params: any): Promise<string> => {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const duration = params.duration;
    const slideCount = Math.max(3, Math.min(20, Math.round(parseInt(duration) / 2)));
    
    const styleText = {
      'professional': '专业正式',
      'creative': '创意新颖',
      'technical': '技术详细',
      'marketing': '营销推广',
      'training': '培训教育'
    }[params.presentationStyle] || '专业正式';

    const formatText = {
      'detailed': '详细大纲',
      'outline': '简要大纲',
      'visual': '视觉大纲'
    }[params.outputFormat] || '详细大纲';

    const keyPoints = params.keyPoints.split('\n').filter(Boolean);
    
    return `# PPT大纲：${params.presentationTopic}

## 基本信息
- **主题**：${params.presentationTopic}
- **受众**：${params.audience}
- **时长**：${duration}分钟
- **风格**：${styleText}
- **预计幻灯片数**：${slideCount}张

## 大纲结构

1. **封面**：${params.presentationTopic}
   - 主题标题和副标题
   - 日期和演讲者信息
   - 设计建议：简洁大气，突出主题

2. **议程**：本次演示内容
   - 概述主要环节
   - 帮助观众了解整体结构
   - 设计建议：清晰列出，便于导航

${keyPoints.map((point: string, index: number) => `
${index + 3}. **${point.replace(/^[-*•]\s*/, '')}**
   - 详细内容要点
   - 相关数据或案例
   - 设计建议：使用图表或图示增强表达`).join('')}

${slideCount > keyPoints.length + 2 ? `
${slideCount - 1}. **总结**：核心要点回顾
   - 归纳主要内容
   - 强调关键信息
   - 设计建议：简洁明了，突出重点` : ''}

${slideCount > 0 ? `
${slideCount}. **问答环节**：互动交流
   - 预留时间回答问题
   - 联系方式和后续跟进
   - 设计建议：简洁大方，预留足够空间` : ''}

## 设计建议
- **总体风格**：${styleText}风格，符合目标受众特点
- **配色方案**：根据主题选择合适的色彩搭配
- **字体选择**：标题使用无衬线字体，正文使用易读字体
- **视觉元素**：使用图标、图表等元素增强视觉效果

## 演示技巧
- 控制语速，确保观众理解
- 重点内容使用动画强调
- 与观众保持眼神交流
- 准备详细的演讲脚本
- 预留足够时间用于问答

（注：这是由AI助手生成的${formatText}，建议根据实际情况进行调整和完善。）`;
  };

  return (
    <SkillPackageFramework
      skillPackage={skillPackage}
      onGenerate={handleGenerate}
    />
  );
};

export default PPTOutline;
