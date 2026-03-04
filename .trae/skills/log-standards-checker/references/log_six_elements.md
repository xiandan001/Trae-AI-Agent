# 日志六要素说明

## 概述

根据安全审计要求，日志必须包含六个关键要素，以确保日志信息完整、可追溯、满足合规要求。本文档详细说明日志六要素的定义、要求和检查方法。

## 六要素定义

日志六要素是指：

1. **事件发生的时间**
2. **用户ID**
3. **访问发起端地址或标识**
4. **事件类型**
5. **被访问的资源名称**
6. **事件的结果**

## 要素详细说明

### 1. 事件发生的时间

#### 定义
记录事件发生的精确时间点，是日志最基本的要素，用于时间线追踪和问题定位。

#### 要求
- 必须包含完整的日期和时间
- 时间精度至少到秒，推荐到毫秒
- 使用统一的时区（推荐使用UTC或本地时区）
- 时间格式必须统一规范

#### 标准格式
```
[YYYY-MM-DD HH:mm:ss.SSS]
```

#### 示例
```
[2025-08-11 22:19:43.549]
```

#### 检查要点
- [ ] 时间是否完整（包含年月日时分秒）
- [ ] 是否包含毫秒精度
- [ ] 时间格式是否统一
- [ ] 时间是否准确（无时间偏差）
- [ ] 时区是否明确

#### 常见问题
- ❌ 时间格式不统一：`2025/08/11` vs `2025-08-11`
- ❌ 缺少毫秒精度：`22:19:43` vs `22:19:43.549`
- ❌ 时区不明确：未标注时区信息

---

### 2. 用户ID

#### 定义
标识执行操作的用户的唯一标识符，用于追踪用户行为和审计。

#### 要求
- 必须包含能够唯一标识用户的信息
- 用户ID应进行脱敏处理（保护隐私）
- 对于匿名用户，应使用设备标识或会话标识
- 避免在日志中记录用户密码等敏感信息

#### 推荐格式
```
userId=12345
userId=user_abc123
deviceId=device_12345（匿名用户）
```

#### 示例
```
[2025-08-11 22:19:43.549][I][Login][4294:68][LoginManager.java:245][User login success: userId=12345, loginTime=2025-08-11 22:19:43]
```

#### 脱敏处理示例
```java
// 原始用户ID: user123456
// 脱敏后: user***456
public static String maskUserId(String userId) {
    if (userId == null || userId.length() < 6) {
        return "***";
    }
    return userId.substring(0, 4) + "***" + userId.substring(userId.length() - 3);
}
```

#### 检查要点
- [ ] 是否包含用户标识信息
- [ ] 用户ID是否脱敏处理
- [ ] 是否避免记录密码等敏感信息
- [ ] 匿名用户是否有替代标识
- [ ] 用户ID格式是否统一

#### 常见问题
- ❌ 日志中未包含用户标识
- ❌ 直接记录用户密码或Token
- ❌ 用户ID格式不统一

---

### 3. 访问发起端地址或标识

#### 定义
记录访问来源的标识信息，包括设备标识、网络地址、端口、通信设备等信息。

#### 要求
- 应包含设备标识（设备ID、MAC地址、IMEI等）
- 或包含网络地址（IP地址、端口号）
- 或包含终端类型、端口信息
- 便于追踪访问来源和设备

#### 推荐格式
```
deviceId=abc123
ip=192.168.1.100, port=8080
terminal=Android_TV, mac=00:1A:2B:3C:4D:5E
```

#### 示例
```
[2025-08-11 22:19:43.549][I][Source][4294:68][SourceManager.java:312][Source switch: deviceId=TV_001, sourceId=1, sourceName=HDMI1]
[2025-08-11 22:20:15.123][W][Network][4294:68][NetworkManager.java:156][Network request: ip=192.168.1.100, port=8080, url=/api/config]
```

#### 检查要点
- [ ] 是否包含设备标识或网络地址
- [ ] 标识信息是否完整
- [ ] 是否便于追踪访问来源
- [ ] 格式是否统一规范
- [ ] 是否避免记录过多设备隐私信息

#### 常见问题
- ❌ 日志中缺少访问端标识
- ❌ 标识信息不完整
- ❌ 格式混乱不统一

---

### 4. 事件类型

#### 定义
明确标识日志所记录的事件或操作的类型，便于日志分类、检索和分析。

#### 要求
- 必须明确标识事件类型
- 事件类型分类应清晰合理
- 使用统一的事件类型命名规范
- 便于日志过滤和统计分析

#### 推荐分类

