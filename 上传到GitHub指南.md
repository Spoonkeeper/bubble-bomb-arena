# 🚀 上传《炸爽彬彬堂》到 GitHub 指南

## 准备工作

1. **注册 GitHub 账号**：去 [github.com](https://github.com) 注册（如果还没有）
2. **下载 GitHub Desktop**：https://desktop.github.com/ （推荐新手，图形界面操作）

---

## 方式一：使用 GitHub Desktop（推荐）

### 第一步：安装并登录
1. 安装 GitHub Desktop，打开
2. 点 `Sign in to GitHub.com`，用你的 GitHub 账号登录
3. 配置姓名和邮箱（按提示填写）

### 第二步：创建本地仓库
1. 点菜单 `File → New repository...`
2. 填写：
   - **Name**: `zha-shuang-bin-bin-tang`（或你喜欢的英文名）
   - **Description**: `炸爽彬彬堂 - 原创 2D 俯视角泡泡炸弹游戏 (Phaser 3)`
   - **Local path**: 选择本目录的**父文件夹**（不要选游戏目录本身）
   - **Git ignore**: 选择 `Custom`（我们已有现成的 `.gitignore`）
3. 点 `Create repository`

### 第三步：添加文件
1. 在 GitHub Desktop 中会看到一个空的仓库
2. 点右上角的仓库名 → `Open in Explorer`（打开文件夹）
3. **把游戏文件夹里的所有文件复制粘贴到这个新仓库文件夹里**（注意不要复制 `.reasonix/` — 已被 `.gitignore` 排除）
4. 回到 GitHub Desktop，你会看到所有待提交的文件列表

### 第四步：提交并发布
1. 在左下角填写：
   - **Summary**（必填）：`初次提交：炸爽彬彬堂完整游戏`
   - **Description**（可选）：`Phaser 3 泡泡炸弹闯关游戏，4 英雄 3 地图`
2. 点 `Commit to main`
3. 点右上角的 `Publish repository`
4. 弹窗选择：
   - **Keep this code private** — 选或不选（公开仓库所有人都能看到）
   - 点 `Publish`

### 第五步：完成 ✅
打开 `https://github.com/你的用户名/zha-shuang-bin-bin-tang` 就能看到你的仓库了！

---

## 方式二：使用网页版 + 压缩包（最简单，不用装软件）

1. 打开 https://github.com ，登录后点绿色的 `New` 按钮
2. 填写仓库名和描述，点 `Create repository`
3. **把游戏目录压缩成 ZIP**（右键 → 发送到 → 压缩文件夹）
4. 在新仓库页面点 `Add file → Upload files`
5. 把压缩包里的文件**拖拽进去**（注意不要把压缩包本身拖进去）
6. 点 `Commit changes`

---

## 上传后的下一步

上传后别人（或你自己在另一台电脑）可以通过以下方式运行：

```bash
# 克隆仓库
git clone https://github.com/你的用户名/zha-shuang-bin-bin-tang.git

# 进入目录
cd zha-shuang-bin-bin-tang

# 启动服务器（需要安装 Python）
python -m http.server 8000

# 浏览器打开 http://localhost:8000/index.html
```

或者直接双击 `启动游戏.bat`（Windows）。

---

## 上传的文件说明

| 内容 | 说明 |
|------|------|
| `index.html` + `styles.css` | 游戏入口页面 |
| `src/` | 全部游戏源码（14 个 JS 文件） |
| `assets/` | 游戏图片素材（约 80 个 PNG） |
| `启动游戏.bat` / `启动说明.html` | Windows 启动器 |
| `游戏说明书.md` | 游戏操作手册 |
| `tools/` | 构建、测试、切图工具 |
| `.gitignore` | 已配置排除多余文件 |

> ✅ `.gitignore` 已配置排除：运行时日志、临时图片、素材源文件（alpha/source）、个人文档、Reasonix 配置等共计约 50+ 个不需要上传的文件。
