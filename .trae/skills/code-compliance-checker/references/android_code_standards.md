# Android 代码规范检查清单

## 1. 命名规范

### 1.1 类命名
- 使用 PascalCase（首字母大写的驼峰命名法）
- 类名应该是名词或名词短语
- Activity 类以 Activity 结尾
- Fragment 类以 Fragment 结尾
- Service 类以 Service 结尾
- Broadcast 类以 Broadcast 或 Receiver 结尾
- Adapter 类以 Adapter 结尾

**示例：**
```java
public class MainActivity extends Activity { }
public class UserListFragment extends Fragment { }
public class NetworkService extends Service { }
public class UserAdapter extends RecyclerView.Adapter { }
```

### 1.2 方法命名
- 使用 camelCase（首字母小写的驼峰命名法）
- 方法名应该是动词或动词短语
- 布尔值返回方法以 is、has、can 等开头

**示例：**
```java
public void getUserInfo() { }
public boolean isNetworkAvailable() { }
public boolean hasPermission() { }
public void loadData() { }
```

### 1.3 变量命名
- 使用 camelCase（首字母小写的驼峰命名法）
- 变量名应该是名词或名词短语
- 常量使用全大写，单词间用下划线分隔
- 私有变量以 m 开头（可选，根据团队规范）

**示例：**
```java
private String mUserName;
private static final int MAX_RETRY_COUNT = 3;
public boolean isSuccess;
```

### 1.4 资源文件命名
- layout 文件使用小写字母和下划线
- drawable 文件使用小写字母和下划线
- values 中的资源使用下划线分隔

**示例：**
```xml
<!-- layout -->
activity_main.xml
fragment_user_list.xml
item_user.xml

<!-- drawable -->
ic_launcher_background.xml
bg_rounded_corner.xml

<!-- values -->
color_primary.xml
string_app_name.xml
```

## 2. 注释规范

### 2.1 类注释
每个类都应该有 Javadoc 注释，说明类的用途。

**示例：**
```java
/**
 * label: XBH_AI_PATCH
 * desc: 用户信息管理类，提供用户数据的获取、更新和删除功能
 * author: 开发者名称
 * time: YYYY-MM-DD HH:mm:ss
 */
public class UserManager {
    // 类内容
}
```

### 2.2 方法注释
复杂的方法应该有 Javadoc 注释，说明方法的功能、参数和返回值。

**示例：**
```java
/**
 * 获取用户信息
 * @param userId 用户ID
 * @return 用户信息对象，如果用户不存在返回 null
 */
public UserInfo getUserInfo(String userId) {
    return null;
}
```

### 2.3 关键代码注释
复杂的逻辑、算法或容易误解的代码需要添加行内注释。

**示例：**
```java
// XBH_AI_PATCH_START
// 检查用户权限，如果没有权限则返回 false
if (!checkPermission()) {
    return false;
}
// XBH_AI_PATCH_END
```

### 2.4 XML 注释
XML 文件中的复杂布局或重要元素需要添加注释。

**示例：**
```xml
<!-- XBH_AI_PATCH_START -->
<!-- XBH_AI_PATCH_MODIFY -->
<!-- 添加用户头像显示，支持圆形裁剪 -->
<ImageView
    android:id="@+id/user_avatar"
    android:layout_width="40dp"
    android:layout_height="40dp"
    android:scaleType="centerCrop"
    app:civ_border_width="2dp" />
<!-- XBH_AI_PATCH_END -->
```

## 3. 代码格式规范

### 3.1 缩进
- 使用 4 个空格缩进
- 不使用 Tab 字符

### 3.2 行宽
- 每行代码不超过 120 个字符
- 超过时需要换行

### 3.3 空格使用
- 运算符前后加空格
- 逗号后面加空格
- 左花括号前加空格
- if、for、while 等关键字后加空格

**示例：**
```java
if (condition) {
    int sum = a + b;
    for (int i = 0; i < count; i++) {
        // 代码
    }
}
```

### 3.4 空行
- 方法之间空一行
- 类内部不同功能块之间空一行
- 逻辑相关的代码块之间可以不空行

## 4. 代码结构规范

