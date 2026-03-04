---
name: test-executor
description: 用于Android应用的单元测试和Android测试用例开发与执行。当用户需要对demand-implementation生成的需求代码进行测试时触发此技能。先执行UnitTest，完成并成功后询问用户是否继续AndroidTest。支持动态识别flavor和applicationId，自动执行测试并修复错误。
---

# Android测试执行器

## 技能概述

本技能用于Android应用的单元测试(UnitTest)和Android测试用例开发与执行。在需求实现完成后，为生成的需求代码编写测试用例，覆盖所有功能点，确保代码质量和功能正确性。

**测试策略**：
1. **UnitTest优先**：先进行单元测试，快速验证业务逻辑
2. **AndroidTest补充**：单元测试通过后，询问用户是否继续进行Android测试
3. **分阶段执行**：每个阶段完成后确认，再进入下一阶段
4. **错误自动修复**：只修改test目录下的代码，不改动原业务逻辑

## 触发条件

当用户输入包含"测试"、"test"等关键词，且已完成需求实现时触发本技能，包括但不限于以下场景：
- "对XX功能进行测试"
- "编写测试用例"
- "执行单元测试"
- "测试需求代码"
- "编写Android测试"

## 工作流程

### 阶段一：初始化与准备

#### 1.1 确认项目信息
- 确认项目名称和需求名称
- 读取需求实现文档（如果存在），了解已实现的功能
- 读取项目根目录的`claude.md`文件（如果存在），了解项目架构
- 确认测试范围：测试哪些功能模块

#### 1.2 识别项目配置
**识别Product Flavors**：
参考assemble-builder的逻辑，解析项目的build.gradle或build.gradle.kts文件：
- 查找 `android { productFlavors { ... } }` 配置块
- 提取所有定义的flavor名称
- 如果有多个flavor，记录下来

**识别Build Types**：
- 查找 `android { buildTypes { ... } }` 配置块
- 提取所有定义的build type名称（通常为debug和release）

**获取ApplicationId**：
- 从build.gradle中读取 `defaultConfig { applicationId "..." }`

**生成构建变体**：
- 将flavors和buildTypes进行笛卡尔积组合
- 生成格式：`<Flavor><BuildType>`

**示例**：
```groovy
android {
    defaultConfig {
        applicationId "com.xxx.whiteboard"
    }
    productFlavors {
        xxxSdk5 {
            dimension "default"
        }
        demo {
            dimension "default"
        }
    }
    buildTypes {
        debug {}
        release {}
    }
}
```

生成的变体：
- `xxxSdk5Debug`
- `xxxSdk5Release`
- `demoDebug`
- `demoRelease`

ApplicationId：
- `com.xxx.whiteboard`

### 阶段二：UnitTest测试用例开发与执行

#### 2.1 功能分析与覆盖
**检索功能代码**：
```python
使用SearchCodebase或Grep工具检索：
- 所有Java/Kotlin源文件（main目录下）
- 重点分析需求实现相关的类和方法
- 识别public、protected方法
- 识别关键业务逻辑
```

**生成测试覆盖清单**：
根据功能特性，确定UnitTest应覆盖的内容：
- **工具类**：纯Java/Kotlin逻辑，完全使用UnitTest
- **ViewModel**：业务逻辑、数据处理、状态管理
- **Repository**：数据层逻辑、缓存处理
- **数据模型**：属性验证、序列化/反序列化
- **算法和计算**：数值计算、字符串处理、格式转换
- **异常处理**：边界条件、错误情况

**不使用UnitTest的场景**：
- Activity/Fragment UI组件（使用AndroidTest）
- 需要Android系统API的代码（使用AndroidTest）
- 需要真实设备资源的代码（使用AndroidTest）

#### 2.2 生成UnitTest用例
**编写测试代码**：
- 使用JUnit 4作为测试框架
- 使用Mockito模拟依赖对象
- 测试代码位置：`src/test/java/`目录
- 包名与被测试类保持一致

