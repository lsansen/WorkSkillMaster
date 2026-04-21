import React from 'react'
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework'

const MeetingNotesExpert: React.FC = () => {
  const skillPackage = {
    id: 'meeting-notes-expert',
    name: '会议纪要专家',
    description: '智能会议纪要生成专家，支持音频上传和文字输入，快速生成结构化会议纪要',
    category: 'general',
    version: '1.0.0',
    author: '系统',
    tags: ['会议', '纪要', '整理', '音频'],
    parameters: [
      {
        id: 'inputMethod',
        name: 'inputMethod',
        type: 'select',
        label: '输入方式',
        description: '选择输入会议内容的方式',
        required: true,
        default: 'text',
        options: [
          { 'text': '文字输入' },
          { 'file': '文件上传' }
        ]
      },
      {
        id: 'meetingTitle',
        name: 'meetingTitle',
        type: 'text',
        label: '会议主题/标题',
        description: '会议的主题或标题',
        required: true,
        placeholder: '例如：Q4项目进度评审会议'
      },
      {
        id: 'meetingDate',
        name: 'meetingDate',
        type: 'date',
        label: '会议日期',
        description: '会议举办的日期',
        required: true
      },
      {
        id: 'participants',
        name: 'participants',
        type: 'text',
        label: '参会人员',
        description: '参会人员名单，用逗号分隔',
        required: true,
        placeholder: '例如：张三, 李四, 王五'
      },
      {
        id: 'meetingLocation',
        name: 'meetingLocation',
        type: 'text',
        label: '会议地点',
        description: '会议举办的地点或线上会议链接',
        required: false,
        placeholder: '例如：会议室A，或 Zoom链接'
      },
      {
        id: 'meetingContent',
        name: 'meetingContent',
        type: 'textarea',
        label: '会议内容（文字输入）',
        description: '会议的主要讨论内容和要点',
        required: false,
        placeholder: '请详细描述会议讨论的内容，或列出要点：\n- 讨论了什么问题\n- 做出了什么决定\n- 有什么后续行动'
      },
      {
        id: 'audioFile',
        name: 'audioFile',
        type: 'file',
        label: '会议录音（文件上传）',
        description: '上传会议录音文件（支持mp3格式）',
        required: false
      },
      {
        id: 'notesStyle',
        name: 'notesStyle',
        type: 'select',
        label: '纪要风格',
        description: '选择会议纪要的格式风格',
        required: true,
        default: 'standard',
        options: [
          { 'standard': '标准格式' },
          { 'concise': '简洁版本' },
          { 'detailed': '详细版本' },
          { 'action': '行动导向' }
        ]
      }
    ]
  };

  const handleGenerate = async (params: any): Promise<string> => {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const notesStyleText = {
      'standard': '标准格式',
      'concise': '简洁版本',
      'detailed': '详细版本',
      'action': '行动导向'
    }[params.notesStyle] || '标准格式';

    const contentPoints = params.meetingContent ? 
      params.meetingContent.split('\n').filter(Boolean) : 
      ['- 讨论了项目相关事宜\n- 确定了下一步行动计划'];

    return `# 会议纪要：${params.meetingTitle}

## 基本信息
- **会议主题**：${params.meetingTitle}
- **会议日期**：${params.meetingDate}
- **会议地点**：${params.meetingLocation || '待定'}
- **记录人**：AI助手

## 参会人员
${params.participants}

## 会议议程
1. 项目当前进度回顾
2. 关键问题讨论
3. 决议事项确定
4. 后续行动安排
5. 下次会议规划

## 讨论要点
${contentPoints.map((point: string, index: number) => `- **要点${index + 1}**：${point.replace(/^[-*•]\s*/, '')`).join('\n')}

## 决议事项
1. 确定了项目推进的方向和目标
2. 明确了各团队的分工和职责
3. 制定了具体的时间节点和里程碑

## 后续行动
| 行动事项 | 负责人 | 截止日期 | 备注 |
|---------|--------|---------|------|
| 跟进项目进度 | 待定 | ${params.meetingDate}后一周 | 每周汇报 |
| 落实决议事项 | 各负责人 | 按计划执行 | 及时同步 |

## 下次会议安排
- **时间**：待定
- **地点**：${params.meetingLocation || '待定'}
- **议题**：进度跟进与问题讨论

---

（注：这是由AI助手生成的${notesStyleText}会议纪要，建议根据实际情况进行调整和完善。）`;
  };

  return (
    <SkillPackageFramework
      skillPackage={skillPackage}
      onGenerate={handleGenerate}
    />
  );
};

export default MeetingNotesExpert;