### 4.1 类成员顺序
推荐顺序：
1. 常量
2. 静态变量
3. 实例变量
4. 构造方法
5. 生命周期方法（onCreate、onStart 等）
6. 公共方法
7. 私有方法
8. 内部类

**示例：**
```java
public class ExampleActivity extends Activity {
    
    // 常量
    private static final String TAG = "ExampleActivity";
    private static final int REQUEST_CODE = 100;
    
    // 静态变量
    private static int sInstanceCount = 0;
    
    // 实例变量
    private TextView mTitleView;
    private Button mSubmitButton;
    
    // 构造方法
    public ExampleActivity() {
        super();
    }
    
    // 生命周期方法
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_example);
    }
    
    // 公共方法
    public void loadData() {
        // 实现
    }
    
    // 私有方法
    private void initView() {
        // 实现
    }
    
    // 内部类
    private static class InnerHandler extends Handler {
        // 实现
    }
}
```

### 4.2 布局文件结构
推荐顺序：
1. 根布局
2. 工具布局（include、merge）
3. 主要内容布局
4. 次要内容布局
5. 底部按钮或工具栏

## 5. 异常处理规范

### 5.1 捕获异常
- 不要捕获 Exception 或 Throwable，要捕获具体的异常类型
- 捕获异常后要有适当的处理，不能只打印日志

**示例：**
```java
// 正确写法
try {
    // 代码
} catch (IOException e) {
    Log.e(TAG, "文件读取失败", e);
    // 恢复或通知用户
}

// 错误写法
try {
    // 代码
} catch (Exception e) {
    e.printStackTrace();
}
```

### 5.2 finally 使用
- 在 finally 块中释放资源

**示例：**
```java
Cursor cursor = null;
try {
    cursor = getContentResolver().query(uri, null, null, null, null);
    // 使用 cursor
} finally {
    if (cursor != null) {
        cursor.close();
    }
}
```

### 5.3 不要吞掉异常
- 不要捕获异常后什么都不做

**示例：**
```java
// 错误写法
try {
    // 代码
} catch (Exception e) {
    // 什么都不做
}

// 正确写法
try {
    // 代码
} catch (Exception e) {
    Log.e(TAG, "操作失败", e);
    // 处理异常或向上抛出
}
```

## 6. 资源使用规范

### 6.1 资源引用
- 使用资源 ID 而不是硬编码字符串和数字

**示例：**
```java
// 正确写法
textView.setText(R.string.app_name);
textView.setBackgroundColor(getResources().getColor(R.color.primary));

// 错误写法
textView.setText("应用名称");
textView.setBackgroundColor(Color.parseColor("#FF0000"));
```

### 6.2 资源复用
- 复用相同的资源，避免重复定义

### 6.3 多语言支持
- 所有用户可见的字符串都应该放在 strings.xml 中
- 使用 @string 引用

## 7. 线程安全规范

### 7.1 UI 操作在主线程
- 所有 UI 操作必须在主线程执行
- 使用 runOnUiThread 或 Handler 切换到主线程

**示例：**
```java
new Thread(new Runnable() {
    @Override
    public void run() {
        final String result = performHeavyTask();
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                textView.setText(result);
            }
        });
    }
}).start();
```

### 7.2 同步访问
- 多线程访问共享变量时需要同步

**示例：**
```java
private final Object mLock = new Object();
private int mCount = 0;

public void increment() {
    synchronized (mLock) {
        mCount++;
    }
}
```

### 7.3 避免在主线程执行耗时操作
- 网络请求、数据库操作、文件操作等应该在后台线程执行
- 使用 AsyncTask、线程池、RxJava 等异步框架

## 8. 性能优化规范

### 8.1 避免 overdraw
- 移除不必要的背景
- 使用工具检查 overdraw

### 8.2 避免内存抖动
- 避免在循环中创建对象
- 复用对象

**示例：**
```java
// 错误写法
for (int i = 0; i < 1000; i++) {
    String s = new String("test");
}

// 正确写法
String s = "test";
for (int i = 0; i < 1000; i++) {
    // 使用 s
}
```

### 8.3 View 复用
- ListView/RecyclerView 必须使用 ViewHolder 模式
- 避免重复 inflate 布局

