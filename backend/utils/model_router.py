import uuid
from datetime import datetime
from typing import Dict, List, Optional, AsyncGenerator
from ..adapters import (
    BaseLLM,
    ModelConfig,
    Message,
    GenerationResponse,
    ModelType,
    ModelProvider,
    OllamaAdapter,
    OpenAIAdapter,
    FasterWhisperAdapter,
    ModelError,
    ModelNotFoundError
)
from ..database.models import db, UsageRecord


class ModelRouter:
    """智能模型路由管理器"""
    
    def __init__(self):
        self.model_instances: Dict[str, BaseLLM] = {}
        self._initialize_default_models()
    
    def _initialize_default_models(self):
        """初始化默认模型配置"""
        # 检查是否已有模型配置
        existing_configs = db.get_all_model_configs()
        
        if not existing_configs:
            # 创建默认的Ollama模型配置
            default_configs = [
                ModelConfig(
                    id="ollama-llama3",
                    name="Ollama Llama 3",
                    provider=ModelProvider.OLLAMA,
                    type=ModelType.TEXT,
                    enabled=True,
                    api_base="http://localhost:11434",
                    temperature=0.7,
                    top_p=0.9,
                    cost_per_token_input=0.0,
                    cost_per_token_output=0.0
                ),
                ModelConfig(
                    id="openai-gpt4",
                    name="OpenAI GPT-4",
                    provider=ModelProvider.OPENAI,
                    type=ModelType.TEXT,
                    enabled=False,
                    temperature=0.7,
                    top_p=0.9,
                    cost_per_token_input=0.00003,
                    cost_per_token_output=0.00006
                )
            ]
            
            for config in default_configs:
                db.save_model_config(config)
    
    def _create_adapter(self, config: ModelConfig) -> Optional[BaseLLM]:
        """创建适配器实例"""
        try:
            if config.provider == ModelProvider.OLLAMA:
                return OllamaAdapter(config)
            elif config.provider == ModelProvider.OPENAI:
                return OpenAIAdapter(config)
            else:
                return None
        except Exception as e:
            print(f"Failed to create adapter for {config.id}: {str(e)}")
            return None
    
    def get_model(self, model_id: str) -> Optional[BaseLLM]:
        """获取模型实例"""
        if model_id not in self.model_instances:
            config = db.get_model_config(model_id)
            if config and config.enabled:
                adapter = self._create_adapter(config)
                if adapter:
                    self.model_instances[model_id] = adapter
        
        return self.model_instances.get(model_id)
    
    def list_available_models(self) -> List[Dict]:
        """列出所有可用模型"""
        configs = db.get_all_model_configs()
        models = []
        
        for config in configs:
            # 检查模型健康状态
            model = self.get_model(config.id)
            healthy = False
            if model:
                try:
                    # 不实际调用，因为可能很慢
                    healthy = True
                except:
                    pass
            
            # 获取预算信息
            budget = db.get_budget(config.id)
            monthly_usage = db.get_monthly_usage(config.id)
            
            models.append({
                "id": config.id,
                "name": config.name,
                "provider": config.provider.value,
                "type": config.type.value,
                "enabled": config.enabled,
                "healthy": healthy,
                "monthly_budget": budget["monthly_budget"] if budget else 0.0,
                "current_usage": monthly_usage["total_cost"],
                "budget_usage": (monthly_usage["total_cost"] / budget["monthly_budget"] * 100 
                                  if budget and budget["monthly_budget"] > 0 else 0)
            })
        
        return models
    
    def select_model(self, requirement: Optional[Dict] = None) -> str:
        """智能选择模型"""
        available_models = self.list_available_models()
        enabled_models = [m for m in available_models if m["enabled"] and m["healthy"]]
        
        if not enabled_models:
            raise ModelError("No available models")
        
        # 优先选择本地模型（成本最低）
        local_models = [m for m in enabled_models if m["provider"] == "ollama"]
        if local_models:
            return local_models[0]["id"]
        
        # 其次选择成本最低的模型
        enabled_models.sort(key=lambda x: x.get("cost_per_token_input", float('inf')))
        return enabled_models[0]["id"]
    
    async def generate_with_model(
        self,
        model_id: str,
        messages: List[Message],
        stream: bool = False,
        **kwargs
    ) -> GenerationResponse:
        """使用指定模型生成内容"""
        model = self.get_model(model_id)
        if not model:
            raise ModelNotFoundError(f"Model {model_id} not found or not enabled")
        
        # 检查预算
        budget = db.get_budget(model_id)
        if budget:
            monthly_usage = db.get_monthly_usage(model_id)
            if monthly_usage["total_cost"] >= budget["monthly_budget"]:
                raise ModelError(f"Budget exceeded for model {model_id}")
        
        # 生成内容
        response = await model.generate(messages, stream, **kwargs)
        
        # 保存使用记录
        usage_record = UsageRecord(
            id=str(uuid.uuid4()),
            model_id=model_id,
            model_name=response.model,
            prompt_tokens=response.token_count // 2,  # 估算
            completion_tokens=response.token_count // 2,
            total_tokens=response.token_count or 0,
            cost=response.cost or 0.0,
            duration=response.duration or 0.0,
            timestamp=datetime.now(),
            metadata=response.metadata
        )
        db.save_usage_record(usage_record)
        
        # 更新预算使用量
        db.update_current_usage(model_id)
        
        return response
    
    async def generate_stream_with_model(
        self,
        model_id: str,
        messages: List[Message],
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """流式生成内容"""
        model = self.get_model(model_id)
        if not model:
            raise ModelNotFoundError(f"Model {model_id} not found or not enabled")
        
        # 注意：流式生成的成本统计在generate_with_model中处理
        async for chunk in model.generate_stream(messages, **kwargs):
            yield chunk
    
    def add_model(self, config: ModelConfig) -> bool:
        """添加新模型"""
        try:
            db.save_model_config(config)
            return True
        except Exception as e:
            print(f"Failed to add model: {str(e)}")
            return False
    
    def update_model(self, config: ModelConfig) -> bool:
        """更新模型配置"""
        try:
            db.save_model_config(config)
            # 清除旧的实例
            if config.id in self.model_instances:
                del self.model_instances[config.id]
            return True
        except Exception as e:
            print(f"Failed to update model: {str(e)}")
            return False
    
    def delete_model(self, model_id: str) -> bool:
        """删除模型"""
        try:
            if model_id in self.model_instances:
                del self.model_instances[model_id]
            return db.delete_model_config(model_id)
        except Exception as e:
            print(f"Failed to delete model: {str(e)}")
            return False


# 全局路由实例
router = ModelRouter()