**测试用例结构**：
```java
// AI_AGENT_PATCH_START
/**
 * label: AI_AGENT_PATCH
 * desc: XX类的单元测试类
 * author: AI Assistant
 * time: YYYY-MM-DD HH:mm:ss
 */
public class XxxTest {
    // AI_AGENT_PATCH_END
    
    // 测试正常情况
    @Test
    public void testNormalCase() {
        // 准备测试数据
        // 执行测试方法
        // 验证结果
    }
    
    // 测试边界条件
    @Test
    public void testBoundaryCondition() {
        // ...
    }
    
    // 测试异常情况
    @Test(expected = Exception.class)
    public void testException() {
        // ...
    }
}
```

**测试命名规范**：
- 测试类名：`被测试类名 + Test`
- 测试方法名：`test + 测试场景描述`

**Mock依赖示例**：
```java
@Test
public void testGetData() {
    // Mock依赖对象
    MockRepository mockRepository = mock(MockRepository.class);
    when(mockRepository.fetchData()).thenReturn(expectedData);
    
    // 注入Mock对象
    MyClass myClass = new MyClass(mockRepository);
    
    // 执行测试
    Result result = myClass.getData();
    
    // 验证结果
    assertEquals(expectedData, result.getData());
}
```

#### 2.3 执行UnitTest
**构建测试命令**：
```bash
./gradlew test<Flavor>ReleaseUnitTest
```

**示例**：
- `./gradlew testxxxSdk5ReleaseUnitTest`
- `./gradlew testDemoReleaseUnitTest`

**执行命令**：
- 使用RunCommand工具执行测试命令
- 等待测试完成
- 收集测试输出

#### 2.4 处理UnitTest错误
**错误识别**：
分析测试输出，识别错误类型：
- **编译错误**：测试代码语法错误、依赖缺失
- **Mock错误**：Mock对象配置不当
- **断言失败**：预期结果与实际结果不符
- **依赖错误**：缺少必要的测试依赖库

**错误处理原则**：
- **只修改test目录下的代码**
- **不要改动main目录下的业务逻辑**
- 优先修复编译错误
- 检查并完善Mock配置
- 验证测试用例的正确性

**错误修复流程**：
1. 读取错误信息
2. 分析错误根本原因
3. 修改test目录下的测试代码
4. 重新执行测试
5. 循环直到测试通过

**常见错误及解决方案**：

**错误1：Mockito依赖缺失**
```
错误信息：Cannot resolve symbol 'mock'
```
解决方案：在build.gradle中添加
```gradle
testImplementation 'org.mockito:mockito-core:4.0.0'
testImplementation 'org.mockito:mockito-inline:4.0.0'
```

**错误2：无法Mock final类或方法**
```
错误信息：Mockito cannot mock/spy because: - final class/method
```
解决方案：
- 使用mockito-inline依赖
- 或使用PowerMock（复杂场景）

**错误3：测试中使用了Android API**
```
错误信息：java.lang.RuntimeException: Stub!
```
解决方案：
- 使用Robolectric模拟Android环境
- 在build.gradle中添加：
```gradle
testImplementation "org.robolectric:robolectric:4.9"
```

**错误4：资源文件访问失败**
```
错误信息：Resource not found
```
解决方案：
- 在build.gradle中启用：
```gradle
testOptions {
    unitTests.includeAndroidResources = true
}
```

#### 2.5 确认UnitTest完成
**测试通过后**：
向用户汇报：
```
✅ UnitTest测试完成

测试结果：
- 总测试用例数：XX
- 通过：XX
- 失败：0
- 跳过：XX

测试覆盖的功能模块：
- 功能1：已覆盖 ✓
- 功能2：已覆盖 ✓
- 功能3：已覆盖 ✓
```

**询问用户**：
```
UnitTest已完成并通过，是否继续进行AndroidTest测试？
输入"是"继续，输入"否"结束测试流程。
```

### 阶段三：AndroidTest测试用例开发与执行

**注意**：只有当用户确认要继续时，才执行此阶段。

#### 3.1 功能分析与覆盖
**检索UI相关代码**：
```python
使用SearchCodebase或Grep工具检索：
- Activity类
- Fragment类
- View相关代码
- 需要设备权限的功能
- 需要真实设备资源的功能
```

