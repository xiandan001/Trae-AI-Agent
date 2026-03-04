---
name: code-compliance-checker
description: Android应用代码提交前规范检查技能。在代码提交到版本控制系统前，对修改的代码进行全面的质量检查，包括隐性问题识别、代码优化建议、架构符合性验证、内存泄漏检测等。适用于Java和Kotlin编写的Android应用代码。
---

# Android 代码合规性检查器

## 概述

此技能提供Android应用代码提交前的全面规范检查功能，帮助开发者在代码提交前识别潜在问题、优化代码质量、验证架构符合性，并检测内存泄漏等严重问题。通过系统化的检查流程，确保提交的代码符合团队编码规范和架构设计要求。

## 检查触发条件

在以下场景触发此技能：
- 用户明确请求检查代码合规性
- 代码提交前需要验证代码质量
- 用户提到"检查代码"、"规范检查"、"代码审查"等关键词
- 用户询问代码是否存在问题、是否可以优化
- 用户担心内存泄漏或其他潜在问题

## 检查流程

### 步骤 1：识别修改范围

首先确定需要检查的代码范围：

1. **确定检查对象**
   - 识别用户提供的代码文件或代码片段
   - 如果是Git差异，分析修改的具体内容
   - 确定涉及的所有相关文件

2. **收集上下文信息**
   - 读取相关源代码文件
   - 检查文件的导入语句和依赖关系
   - 了解类的继承关系和接口实现

3. **识别代码类型**
   - 确定是Java还是Kotlin代码
   - 识别代码所属的组件类型（Activity、Fragment、Service等）
   - 确定代码在架构中的位置（表现层、业务层、数据层）

### 步骤 2：隐性问题检查

对代码进行深度分析，识别潜在的隐藏问题：

1. **空指针风险检查**
   - 检查所有可能的空指针访问
   - 验证对象在使用前是否进行了空值检查
   - 识别未初始化的变量使用
   - 检查方法返回值是否可能为null但未处理

2. **并发安全问题**
   - 检查共享变量的访问是否线程安全
   - 识别多线程环境下的竞态条件
   - 验证集合的并发访问是否安全
   - 检查同步块的正确性

3. **异常处理问题**
   - 检查是否捕获了过于宽泛的异常（Exception、Throwable）
   - 验证异常捕获后是否有适当的处理
   - 识别吞掉异常的代码块
   - 检查资源释放是否在finally块中

4. **逻辑错误风险**
   - 检查条件判断的完整性（是否有遗漏的分支）
   - 验证循环的终止条件是否正确
   - 识别可能的死循环
   - 检查边界条件处理

5. **性能隐患**
   - 识别在循环中创建对象的情况
   - 检查是否有不必要的重复计算
   - 验证集合操作是否高效
   - 识别可能的性能瓶颈

### 步骤 3：代码优化建议

基于代码分析提供优化建议：

1. **代码结构优化**
   - 建议将重复代码抽取为方法
   - 推荐使用设计模式改进代码结构
   - 建议优化方法的职责划分
   - 推荐合理的代码组织方式

2. **性能优化**
   - 建议使用更高效的算法或数据结构
   - 推荐避免不必要的对象创建
   - 建议优化循环和条件判断
   - 推荐使用缓存机制

3. **可读性优化**
   - 建议改善变量和方法命名
   - 推荐添加必要的注释
   - 建议简化复杂的逻辑
   - 推荐使用更清晰的表达方式

4. **代码简化**
   - 建议使用更简洁的语言特性
   - 推荐消除冗余代码
   - 建议使用标准库替代自定义实现
   - 推荐使用现代API（如果适用）

### 步骤 4：架构符合性验证

验证代码是否符合项目的架构设计：

1. **分层架构验证**
   - 检查代码是否处于正确的架构层
   - 验证层次依赖关系是否正确
   - 识别跨层访问的违规行为
   - 确认组件职责是否符合架构设计

2. **MVVM模式检查**
   - 验证ViewModel的职责是否正确
   - 检查ViewModel是否持有View引用
   - 确认LiveData的使用是否规范
   - 验证数据绑定是否正确实现

3. **Repository模式检查**
   - 验证Repository的职责是否单一
   - 检查数据源的协调是否合理
   - 确认数据转换和映射是否正确
   - 验证依赖注入是否合理

4. **Clean Architecture检查**
   - 验证UseCase的职责是否单一
   - 检查实体的定义是否纯粹
   - 确认依赖方向是否正确
   - 验证接口设计是否合理

