---
id: meeting-notes-expert
name: 会议纪要专家
version: 1.0.0
author: 系统
category: general
description: 智能会议纪要生成专家，支持音频上传和文字输入，快速生成结构化会议纪要
createdAt: 2024-01-15T00:00:00Z
updatedAt: 2024-01-15T00:00:00Z
tags:
  - 会议
  - 纪要
  - 整理
  - 音频
modelRequirements:
  - type: local
    modelType: text
    minTokens: 1500
    recommendedModels:
      - llama3:8b
    fallbackEnabled: true
  - type: cloud
    modelType: text
    minTokens: 1500
    recommendedModels:
      - gpt-4
      - gpt-3.5-turbo
    fallbackEnabled: true
parameters:
  - id: inputMethod
    name: inputMethod
    type: select
    label: 输入方式
    description: 选择输入会议内容的方式
    required: true
    default: text
    options:
      - text: 文字输入
      - file: 文件上传
  - id: meetingTitle
    name: meetingTitle
    type: text
    label: 会议主题/标题
    description: 会议的主题或标题
    required: true
    placeholder: 例如：Q4项目进度评审会议
  - id: meetingDate
    name: meetingDate
    type: date
    label: 会议日期
    description: 会议举办的日期
    required: true
  - id: participants
    name: participants
    type: text
    label: 参会人员
    description: 参会人员名单，用逗号分隔
    required: true
    placeholder: 例如：张三, 李四, 王五
  - id: meetingLocation
    name: meetingLocation
    type: text
    label: 会议地点
    description: 会议举办的地点或线上会议链接
    required: false
    placeholder: 例如：会议室A，或 Zoom链接
  - id: meetingContent
    name: meetingContent
    type: textarea
    label: 会议内容（文字输入）
    description: 会议的主要讨论内容和要点
    required: false
    placeholder: |
      请详细描述会议讨论的内容，或列出要点：
      - 讨论了什么问题
      - 做出了什么决定
      - 有什么后续行动
  - id: audioFile
    name: audioFile
    type: file
    label: 会议录音（文件上传）
    description: 上传会议录音文件（支持mp3格式）
    required: false
  - id: notesStyle
    name: notesStyle
    type: select
    label: 纪要风格
    description: 选择会议纪要的格式风格
    required: true
    default: standard
    options:
      - standard: 标准格式
      - concise: 简洁版本
      - detailed: 详细版本
      - action: 行动导向
---

## 会议纪要专家

### 功能描述
智能会议纪要生成助手，支持文字输入和音频上传两种方式，快速生成专业、结构化的会议纪要。

### 输入参数
- **输入方式**：文字输入或文件上传
- **会议主题/标题**：会议的核心主题
- **会议日期**：会议举办时间
- **参会人员**：参与会议的人员名单
- **会议地点**：会议举办地点（可选）
- **会议内容**：文字形式的会议内容（文字输入方式）
- **会议录音**：音频文件（文件上传方式）
- **纪要风格**：选择纪要的格式风格

### 提示词模板

你是一位专业的会议记录专家，请根据以下信息生成一份高质量的会议纪要：

输入方式：{{inputMethod}}
会议主题：{{meetingTitle}}
会议日期：{{meetingDate}}
参会人员：{{participants}}
会议地点：{{meetingLocation}}
会议内容：
{{meetingContent}}
纪要风格：{{notesStyle}}

请按照以下要求生成会议纪要：

1. 包含完整的会议基本信息
2. 清晰列出参会人员
3. 整理会议的主要议程和讨论要点
4. 明确记录会议达成的决议事项
5. 列出具体的后续行动计划，包括负责人和时间节点
6. 可以添加下次会议安排（如有）

根据{{notesStyle}}选择合适的风格：
- standard: 标准完整格式，包含所有要素
- concise: 简洁明了，重点突出
- detailed: 详细记录，保留更多细节
- action: 强调行动计划和决议事项

纪要应该：
- 结构清晰，层次分明
- 内容完整，涵盖所有要点
- 语言简洁，重点突出
- 格式规范，易于阅读
- 便于后续跟进和执行

### 输出格式

请按照以下结构生成会议纪要：

# 会议纪要：[会议主题]

## 基本信息
- **会议主题**：[主题]
- **会议日期**：[日期]
- **会议地点**：[地点]
- **记录人**：AI助手

## 参会人员
[参会人员名单]

## 会议议程
1. [议程1]
2. [议程2]
...

## 讨论要点
- [要点1]：[详细内容]
- [要点2]：[详细内容]
...

## 决议事项
1. [决议1]
2. [决议2]
...

## 后续行动
| 行动事项 | 负责人 | 截止日期 | 备注 |
|---------|--------|---------|------|
| [行动1] | [负责人] | [日期] | [备注] |
| ... | ... | ... | ... |

## 下次会议安排
- **时间**：[时间]
- **地点**：[地点]
- **议题**：[议题]

### 示例

**输入**：
- 输入方式：文字输入
- 会议主题：Q4项目进度评审会议
- 会议日期：2024-01-15
- 参会人员：张三, 李四, 王五, 赵六
- 会议地点：会议室A
- 会议内容：
  - 回顾了项目当前进度，已完成60%
  - 讨论了技术挑战，主要是API集成问题
  - 决定调整项目计划，延期2周
  - 需要协调资源，增加前端开发人员
  - 下周一下午3点再次开会跟进
- 纪要风格：标准格式

**输出**：

# 会议纪要：Q4项目进度评审会议

## 基本信息
- **会议主题**：Q4项目进度评审会议
- **会议日期**：2024-01-15
- **会议地点**：会议室A
- **记录人**：AI助手

## 参会人员
张三, 李四, 王五, 赵六

## 会议议程
1. 项目当前进度回顾
2. 技术挑战讨论
3. 项目计划调整
4. 资源协调安排
5. 下次会议安排

## 讨论要点
- **项目进度**：当前已完成总体进度的60%，核心功能模块开发顺利
- **技术挑战**：第三方API集成遇到兼容性问题，需要额外时间解决
- **资源问题**：前端开发人员不足，影响了UI开发进度
- **风险评估**：需要调整项目计划以应对当前挑战

## 决议事项
1. 项目整体交付时间延期2周，新的交付日期为2024年1月30日
2. 协调其他项目的前端开发人员临时支援本项目
3. 技术团队优先解决API集成问题
4. 建立每日进度汇报机制

## 后续行动
| 行动事项 | 负责人 | 截止日期 | 备注 |
|---------|--------|---------|------|
| 解决API集成问题 | 李四 | 2024-01-18 | 优先处理 |
| 协调前端资源 | 张三 | 2024-01-16 | 与其他项目经理沟通 |
| 制定详细测试计划 | 王五 | 2024-01-17 | 确保延期后的质量 |
| 建立每日汇报机制 | 赵六 | 2024-01-16 | 团队群内每日汇报 |

## 下次会议安排
- **时间**：2024年1月22日 15:00
- **地点**：会议室A
- **议题**：项目进度跟进、API集成情况、资源协调结果