| 事件类型 | 说明 | 示例 |
|---------|------|------|
| USER_LOGIN | 用户登录 | 用户登录成功/失败 |
| USER_LOGOUT | 用户登出 | 用户主动登出 |
| SOURCE_SWITCH | 信号源切换 | HDMI1切换到HDMI2 |
| CHANNEL_CHANGE | 频道切换 | 切换到CCTV-1 |
| CONFIG_UPDATE | 配置更新 | 系统配置修改 |
| NETWORK_REQUEST | 网络请求 | API调用 |
| FILE_OPERATION | 文件操作 | 文件读写 |
| ERROR | 错误事件 | 异常、错误 |
| SECURITY | 安全事件 | 权限验证、安全告警 |

#### 示例
```
[2025-08-11 22:19:43.549][I][Source][4294:68][SourceManager.java:312][Event: SOURCE_SWITCH, from=HDMI1, to=HDMI2, result=success]
[2025-08-11 22:20:15.123][W][Login][4294:68][LoginManager.java:245][Event: USER_LOGIN, userId=12345, result=failed, reason=invalid_password]
```

#### 检查要点
- [ ] 是否明确标识事件类型
- [ ] 事件类型分类是否合理
- [ ] 命名是否统一规范
- [ ] 是否便于日志分类和检索
- [ ] 是否涵盖所有关键操作

#### 常见问题
- ❌ 事件类型不明确
- ❌ 分类混乱不统一
- ❌ 命名不规范

---

### 5. 被访问的资源名称

#### 定义
记录被访问或操作的资源名称，包括功能模块、数据对象、文件、服务等。

#### 要求
- 必须包含被访问的资源信息
- 资源名称应清晰明确
- 对于复杂资源，应包含必要的上下文信息
- 便于资源访问追踪和权限审计

#### 推荐格式
```
resource=PlatformSourceManager
resource=/data/config/settings.json
resource=HDMI1, type=SOURCE
resource=UserDatabase, table=user_info
```

#### 示例
```
[2025-08-11 22:19:43.736][W][Source][4294:68][XbhLogger.java:176][Method: PlatformSourceManagerImpl.getSrcDet;Args: arg0=35;Return: true;Cost: 10 ms]
[2025-08-11 22:20:15.123][I][Config][4294:68][ConfigManager.java:89][Resource: /data/config/settings.json, Operation: READ, Size: 1024 bytes]
[2025-08-11 22:21:30.456][W][Security][4294:68][SecurityManager.java:156][Resource: UserDatabase.userInfo, Operation: UPDATE, userId=12345]
```

#### 检查要点
- [ ] 是否包含资源名称
- [ ] 资源名称是否清晰明确
- [ ] 是否包含必要的资源类型信息
- [ ] 是否便于资源访问追踪
- [ ] 格式是否统一

#### 常见问题
- ❌ 资源名称缺失或不明确
- ❌ 缺少资源类型信息
- ❌ 格式不统一

---

### 6. 事件的结果

#### 定义
记录事件执行的最终结果，包括成功、失败、错误码、返回值等信息。

#### 要求
- 必须明确标识事件执行结果
- 对于失败情况，应包含失败原因或错误码
- 对于成功情况，可包含关键返回值
- 便于问题诊断和成功率统计

#### 推荐格式
```
result=success
result=failed, errorCode=-1, errorMsg=network_timeout
return=true, cost=10ms
status=200, message=OK
```

#### 示例
```
[2025-08-11 22:19:43.736][W][Source][4294:68][XbhLogger.java:176][Method: PlatformSourceManagerImpl.getSrcDet;Args: arg0=35;Return: true;Cost: 10 ms]
[2025-08-11 22:20:15.123][E][Network][4294:68][NetworkManager.java:245][Request: /api/config, Result: failed, ErrorCode: -1, ErrorMsg: Connection timeout]
[2025-08-11 22:21:30.456][I][Login][4294:68][LoginManager.java:156][Event: USER_LOGIN, userId=12345, Result: success, Token: generated]
```

#### 检查要点
- [ ] 是否明确标识执行结果
- [ ] 失败时是否包含错误原因
- [ ] 成功时是否包含关键信息
- [ ] 结果描述是否清晰
- [ ] 是否便于统计和分析

#### 常见问题
- ❌ 执行结果不明确
- ❌ 失败原因缺失
- ❌ 结果描述不清楚

## 六要素完整性检查清单

使用以下清单验证日志是否包含完整的六要素：

### 检查清单模板

