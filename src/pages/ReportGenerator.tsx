import React from 'react';
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework';

const ReportGenerator: React.FC = () => {
  const skillPackage = {
    id: 'report-generator',
    name: '周报/月报生成器',
    description: '智能周报和月报生成助手，快速生成专业的工作总结报告',
    category: 'general',
    version: '1.0.0',
    author: '系统',
    tags: ['报告', '周报', '月报', '总结'],
    parameters: [
      {
        id: 'reportType',
        name: 'reportType',
        type: 'select',
        label: '报告类型',
        description: '选择要生成的报告类型',
        required: true,
        default: 'weekly',
        options: [
          { 'weekly': '周报' },
          { 'monthly': '月报' },
          { 'quarterly': '季度报告' }
        ]
      },
      {
        id: 'reportPeriod',
        name: 'reportPeriod',
        type: 'text',
        label: '报告周期',
        description: '报告的时间周期',
        required: true,
        placeholder: '例如：2024年第1周 或 2024年1月'
      },
      {
        id: 'reporterName',
        name: 'reporterName',
        type: 'text',
        label: '汇报人姓名',
        description: '填写汇报人的姓名',
        required: true,
        placeholder: '例如：张三'
      },
      {
        id: 'department',
        name: 'department',
        type: 'text',
        label: '所属部门',
        description: '填写所属部门或团队',
        required: true,
        placeholder: '例如：产品研发部'
      },
      {
        id: 'completedWork',
        name: 'completedWork',
        type: 'textarea',
        label: '已完成工作',
        description: '列出本周期已完成的主要工作，每项占一行',
        required: true,
        placeholder: '例如：\n- 完成用户登录功能开发\n- 优化了首页加载性能\n- 修复了10个bug'
      },
      {
        id: 'ongoingWork',
        name: 'ongoingWork',
        type: 'textarea',
        label: '进行中工作',
        description: '列出正在进行但尚未完成的工作，每项占一行',
        required: false,
        placeholder: '例如：\n- 正在开发支付功能\n- 正在进行系统测试'
      },
      {
        id: 'nextPlan',
        name: 'nextPlan',
        type: 'textarea',
        label: '下一周期计划',
        description: '列出下一周期计划完成的工作，每项占一行',
        required: true,
        placeholder: '例如：\n- 完成支付功能开发\n- 进行用户验收测试\n- 准备上线部署'
      },
      {
        id: 'issuesChallenges',
        name: 'issuesChallenges',
        type: 'textarea',
        label: '问题与挑战',
        description: '列出遇到的问题或挑战，每项占一行',
        required: false,
        placeholder: '例如：\n- 第三方API不稳定\n- 测试环境资源不足'
      },
      {
        id: 'achievements',
        name: 'achievements',
        type: 'textarea',
        label: '主要成果/亮点',
        description: '列出本周期的主要成果或亮点工作，每项占一行',
        required: false,
        placeholder: '例如：\n- 提前完成Q4目标\n- 用户满意度提升20%'
      },
      {
        id: 'reportStyle',
        name: 'reportStyle',
        type: 'select',
        label: '报告风格',
        description: '选择报告的整体风格',
        required: true,
        default: 'standard',
        options: [
          { 'standard': '标准格式' },
          { 'concise': '简洁版本' },
          { 'detailed': '详细版本' },
          { 'formal': '正式汇报' }
        ]
      }
    ]
  };

  const handleGenerate = async (params: any): Promise<string> => {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportTypeText = {
      'weekly': '周报',
      'monthly': '月报',
      'quarterly': '季度报告'
    }[params.reportType] || '周报';

    const reportStyleText = {
      'standard': '标准格式',
      'concise': '简洁版本',
      'detailed': '详细版本',
      'formal': '正式汇报'
    }[params.reportStyle] || '标准格式';

    const completedWorks = params.completedWork.split('\n').filter(Boolean);
    const ongoingWorks = params.ongoingWork ? params.ongoingWork.split('\n').filter(Boolean) : [];
    const nextPlans = params.nextPlan.split('\n').filter(Boolean);
    const issues = params.issuesChallenges ? params.issuesChallenges.split('\n').filter(Boolean) : [];
    const achievementsList = params.achievements ? params.achievements.split('\n').filter(Boolean) : [];

    return `# ${reportTypeText}：${params.reportPeriod}

## 基本信息
- **汇报人**：${params.reporterName}
- **部门**：${params.department}
- **报告周期**：${params.reportPeriod}
- **提交日期**：${new Date().toLocaleDateString('zh-CN')}

## 一、工作概述
本周期工作按计划有序推进，各项任务进展顺利，${completedWorks.length > 0 ? `共完成${completedWorks.length}项主要工作` : ''}。整体工作符合预期目标。

## 二、已完成工作
${completedWorks.map((work: string, index: number) => `${index + 1}. ${work.replace(/^[-*•]\s*/, '')}`).join('\n')}

## 三、进行中工作
${ongoingWorks.length > 0 ? 
  ongoingWorks.map((work: string, index: number) => `${index + 1}. ${work.replace(/^[-*•]\s*/, '')}：进行中，预计下一周期完成`).join('\n') : 
  '暂无进行中的工作'}

## 四、下一周期计划
${nextPlans.map((plan: string, index: number) => `${index + 1}. ${plan.replace(/^[-*•]\s*/, '')}`).join('\n')}

## 五、问题与挑战
${issues.length > 0 ? 
  issues.map((issue: string, index: number) => `- ${issue.replace(/^[-*•]\s*/, '')}：已制定应对方案，持续跟进中`).join('\n') : 
  '本周期未遇到重大问题或挑战'}

## 六、主要成果/亮点
${achievementsList.length > 0 ? 
  achievementsList.map((achievement: string, index: number) => `- ${achievement.replace(/^[-*•]\s*/, '')}`).join('\n') : 
  '各项工作按计划推进，团队协作顺畅'}

## 七、总结与展望
本周期工作整体进展顺利，在团队成员的共同努力下，我们完成了既定目标。下一周期，我们将继续按计划推进各项工作，确保项目按时高质量交付。

---

汇报人：${params.reporterName}
日期：${new Date().toLocaleDateString('zh-CN')}

（注：这是由AI助手生成的${reportStyleText}${reportTypeText}，建议根据实际情况进行调整和完善。）`;
  };

  return (
    <SkillPackageFramework
      skillPackage={skillPackage}
      onGenerate={handleGenerate}
    />
  );
};

export default ReportGenerator;
