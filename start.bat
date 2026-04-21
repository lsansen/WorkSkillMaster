@echo off

:: 启动脚本 - 职场技能包大师
echo === 职场技能包大师启动脚本 ===
echo.

:: 让用户选择下载位置
echo 请选择项目安装位置：
echo 1. 当前目录
echo 2. 自定义目录
echo.
set /p choice=请输入选项 (1/2): 

if "%choice%"=="2" (
    set /p install_dir=请输入自定义安装目录: 
    if not exist "%install_dir%" (
        mkdir "%install_dir%"
    )
    cd "%install_dir%"
    echo 已切换到安装目录: %cd%
    echo.
)

:: 检查Python环境
echo 检查Python环境...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Python 未安装
    echo.
    set /p install_python=是否需要安装Python？ (Y/N): 
    if /i "%install_python%"=="Y" (
        echo 正在打开Python下载页面...
        start https://www.python.org/downloads/
        echo 请下载并安装Python 3.10或更高版本，然后重新运行此脚本
        pause
        exit /b 1
    ) else (
        echo 请安装Python后重新运行此脚本
        pause
        exit /b 1
    )
) else (
    python --version
)
echo.

:: 检查Node.js环境
echo 检查Node.js环境...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Node.js 未安装
    echo.
    set /p install_node=是否需要安装Node.js？ (Y/N): 
    if /i "%install_node%"=="Y" (
        echo 正在打开Node.js下载页面...
        start https://nodejs.org/en/download/
        echo 请下载并安装Node.js 16.0或更高版本，然后重新运行此脚本
        pause
        exit /b 1
    ) else (
        echo 请安装Node.js后重新运行此脚本
        pause
        exit /b 1
    )
) else (
    npm --version
)
echo.

:: 检查项目文件是否存在
if not exist "requirements.txt" (
    echo 错误: 项目文件不存在，正在克隆项目...
    echo.
    git clone https://github.com/lsansen/WorkSkillMaster .
    if %errorlevel% neq 0 (
        echo 错误: 克隆项目失败，请手动下载项目
        pause
        exit /b 1
    )
    echo 项目克隆成功！
    echo.
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