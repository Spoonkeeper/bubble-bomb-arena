# 炸爽彬彬堂 - 游戏启动器 (PowerShell)
# 如果 BAT 文件无法使用，右键此文件 → "使用 PowerShell 运行"

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $rootDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    炸爽彬彬堂 - 启动中..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检测 Python
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "已检测到 Python，正在启动本地服务器..." -ForegroundColor Green
        Start-Process "http://localhost:8000/index.html"
        Write-Host ""
        Write-Host "浏览器已自动打开，如果未跳转请手动访问：" -ForegroundColor Yellow
        Write-Host "http://localhost:8000/index.html" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "按 Ctrl+C 可以关闭服务器" -ForegroundColor Gray
        Write-Host ""
        python -m http.server 8000
        exit 0
    }
} catch {}

# 检测 py launcher
try {
    $pyVersion = py --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "已检测到 Python (py)，正在启动本地服务器..." -ForegroundColor Green
        Start-Process "http://localhost:8000/index.html"
        Write-Host ""
        Write-Host "浏览器已自动打开，如果未跳转请手动访问：" -ForegroundColor Yellow
        Write-Host "http://localhost:8000/index.html" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "按 Ctrl+C 可以关闭服务器" -ForegroundColor Gray
        Write-Host ""
        py -3 -m http.server 8000
        exit 0
    }
} catch {}

# 检测 Node.js
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "已检测到 Node.js，正在启动本地服务器..." -ForegroundColor Green
        Start-Process "http://localhost:4173/index.html"
        Write-Host ""
        Write-Host "浏览器已自动打开，如果未跳转请手动访问：" -ForegroundColor Yellow
        Write-Host "http://localhost:4173/index.html" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "按 Ctrl+C 可以关闭服务器" -ForegroundColor Gray
        Write-Host ""
        node tools/static-server.mjs . 4173
        exit 0
    }
} catch {}

# 都没找到
Write-Host "[错误] 未检测到 Python 或 Node.js！" -ForegroundColor Red
Write-Host ""
Write-Host "请选择以下方式之一：" -ForegroundColor Yellow
Write-Host ""
Write-Host "方案1：安装 Python 3.x（推荐）" -ForegroundColor White
Write-Host "       https://www.python.org/downloads/" -ForegroundColor Cyan
Write-Host ""
Write-Host "方案2：安装 Node.js" -ForegroundColor White
Write-Host "       https://nodejs.org/" -ForegroundColor Cyan
Write-Host ""
Write-Host "方案3：使用 VS Code 的 Live Server 插件" -ForegroundColor White
Write-Host "       右键 index.html → Open with Live Server" -ForegroundColor Cyan
Write-Host ""
Write-Host "方案4：使用 npx serve" -ForegroundColor White
Write-Host "       在终端中运行：npx serve ." -ForegroundColor Cyan
Write-Host ""
Read-Host "按 Enter 键退出"
exit 1
