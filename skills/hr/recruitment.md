---
id: recruitment-assistant
name: 招聘面试助手
version: 1.0.0
author: 系统
category: hr
description: 智能招聘面试助手，帮助HR生成面试问题和评估候选人
parameters:
  - id: position
    name: position
    type: text
    label: 职位名称
    description: 招聘的职位名称
    required: true
    placeholder: 例如：前端开发工程师
  - id: requirements
    name: requirements
    type: textarea
    label: 职位要求
    description: 职位的具体要求
    required: true
    placeholder: 请输入职位的技能要求、经验要求等
  - id: interview_type
    name: interview_type
    type: select
    label: 面试类型
    description: 面试的类型
    required: true
    default: technical
    options:
      - { technical: "技术面试" }
      - { behavioral: "行为面试" }
      - { case: "案例面试" }
  - id: question_count
    name: question_count
    type: number
    label: 问题数量
    description: 生成的面试问题数量
    required: true
    default: 5
    min: 3
    max: 10
  - id: difficulty
    name: difficulty
    type: select
    label: 难度级别
    description: 面试问题的难度级别
    required: true
    default: medium
    options:
      - { easy: "简单" }
      - { medium: "中等" }
      - { hard: "困难" }
  - id: output_format
    name: output_format
    type: select
    label: 输出格式
    description: 输出的格式
    required: true
    default: markdown
    options:
      - { markdown: "Markdown" }
      - { text: "纯文本" }
tags:
  - 招聘
  - 面试
  - HR
  - 候选人评估
enabled: true
---

## 招聘面试助手

### 功能描述
智能招聘面试助手，根据职位要求生成专业的面试问题，并提供候选人评估模板。

### 输入参数
- **职位名称**：招聘的职位名称
- **职位要求**：职位的具体要求
- **面试类型**：面试的类型（技术面试、行为面试、案例面试）
- **问题数量**：生成的面试问题数量
- **难度级别**：面试问题的难度级别
- **输出格式**：输出的格式

### 提示词模板

你是一位专业的HR招聘专家，请根据以下信息生成面试问题和评估模板：

**职位名称**：{{position}}
**职位要求**：
{{requirements}}
**面试类型**：{{interview_type}}
**问题数量**：{{question_count}}
**难度级别**：{{difficulty}}

请按照以下格式生成内容：
1. 面试问题列表（按编号排列）
2. 每个问题的评估要点
3. 候选人评分模板
4. 面试总结建议

问题应该：
- 与职位要求紧密相关
- 覆盖技能、经验和软技能等多个方面
- 难度与选择的级别匹配
- 具有针对性和区分度

评估模板应该：
- 包含具体的评分标准
- 涵盖技术能力和综合素质
- 提供清晰的评估维度