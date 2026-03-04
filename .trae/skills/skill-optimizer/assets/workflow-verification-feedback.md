# 验证与反馈流程

## 概述

验证与反馈是skill-optimizer的第五阶段,在优化实施后进行。验证优化效果并向用户反馈。

## 验证步骤

### 1. 优化验证

验证优化后的效果:

- **检查修改后的SKILL是否解决了问题**:
  - 测试原问题是否还存在
  - 验证修改是否有效

- **检查修改后的SKILL是否引入新问题**:
  - 测试其他功能是否正常
  - 检查是否有副作用

- **检查修改后的SKILL是否符合规范**:
  - 验证格式是否正确
  - 检查是否符合规范要求

- **检查修改后的SKILL是否易于理解和执行**:
  - 评估表述是否清晰
  - 确认流程是否合理

### 2. 向用户反馈

向用户提供清晰的反馈:

- **说明优化了哪些内容**:
  - 列出修改的章节
  - 说明修改的类型(新增、修改、删除)

- **说明优化解决了什么问题**:
  - 描述解决的问题
  - 说明改进的效果

- **说明优化可能带来的影响**:
  - 正面影响: 改进的功能
  - 负面影响: 可能的限制

- **建议用户测试优化后的效果**:
  - 提供测试建议
  - 说明测试要点

### 3. 记录优化日志

记录优化的详细信息,将优化日志写入以下目录结构:

**日志目录结构**:
```
${SKILLS_ROOT}/skill-optimizer/references/change-log/<skill-name>/
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
- Windows: `C:\Users\username\.trae\skills\skill-optimizer\references\change-log\<skill-name>\`
- Linux/Mac: `/home/username/.trae/skills/skill-optimizer/references/change-log/<skill-name>/`
- GitHub: `/home/username/project/.github/skills/skill-optimizer/references/change-log/<skill-name>/`
- Claude: `/home/username/project/.claude/skills/skill-optimizer/references/change-log/<skill-name>/`

**日志文件命名**:
```
<problem-description>-yyyy-mm-dd.md
```
其中:
- `<problem-description>`: 问题描述(非常简洁,使用英文,如: static-context-leak, wrong-patch-label等)
- `yyyy-mm-dd`: 年-月(如: 2025-02-03)

**重要说明**:
- **必须使用被优化的SKILL名称作为目录名**,而不是skill-optimizer
- 例如: 如果优化的是某个SKILL,则路径为:
  - 目录: `${SKILLS_ROOT}/skill-optimizer/references/change-log/<skill-name>/`
  - 文件: `${SKILLS_ROOT}/skill-optimizer/references/change-log/<skill-name>/<problem-description>-yyyy-mm-dd.md`
- **绝对禁止**在skill-optimizer目录下直接创建change-log

**日志文件内容格式**:

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

---

## 优化总结
<优化的整体总结>

---

## 验证结果

- **验证状态**: 通过 / 未通过
```

## 验证输出

验证与反馈阶段的最终输出:

1. 验证状态(通过/未通过)
2. 验证详情
3. 用户反馈内容
4. change-log记录

这些信息将作为优化流程的最终输出,记录到change-log中。