**生成测试覆盖清单**：
根据功能特性，确定AndroidTest应覆盖的内容：
- **Activity/Fragment**：UI交互、生命周期、导航
- **用户界面**：点击事件、输入验证、显示效果
- **设备功能**：相机、传感器、文件访问
- **系统集成**：ContentProvider、BroadcastReceiver、Service
- **端到端流程**：完整的用户操作流程

#### 3.2 生成AndroidTest用例
**编写测试代码**：
- 使用JUnit 4作为测试框架
- 使用Espresso进行UI测试
- 使用Mockito Android版本
- 测试代码位置：`src/androidTest/java/`目录

**测试用例结构**：
```java
// AI_AGENT_PATCH_START
/**
 * label: AI_AGENT_PATCH
 * desc: XXActivity的UI测试类
 * author: AI Assistant
 * time: YYYY-MM-DD HH:mm:ss
 */
@RunWith(AndroidJUnit4.class)
public class XxxActivityTest {
    // AI_AGENT_PATCH_END
    
    @Rule
    public ActivityScenarioRule<XxxActivity> activityRule =
        new ActivityScenarioRule<>(XxxActivity.class);
    
    @Test
    public void testButtonClick() {
        // 查找UI元素
        onView(withId(R.id.button))
            // 执行操作
            .perform(click());
        
        // 验证结果
        onView(withId(R.id.result))
            .check(matches(withText("预期文本")));
    }
}
```

**Espresso常用API**：

**查找View**：
```java
// 通过ID查找
onView(withId(R.id.view_id))

// 通过文本查找
onView(withText("文本内容"))

// 通过内容描述查找
onView(withContentDescription("描述"))
```

**执行操作**：
```java
// 点击
.perform(click())

// 输入文本
.perform(typeText("输入内容"))

// 滚动
.perform(scrollTo())

// 清空文本
.perform(clearText())

// 长按
.perform(longClick())
```

**验证结果**：
```java
// 验证文本
.check(matches(withText("预期文本")))

// 验证显示状态
.check(matches(isDisplayed()))

// 验证启用状态
.check(matches(isEnabled()))

// 验证不可见
.check(matches(not(isDisplayed())))
```

**Intent测试**：
```java
@Test
public void testIntent() {
    Intents.init();
    
    // 执行操作
    onView(withId(R.id.button)).perform(click());
    
    // 验证Intent
    intended(hasComponent(SecondActivity.class.getName()));
    
    Intents.release();
}
```

#### 3.3 打包AndroidTest APK
**构建测试命令**：
```bash
./gradlew assemble<Flavor>DebugAndroidTest
```

**示例**：
- `./gradlew assemblexxxSdk5DebugAndroidTest`
- `./gradlew assembleDemoDebugAndroidTest`

**注意**：
- AndroidTest只能基于debug版本测试
- 确保机器上已安装对应的debug版本APK

**执行命令**：
- 使用RunCommand工具执行打包命令
- 等待打包完成
- 收集APK路径

**APK路径通常位于**：
```
app/build/outputs/apk/androidTest/<flavor>/debug/app-<flavor>-debug-androidTest.apk
```

#### 3.4 安装AndroidTest APK
**查找APK文件**：
使用Glob工具查找：
```python
Glob(pattern: "**/*androidTest.apk")
```

**安装APK**：
```bash
adb install <path-to-androidTest-apk>
```

**示例**：
```bash
adb install app/build/outputs/apk/androidTest/xxxSdk5/debug/app-xxxSdk5-debug-androidTest.apk
```

**执行安装命令**：
- 使用RunCommand工具执行安装命令
- 等待安装完成
- 检查安装结果

#### 3.5 执行AndroidTest
**构建测试命令**：
```bash
adb shell am instrument -w -e package <applicationId> <applicationId>.test/androidx.test.runner.AndroidJUnitRunner
```

**示例**：
```bash
adb shell am instrument -w -e package com.xxx.whiteboard com.xxx.whiteboard.test/androidx.test.runner.AndroidJUnitRunner
```

**参数说明**：
- `-w`：等待测试完成
- `-e package`：指定测试包名
- `<applicationId>`：应用的包名
- `<applicationId>.test`：测试包名
- `androidx.test.runner.AndroidJUnitRunner`：测试运行器

**执行测试命令**：
- 使用RunCommand工具执行测试命令
- 等待测试完成
- 收集测试输出

