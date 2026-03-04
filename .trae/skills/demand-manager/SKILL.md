---
name: demand-manager
description: 用于Android应用开发的需求分析、需求设计和需求实现。当用户输入包含"需求"关键词的请求时触发此技能,自动进行需求解析、功能拆分、技术方案设计,并根据阶段逐步生成需求分析文档、方案设计文档和开发实现文档。支持大需求自动拆分为多个子模块,探索用户意图,确保文档精准精确。
---

# 需求管理

## 技能概述

本技能用于Android应用开发的需求全生命周期管理,包括需求分析、需求设计和需求实现三个阶段。当用户输入包含"需求"关键词时触发,自动解析需求、探索用户意图、拆分功能模块,并生成规范化的需求文档。

## 触发条件

当用户输入包含"需求"关键词时触发本技能,包括但不限于以下场景:
- "我需要开发一个XX功能,请帮我分析需求"
- "帮我设计XX功能的实现方案"
- "分析这个需求并生成完整的文档"
- "这是一个需求: XXX"
- "需求: XXX"

## 工作流程

### 阶段零: 需求确认

在开始任何文档生成之前,必须先进行需求确认:

#### 0.1 理解用户需求
- 仔细阅读用户提供的需求描述
- 提取关键信息:功能点、业务场景、技术要求等
- 识别需求的隐含信息和潜在需求

#### 0.2 需求理解总结
根据对需求的理解,向用户展示以下内容:
- **需求概述**:用简洁的语言描述对需求的整体理解
- **核心功能点**:列出识别出的主要功能点
- **技术要点**:识别出的关键技术要求或限制
- **预期成果**:理解的需求完成后的预期效果
- **疑问点**:不明确或需要用户澄清的部分

#### 0.3 用户确认
- 询问用户: "根据我的理解,您的需求是这样的,是否正确?"
- 如果用户同意:进入阶段一,开始需求分析和文档生成
- 如果用户不同意或有补充:
  - 仔细听取用户的反馈和修改意见
  - 重新理解需求
  - 再次展示需求理解总结
  - 重复确认流程,直到用户确认理解正确

#### 0.4 确认原则
- **必须确认**:在生成任何文档之前,必须获得用户的明确确认
- **准确理解**:确保对需求的理解与用户意图完全一致
- **及时反馈**:对于不明确的地方,及时向用户询问
- **耐心沟通**:如果理解有偏差,耐心听取用户意见并调整

### 阶段一: 需求分析

#### 1.1 探索用户意图
- 仔细阅读用户提供的需求描述
- 识别需求的真实目的和期望结果
- 明确需求的优先级和重要性
- 识别需求的隐含信息

#### 1.2 需求解析
- 提取功能需求点
- 识别非功能需求(性能、安全、兼容性等)
- 分析需求的技术依赖
- 识别潜在的技术风险

#### 1.3 功能拆分
对于大需求,自动识别并拆分为多个子模块:
- 分析需求的复杂度和规模
- 识别功能边界和模块划分
- 确保每个子模块职责单一、高内聚低耦合
- 定义模块间的依赖关系
- 为每个子模块生成独立的需求分析文档

#### 1.4 生成需求分析文档
使用`assets/requirements_analysis_template.md`模板,为每个需求或子模块生成需求分析文档,保存在:
- `/demand_name/requirements_analysis_document.md`

### 阶段二: 需求设计

#### 2.1 分析项目架构
优先检查当前项目的架构模式:
- 查看项目根目录是否存在`claude.md`文件
- 如果存在,分析项目的目录结构和文件依赖关系
- 理解项目现有的架构模式和技术栈
- 确保新需求与现有架构保持一致

#### 2.2 默认架构设计
如果项目没有明确的架构定义,使用以下默认技术栈:
- **语言**: Kotlin
- **架构模式**: MVVM (Model-View-ViewModel)
- **动画**: 属性动画 (Property Animation)
- **资源国际化**: strings.xml 优先支持中文、日文、英文、韩文

#### 2.3 布局设计规范

**重要**：UI布局必须优先使用ConstraintLayout，避免使用LinearLayout或RelativeLayout作为主布局容器。

