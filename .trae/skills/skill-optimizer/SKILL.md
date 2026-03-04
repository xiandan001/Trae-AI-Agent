---
name: skill-optimizer
description: 自动迭代优化SKILL的元技能。当用户指出某次回答的问题或不符合预期时,智能判断问题与SKILL的相关性,并自动优化修改对应的SKILL。支持优化所有SKILL文件(SKILL.md、scripts/、references/、assets/),具备自我优化能力,能够根据用户反馈不断改进优化策略。
---

# SKILL优化器

## 技能概述

本技能是一个元技能(meta-skill),用于自动迭代和优化其他SKILL。当用户指出某次回答存在问题时,智能判断问题与SKILL的相关性,识别问题根源,并自动优化修改对应的SKILL。具备自我学习能力,能够根据用户反馈不断改进优化策略,持续提升所有SKILL的质量和效能。

## 核心能力

1. **智能相关性判断**: 分析用户问题,智能判断是否与某个SKILL强相关
2. **深度问题诊断**: 识别问题根源,确定是SKILL逻辑问题、内容缺失、还是执行流程问题
3. **精准优化修改**: 优化SKILL中的所有文件(SKILL.md、scripts/、references/、assets/),但defect-analyzer的references除外
4. **自我进化能力**: 能够根据用户反馈优化自己,不断改进优化策略
5. **主动持续迭代**: 持续关注SKILL表现,主动发现优化机会

## 触发条件

### 触发原则
**核心原则**: skill-optimizer需要**主动判断**用户问题是否与某个SKILL相关,而不是等待用户明确指出。

用户通常:
- ❌ 不会关心具体是哪个SKILL在执行
- ❌ 不会主动提到SKILL的名称
- ✅ 只会说"结果不对"、"分析错了"、"不是我要的"、"有问题"等否定词
- ✅ 只会描述问题和预期结果

因此,skill-optimizer必须根据用户的描述,主动分析并判断是否与某个SKILL相关。

### 触发场景

当用户以下述方式表达时,**必须**主动判断并考虑触发:

1. **结果不符合预期**:
   - "这不是我想要的结果"
   - "结果不对"
   - "没达到预期"
   - "应该是这样,但实际是那样"

2. **分析逻辑错误**:
   - "你这样分析问题是不对的"
   - "这个判断有问题"
   - "逻辑应该是这样的"
   - "你的理解有误"
   - "你...错了"（如：你安装地方错了、你分析错了）

3. **执行流程问题**:
   - "流程不对"
   - "步骤错了"
   - "不应该这样做"
   - "这样做不行"

4. **功能缺失**:
   - "缺少这个功能"
   - "应该还能做这个"
   - "功能不完整"

5. **代码/检查结果有问题**:
   - "注释添加的有问题"
   - "标签加的不对"
   - "检查结果不对"
   - "代码审查结果有问题"
   - "规则写的有问题"
   - "你这样修改有问题"
   - "应该用另一种方式"

6. **其他负面反馈**:
   - "没用"
   - "不行"
   - "不行,换种方式"
   - "这样处理不合理"
   - "你...错了"（直接指出错误，如：你安装地方错了、你这样做错了）
   - "前面没有触发skill-optimizer"（指出skill-optimizer本身的问题）

### 强制触发规则

**只要用户反馈"有问题"、"不对"、"有问题"，必须默认触发 skill-optimizer 进行判断**

判断流程:
1. 首先假设问题与某个 SKILL 相关（相关性假设）
2.分析最近使用的 SKILL 及其功能范围
3.如果匹配度高 → 立即触发优化
4.如果匹配度不确定 → 仍然触发优化，让 skill-optimizer 分析
5.**如果判断与所有 SKILL 都无关** → 必须在当前项目根目录创建 CLAUDE-ERROR.md 记录判断结果，然后不触发SKILL的优化

### 主动判断流程

当收到用户上述反馈时:

1. **分析问题上下文**:
   - 回顾之前的对话和操作
   - 识别最近使用了哪些SKILL
   - 分析用户的预期是什么

