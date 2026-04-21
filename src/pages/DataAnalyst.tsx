import React, { useState } from 'react'
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework'

const DataAnalyst: React.FC = () => {
  const [dataPreview, setDataPreview] = useState<string>('');

  const skillPackage = {
    id: 'data-analyst',
    name: '数据分析师',
    description: '智能数据分析助手，支持Excel/CSV文件上传和数据可视化',
    category: 'general',
    version: '1.0.0',
    author: '系统',
    tags: ['数据', '分析', '可视化', 'Excel', 'CSV'],
    parameters: [
      {
        id: 'analysisType',
        name: 'analysisType',
        type: 'select',
        label: '分析类型',
        description: '选择要进行的数据分析类型',
        required: true,
        default: 'exploratory',
        options: [
          { 'exploratory': '探索性分析' },
          { 'descriptive': '描述性分析' },
          { 'predictive': '预测性分析' },
          { 'comparative': '比较分析' },
          { 'trend': '趋势分析' }
        ]
      },
      {
        id: 'dataSource',
        name: 'dataSource',
        type: 'select',
        label: '数据源',
        description: '选择数据来源',
        required: true,
        default: 'file',
        options: [
          { 'file': '文件上传' },
          { 'manual': '手动输入' }
        ]
      },
      {
        id: 'dataFile',
        name: 'dataFile',
        type: 'file',
        label: '数据文件',
        description: '上传Excel或CSV文件',
        required: false
      },
      {
        id: 'manualData',
        name: 'manualData',
        type: 'textarea',
        label: '手动输入数据',
        description: '手动输入数据，每行一条，用逗号分隔',
        required: false,
        placeholder: '例如：\n日期,销售额,利润\n2024-01-01,1000,200\n2024-01-02,1200,240\n2024-01-03,900,180'
      },
      {
        id: 'analysisGoal',
        name: 'analysisGoal',
        type: 'textarea',
        label: '分析目标',
        description: '描述您的分析目标和关注的问题',
        required: true,
        placeholder: '例如：\n- 分析销售趋势\n- 识别高利润产品\n- 找出销售低谷期\n- 预测未来销售趋势'
      },
      {
        id: 'chartType',
        name: 'chartType',
        type: 'select',
        label: '图表类型',
        description: '选择要生成的图表类型',
        required: true,
        default: 'auto',
        options: [
          { 'auto': '自动选择' },
          { 'line': '折线图' },
          { 'bar': '柱状图' },
          { 'pie': '饼图' },
          { 'scatter': '散点图' },
          { 'heatmap': '热力图' }
        ]
      },
      {
        id: 'outputFormat',
        name: 'outputFormat',
        type: 'select',
        label: '输出格式',
        description: '选择分析报告的输出格式',
        required: true,
        default: 'detailed',
        options: [
          { 'detailed': '详细报告' },
          { 'summary': '简要摘要' },
          { 'technical': '技术分析' }
        ]
      }
    ]
  };

  const parseCSVData = (data: string): { headers: string[], rows: string[][] } => {
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
    return { headers, rows };
  };

  const handleGenerate = async (params: any): Promise<string> => {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let data = '';
    if (params.dataSource === 'file' && params.dataFile) {
      // 模拟文件解析
      data = '日期,销售额,利润\n2024-01-01,1000,200\n2024-01-02,1200,240\n2024-01-03,900,180\n2024-01-04,1500,300\n2024-01-05,1300,260';
    } else if (params.dataSource === 'manual' && params.manualData) {
      data = params.manualData;
    } else {
      // 默认数据
      data = '日期,销售额,利润\n2024-01-01,1000,200\n2024-01-02,1200,240\n2024-01-03,900,180\n2024-01-04,1500,300\n2024-01-05,1300,260';
    }

    const { headers, rows } = parseCSVData(data);
    const dataSize = rows.length;
    const numericFields = headers.filter(header => {
      return rows.every(row => !isNaN(parseFloat(row[headers.indexOf(header)])));
    });

    const analysisTypeText = {
      'exploratory': '探索性分析',
      'descriptive': '描述性分析',
      'predictive': '预测性分析',
      'comparative': '比较分析',
      'trend': '趋势分析'
    }[params.analysisType] || '探索性分析';

    const chartTypeText = {
      'auto': '自动选择',
      'line': '折线图',
      'bar': '柱状图',
      'pie': '饼图',
      'scatter': '散点图',
      'heatmap': '热力图'
    }[params.chartType] || '自动选择';

    const outputFormatText = {
      'detailed': '详细报告',
      'summary': '简要摘要',
      'technical': '技术分析'
    }[params.outputFormat] || '详细报告';

    return `# 数据分析报告

## 1. 分析概述
- **分析类型**：${analysisTypeText}
- **分析目标**：${params.analysisGoal.replace(/\n/g, '\n- ')}
- **数据规模**：${dataSize}条记录，${headers.length}个字段
- **分析工具**：AI数据分析助手

## 2. 数据概览
- **数据结构**：包含${headers.join('、')}等字段
- **数据质量**：数据完整，无缺失值
- **基本统计**：
  ${numericFields.map(field => {
    const values = rows.map(row => parseFloat(row[headers.indexOf(field)]));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return `  - ${field}：平均值 ${avg.toFixed(2)}，最小值 ${min}，最大值 ${max}`;
  }).join('\n')}

## 3. 分析发现
### 3.1 主要发现
- 数据整体呈现${params.analysisType === 'trend' ? '上升' : '稳定'}趋势
- ${numericFields.length > 0 ? `${numericFields[0]}的波动范围较大，从${Math.min(...rows.map(r => parseFloat(r[0])))}到${Math.max(...rows.map(r => parseFloat(r[0])))}` : '数据分布较为均匀'}
- ${params.analysisType === 'comparative' ? '不同类别的数据存在显著差异' : '数据之间存在较强的相关性'}

### 3.2 详细分析
通过对${dataSize}条数据记录的分析，我们发现${params.analysisType === 'trend' ? '数据随时间呈现明显的变化趋势' : '数据分布符合预期模式'}。特别是在${rows.length > 2 ? rows[Math.floor(rows.length/2)][0] : '中间时期'}，${numericFields.length > 0 ? `${numericFields[0]}` : '数据'}达到了${params.analysisType === 'trend' ? '峰值' : '平均值'}。

## 4. 图表展示
![${chartTypeText}]
- ${chartTypeText}清晰展示了数据的${params.analysisType === 'trend' ? '变化趋势' : '分布情况'}
- 可以看到${numericFields.length > 0 ? numericFields[0] : '数据'}的${params.analysisType === 'trend' ? '波动' : '分布'}特征
- ${params.analysisType === 'comparative' ? '不同类别的对比清晰可见' : '数据模式一目了然'}

## 5. 结论与建议
- **结论**：${params.analysisType === 'trend' ? '数据呈现明显的变化趋势，需要关注波动原因' : '数据分布合理，符合预期模式'}
- **建议**：
  1. 进一步分析${numericFields.length > 0 ? numericFields[0] : '数据'}的${params.analysisType === 'trend' ? '变化原因' : '分布特征'}
  2. 建立${params.analysisType === 'predictive' ? '预测模型' : '监控机制'}，及时发现异常
  3. 结合业务场景，制定相应的${params.analysisType === 'comparative' ? '优化策略' : '改进措施'}
- **下一步**：收集更多数据，进行更深入的分析

## 6. 技术说明
- **分析方法**：${analysisTypeText}
- **图表类型**：${chartTypeText}
- **数据处理**：基本数据清洗和统计分析

（注：这是由AI助手生成的${outputFormatText}，建议根据实际情况进行调整和完善。）`;
  };

  return (
    <SkillPackageFramework
      skillPackage={skillPackage}
      onGenerate={handleGenerate}
    />
  );
};

export default DataAnalyst;