```
日志六要素检查清单
==================

日志内容：
[粘贴待检查的日志]

检查项目：
□ 1. 时间：[  ] 包含 [  ] 不包含 [  ] 格式错误
   - 时间值：_______
   - 格式：_______

□ 2. 用户ID：[  ] 包含 [  ] 不包含 [  ] 未脱敏
   - 用户标识：_______
   - 脱敏状态：_______

□ 3. 访问端标识：[  ] 包含 [  ] 不包含 [  ] 不完整
   - 设备标识：_______
   - 网络地址：_______

□ 4. 事件类型：[  ] 包含 [  ] 不包含 [  ] 不明确
   - 事件类型：_______
   - 分类：_______

□ 5. 资源名称：[  ] 包含 [  ] 不包含 [  ] 不明确
   - 资源名称：_______
   - 资源类型：_______

□ 6. 事件结果：[  ] 包含 [  ] 不包含 [  ] 不明确
   - 执行结果：_______
   - 错误信息：_______

完整性评分：_______/6
合规状态：[  ] 合规 [  ] 不合规

问题描述：
1. _______
2. _______
3. _______

改进建议：
1. _______
2. _______
3. _______
```

## 完整示例分析

### 示例1：合规范例

**日志内容：**
```
[2025-08-11 22:19:43.736][I][Source][4294:68][SourceManager.java:312][Event: SOURCE_SWITCH, userId=user***456, deviceId=TV_001, from=HDMI1, to=HDMI2, result=success, cost=15ms]
```

**六要素检查：**

1. ✅ **时间**：`2025-08-11 22:19:43.736` - 完整且精确到毫秒
2. ✅ **用户ID**：`userId=user***456` - 包含且已脱敏
3. ✅ **访问端标识**：`deviceId=TV_001` - 包含设备标识
4. ✅ **事件类型**：`Event: SOURCE_SWITCH` - 明确的事件类型
5. ✅ **资源名称**：`from=HDMI1, to=HDMI2` - 明确的资源信息
6. ✅ **事件结果**：`result=success, cost=15ms` - 明确的结果和性能信息

**评分：** 6/6 ✅

**结论：** 日志包含完整的六要素，格式规范，符合审计要求。

---

### 示例2：部分合规

**日志内容：**
```
[2025-08-11 22:19:43.549][E][XbhLiveTv][4314:2][null:0][getBootSourceIndex: specifiedSourceId=0]
```

**六要素检查：**

1. ✅ **时间**：`2025-08-11 22:19:43.549` - 完整且精确到毫秒
2. ❌ **用户ID**：未包含用户标识信息
3. ❌ **访问端标识**：未包含设备或网络标识
4. ⚠️ **事件类型**：`getBootSourceIndex` - 方法名可推断事件类型，但不明确
5. ✅ **资源名称**：`specifiedSourceId=0` - 包含资源信息
6. ⚠️ **事件结果**：未明确标识执行结果

**评分：** 2.5/6 ⚠️

**问题：**
- 缺少用户ID
- 缺少访问端标识
- 事件类型不够明确
- 缺少执行结果

**改进建议：**
```
[2025-08-11 22:19:43.549][I][XbhLiveTv][4314:2][XbhLogger.java:176][Event: BOOT_SOURCE_INDEX, userId=device_001, deviceId=TV_001, sourceId=0, result=success]
```

---

### 示例3：不合规

**日志内容：**
```
Source switch completed
```

**六要素检查：**

1. ❌ **时间**：未包含
2. ❌ **用户ID**：未包含
3. ❌ **访问端标识**：未包含
4. ⚠️ **事件类型**：可推断为信号源切换，但不规范
5. ⚠️ **资源名称**：未明确
6. ⚠️ **事件结果**：可推断为成功，但不明确

**评分：** 0/6 ❌

**结论：** 日志严重不符合规范，缺少大部分必要信息。

**改进建议：**
```
[2025-08-11 22:19:43.736][I][Source][4294:68][SourceManager.java:312][Event: SOURCE_SWITCH, userId=device_001, deviceId=TV_001, from=HDMI1, to=HDMI2, result=success, cost=15ms]
```

## 六要素实现最佳实践

### 1. 统一日志工具类

```java
/**
 * label: XBH_AI_PATCH
 * desc: 审计日志工具类，确保日志包含完整的六要素
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class AuditLogger {
    
    /**
     * 记录审计日志（包含六要素）
     * 
     * @param module 模块名称
     * @param eventType 事件类型
     * @param userId 用户ID（已脱敏）
     * @param deviceId 设备ID
     * @param resource 资源名称
     * @param result 执行结果
     * @param extraInfo 额外信息
     */
    public static void logAudit(String module, String eventType, String userId, 
                                String deviceId, String resource, String result, 
                                String extraInfo) {
        // XBH_AI_PATCH_START
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String timestamp = sdf.format(new Date());
        
        String logContent = String.format(
            "Event: %s, userId=%s, deviceId=%s, resource=%s, result=%s, %s",
            eventType, userId, deviceId, resource, result, extraInfo
        );
        
        String logMessage = String.format("[%s][I][%s][%d:%d][%s][%s]",
            timestamp,
            module,
            android.os.Process.myPid(),
            android.os.Process.myTid(),
            getCallerInfo(),
            logContent
        );
        
        Log.i(module, logMessage);
        // XBH_AI_PATCH_END
    }
    
    private static String getCallerInfo() {
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        if (stackTrace.length > 4) {
            return stackTrace[4].getFileName() + ":" + stackTrace[4].getLineNumber();
        }
        return "null:0";
    }
}
```

