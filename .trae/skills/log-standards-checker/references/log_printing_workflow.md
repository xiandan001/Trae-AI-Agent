# 日志打印链路

## 概述

本文档详细说明XBH项目中的日志打印调用链路，包括Android原生日志链路和EYWA模块自定义日志链路。

## 日志链路分类

XBH项目中存在两种日志打印链路：

1. **Android原生链路**：中间件与APK直接调用Android原生日志接口
2. **EYWA自定义链路**：EYWA模块调用自定义日志接口XLOGI

## 1. Android原生链路

### 适用范围
- 中间件模块
- APK应用层
- 一般业务逻辑日志

### 调用链路

```
应用代码
  → Log.e/w/i/d/v()
    → Android Logging系统
      → Logcat输出
```

### 使用方法

#### 基本用法

```java
import android.util.Log;

public class ExampleClass {
    private static final String TAG = "ExampleModule";
    
    public void exampleMethod() {
        // XBH_AI_PATCH_START
        // 错误日志
        Log.e(TAG, "Error message with details");
        
        // 警告日志
        Log.w(TAG, "Warning message");
        
        // 信息日志
        Log.i(TAG, "Info message");
        
        // 调试日志
        Log.d(TAG, "Debug message");
        
        // 详细日志
        Log.v(TAG, "Verbose message");
        // XBH_AI_PATCH_END
    }
}
```

#### 带异常的日志

```java
try {
    // 业务代码
} catch (Exception e) {
    // XBH_AI_PATCH_START
    Log.e(TAG, "Error occurred: " + e.getMessage(), e);
    // XBH_AI_PATCH_END
}
```

### 日志级别对应关系

| 方法 | 级别 | 使用场景 |
|------|------|----------|
| Log.e() | Error | 严重错误，功能失败 |
| Log.w() | Warning | 警告信息，潜在问题 |
| Log.i() | Info | 重要信息，业务流程 |
| Log.d() | Debug | 调试信息，开发阶段 |
| Log.v() | Verbose | 详细信息，详细调试 |

### 封装建议

为了统一日志格式，建议对Android原生日志进行封装：

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志工具类，封装Android原生日志接口，统一日志格式
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class XbhLogger {
    
    private static final String TAG = "XbhLogger";
    private static SimpleDateFormat dateFormat = 
        new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    
    /**
     * 输出错误日志
     */
    public static void e(String module, String message) {
        // XBH_AI_PATCH_START
        String formattedMessage = formatLog("E", module, message);
        Log.e(module, formattedMessage);
        // XBH_AI_PATCH_END
    }
    
    /**
     * 输出警告日志
     */
    public static void w(String module, String message) {
        // XBH_AI_PATCH_START
        String formattedMessage = formatLog("W", module, message);
        Log.w(module, formattedMessage);
        // XBH_AI_PATCH_END
    }
    
    /**
     * 输出信息日志
     */
    public static void i(String module, String message) {
        // XBH_AI_PATCH_START
        String formattedMessage = formatLog("I", module, message);
        Log.i(module, formattedMessage);
        // XBH_AI_PATCH_END
    }
    
    /**
     * 输出调试日志
     */
    public static void d(String module, String message) {
        // XBH_AI_PATCH_START
        if (BuildConfig.DEBUG) {
            String formattedMessage = formatLog("D", module, message);
            Log.d(module, formattedMessage);
        }
        // XBH_AI_PATCH_END
    }
    
    /**
     * 输出详细日志
     */
    public static void v(String module, String message) {
        // XBH_AI_PATCH_START
        if (BuildConfig.DEBUG) {
            String formattedMessage = formatLog("V", module, message);
            Log.v(module, formattedMessage);
        }
        // XBH_AI_PATCH_END
    }
    
    /**
     * 格式化日志消息
     */
    private static String formatLog(String level, String module, String message) {
        // XBH_AI_PATCH_START
        String timestamp = dateFormat.format(new Date());
        int pid = android.os.Process.myPid();
        int tid = android.os.Process.myTid();
        String location = getCallerInfo();
        
        return String.format("[%s][%s][%s][%d:%d][%s][%s]",
            timestamp, level, module, pid, tid, location, message);
        // XBH_AI_PATCH_END
    }
    
    /**
     * 获取调用者信息
     */
    private static String getCallerInfo() {
        // XBH_AI_PATCH_START
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        if (stackTrace.length > 5) {
            String fileName = stackTrace[5].getFileName();
            int lineNumber = stackTrace[5].getLineNumber();
            return fileName + ":" + lineNumber;
        }
        return "null:0";
        // XBH_AI_PATCH_END
    }
}
```

## 2. EYWA自定义链路

### 适用范围
- EYWA模块
- 底层系统模块
- 需要特殊处理的日志

### 调用链路

```
EYWA模块代码
  → XLOGI(...)
    → AndroidPrintLog(...)
      → android_printLog(...)
        → android_log_print(...)
          → Logcat输出
