@echo off
chcp 65001 >nul
title 炸爽彬彬堂 - 游戏启动器
echo ========================================
echo     炸爽彬彬堂 - 启动中...
echo ========================================
echo.

cd /d "%~dp0"

:: 尝试多种 Python 检测方式
python --version >nul 2>&1
if %errorlevel%==0 goto :run_python

py --version >nul 2>&1
if %errorlevel%==0 goto :run_py

python3 --version >nul 2>&1
if %errorlevel%==0 goto :run_python3

:: 检查 Node.js
node --version >nul 2>&1
if %errorlevel%==0 goto :run_node

:: 都没找到
echo [错误] 未检测到 Python 或 Node.js！
echo.
echo 请选择以下方式之一：
echo.
echo 方案1：安装 Python 3.x（推荐）
echo       https://www.python.org/downloads/
echo.
echo 方案2：安装 Node.js
echo       https://nodejs.org/
echo.
echo 方案3：使用 VS Code 的 Live Server 插件
echo       右键 index.html → Open with Live Server
echo.
echo 方案4：使用任意静态服务器工具 (npx serve / http-server 等)
echo.
pause
exit /b 1

:run_python
echo 已检测到 Python，正在启动本地服务器...
start http://localhost:8000/index.html
echo.
echo 浏览器已自动打开，如果未跳转请手动访问：
echo http://localhost:8000/index.html
echo.
echo 按 Ctrl+C 可以关闭服务器
echo.
python -m http.server 8000
pause
exit /b 0

:run_py
echo 已检测到 Python（py 命令），正在启动本地服务器...
start http://localhost:8000/index.html
echo.
echo 浏览器已自动打开，如果未跳转请手动访问：
echo http://localhost:8000/index.html
echo.
echo 按 Ctrl+C 可以关闭服务器
echo.
py -3 -m http.server 8000
pause
exit /b 0

:run_python3
echo 已检测到 Python 3，正在启动本地服务器...
start http://localhost:8000/index.html
echo.
echo 浏览器已自动打开，如果未跳转请手动访问：
echo http://localhost:8000/index.html
echo.
echo 按 Ctrl+C 可以关闭服务器
echo.
python3 -m http.server 8000
pause
exit /b 0

:run_node
echo 已检测到 Node.js，正在启动本地服务器...
start http://localhost:4173/index.html
echo.
echo 浏览器已自动打开，如果未跳转请手动访问：
echo http://localhost:4173/index.html
echo.
echo 按 Ctrl+C 可以关闭服务器
echo.
node tools/static-server.mjs . 4173
pause
exit /b 0
