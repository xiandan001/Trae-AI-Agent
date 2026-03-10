---
name: "agent-teams-visualizer"
description: "2D像素风格 Agent Teams 可视化界面 - 实时展示机器人角色工作状态、消息流、任务进度"
---

# Agent Teams 可视化界面 - 2D Pixel Edition v2.0

## 🎮 概述

这是一个 **2D 像素风格** 的 Agent Teams 可视化界面，采用复古游戏风格设计。每个 Agent 都是一个可爱的像素机器人角色，在虚拟办公室中活动工作。

### ✨ v2.0 新特性

| 特性 | 描述 |
|------|------|
| **🤖 像素机器人** | 每个 Agent 都有独特的像素机器人形象，带有天线、眼睛、屏幕等部件 |
| **🏃 动态动画** | 机器人会眨眼、挥手、走路，工作时屏幕闪烁 |
| **🏢 办公室场景** | Leader Office、Decision Room、Dev Lab、Support Center 等区域 |
| **📊 传送带消息** | 消息像传送带一样流动，带有滚动动画 |
| **🎉 完成庆祝** | 任务完成时触发彩纸动画和庆祝效果 |
| **🎨 彩色天线** | 不同角色有不同颜色的天线指示灯 |

## 🚀 自动启动

可视化界面会在 Agent Teams 启动时**自动启动**，无需手动操作。

```bash
# 启动 Agent Teams（自动启动可视化界面）
/agent-teams-orchestrator task-001
```

**自动执行流程：**
1. 创建任务目录结构
2. 复制可视化文件到 `visualizer/`
3. 创建 `messages/index.json` 消息索引
4. 启动 HTTP 服务器（后台运行，端口 8080）
5. **自动打开浏览器**显示可视化界面
6. 开始 Agent Teams 工作流

## 🤖 机器人角色设计

### 角色结构

每个机器人由以下部件组成：

```
     ◇  ← 天线（闪烁）
   ┌───┐
   │ ○ ○ │ ← 眼睛（眨眼）
   │ ─ │ ← 嘴巴
   └───┘
   ┌───┐
   │[■]│ ← 屏幕（扫描动画）
   │ 🎫│ ← 徽章（角色标识）
   └───┘
  ◇     ◇ ← 手臂（挥动）
   ┃   ┃
   ┃   ┃ ← 腿（走路）
```

### 角色颜色编码

| Agent | 天线颜色 | 边框颜色 | 徽章 |
|-------|---------|---------|------|
| **Leader** | 青色 | 青色 | 👑 |
| **Tech Decision** | 青色 | 青色 | 🔧 |
| **Business Decision** | 黄色 | 黄色 | 💼 |
| **Risk Decision** | 红色 | 红色 | ⚠️ |
| **Plan** | 紫色 | 紫色 | 📋 |
| **Framework** | 绿色 | 绿色 | ⚙️ |
| **System** | 橙色 | 橙色 | 🖥️ |
| **Data** | 粉色 | 粉色 | 💾 |
| **UI/UX** | 粉色 | 粉色 | 🎨 |
| **Build** | 橙色 | 橙色 | 📦 |
| **Device** | 绿色 | 绿色 | 📱 |
| **Code Reviewer** | 红色 | 红色 | 📝 |
| **QA** | 绿色 | 绿色 | 🧪 |

### 状态动画

| 状态 | 动画效果 |
|------|---------|
| **IDLE (待机)** | 头部轻微摇晃，眼睛缓慢眨眼 |
| **WORKING (工作中)** | 头部快速上下移动，眼睛颜色闪烁，屏幕快速扫描 |
| **COMPLETED (完成)** | 徽章发光，眼睛变绿 |
| **FAILED (失败)** | 眼睛变红 |

## 🏢 办公室布局

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 AGENT TEAMS          [TASK-001]     ⏱ 00:15:32  🟢     │
├─────────────────────────────────────────────────────────────┤
│  📋LEAD ─ 📝PLAN ─ 🗳️VOTE ─ ⚙️BUILD ─ 🔍REV ─ 🧪QA ─ 🎯FIN │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🗳️ DECISION │  │ 👔 LEADER   │  │ 📋 PLAN     │         │
│  │   ROOM      │  │   OFFICE    │  │   STATION   │         │
│  │  🤖🤖🤖     │  │    🤖       │  │   🤖        │         │
│  │ TECH BIZ RISK│  │  LEADER     │  │   PLAN      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌───────────────────────────────┐  ┌─────────────┐         │
│  │ 💻 DEV LAB                    │  │ 🔧 SUPPORT  │         │
│  │  🤖  🤖  🤖  🤖               │  │ 🤖🤖🤖🤖    │         │
│  │FRAME SYSTEM DATA UI/UX        │  │BUILD DEV REV QA│      │
│  └───────────────────────────────┘  └─────────────┘         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 📨 MESSAGE FLOW (传送带)                                 ││
│  │ ═══════════════════════════════════════════════════════ ││
│  │ [10:15:30] TECH → LEAD: "🗳️ PLAN A"                     ││
│  │ [10:15:35] BIZ → LEAD: "🗳️ PLAN B"                      ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  📊 PROGRESS ████████████████░░░░░░░░ 60%                    │
│  VOTING IN PROGRESS...                                      │
└─────────────────────────────────────────────────────────────┘
```

## 📊 实时监听机制

### 监听的数据源

```
.trae/agent-teams/{task-id}/
├── state.json              ← Agent 状态（每 2 秒轮询）
├── outputs/*.json          ← Agent 输出（投票结果等）
└── messages/
    ├── index.json          ← 消息索引
    └── *.json              ← 消息文件
```

### 轮询机制

| 数据 | 轮询间隔 | 说明 |
|------|---------|------|
| `state.json` | 2 秒 | 检测 Agent 状态变化 |
| `messages/index.json` | 2 秒 | 检测新消息 |
| `outputs/*.json` | 2 秒 | 检测投票结果 |

## 🎨 CSS 动画效果

### 关键动画

| 动画名称 | 效果 | 时长 |
|---------|------|------|
| `logo-bounce` | Logo 跳动 | 2s |
| `timer-pulse` | 计时器脉冲 | 1s |
| `status-blink` | 状态灯闪烁 | 1.5s |
| `node-pulse` | 阶段节点脉冲 | 1s |
| `head-bob` | 机器人头部摇晃 | 3s |
| `antenna-blink` | 天线闪烁 | 1s |
| `eye-blink` | 眼睛眨眼 | 4s |
| `arm-wave-left/right` | 手臂挥动 | 2s |
| `leg-walk-left/right` | 腿部走路 | 1s |
| `screen-scan` | 屏幕扫描 | 2s |
| `conveyor-move` | 传送带移动 | 2s |
| `progress-shine` | 进度条闪光 | 2s |

### 工作状态动画

```css
/* 工作中的机器人 */
.robot.working .robot-head {
    animation: head-working 0.5s ease-in-out infinite;
}