#### 3.6 处理AndroidTest错误
**错误识别**：
分析测试输出，识别错误类型：
- **UI元素查找失败**：无法找到目标View
- **操作执行失败**：点击、输入等操作失败
- **断言失败**：UI状态不符合预期
- **超时错误**：等待UI元素超时
- **权限错误**：缺少必要的权限

**错误处理原则**：
- **只修改test目录下的代码**
- **不要改动main目录下的业务逻辑**
- 优先修复UI元素定位问题
- 添加适当的等待机制
- 验证测试场景的正确性

**错误修复流程**：
1. 读取错误信息
2. 分析错误根本原因
3. 修改androidTest目录下的测试代码
4. 重新打包和安装APK
5. 重新执行测试
6. 循环直到测试通过

**常见错误及解决方案**：

**错误1：UI元素找不到**
```
错误信息：No views in hierarchy found matching: with id is <R.id.view_id>
```
解决方案：
- 确认View的ID是否正确
- 使用DataInteraction处理RecyclerView等复杂视图
- 添加等待机制：
```java
onView(withId(R.id.view_id))
    .perform(waitId(R.id.view_id, 5000));
```

**错误2：View被遮挡无法点击**
```
错误信息：Error performing 'click' on view '...'
```
解决方案：
- 先滚动到目标View：
```java
onView(withId(R.id.view_id))
    .perform(scrollTo(), click());
```

**错误3：权限被拒绝**
```
错误信息：Permission Denial
```
解决方案：
- 在测试前授予权限：
```java
@Before
public void grantPermissions() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        InstrumentationRegistry.getInstrumentation().getUiAutomation()
            .executeShellCommand("pm grant " + 
                InstrumentationRegistry.getInstrumentation().getTargetContext().getPackageName() +
                " android.permission.CAMERA");
    }
}
```

**错误4：测试超时**
```
错误信息：Action will not be performed because the target view does not match one or more of the following constraints
```
解决方案：
- 使用IdlingResource处理异步操作：
```java
IdlingResource idlingResource = new CountingIdlingResource("Network");
Espresso.registerIdlingResources(idlingResource);
// ... 执行测试
Espresso.unregisterIdlingResources(idlingResource);
```

#### 3.7 确认AndroidTest完成
**测试通过后**：
向用户汇报：
```
✅ AndroidTest测试完成

测试结果：
- 总测试用例数：XX
- 通过：XX
- 失败：0
- 跳过：XX

测试覆盖的功能模块：
- Activity/Fragment测试：已覆盖 ✓
- UI交互测试：已覆盖 ✓
- 设备功能测试：已覆盖 ✓
- 端到端流程：已覆盖 ✓
```

**总结**：
```
测试流程全部完成！

UnitTest：✅ 通过
AndroidTest：✅ 通过

所有功能模块均已测试覆盖，代码质量符合要求。
```

## 配置要求

### build.gradle配置
确保项目的app/build.gradle包含以下配置：

```gradle
android {
    testOptions {
        execution 'ANDROIDX_TEST_ORCHESTRATOR'
        animationsDisabled = true
        unitTests.includeAndroidResources = true
        unitTests.all {
            testLogging {
                events "passed", "skipped", "failed"
                showStandardStreams = true
                exceptionFormat "full"
            }
            reports {
                html.enabled = true
                junitXml.enabled = true
            }
        }
    }
    
    defaultConfig {
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        testInstrumentationRunnerArguments clearPackageData: 'true'
        testInstrumentationRunnerArguments useTestStorageService: 'true'
    }
    
    packagingOptions {
        pickFirst '**/*.class'
        pickFirst 'META-INF/*'
        merge '**/*.class'
        exclude 'META-INF/*.version'
    }
}

dependencies {
    implementation 'androidx.fragment:fragment-testing:1.6.1'
    
    // UnitTest依赖
    testImplementation 'junit:junit:4.13.2'
    testImplementation "org.mockito:mockito-core:4.0.0"
    testImplementation "org.mockito:mockito-inline:4.0.0"
    testImplementation "androidx.test:core:1.6.1"
    testImplementation "org.robolectric:robolectric:4.9"
    
    // AndroidTest依赖
    androidTestImplementation 'androidx.test:runner:1.5.2'
    androidTestImplementation 'androidx.test:rules:1.5.0'
    androidTestImplementation "org.mockito:mockito-android:4.0.0"
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation 'androidx.test.espresso:espresso-contrib:3.5.1'
}
```

