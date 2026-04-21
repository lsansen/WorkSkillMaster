from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum


class ModelType(Enum):
    TEXT = "text"
    IMAGE = "image"
    AUDIO = "audio"
    MULTIMODAL = "multimodal"


class ModelProvider(Enum):
    OLLAMA = "ollama"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    CUSTOM = "custom"


@dataclass
class Message:
    role: str
    content: str
    timestamp: Optional[float] = None


@dataclass
class GenerationResponse:
    content: str
    model: str
    token_count: Optional[int] = None
    cost: Optional[float] = None
    duration: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ModelConfig:
    id: str
    name: str
    provider: ModelProvider
    type: ModelType
    enabled: bool = True
    api_key: Optional[str] = None
    api_base: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: float = 0.7
    top_p: float = 0.9
    cost_per_token_input: Optional[float] = None
    cost_per_token_output: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


class BaseLLM(ABC):
    """大语言模型抽象基类"""
    
    @abstractmethod
    def __init__(self, config: ModelConfig):
        pass
    
    @abstractmethod
    async def generate(
        self, 
        messages: List[Message], 
        stream: bool = False,
        **kwargs
    ) -> GenerationResponse:
        """生成文本内容"""
        pass
    
    @abstractmethod
    async def generate_stream(
        self, 
        messages: List[Message], 
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """流式生成文本内容"""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """检查模型是否可用"""
        pass


class BaseASR(ABC):
    """语音转文字抽象基类"""
    
    @abstractmethod
    def __init__(self, config: ModelConfig):
        pass
    
    @abstractmethod
    async def transcribe(
        self, 
        audio_data: bytes, 
        language: Optional[str] = None,
        **kwargs
    ) -> str:
        """将语音数据转为文字"""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """检查模型是否可用"""
        pass


class ModelError(Exception):
    """模型调用错误"""
    pass


class ModelNotFoundError(ModelError):
    """模型未找到错误"""
    pass


class ModelAPIError(ModelError):
    """模型API错误"""
    pass
