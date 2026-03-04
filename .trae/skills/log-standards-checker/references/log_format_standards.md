# 日志格式标准

## 概述

本文档详细说明XBH项目的日志格式标准，所有模块写入Logcat的日志必须遵循此统一格式规范。

## 标准日志格式

### 格式定义

```
[日期][日志级别][模块名称][进程ID:线程ID][文件类名:行数][日志内容]
```

### 完整示例

```
[2025-08-11 22:19:43.549][E][XbhLiveTv][4314:2][null:0][getBootSourceIndex: specifiedSourceId=0]
[2025-08-11 22:19:43.550][E][XbhLiveTv][4314:2][null:0][getSrcDet: sourceId=0 isSrcDet=false]
[2025-08-11 22:19:43.554][W][NFC][4294:27][XbhLogger.java:176][Method: BaseNfcByMcuImpl.initLater;Args: arg0=xbh.platform.middleware.XbhPlatformAidlStub@5b904f4;Return: null;Cost: 0 ms]
[2025-08-11 22:19:43.555][W][xbh_mw@XbhHi_610][2614:2614][XbhHi_610.cpp:getNfcEnable:1231][getNfcEnable s32Ret = -1]
[2025-08-11 22:19:43.736][W][Source][4294:68][XbhLogger.java:176][Method: PlatformSourceManagerImpl.getSrcDet;Args: arg0=35;Return: true;Cost: 10 ms]
```

## 字段详细说明

### 1. 日期时间字段

**格式：** `[YYYY-MM-DD HH:mm:ss.SSS]`

**说明：**
- YYYY: 四位年份
- MM: 两位月份（01-12）
- DD: 两位日期（01-31）
- HH: 24小时制的小时（00-23）
- mm: 分钟（00-59）
- ss: 秒（00-59）
- SSS: 毫秒（000-999）

**示例：**
- 正确：`[2025-08-11 22:19:43.549]`
- 错误：`[2025/08/11 22:19:43]`（分隔符错误，缺少毫秒）

**检查要点：**
- [ ] 日期时间是否完整
- [ ] 格式分隔符是否正确（使用 - 和 :）
- [ ] 是否包含毫秒精度
- [ ] 时间是否准确

### 2. 日志级别字段

**格式：** `[级别]`

**有效值：**
- `[E]` - Error（错误）：严重错误，影响功能正常运行
- `[W]` - Warning（警告）：警告信息，潜在问题或不影响主功能
- `[I]` - Info（信息）：重要操作信息，关键业务流程
- `[D]` - Debug（调试）：调试信息，开发阶段的详细信息
- `[V]` - Verbose（详细）：冗余信息，最详细的调试信息

**示例：**
- 正确：`[E]`、`[W]`、`[I]`、`[D]`、`[V]`
- 错误：`[ERROR]`、`[error]`、`[e]`

**级别选择原则：**

| 级别 | 使用场景 | 示例 |
|------|----------|------|
| E | 严重错误，导致功能失败或崩溃 | 文件读取失败、网络请求失败、空指针异常 |
| W | 潜在问题，但不影响主要功能 | 配置缺失使用默认值、API过时警告、性能下降 |
| I | 重要的业务操作和状态变化 | 用户登录、模块初始化、关键配置加载 |
| D | 开发调试所需的详细信息 | 变量值、方法调用、中间状态 |
| V | 最详细的调试和跟踪信息 | 详细执行流程、循环内部状态 |

**检查要点：**
- [ ] 级别是否为有效值（E/W/I/D/V）
- [ ] 级别是否与日志内容匹配
- [ ] 是否有滥用高级别日志的情况

### 3. 模块名称字段

**格式：** `[模块名]`

**说明：**
- 用于标识日志来源的功能模块
- 应使用清晰、统一、简洁的模块名称
- 便于日志过滤和问题定位

**推荐命名规范：**
- 使用大驼峰或全大写命名
- 长度建议在3-15个字符
- 避免使用特殊字符

**示例：**
- 正确：`[XbhLiveTv]`、`[NFC]`、`[Source]`、`[xbh_mw@XbhHi_610]`
- 错误：`[module]`、`[test_module]`、`[a]`（过于简单）

**常见模块名称：**
- `XbhLiveTv` - 直播电视模块
- `NFC` - NFC功能模块
- `Source` - 信号源管理模块
- `xbh_mw@XbhHi_610` - 中间件模块

**检查要点：**
- [ ] 模块名称是否清晰明确
- [ ] 模块名称是否统一
- [ ] 是否便于日志过滤

### 4. 进程线程信息字段

**格式：** `[进程ID:线程ID]`

**说明：**
- 进程ID（PID）：操作系统分配的进程标识
- 线程ID（TID）：进程内的线程标识
- 便于追踪并发问题和多线程错误

**示例：**
- 正确：`[4314:2]`、`[4294:27]`、`[2614:2614]`
- 错误：`[4314]`、`[4314-2]`、`[:2]`

**检查要点：**
- [ ] PID和TID是否都存在
- [ ] 分隔符是否正确（使用 :）
- [ ] ID值是否有效（大于0）

### 5. 代码位置字段

**格式：** `[文件名:行号]`

**说明：**
- 文件名：源代码文件名
- 行号：日志输出代码的行号
- 便于快速定位问题代码

**示例：**
- 正确：`[XbhLogger.java:176]`、`[XbhHi_610.cpp:getNfcEnable:1231]`
- 特殊情况：`[null:0]`（代码位置不可用）

**检查要点：**
- [ ] 文件名是否准确
- [ ] 行号是否有效
- [ ] 是否便于快速定位代码
- [ ] 如果是`[null:0]`，是否可以改进

### 6. 日志内容字段

**格式：** `[日志内容]`

