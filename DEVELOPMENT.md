# WorkSkillMaster 开发文档

## 1. 项目结构说明

### 1.1 总体结构

```
WorkSkillMaster/
├── src/                  # 前端源代码
│   ├── components/       # React组件
│   │   └── SkillPackage/ # 技能包框架组件
│   ├── contexts/         # React上下文
│   ├── pages/            # 页面组件
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 应用主组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── backend/              # 后端源代码
│   ├── adapters/         # 模型适配器
│   ├── database/         # 数据库操作
│   ├── utils/            # 工具函数
│   ├── main.py           # 后端入口
│   └── skill_loader.py   # 技能包加载器
├── skills/               # 技能包定义文件
│   ├── general/          # 通用技能包
│   └── hr/               # HR相关技能包
├── public/               # 静态资源
├── .vite/                # Vite构建缓存
├── venv/                 # Python虚拟环境
├── package.json          # 前端依赖
├── tsconfig.json         # TypeScript配置
├── tailwind.config.js    # Tailwind配置
├── requirements.txt      # 后端依赖
└── README.md             # 项目说明
```

### 1.2 核心模块说明

#### 前端模块
- **components/**：包含Layout、Topbar、Sidebar等通用组件
- **pages/**：包含各个技能包页面和设置页面
- **contexts/**：包含主题和离线模式的上下文管理
- **utils/**：包含导出工具等实用函数

#### 后端模块
- **adapters/**：包含不同AI模型的适配器实现
- **database/**：包含数据库模型和操作
- **utils/**：包含模型路由等工具函数

#### 技能包系统
- **skills/**：包含技能包的定义文件（Markdown格式）
- **skill_loader.py**：加载和解析技能包定义

## 2. 模块开发指南

### 2.1 前端开发

#### 组件开发
1. **创建新组件**
   - 在 `src/components/` 目录下创建新的组件文件
   - 遵循React函数组件的标准结构
   - 使用TypeScript定义组件Props类型

2. **页面开发**
   - 在 `src/pages/` 目录下创建新的页面组件
   - 页面组件应使用 `SkillPackageFramework` 作为基础框架
   - 定义技能包配置和生成逻辑

3. **路由配置**
   - 在 `src/App.tsx` 中添加新的路由
   - 路由路径应遵循 `/skill/{skill-id}` 的格式

4. **状态管理**
   - 使用React的 `useState` 和 `useContext` 进行状态管理
   - 对于复杂状态，考虑使用 `useReducer` 或状态管理库

5. **样式开发**
   - 使用Tailwind CSS进行样式设计
   - 遵循项目的设计风格和组件命名规范

### 2.2 后端开发

#### API开发
1. **添加新API端点**
   - 在 `backend/main.py` 中添加新的请求处理逻辑
   - 遵循RESTful API设计原则
   - 使用适当的HTTP方法和状态码

2. **数据库操作**
   - 在 `backend/database/models.py` 中添加新的数据模型
   - 使用 `DatabaseManager` 类进行数据库操作
   - 确保添加适当的索引以提高查询性能

3. **模型适配器**
   - 在 `backend/adapters/` 目录下创建新的适配器
   - 实现 `BaseLLM` 接口定义的方法
   - 处理模型特定的API调用和错误处理

4. **技能包加载**
   - 在 `backend/skill_loader.py` 中添加新的技能包加载逻辑
   - 确保正确解析技能包的Markdown定义

## 3. 自定义技能包开发教程

### 3.1 技能包定义格式

技能包使用Markdown格式定义，包含以下部分：

```markdown
# 技能包名称

## 描述
技能包的详细描述

## 类别
general

## 版本
1.0.0

## 作者
系统

## 标签
- 标签1
- 标签2

## 参数

### 参数1
- 类型: text
- 标签: 参数标签
- 描述: 参数描述
- 必填: true
- 默认值: 默认值
- 选项: 选项1,选项2,选项3

### 参数2
- 类型: select
- 标签: 参数标签
- 描述: 参数描述
- 必填: false
- 默认值: 默认值
- 选项: 选项1,选项2,选项3
```

### 3.2 创建自定义技能包

1. **创建技能包文件**
   - 在 `skills/` 目录下创建新的Markdown文件
   - 遵循上述技能包定义格式
   - 选择适当的类别目录（general、hr等）

2. **定义技能包参数**
   - 支持的参数类型：text、textarea、select、file、number、date
   - 为每个参数设置适当的属性

3. **创建前端页面**
   - 在 `src/pages/` 目录下创建对应的页面组件
   - 导入 `SkillPackageFramework` 组件
   - 定义技能包配置和生成逻辑

4. **配置路由**
   - 在 `src/App.tsx` 中添加新的路由
   - 路由路径应与技能包ID对应

### 3.3 技能包生成逻辑

每个技能包页面需要实现 `handleGenerate` 函数，该函数接收用户输入的参数并返回生成的内容：

```typescript
const handleGenerate = async (params: any): Promise<string> => {
  // 处理输入参数
  // 调用AI模型生成内容
  // 返回生成的结果
  return generatedContent;
};
```

### 3.4 示例：创建自定义技能包

#### 步骤1：创建技能包定义文件
创建 `skills/general/my-skill.md`：

```markdown
# 我的自定义技能

## 描述
这是一个自定义技能包示例

## 类别
general

## 版本
1.0.0

## 作者
开发者

## 标签
- 自定义
- 示例

## 参数

### topic
- 类型: text
- 标签: 主题
- 描述: 生成内容的主题
- 必填: true
- 默认值:
- 选项:

### length
- 类型: select
- 标签: 长度
- 描述: 生成内容的长度
- 必填: true
- 默认值: medium
- 选项: short,medium,long
```

#### 步骤2：创建前端页面
创建 `src/pages/MySkill.tsx`：

```typescript
import React from 'react';
import SkillPackageFramework from '../components/SkillPackage/SkillPackageFramework';

const MySkill: React.FC = () => {
  const skillPackage = {
    id: 'my-skill',
    name: '我的自定义技能',
    description: '这是一个自定义技能包示例',
    category: 'general',
    version: '1.0.0',
    author: '开发者',
    tags: ['自定义', '示例'],
    parameters: [
      {
        id: 'topic',
        name: 'topic',
        type: 'text',
        label: '主题',
        description: '生成内容的主题',
        required: true,
        default: ''
      },
      {
        id: 'length',
        name: 'length',
        type: 'select',
        label: '长度',
        description: '生成内容的长度',
        required: true,
        default: 'medium',
        options: [
          { 'short': '简短' },
          { 'medium': '中等' },
          { 'long': '详细' }
        ]
      }
    ]
  };

  const handleGenerate = async (params: any): Promise<string> => {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lengthMap = {
      'short': '简短内容',
      'medium': '中等长度内容',
      'long': '详细内容'
    };
    
    return `# ${params.topic}\n\n这是关于"${params.topic}"的${lengthMap[params.length]}。\n\n由自定义技能包生成。`;
  };

  return (
    <SkillPackageFramework
      skillPackage={skillPackage}
      onGenerate={handleGenerate}
    />
  );
};

export default MySkill;
```

#### 步骤3：添加路由
在 `src/App.tsx` 中添加路由：

```typescript
import MySkill from './pages/MySkill';

// 在Routes中添加
<Route path="/skill/my-skill" element={<MySkill />} />
```

## 4. 添加新模型适配器教程

### 4.1 适配器接口

所有模型适配器都需要实现 `BaseLLM` 接口，该接口定义在 `backend/adapters/base.py` 中：

```python
class BaseLLM:
    """LLM基础接口"""
    
    async def generate(
        self, 
        messages: List[Message], 
        stream: bool = False,
        **kwargs
    ) -> GenerationResponse:
        """生成文本内容"""
        pass
    
    async def generate_stream(
        self, 
        messages: List[Message], 
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """流式生成文本内容"""
        pass
    
    async def health_check(self) -> bool:
        """检查模型是否可用"""
        pass
```

### 4.2 创建新适配器

1. **创建适配器文件**
   - 在 `backend/adapters/` 目录下创建新的适配器文件
   - 例如：`my_model_adapter.py`

2. **实现适配器类**
   - 继承 `BaseLLM` 类
   - 实现所有必要的方法
   - 处理模型特定的API调用和错误处理

3. **注册适配器**
   - 在 `backend/adapters/__init__.py` 中导入并导出新的适配器
   - 在 `backend/utils/model_router.py` 中添加适配器的创建逻辑

### 4.3 示例：创建新模型适配器

#### 步骤1：创建适配器文件
创建 `backend/adapters/my_model_adapter.py`：

```python
import aiohttp
import json
import time
from typing import AsyncGenerator, List, Optional
from .base import (
    BaseLLM, 
    ModelConfig, 
    Message, 
    GenerationResponse,
    ModelError,
    ModelAPIError
)


class MyModelAdapter(BaseLLM):
    """自定义模型适配器"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        self.api_key = config.api_key
        self.base_url = config.api_base or "https://api.mymodel.com/v1"
        self.model_name = config.id
        self.temperature = config.temperature
        self.top_p = config.top_p
        self.max_tokens = config.max_tokens
    
    async def generate(
        self, 
        messages: List[Message], 
        stream: bool = False,
        **kwargs
    ) -> GenerationResponse:
        """生成文本内容"""
        start_time = time.time()
        
        if stream:
            full_content = ""
            async for chunk in self.generate_stream(messages, **kwargs):
                full_content += chunk
            
            duration = time.time() - start_time
            
            return GenerationResponse(
                content=full_content,
                model=self.model_name,
                duration=duration,
                token_count=len(full_content) // 4,  # 简单估算
                cost=0.0,  # 根据实际情况计算
                metadata={"source": "my-model"}
            )
        
        # 非流式生成
        payload = {
            "model": self.model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": self.temperature,
            "top_p": self.top_p
        }
        
        if self.max_tokens:
            payload["max_tokens"] = self.max_tokens
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ModelAPIError(f"MyModel API error: {response.status} - {error_text}")
                    
                    result = await response.json()
                    content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                    
                    duration = time.time() - start_time
                    
                    return GenerationResponse(
                        content=content,
                        model=self.model_name,
                        duration=duration,
                        token_count=len(content) // 4,  # 简单估算
                        cost=0.0,  # 根据实际情况计算
                        metadata={"source": "my-model"}
                    )
        except aiohttp.ClientError as e:
            raise ModelAPIError(f"MyModel connection error: {str(e)}")
    
    async def generate_stream(
        self, 
        messages: List[Message], 
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """流式生成文本内容"""
        payload = {
            "model": self.model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "stream": True,
            "temperature": self.temperature,
            "top_p": self.top_p
        }
        
        if self.max_tokens:
            payload["max_tokens"] = self.max_tokens
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ModelAPIError(f"MyModel API error: {response.status} - {error_text}")
                    
                    async for line in response.content:
                        if line:
                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith('data: '):
                                line_str = line_str[6:]
                                if line_str == '[DONE]':
                                    break
                                try:
                                    data = json.loads(line_str)
                                    delta = data.get("choices", [{}])[0].get("delta", {})
                                    content = delta.get("content", "")
                                    if content:
                                        yield content
                                except json.JSONDecodeError:
                                    continue
        except aiohttp.ClientError as e:
            raise ModelAPIError(f"MyModel connection error: {str(e)}")
    
    async def health_check(self) -> bool:
        """检查模型是否可用"""
        try:
            async with aiohttp.ClientSession() as session:
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                }
                
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    json={
                        "model": self.model_name,
                        "messages": [{"role": "user", "content": "test"}],
                        "max_tokens": 5
                    },
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    return response.status == 200
        except Exception:
            return False
```

#### 步骤2：注册适配器
在 `backend/adapters/__init__.py` 中添加：

```python
from .my_model_adapter import MyModelAdapter

__all__ = [
    # 其他适配器...
    'MyModelAdapter'
]
```

在 `backend/utils/model_router.py` 中添加：

```python
def _create_adapter(self, config: ModelConfig) -> Optional[BaseLLM]:
    """创建适配器实例"""
    try:
        if config.provider == ModelProvider.OLLAMA:
            return OllamaAdapter(config)
        elif config.provider == ModelProvider.OPENAI:
            return OpenAIAdapter(config)
        elif config.provider == ModelProvider.MYMODEL:  # 添加新的提供商
            return MyModelAdapter(config)
        else:
            return None
    except Exception as e:
        print(f"Failed to create adapter for {config.id}: {str(e)}")
        return None
```

#### 步骤3：添加提供商枚举
在 `backend/adapters/base.py` 中添加：

```python
class ModelProvider(str, Enum):
    """模型提供商"""
    OLLAMA = "ollama"
    OPENAI = "openai"
    MYMODEL = "mymodel"  # 添加新的提供商
```

## 5. 开发工作流

### 5.1 本地开发

1. **启动开发服务器**
   - 前端：`npm run dev`
   - 后端：`python backend/main.py`

2. **代码检查**
   - 前端：`npm run lint`
   - 后端：使用 `flake8` 或其他Python代码检查工具

3. **构建生产版本**
   - 前端：`npm run build`
   - 后端：无需构建，直接部署

### 5.2 测试

1. **单元测试**
   - 为关键组件和函数编写单元测试
   - 使用适当的测试框架（Jest for React, pytest for Python）

2. **集成测试**
   - 测试API端点和模型调用
   - 测试技能包的完整流程

3. **性能测试**
   - 测试模型响应时间
   - 测试文件上传和处理性能

### 5.3 部署

1. **前端部署**
   - 构建生产版本：`npm run build`
   - 部署到静态网站托管服务

2. **后端部署**
   - 部署到云服务器或容器服务
   - 配置环境变量和依赖

3. **容器化**
   - 创建Dockerfile
   - 使用Docker Compose管理多容器部署

## 6. 最佳实践

### 6.1 代码规范

- **前端**：
  - 使用TypeScript进行类型检查
  - 遵循ESLint规则
  - 使用Prettier进行代码格式化

- **后端**：
  - 遵循PEP 8编码规范
  - 使用类型提示
  - 编写清晰的文档字符串

### 6.2 安全性

- **API密钥**：使用加密存储
- **输入验证**：验证所有用户输入
- **错误处理**：不要暴露敏感的错误信息
- **CORS**：正确配置CORS策略

### 6.3 性能优化

- **前端**：
  - 使用React.memo和useMemo优化渲染
  - 合理使用useState和useEffect
  - 优化文件上传和处理

- **后端**：
  - 使用连接池管理数据库连接
  - 添加适当的索引
  - 优化API响应时间

### 6.4 可维护性

- **模块化**：将代码分解为小的、可管理的模块
- **文档**：为代码和API编写清晰的文档
- **版本控制**：使用Git进行版本管理
- **代码审查**：进行定期的代码审查

## 7. 故障排除

### 7.1 常见问题

**Q: 前端页面不显示技能包内容**
A: 检查：
- 技能包文件是否存在
- 路由配置是否正确
- 技能包参数定义是否正确

**Q: 模型调用失败**
A: 检查：
- 模型配置是否正确
- API密钥是否有效
- 网络连接是否正常
- 模型服务是否可用

**Q: 数据库操作失败**
A: 检查：
- 数据库文件权限
- SQL语句是否正确
- 数据库连接是否正常

### 7.2 调试技巧

- **前端**：使用浏览器开发者工具进行调试
- **后端**：使用日志记录和断点调试
- **网络**：使用Postman或curl测试API端点
- **数据库**：使用SQLite浏览器查看数据库内容

## 8. 贡献指南

### 8.1 提交代码

1. **创建分支**：从main分支创建新的功能分支
2. **编写代码**：实现功能或修复bug
3. **测试**：确保代码通过测试
4. **提交**：使用清晰的提交信息
5. **推送**：推送到GitHub
6. **Pull Request**：创建Pull Request并描述变更

### 8.2 代码审查

- 遵循项目的代码规范
- 确保代码逻辑清晰
- 检查是否有潜在的安全问题
- 验证测试是否通过

### 8.3 发布流程

1. **版本号**：遵循语义化版本规范
2. **更新日志**：记录重要变更
3. **构建**：构建生产版本
4. **发布**：创建GitHub Release

---

**WorkSkillMaster - 让AI助力职场，让工作更高效！**