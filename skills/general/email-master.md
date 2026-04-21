---
id: email-master
name: 智能邮件大师
version: 1.0.0
author: 系统
category: general
description: 智能邮件写作助手，支持多种场景和语气的专业邮件生成
createdAt: 2024-01-15T00:00:00Z
updatedAt: 2024-01-15T00:00:00Z
tags:
  - 邮件
  - 写作
  - 商务
  - 沟通
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
  - id: emailType
    name: emailType
    type: select
    label: 邮件类型
    description: 选择要写的邮件类型
    required: true
    default: formal
    options:
      - formal: 正式商务邮件
      - friendly: 友好问候邮件
      - request: 请求/申请邮件
      - apology: 道歉邮件
      - thankyou: 感谢邮件
      - followup: 跟进邮件
  - id: recipient
    name: recipient
    type: text
    label: 收件人信息
    description: 收件人姓名、职位或公司
    required: true
    placeholder: 例如：张三 经理，或 ABC公司
  - id: subject
    name: subject
    type: text
    label: 邮件主题
    description: 邮件的核心主题
    required: true
    placeholder: 简要概括邮件内容
  - id: contentPoints
    name: contentPoints
    type: textarea
    label: 邮件内容要点
    description: 列出邮件需要包含的要点，每个要点占一行
    required: true
    placeholder: |
      例如：
      - 说明项目延期的原因
      - 提出新的时间安排
      - 表达歉意并请求理解
  - id: tone
    name: tone
    type: select
    label: 语气风格
    description: 选择邮件的整体语气
    required: true
    default: professional
    options:
      - professional: 专业正式
      - friendly: 友好亲切
      - urgent: 紧急重要
      - casual: 轻松随意
  - id: signature
    name: signature
    type: textarea
    label: 签名信息
    description: 您的姓名、职位等签名信息
    required: false
    placeholder: |
      例如：
      李四
      项目经理
      联系电话：138-xxxx-xxxx
---

## 智能邮件大师

### 功能描述
专业的智能邮件写作助手，支持多种邮件场景和语气风格，帮助您快速生成高质量的邮件内容。

### 输入参数
- **邮件类型**：选择合适的邮件场景
- **收件人信息**：收件人的基本信息
- **邮件主题**：邮件的核心主题
- **邮件内容要点**：需要包含的核心内容
- **语气风格**：邮件的整体风格
- **签名信息**：可选的个性化签名

### 提示词模板

你是一位专业的商务写作专家，请根据以下信息生成一封高质量的邮件：

邮件类型：{{emailType}}
收件人：{{recipient}}
主题：{{subject}}
内容要点：
{{contentPoints}}
语气风格：{{tone}}
签名：{{signature}}

请按照以下要求生成邮件：
1. 开头要有恰当的问候语
2. 正文要结构清晰，逻辑连贯
3. 包含所有列出的内容要点
4. 结尾要有合适的结束语和问候
5. 语言表达要符合同选择的语气风格
6. 要符合商务邮件的格式规范
7. 使用{{signature}}作为落款，如果没有提供，则留空让用户自行填写

邮件应该：
- 语言流畅，表达清晰
- 符合所选邮件类型的特点
- 语气与选择的风格一致
- 内容完整，涵盖所有要点
- 格式规范，易于阅读

### 输出格式

请直接生成完整的邮件内容，包含邮件正文和签名（如果有）。

### 示例

**输入**：
- 邮件类型：正式商务邮件
- 收件人：张三 总经理
- 主题：关于Q4项目延期的沟通
- 内容要点：
  - 项目进度回顾
  - 延期原因说明（供应链问题）
  - 新的时间安排（延迟2周）
  - 后续改进措施
  - 表达歉意
- 语气风格：专业正式
- 签名：李四 项目经理

**输出**：

尊敬的张总：

您好！

首先，感谢您一直以来对我们Q4项目的关注与支持。

关于Q4项目的进展，我需要向您汇报一个重要的情况。经过团队的详细评估，我们发现项目需要进行适当的延期调整。

**项目进度回顾**：
截至目前，我们已完成了项目核心模块的80%开发工作，包括前端界面和后端API的基础架构。但在供应链对接阶段，我们遇到了一些预料之外的挑战。

**延期原因说明**：
主要是由于核心供应商的物流问题，关键组件的交付时间比原定计划延迟了10天。这直接影响了我们的集成测试进度。

**新的时间安排**：
基于当前情况，我们将项目整体交付时间调整为2024年1月30日，比原定计划延迟2周。

**后续改进措施**：
为避免类似情况再次发生，我们正在：
1. 建立备选供应商机制
2. 增加关键组件的安全库存
3. 优化项目风险评估流程

对此延期可能给您带来的不便，我们深表歉意。我们将全力以赴，确保在新的时间节点内高质量交付项目。

如果您有任何疑问或需要进一步讨论，欢迎随时与我联系。

再次感谢您的理解与支持！

此致
敬礼！

李四
项目经理