**说明：**
- 包含具体的日志信息
- 应清晰、准确、完整
- 便于问题诊断和审计

**内容要求：**
1. **方法调用日志**
   - 格式：`Method: 方法名;Args: 参数;Return: 返回值;Cost: 耗时`
   - 示例：`[Method: PlatformSourceManagerImpl.getSrcDet;Args: arg0=35;Return: true;Cost: 10 ms]`

2. **状态日志**
   - 格式：`状态描述: 关键信息`
   - 示例：`[getBootSourceIndex: specifiedSourceId=0]`

3. **错误日志**
   - 格式：`错误描述: 错误详情`
   - 示例：`[getNfcEnable s32Ret = -1]`

4. **调试日志**
   - 格式：`变量名=值, 变量名=值`
   - 示例：`[sourceId=0 isSrcDet=false]`

**检查要点：**
- [ ] 内容是否清晰明了
- [ ] 是否包含必要的上下文信息
- [ ] 格式是否规范统一
- [ ] 是否避免冗余信息

## 格式对比示例

### 合规范例

```
[2025-08-11 22:19:43.549][E][XbhLiveTv][4314:2][XbhLogger.java:176][getBootSourceIndex: specifiedSourceId=0]
[2025-08-11 22:19:43.736][W][Source][4294:68][XbhLogger.java:176][Method: PlatformSourceManagerImpl.getSrcDet;Args: arg0=35;Return: true;Cost: 10 ms]
```

### 不合规示例及问题

**示例1：时间格式错误**
```
[2025/08/11 22:19:43][E][XbhLiveTv][4314:2][XbhLogger.java:176][getBootSourceIndex: specifiedSourceId=0]
```
❌ 问题：日期分隔符应为 `-`，时间应精确到毫秒

**示例2：日志级别错误**
```
[2025-08-11 22:19:43.549][ERROR][XbhLiveTv][4314:2][XbhLogger.java:176][getBootSourceIndex: specifiedSourceId=0]
```
❌ 问题：日志级别应为 `[E]` 而非 `[ERROR]`

**示例3：缺少字段**
```
[2025-08-11 22:19:43.549][E][XbhLiveTv][getBootSourceIndex: specifiedSourceId=0]
```
❌ 问题：缺少 `[进程ID:线程ID]` 和 `[文件类名:行数]` 字段

**示例4：字段顺序错误**
```
[E][2025-08-11 22:19:43.549][XbhLiveTv][4314:2][XbhLogger.java:176][getBootSourceIndex: specifiedSourceId=0]
```
❌ 问题：字段顺序不符合规范

## 格式验证正则表达式

可以使用以下正则表达式验证日志格式：

```regex
^\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}\]\[[E|W|I|D|V]\]\[[\w@]+\]\[\d+:\d+\]\[[\w\.]+:\d+|null:0\]\[.+\]$
```

**正则说明：**
- `\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}\]` - 时间戳
- `\[[E|W|I|D|V]\]` - 日志级别
- `\[[\w@]+\]` - 模块名称
- `\[\d+:\d+\]` - 进程线程信息
- `\[[\w\.]+:\d+|null:0\]` - 代码位置
- `\[.+\]` - 日志内容

## 常见格式问题

### 1. 时间格式不统一

**问题：** 不同模块使用不同的时间格式

**解决方案：** 统一使用格式化工具类
```java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
String timestamp = sdf.format(new Date());
```

### 2. 日志级别使用混乱

**问题：** 同类型日志使用不同级别

**解决方案：** 建立日志级别使用规范，团队统一遵守

### 3. 模块名称不规范

**问题：** 模块名称过于简单或含义不清

**解决方案：** 制定模块命名规范，使用有意义的名称

### 4. 代码位置缺失

**问题：** 日志中代码位置显示为 `[null:0]`

**解决方案：** 确保日志工具类正确获取调用栈信息
```java
StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
String fileName = stackTrace[3].getFileName();
int lineNumber = stackTrace[3].getLineNumber();
```

### 5. 日志内容不清晰

**问题：** 日志内容过于简单或缺少上下文

**解决方案：** 在日志中包含足够的诊断信息

## 格式化工具类示例

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志格式化工具类，提供统一的日志格式化方法
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class LogFormatter {
    
    private static final SimpleDateFormat DATE_FORMAT = 
        new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    
    /**
     * 格式化日志输出
     * 
     * @param level 日志级别
     * @param module 模块名称
     * @param content 日志内容
     * @return 格式化后的日志字符串
     */
    public static String format(String level, String module, String content) {
        // XBH_AI_PATCH_START
        String timestamp = DATE_FORMAT.format(new Date());
        int pid = android.os.Process.myPid();
        int tid = android.os.Process.myTid();
        
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        String location = "null:0";
        if (stackTrace.length > 4) {
            String fileName = stackTrace[4].getFileName();
            int lineNumber = stackTrace[4].getLineNumber();
            location = fileName + ":" + lineNumber;
        }
        
        return String.format("[%s][%s][%s][%d:%d][%s][%s]",
            timestamp, level, module, pid, tid, location, content);
        // XBH_AI_PATCH_END
    }
}
```

## 检查清单

使用以下清单验证日志格式：

- [ ] 时间戳格式是否为 `[YYYY-MM-DD HH:mm:ss.SSS]`
- [ ] 日志级别是否为有效值 `[E/W/I/D/V]`
- [ ] 模块名称是否清晰统一
- [ ] 进程线程信息格式是否为 `[PID:TID]`
- [ ] 代码位置格式是否为 `[文件名:行号]`
- [ ] 日志内容是否清晰完整
- [ ] 所有字段是否使用方括号包围
- [ ] 字段顺序是否正确
- [ ] 是否避免特殊字符和编码问题
