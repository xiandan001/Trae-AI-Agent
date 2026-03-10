---
name: "agent-teams-orchestrator"
description: "Android 应用开发 Agent Teams 总管理调度器，实现共享任务列表、实时消息系统、teammate 模式，自动启动可视化界面"
---

# Android Agent Teams 总管理调度器

## 🚀 快速开始

```bash
# 启动 Agent Teams（自动启动可视化界面）
/agent-teams-orchestrator

# 指定任务 ID
/agent-teams-orchestrator task-001
```

**启动后会自动：**
1. 创建任务目录结构
2. 启动可视化界面（HTTP 服务器）
3. 打开浏览器显示像素风格监控界面
4. 开始 Agent Teams 工作流

## 🎯 三大核心功能实现

### 功能一：共享任务列表（TodoWrite）

```
┌─────────────────────────────────────────────────────────────────┐
│              共享任务列表 = TodoWrite 实现                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  用户实时可见的任务状态：                                          │
│  ─────────────────────                                           │
│  ☑ [Stage 1] Plan Agent 制定计划              ✅ 已完成          │
│  ⏳ [Stage 2.1] Framework 分析                 🔄 进行中          │
│  ⏳ [Stage 2.2] System 分析                    🔄 进行中          │
│  ⬜ [Stage 3] Code Reviewer                    ⏸️ 等待中          │
│  ⬜ [Stage 4] Test/QA                          ⏸️ 等待中          │
│  ⬜ [Stage 5] Lead 最终决策                     ⏸️ 等待中          │
│                                                                  │
│  实现方式：                                                       │
│  TodoWrite(todos=[                                              │
│    {id: "stage-1", content: "[Stage 1] Plan Agent",              │
│     status: "completed", priority: "high"},                      │
│    {id: "stage-2.1", content: "[Stage 2.1] Framework 分析",      │
│     status: "in_progress", priority: "high"},                    │
│    ...                                                           │
│  ])                                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 功能二：实时消息系统（文件系统）

```
┌─────────────────────────────────────────────────────────────────┐
│              实时消息系统 = 文件系统 + 轮询                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  消息文件结构：                                                   │
│  .trae/agent-teams/{task-id}/messages/                          │
│  ├── {agent}_to_lead.json      # Agent → Lead                   │
│  ├── {from}_to_{to}.json       # Agent → Agent                  │
│  └── broadcast.json            # Lead 广播                       │
│                                                                  │
│  消息格式：                                                       │
│  {                                                               │
│    "message_id": "msg-001",                                      │
│    "from": "framework-agent",                                    │
│    "to": "lead",                                                 │
│    "type": "message|broadcast|shutdown_request",                 │
│    "content": "分析完成，发现...",                                 │
│    "summary": "Framework Agent 分析完成",                        │
│    "timestamp": "2026-03-02T10:00:00Z",                          │
│    "read": false                                                 │
│  }                                                               │
│                                                                  │
│  用户可见消息面板：                                                │
│  ────────────────                                                │
│  📨 消息面板                                                     │
│  [10:05:00] Plan Agent → Lead: "计划制定完成"                    │
│  [10:10:30] Framework Agent → Lead: "分析完成"                   │
│  [10:10:40] Framework → System: "跨领域线索同步"                 │
│  [10:15:00] Lead → Broadcast: "Stage 2 Gate PASS"               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 功能三：Teammate 模式（Task + 共享状态）

```
┌─────────────────────────────────────────────────────────────────┐
│              Teammate 模式 = Task + 共享状态                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Lango-Agent-Teams              Trae 实现                        │
│  ──────────────────             ──────────                       │
│  Task(team_name, name)   →   Task(subagent_type) + 状态文件     │
│  teammate 加入团队        →   SubAgent 读写共享文件               │
│  共享上下文               →   state.json 共享                    │
│  消息传递                  →   messages/*.json                   │
│                                                                  │
│  SubAgent 启动参数：                                              │
│  Task(                                                           │
│    subagent_type="search",                                       │
│    description="Framework Agent 分析",                           │
│    query="""                                                     │
│      你是 Framework Agent，team_name=case-001                    │
│                                                                  │
│      【强制步骤】                                                 │
│      1. 读取 .trae/agent-teams/case-001/state.json              │
│      2. 读取 outputs/plan.json 获取计划                          │
│      3. 执行分析任务                                              │
│      4. 写入 outputs/framework.json                              │
│      5. 写入 messages/framework_to_lead.json                     │
│      6. 更新 state.json 中 agents.framework.status              │
│    """                                                           │
│  )                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 任务类型路由（需求 vs 缺陷）

### Feature (需求) 工作流

```
需求任务
    │
    ▼
