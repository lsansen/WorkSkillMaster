import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SkillPackage {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  tags: string[];
}

const CustomSkills: React.FC = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillPackage | null>(null);

  useEffect(() => {
    // 模拟加载技能包数据
    setTimeout(() => {
      setSkills([
        {
          id: 'email-master',
          name: '智能邮件大师',
          description: '智能邮件写作助手，支持多种场景和语气的专业邮件生成',
          category: 'general',
          version: '1.0.0',
          author: '系统',
          tags: ['邮件', '写作', '商务', '沟通']
        },
        {
          id: 'meeting-notes-expert',
          name: '会议纪要专家',
          description: '智能会议纪要生成专家，支持音频上传和文字输入',
          category: 'general',
          version: '1.0.0',
          author: '系统',
          tags: ['会议', '纪要', '整理', '音频']
        },
        {
          id: 'report-generator',
          name: '周报/月报生成器',
          description: '智能周报和月报生成助手，快速生成专业的工作总结报告',
          category: 'general',
          version: '1.0.0',
          author: '系统',
          tags: ['报告', '周报', '月报', '总结']
        },
        {
          id: 'ppt-outline',
          name: 'PPT大纲设计师',
          description: '智能PPT大纲生成助手，帮助你快速创建专业的演示文稿结构',
          category: 'general',
          version: '1.0.0',
          author: '系统',
          tags: ['PPT', '演示', '大纲', '设计']
        },
        {
          id: 'data-analyst',
          name: '数据分析师',
          description: '智能数据分析助手，支持Excel/CSV文件上传和数据可视化',
          category: 'general',
          version: '1.0.0',
          author: '系统',
          tags: ['数据', '分析', '可视化', 'Excel', 'CSV']
        },
        {
          id: 'task-management',
          name: '任务拆解与时间管理大师',
          description: '智能任务拆解与时间管理助手，帮助你将复杂任务分解为可执行步骤并合理安排时间',
          category: 'general',
          version: '1.0.0',
          author: '系统',
          tags: ['任务', '时间管理', '项目管理', '计划', '效率']
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateSkill = () => {
    setEditingSkill(null);
    setShowCreateModal(true);
  };

  const handleEditSkill = (skill: SkillPackage) => {
    setEditingSkill(skill);
    setShowCreateModal(true);
  };

  const handleDeleteSkill = (skillId: string) => {
    if (window.confirm('确定要删除这个技能包吗？')) {
      setSkills(skills.filter(skill => skill.id !== skillId));
    }
  };

  const handleImportSkill = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // 这里可以解析导入的Markdown文件
          alert('技能包导入功能开发中...');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportSkill = (skill: SkillPackage) => {
    // 生成Markdown文件内容
    const markdownContent = `---
id: ${skill.id}
name: ${skill.name}
version: ${skill.version}
author: ${skill.author}
category: ${skill.category}
description: ${skill.description}
createdAt: ${new Date().toISOString()}
updatedAt: ${new Date().toISOString()}
tags:
${skill.tags.map(tag => `  - ${tag}`).join('\n')}
modelRequirements:
  - type: local
    modelType: text
    minTokens: 1000
    recommendedModels:
      - llama3:8b
    fallbackEnabled: true
parameters:
  - id: example
    name: example
    type: text
    label: 示例参数
    description: 这是一个示例参数
    required: true
    placeholder: 请输入示例内容
---

## ${skill.name}

### 功能描述
${skill.description}

### 输入参数
- **示例参数**：这是一个示例参数

### 提示词模板

你是一位专业的助手，请根据以下信息生成内容：

示例参数：{{example}}

请生成相关内容。
`;
    
    // 下载文件
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          技能包管理
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={handleImportSkill}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            导入
          </button>
          <button 
            onClick={handleCreateSkill}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            新建技能包
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  技能包名称
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  描述
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  分类
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  标签
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {skill.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      v{skill.version}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-white">
                      {skill.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                      {skill.category === 'general' ? '通用' : skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {skill.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleExportSkill(skill)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      >
                        导出
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingSkill ? '编辑技能包' : '创建技能包'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  技能包名称
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="输入技能包名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  描述
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="输入技能包描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  分类
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="general">通用</option>
                  <option value="professional">专业</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标签
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="输入标签，用逗号分隔"
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-3"
                >
                  取消
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  {editingSkill ? '更新' : '创建'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSkills;