2. **匹配相关SKILL**:
   - 检查最近使用的SKILL的功能范围
   - 匹配用户描述的问题与SKILL的关联度
   - 评估是否由SKILL的逻辑/流程/内容导致

3. **判断相关性**:
   - **强相关**: 问题直接由SKILL的执行导致 → 立即触发优化
   - **可能相关**: 问题可能与SKILL有关 → 深入分析后决定
   - **不相关**: 问题与SKILL无关 → 不触发优化

4. **执行优化或建议**:
   - 强相关: 立即开始SKILL优化流程,无需询问用户
   - 不相关: 向用户说明问题原因,提供其他解决方案

**重要说明**:
- 绝不询问用户"是否与某个SKILL相关"
- 绝不等待用户指出具体是哪个SKILL
- 必须根据上下文**自主判断**并**主动触发**
- 只有在完全无法判断时,才向用户说明情况并询问更多信息

## SKILL列表

本技能需要维护所有可优化SKILL的信息:

### SKILL发现机制

**动态识别**: skill-optimizer应该动态发现和识别当前系统中存在的所有SKILL,而不是依赖硬编码的列表。

**识别方法**:
1. 扫描SKILLS_ROOT环境变量指定的目录(如果存在)
2. 如果SKILLS_ROOT未设置,按以下优先级顺序扫描skills目录:
   - 当前工作目录下的`skills/`
   - 当前工作目录下的`.trae/skills/`
   - 当前工作目录下的`.github/skills/`
   - 当前工作目录下的`.claude/skills/`
3. 遍历目录,识别所有包含SKILL.md文件的目录
4. 记录每个SKILL的名称、路径、描述等信息

**支持的目录前缀**:
- `.trae` - Trae IDE的默认目录
- `.github` - GitHub Actions相关目录
- `.claude` - Claude相关目录
- `skills` - 直接的skills目录
- 其他前缀

**SKILL信息存储**:
- 在内存中维护动态发现的SKILL列表
- 每次执行优化前,重新扫描目录以获取最新列表
- 不需要持久化SKILL列表到文件中

### 特殊SKILL处理规则

**defect-analyzer特殊处理**:
- 对于defect-analyzer SKILL,references目录下的文档不进行优化
- 原因: references目录下的文档是由defect-document-generator技能自动生成的缺陷分析文档,包含历史缺陷案例和解决方案,不应由skill-optimizer修改
- 处理方式:
  - 可以优化defect-analyzer的SKILL.md
  - 可以优化defect-analyzer的scripts/(如果有)
  - 可以优化defect-analyzer的assets/(如果有)
  - 不能优化defect-analyzer的references/

**其他SKILL的处理**:
对于除defect-analyzer之外的所有SKILL,可以优化所有文件:
- SKILL.md
- scripts/
- references/
- assets/

### SKILL目录结构
所有SKILL位于SKILLS_ROOT目录下。

**SKILLS_ROOT确定顺序**:
1. 优先使用环境变量`SKILLS_ROOT`指定的目录
2. 如果未设置环境变量,按以下顺序查找skills目录:
   - 当前工作目录下的skills目录: `./skills/`
   - 当前工作目录下的.trae/skills: `./.trae/skills/`
   - 当前工作目录下的.github/skills: `./.github/skills/`
   - 当前工作目录下的.claude/skills: `./.claude/skills/`
   - 用户主目录下的.trae/skills: `~/.trae/skills/`
   - 用户主目录下的.github/skills: `~/.github/skills/`
   - 用户主目录下的.claude/skills: `~/.claude/skills/`

**支持的目录前缀**:
- `.trae` - Trae IDE的默认目录
- `.github` - GitHub Actions相关目录
- `.claude` - Claude相关目录
- `skills` - 直接的skills目录
- 其他前缀

