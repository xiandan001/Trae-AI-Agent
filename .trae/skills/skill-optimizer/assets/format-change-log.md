# Change-log格式规范

## 概述

change-log用于记录所有SKILL的优化历史,是skill-optimizer的重要知识资产。

## 目录结构

```
${SKILLS_ROOT}/skill-optimizer/references/change-log/
├── README.md
├── <skill-name-1>/
│   ├── <problem-description>-yyyy-mm-dd.md
│   └── ...
├── <skill-name-2>/
│   └── ...
└── ...
```

**路径说明**:
- `${SKILLS_ROOT}`: SKILLS_ROOT环境变量指定的目录,或按优先级查找的skills目录
- `skill-optimizer`: 本技能的目录名
- `<skill-name>`: 被优化的SKILL名称(使用小写字母和连字符,与SKILL目录名一致)

**支持的目录前缀**:
- `.trae` - Trae IDE的默认目录
- `.github` - GitHub Actions相关目录
- `.claude` - Claude相关目录
- `skills` - 直接的skills目录
- 其他自定义前缀(通过SKILLS_ROOT环境变量指定)

**实际路径示例**:
- Windows: `C:\Users\username\.trae\skills\skill-optimizer\references\change-log\`
- Linux/Mac: `/home/username/.trae/skills/skill-optimizer/references/change-log/`
- GitHub: `/home/username/project/.github/skills/skill-optimizer/references/change-log/`
- Claude: `/home/username/project/.claude/skills/skill-optimizer/references/change-log/`

## 命名规范

### SKILL目录名

- 使用小写字母和连字符,与SKILL名称一致
- 示例: `apk-installer`, `code-checker`

### 日志文件名

**格式**: `<problem-description>-yyyy-mm-dd.md`

**示例**:
- `static-context-leak-2025-02-01.md`
- `wrong-patch-label-2025-02-02.md`
- `install-restart-2025-02-03.md`

**组成部分说明**:
- `<problem-description>`: 问题描述(非常简洁,使用英文,如: static-context-leak, wrong-patch-label等)
- `yyyy-mm-dd`: 年-月-日(如: 2025-02-03)

**重要说明**:
- 不再使用时分秒,因为不准确
- 使用问题描述英文缩写作为文件名前缀
- 月内第1条记录为01,第2条为02,依此类推

## 日志内容格式

```markdown
# SKILL优化日志

## 基本信息
- **SKILL名称**: <skill-name>
- **优化时间**: yyyy-mm-dd HH:mm:ss (中国北京时间UTC+8)

---

## 问题描述

### 用户反馈
<用户原始问题描述>

---

## 问题诊断

- **问题类型**: 内容缺失 / 逻辑错误 / 表述不清 / 执行问题 / 架构问题
- **问题位置**: <文件路径> -> <章节名称> (第<行号>行)
- **问题详情**: <问题的详细描述>

---

## 修改的文件

### 文件1: <文件路径>

**修改位置**: <章节名称> (第<行号>行)

**修改前**:
```markdown
<原代码或内容>
```

**修改后**:
```markdown
<修改后的代码或内容>
```

### 文件2: <文件路径>

**修改位置**: <章节名称> (第<行号>行)

**修改前**:
```markdown
<原代码或内容>
```

**修改后**:
```markdown
<修改后的代码或内容>
```

---

## 优化总结
<优化的整体总结>

---

## 验证结果

- **验证状态**: 通过 / 未通过
```

## 日志记录原则

1. **每次优化必记录**: 每次执行SKILL优化后,必须创建或更新对应的优化日志文件

2. **月内多次优化**: 由于日志文件名包含月内序号(01, 02, 03, ...),每次优化都会创建新的日志文件,不会出现冲突

3. **完整性**: 必须填写日志文件中的所有章节,确保记录完整

4. **准确性**: 记录的内容必须真实准确,包括修改前后的对比

## 使用场景

- **历史追溯**: 通过日志可以追溯任何SKILL的优化历史
- **问题分析**: 当出现问题时,可以通过日志分析优化过程,找出问题根源
- **模式识别**: 通过分析历史日志,识别常见的优化模式和问题类型
- **策略改进**: 根据日志中的用户反馈,改进优化策略
- **知识积累**: 日志是重要的知识资产,可以作为后续优化的参考
