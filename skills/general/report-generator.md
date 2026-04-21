---
id: report-generator
name: 周报/月报生成器
version: 1.0.0
author: 系统
category: general
description: 智能周报和月报生成助手，快速生成专业的工作总结报告
createdAt: 2024-01-15T00:00:00Z
updatedAt: 2024-01-15T00:00:00Z
tags:
  - 报告
  - 周报
  - 月报
  - 总结
modelRequirements:
  - type: local
    modelType: text
    minTokens: 1200
    recommendedModels:
      - llama3:8b
      - gemma:7b
    fallbackEnabled: true
  - type: cloud
    modelType: text
    minTokens: 1200
    recommendedModels:
      - gpt-4
      - gpt-3.5-turbo
    fallbackEnabled: true
parameters:
  - id: reportType
    name: reportType
    type: select
    label: 报告类型
    description: 选择要生成的报告类型
    required: true
    default: weekly
    options:
      - weekly: 周报
      - monthly: 月报
      - quarterly: 季度报告
  - id: reportPeriod
    name: reportPeriod
    type: text
    label: 报告周期
    description: 报告的时间周期
    required: true
    placeholder: 例如：2024年第1周 或 2024年1月
  - id: reporterName
    name: reporterName
    type: text
    label: 汇报人姓名
    description: 填写汇报人的姓名
    required: true
    placeholder: 例如：张三
  - id: department
    name: department
    type: text
    label: 所属部门
    description: 填写所属部门或团队
    required: true
    placeholder: 例如：产品研发部
  - id: completedWork
    name: completedWork
    type: textarea
    label: 已完成工作
    description: 列出本周期已完成的主要工作，每项占一行
    required: true
    placeholder: |
      例如：
      - 完成用户登录功能开发
      - 优化了首页加载性能
      - 修复了10个bug
  - id: ongoingWork
    name: ongoingWork
    type: textarea
    label: 进行中工作
    description: 列出正在进行但尚未完成的工作，每项占一行
    required: false
    placeholder: |
      例如：
      - 正在开发支付功能
      - 正在进行系统测试
  - id: nextPlan
    name: nextPlan
    type: textarea
    label: 下一周期计划
    description: 列出下一周期计划完成的工作，每项占一行
    required: true
    placeholder: |
      例如：
      - 完成支付功能开发
      - 进行用户验收测试
      - 准备上线部署
  - id: issuesChallenges
    name: issuesChallenges
    type: textarea
    label: 问题与挑战
    description: 列出遇到的问题或挑战，每项占一行
    required: false
    placeholder: |
      例如：
      - 第三方API不稳定
      - 测试环境资源不足
  - id: achievements
    name: achievements
    type: textarea
    label: 主要成果/亮点
    description: 列出本周期的主要成果或亮点工作，每项占一行
    required: false
    placeholder: |
      例如：
      - 提前完成Q4目标
      - 用户满意度提升20%
  - id: reportStyle
    name: reportStyle
    type: select
    label: 报告风格
    description: 选择报告的整体风格
    required: true
    default: standard
    options:
      - standard: 标准格式
      - concise: 简洁版本
      - detailed: 详细版本
      - formal: 正式汇报
---

## 周报/月报生成器

### 功能描述
专业的工作总结报告生成助手，支持周报、月报和季度报告，帮助您快速生成高质量的工作汇报。

### 输入参数
- **报告类型**：周报、月报或季度报告
- **报告周期**：报告的时间范围
- **汇报人姓名**：填写姓名
- **所属部门**：部门或团队信息
- **已完成工作**：本周期的主要成就
- **进行中工作**：正在进行的任务
- **下一周期计划**：下一步的工作计划
- **问题与挑战**：遇到的困难（可选）
- **主要成果/亮点**：重点突出的成果（可选）
- **报告风格**：选择合适的报告风格

### 提示词模板

你是一位专业的工作报告撰写专家，请根据以下信息生成一份高质量的工作{{reportType}}：

报告类型：{{reportType}}
报告周期：{{reportPeriod}}
汇报人：{{reporterName}}
部门：{{department}}
已完成工作：
{{completedWork}}
进行中工作：
{{ongoingWork}}
下一周期计划：
{{nextPlan}}
问题与挑战：
{{issuesChallenges}}
主要成果/亮点：
{{achievements}}
报告风格：{{reportStyle}}

请按照以下要求生成报告：

1. 开头要有适当的问候和引言
2. 清晰列出已完成的工作内容，可适当补充细节说明
3. 说明进行中工作的当前状态和预计完成时间
4. 明确下一周期的工作计划和目标
5. 如有问题和挑战，要客观描述并可提出解决方案建议
6. 突出展示主要成果和亮点工作
7. 结尾要有总结和展望

