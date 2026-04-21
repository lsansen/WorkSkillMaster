import React from 'react';
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework';

const TaskManagement: React.FC = () => {
  const skillPackage = {
    id: 'task-management',
    name: '任务拆解与时间管理大师',
    description: '智能任务拆解与时间管理助手，帮助你将复杂任务分解为可执行步骤并合理安排时间',
    category: 'general',
    version: '1.0.0',
    author: '系统',
    tags: ['任务', '时间管理', '项目管理', '计划', '效率'],
    parameters: [
      {
        id: 'taskDescription',
        name: 'taskDescription',
        type: 'textarea',
        label: '任务描述',
        description: '详细描述要完成的任务或项目',
        required: true,
        placeholder: '例如：\n完成一个新的前端项目开发，包括需求分析、界面设计、代码实现、测试和部署'
      },
      {
        id: 'deadline',
        name: 'deadline',
        type: 'date',
        label: '截止日期',
        description: '任务的截止日期',
        required: true
      },
      {
        id: 'taskComplexity',
        name: 'taskComplexity',
        type: 'select',
        label: '任务复杂度',
        description: '任务的复杂程度',
        required: true,
        default: 'medium',
        options: [
          { 'simple': '简单' },
          { 'medium': '中等' },
          { 'complex': '复杂' }
        ]
      },
      {
        id: 'availableHoursPerDay',
        name: 'availableHoursPerDay',
        type: 'number',
        label: '每天可用时间（小时）',
        description: '每天可以用于此任务的时间',
        required: true,
        default: 4
      },
      {
        id: 'priorityLevel',
        name: 'priorityLevel',
        type: 'select',
        label: '优先级',
        description: '任务的优先级',
        required: true,
        default: 'high',
        options: [
          { 'low': '低' },
          { 'medium': '中' },
          { 'high': '高' },
          { 'urgent': '紧急' }
        ]
      },
      {
        id: 'dependencies',
        name: 'dependencies',
        type: 'textarea',
        label: '依赖项',
        description: '任务的依赖项或前置条件',
        required: false,
        placeholder: '例如：\n- 需要设计团队提供UI设计稿\n- 需要后端API接口\n- 需要测试环境'
      },
      {
        id: 'outputFormat',
        name: 'outputFormat',
        type: 'select',
        label: '输出格式',
        description: '选择输出的格式',
        required: true,
        default: 'gantt',
        options: [
          { 'gantt': '甘特图格式' },
          { 'list': '任务列表格式' },
          { 'calendar': '日历格式' },
          { 'prioritized': '优先级排序格式' }
        ]
      }
    ]
  };

  const calculateDaysUntil = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const generateTasks = (complexity: string): string[] => {
    switch (complexity) {
      case 'simple':
        return [
          '任务分析与规划',
          '核心工作执行',
          '检查与验证',
          '完成与交付'
        ];
      case 'medium':
        return [
          '需求分析',
          '计划制定',
          '核心功能开发',
          '测试与优化',
          '文档整理',
          '交付与部署'
        ];
      case 'complex':
        return [
          '需求收集与分析',
          '详细规划与设计',
          '核心架构搭建',
          '功能模块开发',
          '集成与测试',
          '性能优化',
          '用户验收测试',
          '部署与上线',
          '监控与维护'
        ];
      default:
        return [];
    }
  };

  const handleGenerate = async (params: any): Promise<string> => {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const daysUntilDeadline = calculateDaysUntil(params.deadline);
    const totalAvailableHours = daysUntilDeadline * params.availableHoursPerDay;
    const tasks = generateTasks(params.taskComplexity);
    const avgHoursPerTask = totalAvailableHours / Math.max(1, tasks.length);
    
    const complexityText = {
      'simple': '简单',
      'medium': '中等',
      'complex': '复杂'
    }[params.taskComplexity] || '中等';

    const priorityText = {
      'low': '低',
      'medium': '中',
      'high': '高',
      'urgent': '紧急'
    }[params.priorityLevel] || '中';

    const outputFormatText = {
      'gantt': '甘特图格式',
      'list': '任务列表格式',
      'calendar': '日历格式',
      'prioritized': '优先级排序格式'
    }[params.outputFormat] || '甘特图格式';

    const dependencies = params.dependencies ? params.dependencies.split('\n').filter(Boolean) : ['无特殊依赖项'];

    return `# 任务拆解与时间管理计划

## 1. 任务概述
- **任务描述**：${params.taskDescription}
- **截止日期**：${params.deadline}
- **剩余时间**：${daysUntilDeadline}天
- **每天可用时间**：${params.availableHoursPerDay}小时
- **总可用时间**：${totalAvailableHours}小时
- **任务复杂度**：${complexityText}
- **优先级**：${priorityText}

## 2. 依赖项分析
${dependencies.map((dep: string, index: number) => `- ${dep}`).join('\n')}

## 3. 任务拆解

### 3.1 主要阶段
${tasks.map((task: string, index: number) => `${index + 1}. ${task}`).join('\n')}

### 3.2 详细任务
${tasks.map((task: string, index: number) => `
${index + 1}. **${task}**：${task}的详细描述
   - **预计时间**：${Math.round(avgHoursPerTask)}小时
   - **优先级**：${index < tasks.length * 0.5 ? '高' : '中'}
   - **依赖项**：${index === 0 ? '无' : `${index}号任务`}`).join('')}

## 4. 时间安排

### 4.1 甘特图
```
[甘特图]
${tasks.map((task: string, index: number) => {
  const startDay = Math.floor(index * daysUntilDeadline / tasks.length) + 1;
  const endDay = Math.min(Math.floor((index + 1) * daysUntilDeadline / tasks.length), daysUntilDeadline);
  return `第${startDay}-${endDay}天：${task}`;
}).join('\n')}
```

### 4.2 每日计划
${Array.from({ length: daysUntilDeadline }, (_, i) => {
  const day = i + 1;
  const taskIndex = Math.min(Math.floor(i * tasks.length / daysUntilDeadline), tasks.length - 1);
  return `- **第${day}天**：${tasks[taskIndex]}`;
}).join('\n')}

## 5. 时间管理建议
- 采用番茄工作法，每25分钟集中工作，5分钟休息
- 优先处理核心任务和高优先级任务
- 每天结束时回顾当天进度，调整第二天计划
- 预留10%的缓冲时间应对突发情况
- 保持专注，减少干扰，创建专门的工作环境
- 使用时间管理工具记录和跟踪进度
- 合理安排休息时间，避免 burnout

## 6. 风险与应对
- **风险1**：任务延期 → 提前识别关键路径，增加并行任务
- **风险2**：资源不足 → 提前申请和协调资源
- **风险3**：需求变更 → 建立变更管理机制，评估影响
- **风险4**：技术难题 → 提前研究和准备，寻求专家帮助

（注：这是由AI助手生成的${outputFormatText}任务计划，建议根据实际情况进行调整和完善。）`;
  };

  return (
    <SkillPackageFramework
      skillPackage={skillPackage}
      onGenerate={handleGenerate}
    />
  );
};

export default TaskManagement;
