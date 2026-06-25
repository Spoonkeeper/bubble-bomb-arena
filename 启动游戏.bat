@echo off
chcp 65001 >nul
title 炸爽彬彬堂 - 游戏启动器
echo ========================================
echo     炸爽彬彬堂 - 启动中...
echo ========================================
echo.

cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel%==0 (
    echo 已检测到 Python，正在启动本地服务器...
    echo 启动成功后，请在浏览器中打开：http://localhost:8000/index.html
    echo.
    echo 按 Ctrl+C 可以关闭服务器
    echo.
    python -m http.server 8000
) else (
    where py >nul 2>&1
    if %errorlevel%==0 (
        echo 已检测到 Python（py 命令），正在启动本地服务器...
        echo 启动成功后，请在浏览器中打开：http://localhost:8000/index.html
        echo.
        echo 按 Ctrl+C 可以关闭服务器
        echo.
        py -3 -m http.server 8000
    ) else (
        echo [错误] 未检测到 Python！
        echo 请先安装 Python 3.x：https://www.python.org/downloads/
        echo.
        echo 或者：
        echo 1. 双击本脚本所在目录的 tools\build-bundle.py 可以先尝试构建
        echo 2. 访问 启动说明.html 查看更多启动方式
        echo.
        pause
        exit /b 1
    )
)
