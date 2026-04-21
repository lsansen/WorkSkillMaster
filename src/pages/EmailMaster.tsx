import React from 'react';
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework';

const EmailMaster: React.FC = () => {
  const skillPackage = {
    id: 'email-master',
    name: '智能邮件大师',
    description: '智能邮件写作助手，支持多种场景和语气的专业邮件生成',
    category: 'general',
    version: '1.0.0',
    author: '系统',
    tags: ['邮件', '写作', '商务', '沟通'],
    parameters: [
      {
        id: 'emailType',
        name: 'emailType',
        type: 'select',
        label: '邮件类型',
        description: '选择要写的邮件类型',
        required: true,
        default: 'formal',
        options: [
          { 'formal': '正式商务邮件' },
          { 'friendly': '友好问候邮件' },
          { 'request': '请求/申请邮件' },
          { 'apology': '道歉邮件' },
          { 'thankyou': '感谢邮件' },
          { 'followup': '跟进邮件' }
        ]
      },
      {
        id: 'recipient',
        name: 'recipient',
        type: 'text',
        label: '收件人信息',
        description: '收件人姓名、职位或公司',
        required: true,
        placeholder: '例如：张三 经理，或 ABC公司'
      },
      {
        id: 'subject',
        name: 'subject',
        type: 'text',
        label: '邮件主题',
        description: '邮件的核心主题',
        required: true,
        placeholder: '简要概括邮件内容'
      },
      {
        id: 'contentPoints',
        name: 'contentPoints',
        type: 'textarea',
        label: '邮件内容要点',
        description: '列出邮件需要包含的要点，每个要点占一行',
        required: true,
        placeholder: '例如：\n- 说明项目延期的原因\n- 提出新的时间安排\n- 表达歉意并请求理解'
      },
      {
        id: 'tone',
        name: 'tone',
        type: 'select',
        label: '语气风格',
        description: '选择邮件的整体语气',
        required: true,
        default: 'professional',
        options: [
          { 'professional': '专业正式' },
          { 'friendly': '友好亲切' },
          { 'urgent': '紧急重要' },
          { 'casual': '轻松随意' }
        ]
      },
      {
        id: 'signature',
        name: 'signature',
        type: 'textarea',
        label: '签名信息',
        description: '您的姓名、职位等签名信息',
        required: false,
        placeholder: '例如：\n李四\n项目经理\n联系电话：138-xxxx-xxxx'
      }
    ]
  };

  const handleGenerate = async (params: any): Promise<string> => {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const emailTypeText = {
      'formal': '正式商务邮件',
      'friendly': '友好问候邮件',
      'request': '请求/申请邮件',
      'apology': '道歉邮件',
      'thankyou': '感谢邮件',
      'followup': '跟进邮件'
    }[params.emailType] || '正式商务邮件';

    const toneText = {
      'professional': '专业正式',
      'friendly': '友好亲切',
      'urgent': '紧急重要',
      'casual': '轻松随意'
    }[params.tone] || '专业正式';

    return `尊敬的${params.recipient}：

您好！

这是一封关于"${params.subject}"的${emailTypeText}。

${params.contentPoints.split('\n').filter(Boolean).map((point: string, index: number) => `${index + 1}. ${point.replace(/^[-*•]\s*/, '')}`).join('\n')}

以上是本次邮件的主要内容。如果您有任何疑问或需要进一步的讨论，请随时与我联系。

感谢您的时间和关注！

此致
敬礼！

${params.signature || '[请在此处添加您的签名]'}

（注：这是由AI助手生成的${toneText}风格的邮件，您可以根据实际需要进行调整。）`;
  };

  return (
    <SkillPackageFramework
      skillPackage={skillPackage}
      onGenerate={handleGenerate}
    />
  );
};

export default EmailMaster;
