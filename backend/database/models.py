import json
import sqlite3
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, asdict
from ..adapters.base import ModelConfig, ModelType, ModelProvider

# 添加加密功能
from cryptography.fernet import Fernet
import os

# 生成密钥（实际应用中应该从环境变量或配置文件中读取）
ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY', Fernet.generate_key().decode())
fernet = Fernet(ENCRYPTION_KEY.encode())

# 数据库连接池类
class ConnectionPool:
    def __init__(self, db_path: str, max_connections: int = 5):
        self.db_path = db_path
        self.max_connections = max_connections
        self.connections = []
        self.used_connections = 0
    
    def get_connection(self):
        if self.connections:
            return self.connections.pop()
        if self.used_connections < self.max_connections:
            self.used_connections += 1
            return sqlite3.connect(self.db_path)
        # 等待或创建新连接
        return sqlite3.connect(self.db_path)
    
    def return_connection(self, conn):
        if len(self.connections) < self.max_connections:
            self.connections.append(conn)
        else:
            conn.close()
    
    def close_all(self):
        for conn in self.connections:
            conn.close()
        self.connections = []
        self.used_connections = 0

def encrypt_api_key(api_key: Optional[str]) -> Optional[str]:
    """加密API密钥"""
    if api_key:
        return fernet.encrypt(api_key.encode()).decode()
    return None

def decrypt_api_key(encrypted_api_key: Optional[str]) -> Optional[str]:
    """解密API密钥"""
    if encrypted_api_key:
        return fernet.decrypt(encrypted_api_key.encode()).decode()
    return None


@dataclass
class UsageRecord:
    """使用记录"""
    id: str
    model_id: str
    model_name: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    cost: float
    duration: float
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class BudgetAlert:
    """预算警报"""
    id: str
    model_id: str
    threshold: float
    notified: bool
    created_at: datetime