##### 2.3.1 布局选择原则
- **主布局容器优先使用ConstraintLayout**：ConstraintLayout提供更好的性能和灵活性，适合复杂布局
- **列表使用RecyclerView**：RecyclerView是列表显示的最佳选择，性能优于ListView
- **简单容器可以使用LinearLayout**：仅在简单线性布局场景下使用LinearLayout，如按钮组
- **避免使用RelativeLayout**：RelativeLayout性能较差，ConstraintLayout可以完全替代其功能

##### 2.3.2 ConstraintLayout使用优势
- **性能更优**：ConstraintLayout通过两次测量完成布局，比RelativeLayout性能更好
- **布局更灵活**：使用约束定位，可以轻松实现复杂的UI布局
- **响应式设计**：支持百分比布局和链式约束，适配不同屏幕尺寸
- **代码更简洁**：减少嵌套层级，提高布局可读性

##### 2.3.3 布局设计示例

**正确示例 - 使用ConstraintLayout作为主布局**：
```xml
<!-- AI_AGENT_PATCH_START -->
<!-- 使用ConstraintLayout作为主布局容器 -->
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/title"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
<!-- AI_AGENT_PATCH_END -->
```

**错误示例 - 使用LinearLayout作为主布局**：
```xml
<!-- 错误：应使用ConstraintLayout而非LinearLayout作为主布局 -->
<!-- <LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    
    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/title" />
        
</LinearLayout> -->
```

**错误示例 - 使用RelativeLayout作为主布局**：
```xml
<!-- 错误：应使用ConstraintLayout而非RelativeLayout作为主布局 -->
<!-- <RelativeLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/title"
        android:layout_centerInParent="true" />
        
</RelativeLayout> -->
```

##### 2.3.4 特殊场景处理
**简单线性布局场景**：当只需要简单的垂直或水平排列时，可以使用LinearLayout：
```xml
<!-- AI_AGENT_PATCH_START -->
<!-- 简单按钮组使用LinearLayout是可以接受的 -->
<LinearLayout
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="horizontal">

    <Button
        android:id="@+id/btn_cancel"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/btn_cancel" />

    <Button
        android:id="@+id/btn_confirm"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/btn_confirm"
        android:layout_marginStart="12dp" />

</LinearLayout>
<!-- AI_AGENT_PATCH_END -->
```

#### 2.4 架构设计
根据需求分析结果,设计系统架构:
- 定义整体架构层次 (UI层、业务逻辑层、数据层)
- 设计核心组件和职责划分
- 规划模块划分和模块间交互
- 设计数据流向和数据模型
- 设计UI界面布局和交互方式

##### UI设计说明
**重要**: 当前所有UI设计来源于Pixso,已配置Pixso MCP可直接调用Pixso中的UI资源。

UI设计流程:
1. **检查Pixso链接**: 首先确认用户是否提供了Pixso设计稿链接
2. **有Pixso链接时**:
   - 使用Pixso MCP工具获取UI设计稿
   - 从Pixso中提取设计规范、组件样式、布局信息
   - 在UI设计部分标注对应的Pixso链接
   - 严格按照Pixso设计稿进行UI实现
3. **无Pixso链接时**:
   - 根据对用户需求的理解,生成符合预期的UI样式
   - 按照默认UI规范(ConstraintLayout、RecyclerView等)设计布局
   - 在UI设计部分标注"根据需求理解生成"
   - 提醒用户可提供Pixso链接以获得更精确的设计参考

在方案设计文档的"UI界面设计"章节中:
- 如果有Pixso链接:添加Pixso链接引用,说明UI来源
- 如果无Pixso链接:说明根据需求理解设计的UI样式
- 对于需要Pixso交互的设计,调用相关Pixso MCP工具获取详细设计信息

#### 2.4 生成方案设计文档
使用`assets/demand_design_template.md`模板,为每个需求或子模块生成方案设计文档,保存在:
- `/demand_name/demand_design_document.md`

### 阶段三: 需求实现

#### 3.1 实现规划
根据方案设计,制定实现计划:
- 定义实现范围和优先级
- 划分实现任务和里程碑
- 规划业务逻辑实现方式
- 设计数据处理流程
- 规划错误处理机制

