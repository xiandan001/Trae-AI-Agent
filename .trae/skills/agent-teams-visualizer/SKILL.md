---
name: "agent-teams-visualizer"
description: "像素风格 Agent Teams 可视化界面 - 实时展示 Agent 工作状态、消息流、任务进度"
---

# Agent Teams 可视化界面

## 🎮 概述

这是一个像素风格的 Agent Teams 可视化界面，灵感来自 OpenClaw 的像素办公室设计。它可以**实时监听**并展示：

- **Agent 工作状态** - 每个 Agent 的当前状态（工作中/等待/已完成）
- **消息流** - Agent 之间的消息传递动画
- **任务进度** - 整体任务进度条
- **投票结果** - 三决策师投票可视化

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

## 🖥️ 界面预览

```
┌─────────────────────────────────────────────────────────────────────┐
│  🏢 Agent Teams Office - TASK-001                   ⏱️ 00:15:32    │
│  🟢 Connected                                        Auto: 2s      │
├─────────────────────────────────────────────────────────────────────┤
│  📋 Lead  →  📝 Plan  →  🗳️ 投票  →  ⚙️ 分析  →  📝 Review  →  🎯 决策 │
│     ✅         ✅          🔄          ⏸️          ⏸️          ⏸️    │
├─────────────────────────────────────────────────────────────────────┤
│  �️ Decision Room                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │
│  │ 🔧 Tech  │  │ 💼 Bus   │  │ ⚠️ Risk  │                          │
│  │ 🔄 Work  │  │ 🔄 Work  │  │ 🔄 Work  │                          │
│  │ 🗳️ A     │  │ 🗳️ B     │  │ 🗳️ A     │                          │
│  └──────────┘  └──────────┘  └──────────┘                          │
├─────────────────────────────────────────────────────────────────────┤
│  📨 Message Flow (实时更新)                                         │
│  [10:12:30] Tech → Lead: "🗳️ 投票: 方案A"                           │
│  [10:12:35] Business → Lead: "🗳️ 投票: 方案B"                       │
│  [10:12:40] Risk → Lead: "🗳️ 投票: 方案A"                           │
│  [10:13:00] Lead → All: "📢 方案A获胜 (2:1)"                        │
├─────────────────────────────────────────────────────────────────────┤
│  📊 Progress: ████████████████░░░░░░░░ 60%                          │
│  Phase 2.5: 三决策师投票中                                           │
└─────────────────────────────────────────────────────────────────────┘
```

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `R` | 手动刷新 |
| `P` | 暂停/恢复自动刷新 |
| `D` | 启动 Demo 模式 |

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
    ├── index.html
    ├── style.css
    └── script.js
```

## 🔧 执行步骤

### Step 1: 准备可视化环境

```python
# 复制可视化文件到任务目录
import shutil

def setup_visualizer(task_id):
    src = ".trae/skills/agent-teams-visualizer/assets/"
    dst = f".trae/agent-teams/{task_id}/visualizer/"
    shutil.copytree(src, dst)
```

### Step 2: 创建消息索引

```python
# 创建消息索引文件
def create_message_index(task_id):
    index = {
        "count": 0,
        "messages": []
    }
    Write(f".trae/agent-teams/{task_id}/messages/index.json", index)
```

### Step 3: 更新消息索引

```python
# 当有新消息时更新索引
def add_message_to_index(task_id, message_file):
    index = Read(f".trae/agent-teams/{task_id}/messages/index.json")
    index["count"] += 1
    index["messages"].append(message_file)
    Write(f".trae/agent-teams/{task_id}/messages/index.json", index)
```

### Step 4: 启动 HTTP 服务器

```python
# 启动本地服务器
RunCommand(
    "python -m http.server 8080",
    cwd=f".trae/agent-teams/{task_id}/visualizer/",
    blocking=False
)
```

### Step 5: 打开浏览器

```python
# 打开浏览器
import webbrowser
webbrowser.open(f"http://localhost:8080?task={task_id}")
```

## 🎯 强制规则

| 规则 | 描述 |
|------|------|
| rule_1 | 必须读取 state.json 获取当前状态 |
| rule_2 | 必须读取 messages/index.json 获取消息流 |
| rule_3 | 生成的 HTML 必须包含所有 Agent 状态 |
| rule_4 | 必须显示投票结果（如果有） |
| rule_5 | 必须支持自动刷新（每 2 秒） |
| rule_6 | **【新增】** 状态变化时才更新 UI（避免闪烁） |
| rule_7 | **【新增】** 必须支持 URL 参数指定 task_id |

## � API 接口

可视化界面提供 JavaScript API：

```javascript
// 手动更新 Agent 状态
AgentTeamsVisualizer.updateAgentStatus('lead', 'completed');

// 手动添加消息
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

// 手动刷新
AgentTeamsVisualizer.refreshData();

// 暂停/恢复自动刷新
AgentTeamsVisualizer.toggleAutoRefresh();
```