**平台路径格式**:
- Windows: 使用反斜杠`\`,如`C:\Users\username\.trae\skills\`
- Linux/Mac: 使用正斜杠`/`,如`/home/username/.trae/skills/`

## 资源结构

### references/change-log/

优化日志目录,用于记录所有SKILL的优化历史。

**目录结构**:
```
${SKILLS_ROOT}/skill-optimizer/
└── references/
    └── change-log/
        ├── <skill-name-1>/
        │   ├── <problem-description>-yyyy-mm-dd.md
        │   └── ...
        ├── <skill-name-2>/
        │   ├── <problem-description>-yyyy-mm-dd.md
        │   └── ...
        └── ...
```

**路径说明**:
- `${SKILLS_ROOT}`: SKILLS_ROOT环境变量指定的目录,或按优先级查找的skills目录
- `skill-optimizer`: 本技能的目录名
- `<skill-name>`: 被优化的SKILL名称(使用小写字母和连字符,与SKILL目录名一致)

**实际路径示例**:
- Windows: `C:\Users\username\.trae\skills\skill-optimizer\references\change-log\<skill-name>\`
- Linux/Mac: `/home/username/.trae/skills/skill-optimizer/references/change-log/<skill-name>/`
- 其他目录: 取决于SKILLS_ROOT的实际位置

**命名规范**:
- SKILL目录名: 使用小写字母和连字符,与SKILL名称一致
- 日志文件名: `<problem-description>-yyyy-mm-dd.md` (问题描述-年-月-月内序号)
  - `<problem-description>`: 问题描述(非常简洁,使用英文,如: static-context-leak, wrong-patch-label等)
  - `yyyy-mm-dd`: 年-月-日(如: 2025-02-03)

**日志内容**:
每个日志文件包含完整的优化记录,包括:
- 基本信息(SKILL名称、优化时间)
- 问题描述(用户反馈)
- 问题诊断(问题类型、问题位置、问题详情)
- 修改的文件(修改位置、修改前后的对比)
- 优化总结(优化效果说明)
- 验证结果(验证状态)

## 工作流程

### 阶段一: 相关性判断

> 参见: [workflow-relevance-judgment.md](./assets/workflow-relevance-judgment.md)

### 阶段二: 问题诊断

> 参见: [workflow-problem-diagnosis.md](./assets/workflow-problem-diagnosis.md)

### 阶段三: 优化方案设计

> 参见: [workflow-optimization-solution.md](./assets/workflow-optimization-solution.md)

### 阶段四: 优化实施

> 参见: [workflow-optimization-implementation.md](./assets/workflow-optimization-implementation.md)

### 阶段五: 验证与反馈

> 参见: [workflow-verification-feedback.md](./assets/workflow-verification-feedback.md)

## 资源说明

本技能需要管理以下资源:

**目录结构**:
```
${SKILLS_ROOT}/skill-optimizer/
├── assets/
│   ├── README.md
│   ├── workflow-relevance-judgment.md
│   ├── workflow-problem-diagnosis.md
│   ├── workflow-optimization-solution.md
│   ├── workflow-optimization-implementation.md
│   ├── workflow-verification-feedback.md
│   ├── format-change-log.md
│   ├── self-optimization.md
│   ├── active-iteration.md
│   ├── special-handling.md
│   ├── error-handling.md
│   ├── best-practices.md
│   └── continuous-improvement.md
└── references/
    └── change-log/
        ├── <skill-name>/
        │   ├── <problem-description>-yyyy-mm-nn.md
        │   └── ...
        └── ...
