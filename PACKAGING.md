# WorkSkillMaster 项目打包配置

## 1. Electron打包配置

### 1.1 安装Electron依赖

首先，需要安装Electron相关依赖：

```bash
npm install electron electron-builder --save-dev
```

### 1.2 创建Electron主进程文件

创建 `electron/main.js` 文件：

```javascript
const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  // 加载前端构建后的文件
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // 打开开发者工具（可选）
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  // 创建系统托盘
  createTray();
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/favicon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setToolTip('WorkSkillMaster');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
```

### 1.3 更新package.json配置

在 `package.json` 文件中添加Electron相关配置：

```json
{
  "name": "workskillmaster",
  "version": "1.0.0",
  "description": "AI职场全能助手",
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "electron:dev": "electron .",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.workskillmaster.app",
    "productName": "WorkSkillMaster",
    "copyright": "Copyright © 2024 WorkSkillMaster",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "electron/**/*",
      "dist/**/*"
    ],
    "mac": {
      "target": [
        "dmg",
        "zip"
      ],
      "icon": "public/app-icon.icns"
    },
    "win": {
      "target": [
        "nsis",
        "portable"
      ],
      "icon": "public/app-icon.ico"
    },
    "linux": {
      "target": [
        "AppImage",
        "deb"
      ],
      "icon": "public/app-icon.png"
    }
  }
}
```

### 1.4 创建应用图标

在 `public/` 目录下创建应用图标：
- `app-icon.ico`（Windows图标）
- `app-icon.icns`（MacOS图标）
- `app-icon.png`（Linux图标）

## 2. Windows和MacOS版本的打包脚本

### 2.1 Windows打包脚本

创建 `build-windows.bat` 文件：

```batch
@echo off

rem 切换到项目根目录
cd /d %~dp0

echo 开始构建Windows版本...

rem 安装依赖
npm install

rem 构建前端
npm run build

rem 构建Electron应用
npm run electron:build -- --win

echo Windows版本构建完成！
echo 构建结果位于 dist-electron 目录

pause
```

### 2.2 MacOS打包脚本

创建 `build-macos.sh` 文件：

```bash#!/bin/bash

# 切换到项目根目录
cd "$(dirname "$0")"

echo "开始构建MacOS版本..."

# 安装依赖
npm install

# 构建前端
npm run build

# 构建Electron应用
npm run electron:build -- --mac

echo "MacOS版本构建完成！"
echo "构建结果位于 dist-electron 目录"
```

### 2.3 通用打包脚本

创建 `build-all.sh` 文件：

```bash#!/bin/bash

# 切换到项目根目录
cd "$(dirname "$0")"

echo "开始构建所有版本..."

# 安装依赖
npm install

# 构建前端
npm run build

# 构建Windows版本
echo "构建Windows版本..."
npm run electron:build -- --win

# 构建MacOS版本
echo "构建MacOS版本..."
npm run electron:build -- --mac

# 构建Linux版本
echo "构建Linux版本..."
npm run electron:build -- --linux

echo "所有版本构建完成！"
echo "构建结果位于 dist-electron 目录"
```

## 3. 打包说明

### 3.1 环境要求

- **Node.js** 16.0+ 
- **npm** 7.0+ 
- **Python** 3.10+（用于后端）
- **Windows**：需要安装Visual Studio Build Tools
- **MacOS**：需要安装Xcode Command Line Tools

### 3.2 构建步骤

1. **准备工作**
   - 确保所有依赖已安装
   - 确保前端代码已构建
   - 确保后端服务能正常运行

2. **Windows构建**
   - 运行 `build-windows.bat` 脚本
   - 构建结果将生成在 `dist-electron` 目录

3. **MacOS构建**
   - 运行 `build-macos.sh` 脚本
   - 构建结果将生成在 `dist-electron` 目录

4. **所有平台构建**
   - 运行 `build-all.sh` 脚本
   - 构建结果将生成在 `dist-electron` 目录

### 3.3 打包配置说明

#### Electron配置选项

- **appId**：应用的唯一标识符
- **productName**：应用名称
- **copyright**：版权信息
- **directories.output**：构建输出目录
- **files**：需要包含的文件
- **mac.target**：MacOS构建目标格式
- **win.target**：Windows构建目标格式
- **linux.target**：Linux构建目标格式

#### 构建目标说明

- **Windows**：
  - `nsis`：Windows安装程序
  - `portable`：便携式可执行文件

- **MacOS**：
  - `dmg`：MacOS磁盘镜像
  - `zip`：ZIP压缩包

- **Linux**：
  - `AppImage`：Linux通用应用格式
  - `deb`：Debian包

### 3.4 运行打包后的应用

#### Windows
- 双击 `WorkSkillMaster Setup.exe` 安装应用
- 或直接运行 `WorkSkillMaster.exe` 便携式版本

#### MacOS
- 双击 `WorkSkillMaster.dmg` 挂载磁盘镜像
- 将 `WorkSkillMaster.app` 拖放到应用程序文件夹
- 双击 `WorkSkillMaster.app` 运行应用

#### Linux
- 双击 `WorkSkillMaster-*.AppImage` 运行应用
- 或使用 `dpkg -i WorkSkillMaster-*.deb` 安装Debian包

### 3.5 注意事项

1. **后端服务**：Electron应用默认会启动内置的后端服务，无需单独运行后端服务器。

2. **模型配置**：首次运行应用时，需要在设置页面配置AI模型。

3. **数据存储**：应用数据存储在用户目录的 `AppData/Roaming/WorkSkillMaster`（Windows）或 `~/Library/Application Support/WorkSkillMaster`（MacOS）目录。

4. **性能优化**：对于大型文件处理，建议使用本地Ollama模型以获得更好的性能。

5. **安全注意**：API密钥存储在本地加密数据库中，确保安全。

## 4. 故障排除

### 4.1 构建失败

- **依赖问题**：运行 `npm install` 重新安装依赖
- **权限问题**：以管理员权限运行构建脚本
- **环境问题**：确保已安装所有必要的构建工具

### 4.2 应用运行失败

- **端口占用**：确保端口8000未被占用
- **模型配置**：检查模型配置是否正确
- **网络连接**：确保网络连接正常（使用云端模型时）

### 4.3 性能问题

- **内存使用**：关闭不必要的应用程序
- **模型选择**：对于复杂任务，使用更强大的模型
- **文件大小**：限制文件上传大小，避免处理过大的文件

## 5. 发布流程

1. **版本号**：更新 `package.json` 中的版本号
2. **构建**：运行构建脚本生成所有平台的安装包
3. **测试**：在各平台测试应用功能
4. **发布**：将构建结果上传到GitHub Releases
5. **更新日志**：编写详细的更新日志

---

**WorkSkillMaster - 让AI助力职场，让工作更高效！**