#!/bin/bash

# 启动脚本 - 职场技能包大师

echo "=== 职场技能包大师启动脚本 ==="

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "错误: Python 3 未安装"
    exit 1
fi

# 检查Node.js环境
if ! command -v npm &> /dev/null; then
    echo "错误: Node.js 未安装"
    exit 1
fi

# 创建虚拟环境
if [ -d "venv" ]; then
    echo "删除旧的Python虚拟环境..."
    rm -rf venv
fi
echo "创建Python虚拟环境..."
python3 -m venv venv

# 激活虚拟环境
echo "激活Python虚拟环境..."
source venv/bin/activate

# 安装Python依赖
echo "安装Python依赖..."
export PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
pip install -r requirements.txt

# 安装前端依赖
echo "安装前端依赖..."
npm install

# 启动后端服务
echo "启动后端服务..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# 等待后端服务启动
echo "等待后端服务启动..."
sleep 3

# 启动前端服务
echo "启动前端服务..."
npm run dev &
FRONTEND_PID=$!

# 显示状态
echo "=== 服务启动完成 ==="
echo "后端服务运行在: http://localhost:8000"
echo "前端服务运行在: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户输入
wait $BACKEND_PID $FRONTEND_PID