┌─────────────────────────────────────────┐
│ Phase 1: Lead Agent (需求评估)            │
│ Skills: demand-manager                   │
│ TodoWrite: [Stage 1] Lead 评估            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 2: Plan Agent (需求规划 + 多方案)   │
│ Skills: demand-implementation            │
│ 输出: plan.json (包含多个方案)            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 2.5: 三决策师投票 ★ 新增            │
│ 并行启动 3 个决策师 Agent                 │
│ ┌─────────────────────────────────────┐ │
│ │ Task(技术决策师)  ─┐                 │ │
│ │ Task(业务决策师)  ─┼─ 并行投票        │ │
│ │ Task(风险决策师)  ─┘                 │ │
│ └─────────────────────────────────────┘ │
│ 输出: decision_vote.json (投票结果)      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 3: 并行分析层（基于选定方案）        │
│ TodoWrite: 同时标记多个任务 in_progress   │
│                                          │
│ Task(Framework Agent) ─┐                 │
│ Task(System Agent)    ─┼─ 并行执行        │
│ Task(Data Agent)      ─┘                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 4: Code Reviewer                   │
│ Skills: code-compliance-checker          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 5: QA Agent                        │
│ Skills: test-executor                    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 6: Lead Agent (最终决策)            │
│ Skills: gerrit-committer                 │
└─────────────────────────────────────────┘
```

### Defect (缺陷) 工作流

```
缺陷任务
    │
    ▼
