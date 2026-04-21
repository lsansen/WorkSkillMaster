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


class OpenAIAdapter(BaseLLM):
    """OpenAI兼容云端模型适配器"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        self.api_key = config.api_key
        self.base_url = config.api_base or "https://api.openai.com/v1"
        self.model_name = config.id
        self.temperature = config.temperature
        self.top_p = config.top_p
        self.max_tokens = config.max_tokens
        self.cost_per_token_input = config.cost_per_token_input or 0.0
        self.cost_per_token_output = config.cost_per_token_output or 0.0
    
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
            token_count = 0
            async for chunk in self.generate_stream(messages, **kwargs):
                full_content += chunk
                token_count += 1  # 简单估算
            
            duration = time.time() - start_time
            estimated_cost = self._calculate_cost(token_count, token_count)
            
            return GenerationResponse(
                content=full_content,
                model=self.model_name,
                duration=duration,
                token_count=token_count * 4,  # 简单估算
                cost=estimated_cost,
                metadata={"source": "openai"}
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
                        raise ModelAPIError(f"OpenAI API error: {response.status} - {error_text}")
                    
                    result = await response.json()
                    content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                    
                    usage = result.get("usage", {})
                    input_tokens = usage.get("prompt_tokens", 0)
                    output_tokens = usage.get("completion_tokens", 0)
                    
                    duration = time.time() - start_time
                    cost = self._calculate_cost(input_tokens, output_tokens)
                    
                    return GenerationResponse(
                        content=content,
                        model=self.model_name,
                        duration=duration,
                        token_count=input_tokens + output_tokens,
                        cost=cost,
                        metadata={"source": "openai", "usage": usage}
                    )
        except aiohttp.ClientError as e:
            raise ModelAPIError(f"OpenAI connection error: {str(e)}")
    
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
                        raise ModelAPIError(f"OpenAI API error: {response.status} - {error_text}")
                    
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
            raise ModelAPIError(f"OpenAI connection error: {str(e)}")
    
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
    
    def _calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """计算调用成本"""
        return (
            input_tokens * self.cost_per_token_input + 
            output_tokens * self.cost_per_token_output
        )
