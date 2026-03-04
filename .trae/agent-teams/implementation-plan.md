# Trae Agent Teams 实现方案

## 核心创新：使用 Trae 原生功能实现三大机制

### 一、共享任务列表 → TodoWrite

**发现**：Trae 的 TodoWrite 工具天然支持共享任务列表功能！

```
┌─────────────────────────────────────────────────────────────────┐
│              TodoWrite = 共享任务列表                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Lango-Agent-Teams              Trae 实现                        │
│  ──────────────────             ──────────                       │
│  TaskCreate(subject, desc)  →   TodoWrite(todos=[{id, content}]) │
│  TaskUpdate(status)         →   TodoWrite(todos=[{status}])      │
│  任务列表 UI                 →   用户界面直接显示                  │
│  任务状态实时更新             →   TodoWrite 更新后立即显示         │
│                                                                  │
│  示例：                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ TodoWrite(todos=[                                       │    │
│  │   {id: "1", content: "[Stage 1] Plan Agent",             │    │
│  │    status: "completed", priority: "high"},               │    │
│  │   {id: "2", content: "[Stage 2.1] Framework 分析",       │    │
│  │    status: "in_progress", priority: "high"},             │    │
│  │   {id: "3", content: "[Stage 2.2] System 分析",          │    │
│  │    status: "in_progress", priority: "high"},             │    │
│  │   ...                                                    │    │
│  │ ])                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  用户看到的效果：                                                 │
│  ☑ [Stage 1] Plan Agent 制定计划                                │
│  ⏳ [Stage 2.1] Framework 分析                                   │
│  ⏳ [Stage 2.2] System 分析                                      │
│  ⬜ [Stage 3] Code Reviewer                                      │
│  ⬜ [Stage 4] Test/QA                                            │
│  ⬜ [Stage 5] Lead 最终决策                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 二、实时消息系统 → 文件系统 + 状态同步

```
┌─────────────────────────────────────────────────────────────────┐
│              文件系统消息 = 实时消息系统                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  消息类型              文件实现                                   │
│  ─────────             ──────────                               │
│  Agent → Lead      →   messages/{agent}_to_lead.json            │
│  Agent → Agent     →   messages/{from}_to_{to}.json             │
│  Lead → Broadcast  →   messages/broadcast.json                  │
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
│  消息读取机制：                                                   │
│  - Orchestrator 定期读取 messages/*.json                         │
│  - 发现新消息（read=false）时处理并标记 read=true                  │
│  - 将消息摘要显示给用户                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 三、Teammate 模式 → Task + 共享状态

```
┌─────────────────────────────────────────────────────────────────┐
│              Task + 共享状态 = Teammate 模式                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Lango-Agent-Teams              Trae 实现                        │
│  ──────────────────             ──────────                       │
│  Task(team_name, name)   →   Task(subagent_type, description)   │
│  teammate 加入团队        →   SubAgent 读写共享状态文件           │
│  共享上下文               →   通过 state.json 共享               │
│  消息传递                  →   通过 messages/*.json 传递          │
│                                                                  │
│  实现方式：                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Orchestrator 创建 state.json 和 messages/ 目录        │    │
│  │                                                          │    │
│  │ 2. 启动 SubAgent 时传递参数：                              │    │
│  │    Task(                                                  │    │
│  │      subagent_type="search",                              │    │
│  │      description="Framework Agent 分析",                  │    │
│  │      query="""                                            │    │
│  │        你是 Framework Agent，team_name=case-001           │    │
│  │        任务：读取 state.json，执行分析                      │    │
│  │        完成后：                                            │    │
│  │        1. 写入 outputs/framework.json                      │    │
│  │        2. 写入 messages/framework_to_lead.json             │    │
│  │        3. 更新 state.json 中 agents.framework.status       │    │
│  │      """                                                  │    │
│  │    )                                                      │    │
│  │                                                          │    │
│  │ 3. SubAgent 执行时：                                       │    │
│  │    - 读取 state.json 获取任务信息和团队状态                  │    │
│  │    - 读取 messages/*.json 获取发给自己的消息                │    │
│  │    - 执行分析任务                                          │    │
│  │    - 写入输出和消息                                        │    │
│  │                                                          │    │
│  │ 4. Orchestrator 监控：                                    │    │
│  │    - 定期检查 state.json 中 Agent 状态                     │    │
│  │    - 读取新消息并显示给用户                                 │    │
│  │    - 更新 TodoWrite 任务状态                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 完整工作流实现

### Phase 0: 初始化

```
Orchestrator 执行：

1. 创建任务目录
   mkdir .trae/agent-teams/{task-id}/{outputs,messages,code_changes}

2. 初始化 state.json
   Write(state.json, {
     task_id, task_type, task_description,
     agents: { lead: {status: "pending"}, ... }
   })

3. 创建共享任务列表（用户可见）
   TodoWrite(todos=[
     {id: "1", content: "[Stage 1] Plan Agent 制定计划", status: "pending"},
     {id: "2", content: "[Stage 2.1] Framework 分析", status: "pending"},
     {id: "3", content: "[Stage 2.2] System 分析", status: "pending"},
     ...
   ])
```

### Phase 1: Plan Agent

```
Orchestrator 执行：

1. 更新任务状态
   TodoWrite(todos=[{id: "1", status: "in_progress"}, ...])

2. 启动 SubAgent
   Task(
     subagent_type="search",
     description="Plan Agent 制定计划",
     query="""
       你是 Plan Agent，team_name=case-001
       
       【强制步骤】
       1. 读取 .trae/agent-teams/case-001/state.json
       2. 分析任务并制定计划
       3. 写入 outputs/plan.json
       4. 写入 messages/plan_to_lead.json:
          {from: "plan", to: "lead", content: "计划完成", summary: "Plan Agent 完成"}
       5. 更新 state.json 中 agents.plan.status = "completed"
     """
   )

3. 等待完成（轮询 state.json）

4. 更新任务状态
   TodoWrite(todos=[{id: "1", status: "completed"}, ...])
```

### Phase 2: 并行分析层

```
Orchestrator 执行：

1. 更新任务状态（同时标记多个为 in_progress）
   TodoWrite(todos=[
     {id: "2", status: "in_progress"},
     {id: "3", status: "in_progress"},
     ...
   ])

2. 同时启动多个 SubAgent（并行）
   Task(subagent_type="search", description="Framework Agent", query="...")
   Task(subagent_type="search", description="System Agent", query="...")
   Task(subagent_type="search", description="Data Agent", query="...")

3. 每个 SubAgent 执行：
   - 读取 state.json
   - 读取 outputs/plan.json
   - 执行分析
   - 写入 outputs/{agent}.json
   - 写入 messages/{agent}_to_lead.json
   - 更新 state.json

4. Orchestrator 监控：
   - 轮询 state.json 检查所有 Agent 状态
   - 读取新消息显示给用户
   - 更新 TodoWrite 状态

5. 所有 Agent 完成后：
   TodoWrite(todos=[
     {id: "2", status: "completed"},
     {id: "3", status: "completed"},
     ...
   ])
```

### Phase 3-5: 后续阶段

类似 Phase 1-2 的流程

---

## 消息系统详细设计

### 消息文件结构

```
.trae/agent-teams/{task-id}/messages/
├── plan_to_lead.json           # Plan Agent → Lead
├── framework_to_lead.json      # Framework Agent → Lead
├── system_to_lead.json         # System Agent → Lead
├── framework_to_system.json    # Framework Agent → System Agent
├── broadcast.json              # Lead 广播消息
└── inbox/
    ├── plan.json               # 发给 Plan Agent 的消息
    ├── framework.json          # 发给 Framework Agent 的消息
    └── ...
```

### 消息处理流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    消息处理流程                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  发送消息：                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Write("messages/framework_to_lead.json", {              │    │
│  │   message_id: "msg-001",                                 │    │
│  │   from: "framework",                                     │    │
│  │   to: "lead",                                            │    │
│  │   content: "分析完成，发现...",                            │    │
│  │   summary: "Framework Agent 分析完成",                   │    │
│  │   timestamp: "2026-03-02T10:00:00Z",                     │    │
│  │   read: false                                            │    │
│  │ })                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  接收消息：                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Read("messages/framework_to_lead.json")               │    │
│  │ 2. if (message.read == false) {                          │    │
│  │      处理消息内容                                          │    │
│  │      显示给用户："[Framework] 分析完成"                    │    │
│  │      标记已读：message.read = true                        │    │
│  │    }                                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 用户可见效果

### 任务列表（TodoWrite）

```
用户界面显示：

📋 任务列表
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☑ [Stage 1] Plan Agent 制定计划                    ✅ 已完成
⏳ [Stage 2.1] Framework 分析                       🔄 进行中
⏳ [Stage 2.2] System 分析                          🔄 进行中
⬜ [Stage 2.3] Data 分析                            ⏸️ 等待中
⬜ [Stage 3] Code Reviewer                          ⏸️ 等待中
⬜ [Stage 4] Test/QA                                ⏸️ 等待中
⬜ [Stage 5] Lead 最终决策                           ⏸️ 等待中
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 消息面板

```
用户界面显示：

📨 消息面板
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[10:05:00] Plan Agent → Lead: "计划制定完成"
[10:10:30] Framework Agent → Lead: "分析完成，发现 Activity 生命周期问题"
[10:10:35] System Agent → Lead: "分析完成，发现权限配置缺失"
[10:10:40] Framework Agent → System Agent: "跨领域线索：Activity 问题可能影响权限检查"
[10:15:00] Lead → Broadcast: "Stage 2 Gate PASS，进入 Code Review"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 总结

| 功能 | Lango-Agent-Teams | Trae 实现 | 效果 |
|------|-------------------|-----------|------|
| **共享任务列表** | TeamCreate + TaskCreate | TodoWrite | ✅ 用户实时可见 |
| **实时消息系统** | SendMessage | 文件系统 + 轮询 | ✅ 消息可追踪 |
| **teammate 模式** | Task(team_name) | Task + 共享状态 | ✅ 可协作 |
