@echo off

:: 启动脚本 - 职场技能包大师
echo === 职场技能包大师启动脚本 ===

:: 检查Python环境
echo 检查Python环境...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Python 未安装
    pause
    exit /b 1
)

:: 检查Node.js环境
echo 检查Node.js环境...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Node.js 未安装
    pause
    exit /b 1
)

:: 创建虚拟环境
if not exist "venv" (
    echo 创建Python虚拟环境...
    python -m venv venv
)

:: 激活虚拟环境
echo 激活Python虚拟环境...
call venv\Scripts\activate.bat

:: 安装Python依赖
echo 安装Python依赖...
pip install -r requirements.txt

:: 安装前端依赖
echo 安装前端依赖...
npm install

:: 启动后端服务
echo 启动后端服务...
start "后端服务" /min cmd /c "cd backend && python main.py"

:: 等待后端服务启动
echo 等待后端服务启动...
ping 127.0.0.1 -n 4 >nul

:: 启动前端服务
echo 启动前端服务...
start "前端服务" cmd /c "npm run dev"

:: 显示状态
echo === 服务启动完成 ===
echo 后端服务运行在: http://localhost:8000
echo 前端服务运行在: http://localhost:5173
echo.
echo 服务已在后台启动
 echo 按任意键退出此窗口

:: 等待用户输入
pause >nul