### 2. 使用示例

```java
// 信号源切换日志
AuditLogger.logAudit(
    "Source",                          // 模块名称
    "SOURCE_SWITCH",                   // 事件类型
    maskUserId("user123456"),          // 用户ID（已脱敏）
    "TV_001",                          // 设备ID
    "HDMI1->HDMI2",                    // 资源名称
    "success",                         // 执行结果
    "cost=15ms"                        // 额外信息
);

// 用户登录日志
AuditLogger.logAudit(
    "Login",                           // 模块名称
    "USER_LOGIN",                      // 事件类型
    maskUserId("user123456"),          // 用户ID（已脱敏）
    "TV_001",                          // 设备ID
    "LoginSystem",                     // 资源名称
    "success",                         // 执行结果
    "loginMethod=password"             // 额外信息
);
```

## 特殊场景处理

### 1. 匿名用户场景

对于未登录用户或匿名用户，使用设备标识作为用户ID：

```java
String userId = isAuthenticated() ? maskUserId(realUserId) : "device_" + getDeviceId();
```

### 2. 批量操作场景

对于批量操作，记录操作数量和汇总结果：

```java
AuditLogger.logAudit(
    "FileOperation",
    "BATCH_DELETE",
    maskUserId(userId),
    deviceId,
    "MultipleFiles",
    "partial_success",
    "total=100, success=95, failed=5"
);
```

### 3. 异步操作场景

对于异步操作，记录请求ID便于追踪：

```java
String requestId = UUID.randomUUID().toString();
AuditLogger.logAudit(
    "Network",
    "ASYNC_REQUEST",
    maskUserId(userId),
    deviceId,
    "/api/config",
    "pending",
    "requestId=" + requestId
);
```

## 检查工具

可以使用以下脚本自动检查日志六要素完整性：

```python
import re
from datetime import datetime

def check_log_six_elements(log_line):
    """
    检查日志是否包含完整的六要素
    返回：(完整性评分, 检查结果详情)
    """
    score = 0
    details = []
    
    # 1. 检查时间
    time_pattern = r'\[(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3})\]'
    time_match = re.search(time_pattern, log_line)
    if time_match:
        score += 1
        details.append(f"✅ 时间: {time_match.group(1)}")
    else:
        details.append("❌ 时间: 未找到")
    
    # 2. 检查用户ID
    if re.search(r'userId=\S+', log_line):
        score += 1
        details.append("✅ 用户ID: 已包含")
    else:
        details.append("❌ 用户ID: 未包含")
    
    # 3. 检查访问端标识
    if re.search(r'(deviceId|ip|terminal)=\S+', log_line):
        score += 1
        details.append("✅ 访问端标识: 已包含")
    else:
        details.append("❌ 访问端标识: 未包含")
    
    # 4. 检查事件类型
    if re.search(r'Event:\s*\w+', log_line):
        score += 1
        details.append("✅ 事件类型: 已包含")
    else:
        details.append("❌ 事件类型: 未明确")
    
    # 5. 检查资源名称
    if re.search(r'resource=\S+|from=\S+|to=\S+', log_line):
        score += 1
        details.append("✅ 资源名称: 已包含")
    else:
        details.append("❌ 资源名称: 未包含")
    
    # 6. 检查事件结果
    if re.search(r'result=\S+|Return:\s*\S+', log_line):
        score += 1
        details.append("✅ 事件结果: 已包含")
    else:
        details.append("❌ 事件结果: 未明确")
    
    return score, details

# 使用示例
log = "[2025-08-11 22:19:43.736][I][Source][4294:68][SourceManager.java:312][Event: SOURCE_SWITCH, userId=user***456, deviceId=TV_001, from=HDMI1, to=HDMI2, result=success, cost=15ms]"
score, details = check_log_six_elements(log)
print(f"完整性评分: {score}/6")
for detail in details:
    print(detail)
```

## 总结

日志六要素是安全审计的基本要求，确保日志信息的完整性、可追溯性和合规性。在实际开发中，应：

1. 使用统一的日志工具类，自动包含六要素
2. 对敏感信息进行脱敏处理
3. 定期检查日志完整性
4. 建立日志审计机制
5. 持续优化日志质量

通过严格遵循六要素规范，可以确保日志满足安全审计要求，便于问题追踪和系统监控。
