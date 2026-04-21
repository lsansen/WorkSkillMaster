# 职场技能包大师 - API接口定义

## 基础信息

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **认证方式**: API Key（可选，用于云端模型调用）
- **错误响应格式**:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Error message",
      "details": {}
    }
  }
  ```

## 1. 技能包相关API

### 1.1 获取技能包列表
- **路径**: `/skill-packages`
- **方法**: `GET`
- **参数**:
  - `category` (查询参数): 技能包分类，可选值: `general`, `professional`
  - `enabled` (查询参数): 是否启用，可选值: `true`, `false`
  - `page` (查询参数): 页码，默认 1
  - `limit` (查询参数): 每页数量，默认 20
- **响应**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "category": "general",
        "version": "string",
        "author": "string",
        "enabled": true
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
  ```

### 1.2 获取技能包详情
- **路径**: `/skill-packages/{id}`
- **方法**: `GET`
- **参数**:
  - `id` (路径参数): 技能包ID
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "category": "general",
    "version": "string",
    "author": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "parameters": [...],
    "template": "string",
    "modelRequirements": [...],
    "tags": ["string"],
    "enabled": true
  }
  ```

### 1.3 创建技能包
- **路径**: `/skill-packages`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "name": "string",
    "description": "string",
    "category": "general",
    "version": "string",
    "author": "string",
    "parameters": [...],
    "template": "string",
    "modelRequirements": [...],
    "tags": ["string"]
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

### 1.4 更新技能包
- **路径**: `/skill-packages/{id}`
- **方法**: `PUT`
- **参数**:
  - `id` (路径参数): 技能包ID
- **请求体**:
  ```json
  {
    "name": "string",
    "description": "string",
    "parameters": [...],
    "template": "string",
    "tags": ["string"],
    "enabled": true
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
  ```

### 1.5 删除技能包
- **路径**: `/skill-packages/{id}`
- **方法**: `DELETE`
- **参数**:
  - `id` (路径参数): 技能包ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "Skill package deleted"
  }
  ```

### 1.6 执行技能包
- **路径**: `/skill-packages/{id}/execute`
- **方法**: `POST`
- **参数**:
  - `id` (路径参数): 技能包ID
- **请求体**:
  ```json
  {
    "parameters": {"key": "value"},
    "modelId": "string",
    "files": ["file_id1", "file_id2"],
    "options": {
      "temperature": 0.7,
      "maxTokens": 1000
    }
  }
  ```
- **响应**:
  ```json
  {
    "taskId": "string",
    "status": "processing",
    "estimatedTime": 5000
  }
  ```

## 2. 模型相关API

### 2.1 获取模型列表
- **路径**: `/models`
- **方法**: `GET`
- **参数**:
  - `type` (查询参数): 模型类型，可选值: `local`, `cloud`
  - `modelType` (查询参数): 模型类别，可选值: `text`, `audio`
  - `enabled` (查询参数): 是否启用，可选值: `true`, `false`
- **响应**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "name": "string",
        "type": "local",
        "provider": "ollama",
        "modelType": "text",
        "enabled": true
      }
    ]
  }
  ```

### 2.2 获取模型详情
- **路径**: `/models/{id}`
- **方法**: `GET`
- **参数**:
  - `id` (路径参数): 模型ID
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "type": "local",
    "provider": "ollama",
    "modelType": "text",
    "version": "string",
    "description": "string",
    "enabled": true,
    "config": {...},
    "tokenCost": {...}
  }
  ```

### 2.3 创建/更新模型
- **路径**: `/models`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "id": "string",
    "name": "string",
    "type": "local",
    "provider": "ollama",
    "modelType": "text",
    "version": "string",
    "description": "string",
    "enabled": true,
    "config": {...},
    "tokenCost": {...}
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

### 2.4 测试模型
- **路径**: `/models/{id}/test`
- **方法**: `POST`
- **参数**:
  - `id` (路径参数): 模型ID
- **请求体**:
  ```json
  {
    "prompt": "Hello, world!",
    "options": {
      "temperature": 0.7,
      "maxTokens": 100
    }
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "response": "Hello! How can I help you today?",
    "tokenUsage": {
      "prompt": 10,
      "completion": 20,
      "total": 30
    },
    "cost": 0.00015,
    "duration": 1500
  }
  ```

