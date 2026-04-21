import http.server
import socketserver
import json
import os
import uuid
from urllib.parse import urlparse, parse_qs
from datetime import datetime
from typing import Optional, Dict, Any

# 导入我们的模块
from adapters import ModelConfig, ModelType, ModelProvider, Message
from utils import router
from database import db


# 端口设置
PORT = 8000


# 自定义请求处理器
class RequestHandler(http.server.SimpleHTTPRequestHandler):
    
    def _send_json_response(self, data: Any, status_code: int = 200):
        """发送JSON响应"""
        self.send_response(status_code)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def _get_request_body(self) -> Optional[Dict]:
        """获取请求体"""
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            body = self.rfile.read(content_length)
            return json.loads(body)
        return None
    
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query = parse_qs(parsed_url.query)
        
        if path == "/":
            self._send_json_response({"message": "职场技能包大师 API"})
        
        elif path == "/api/health":
            self._send_json_response({"status": "healthy"})
        
        # 模型相关API
        elif path == "/api/v1/models":
            models_list = router.list_available_models()
            self._send_json_response({"data": models_list})
        
        elif path.startswith("/api/v1/models/") and len(path.split('/')) == 5:
            model_id = path.split('/')[4]
            config = db.get_model_config(model_id)
            if config:
                self._send_json_response({
                    "id": config.id,
                    "name": config.name,
                    "provider": config.provider.value,
                    "type": config.type.value,
                    "enabled": config.enabled,
                    "api_base": config.api_base,
                    "max_tokens": config.max_tokens,
                    "temperature": config.temperature,
                    "top_p": config.top_p,
                    "cost_per_token_input": config.cost_per_token_input,
                    "cost_per_token_output": config.cost_per_token_output
                })
            else:
                self._send_json_response(
                    {"error": {"code": "NOT_FOUND", "message": "Model not found"}},
                    404
                )
        
        # 使用记录API
        elif path == "/api/v1/usage":
            model_id = query.get('model_id', [None])[0]
            limit = int(query.get('limit', [100])[0])
            records = db.get_usage_records(model_id=model_id, limit=limit)
            
            records_data = []
            for record in records:
                records_data.append({
                    "id": record.id,
                    "model_id": record.model_id,
                    "model_name": record.model_name,
                    "prompt_tokens": record.prompt_tokens,
                    "completion_tokens": record.completion_tokens,
                    "total_tokens": record.total_tokens,
                    "cost": record.cost,
                    "duration": record.duration,
                    "timestamp": record.timestamp.isoformat()
                })
            
            self._send_json_response({"data": records_data})
        
        # 月度统计API
        elif path == "/api/v1/stats/monthly":
            model_id = query.get('model_id', [None])[0]
            monthly_stats = db.get_monthly_usage(model_id)
            self._send_json_response(monthly_stats)
        
        # 旧的兼容API
        elif path == "/api/v1/skill-packages":
            from skill_loader import loader
            skill_list = loader.get_all_skill_packages()
            skill_data = []
            for skill in skill_list:
                skill_data.append({
                    "id": skill.id,
                    "name": skill.name,
                    "description": skill.description,
                    "category": skill.category,
                    "version": skill.version,
                    "author": skill.author,
                    "enabled": skill.enabled
                })
            self._send_json_response({
                "data": skill_data,
                "total": len(skill_data),
                "page": 1,
                "limit": 20
            })
        
        elif path == "/api/v1/history":
            self._send_json_response({
                "data": [],
                "total": 0,
                "page": 1,
                "limit": 20
            })
        
        else:
            self._send_json_response(
                {"error": {"code": "NOT_FOUND", "message": "Resource not found"}},
                404
            )
    
    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        body = self._get_request_body()
        
        if path == "/api/v1/models":
            try:
                config = ModelConfig(
                    id=body.get('id', str(uuid.uuid4())),
                    name=body['name'],
                    provider=ModelProvider(body['provider']),
                    type=ModelType(body['type']),
                    enabled=body.get('enabled', True),
                    api_key=body.get('api_key'),
                    api_base=body.get('api_base'),
                    max_tokens=body.get('max_tokens'),
                    temperature=body.get('temperature', 0.7),
                    top_p=body.get('top_p', 0.9),
                    cost_per_token_input=body.get('cost_per_token_input'),
                    cost_per_token_output=body.get('cost_per_token_output')
                )
                router.add_model(config)
                self._send_json_response({"success": True, "id": config.id})
            except Exception as e:
                self._send_json_response(
                    {"error": {"code": "INVALID_REQUEST", "message": str(e)}},
                    400
                )
        
        elif path.startswith("/api/v1/models/") and path.endswith("/chat"):
            model_id = path.split('/')[4]
            try:
                messages_data = body.get('messages', [])
                
                # 模拟响应
                response_content = "这是一个模拟的AI响应。实际使用时需要配置模型。"
                
                self._send_json_response({
                    "content": response_content,
                    "model": model_id,
                    "token_count": 100,
                    "cost": 0.0,
                    "duration": 1.0
                })
            except Exception as e:
                self._send_json_response(
                    {"error": {"code": "INTERNAL_ERROR", "message": str(e)}},
                    500
                )
        
        elif path.startswith("/api/v1/models/") and path.endswith("/budget"):
            model_id = path.split('/')[4]
            try:
                monthly_budget = float(body.get('monthly_budget', 0.0))
                alert_threshold = float(body.get('alert_threshold', 0.8))
                db.set_budget(model_id, monthly_budget, alert_threshold)
                self._send_json_response({"success": True})
            except Exception as e:
                self._send_json_response(
                    {"error": {"code": "INVALID_REQUEST", "message": str(e)}},
                    400
                )
        
        else:
            self._send_json_response(
                {"error": {"code": "NOT_FOUND", "message": "Resource not found"}},
                404
            )
    
    def do_PUT(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        body = self._get_request_body()
        
        if path.startswith("/api/v1/models/") and len(path.split('/')) == 5:
            model_id = path.split('/')[4]
            try:
                config = db.get_model_config(model_id)
                if not config:
                    self._send_json_response(
                        {"error": {"code": "NOT_FOUND", "message": "Model not found"}},
                        404
                    )
                    return
                
                updated_config = ModelConfig(
                    id=model_id,
                    name=body.get('name', config.name),
                    provider=ModelProvider(body.get('provider', config.provider.value)),
                    type=ModelType(body.get('type', config.type.value)),
                    enabled=body.get('enabled', config.enabled),
                    api_key=body.get('api_key', config.api_key),
                    api_base=body.get('api_base', config.api_base),
                    max_tokens=body.get('max_tokens', config.max_tokens),
                    temperature=body.get('temperature', config.temperature),
                    top_p=body.get('top_p', config.top_p),
                    cost_per_token_input=body.get('cost_per_token_input', config.cost_per_token_input),
                    cost_per_token_output=body.get('cost_per_token_output', config.cost_per_token_output)
                )
                router.update_model(updated_config)
                self._send_json_response({"success": True})
            except Exception as e:
                self._send_json_response(
                    {"error": {"code": "INVALID_REQUEST", "message": str(e)}},
                    400
                )
        
        else:
            self._send_json_response(
                {"error": {"code": "NOT_FOUND", "message": "Resource not found"}},
                404
            )
    
    def do_DELETE(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path.startswith("/api/v1/models/") and len(path.split('/')) == 5:
            model_id = path.split('/')[4]
            success = router.delete_model(model_id)
            if success:
                self._send_json_response({"success": True})
            else:
                self._send_json_response(
                    {"error": {"code": "NOT_FOUND", "message": "Model not found"}},
                    404
                )
        
        else:
            self._send_json_response(
                {"error": {"code": "NOT_FOUND", "message": "Resource not found"}},
                404
            )
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


# 主函数
if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("0.0.0.0", PORT), RequestHandler) as httpd:
        print(f"服务器运行在 http://0.0.0.0:{PORT}")
        print("按 Ctrl+C 停止服务器")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
            httpd.shutdown()