class DatabaseManager:
    """数据库管理器"""
    
    def __init__(self, db_path: str = "app.db"):
        self.db_path = db_path
        self.pool = ConnectionPool(db_path)
        self._init_database()
    
    def _init_database(self):
        """初始化数据库表"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        # 模型配置表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS models (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                provider TEXT NOT NULL,
                type TEXT NOT NULL,
                enabled INTEGER DEFAULT 1,
                api_key TEXT,
                api_base TEXT,
                max_tokens INTEGER,
                temperature REAL DEFAULT 0.7,
                top_p REAL DEFAULT 0.9,
                cost_per_token_input REAL,
                cost_per_token_output REAL,
                metadata TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        ''')
        
        # 使用记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usage_records (
                id TEXT PRIMARY KEY,
                model_id TEXT NOT NULL,
                model_name TEXT NOT NULL,
                prompt_tokens INTEGER DEFAULT 0,
                completion_tokens INTEGER DEFAULT 0,
                total_tokens INTEGER DEFAULT 0,
                cost REAL DEFAULT 0.0,
                duration REAL DEFAULT 0.0,
                timestamp TEXT NOT NULL,
                metadata TEXT,
                FOREIGN KEY (model_id) REFERENCES models (id)
            )
        ''')
        
        # 预算配置表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS budgets (
                id TEXT PRIMARY KEY,
                model_id TEXT NOT NULL,
                monthly_budget REAL DEFAULT 0.0,
                current_usage REAL DEFAULT 0.0,
                alert_threshold REAL DEFAULT 0.8,
                created_at TEXT,
                updated_at TEXT,
                FOREIGN KEY (model_id) REFERENCES models (id)
            )
        ''')
        
        # 添加索引以提高查询性能
        try:
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_usage_records_model_id ON usage_records(model_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_usage_records_timestamp ON usage_records(timestamp)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_budgets_model_id ON budgets(model_id)')
        except Exception as e:
            print(f"创建索引时出错: {e}")
        
        conn.commit()
        self.pool.return_connection(conn)
    
    # 模型配置管理
    def save_model_config(self, config: ModelConfig) -> None:
        """保存模型配置"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        now = datetime.now().isoformat()
        
        cursor.execute('''
            INSERT OR REPLACE INTO models 
            (id, name, provider, type, enabled, api_key, api_base, max_tokens, 
             temperature, top_p, cost_per_token_input, cost_per_token_output, 
             metadata, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            config.id,
            config.name,
            config.provider.value,
            config.type.value,
            1 if config.enabled else 0,
            encrypt_api_key(config.api_key),
            config.api_base,
            config.max_tokens,
            config.temperature,
            config.top_p,
            config.cost_per_token_input,
            config.cost_per_token_output,
            json.dumps(config.metadata) if config.metadata else None,
            now,
            now
        ))
        
        conn.commit()
        self.pool.return_connection(conn)
    
    def get_model_config(self, model_id: str) -> Optional[ModelConfig]:
        """获取模型配置"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM models WHERE id = ?', (model_id,))
        row = cursor.fetchone()
        
        self.pool.return_connection(conn)
        
        if row:
            return ModelConfig(
                id=row[0],
                name=row[1],
                provider=ModelProvider(row[2]),
                type=ModelType(row[3]),
                enabled=bool(row[4]),
                api_key=decrypt_api_key(row[5]),
                api_base=row[6],
                max_tokens=row[7],
                temperature=row[8],
                top_p=row[9],
                cost_per_token_input=row[10],
                cost_per_token_output=row[11],
                metadata=json.loads(row[12]) if row[12] else None
            )
        return None
    
    def get_all_model_configs(self) -> List[ModelConfig]:
        """获取所有模型配置"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM models')
        rows = cursor.fetchall()
        
        self.pool.return_connection(conn)
        
        configs = []
        for row in rows:
            configs.append(ModelConfig(
                id=row[0],
                name=row[1],
                provider=ModelProvider(row[2]),
                type=ModelType(row[3]),
                enabled=bool(row[4]),
                api_key=decrypt_api_key(row[5]),
                api_base=row[6],
                max_tokens=row[7],
                temperature=row[8],
                top_p=row[9],
                cost_per_token_input=row[10],
                cost_per_token_output=row[11],
                metadata=json.loads(row[12]) if row[12] else None
            ))
        return configs
    
    def delete_model_config(self, model_id: str) -> bool:
        """删除模型配置"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM models WHERE id = ?', (model_id,))
        affected = cursor.rowcount > 0
        
        conn.commit()
        self.pool.return_connection(conn)
        
        return affected
    
    # 使用记录管理
    def save_usage_record(self, record: UsageRecord) -> None:
        """保存使用记录"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO usage_records 
            (id, model_id, model_name, prompt_tokens, completion_tokens, 
             total_tokens, cost, duration, timestamp, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            record.id,
            record.model_id,
            record.model_name,
            record.prompt_tokens,
            record.completion_tokens,
            record.total_tokens,
            record.cost,
            record.duration,
            record.timestamp.isoformat(),
            json.dumps(record.metadata) if record.metadata else None
        ))
        
        conn.commit()
        self.pool.return_connection(conn)
    
    def get_usage_records(
        self, 
        model_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[UsageRecord]:
        """获取使用记录"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        query = 'SELECT * FROM usage_records WHERE 1=1'
        params = []
        
        if model_id:
            query += ' AND model_id = ?'
            params.append(model_id)
        
        if start_date:
            query += ' AND timestamp >= ?'
            params.append(start_date.isoformat())
        
        if end_date:
            query += ' AND timestamp <= ?'
            params.append(end_date.isoformat())
        
        query += ' ORDER BY timestamp DESC LIMIT ?'
        params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        self.pool.return_connection(conn)
        
        records = []
        for row in rows:
            records.append(UsageRecord(
                id=row[0],
                model_id=row[1],
                model_name=row[2],
                prompt_tokens=row[3],
                completion_tokens=row[4],
                total_tokens=row[5],
                cost=row[6],
                duration=row[7],
                timestamp=datetime.fromisoformat(row[8]),
                metadata=json.loads(row[9]) if row[9] else None
            ))
        return records
    
    def get_monthly_usage(self, model_id: Optional[str] = None) -> Dict[str, float]:
        """获取本月使用统计"""
        now = datetime.now()
        start_date = datetime(now.year, now.month, 1)
        
        records = self.get_usage_records(model_id, start_date, now)
        
        total_cost = sum(record.cost for record in records)
        total_tokens = sum(record.total_tokens for record in records)
        
        return {
            "total_cost": total_cost,
            "total_tokens": total_tokens,
            "usage_count": len(records)
        }
    
    # 预算管理
    def get_budget(self, model_id: str) -> Optional[Dict[str, Any]]:
        """获取预算配置"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM budgets WHERE model_id = ?', (model_id,))
        row = cursor.fetchone()
        
        self.pool.return_connection(conn)
        
        if row:
            return {
                "id": row[0],
                "model_id": row[1],
                "monthly_budget": row[2],
                "current_usage": row[3],
                "alert_threshold": row[4]
            }
        return None
    
    def set_budget(self, model_id: str, monthly_budget: float, alert_threshold: float = 0.8) -> None:
        """设置预算"""
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        now = datetime.now().isoformat()
        
        # 先检查是否存在
        budget = self.get_budget(model_id)
        
        if budget:
            cursor.execute('''
                UPDATE budgets 
                SET monthly_budget = ?, alert_threshold = ?, updated_at = ?
                WHERE model_id = ?
            ''', (monthly_budget, alert_threshold, now, model_id))
        else:
            cursor.execute('''
                INSERT INTO budgets 
                (id, model_id, monthly_budget, current_usage, alert_threshold, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (str(uuid.uuid4()), model_id, monthly_budget, 0.0, alert_threshold, now, now))
        
        conn.commit()
        self.pool.return_connection(conn)
    
    def update_current_usage(self, model_id: str) -> None:
        """更新当前使用量"""
        usage = self.get_monthly_usage(model_id)
        
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE budgets 
            SET current_usage = ?, updated_at = ?
            WHERE model_id = ?
        ''', (usage["total_cost"], datetime.now().isoformat(), model_id))
        
        conn.commit()
        self.pool.return_connection(conn)


# 全局数据库实例
db = DatabaseManager()