5. **模块化检查**
   - 验证模块划分是否合理
   - 检查模块间依赖是否清晰
   - 识别循环依赖问题
   - 确认模块接口设计是否合理

### 步骤 5：内存泄漏检测

重点检查可能导致内存泄漏的代码模式：

1. **Handler相关检查**
   - 检查Handler是否使用匿名内部类
   - 验证Handler是否持有外部类引用
   - 检查Runnable是否持有外部类引用
   - 确认在onDestroy中是否移除了消息和回调
   - 验证Handler是否使用静态内部类+WeakReference

2. **线程相关检查**
   - 检查线程池是否在onDestroy中关闭
   - 验证AsyncTask是否持有Activity引用
   - 检查Timer/TimerTask是否在onDestroy中取消
   - 确认线程任务是否在组件销毁时停止
   - 验证线程是否正确处理生命周期

3. **静态变量检查**
   - 检查静态变量是否持有Context引用
   - 验证静态变量是否持有View引用
   - 检查静态集合是否未清理
   - 确认静态变量的生命周期是否合理
   - 验证静态变量是否使用了WeakReference

4. **单例模式检查**
   - 检查单例是否持有Activity引用
   - 验证单例持有的Context是否为Application Context
   - 检查单例是否持有View或其他资源
   - 确认单例的生命周期管理是否正确

5. **资源释放检查**
   - 检查Bitmap是否在onDestroy中回收
   - 验证Cursor是否在使用后关闭
   - 检查流（InputStream/OutputStream）是否在finally中关闭
   - 确认BroadcastReceiver是否在onDestroy中注销
   - 验证监听器是否在适当时机移除

6. **其他泄漏检查**
   - 检查WebView是否在onDestroy中销毁
   - 验证属性动画是否在onDestroy中取消
   - 检查非静态内部类是否持有外部类引用
   - 确认所有注册的监听器都已注销

**内存泄漏检查参考：** 加载 `references/memory_leak_checklist.md` 获取详细的检查清单和示例。

### 步骤 6：代码规范检查

验证代码是否符合Android编码规范：

1. **命名规范**
   - 检查类名是否符合PascalCase
   - 验证方法名是否符合camelCase
   - 检查变量名是否符合规范
   - 验证常量名是否使用全大写
   - 检查资源文件命名是否规范

2. **注释规范**
   - 检查类是否有Javadoc注释
   - 验证复杂方法是否有说明
   - 检查关键代码是否有注释
   - 验证XML文件是否有必要注释
   - 确认注释内容是否准确

3. **代码格式规范**
   - 检查缩进是否统一（4个空格）
   - 验证行宽是否超过限制（120字符）
   - 检查空格使用是否规范
   - 验证空行使用是否合理

4. **异常处理规范**
   - 检查是否捕获了具体的异常类型
   - 验证异常处理是否合理
   - 检查finally块是否正确使用
   - 验证是否吞掉了异常

5. **资源使用规范**
   - 检查是否使用资源ID而非硬编码
   - 验证资源是否合理复用
   - 检查多语言支持是否完善