### 8.4 Bitmap 优化
- 根据需要加载合适尺寸的 Bitmap
- 使用 inSampleSize 缩放图片
- 使用 RGB_565 格式（如果不需要透明度）

## 9. 安全规范

### 9.1 敏感数据保护
- 不要在日志中打印敏感信息（密码、token 等）
- 使用 SharedPreferences 的 MODE_PRIVATE 模式
- 加密存储敏感数据

### 9.2 权限申请
- 只申请必要的权限
- 在运行时动态申请危险权限
- 解释为什么需要权限

### 9.3 网络安全
- 使用 HTTPS
- 验证证书
- 防止中间人攻击

### 9.4 组件导出
- 除非必要，不要导出组件（android:exported="false"）
- 导出的组件需要权限保护

## 10. 日志使用规范 【严重问题】

**严重程度：严重** - 使用非XbhLog日志组件属于严重问题，必须强制修改。

### 10.1 XbhLog日志组件使用要求【强制】

项目**强制统一使用XbhLog日志组件**，**禁止使用Android原生Log、Timber等其他日志库**。

#### 10.1.1 依赖检查（首次使用时）

首次使用日志时，需检查项目是否已添加XbhLog依赖：

**检查步骤：**
1. 检查Module的build.gradle中是否有以下依赖：
```gradle
dependencies {
    implementation 'com.xbh.ability:log:0.0.8'
}
```
2. 如果未添加，**必须主动添加依赖**

#### 10.1.2 日志使用检查【强制】

**强制要求：**
- **必须使用XbhLog日志组件**
- **禁止使用Android原生Log**（Log.v、Log.d、Log.i、Log.w、Log.e等）
- **禁止使用Timber等其他日志库**
- **禁止使用项目中的LogUtils**（如果有）
- 发现使用非XbhLog日志组件时，**必须主动修改为XbhLog**

**正确示例：**
```java
// XBH_AI_PATCH_START
// 使用XbhLog打印日志
// XBH_AI_PATCH_MODIFY
XbhLog.v(TAG, "Verbose message");           // 详细日志
XbhLog.d("Debug message");                   // 调试日志（使用全局TAG）
XbhLog.i(TAG, "Info message");              // 信息日志
XbhLog.w(TAG, "Warning message");           // 警告日志
XbhLog.e(TAG, "Error message", exception);  // 错误日志（带异常）
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

#### 10.1.3 强制修复要求

当发现日志使用不符合规范时，**必须主动执行以下修改**：

**1. 依赖添加**：如果项目未添加XbhLog依赖，在build.gradle中添加：
```gradle
dependencies {
    implementation 'com.xbh.ability:log:0.0.8'
}
```

**2. 日志替换**：将所有非XbhLog日志调用替换为XbhLog：
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

**3. 日志级别映射表：**

| 原日志调用 | XbhLog替换 |
|-----------|-----------|
| Log.v() | XbhLog.v() |
| Log.d() | XbhLog.d() |
| Log.i() | XbhLog.i() |
| Log.w() | XbhLog.w() |
| Log.e() | XbhLog.e() |
| Timber.v() | XbhLog.v() |
| Timber.d() | XbhLog.d() |
| Timber.i() | XbhLog.i() |
| Timber.w() | XbhLog.w() |
| Timber.e() | XbhLog.e() |
| LogUtils.v() | XbhLog.v() |
| LogUtils.d() | XbhLog.d() |
| LogUtils.i() | XbhLog.i() |
| LogUtils.w() | XbhLog.w() |
| LogUtils.e() | XbhLog.e() |

**4. 添加import语句**：在文件顶部添加XbhLog的import：
```java
import com.xbh.log.XbhLog;
```

### 10.2 日志级别使用规范

| 级别 | 常量 | 值 | 使用场景 |
|------|------|-----|---------|
| VERBOSE | XbhLog.VERBOSE | 2 | 详细的调试信息，通常只在开发阶段使用 |
| DEBUG | XbhLog.DEBUG | 3 | 调试信息，帮助开发者了解程序的运行状态 |
| INFO | XbhLog.INFO | 4 | 一般信息，反映程序的正常运行情况 |
| WARN | XbhLog.WARN | 5 | 潜在问题或非关键错误，提示开发者注意 |
| ERROR | XbhLog.ERROR | 6 | 严重错误，影响程序的正常运行，需要及时处理 |

**级别选择指南：**
- **VERBOSE**：用于详细的调试信息，如方法进入/退出、变量值跟踪等
- **DEBUG**：用于调试信息，如网络请求参数、数据库查询结果等
- **INFO**：用于记录一般信息，如用户操作、业务流程节点等
- **WARN**：用于记录潜在问题，如参数校验失败、降级处理等
- **ERROR**：用于记录严重错误，如异常信息、网络请求失败等

### 10.3 TAG命名规范

- 使用类名作为TAG
- 格式：`private static final String TAG = "ClassName";`

**示例：**
```java
public class UserManager {
    private static final String TAG = "UserManager";
    
