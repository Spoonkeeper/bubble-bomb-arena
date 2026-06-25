# 炸爽彬彬堂 MVP

原创 PC 网页端 2D 俯视角 Q 版泡泡炸弹闯关游戏。使用 HTML、CSS、JavaScript 与 Phaser 3 CDN。

## 运行

在本目录启动任意静态服务器，然后打开本地地址：

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

如果你的 Python 启动器不可用，也可以用 VS Code Live Server、`npx serve` 或其他静态服务工具。

## 操作

- `WASD` 或方向键：移动
- `Space`：放置泡泡炸弹
- 开始页：选择 4 名原创角色之一
- 游戏目标：消灭 3 个 AI 敌人
- 敌人 AI：每次决策都先计算所有炸弹的爆炸范围；只要自己处于危险格，就优先寻找最近安全格并逃离。到达安全区后才恢复清障或战斗：无威胁时逐步找箱子开路，发现玩家或其它敌人后追击、投弹、躲避并抢能量球强化自己。

## 结构

- `src/config.js`：网格、时间、概率、角色、敌人配置
- `src/scenes/`：开始、游戏、结果场景
- `src/systems/`：地图、玩家、炸弹、爆炸、道具、AI、UI 系统
- `src/assets/AssetFactory.js`：MVP 原创程序化纹理，后续可替换为精细 sprite

## 扩展建议

- 给 4 名角色添加不同初始属性或技能。
- 把 `MapSystem.buildCells()` 改为读取关卡 JSON。
- 用真实 sprite sheet 替换 `AssetFactory.js` 里的程序化纹理。
- 给 `AISystem` 增加更强的路线搜索，例如 A*、记忆玩家位置、协同包夹。
