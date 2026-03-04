# 需求实现指南

## 代码注释规范

### 1. 方法中的代码修改(java/kotlin)
必须使用以下格式包围修改的代码：
```
// XBH_AI_PATCH_START
// (若存在原代码则保留并注释)
// XBH_AI_PATCH_MODIFY (若存在原代码则必须加上该标签)
// 具体修改内容的注释说明
生成或修改的代码
// XBH_AI_PATCH_END
```

### 2. 生成新类(java/kotlin)
必须在类定义前添加以下格式的Javadoc注释：
```
/**
 * label: XBH_AI_PATCH
 * desc: 类的功能描述
 * author: 开发者名称
 * time: YYYY-MM-DD HH:mm:ss
 */
class 类名 {
    // 类内容
}
```

### 3. XML文件修改
必须使用以下格式包围修改的代码：
```xml
<!-- XBH_AI_PATCH_START -->
<!-- (若存在原代码则保留并注释) -->
<!-- XBH_AI_PATCH_MODIFY (若存在原代码则必须加上该标签) -->
<!-- 具体修改内容的注释说明 -->
生成或修改的XML代码
<!-- XBH_AI_PATCH_END -->
```

## 字符串资源规范

### 1. 文本内容处理原则
当实现功能涉及任何文本内容时，必须遵循以下原则：
- **优先使用strings.xml**：所有文本内容必须定义在strings.xml资源文件中
- **禁止硬编码**：不得在代码中直接硬编码任何文本字符串（除了调试日志和异常信息）
- **多语言支持**：必须同时支持中文简体、中文繁体、日语、英语、韩语

### 2. strings.xml文件结构
strings.xml必须包含以下语言版本：
```
res/
├── values/                    # 默认语言（英文）
│   └── strings.xml
├── values-zh-rCN/             # 简体中文
│   └── strings.xml
├── values-zh-rTW/             # 繁体中文
│   └── strings.xml
├── values-ja/                 # 日语
│   └── strings.xml
└── values-ko/                 # 韩语
│   └── strings.xml
```

### 3. 字符串定义规范
在strings.xml中定义字符串时，遵循以下格式：

**res/values-zh-rCN/strings.xml（简体中文）**
```xml
<!-- XBH_AI_PATCH_START -->
<!-- 字符串资源定义 -->
<!-- XBH_AI_PATCH_MODIFY -->
<!-- 功能描述：XX功能的提示文本 -->
<string name="function_name_hint">请输入功能名称</string>
<!-- XBH_AI_PATCH_END -->
```

**res/values-zh-rTW/strings.xml（繁体中文）**
```xml
<!-- XBH_AI_PATCH_START -->
<!-- 字符串资源定义 -->
<!-- XBH_AI_PATCH_MODIFY -->
<!-- 功能描述：XX功能的提示文本 -->
<string name="function_name_hint">請輸入功能名稱</string>
<!-- XBH_AI_PATCH_END -->
```

**res/values-ja/strings.xml（日语）**
```xml
<!-- XBH_AI_PATCH_START -->
<!-- 字符串资源定义 -->
<!-- XBH_AI_PATCH_MODIFY -->
<!-- 功能描述：XX功能的提示文本 -->
<string name="function_name_hint">機能名を入力してください</string>
<!-- XBH_AI_PATCH_END -->
```

**res/values/strings.xml（英文，默认）**
```xml
<!-- XBH_AI_PATCH_START -->
<!-- 字符串资源定义 -->
<!-- XBH_AI_PATCH_MODIFY -->
<!-- 功能描述：XX功能的提示文本 -->
<string name="function_name_hint">Enter function name</string>
<!-- XBH_AI_PATCH_END -->
```

**res/values-ko/strings.xml（韩语）**
```xml
<!-- XBH_AI_PATCH_START -->
<!-- 字符串资源定义 -->
<!-- XBH_AI_PATCH_MODIFY -->
<!-- 功能描述：XX功能的提示文本 -->
<string name="function_name_hint">기능 이름을 입력하세요</string>
<!-- XBH_AI_PATCH_END -->
```

### 4. 代码中使用字符串
在代码中引用字符串资源时，使用以下方式：

**Kotlin示例**
```kotlin
// XBH_AI_PATCH_START
// 使用字符串资源，避免硬编码
// XBH_AI_PATCH_MODIFY
// 设置提示文本
editText.hint = getString(R.string.function_name_hint)
// XBH_AI_PATCH_END
```

**Java示例**
```java
// XBH_AI_PATCH_START
// 使用字符串资源，避免硬编码
// XBH_AI_PATCH_MODIFY
// 设置提示文本
editText.setHint(getString(R.string.function_name_hint));
// XBH_AI_PATCH_END
```

