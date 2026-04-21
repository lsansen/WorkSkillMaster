---
id: data-analyst
name: 数据分析师
version: 1.0.0
author: 系统
category: general
description: 智能数据分析助手，支持Excel/CSV文件上传和数据可视化
createdAt: 2024-01-16T00:00:00Z
updatedAt: 2024-01-16T00:00:00Z
tags:
  - 数据
  - 分析
  - 可视化
  - Excel
  - CSV
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
  - id: analysisType
    name: analysisType
    type: select
    label: 分析类型
    description: 选择要进行的数据分析类型
    required: true
    default: 'exploratory'
    options:
      - 'exploratory': 探索性分析
      - 'descriptive': 描述性分析
      - 'predictive': 预测性分析
      - 'comparative': 比较分析
      - 'trend': 趋势分析
  - id: dataSource
    name: dataSource
    type: select
    label: 数据源
    description: 选择数据来源
    required: true
    default: 'file'
    options:
      - 'file': 文件上传
      - 'manual': 手动输入
  - id: dataFile
    name: dataFile
    type: file
    label: 数据文件
    description: 上传Excel或CSV文件
    required: false
  - id: manualData
    name: manualData
    type: textarea
    label: 手动输入数据
    description: 手动输入数据，每行一条，用逗号分隔
    required: false
    placeholder: |
      例如：
      日期,销售额,利润
      2024-01-01,1000,200
      2024-01-02,1200,240
      2024-01-03,900,180
  - id: analysisGoal
    name: analysisGoal
    type: textarea
    label: 分析目标
    description: 描述您的分析目标和关注的问题
    required: true
    placeholder: |
      例如：
      - 分析销售趋势
      - 识别高利润产品
      - 找出销售低谷期
      - 预测未来销售趋势
  - id: chartType
    name: chartType
    type: select
    label: 图表类型
    description: 选择要生成的图表类型
    required: true
    default: 'auto'
    options:
      - 'auto': 自动选择
      - 'line': 折线图
      - 'bar': 柱状图
      - 'pie': 饼图
      - 'scatter': 散点图
      - 'heatmap': 热力图
  - id: outputFormat
    name: outputFormat
    type: select
    label: 输出格式
    description: 选择分析报告的输出格式
    required: true
    default: 'detailed'
    options:
      - 'detailed': 详细报告
      - 'summary': 简要摘要
      - 'technical': 技术分析
---

## 数据分析师

### 功能描述
智能数据分析助手，支持Excel/CSV文件上传和数据可视化，帮助你快速分析数据并生成专业的分析报告。

### 输入参数
- **分析类型**：选择分析的类型
- **数据源**：文件上传或手动输入
- **数据文件**：Excel或CSV文件
- **手动输入数据**：手动输入的数据
- **分析目标**：分析的目标和关注的问题
- **图表类型**：选择要生成的图表类型
- **输出格式**：分析报告的详细程度

### 提示词模板

你是一位专业的数据分析师，请根据以下信息为我进行数据分析并生成分析报告：

分析类型：{{analysisType}}
数据源：{{dataSource}}
分析目标：
{{analysisGoal}}
图表类型：{{chartType}}
输出格式：{{outputFormat}}

数据内容：
[数据将在这里插入]

请按照以下要求进行分析：

1. 数据质量检查和预处理
2. 数据描述性统计分析
3. 针对分析目标进行深入分析
4. 生成合适的图表和可视化
5. 提供有洞察性的结论和建议

根据{{analysisType}}选择合适的分析方法：
- exploratory: 探索性分析，发现数据中的模式和异常
- descriptive: 描述性分析，总结数据的基本特征
- predictive: 预测性分析，基于历史数据预测未来趋势
- comparative: 比较分析，比较不同类别或时间段的数据
- trend: 趋势分析，分析数据随时间的变化趋势

根据{{chartType}}生成合适的图表：
- auto: 根据数据特性自动选择合适的图表类型
- line: 折线图，适合展示时间序列数据
- bar: 柱状图，适合比较不同类别的数据
- pie: 饼图，适合展示部分与整体的关系
- scatter: 散点图，适合展示两个变量之间的关系
- heatmap: 热力图，适合展示矩阵数据的密度

分析报告应该：
- 结构清晰，层次分明
- 数据准确，分析深入
- 图表美观，直观易懂
- 结论明确，建议实用
- 语言专业，表达清晰

### 输出格式

请按照以下结构生成分析报告：

# 数据分析报告

## 1. 分析概述
- **分析类型**：[分析类型]
- **分析目标**：[分析目标]
- **数据规模**：[数据量和维度]
- **分析工具**：AI数据分析助手

## 2. 数据概览
- **数据结构**：[数据字段和类型]
- **数据质量**：[数据完整性和一致性检查]
- **基本统计**：[关键指标的统计信息]

## 3. 分析发现
### 3.1 主要发现
- [发现1]
- [发现2]
- [发现3]

### 3.2 详细分析
[详细的分析内容，包括图表和数据支持]

## 4. 图表展示
[图表描述和分析]

## 5. 结论与建议
- **结论**：[主要结论]
- **建议**：[具体建议]
- **下一步**：[后续分析建议]

## 6. 技术说明
- **分析方法**：[使用的分析方法]
- **图表类型**：[使用的图表类型]
- **数据处理**：[数据处理步骤]

### 示例

**输入**：
- 分析类型：趋势分析
- 数据源：手动输入
- 手动输入数据：
  日期,销售额,利润
  2024-01-01,1000,200
  2024-01-02,1200,240
  2024-01-03,900,180
  2024-01-04,1500,300
  2024-01-05,1300,260
- 分析目标：分析销售趋势，找出销售高峰和低谷
- 图表类型：折线图
- 输出格式：详细报告

**输出**：

# 数据分析报告

## 1. 分析概述
- **分析类型**：趋势分析
- **分析目标**：分析销售趋势，找出销售高峰和低谷
- **数据规模**：5条记录，2个数值字段
- **分析工具**：AI数据分析助手

## 2. 数据概览
- **数据结构**：包含日期、销售额、利润三个字段
- **数据质量**：数据完整，无缺失值
- **基本统计**：
  - 平均销售额：1180
  - 平均利润：236
  - 销售额标准差：216.02
  - 利润标准差：43.21

## 3. 分析发现
### 3.1 主要发现
- 销售额整体呈现波动上升趋势
- 1月4日销售额达到峰值（1500）
- 1月3日销售额出现低谷（900）
- 利润与销售额保持稳定的20%比例

### 3.2 详细分析
通过对5天销售数据的分析，我们发现销售额在1月1日至1月5日期间呈现波动趋势。1月1日初始销售额为1000，1月2日上升至1200，1月3日下降至900，1月4日达到最高1500，1月5日回落至1300。

利润始终保持在销售额的20%左右，这表明利润率稳定，成本控制良好。

## 4. 图表展示
![销售趋势折线图]
- 折线图清晰展示了销售额和利润的变化趋势
- 可以看到1月4日是销售高峰，1月3日是销售低谷
- 利润曲线与销售额曲线高度一致

## 5. 结论与建议
- **结论**：销售趋势整体向上，利润率稳定，存在周期性波动
- **建议**：
  1. 分析1月3日销售低谷的原因，采取相应措施
  2. 分析1月4日销售高峰的成功因素，复制成功经验
  3. 建立销售预测模型，提前应对销售波动
- **下一步**：收集更长时间的数据进行分析，识别更长期的销售模式

## 6. 技术说明
- **分析方法**：时间序列趋势分析
- **图表类型**：折线图
- **数据处理**：基本数据清洗和统计分析
