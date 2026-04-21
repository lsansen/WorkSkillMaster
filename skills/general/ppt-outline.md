---
id: ppt-outline
name: PPT大纲设计师
version: 1.0.0
author: 系统
category: general
description: 智能PPT大纲生成助手，帮助你快速创建专业的演示文稿结构
createdAt: 2024-01-16T00:00:00Z
updatedAt: 2024-01-16T00:00:00Z
tags:
  - PPT
  - 演示
  - 大纲
  - 设计
modelRequirements:
  - type: local
    modelType: text
    minTokens: 1000
    recommendedModels:
      - llama3:8b
      - gemma:7b
    fallbackEnabled: true
  - type: cloud
    modelType: text
    minTokens: 1000
    recommendedModels:
      - gpt-4
      - gpt-3.5-turbo
    fallbackEnabled: true
parameters:
  - id: presentationTopic
    name: presentationTopic
    type: text
    label: 演示主题
    description: PPT的核心主题
    required: true
    placeholder: 例如：项目进度汇报、产品发布会、培训课程
  - id: audience
    name: audience
    type: text
    label: 目标受众
    description: 演示的目标受众
    required: true
    placeholder: 例如：公司领导、客户、同事、学生
  - id: duration
    name: duration
    type: select
    label: 演示时长
    description: PPT的预计演示时长
    required: true
    default: '15'
    options:
      - '5': 5分钟
      - '10': 10分钟
      - '15': 15分钟
      - '20': 20分钟
      - '30': 30分钟
      - '45': 45分钟
      - '60': 60分钟
  - id: presentationStyle
    name: presentationStyle
    type: select
    label: 演示风格
    description: PPT的整体风格
    required: true
    default: 'professional'
    options:
      - 'professional': 专业正式
      - 'creative': 创意新颖
      - 'technical': 技术详细
      - 'marketing': 营销推广
      - 'training': 培训教育
  - id: keyPoints
    name: keyPoints
    type: textarea
    label: 关键要点
    description: 演示需要包含的关键内容，每个要点占一行
    required: true
    placeholder: |
      例如：
      - 项目背景和目标
      - 主要功能和特性
      - 技术实现方案
      - 预期效果和收益
      - 实施计划和时间表
  - id: additionalInfo
    name: additionalInfo
    type: textarea
    label: 补充信息
    description: 其他需要考虑的信息
    required: false
    placeholder: 例如：需要突出的重点、特殊要求等
  - id: outputFormat
    name: outputFormat
    type: select
    label: 输出格式
    description: 大纲的输出格式
    required: true
    default: 'detailed'
    options:
      - 'detailed': 详细大纲（含内容建议）
      - 'outline': 简要大纲（仅标题结构）
      - 'visual': 视觉大纲（含布局建议）
---

## PPT大纲设计师

### 功能描述
智能PPT大纲生成助手，根据你的需求快速创建专业的演示文稿结构，支持多种风格和格式。

### 输入参数
- **演示主题**：PPT的核心主题
- **目标受众**：演示的目标人群
- **演示时长**：预计的演示时间
- **演示风格**：PPT的整体风格
- **关键要点**：需要包含的核心内容
- **补充信息**：其他需要考虑的信息
- **输出格式**：大纲的详细程度和格式

### 提示词模板

你是一位专业的PPT设计专家，请根据以下信息为我生成一份高质量的PPT大纲：

演示主题：{{presentationTopic}}
目标受众：{{audience}}
演示时长：{{duration}}分钟
演示风格：{{presentationStyle}}
关键要点：
{{keyPoints}}
补充信息：
{{additionalInfo}}
输出格式：{{outputFormat}}

请按照以下要求生成PPT大纲：

1. 根据演示时长合理规划幻灯片数量（一般1-2分钟/张）
2. 结构清晰，逻辑连贯
3. 包含完整的开场、主体和结尾部分
4. 针对目标受众调整内容深度和专业程度
5. 符合所选的演示风格
6. 包含所有列出的关键要点
7. 提供内容建议和视觉设计提示