.robot.working .eye {
    background: var(--accent-green);
    animation: eye-working 0.3s ease-in-out infinite;
}

/* 完成的机器人 */
.robot.completed .badge {
    animation: badge-glow 1s ease-in-out infinite;
}
```

## 🔧 Orchestrator 集成代码

在 `agent-teams-orchestrator` 中，Phase 0 初始化时自动启动可视化：

```python
# Step 1: 复制可视化文件
copy_files(
  src=".trae/skills/agent-teams-visualizer/assets/",
  dst=".trae/agent-teams/{task-id}/visualizer/"
)

# Step 2: 启动 HTTP 服务器（后台运行）
command_result = RunCommand(
  command="python -m http.server 8080",
  cwd=".trae/agent-teams/{task-id}/visualizer/",
  blocking=False,
  command_type="web_server"
)

# Step 3: 打开浏览器显示可视化界面
OpenPreview(
  command_id=command_result.command_id,
  preview_url="http://localhost:8080?task={task-id}"
)
```

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `R` | 手动刷新 |
| `P` | 暂停/恢复自动刷新 |

## 📁 文件结构

```
.trae/agent-teams/{task-id}/
├── state.json              # Agent 状态文件
├── outputs/
│   ├── lead.json
│   ├── plan.json
│   ├── tech_decision.json
│   ├── business_decision.json
│   ├── risk_decision.json
│   └── decision_vote.json
├── messages/
│   ├── index.json          # 消息索引
│   ├── tech_decision_to_lead.json
│   └── ...
└── visualizer/
    ├── index.html          # 主页面（像素风格）
    ├── style.css           # 像素机器人样式
    └── script.js           # 动画控制脚本
```

## 🎯 强制规则

| 规则 | 描述 |
|------|------|
| rule_1 | 必须读取 state.json 获取当前状态 |
| rule_2 | 必须读取 messages/index.json 获取消息流 |
| rule_3 | 生成的 HTML 必须包含所有机器人角色 |
| rule_4 | 必须显示投票结果（如果有） |
| rule_5 | 必须支持自动刷新（每 2 秒） |
| rule_6 | 状态变化时才更新 UI（避免闪烁） |
| rule_7 | 必须支持 URL 参数指定 task_id |
| rule_8 | **【新增】** 机器人必须有完整的动画效果 |
| rule_9 | **【新增】** 任务完成时必须触发庆祝动画 |

## 📡 JavaScript API

可视化界面提供 JavaScript API：

```javascript
// 更新机器人状态
AgentTeamsVisualizer.updateRobotStatus('lead', 'completed');

// 添加消息
AgentTeamsVisualizer.addMessage({
    from: 'Tech',
    to: 'Lead',
    content: '投票完成',
    type: 'vote'
});

// 显示投票
AgentTeamsVisualizer.showVote('tech_decision', 'A');

// 更新进度
AgentTeamsVisualizer.updateProgress(75, 'Phase 3: 并行分析中');

// 显示最终决策
AgentTeamsVisualizer.showFinalDecision({
    decision: 'approve',
    code_quality_score: 85,
    test_coverage: '90%'
});

// 手动刷新
AgentTeamsVisualizer.refreshData();

// 暂停/恢复自动刷新
AgentTeamsVisualizer.toggleAutoRefresh();

// 显示任务完成
AgentTeamsVisualizer.showTaskCompleted(state);
```

## 🎉 完成庆祝效果

任务完成时会触发：

1. **彩纸动画** - 每个机器人发射彩色方块
2. **徽章发光** - 所有徽章开始闪烁
3. **状态更新** - 进度条变绿，显示 "MISSION COMPLETE!"
4. **消息广播** - 自动发送完成消息到传送带

## 🎨 设计规范

### 颜色主题

```css
--bg-dark: #0f0f23;      /* 深色背景 */
--bg-medium: #1a1a2e;    /* 中等背景 */
--bg-light: #252542;     /* 浅色背景 */
--accent-cyan: #00d4ff;  /* 青色强调 */
--accent-green: #39ff14; /* 绿色强调 */
--accent-yellow: #ffff00;/* 黄色强调 */
--accent-red: #ff0040;   /* 红色强调 */
--accent-purple: #bf00ff;/* 紫色强调 */
```

### 字体

- 主字体: `Press Start 2P` (Google Fonts)
- 像素风格，无抗锯齿
- 基础字号: 8px

### 边框

- 像素边框: 4px solid
- 无圆角 (border-radius: 0)
- 像素阴影: 4px 4px 0 rgba(0,0,0,0.5)