```

**路径说明**:
- `${SKILLS_ROOT}`: SKILLS_ROOT环境变量指定的目录,或按优先级查找的skills目录
- `skill-optimizer`: 本技能的目录名
- `assets/`: 存放详细工作流程文档的目录
- `references/change-log/`: 存放SKILL优化日志的目录

**实际路径示例**:
- Trae: `.trae\skills\skill-optimizer\`
- Linux/Mac: `.trae/skills/skill-optimizer/`
- GitHub: `.github/skills/skill-optimizer/`
- Claude: `.claude/skills/skill-optimizer/`

更多文档请参考: [assets/README.md](./assets/README.md)

## 自我优化能力

> 参见: [self-optimization.md](./assets/self-optimization.md)

## 主动持续迭代

> 参见: [active-iteration.md](./assets/active-iteration.md)

## 特殊处理

### defect-analyzer特殊处理
**重要**: 对于defect-analyzer SKILL,references目录下的文档不进行优化。

**原因**: references目录下的文档是由defect-document-generator技能自动生成的缺陷分析文档,包含历史缺陷案例和解决方案,不应由skill-optimizer修改。

**处理方式**:
- 可以优化defect-analyzer的SKILL.md
- 可以优化defect-analyzer的scripts/(如果有)
- 可以优化defect-analyzer的assets/(如果有)
- 不能优化defect-analyzer的references/

### 其他SKILL的处理
对于除defect-analyzer之外的所有SKILL,可以优化所有文件:
- SKILL.md
- scripts/
- references/
- assets/

## 使用示例

### 示例1: 用户描述问题,未明确指出SKILL(隐式触发)

**场景**: 用户之前使用某个代码检查类SKILL检查代码,发现问题

**用户输入**:

你检查代码的时候,没检查到静态变量持有Context引用的问题,这个应该加上

**处理流程**:
1. **上下文分析**:
   - 回顾对话历史,最近使用了代码检查类SKILL
   - 用户提到的"检查代码"对应SKILL的功能
   - 用户没有提到SKILL名称,但描述的是代码检查问题

2. **相关性判断**:
   - 提取关键词: "检查代码"、"静态变量"、"Context引用"
   - 匹配SKILL: 通过功能描述匹配到对应的代码检查类SKILL
   - 相关性: 强相关(问题直接由SKILL的检查逻辑导致)
   - 触发优化: 是(无需询问用户)

3. **问题诊断**:
   - 读取目标SKILL的SKILL.md
   - 定位到内存泄漏检查章节
   - 检查是否包含静态变量检查
   - 问题类型: 内容缺失

4. **优化方案设计**:
   - 优化目标: 补充静态变量持有Context引用的检查内容
   - 优化策略: 在内存泄漏检查章节中添加静态变量检查的详细说明

5. **优化实施**:
   - 修改SKILL.md
   - 在步骤5: 内存泄漏检测中,添加"静态变量检查"子项
   - 补充详细的检查要点和示例

6. **验证与反馈**:
   - 检查修改后的内容是否完整
   - 向用户反馈优化结果

**关键点**:
- 用户没有提到SKILL名称,但skill-optimizer通过上下文自主判断
- 无需询问用户具体SKILL名称
- 直接触发优化流程

### 示例2: 用户描述问题,完全不知道是SKILL导致的(隐式触发)

**用户输入**:

安装APK的时候,安装完成后自动重启了设备,但我不想自动重启,希望能先询问我

**处理流程**:
1. **上下文分析**:
   - 回顾对话历史,最近执行了APK安装操作
   - 用户描述的是APK安装后的行为问题
   - 用户不知道这是由某个SKILL控制的

2. **相关性判断**:
   - 提取关键词: "安装APK"、"自动重启"、"询问"
   - 分析问题: APK安装相关的问题
   - 匹配SKILL: 通过功能描述匹配到APK安装类SKILL
   - 相关性: 强相关(问题直接由SKILL的执行逻辑导致)
   - 触发优化: 是(无需询问用户)

3. **问题诊断**:
   - 读取目标SKILL的SKILL.md
   - 检查安装流程中的重启逻辑
   - 问题类型: 逻辑错误

4. **优化方案设计**:
   - 优化目标: 修改安装流程,安装完成后询问用户是否重启
   - 优化策略: 在工作流程中添加用户确认步骤

5. **优化实施**:
   - 修改SKILL.md
   - 在"重启设备确认"章节中明确说明必须先询问用户
   - 添加用户交互提示示例

6. **验证与反馈**:
   - 检查修改后的内容是否正确
   - 向用户反馈优化结果

**关键点**:
- 用户完全不知道这是SKILL问题
- skill-optimizer通过问题描述自主判断相关性
- 无需向用户解释具体是哪个SKILL,直接优化

### 示例3: 用户说"结果不对"(隐式触发)

**场景**: 用户使用某个文档生成类SKILL生成需求文档

**用户输入**:

不是这样的,结果不对

**处理流程**:
1. **上下文分析**:
   - 回顾对话历史,最近使用了文档生成类SKILL
   - 用户刚查看了生成的需求文档
   - 用户只说"结果不对",没有具体说明

2. **相关性判断**:
   - 提取关键词: "结果不对"
   - 分析问题: 生成的内容不符合用户预期
   - 匹配SKILL: 通过最近的操作判断到文档生成类SKILL
   - 相关性: 可能相关(信息较少,需要深入分析)
   - 深入分析: 读取目标SKILL的生成逻辑,结合用户之前的描述
   - 最终判断: 强相关(生成逻辑有问题)
   - 触发优化: 是

3. **问题诊断**:
   - 读取目标SKILL的SKILL.md
   - 检查需求文档生成逻辑
   - 结合用户之前的描述,分析问题所在
   - 问题类型: 逻辑错误

4. **优化方案设计**:
   - 优化目标: 修正需求文档生成逻辑
   - 优化策略: 调整生成规则,确保符合用户预期

5. **优化实施**:
   - 修改SKILL.md
   - 更新生成逻辑和规则

6. **验证与反馈**:
   - 重新生成需求文档
   - 向用户反馈优化结果

**关键点**:
- 用户只说了"结果不对",没有提供任何细节
- skill-optimizer通过上下文自主判断是哪个SKILL的问题
- 通过深入分析确定问题所在,而不是询问用户

### 示例4: 用户反馈优化效果不佳(自我优化)

**场景**: skill-optimizer之前优化了某个SKILL,但用户反馈问题仍然存在

**用户输入**:

上次的优化没有解决问题,还是会有自动重启的情况

**处理流程**:
1. **上下文分析**:
   - 回顾对话历史,之前优化过某个SKILL
   - 用户反馈"上次的优化没有解决问题"
   - 问题仍然存在,说明优化策略有问题

2. **相关性判断**:
   - 用户反馈优化效果不佳
   - 相关性: 与skill-optimizer相关(自我优化)
   - 触发自我优化: 是

3. **自我优化诊断**:
   - 分析上次的优化内容
   - 识别优化策略中的问题
   - 问题类型: 优化策略不够详细,遗漏了关键点

4. **自我优化方案设计**:
   - 优化目标: 改进优化策略,确保问题彻底解决
   - 优化策略: 在SKILL.md中添加更详细的检查要点和验证步骤
   - 优化内容: 强化"优化实施"阶段的验证要求,确保修改覆盖所有相关位置

5. **自我优化实施**:
   - 修改skill-optimizer的SKILL.md
   - 在"修改原则"中添加更严格的检查要求
   - 在"优化实施"中添加更详细的验证步骤
   - 强调需要检查所有相关章节,不能遗漏

6. **验证与反馈**:
   - 检查修改后的内容
   - 重新优化原SKILL
   - 向用户反馈优化结果

**关键点**:
- 用户没有明确说"优化skill-optimizer",但skill-optimizer自主判断
- 问题反馈直接指向优化效果不佳,触发自我优化
- 通过改进优化策略,避免类似问题再次发生

### 示例5: 判断为不相关,但创建ClAUDE-ERROR.md记录错误

**场景**: skill-optimizer判断问题与SKILL不相关,但用户反馈"不是这样的",说明判断错误

**用户输入**:

不是这样的,问题还是存在

**处理流程**:

1. **上下文分析**:
   - 回顾对话历史,最近使用了某个SKILL
   - skill-optimizer判断为"不相关",没有触发优化
   - 用户反馈"不是这样的",说明判断错误

2. **相关性判断**:
   - 提取关键词: 没有明确的SKILL关键词
   - 分析问题: 问题描述模糊
   - 匹配SKILL: 无明确匹配
   - 相关性: 不相关(判断结果)

3. **创建错误记录**:
    - 确认判断错误: 用户反馈"不是这样的"
    - 创建ClAUDE-ERROR.md文件
    - 记录错误原因和修正后的执行方式

 4. **ClAUDE-ERROR.md内容**:

```markdown
# Claude分析错误记录