#### 3.2 代码规范
确保所有代码注释符合规范:
- 类注释使用Javadoc格式,包含label、desc、author、time
- 方法中的代码修改使用`// AI_AGENT_PATCH_START`和`// AI_AGENT_PATCH_END`包围
- 如存在原代码,保留并注释,添加`// AI_AGENT_PATCH_MODIFY`标签
- XML文件修改使用`<!-- AI_AGENT_PATCH_START -->`和`<!-- AI_AGENT_PATCH_END -->`包围

#### 3.3 生成开发实现文档
使用`assets/demand_implementation_template.md`模板,为每个需求或子模块生成开发实现文档,保存在:
- `/demand_name/demand_implementation_document.md`

## 文档生成原则

### 准确性
- 确保文档内容准确反映需求
- 技术方案可行且可实现
- 避免模糊不清的描述
- 提供具体的实现细节

### 完整性
- 覆盖需求的所有方面
- 考虑边界情况和异常处理
- 包含必要的测试用例
- 提供完整的示例代码

### 可读性
- 使用清晰的结构和层次
- 提供图表和示例说明
- 使用规范的术语和命名
- 保持文档风格一致

### 可维护性
- 文档易于更新和扩展
- 提供版本控制信息
- 标注关键依赖和风险点
- 记录重要的决策理由

## 功能拆分策略

### 拆分标准
当需求满足以下任一条件时,需要进行拆分:
1. 功能点超过5个
2. 涉及3个或以上的独立模块
3. 预估工作量超过5个工作日
4. 包含多个独立的业务流程
5. 需要多人协作开发

### 拆分方法
1. 按业务功能拆分
2. 按技术模块拆分
3. 按开发阶段拆分
4. 按优先级拆分

### 拆分示例
原始需求: "开发一个用户管理系统,包括用户注册、登录、信息修改、密码重置、权限管理、日志记录等功能"

拆分后:
- 子模块1: 用户认证模块 (注册、登录)
- 子模块2: 用户信息管理模块 (信息修改、密码重置)
- 子模块3: 权限管理模块
- 子模块4: 日志记录模块

## 文件命名规范

### 需求目录命名
- 使用英文命名,避免中文
- 使用小写字母和下划线
- 名称简洁明了,能反映需求主题
- 示例: `user_management_system`、`device_control_module`

### 文档文件命名
- 需求分析文档: `requirements_analysis_document.md`
- 方案设计文档: `demand_design_document.md`
- 开发实现文档: `demand_implementation_document.md`

## 使用资源文件

### 模板文件
本技能提供三个模板文件,位于`assets/`目录:
- `requirements_analysis_template.md`: 需求分析文档模板
- `demand_design_template.md`: 方案设计文档模板
- `demand_implementation_template.md`: 开发实现文档模板

### 模板使用
在生成文档时,读取对应的模板文件,填充具体内容:
- 替换`[项目名称]`为实际项目名
- 填充具体的`[日期]`和`[负责人]`
- 根据需求填充各个章节内容
- 保留必要的示例代码框架
- 删除不适用的章节或标注为可选

## 输出文档结构

对于每个需求或子模块,生成以下文档结构:
```
/demand_name/
├── requirements_analysis_document.md
├── demand_design_document.md
└── demand_implementation_document.md
```

对于拆分的子模块,在每个子模块目录下生成独立的三份文档。

## 注意事项

1. **阶段渐进**: 根据用户需求逐步生成文档,不要一次性生成所有文档
2. **用户确认**: 在生成下一阶段文档前,确认用户对当前阶段文档的满意度
3. **迭代优化**: 根据用户反馈及时调整和优化文档内容
4. **技术可行**: 确保设计方案技术可行,考虑项目实际情况
5. **资源评估**: 评估实现所需的资源和工作量
6. **风险管理**: 识别和记录潜在的技术风险和应对措施

## 与其他技能的协作

本技能可以与以下技能配合使用:
- `gerrit-committer`: 代码提交到Gerrit
- `assemble-builder`: 构建Android应用
- `adb-apk-installer`: 安装APK到设备
- `defect-analyzer`: 分析和解决开发中的缺陷

## 错误处理

### 需求不明确
- 向用户询问更多细节
- 提供假设性的分析,标注需要确认的点
- 分阶段生成文档,逐步明确需求

### 技术方案不可行
- 提供替代方案
- 说明限制和约束
- 调整需求以适应技术限制

### 文档生成失败
- 检查模板文件是否存在
- 确认文件路径和权限
- 提供详细的错误信息