┌─────────────────────────────────────────┐
│ Phase 1: Lead Agent (缺陷评估)            │
│ Skills: defect-analyzer                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 2: Plan Agent (修复规划 + 多方案)   │
│ Skills: defect-analyzer                  │
│ 输出: plan.json (包含多个修复方案)        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 2.5: 三决策师投票 ★ 新增            │
│ 并行启动 3 个决策师 Agent                 │
│ 输出: decision_vote.json (投票结果)      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 3: 并行分析层（基于选定方案）        │
│ Task(Framework Agent) ─┐                 │
│ Task(System Agent)    ─┼─ 并行执行        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ Phase 4-6: Review → QA → 决策             │
│ Skills: code-compliance-checker,         │
│         test-executor,                   │
│         defect-document-generator        │
└─────────────────────────────────────────┘
```

---

## 🗳️ 三决策师投票机制

### 决策师角色

| 决策师 | 角色定位 | 决策维度 |
|--------|---------|---------|
| **技术决策师** | 技术可行性评估 | 技术可行性、架构影响、实现复杂度、可维护性 |
| **业务决策师** | 业务价值评估 | 业务价值、用户体验、市场匹配、交付速度 |
| **风险决策师** | 风险控制评估 | 安全风险、稳定性影响、合规性、回退风险 |

### 投票流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    三决策师投票流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 2.5: 三决策师投票                                         │
│  ─────────────────────────                                      │
│                                                                  │
│  Step 1: 并行启动三个决策师                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Task(subagent_type="search", description="技术决策师")    │   │
│  │ Task(subagent_type="search", description="业务决策师")    │   │
│  │ Task(subagent_type="search", description="风险决策师")    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Step 2: 收集投票结果                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ outputs/tech_decision.json      → 技术决策师投票          │   │
│  │ outputs/business_decision.json  → 业务决策师投票          │   │
│  │ outputs/risk_decision.json      → 风险决策师投票          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Step 3: 汇总投票结果                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Write("outputs/decision_vote.json", {                    │   │
│  │   "votes": {                                             │   │
│  │     "tech_decision": "A",                                │   │
│  │     "business_decision": "B",                            │   │
│  │     "risk_decision": "A"                                 │   │
│  │   },                                                     │   │
│  │   "result": "A",  // 2:1 获胜                            │   │
│  │   "confidence": 0.85                                     │   │
│  │ })                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 投票结果处理规则

#### 情况 1: 一致通过 (3:0)

```json
{
  "votes": {
    "tech_decision": "A",
    "business_decision": "A",
    "risk_decision": "A"
  },
  "result": "A",
  "confidence": 1.0,
  "reason": "三个决策师一致选择方案A"
}
```

#### 情况 2: 多数通过 (2:1)

```json
{
  "votes": {
    "tech_decision": "A",
    "business_decision": "B",
    "risk_decision": "A"
  },
  "result": "A",
  "confidence": 0.75,
  "reason": "技术决策师和风险决策师选择方案A（2票），业务决策师选择方案B（1票）"
}
```

#### 情况 3: 平票 (1:1:1) - 需要特殊处理

```json
{
  "votes": {
    "tech_decision": "A",
    "business_decision": "B",
    "risk_decision": "C"
  },
  "result": "pending",
  "confidence": 0.0,
  "tie_breaker_required": true,
  "reason": "三个决策师各选不同方案，需要启动平票处理机制"
}
```

### 平票处理机制 (1:1:1)

```
┌─────────────────────────────────────────────────────────────────┐
│                    平票处理机制                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  触发条件: 三个决策师各选择不同方案 (1:1:1)                        │
│                                                                  │
│  处理步骤:                                                       │
│  ─────────                                                      │
│                                                                  │
│  Step 1: 检查风险决策师是否行使否决权                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ if (risk_decision.veto == true) {                       │   │
│  │   // 被否决的方案直接排除                                │   │
│  │   exclude_plan = risk_decision.veto_plan                │   │
│  │   // 在剩余方案中重新投票                                │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Step 2: 综合评分计算                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 计算每个方案的综合得分:                                   │   │
│  │                                                          │   │
│  │ total_score = (tech_score * 0.35) +                      │   │
│  │              (business_score * 0.35) +                   │   │
│  │              (risk_score * 0.30)                         │   │
│  │                                                          │   │
│  │ 选择综合得分最高的方案                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Step 3: 若综合得分相同，启动 Lead 仲裁                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ if (综合得分相同) {                                       │   │
│  │   // Lead Agent 做最终仲裁                               │   │
│  │   Task(subagent_type="search", description="Lead 仲裁")  │   │
│  │   // Lead 综合考虑所有因素做出最终决定                    │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Step 4: 用户确认（可选）                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ if (用户选择参与决策) {                                   │   │
│  │   AskUserQuestion(                                       │   │
│  │     questions=[{                                         │   │
│  │       header: "方案选择",                                 │   │
│  │       question: "三个决策师意见不一致，请选择方案",        │   │
│  │       options: [                                         │   │
│  │         {"label": "方案A", "description": tech_reason},  │   │
│  │         {"label": "方案B", "description": business_reason},│   │
│  │         {"label": "方案C", "description": risk_reason}   │   │
│  │       ]                                                  │   │
│  │     }]                                                   │   │
│  │   )                                                      │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 平票处理代码实现

```python
def handle_tie_vote(votes, scores):
    """
    处理 1:1:1 平票情况
    """
    # Step 1: 检查否决权
    risk_vote = votes["risk_decision"]
    if risk_vote.get("veto", False):
        # 排除被否决的方案
        excluded_plan = risk_vote["veto_plan"]
        remaining_plans = [p for p in ["A", "B", "C"] if p != excluded_plan]
        # 在剩余方案中重新计算
        return select_from_remaining(remaining_plans, scores)
    
    # Step 2: 综合评分计算
    plan_scores = {}
    for plan in ["A", "B", "C"]:
        tech_score = scores["tech_decision"].get(plan, {}).get("total", 0)
        business_score = scores["business_decision"].get(plan, {}).get("total", 0)
        risk_score = scores["risk_decision"].get(plan, {}).get("total", 0)
        
        plan_scores[plan] = (tech_score * 0.35) + \
                           (business_score * 0.35) + \
                           (risk_score * 0.30)
    
    # 找出最高分方案
    max_score = max(plan_scores.values())
    winners = [p for p, s in plan_scores.items() if s == max_score]
    
    if len(winners) == 1:
        return {
            "result": winners[0],
            "method": "综合评分",
            "scores": plan_scores,
            "confidence": 0.6
        }
    
    # Step 3: 综合得分相同，需要 Lead 仲裁或用户确认
    return {
        "result": "pending",
        "method": "需要仲裁",
        "scores": plan_scores,
        "tie_plans": winners,
        "confidence": 0.0,
        "require_arbitration": True
    }
```

### 决策结果输出格式

```json
{
  "decision_result": {
    "selected_plan": "A",
    "confidence": 0.85,
    "method": "多数投票",
    "votes": {
      "tech_decision": {
        "selected": "A",
        "reasons": ["技术可行性最高", "架构影响最小"]
      },
      "business_decision": {
        "selected": "B",
        "reasons": ["用户体验更好", "业务价值更高"]
      },
      "risk_decision": {
        "selected": "A",
        "reasons": ["安全风险最低", "回退方案清晰"]
      }
    },
    "summary": {
      "vote_count": {"A": 2, "B": 1},
      "winner": "A",
      "key_reasons": [
        "技术可行性高，架构影响小",
        "安全风险低，有清晰回退方案"
      ],
      "dissenting_opinion": "业务决策师认为方案B用户体验更好"
    }
  }
}
```

---

## 📋 Orchestrator 执行流程

### Phase 0: 初始化（含自动启动可视化）

```python
# 1. 创建任务目录（使用 PowerShell 命令）
RunCommand(
  command="New-Item -ItemType Directory -Force -Path '.trae/agent-teams/{task-id}/outputs', '.trae/agent-teams/{task-id}/messages/inbox', '.trae/agent-teams/{task-id}/code_changes', '.trae/agent-teams/{task-id}/visualizer'",
  blocking=True
)

# 2. 初始化 state.json
Write(".trae/agent-teams/{task-id}/state.json", {
  "task_id": "task-001",
  "task_type": "feature",
  "status": "initializing",
  "progress": 0,
  "current_phase": 0,
  "agents": {
    "lead": {"status": "pending"},
    "plan": {"status": "pending"},
    "tech_decision": {"status": "pending"},
    "business_decision": {"status": "pending"},
    "risk_decision": {"status": "pending"},
    "framework": {"status": "pending"},
    "system": {"status": "pending"},
    "data": {"status": "pending"},
    "ui_ux": {"status": "pending"},
    "build": {"status": "pending"},
    "device": {"status": "pending"},
    "code_reviewer": {"status": "pending"},
    "qa": {"status": "pending"}
  }
})

# 3. 创建消息索引文件（供可视化读取）
Write(".trae/agent-teams/{task-id}/messages/index.json", {
  "count": 0,
  "messages": []
})

# 4. ★★★ 复制可视化文件到任务目录（必须使用 Write 工具）★★★
# 【重要】.trae 目录在黑名单中，不能使用 Copy-Item 命令
# 必须使用 Read + Write 工具逐个复制文件

# Step 4.1: 读取可视化源文件
index_html = Read(".trae/skills/agent-teams-visualizer/assets/index.html")
style_css = Read(".trae/skills/agent-teams-visualizer/assets/style.css")
script_js = Read(".trae/skills/agent-teams-visualizer/assets/script.js")

# Step 4.2: 写入到任务目录
Write(".trae/agent-teams/{task-id}/visualizer/index.html", index_html)
Write(".trae/agent-teams/{task-id}/visualizer/style.css", style_css)
Write(".trae/agent-teams/{task-id}/visualizer/script.js", script_js)

# Step 4.3: 验证文件是否写入成功（必须验证！）
verify_html = Read(".trae/agent-teams/{task-id}/visualizer/index.html")
verify_css = Read(".trae/agent-teams/{task-id}/visualizer/style.css")
verify_js = Read(".trae/agent-teams/{task-id}/visualizer/script.js")

if not verify_html or not verify_css or not verify_js:
    raise Exception("可视化文件复制失败！必须确保三个文件都完整写入")

# 5. ★ 自动启动可视化界面（HTTP 服务器）
# 【重要】Windows PowerShell 使用分号分隔命令，不是 && 
RunCommand(
  command="Set-Location '.trae/agent-teams/{task-id}'; python -m http.server 8080",
  blocking=False,  # 非阻塞，后台运行
  command_type="web_server",
  wait_ms_before_async=2000  # 等待服务器启动
)

# Step 5.1: 验证服务器是否启动成功
server_status = CheckCommandStatus(command_id="<上一步的command_id>")
if server_status.status != "running":
    raise Exception("HTTP 服务器启动失败！")

# 6. ★ 打开浏览器显示可视化界面
OpenPreview(
  command_id="<上一步的command_id>",
  preview_url="http://localhost:8080/visualizer/?task={task-id}"
)

# 7. 创建共享任务列表（用户可见）
TodoWrite(todos=[
  {"id": "stage-0", "content": "[Stage 0] 初始化 + 启动可视化", "status": "completed", "priority": "high"},
  {"id": "stage-1", "content": "[Stage 1] Lead Agent 评估", "status": "pending", "priority": "high"},
  {"id": "stage-2", "content": "[Stage 2] Plan Agent 规划", "status": "pending", "priority": "high"},
  {"id": "stage-2.5", "content": "[Stage 2.5] 三决策师投票", "status": "pending", "priority": "high"},
  {"id": "stage-3.1", "content": "[Stage 3.1] Framework 分析", "status": "pending", "priority": "high"},
  {"id": "stage-3.2", "content": "[Stage 3.2] System 分析", "status": "pending", "priority": "high"},
  {"id": "stage-4", "content": "[Stage 4] Code Reviewer", "status": "pending", "priority": "high"},
  {"id": "stage-5", "content": "[Stage 5] QA Agent 测试", "status": "pending", "priority": "high"},
  {"id": "stage-6", "content": "[Stage 6] Lead 最终决策", "status": "pending", "priority": "high"}
])

# 8. 更新 state.json 表示初始化完成
Update("state.json", {
  "status": "ready",
  "progress": 5,
  "current_phase": 1,
  "visualizer_url": "http://localhost:8080/visualizer/?task={task-id}"
})
```

### ★ 自动启动可视化界面的完整流程

```
┌─────────────────────────────────────────────────────────────────┐
│              Phase 0: 自动启动可视化界面                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: 创建目录结构                                            │
│  ────────────────────                                           │
│  .trae/agent-teams/{task-id}/                                   │
│  ├── state.json                                                 │
│  ├── outputs/                                                   │
│  ├── messages/                                                  │
│  │   └── index.json                                             │
│  ├── code_changes/                                              │
│  └── visualizer/                                                │
│      ├── index.html                                             │
│      ├── style.css                                              │
│      └── script.js                                              │
│                                                                  │
│  Step 2: 启动 HTTP 服务器                                        │
│  ────────────────────────                                       │
│  RunCommand(                                                    │
│    "python -m http.server 8080",                                │
│    blocking=False  ← 后台运行                                   │
│  )                                                              │
│                                                                  │
│  Step 3: 打开浏览器                                              │
│  ──────────────────                                             │
│  OpenPreview(                                                   │
│    preview_url="http://localhost:8080?task={task-id}"           │
│  )                                                              │
│                                                                  │
│  Step 4: 可视化界面开始轮询                                      │
│  ─────────────────────────                                      │
│  → 每 2 秒读取 state.json                                        │
│  → 每 2 秒读取 messages/index.json                               │
│  → 检测到状态变化自动更新 UI                                     │
│                                                                  │
│  Step 5: 继续执行 Agent Teams 工作流                             │
│  ────────────────────────────────                               │
│  → 启动 Lead Agent                                              │
│  → 可视化界面实时显示 Agent 状态变化                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 1: Lead Agent

```python
# 1. 更新任务状态
TodoWrite(todos=[
  {"id": "stage-1", "status": "in_progress"},
  ...
])

# 2. 更新 state.json
Update("state.json", {"agents.lead.status": "working"})

# 3. 启动 SubAgent
Task(
  subagent_type="search",
  description="Lead Agent 评估任务",
  query="""
    你是 Lead Agent，team_name={task-id}
    
    【强制步骤】
    1. 读取 .trae/agent-teams/{task-id}/state.json
    2. 评估任务类型（feature/defect）和优先级
    3. 写入 outputs/lead.json:
       {
         "task_type": "feature",
         "priority": "high",
         "required_agents": ["framework", "system"],
         "risks": ["..."]
       }
    4. 写入 messages/lead_to_plan.json:
       {
         "from": "lead",
         "to": "plan",
         "content": "评估完成，需要启动 framework 和 system agent",
         "summary": "Lead Agent 评估完成"
       }
    5. 更新 state.json 中 agents.lead.status = "completed"
  """
)

# 4. 等待完成（轮询 state.json）
while Read("state.json").agents.lead.status != "completed":
  sleep(2)

# 5. 读取消息并显示
message = Read("messages/lead_to_plan.json")
print(f"[Lead Agent] {message.summary}")

# 6. 更新任务状态
TodoWrite(todos=[{"id": "stage-1", "status": "completed"}, ...])
```

### Phase 2: Plan Agent

```python
# 类似 Phase 1 的流程
```

### Phase 3: 并行分析层

```python
# 1. 同时更新多个任务状态
TodoWrite(todos=[
  {"id": "stage-3.1", "status": "in_progress"},
  {"id": "stage-3.2", "status": "in_progress"},
  ...
])

# 2. 同时启动多个 SubAgent（并行）
Task(
  subagent_type="search",
  description="Framework Agent 分析",
  query="""
    你是 Framework Agent，team_name={task-id}
    
    【强制步骤】
    1. 读取 state.json 获取任务信息
    2. 读取 outputs/plan.json 获取计划
    3. 调用 Skill: demand-implementation（如果是 feature）
       或 Skill: defect-analyzer（如果是 defect）
    4. 执行 Framework 层分析
    5. 创建/修改代码文件
    6. 写入 outputs/framework.json
    7. 写入 code_changes/framework.json
    8. 写入 messages/framework_to_lead.json
    9. 更新 state.json 中 agents.framework.status = "completed"
  """
)

Task(
  subagent_type="search",
  description="System Agent 分析",
  query="""
    你是 System Agent，team_name={task-id}
    ...（类似 Framework Agent）
  """
)

# 3. 监控所有 Agent 状态
while not all_agents_completed():
  # 读取新消息
  messages = read_new_messages()
  for msg in messages:
    print(f"[{msg.from}] {msg.summary}")
  
  # 更新 TodoWrite 进度
  update_todo_progress()
  
  sleep(2)

# 4. 所有 Agent 完成后更新状态
TodoWrite(todos=[
  {"id": "stage-3.1", "status": "completed"},
  {"id": "stage-3.2", "status": "completed"},
  ...
])
```

---

## 📁 完整目录结构

```
.trae/agent-teams/{task-id}/
├── state.json                    # 全局状态（共享上下文）
├── outputs/                      # Agent 输出
│   ├── lead.json                 # Lead Agent 初始评估
│   ├── plan.json                 # Plan Agent 规划（含多方案）
│   ├── tech_decision.json        # 技术决策师投票
│   ├── business_decision.json    # 业务决策师投票
│   ├── risk_decision.json        # 风险决策师投票
│   ├── decision_vote.json        # 投票结果汇总
│   ├── framework.json            # Framework Agent 分析
│   ├── system.json               # System Agent 分析
│   ├── data.json                 # Data Agent 分析
│   ├── ui_ux.json                # UI/UX Agent 分析
│   ├── build.json                # Build Agent 分析
│   ├── device.json               # Device Agent 分析
│   ├── code_reviewer.json        # Code Reviewer 审查
│   ├── qa.json                   # QA Agent 测试
│   └── lead_final.json           # Lead 最终决策
├── messages/                     # 消息系统
│   ├── index.json                # ★ 消息索引（供可视化读取）
│   ├── lead_to_plan.json         # Lead → Plan
│   ├── plan_to_lead.json         # Plan → Lead
│   ├── tech_decision_to_lead.json # Tech Decision → Lead
│   ├── business_decision_to_lead.json # Business Decision → Lead
│   ├── risk_decision_to_lead.json # Risk Decision → Lead
│   ├── framework_to_lead.json    # Framework → Lead
│   ├── framework_to_system.json  # Framework → System
│   ├── broadcast.json            # Lead 广播
│   └── inbox/                    # 收件箱
│       ├── plan.json             # 发给 Plan 的消息
│       ├── framework.json        # 发给 Framework 的消息
│       └── ...
├── code_changes/                 # 代码变更记录
│   ├── plan.json
│   ├── framework.json
│   ├── system.json
│   ├── code_reviewer.json
│   └── qa.json
└── visualizer/                   # ★ 可视化界面（自动生成）
    ├── index.html                # 主页面
    ├── style.css                 # 像素风格样式
    └── script.js                 # 实时监听脚本
```

---

## 🔒 强制规则

### ⚠️ 规则 -1：禁止跳过流程直接修改代码

```
【严重警告】绝对禁止的行为：
────────────────────────────────────
❌ 禁止：分析代码后直接修改代码
❌ 禁止：跳过 Lead Agent 评估阶段
❌ 禁止：跳过 Plan Agent 规划阶段
❌ 禁止：跳过三决策师投票阶段
❌ 禁止：跳过 Code Review 阶段
❌ 禁止：跳过 QA 测试阶段
❌ 禁止：在未完成当前 Phase 时进入下一 Phase

✅ 正确：必须严格按照 Phase 顺序执行
✅ 正确：每个 Phase 必须完成并更新 state.json
✅ 正确：每个 Phase 必须调用对应的 Skill
✅ 正确：每个 Phase 必须更新 TodoWrite
```

### 规则 0：必须自动启动可视化界面

```
Phase 0 初始化时必须：
1. 复制可视化文件到 .trae/agent-teams/{task-id}/visualizer/
2. 创建 messages/index.json 消息索引
3. 启动 HTTP 服务器（后台运行）
4. 打开浏览器显示可视化界面
5. 更新 state.json 包含 visualizer_url
```

### 规则 1：必须按 Phase 顺序执行

```
【强制流程顺序】
────────────────────────────────────
Phase 0: 初始化 → Phase 1: Lead 评估 → Phase 2: Plan 规划 
→ Phase 2.5: 三决策师投票 → Phase 3: 并行分析 
→ Phase 4: Code Review → Phase 5: QA 测试 
→ Phase 6: Lead 最终决策

【检查点机制】
每个 Phase 完成后必须：
1. 更新 state.json 中 current_phase
2. 更新 TodoWrite 中对应 stage 状态
3. 写入 outputs/{agent}.json
4. 写入 messages/{agent}_to_lead.json
5. 更新 messages/index.json

【禁止行为】
- 禁止在 Phase 1 完成前执行 Phase 2
- 禁止在 Phase 2 完成前执行 Phase 2.5
- 禁止在 Phase 2.5 完成前执行 Phase 3
- 以此类推...
```

### 规则 2：每个 Phase 必须调用对应 Skill

```
【Feature 任务 Skill 映射】
────────────────────────────────────
Phase 1 (Lead):      demand-manager
Phase 2 (Plan):      demand-implementation
Phase 2.5 (决策师):   demand-implementation
Phase 3 (分析层):     demand-implementation
Phase 4 (Reviewer):  code-compliance-checker
Phase 5 (QA):        test-executor
Phase 6 (Lead):      gerrit-committer

【Defect 任务 Skill 映射】
────────────────────────────────────
Phase 1 (Lead):      defect-analyzer
Phase 2 (Plan):      defect-analyzer
Phase 2.5 (决策师):   defect-analyzer
Phase 3 (分析层):     defect-analyzer
Phase 4 (Reviewer):  code-compliance-checker
Phase 5 (QA):        test-executor
Phase 6 (Lead):      defect-document-generator, gerrit-committer

【强制要求】
- 每个 Agent 启动时必须指定要调用的 Skill
- Skill 调用必须在 Agent 执行代码修改之前
- 未调用 Skill 的 Agent 输出无效
```

### 规则 3：TodoWrite 必须实时更新

```
每个阶段开始时：
TodoWrite(todos=[{id: "stage-N", status: "in_progress"}, ...])

每个阶段完成时：
TodoWrite(todos=[{id: "stage-N", status: "completed"}, ...])
```

### 规则 4：消息必须写入文件并更新索引

```
Agent 完成时必须：
# 1. 写入消息文件
Write("messages/{agent}_to_lead.json", {
  from: "{agent}",
  to: "lead",
  content: "完整分析结果",
  summary: "简短摘要（显示给用户）",
  timestamp: "ISO8601",
  read: false
})

# 2. 更新消息索引（供可视化读取）
index = Read("messages/index.json")
index["count"] += 1
index["messages"].append({
  "file": "{agent}_to_lead.json",
  "from": "{agent}",
  "to": "lead",
  "timestamp": "ISO8601",
  "type": "message"
})
Write("messages/index.json", index)
```

### 规则 5：状态必须同步

```
Agent 开始时：
Update("state.json", {
  "agents.{agent}.status": "working",
  "progress": <更新进度百分比>
})

Agent 完成时：
Update("state.json", {
  "agents.{agent}.status": "completed",
  "progress": <更新进度百分比>,
  "current_phase": <下一阶段号>
})
```

### 规则 6：并行执行必须同时启动

```
错误方式（串行）：
Task(Framework Agent)
Task(System Agent)  # 等第一个完成

正确方式（并行）：
Task(Framework Agent)
Task(System Agent)  # 同时启动
```

### 规则 7：代码修改只能在 Phase 3 及之后

```
【代码修改时机】
────────────────────────────────────
Phase 1 (Lead):      ❌ 禁止修改代码
Phase 2 (Plan):      ❌ 禁止修改代码（只能创建项目结构）
Phase 2.5 (决策师):   ❌ 禁止修改代码
Phase 3 (分析层):     ✅ 允许修改代码
Phase 4 (Reviewer):  ✅ 允许修复代码问题
Phase 5 (QA):        ✅ 允许修复测试问题
Phase 6 (Lead):      ✅ 允许最终整合

【代码修改前必须】
1. 确认 current_phase >= 3
2. 确认已完成三决策师投票
3. 确认已选择最终方案
4. 调用了对应的 Skill
```

---

## 🚨 流程检查点

### Phase 完成检查清单

```
┌─────────────────────────────────────────────────────────────────┐
│                    Phase 完成检查清单                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1 (Lead) 完成检查：                                       │
│  □ outputs/lead.json 已写入                                      │
│  □ messages/lead_to_plan.json 已写入                             │
│  □ state.json 中 agents.lead.status = "completed"               │
│  □ state.json 中 current_phase = 2                               │
│  □ TodoWrite 中 stage-1 = "completed"                           │
│                                                                  │
│  Phase 2 (Plan) 完成检查：                                       │
│  □ outputs/plan.json 已写入（包含多方案）                         │
│  □ messages/plan_to_lead.json 已写入                             │
│  □ state.json 中 agents.plan.status = "completed"               │
│  □ state.json 中 current_phase = 2.5                             │
│  □ TodoWrite 中 stage-2 = "completed"                           │
│                                                                  │
│  Phase 2.5 (三决策师投票) 完成检查：                              │
│  □ outputs/tech_decision.json 已写入                             │
│  □ outputs/business_decision.json 已写入                         │
│  □ outputs/risk_decision.json 已写入                             │
│  □ outputs/decision_vote.json 已写入                             │
│  □ state.json 中 selected_plan 已设置                            │
│  □ state.json 中 current_phase = 3                               │
│  □ TodoWrite 中 stage-2.5 = "completed"                         │
│                                                                  │
│  Phase 3 (并行分析) 完成检查：                                    │
│  □ 所有需要的 Agent outputs/*.json 已写入                         │
│  □ 所有 Agent messages/*.json 已写入                             │
│  □ state.json 中所有相关 agent.status = "completed"             │
│  □ state.json 中 current_phase = 4                               │
│  □ TodoWrite 中 stage-3.* = "completed"                         │
│                                                                  │
│  ... 以此类推 ...                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 执行前强制检查

### 启动 Agent 前必须检查

```python
def check_phase_ready(current_phase, target_phase):
    """检查是否可以进入目标 Phase"""
    
    if target_phase <= current_phase:
        return True, "Phase 已完成或正在进行"
    
    if target_phase == current_phase + 1:
        # 检查当前 Phase 是否完成
        checks = get_phase_checks(current_phase)
        for check in checks:
            if not check_passed(check):
                return False, f"当前 Phase 未完成: {check}"
        return True, "可以进入下一 Phase"
    
    return False, f"禁止跳过 Phase: {current_phase} -> {target_phase}"

def check_code_modification_allowed(current_phase):
    """检查是否允许修改代码"""
    if current_phase < 3:
        return False, "Phase 3 之前禁止修改代码"
    return True, "允许修改代码"
```

### Agent 执行模板

```python
def execute_agent(agent_name, task_id, skill_name):
    """执行 Agent 的标准流程"""
    
    # Step 1: 检查 Phase 是否就绪
    state = Read(f".trae/agent-teams/{task_id}/state.json")
    target_phase = get_agent_phase(agent_name)
    
    ready, reason = check_phase_ready(state["current_phase"], target_phase)
    if not ready:
        raise Exception(f"Phase 检查失败: {reason}")
    
    # Step 2: 检查是否允许修改代码
    if agent_needs_code_modification(agent_name):
        allowed, reason = check_code_modification_allowed(state["current_phase"])
        if not allowed:
            raise Exception(f"代码修改检查失败: {reason}")
    
    # Step 3: 更新状态为 working
    Update(f".trae/agent-teams/{task_id}/state.json", {
        f"agents.{agent_name}.status": "working"
    })
    
    # Step 4: 更新 TodoWrite
    TodoWrite(todos=[{
        "id": f"stage-{target_phase}",
        "status": "in_progress"
    }])
    
    # Step 5: 调用 Skill（必须！）
    Skill(name=skill_name)
    
    # Step 6: 启动 Agent
    Task(
        subagent_type="search",
        description=f"{agent_name} 执行任务",
        query=f"""
            你是 {agent_name}，team_name={task_id}
            
            【强制步骤 - 必须按顺序执行】
            ────────────────────────────────────
            1. 读取 .trae/agent-teams/{task_id}/state.json
            2. 读取 outputs/plan.json 获取计划
            3. 调用 Skill: {skill_name}
            4. 执行分析/开发任务
            5. 写入 outputs/{agent_name}.json
            6. 写入 code_changes/{agent_name}.json（如有代码修改）
            7. 写入 messages/{agent_name}_to_lead.json
            8. 更新 messages/index.json
            9. 更新 state.json 中 agents.{agent_name}.status = "completed"
            
            【禁止行为】
            ────────────────────────────────────
            ❌ 禁止跳过任何步骤
            ❌ 禁止在未调用 Skill 前修改代码
            ❌ 禁止跳过消息写入
            ❌ 禁止跳过状态更新
        """
    )
    
    # Step 7: 等待完成
    wait_for_agent_completion(task_id, agent_name)
    
    # Step 8: 更新 TodoWrite
    TodoWrite(todos=[{
        "id": f"stage-{target_phase}",
        "status": "completed"
    }])
```

---

## 📊 用户可见效果

### 任务列表

```
📋 任务列表 - task-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☑ [Stage 1] Lead Agent 评估                    ✅ 已完成
☑ [Stage 2] Plan Agent 规划                    ✅ 已完成
⏳ [Stage 3.1] Framework 分析                   🔄 进行中 (80%)
⏳ [Stage 3.2] System 分析                      🔄 进行中 (60%)
⬜ [Stage 4] Code Reviewer                      ⏸️ 等待中
⬜ [Stage 5] QA Agent 测试                      ⏸️ 等待中
⬜ [Stage 6] Lead 最终决策                       ⏸️ 等待中
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 消息面板

```
📨 消息面板
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[10:05:00] Lead → Plan: "评估完成，需要分析 Activity 生命周期"
[10:10:00] Plan → Lead: "规划完成，启动 Framework 和 System Agent"
[10:15:30] Framework → Lead: "分析完成，发现 Activity 泄漏问题"
[10:15:35] Framework → System: "跨领域线索：Activity 泄漏可能导致内存压力"
[10:16:00] System → Lead: "分析完成，发现内存监控阈值过高"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