---

## wrong-judgment-2024-02-01

### 用户原始描述
使用某个SKILL检查代码后，说分析错了，实际某个文件不需要XBH_AI_PATCH_MODIFY这个标签的，因为没有代码的修改。skill-optimizer只生成了change-log，没有实际优化该SKILL。

### 问题上下文
用户使用某个SKILL检查代码规范，发现检查结果有误，某个文件中没有代码修改，但该SKILL错误地建议添加XBH_AI_PATCH_MODIFY标签。skill-optimizer判断问题与该SKILL强相关，但只生成了change-log文档，没有实际修改该SKILL的SKILL.md文件来修复这个逻辑错误。

### 错误原因
1. change-log路径错误：在skill-optimizer目录下创建了change-log，而不是在被优化的SKILL目录下。错误地使用了skill-optimizer作为目录名，而不是被优化的SKILL名称。
2. 只记录不修改：将change-log的生成当作了优化本身，只生成了日志文档，但没有实际修改目标SKILL的SKILL.md文件来修复检查逻辑。change-log应该是优化完成后的记录，而不是替代实际修改。

### 修正后的执行
1. change-log路径必须正确：如果优化的是某个SKILL，则路径为`${SKILLS_ROOT}/skill-optimizer/references/change-log/<skill-name>/yyyy-mm-dd.md`，绝对禁止在skill-optimizer目录下直接创建change-log。
2. 必须实际修改目标SKILL：判断为强相关后，必须完成整个优化流程，包括实际修改目标SKILL的SKILL.md文件，修复检查逻辑。change-log只是记录，不能替代实际修改。