## 测试策略说明

### UnitTest vs AndroidTest分工

| 测试类型 | 适用场景 | 运行环境 | 运行速度 | 工具 |
|---------|---------|---------|---------|------|
| **UnitTest** | 业务逻辑、数据处理、算法计算、工具类 | 本地JVM | 快 | JUnit, Mockito, Robolectric |
| **AndroidTest** | UI交互、Activity/Fragment、设备功能、系统集成 | 真实设备/模拟器 | 慢 | JUnit, Espresso, UIAutomator |

### 覆盖原则
1. **优先使用UnitTest**：能用UnitTest就用UnitTest，快速反馈
2. **关键流程使用AndroidTest**：用户核心流程、UI交互使用AndroidTest验证
3. **避免重复测试**：UnitTest已覆盖的逻辑，AndroidTest不需要再测
4. **测试金字塔**：UnitTest占70%，AndroidTest占30%

## 注意事项

### 环境要求
1. **Android SDK**：确保已配置Android SDK
2. **ADB**：确保adb命令可用
3. **设备连接**：AndroidTest需要连接设备或启动模拟器
4. **网络连接**：首次运行需要下载测试依赖

### 代码规范
1. **注释规范**：所有生成的测试代码必须按照AI_AGENT_PATCH规范添加注释
2. **命名规范**：测试类和测试方法名称要清晰表达测试意图
3. **Mock原则**：适当使用Mock，避免过度Mock导致测试脆弱

### 错误处理
1. **不改原代码**：只修改test目录下的代码
2. **根本原因**：分析错误的根本原因，不要只解决表面问题
3. **循环修复**：测试失败后，修改代码并重新测试，直到通过

### 性能优化
1. **并行测试**：在build.gradle中配置并行测试
2. **测试过滤**：可以只运行特定的测试类或方法
3. **缓存清理**：遇到奇怪问题时，可以清理缓存重试

## 使用示例

### 示例1：完整测试流程
用户输入：`对用户登录功能进行测试`

处理流程：
1. 识别项目配置（flavor、applicationId）
2. 生成UnitTest用例（LoginViewModel、LoginRepository等）
3. 执行testxxxSdk5ReleaseUnitTest
4. 处理错误并重测，直到通过
5. 询问用户是否继续AndroidTest
6. 用户确认后，生成AndroidTest用例（LoginActivity测试）
7. 执行assemblexxxSdk5DebugAndroidTest
8. 安装androidTest APK
9. 执行adb shell am instrument命令
10. 处理错误并重测，直到通过
11. 输出测试总结

### 示例2：只执行UnitTest
用户输入：`对工具类进行单元测试`

处理流程：
1. 识别项目配置
2. 生成UnitTest用例
3. 执行测试
4. 处理错误
5. 输出UnitTest结果
6. 询问用户是否继续AndroidTest
7. 用户回答"否"，结束流程

## 常见问题

### Q: 为什么先UnitTest再AndroidTest？
A: UnitTest运行速度快，能快速验证业务逻辑。先确保核心逻辑正确，再进行耗时的AndroidTest。

### Q: 如何确定哪些功能用UnitTest，哪些用AndroidTest？
A: 纯Java/Kotlin逻辑用UnitTest，涉及UI和设备功能的用AndroidTest。参考"测试策略说明"部分。

### Q: 测试失败后如何处理？
A: 分析错误信息，只修改test目录下的代码，不改动业务逻辑，然后重新测试。

### Q: 如何查看测试报告？
A: 测试报告位于`app/build/reports/tests/`目录，可以打开HTML报告查看详细结果。

### Q: AndroidTest需要设备吗？
A: 是的，AndroidTest需要在真实设备或模拟器上运行。确保设备已连接或模拟器已启动。

### Q: 如何跳过某些测试？
A: 使用`@Ignore`注解跳过单个测试，或在gradle命令中指定测试类：
```bash
./gradlew testxxxSdk5ReleaseUnitTest --tests "com.example.SpecificTest"
```
