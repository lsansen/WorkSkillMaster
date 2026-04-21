import aiohttp
import json
import time
from typing import AsyncGenerator, List, Optional, Any
from .base import (
    BaseLLM, 
    ModelConfig, 
    Message, 
    GenerationResponse,
    ModelError,
    ModelAPIError
)


class OllamaAdapter(BaseLLM):
    """Ollama本地模型适配器"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        self.base_url = config.api_base or "http://localhost:11434"
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
                cost=0.0,  # 本地模型免费
                metadata={"source": "ollama"}
            )
        
        # 非流式生成
        payload = {
            "model": self.model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "top_p": self.top_p
            }
        }
        
        if self.max_tokens:
            payload["options"]["num_predict"] = self.max_tokens
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/chat",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ModelAPIError(f"Ollama API error: {response.status} - {error_text}")
                    
                    result = await response.json()
                    content = result.get("message", {}).get("content", "")
                    
                    duration = time.time() - start_time
                    
                    return GenerationResponse(
                        content=content,
                        model=self.model_name,
                        duration=duration,
                        token_count=len(content) // 4,  # 简单估算
                        cost=0.0,  # 本地模型免费
                        metadata={"source": "ollama"}
                    )
        except aiohttp.ClientError as e:
            raise ModelAPIError(f"Ollama connection error: {str(e)}")
    
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
            "options": {
                "temperature": self.temperature,
                "top_p": self.top_p
            }
        }
        
        if self.max_tokens:
            payload["options"]["num_predict"] = self.max_tokens
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/chat",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=300)
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ModelAPIError(f"Ollama API error: {response.status} - {error_text}")
                    
                    async for line in response.content:
                        if line:
                            try:
                                line_str = line.decode('utf-8').strip()
                                if line_str:
                                    data = json.loads(line_str)
                                    if "message" in data:
                                        yield data["message"].get("content", "")
                            except json.JSONDecodeError:
                                continue
        except aiohttp.ClientError as e:
            raise ModelAPIError(f"Ollama connection error: {str(e)}")
    
    async def health_check(self) -> bool:
        """检查模型是否可用"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/tags",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        models = data.get("models", [])
                        return any(model.get("name") == self.model_name for model in models)
                    return False
        except Exception:
            return False
    
    async def list_models(self) -> List[str]:
        """列出所有可用模型"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/tags",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return [model.get("name", "") for model in data.get("models", [])]
                    return []
        except Exception:
            return []
