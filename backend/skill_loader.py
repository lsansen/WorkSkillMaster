import os
import yaml
import markdown
from typing import Dict, List, Optional

class SkillPackage:
    def __init__(self, id: str, name: str, description: str, category: str, version: str, author: str, 
                 parameters: List[Dict], template: str, model_requirements: List[Dict], tags: List[str], enabled: bool):
        self.id = id
        self.name = name
        self.description = description
        self.category = category
        self.version = version
        self.author = author
        self.parameters = parameters
        self.template = template
        self.model_requirements = model_requirements
        self.tags = tags
        self.enabled = enabled

class SkillLoader:
    def __init__(self, skills_dir: str = "skills"):
        self.skills_dir = skills_dir
        self.skill_packages: Dict[str, SkillPackage] = {}
        self.load_skill_packages()

    def load_skill_packages(self):
        """加载所有技能包"""
        if not os.path.exists(self.skills_dir):
            os.makedirs(self.skills_dir)
            # 创建默认技能包
            self._create_default_skill_packages()
        
        for root, dirs, files in os.walk(self.skills_dir):
            for file in files:
                if file.endswith(".md"):
                    file_path = os.path.join(root, file)
                    try:
                        skill_package = self._load_skill_package(file_path)
                        if skill_package:
                            self.skill_packages[skill_package.id] = skill_package
                    except Exception as e:
                        print(f"Error loading skill package {file_path}: {e}")

    def _load_skill_package(self, file_path: str) -> Optional[SkillPackage]:
        """加载单个技能包"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 解析YAML front matter
        if content.startswith('---'):
            front_matter_end = content.find('---', 3)
            if front_matter_end != -1:
                front_matter = content[3:front_matter_end].strip()
                template = content[front_matter_end + 3:].strip()
                
                try:
                    data = yaml.safe_load(front_matter)
                    
                    # 验证必要字段
                    required_fields = ['id', 'name', 'version', 'author', 'category', 'description']
                    for field in required_fields:
                        if field not in data:
                            raise ValueError(f"Missing required field: {field}")
                    
                    # 处理可选字段
                    parameters = data.get('parameters', [])
                    model_requirements = data.get('modelRequirements', [])
                    tags = data.get('tags', [])
                    enabled = data.get('enabled', True)
                    
                    return SkillPackage(
                        id=data['id'],
                        name=data['name'],
                        description=data['description'],
                        category=data['category'],
                        version=data['version'],
                        author=data['author'],
                        parameters=parameters,
                        template=template,
                        model_requirements=model_requirements,
                        tags=tags,
                        enabled=enabled
                    )
                except yaml.YAMLError as e:
                    print(f"YAML parsing error in {file_path}: {e}")
                    return None
        return None

    def _create_default_skill_packages(self):
        """创建默认技能包"""
        default_skills = [
            {
                "id": "email-writer",
                "name": "邮件写作助手",
                "version": "1.0.0",
                "author": "系统",
                "category": "general",
                "description": "智能邮件写作助手，帮助你快速生成专业邮件",
                "tags": ["邮件", "写作", "商务"],
                "modelRequirements": [
                    {
                        "type": "local",
                        "modelType": "text",
                        "minTokens": 1000,
                        "recommendedModels": ["llama3:8b", "gemma:7b"],
                        "fallbackEnabled": True
                    },
                    {
                        "type": "cloud",
                        "modelType": "text",
                        "minTokens": 1000,
                        "recommendedModels": ["gpt-4", "gpt-3.5-turbo"],
                        "fallbackEnabled": True
                    }
                ],
                "parameters": [
                    {
                        "id": "recipient",
                        "name": "recipient",
                        "type": "text",
                        "label": "收件人",
                        "description": "邮件收件人",
                        "required": True,
                        "placeholder": "请输入收件人姓名或邮箱"
                    },
                    {
                        "id": "subject",
                        "name": "subject",
                        "type": "text",
                        "label": "邮件主题",
                        "description": "邮件的主题",
                        "required": True,
                        "placeholder": "请输入邮件主题"
                    },
                    {
                        "id": "content",
                        "name": "content",
                        "type": "textarea",
                        "label": "邮件内容要点",
                        "description": "请简要描述邮件的主要内容",
                        "required": True,
                        "placeholder": "请输入邮件内容要点，多个要点请换行"
                    },
                    {
                        "id": "tone",
                        "name": "tone",
                        "type": "select",
                        "label": "语气风格",
                        "description": "选择邮件的语气风格",
                        "required": True,
                        "default": "professional",
                        "options": [
                            {"professional": "专业正式"},
                            {"friendly": "友好亲切"},
                            {"urgent": "紧急重要"},
                            {"casual": "轻松随意"}
                        ]
                    }
                ],
                "template": "你是一位专业的邮件写作助手，请根据以下信息生成一封格式规范、语气专业的邮件：\n\n**收件人**：{{recipient}}\n**主题**：{{subject}}\n**内容要点**：\n{{content}}\n**语气风格**：{{tone}}\n\n请按照以下格式生成邮件：\n1. 开头问候语\n2. 简明扼要的正文内容\n3. 适当的结束语\n4. 发件人签名\n\n邮件应该：\n- 语言流畅，逻辑清晰\n- 符合职场邮件规范\n- 语气与选择的风格一致\n- 内容完整，涵盖所有要点"
            },
            {
                "id": "meeting-notes",
                "name": "会议纪要助手",
                "version": "1.0.0",
                "author": "系统",
                "category": "general",
                "description": "智能会议纪要生成助手，帮助你快速整理会议内容",
                "tags": ["会议", "纪要", "整理"],
                "modelRequirements": [
                    {
                        "type": "local",
                        "modelType": "text",
                        "minTokens": 1500,
                        "recommendedModels": ["llama3:8b"],
                        "fallbackEnabled": True
                    }
                ],
                "parameters": [
                    {
                        "id": "meeting_topic",
                        "name": "meeting_topic",
                        "type": "text",
                        "label": "会议主题",
                        "description": "会议的主题",
                        "required": True,
                        "placeholder": "请输入会议主题"
                    },
                    {
                        "id": "participants",
                        "name": "participants",
                        "type": "text",
                        "label": "参会人员",
                        "description": "参会人员列表",
                        "required": True,
                        "placeholder": "请输入参会人员，用逗号分隔"
                    },
                    {
                        "id": "meeting_content",
                        "name": "meeting_content",
                        "type": "textarea",
                        "label": "会议内容",
                        "description": "会议的主要内容",
                        "required": True,
                        "placeholder": "请输入会议内容要点，多个要点请换行"
                    },
                    {
                        "id": "meeting_date",
                        "name": "meeting_date",
                        "type": "text",
                        "label": "会议日期",
                        "description": "会议举行的日期",
                        "required": True,
                        "placeholder": "请输入会议日期，如2024-01-01"
                    }
                ],
                "template": "你是一位专业的会议纪要助手，请根据以下信息生成一份结构化的会议纪要：\n\n**会议主题**：{{meeting_topic}}\n**参会人员**：{{participants}}\n**会议日期**：{{meeting_date}}\n**会议内容**：\n{{meeting_content}}\n\n请按照以下格式生成会议纪要：\n1. 会议基本信息\n2. 参会人员\n3. 会议议程\n4. 讨论要点\n5. 决议事项\n6. 后续行动\n7. 下次会议安排\n\n会议纪要应该：\n- 结构清晰，层次分明\n- 内容完整，涵盖所有要点\n- 语言简洁，重点突出\n- 格式规范，便于阅读"
            }
        ]
        
        # 创建general目录
        general_dir = os.path.join(self.skills_dir, "general")
        os.makedirs(general_dir, exist_ok=True)
        
        for skill_data in default_skills:
            # 生成Markdown文件
            md_content = f"---\n"
            for key, value in skill_data.items():
                if key != "template":
                    if isinstance(value, (dict, list)):
                        md_content += f"{key}: {yaml.dump(value, default_flow_style=False)}"
                    else:
                        md_content += f"{key}: {value}\n"
            md_content += f"---\n\n## {skill_data['name']}\n\n### 功能描述\n{skill_data['description']}\n\n### 输入参数\n"
            
            for param in skill_data.get('parameters', []):
                md_content += f"- **{param['label']}**：{param['description']}\n"
            
            md_content += f"\n### 提示词模板\n\n{skill_data['template']}\n"
            
            file_path = os.path.join(general_dir, f"{skill_data['id']}.md")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(md_content)

    def get_skill_package(self, skill_id: str) -> Optional[SkillPackage]:
        """获取技能包"""
        return self.skill_packages.get(skill_id)

    def get_all_skill_packages(self) -> List[SkillPackage]:
        """获取所有技能包"""
        return list(self.skill_packages.values())

    def get_skill_packages_by_category(self, category: str) -> List[SkillPackage]:
        """按分类获取技能包"""
        return [sp for sp in self.skill_packages.values() if sp.category == category]

    def refresh_skill_packages(self):
        """刷新技能包"""
        self.skill_packages.clear()
        self.load_skill_packages()

# 测试
if __name__ == "__main__":
    loader = SkillLoader()
    print(f"Loaded {len(loader.get_all_skill_packages())} skill packages")
    for skill in loader.get_all_skill_packages():
        print(f"- {skill.name} ({skill.id})")