```

### XLOGI接口说明

XLOGI是EYWA模块自定义的日志接口，提供了更灵活的日志控制能力。

#### 接口定义

```cpp
// C++层接口定义
#define XLOGI(level, tag, fmt, ...) \
    AndroidPrintLog(level, tag, fmt, ##__VA_ARGS__)

int AndroidPrintLog(int level, const char* tag, const char* fmt, ...);
```

#### 调用流程

1. **EYWA模块调用XLOGI**
   ```cpp
   XLOGI(LOG_LEVEL_INFO, "XbhHi_610", "getNfcEnable s32Ret = %d", s32Ret);
   ```

2. **XLOGI调用AndroidPrintLog**
   ```cpp
   int AndroidPrintLog(int level, const char* tag, const char* fmt, ...) {
       va_list args;
       va_start(args, fmt);
       int result = android_printLog(level, tag, fmt, args);
       va_end(args);
       return result;
   }
   ```

3. **AndroidPrintLog调用android_printLog**
   ```cpp
   int android_printLog(int level, const char* tag, const char* fmt, va_list args) {
       char buffer[4096];
       vsnprintf(buffer, sizeof(buffer), fmt, args);
       return android_log_print(level, tag, "%s", buffer);
   }
   ```

4. **android_printLog调用android_log_print**
   ```cpp
   int android_log_print(int level, const char* tag, const char* fmt, ...) {
       // 调用Android系统日志接口
       __android_log_print(level, tag, fmt, ...);
       return 0;
   }
   ```

### 使用示例

#### C++代码示例

```cpp
// 日志级别定义
#define LOG_LEVEL_VERBOSE  2
#define LOG_LEVEL_DEBUG    3
#define LOG_LEVEL_INFO     4
#define LOG_LEVEL_WARN     5
#define LOG_LEVEL_ERROR    6

// 日志输出示例
void exampleFunction() {
    // XBH_AI_PATCH_START
    int result = performOperation();
    
    if (result == 0) {
        XLOGI(LOG_LEVEL_INFO, "ExampleModule", "Operation succeeded");
    } else {
        XLOGI(LOG_LEVEL_ERROR, "ExampleModule", "Operation failed with error: %d", result);
    }
    // XBH_AI_PATCH_END
}
```

#### 带格式的日志

```cpp
void logWithFormat(const char* sourceName, int sourceId, bool isActive) {
    // XBH_AI_PATCH_START
    XLOGI(LOG_LEVEL_INFO, "SourceManager", 
          "Source: name=%s, id=%d, active=%s", 
          sourceName, sourceId, isActive ? "true" : "false");
    // XBH_AI_PATCH_END
}
```

### 日志级别对应关系

| XLOGI级别 | Android级别 | 说明 |
|----------|------------|------|
| LOG_LEVEL_VERBOSE | ANDROID_LOG_VERBOSE | 详细信息 |
| LOG_LEVEL_DEBUG | ANDROID_LOG_DEBUG | 调试信息 |
| LOG_LEVEL_INFO | ANDROID_LOG_INFO | 一般信息 |
| LOG_LEVEL_WARN | ANDROID_LOG_WARN | 警告信息 |
| LOG_LEVEL_ERROR | ANDROID_LOG_ERROR | 错误信息 |

## 链路选择指南

### 何时使用Android原生链路

✅ **推荐使用场景：**
- Java/Kotlin编写的应用层代码
- 中间件模块
- 一般业务逻辑日志
- 需要与Android系统紧密集成的日志

✅ **优点：**
- 简单直接，无需额外封装
- 性能开销小
- 与Android系统无缝集成
- 易于调试和维护

### 何时使用EYWA自定义链路

✅ **推荐使用场景：**
- EYWA模块
- C/C++编写的底层代码
- 需要特殊日志处理的场景
- 需要跨平台统一的日志接口

✅ **优点：**
- 提供统一的跨平台接口
- 可以添加自定义的日志处理逻辑
- 便于日志过滤和分类
- 支持更灵活的日志格式

## 链路对比

| 特性 | Android原生链路 | EYWA自定义链路 |
|------|----------------|---------------|
| 适用语言 | Java/Kotlin | C/C++ |
| 调用复杂度 | 简单 | 中等 |
| 性能开销 | 低 | 中 |
| 灵活性 | 中 | 高 |
| 维护成本 | 低 | 中 |
| 跨平台能力 | 仅Android | 可跨平台 |

## 常见问题排查

### 1. 日志不显示

**问题：** 调用了日志接口，但Logcat中看不到日志

**可能原因：**
- 日志级别被过滤
- TAG被过滤
- 进程/线程过滤设置不正确
- 日志缓冲区已满

**解决方案：**
```bash
# 检查日志级别过滤
adb logcat *:V

# 检查特定TAG的日志
adb logcat -s XbhLiveTv:V

# 清空日志缓冲区
adb logcat -c
```

### 2. 日志格式不正确

**问题：** 日志输出格式不符合规范

**可能原因：**
- 未使用统一的日志工具类
- 日志格式化代码有误
- 多线程并发问题

**解决方案：**
- 使用统一的日志工具类
- 检查日志格式化代码
- 对日期格式化对象使用ThreadLocal

### 3. 性能问题

**问题：** 大量日志输出影响性能

**可能原因：**
- 在循环中大量打印日志
- 日志级别设置过低
- 日志内容过于冗长

**解决方案：**
- 避免在循环中打印日志
- 合理设置日志级别
- 精简日志内容

### 4. EYWA链路调用失败

**问题：** XLOGI调用失败或崩溃

**可能原因：**
- 参数格式不正确
- 内存访问错误
- 接口版本不匹配

**解决方案：**
- 检查参数格式和类型
- 验证内存访问安全性
- 确认接口版本一致性

## 最佳实践

### 1. 统一使用日志工具类

```java
// ❌ 不推荐：直接使用Log类
Log.d("TAG", "Debug message");

// ✅ 推荐：使用统一的日志工具类
XbhLogger.d("Module", "Debug message");
```

### 2. 条件性日志输出

```java
// 调试日志只在DEBUG模式下输出
if (BuildConfig.DEBUG) {
    XbhLogger.d("Module", "Debug message");
}
```

### 3. 避免字符串拼接

```java
// ❌ 不推荐：字符串拼接会在日志关闭时也执行
Log.d(TAG, "Value: " + expensiveOperation());

// ✅ 推荐：使用条件判断
if (BuildConfig.DEBUG) {
    Log.d(TAG, "Value: " + expensiveOperation());
}
```

### 4. 异常日志包含堆栈信息

```java
try {
    // 业务代码
} catch (Exception e) {
    // 包含完整的异常堆栈信息
    XbhLogger.e("Module", "Error: " + e.getMessage(), e);
}
```

### 5. 敏感信息脱敏

```java
// ❌ 不推荐：直接记录敏感信息
XbhLogger.i("Login", "User login: password=" + password);

// ✅ 推荐：敏感信息脱敏
XbhLogger.i("Login", "User login: password=***");
```

## 日志配置管理

### 日志级别配置

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志配置管理类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class LogConfig {
    
    // 全局日志级别
    public static final int GLOBAL_LOG_LEVEL = BuildConfig.DEBUG ? 
        Log.VERBOSE : Log.WARN;
    
    // 模块级别日志开关
    private static final Map<String, Integer> MODULE_LOG_LEVELS = new HashMap<>();
    
    static {
        // 配置各模块的日志级别
        MODULE_LOG_LEVELS.put("XbhLiveTv", Log.DEBUG);
        MODULE_LOG_LEVELS.put("NFC", Log.INFO);
        MODULE_LOG_LEVELS.put("Source", Log.DEBUG);
    }
    
    /**
     * 检查模块日志是否应该输出
     */
    public static boolean shouldLog(String module, int level) {
        // XBH_AI_PATCH_START
        Integer moduleLevel = MODULE_LOG_LEVELS.get(module);
        int minLevel = (moduleLevel != null) ? moduleLevel : GLOBAL_LOG_LEVEL;
        return level >= minLevel;
        // XBH_AI_PATCH_END
    }
}
```

## 日志性能监控

### 日志性能统计

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志性能监控类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class LogPerformanceMonitor {
    
    private static final String TAG = "LogPerf";
    
    /**
     * 记录方法执行时间
     */
    public static void logMethodCost(String module, String methodName, 
                                     long startTime, Object... args) {
        // XBH_AI_PATCH_START
        long cost = System.currentTimeMillis() - startTime;
        
        StringBuilder argsStr = new StringBuilder();
        for (int i = 0; i < args.length; i++) {
            if (i > 0) argsStr.append(", ");
            argsStr.append("arg").append(i).append("=").append(args[i]);
        }
        
        XbhLogger.w(module, String.format("Method: %s;Args: %s;Cost: %d ms",
            methodName, argsStr.toString(), cost));
        // XBH_AI_PATCH_END
    }
}

// 使用示例
public void exampleMethod(String param1, int param2) {
    long startTime = System.currentTimeMillis();
    
    // 业务代码
    
    LogPerformanceMonitor.logMethodCost("Module", "exampleMethod", 
        startTime, param1, param2);
}
```

## 总结

选择合适的日志链路对于项目的可维护性和性能至关重要：

1. **Android原生链路**：适合大多数应用层和中间件场景，简单高效
2. **EYWA自定义链路**：适合底层模块和特殊需求，灵活可控

在实际开发中，应根据具体场景选择合适的链路，并遵循统一的日志规范，确保日志信息完整、规范、易于维护。