根据{{reportStyle}}选择合适的风格：
- standard: 标准完整格式，适合常规汇报
- concise: 简洁明了，重点突出
- detailed: 详细具体，内容丰富
- formal: 正式规范，适合向上级汇报

报告应该：
- 结构清晰，层次分明
- 内容完整，重点突出
- 语言简洁，表达准确
- 积极向上，客观真实
- 格式规范，易于阅读

### 输出格式

请按照以下结构生成报告：

# [报告类型]：[报告周期]

## 基本信息
- **汇报人**：[姓名]
- **部门**：[部门]
- **报告周期**：[周期]
- **提交日期**：[日期]

## 一、工作概述
[简要概述本周期的整体工作情况]

## 二、已完成工作
1. [工作1]：[详细说明，可包括成果、数据等]
2. [工作2]：[详细说明]
...

## 三、进行中工作
1. [工作1]：[当前状态 + 预计完成时间]
2. [工作2]：[当前状态 + 预计完成时间]
...

## 四、下一周期计划
1. [计划1]：[目标 + 时间节点]
2. [计划2]：[目标 + 时间节点]
...

## 五、问题与挑战
- [问题1]：[描述 + 建议方案]
- [问题2]：[描述 + 建议方案]
...

## 六、主要成果/亮点
- [成果1]：[具体说明 + 数据支撑]
- [成果2]：[具体说明 + 数据支撑]
...

## 七、总结与展望
[总结本周期工作，展望下一周期]

---

汇报人：[姓名]
日期：[日期]

### 示例

**输入**：
- 报告类型：周报
- 报告周期：2024年第2周
- 汇报人姓名：李四
- 所属部门：产品研发部
- 已完成工作：
  - 完成用户登录注册功能开发
  - 优化了首页加载性能，提升40%
  - 修复了10个高优先级bug
  - 完成了API文档的编写
- 进行中工作：
  - 正在开发支付功能模块，完成度70%
  - 正在进行第一阶段的集成测试
- 下一周期计划：
  - 完成支付功能开发和测试
  - 进行用户验收测试
  - 准备系统上线部署
- 问题与挑战：
  - 第三方支付接口文档不清晰，沟通成本较高
- 主要成果/亮点：
  - 提前完成用户功能开发，比计划提前2天
  - 首页性能优化获得产品经理好评
- 报告风格：标准格式

**输出**：

# 周报：2024年第2周

## 基本信息
- **汇报人**：李四
- **部门**：产品研发部
- **报告周期**：2024年第2周（1月8日-1月12日）
- **提交日期**：2024年1月12日

## 一、工作概述
本周主要围绕用户系统和性能优化开展工作，整体进度符合预期，部分任务提前完成。团队协作顺畅，有效推进了项目进展。

## 二、已完成工作
1. **用户登录注册功能**：完成了完整的用户认证系统开发，包括手机号/邮箱登录、密码找回、第三方登录等功能，代码已提交并通过代码审查。
2. **首页性能优化**：通过图片懒加载、代码分割、缓存优化等手段，将首页加载时间从5秒降低到3秒，性能提升40%，获得产品经理的高度认可。
3. **Bug修复**：本周共修复了10个高优先级bug，主要集中在用户体验和数据一致性问题上，系统稳定性明显提升。
4. **API文档编写**：完成了v1版本API文档的编写和整理，包括接口说明、请求参数、响应格式等，方便前后端协作和后续维护。

## 三、进行中工作
1. **支付功能模块**：当前开发完成度70%，已完成支付流程的核心逻辑，预计下周三前完成剩余开发工作。
2. **第一阶段集成测试**：已开始进行核心功能模块的集成测试，预计下周五完成全部测试用例。

## 四、下一周期计划
1. **完成支付功能**：1月17日前完成支付功能的开发、测试和联调，确保支付流程顺畅。
2. **用户验收测试**：1月18日-1月19日配合产品和测试团队进行用户验收测试。
3. **系统上线准备**：1月20日前完成上线前的各项准备工作，包括环境配置、数据迁移方案、回滚预案等。

## 五、问题与挑战
- **第三方支付接口问题**：支付接口文档不够清晰，部分字段说明模糊，与第三方技术团队沟通成本较高。建议：安排专人持续跟进沟通，必要时申请技术支持会议。

## 六、主要成果/亮点
- **提前完成用户功能**：用户系统功能比原计划提前2天完成，为后续工作争取了宝贵时间。
- **首页性能显著提升**：通过技术优化，首页加载性能提升40%，用户体验得到明显改善，获得产品团队的书面表扬。

## 七、总结与展望
本周工作整体顺利，在团队成员的共同努力下，我们不仅按时完成了既定目标，还在性能优化方面取得了突破。下周我们将重点推进支付功能和上线准备工作，确保项目按计划交付。同时，我们也会继续关注系统性能和用户体验，持续优化产品质量。

---

汇报人：李四
日期：2024年1月12日