---
```

5. **重新判断**:
   - 重新分析问题与目标SKILL的相关性
   - 结合用户的反馈,重新判断
   - 最终判断: 强相关
   - 触发目标SKILL优化

6. **自我优化**:
   - 读取ClAUDE-ERROR.md
   - 分析判断错误的原因: 过度依赖关键词匹配,忽略上下文
   - 改进判断策略: 加强对话上下文的权重
   - 优化SKILL.md中的判断方法

**关键点**:
- 判断为"不相关"时,必须创建ClAUDE-ERROR.md
- 用户反馈后,需要重新判断并优化
- ClAUDE-ERROR.md帮助识别判断错误模式
- 自我优化时必须先读取ClAUDE-ERROR.md

## 注意事项

### 优化前注意事项
1. **充分理解问题**: 在优化前,充分理解用户描述的问题
2. **充分理解SKILL**: 在优化前,充分理解SKILL的功能和逻辑
3. **分析问题与SKILL的关系**: 在优化前,分析问题是否由SKILL导致
4. **评估优化影响**: 在优化前,评估优化的影响范围
5. **制定详细方案**: 在优化前,制定详细的优化方案

### 优化中注意事项
1. **最小化修改**: 只修改必要的内容
2. **保持一致性**: 保持SKILL的整体风格一致
3. **提高可读性**: 使用清晰易懂的语言和格式
4. **确保实用性**: 确保优化内容实用有效

### 优化后注意事项
1. **验证优化效果**: 验证优化是否解决了问题
2. **检查新问题**: 检查是否引入了新问题
3. **收集用户反馈**: 收集用户对优化效果的反馈
4. **记录优化日志**: 记录优化的详细信息

### 特殊注意事项

> 参见: [special-handling.md](./assets/special-handling.md)

### 最佳实践

> 参见: [best-practices.md](./assets/best-practices.md)

### 错误处理

> 参见: [error-handling.md](./assets/error-handling.md)

## 与其他技能的协作

本技能可以与以下技能配合使用:
- **所有其他SKILL**: 本技能优化其他所有SKILL

## 持续改进计划

> 参见: [continuous-improvement.md](./assets/continuous-improvement.md)