根据{{outputFormat}}选择合适的输出格式：
- detailed: 详细大纲，包含每张幻灯片的标题、内容要点和设计建议
- outline: 简要大纲，仅包含幻灯片标题结构
- visual: 视觉大纲，包含布局建议和视觉元素推荐

大纲应该：
- 结构合理，层次分明
- 内容完整，重点突出
- 风格一致，符合专业标准
- 便于实际制作和演示

### 输出格式

请按照以下结构生成PPT大纲：

# PPT大纲：{{presentationTopic}}

## 基本信息
- **主题**：{{presentationTopic}}
- **受众**：{{audience}}
- **时长**：{{duration}}分钟
- **风格**：{{presentationStyle}}
- **预计幻灯片数**：[数量]张

## 大纲结构

1. [幻灯片1标题]：[内容概述]
   - [要点1]
   - [要点2]
   - [设计建议]

2. [幻灯片2标题]：[内容概述]
   - [要点1]
   - [要点2]
   - [设计建议]

...

## 设计建议
- [总体设计风格建议]
- [配色方案建议]
- [字体选择建议]
- [视觉元素建议]

## 演示技巧
- [演示技巧1]
- [演示技巧2]
- [演示技巧3]

### 示例

**输入**：
- 演示主题：新项目启动
- 目标受众：公司领导和团队成员
- 演示时长：15分钟
- 演示风格：专业正式
- 关键要点：
  - 项目背景和目标
  - 市场分析
  - 技术方案
  - 实施计划
  - 预期收益
- 补充信息：需要强调项目的创新性和可行性
- 输出格式：详细大纲

**输出**：

# PPT大纲：新项目启动

## 基本信息
- **主题**：新项目启动
- **受众**：公司领导和团队成员
- **时长**：15分钟
- **风格**：专业正式
- **预计幻灯片数**：8-10张

## 大纲结构

1. **封面**：新项目启动
   - 项目名称和Logo
   - 日期和演讲者
   - 设计建议：简洁大气，突出项目名称

2. **议程**：本次演示内容
   - 项目背景和目标
   - 市场分析
   - 技术方案
   - 实施计划
   - 预期收益
   - 设计建议：清晰列出议程，便于观众了解整体结构

3. **项目背景**：为什么启动这个项目
   - 市场需求分析
   - 公司战略规划
   - 设计建议：使用图表展示市场趋势

4. **项目目标**：我们要达成什么
   - 短期目标
   - 长期目标
   - 设计建议：使用目标看板或时间线

5. **市场分析**：行业现状和机会
   - 竞争对手分析
   - 市场机会点
   - 设计建议：使用竞争分析矩阵

6. **技术方案**：如何实现目标
   - 技术架构
   - 核心技术
   - 设计建议：使用技术架构图

7. **实施计划**：项目时间线
   - 关键里程碑
   - 资源需求
   - 设计建议：使用甘特图

8. **预期收益**：项目价值
   - 商业价值
   - 技术价值
   - 设计建议：使用数据图表展示预期收益

9. **风险与应对**：潜在挑战
   - 识别风险
   - 应对策略
   - 设计建议：使用风险矩阵

10. **总结与问答**：项目展望
    - 项目亮点回顾
    - 下一步行动
    - 设计建议：简洁明了，预留问答环节

## 设计建议
- **总体风格**：专业商务风格，使用公司标准配色
- **配色方案**：蓝色为主色调，搭配白色和浅灰色
- **字体选择**：标题使用无衬线字体，正文使用易读字体
- **视觉元素**：使用简洁的图表和图标，避免过多装饰

## 演示技巧
- 每部分控制在1.5分钟内
- 重点内容使用动画强调
- 准备详细的演讲脚本
- 预留2-3分钟用于问答