6. **日志使用规范检查** 【严重问题】
   
   **严重程度：严重** - 使用非XbhLog日志组件属于严重问题，必须强制修改。
   
   检查代码中的日志使用是否符合XbhLog日志组件规范：
   
   **（1）依赖检查（首次使用时）**
   - 检查项目是否已添加XbhLog依赖
   - 依赖配置：`implementation 'com.xbh.ability:log:0.0.8'`
   - 如果未添加依赖，**必须主动添加依赖**
   
   **（2）日志组件使用检查【强制】**
   - **强制要求使用XbhLog日志组件**
   - **禁止使用Android原生Log**（Log.v、Log.d、Log.i、Log.w、Log.e等）
   - **禁止使用Timber等其他日志库**
   - **禁止使用项目中的LogUtils**（如果有）
   - 发现使用非XbhLog日志组件时，**必须主动修改为XbhLog**
   
   **正确示例：**
   ```java
   // XBH_AI_PATCH_START
   // 使用XbhLog打印日志
   // XBH_AI_PATCH_MODIFY
   XbhLog.v(TAG, "Verbose message");
   XbhLog.d("Debug message");
   XbhLog.i(TAG, "Info message");
   XbhLog.w(TAG, "Warning message");
   XbhLog.e(TAG, "Error message", exception);
   // XBH_AI_PATCH_END
   ```
   
   **错误示例（发现后必须立即修改）：**
   ```java
   // 错误：使用Android原生Log - 必须修改为XbhLog
   Log.d(TAG, "Debug message");
   Log.e(TAG, "Error message");
   
   // 错误：使用Timber - 必须修改为XbhLog
   Timber.d("Debug message");
   
   // 错误：使用LogUtils - 必须修改为XbhLog
   LogUtils.d(TAG, "Debug message");
   ```
   
   **（3）日志级别检查**
   - 检查日志级别是否选择正确
   - VERBOSE(2)：详细的调试信息
   - DEBUG(3)：调试信息
   - INFO(4)：一般信息
   - WARN(5)：潜在问题警告
   - ERROR(6)：严重错误
   
   **（4）TAG命名检查**
   - 检查TAG是否使用类名
   - 格式：`private static final String TAG = "ClassName";`
   
   **（5）敏感信息检查**
   - 检查是否在日志中打印敏感信息
   - 禁止打印：密码、token、身份证号、银行卡号等
   
   **【强制修复要求】：**
   当发现日志使用不符合规范时，**必须主动执行以下修改**：
   
   1. **依赖添加**：如果项目未添加XbhLog依赖，在build.gradle中添加：
      ```gradle
      dependencies {
          implementation 'com.xbh.ability:log:0.0.8'
      }
      ```
   
   2. **日志替换**：将所有非XbhLog日志调用替换为XbhLog：
      ```java
      // 替换前
      Log.d(TAG, "message");
      Log.e(TAG, "error", exception);
      
      // 替换后
      // XBH_AI_PATCH_START
      // 替换为XbhLog日志组件
      // XBH_AI_PATCH_MODIFY
      XbhLog.d(TAG, "message");
      XbhLog.e(TAG, "error", exception);
      // XBH_AI_PATCH_END
      ```
   
   3. **日志级别映射**：
      | 原日志调用 | XbhLog替换 |
      |-----------|-----------|
      | Log.v() | XbhLog.v() |
      | Log.d() | XbhLog.d() |
      | Log.i() | XbhLog.i() |
      | Log.w() | XbhLog.w() |
      | Log.e() | XbhLog.e() |
      | Timber.d() | XbhLog.d() |
      | LogUtils.d() | XbhLog.d() |
   
   4. **添加import语句**：在文件顶部添加XbhLog的import：
      ```java
      import com.xbh.log.XbhLog;
      ```

