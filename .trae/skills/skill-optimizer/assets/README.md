# Assets资源说明

## 概述

此目录包含skill-optimizer的辅助文档和流程说明,用于支持SKILL.md中的工作流程。

## 目录结构

```
${SKILLS_ROOT}/skill-optimizer/assets/
├── README.md                              # 本文件,说明assets目录的用途和结构
├── workflow-relevance-judgment.md   # 相关性判断流程说明
├── workflow-problem-diagnosis.md         # 问题诊断流程说明
├── workflow-optimization-solution.md    # 优化方案设计流程说明
├── workflow-optimization-implementation.md # 优化实施流程说明
├── workflow-verification-feedback.md         # 验证与反馈流程说明
├── format-change-log.md                       # Change-log格式规范说明
├── self-optimization.md                       # 自我优化能力说明
├── active-iteration.md                        # 主动持续迭代说明
├── special-handling.md                        # 特殊处理说明
├── error-handling.md                          # 错误处理说明
├── best-practices.md                          # 最佳实践说明
└── continuous-improvement.md              # 持续改进计划说明
```

**路径说明**:
- `${SKILLS_ROOT}`: SKILLS_ROOT环境变量指定的目录,或按优先级查找的skills目录
- `skill-optimizer`: 本技能的目录名

**支持的目录前缀**:
- `.trae` - Trae IDE的默认目录
- `.github` - GitHub Actions相关目录
- `.claude` - Claude相关目录
- `skills` - 直接的skills目录
- 其他自定义前缀(通过SKILLS_ROOT环境变量指定)

**实际路径示例**:
- Windows: `C:\Users\username\.trae\skills\skill-optimizer\assets\`
- Linux/Mac: `/home/username/.trae/skills/skill-optimizer/assets/`
- GitHub: `/home/username/project/.github/skills/skill-optimizer/assets/`
- Claude: `/home/username/project/.claude/skills/skill-optimizer/assets/`

## 文档说明

### Workflow文档

这些文档详细描述了skill-optimizer的完整工作流程:

1. **workflow-relevance-judgment.md**: 相关性判断流程
   - 判断原则和策略
   - 判断方法和步骤
   - 判断结果处理

2. **workflow-problem-diagnosis.md**: 问题诊断流程
   - 诊断步骤
   - 问题类型定位
   - 问题详情记录

3. **workflow-optimization-solution.md**: 优化方案设计流程
   - 分析步骤
   - 优化目标确定
   - 优化策略设计

4. **workflow-optimization-implementation.md**: 优化实施流程
   - 修改步骤
   - 修改类型说明
   - 修改验证

5. **workflow-verification-feedback.md**: 验证与反馈流程
   - 验证步骤
   - 用户反馈说明
   - change-log记录

### Format文档

这些文档提供了格式规范:

6. **format-change-log.md**: Change-log格式规范
   - 目录结构说明
   - 命名规范
   - 日志内容格式
   - 使用场景说明

## 使用方式

在skill-optimizer执行优化时,会逐步调用这些文档:

1. 根据当前所处的阶段,参考对应的workflow文档
2. 按照文档中的流程和规范执行
3. 确保每一步都符合规范要求
4. 记录必要的日志和信息

## 维护说明

- 保持文档与SKILL.md中工作流程的一致性
- 更新工作流程时,同步更新对应的workflow文档
- 确保文档的准确性和完整性