### 2.5 模型路由规则
- **路径**: `/model-routes`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "skillPackageId": "string",
        "taskType": "email",
        "priority": 1,
        "modelIds": ["model1", "model2"],
        "fallbackStrategy": "local",
        "enabled": true
      }
    ]
  }
  ```

## 3. 文件处理API

### 3.1 上传文件
- **路径**: `/files`
- **方法**: `POST`
- **参数**:
  - `file` (表单数据): 文件
  - `type` (表单数据): 文件类型
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "type": "application/pdf",
    "size": 1024000,
    "path": "string",
    "hash": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "processed": false
  }
  ```

### 3.2 获取文件列表
- **路径**: `/files`
- **方法**: `GET`
- **参数**:
  - `processed` (查询参数): 是否处理，可选值: `true`, `false`
  - `type` (查询参数): 文件类型，如 `pdf`, `docx`
  - `page` (查询参数): 页码，默认 1
  - `limit` (查询参数): 每页数量，默认 20
- **响应**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "name": "string",
        "type": "application/pdf",
        "size": 1024000,
        "createdAt": "2024-01-01T00:00:00Z",
        "processed": true
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
  ```

### 3.3 获取文件详情
- **路径**: `/files/{id}`
- **方法**: `GET`
- **参数**:
  - `id` (路径参数): 文件ID
- **响应**:
  ```json
  {
    "id": "string",
    "name": "string",
    "type": "application/pdf",
    "size": 1024000,
    "path": "string",
    "hash": "string",
    "metadata": {
      "pages": 10,
      "words": 1000
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "processed": true,
    "content": "string" // 处理后的文本内容
  }
  ```

### 3.4 处理文件
- **路径**: `/files/{id}/process`
- **方法**: `POST`
- **参数**:
  - `id` (路径参数): 文件ID
- **请求体**:
  ```json
  {
    "processType": "extract_text",
    "options": {
      "ocr": true
    }
  }
  ```
- **响应**:
  ```json
  {
    "taskId": "string",
    "status": "processing"
  }
  ```

### 3.5 删除文件
- **路径**: `/files/{id}`
- **方法**: `DELETE`
- **参数**:
  - `id` (路径参数): 文件ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "File deleted"
  }
  ```

## 4. 用户配置API

### 4.1 获取用户配置
- **路径**: `/config`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "id": "string",
    "theme": "light",
    "language": "zh-CN",
    "defaultModelId": "string",
    "autoSave": true,
    "notifications": true,
    "offlineMode": false,
    "budget": {...},
    "privacy": {...},
    "updatedAt": "2024-01-01T00:00:00Z"
  }
  ```

### 4.2 更新用户配置
- **路径**: `/config`
- **方法**: `PUT`
- **请求体**:
  ```json
  {
    "theme": "dark",
    "language": "en-US",
    "defaultModelId": "string",
    "autoSave": true,
    "notifications": true,
    "offlineMode": false,
    "budget": {...},
    "privacy": {...}
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
  ```

### 4.3 API密钥管理
- **路径**: `/api-keys`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "provider": "openai",
        "name": "string",
        "createdAt": "2024-01-01T00:00:00Z",
        "lastUsedAt": "2024-01-01T00:00:00Z",
        "enabled": true
      }
    ]
  }
  ```

### 4.4 添加API密钥
- **路径**: `/api-keys`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "provider": "openai",
    "name": "string",
    "apiKey": "string"
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

## 5. 历史记录API

### 5.1 获取历史记录
- **路径**: `/history`
- **方法**: `GET`
- **参数**:
  - `skillPackageId` (查询参数): 技能包ID
  - `modelId` (查询参数): 模型ID
  - `startDate` (查询参数): 开始日期
  - `endDate` (查询参数): 结束日期
  - `favorited` (查询参数): 是否收藏，可选值: `true`, `false`
  - `page` (查询参数): 页码，默认 1
  - `limit` (查询参数): 每页数量，默认 20
- **响应**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "skillPackageId": "string",
        "skillPackageName": "string",
        "input": {"key": "value"},
        "output": "string",
        "modelId": "string",
        "modelName": "string",
        "tokenUsage": {...},
        "cost": 0.001,
        "duration": 2000,
        "createdAt": "2024-01-01T00:00:00Z",
        "tags": ["string"],
        "favorited": false
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
  ```

### 5.2 获取历史记录详情
- **路径**: `/history/{id}`
- **方法**: `GET`
- **参数**:
  - `id` (路径参数): 历史记录ID
- **响应**:
  ```json
  {
    "id": "string",
    "skillPackageId": "string",
    "skillPackageName": "string",
    "input": {"key": "value"},
    "output": "string",
    "modelId": "string",
    "modelName": "string",
    "tokenUsage": {...},
    "cost": 0.001,
    "duration": 2000,
    "createdAt": "2024-01-01T00:00:00Z",
    "tags": ["string"],
    "favorited": false
  }
  ```

### 5.3 更新历史记录
- **路径**: `/history/{id}`
- **方法**: `PUT`
- **参数**:
  - `id` (路径参数): 历史记录ID
- **请求体**:
  ```json
  {
    "tags": ["string"],
    "favorited": true
  }
  ```
- **响应**:
  ```json
  {
    "id": "string",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
  ```

### 5.4 删除历史记录
- **路径**: `/history/{id}`
- **方法**: `DELETE`
- **参数**:
  - `id` (路径参数): 历史记录ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "History deleted"
  }
  ```

### 5.5 清空历史记录
- **路径**: `/history`
- **方法**: `DELETE`
- **请求体**:
  ```json
  {
    "olderThan": "2024-01-01T00:00:00Z" // 可选，删除早于此日期的记录
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "History cleared",
    "deletedCount": 50
  }
  ```

## 6. 任务管理API

### 6.1 获取任务列表
- **路径**: `/tasks`
- **方法**: `GET`
- **参数**:
  - `status` (查询参数): 任务状态，可选值: `pending`, `processing`, `completed`, `failed`
  - `page` (查询参数): 页码，默认 1
  - `limit` (查询参数): 每页数量，默认 20
- **响应**:
  ```json
  {
    "data": [
      {
        "id": "string",
        "skillPackageId": "string",
        "status": "completed",
        "progress": 100,
        "startedAt": "2024-01-01T00:00:00Z",
        "completedAt": "2024-01-01T00:00:05Z",
        "duration": 5000
      }
    ],
    "total": 20,
    "page": 1,
    "limit": 20
  }
  ```

### 6.2 获取任务状态
- **路径**: `/tasks/{id}`
- **方法**: `GET`
- **参数**:
  - `id` (路径参数): 任务ID
- **响应**:
  ```json
  {
    "id": "string",
    "skillPackageId": "string",
    "status": "completed",
    "progress": 100,
    "result": "string",
    "error": "string",
    "modelId": "string",
    "startedAt": "2024-01-01T00:00:00Z",
    "completedAt": "2024-01-01T00:00:05Z",
    "tokenUsage": {
      "prompt": 100,
      "completion": 200,
      "total": 300
    },
    "cost": 0.0015,
    "duration": 5000
  }
  ```

### 6.3 取消任务
- **路径**: `/tasks/{id}/cancel`
- **方法**: `POST`
- **参数**:
  - `id` (路径参数): 任务ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "Task cancelled"
  }
  ```

## 7. 系统状态API

### 7.1 获取系统状态
- **路径**: `/system/status`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "online": true,
    "ollamaAvailable": true,
    "models": {
      "model1": {
        "available": true,
        "version": "1.0.0"
      }
    },
    "diskUsage": {
      "total": 1000000000000,
      "used": 500000000000,
      "free": 500000000000
    },
    "memoryUsage": {
      "total": 16000000000,
      "used": 8000000000,
      "free": 8000000000
    },
    "cpuUsage": 50,
    "lastUpdated": "2024-01-01T00:00:00Z"
  }
  ```

### 7.2 获取系统统计
- **路径**: `/system/stats`
- **方法**: `GET`
- **参数**:
  - `period` (查询参数): 统计周期，可选值: `day`, `week`, `month`
- **响应**:
  ```json
  {
    "totalRequests": 1000,
    "totalTokens": 100000,
    "totalCost": 5.0,
    "modelUsage": {
      "model1": 500,
      "model2": 300
    },
    "skillPackageUsage": {
      "email": 200,
      "meeting": 150
    }
  }
  ```

## 8. 错误码定义

| 错误码 | 描述 | HTTP状态码 |
|-------|------|-----------|
| `MODEL_UNAVAILABLE` | 模型不可用 | 503 |
| `API_KEY_INVALID` | API密钥无效 | 401 |
| `SKILL_PACKAGE_NOT_FOUND` | 技能包不存在 | 404 |
| `FILE_PROCESSING_ERROR` | 文件处理错误 | 400 |
| `INSUFFICIENT_BUDGET` | 预算不足 | 403 |
| `NETWORK_ERROR` | 网络错误 | 502 |
| `INTERNAL_ERROR` | 内部错误 | 500 |
| `VALIDATION_ERROR` | 验证错误 | 400 |
| `RATE_LIMIT_EXCEEDED` | 速率限制 | 429 |
| `FILE_NOT_FOUND` | 文件不存在 | 404 |
| `TASK_NOT_FOUND` | 任务不存在 | 404 |
| `HISTORY_NOT_FOUND` | 历史记录不存在 | 404 |