    public void loadUser() {
        // XBH_AI_PATCH_START
        // 使用类名作为TAG
        XbhLog.d(TAG, "loadUser: start loading user");
        // XBH_AI_PATCH_END
    }
}
```

### 10.4 敏感信息保护

- 禁止在日志中打印敏感信息
- 敏感信息包括：密码、token、身份证号、银行卡号等

**错误示例：**
```java
// 错误：打印敏感信息
// XbhLog.d(TAG, "User password: " + password);
// XbhLog.d(TAG, "Token: " + token);
// XbhLog.d(TAG, "ID card: " + idCard);
```

**正确示例：**
```java
// XBH_AI_PATCH_START
// 敏感信息脱敏处理
XbhLog.d(TAG, "User login success");
XbhLog.d(TAG, "Token: " + maskToken(token));
// XBH_AI_PATCH_END
```

### 10.5 日志检查清单【严重问题】

**严重程度：严重** - 以下检查项如果不符合规范，必须立即修改。

在代码审查时，需要检查以下内容：

- [ ] **【严重】是否使用了XbhLog日志组件** - 如未使用，必须立即修改
- [ ] **【严重】是否存在使用Android原生Log、Timber等其他日志库的代码** - 如存在，必须立即替换为XbhLog
- [ ] **【严重】首次使用日志时是否检查了依赖** - 如未添加依赖，必须先添加
- [ ] 日志级别是否选择正确
- [ ] TAG命名是否规范
- [ ] 是否存在打印敏感信息的情况

**发现问题后的处理流程：**
1. **立即标记为严重问题**
2. **主动执行修复**（添加依赖、替换日志调用、添加import）
3. **验证修复结果**

## 11. 兼容性规范

### 11.1 最低 API 版本
- 检查使用的 API 是否在最低支持版本中可用
- 使用 @RequiresApi 注解标记需要特定 API 版本的方法

**示例：**
```java
@RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
public void useNewApi() {
    // 使用需要 API 21+ 的代码
}
```

### 11.2 兼容性检查
- 使用 Build.VERSION.SDK_INT 检查系统版本
- 为不同版本提供不同的实现

**示例：**
```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    // 使用 API 23+ 的特性
} else {
    // 兼容旧版本
}
```

### 11.3 主题和样式
- 使用 AppCompat 库兼容旧版本
- 使用 Material Design 组件

## 12. 代码审查检查点

### 12.1 功能正确性
- 代码是否实现了预期功能
- 边界条件是否处理正确
- 异常情况是否处理

### 12.2 代码可读性
- 变量和方法命名是否清晰
- 代码逻辑是否易于理解
- 是否有必要的注释

### 12.3 性能考虑
- 是否有不必要的对象创建
- 是否有内存泄漏风险
- 是否有性能瓶颈

### 12.4 安全性
- 是否有安全漏洞
- 敏感数据是否保护
- 权限使用是否合理

### 12.5 兼容性
- 是否考虑了不同 API 版本的兼容性
- 是否考虑了不同屏幕尺寸的适配
- 是否考虑了不同语言环境

## 13. 工具使用建议

### 13.1 Android Lint
- 运行 Android Lint 检查代码问题
- 修复所有警告和错误

### 13.2 代码格式化
- 使用统一的代码格式化规则
- 配置 EditorConfig 或 Google Java Style

### 13.3 静态代码分析
- 使用 Checkstyle、PMD 等工具
- 配合 CI/CD 流程自动检查