### 5. 布局文件中使用字符串
在布局文件中引用字符串资源时，使用以下方式：
```xml
<!-- XBH_AI_PATCH_START -->
<!-- 使用字符串资源 -->
<!-- XBH_AI_PATCH_MODIFY -->
<!-- 功能描述：输入框提示文本 -->
<EditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="@string/function_name_hint" />
<!-- XBH_AI_PATCH_END -->
```

### 6. 字符串命名规范
字符串资源名称遵循以下规范：
- 使用小写字母和下划线
- 名称简洁明了，能反映字符串用途
- 格式：`[模块名]_[功能]_[类型]`
- 示例：
  - `login_username_hint`（登录用户名提示）
  - `submit_button_text`（提交按钮文本）
  - `error_message_empty`（空错误消息）

### 7. 多语言翻译注意事项
在翻译字符串时，注意以下事项：
- **准确性**：确保翻译准确表达原意
- **简洁性**：保持翻译简洁，避免过长
- **上下文**：考虑字符串的使用场景和上下文
- **格式**：保持占位符格式一致（如 %s、%d）
- **特殊字符**：注意特殊字符和转义符号的处理

### 8. 实现检查清单
在实现功能时，检查以下内容：
- [ ] 所有文本内容都已定义在strings.xml中
- [ ] 代码中没有硬编码的文本字符串
- [ ] 已创建所有必需的语言版本文件
- [ ] 字符串名称遵循命名规范
- [ ] 多语言翻译准确无误
- [ ] 布局文件中使用@string引用
- [ ] 代码中使用getString()或Context.getString()引用

## 实现流程

### 1. 初始化阶段
- 读取需求分析文档
- 读取方案设计文档
- 理解项目架构和需求

### 2. 计划制定阶段
- 基于方案设计文档，拆分功能模块
- 生成实现计划表
- 确定实现顺序和优先级

### 3. 功能实现阶段
- 按照计划表逐个实现功能
- 每完成一个功能，更新计划表状态
- 询问用户确认是否符合预期
- 如不符合，根据反馈修改

### 4. 总结阶段
- 所有功能完成后，询问是否生成需求总结文档
- 如需生成，创建需求总结文档
- 更新所有相关文档

## 功能实现要点

### 1. 需求分析文档阅读要点
- 功能需求列表
- 非功能需求（性能、安全、兼容性）
- 技术依赖
- 风险评估

### 2. 方案设计文档阅读要点
- 架构设计
- 核心组件和职责
- 数据模型设计
- UI界面设计
- 功能实现设计
- 算法设计（如存在）

### 3. 代码实现要点
- 遵循项目架构模式
- 遵循代码注释规范
- 遵循字符串资源规范
- 确保代码质量
- 处理异常情况
- 添加必要的日志

### 4. 测试要点
- 功能测试
- 性能测试
- 兼容性测试
- 边界条件测试

## 与用户交互的流程

### 1. 开始实现前
- 确认需求分析文档路径
- 确认方案设计文档路径
- 确认项目名称

### 2. 实现过程中
- 开始实现一个功能前，说明要实现的功能
- 实现完成后，询问用户是否符合预期
- 如不符合，询问具体需要修改的地方
- 修改后再次确认

### 3. 所有功能完成后
- 询问是否需要生成需求总结文档
- 如需要，生成总结文档
- 总结项目实现情况

## 文档管理

### 1. 文档路径
- 需求分析文档: `[demand_name]/requirements_analysis_document.md`
- 方案设计文档: `[demand_name]/demand_design_document.md`
- 实现计划表: `[demand_name]/implementation_plan.md`
- 需求总结文档: `[demand_name]/requirement_summary.md`

### 2. 文档命名规范
- 所有文档文件名必须使用英文
- 使用小写字母和下划线
- 名称简洁明了

### 3. 文档更新
- 实现计划表需要实时更新
- 需求总结文档在所有功能完成后生成
- 所有文档保持版本一致性

## 错误处理

### 1. 文档找不到
- 检查文档路径是否正确
- 检查文档是否存在
- 提示用户提供正确的文档路径

### 2. 实现过程中出错
- 记录错误信息
- 分析错误原因
- 提供解决方案
- 询问用户是否继续

### 3. 用户反馈不符合预期
- 询问具体不符合的地方
- 根据反馈修改实现
- 再次确认是否符合预期

## 质量保证

### 1. 代码质量
- 遵循代码规范
- 添加必要注释
- 处理异常情况
- 代码清晰易读

### 2. 功能质量
- 完全符合需求
- 功能完整
- 用户体验良好
- 性能符合要求

### 3. 文档质量
- 文档完整准确
- 结构清晰
- 易于理解
- 保持更新
