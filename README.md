# 💣 炸爽彬彬堂 — Bubble Bomb Arena

**原创 2D 俯视角 Q 版泡泡炸弹对战游戏** — HTML5 + Phaser 3

> 选英雄、放炸弹、炸对手！4 位独特英雄 × 3 张风格各异的地图，支持单挑 AI 或本地双人对战。

---

## ✨ 特色

- 🎮 **4 位英雄** — 暗影守卫、彬哥、可姐、火车头头，各有专属大招
- 🗺️ **3 张地图** — 炼狱（经典箱阵）、故土（陨石天降）、深渊（传送门 + 能量场）
- 🤖 **智能 AI** — 会计算爆炸范围、躲避炸弹、追击玩家、抢夺能量球
- 👥 **双人对战** — 同一键盘：P1 用 WASD，P2 用方向键
- 🎯 **道具系统** — 范围+1、炸弹+1、速度+1、护盾、能量球
- 🖼️ **双模式渲染** — 有 HTTP 服务器时自动加载高清 PNG 素材；直接打开也能用程序纹理完整运行

---

## 🚀 快速启动

### 方式 1（最推荐）：双击 `启动游戏.vbs` 💚

无需安装任何东西，双击即可自动启动服务器并打开游戏。

```
炸爽彬彬堂测试版/
├── 启动游戏.vbs     ← 双击这个！
├── 启动游戏.bat
├── 启动游戏.ps1
└── index.html
```

它会依次检测 `python` → `py` → `node`，找到后自动启动 HTTP 服务器并打开浏览器。如果什么都没装，会提示直接打开 `index.html`。

### 方式 2：双击 `启动游戏.bat`

功能同上，BAT 版本，支持 Python / Node.js 自动检测。

### 方式 3：右键 `启动游戏.ps1` → 使用 PowerShell 运行

### 方式 4：手动命令行

```bash
# 有 Python
python -m http.server 8000

# 有 Node.js
node tools/static-server.mjs . 4173

# VS Code Live Server / npx serve 等也行
```

然后浏览器打开 `http://localhost:8000/index.html`。

### ⚠️ 重要

**不要直接双击 `index.html`** — 浏览器会阻止加载本地图片，导致看不到高清素材。
不过就算你手滑双击了也不要紧：游戏会自动使用**程序生成的纹理**，保证完整可玩。

---

## 🎮 操作说明

| 按键 | 功能 |
|------|------|
| `W A S D` | 玩家 1 移动 |
| `↑ ← ↓ →` | 玩家 2 移动 |
| `空格` | 放置炸弹 |
| `Shift` | 释放英雄大招 |
| `Enter` | 开始游戏 / 确认 |

---

## 🦸 英雄

| 英雄 | 大招 | 定位 |
|------|------|------|
| **暗影泡泡守卫** 🟣 | 幽影穿行 — 4.5 秒穿墙穿弹 | 偷线、绕图、奇袭 |
| **盛趣泡泡彬哥** 🟠 | 灼焰领域 — 9 秒火焰区域 | 范围压制、追杀 |
| **字节泡泡可姐** 🔵 | 续命护场 — 5 秒无敌 | 容错、生存 |
| **火车泡泡头头** 🔷 | 动力全开 — 4.5 秒三倍速 | 高速冲线、正面突破 |

---

## 🗺️ 地图

| 地图 | 特点 |
|------|------|
| **炸爆炼狱** 🔴 | 经典箱阵，节奏稳定 |
| **破猛故土** 🟤 | 陨石天降，路线开阔 |
| **暗激深渊** 🟣 | 无障碍空场，双向传送门 + 能量场 |

---

## 📁 项目结构

```
├── index.html                 # 入口页面
├── styles.css                 # 页面样式
├── src/
│   ├── main.js                # Phaser 游戏配置
│   ├── config.js              # 网格 / 英雄 / 地图 / 道具配置
│   ├── game.bundle.js         # 打包后的游戏代码
│   ├── assets/
│   │   └── AssetFactory.js    # 纹理加载 + 程序化纹理生成
│   ├── scenes/                # 游戏场景
│   │   ├── StartScene.js
│   │   ├── MatchSetupScene.js
│   │   ├── MapSelectScene.js
│   │   ├── GameScene.js
│   │   └── ResultScene.js
│   ├── systems/               # 核心系统
│   │   ├── MapSystem.js       # 地图生成 & 碰撞
│   │   ├── PlayerSystem.js    # 玩家移动 & 状态
│   │   ├── BombSystem.js      # 炸弹放置 & 引信
│   │   ├── ExplosionSystem.js # 爆炸传播 & 破坏
│   │   ├── ItemSystem.js      # 道具掉落 & 拾取
│   │   ├── AISystem.js        # 敌人 AI（危险区躲避、寻路、追击）
│   │   ├── CombatSystem.js    # 伤害 & 治疗
│   │   ├── HeroAbilitySystem.js # 英雄大招
│   │   ├── MeteorSystem.js    # 陨石坠落
│   │   ├── PortalSystem.js    # 传送门
│   │   └── UISystem.js        # HUD 界面
│   ├── multiplayer/           # 多人匹配
│   │   ├── MatchConfig.js
│   │   ├── KeyboardInputRouter.js
│   │   └── CombatantRegistry.js
│   └── ui/
│       └── TechVisualKit.js   # UI 组件库
├── assets/                    # 游戏图片素材（~130 个 PNG）
├── tools/
│   ├── build-bundle.mjs       # JS 打包脚本
│   ├── static-server.mjs      # Node.js 静态服务器
│   └── *.test.mjs             # 测试文件
├── 启动游戏.vbs               # ✅ 推荐：双击启动（VBScript）
├── 启动游戏.bat               # Windows 批处理启动器
├── 启动游戏.ps1               # PowerShell 启动器
└── 启动说明.html              # 启动指引页面
```

---

## 🔧 开发者

### 构建

编辑源代码后，重新打包：

```bash
node tools/build-bundle.mjs
```

### 测试

```bash
node tools/*.test.mjs
```

### 技术栈

- **Phaser 3.80.1** — 游戏框架
- **Vanilla JavaScript** — ES modules → 打包为 bundle
- **Node.js** — 打包脚本 + 静态服务器
- **Python 3** — 可选的 HTTP 服务器
- **程序化纹理 + PNG 素材** — 双轨渲染，无服务器也能玩

---

## 📜 License

MIT
