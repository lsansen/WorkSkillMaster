#!/bin/bash

# 启动脚本 - 职场技能包大师

echo "=== 职场技能包大师启动脚本 ==="
echo

# 让用户选择下载位置
echo "请选择项目安装位置："
echo "1. 当前目录"
echo "2. 自定义目录"
echo
read -p "请输入选项 (1/2): " choice

if [ "$choice" == "2" ]; then
    read -p "请输入自定义安装目录: " install_dir
    if [ ! -d "$install_dir" ]; then
        mkdir -p "$install_dir"
    fi
    cd "$install_dir"
    echo "已切换到安装目录: $(pwd)"
    echo
fi

# 检查Python环境
echo "检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "错误: Python 3 未安装"
    echo
    read -p "是否需要安装Python？ (Y/N): " install_python
    if [ "$install_python" == "Y" ] || [ "$install_python" == "y" ]; then
        echo "正在打开Python下载页面..."
        if command -v open &> /dev/null; then
            open https://www.python.org/downloads/
        elif command -v xdg-open &> /dev/null; then
            xdg-open https://www.python.org/downloads/
        else
            echo "请访问 https://www.python.org/downloads/ 下载Python"
        fi
        echo "请下载并安装Python 3.10或更高版本，然后重新运行此脚本"
        read -p "按Enter键退出..."
        exit 1
    else
        echo "请安装Python后重新运行此脚本"
        read -p "按Enter键退出..."
        exit 1
    fi
else
    python3 --version
fi
echo

# 检查Node.js环境
echo "检查Node.js环境..."
if ! command -v npm &> /dev/null; then
    echo "错误: Node.js 未安装"
    echo
    read -p "是否需要安装Node.js？ (Y/N): " install_node
    if [ "$install_node" == "Y" ] || [ "$install_node" == "y" ]; then
        echo "正在打开Node.js下载页面..."
        if command -v open &> /dev/null; then
            open https://nodejs.org/en/download/
        elif command -v xdg-open &> /dev/null; then
            xdg-open https://nodejs.org/en/download/
        else
            echo "请访问 https://nodejs.org/en/download/ 下载Node.js"
        fi
        echo "请下载并安装Node.js 16.0或更高版本，然后重新运行此脚本"
        read -p "按Enter键退出..."
        exit 1
    else
        echo "请安装Node.js后重新运行此脚本"
        read -p "按Enter键退出..."
        exit 1
    fi
else
    npm --version
fi
echo

# 检查项目文件是否存在
if [ ! -f "requirements.txt" ]; then
    echo "错误: 项目文件不存在，正在克隆项目..."
    echo
    git clone https://github.com/lsansen/WorkSkillMaster .
    if [ $? -ne 0 ]; then
        echo "错误: 克隆项目失败，请手动下载项目"
        read -p "按Enter键退出..."
        exit 1
    fi
    echo "项目克隆成功！"
    echo
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
echo "前端服务运行在: http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户输入
wait $BACKEND_PID $FRONTEND_PID