7. **XBH注释规范检查**
   
   **适用范围：** 覆盖文件类型包括：java、kotlin、xml等主流语言文件。

   检查新修改的代码是否按照以下注释规范进行，如果没有需要添加：
   
   **（1）方法中的代码修改(java/kotlin)**

   **必须使用**以下格式包围修改的代码：
   ```java
   // XBH_AI_PATCH_START
   // (若存在原代码则保留并注释)
   // XBH_AI_PATCH_MODIFY (若存在原代码则必须加上该标签)
   // 具体修改内容的注释说明
   生成或修改的代码
   // XBH_AI_PATCH_END
   ```

   **检查要点：**
   - 检查修改的代码块是否使用 `XBH_AI_PATCH_START` 和 `XBH_AI_PATCH_END` 包围
   - 如果存在原代码，是否使用 `XBH_AI_PATCH_MODIFY` 标签
   - **重要区别**：
     - **新建文件**：不需要 `XBH_AI_PATCH_MODIFY` 标签（只针对整个文件是新建的情况）
     - **在现有文件中新增方法/变量**：不需要 `XBH_AI_PATCH_MODIFY` 标签
     - **修改现有代码**：必须使用 `XBH_AI_PATCH_MODIFY` 标签
   - 是否有具体的修改内容注释说明
   - 标签格式是否正确
   
   **（2）生成新类(java/kotlin)**
   
   **必须在类定义前添加**以下格式的Javadoc注释：
   ```java
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
   
   **检查要点：**
   - 检查新生成的类是否有Javadoc注释
   - 是否包含 `label: XBH_AI_PATCH` 标签
   - 是否包含类功能描述（desc）
   - 是否包含开发者名称（author）
   - 是否包含时间戳（time），格式为 YYYY-MM-DD HH:mm:ss
   - 注释格式是否正确
   
   **（3）XML文件修改**
   
   **必须使用**以下格式包围修改的代码：
   ```xml
   <!-- XBH_AI_PATCH_START -->
   <!-- (若存在原代码则保留并注释) -->
   <!-- XBH_AI_PATCH_MODIFY (若存在原代码则必须加上该标签) -->
   <!-- 具体修改内容的注释说明 -->
   生成或修改的XML代码
   <!-- XBH_AI_PATCH_END -->
   ```
   
   **检查要点：**
   - 检查修改的XML代码块是否使用 `XBH_AI_PATCH_START` 和 `XBH_AI_PATCH_END` 包围
   - 如果存在原代码，是否使用 `XBH_AI_PATCH_MODIFY` 标签
   - **重要区别**：
     - **新建XML文件**：不需要 `XBH_AI_PATCH_MODIFY` 标签
     - **在现有XML中新增元素/属性**：不需要 `XBH_AI_PATCH_MODIFY` 标签
     - **修改现有XML元素/属性**：必须使用 `XBH_AI_PATCH_MODIFY` 标签
   - 是否有具体的修改内容注释说明
   - XML注释格式是否正确
   
   **修复建议：**
   - 如果发现代码修改缺少XBH注释标签，需要添加相应的注释
   - 如果是新生成的类，需要添加规范的Javadoc注释
   - 确保所有注释格式符合规范要求

**代码规范参考：** 加载 `references/android_code_standards.md` 获取详细的规范要求，包括日志使用规范。

8. **Flavor判断检查**

   **检查要点：**
   - 检查代码中是否使用了 `Flavor.isXxx()` 方法进行渠道判断
   - 检查是否使用了 `BuildConfig.FLAVOR` 进行渠道判断
   - 检查是否使用了 `productFlavors` 相关的硬编码判断

   **问题说明：**
   - 使用flavor判断会导致代码与构建配置强耦合，不利于代码维护和扩展
   - 不同渠道的客制化需求应该通过RROUtils配置来实现，而不是硬编码在代码中
   - RROUtils配置方式更加灵活，可以在不修改代码的情况下调整渠道特性

   **推荐做法：**
   - 使用 `RROUtils.getBool(R.bool.xxx)` 替代 `Flavor.isXxx()` 判断
   - 使用 `RROUtils.getInt(R.integer.xxx)` 替代基于flavor的数值判断
   - 使用 `RROUtils.getString(R.string.xxx)` 替代基于flavor的字符串判断
   - 在对应渠道的 `custom_config.xml` 中添加配置项，在main渠道中设置默认值

   **示例对比：**

   **不推荐（使用flavor判断）：**
   ```kotlin
   if (Flavor.isAple()) {
       MaxValue = 120f
       vBinding.autoShutdownAfterNoSignalSwitch.gone()
       vBinding.autoShutdownAfterNoSignalSeekbar.gone()
   }
   ```

   **推荐（使用RROUtils配置）：**
   ```kotlin
   if (RROUtils.getBool(R.bool.hide_no_signal_shutdown)) {
       MaxValue = 120f
       vBinding.autoShutdownAfterNoSignalSwitch.gone()
       vBinding.autoShutdownAfterNoSignalSeekbar.gone()
   }
   ```

   **配置文件设置：**
   - APLE渠道 (`app/src/aple/res/values/custom_config.xml`):
     ```xml
     <bool name="hide_no_signal_shutdown">true</bool>
     ```
   - main渠道 (`app/src/main/res/values/custom_config.xml`):
     ```xml
     <bool name="hide_no_signal_shutdown">false</bool>
     ```

   **修复建议：**
   - 如果发现代码中使用了flavor判断，需要将其替换为RROUtils配置方式
   - 在对应的渠道配置文件中添加相应的配置项
   - 在main渠道的配置文件中设置默认值
   - 确保配置项的命名清晰、语义化

### 步骤 7：其他问题检查

检查其他常见问题：

1. **安全问题**
   - 检查是否在日志中打印敏感信息
   - 验证权限申请是否合理
   - 检查网络请求是否使用HTTPS
   - 验证组件导出是否合理

2. **兼容性问题**
   - 检查使用的API是否在最低支持版本中可用
   - 验证是否有版本兼容性处理
   - 检查是否使用了@RequiresApi注解

3. **性能问题**
   - 检查是否有overdraw问题
   - 验证是否有内存抖动
   - 检查View是否复用
   - 验证Bitmap是否优化

4. **测试性问题**
   - 检查代码是否易于测试
   - 验证依赖是否可以Mock
   - 检查是否便于编写单元测试

### 步骤 8：生成检查报告

整理检查结果，生成清晰的检查报告：

1. **报告结构**
   - 问题摘要：列出发现的所有问题
   - 严重程度分级：分为严重、警告、建议三个等级
   - 详细说明：每个问题的详细描述
   - 修复建议：具体的修复代码或建议

2. **问题分级标准**
   - **严重**：会导致应用崩溃、内存泄漏、安全漏洞等问题
   - **警告**：代码质量问题、性能问题、架构问题等
   - **建议**：代码优化建议、可读性改进等

3. **报告格式**
   - 使用清晰的标题和分段
   - 提供代码示例和修复建议
   - 使用优先级标识问题
   - 提供修复的优先级建议

4. **修复建议**
   - 对于严重问题，提供具体的修复代码
   - 对于警告和建议，提供改进方向
   - 引用相关的参考文档

## 资源

### references/

详细检查参考文档：

1. **memory_leak_checklist.md** - 内存泄漏检查清单
   - Handler相关检查要点和示例
   - 线程相关检查要点和示例
   - 静态变量检查要点和示例
   - 单例模式检查要点和示例
   - 资源释放检查要点和示例
   - 监听器未移除检查要点
   - WebView和动画相关检查
   - 检查工具使用建议

2. **android_code_standards.md** - Android代码规范
   - 命名规范（类、方法、变量、资源文件）
   - 注释规范（类注释、方法注释、行内注释、XML注释）
   - 代码格式规范（缩进、行宽、空格、空行）
   - 代码结构规范（类成员顺序、布局文件结构）
   - 异常处理规范
   - 资源使用规范
   - 线程安全规范
   - 性能优化规范
   - 安全规范
   - 兼容性规范
   - 代码审查检查点
   - 工具使用建议

3. **architecture_compliance.md** - 架构符合性检查
   - 架构分层检查
   - MVVM架构检查
   - Repository模式检查
   - 依赖注入检查
   - Clean Architecture检查
   - 组件通信检查
   - 模块化检查
   - 生命周期感知检查
   - 协程/异步处理检查
   - 数据流检查
   - 接口设计检查
   - 依赖方向检查
   - 架构审查检查点
   - 常见架构问题
   - 工具使用建议

### 使用建议

1. **检查前准备**
   - 确保代码已编译通过
   - 准备完整的代码上下文
   - 了解项目的架构设计

2. **检查过程**
   - 按照流程逐步进行检查
   - 加载相关的参考文档
   - 记录发现的问题
   - 生成详细的检查报告

3. **报告呈现**
   - 使用清晰的层级结构
   - 提供具体的修复建议
   - 标注问题的严重程度
   - 引用相关的参考文档

4. **持续改进**
   - 根据检查结果更新参考文档
   - 补充新的检查要点
   - 完善修复建议

## 检查示例

### 示例 1：Handler内存泄漏检查

**输入代码：**
```java
public class MainActivity extends Activity {
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            textView.setText("更新UI");
        }
    };
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mHandler.sendEmptyMessageDelayed(0, 5000);
    }
}
```

**检查结果：**
- **严重**：Handler使用匿名内部类，持有MainActivity引用，可能导致内存泄漏
- **修复建议：**
  ```java
  public class MainActivity extends Activity {
      private static class MyHandler extends Handler {
          private final WeakReference<MainActivity> mActivity;
          
          MyHandler(MainActivity activity) {
              mActivity = new WeakReference<>(activity);
          }
          
          @Override
          public void handleMessage(Message msg) {
              MainActivity activity = mActivity.get();
              if (activity != null && !activity.isFinishing()) {
                  activity.textView.setText("更新UI");
              }
          }
      }
      
      private Handler mHandler = new MyHandler(this);
      
      @Override
      protected void onDestroy() {
          super.onDestroy();
          if (mHandler != null) {
              mHandler.removeCallbacksAndMessages(null);
          }
      }
  }
  ```

### 示例 2：架构符合性检查

**输入代码：**
```java
public class UserActivity extends Activity {
    private UserRepository mUserRepository = new UserRepositoryImpl();
    
    private void loadUser(String userId) {
        User user = mUserRepository.getUserFromNetwork(userId);
        textView.setText(user.getName());
    }
}
```

**检查结果：**
- **警告**：在Activity中直接访问网络，违反分层架构原则
- **警告**：UserRepository应该通过依赖注入提供
- **修复建议：**
  - 将网络请求移到ViewModel
  - 使用LiveData传递数据
  - 通过依赖注入提供Repository

## 注意事项

1. **检查优先级**
   - 优先检查严重问题（内存泄漏、崩溃风险）
   - 其次检查架构问题和性能问题
   - 最后检查代码规范和优化建议

2. **上下文理解**
   - 充分理解代码的业务逻辑
   - 考虑代码的完整上下文
   - 避免误报和过度检查

3. **实用建议**
   - 提供可操作的修复建议
   - 给出具体的代码示例
   - 考虑修复的成本和收益

4. **团队规范**
   - 遵循团队的编码规范
   - 考虑项目的架构设计
   - 保持与现有代码风格一致
