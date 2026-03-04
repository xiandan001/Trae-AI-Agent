# 日志安全检查清单

## 概述

本文档提供全面的日志安全检查清单，帮助开发者识别和避免日志中的安全隐患，确保日志系统安全合规。

## 敏感信息检查

### 1. 用户隐私信息

#### 检查要点

- [ ] 是否包含用户密码
- [ ] 是否包含用户真实姓名
- [ ] 是否包含身份证号
- [ ] 是否包含手机号码
- [ ] 是否包含邮箱地址
- [ ] 是否包含家庭住址
- [ ] 是否包含银行卡号
- [ ] 是否包含其他个人身份信息

#### 不合规示例

```java
// ❌ 严重：直接记录用户密码
Log.d("Login", "User login: username=" + username + ", password=" + password);

// ❌ 严重：记录完整身份证号
Log.i("User", "User info: idCard=" + idCardNumber);

// ❌ 严重：记录完整手机号
Log.d("Register", "User register: phone=" + phoneNumber);
```

#### 合规示例

```java
// ✅ 正确：敏感信息脱敏
Log.d("Login", "User login: username=" + username + ", password=***");

// ✅ 正确：身份证号脱敏（保留前6位和后4位）
Log.i("User", "User info: idCard=" + maskIdCard(idCardNumber));

// ✅ 正确：手机号脱敏（保留前3位和后4位）
Log.d("Register", "User register: phone=" + maskPhone(phoneNumber));

/**
 * 身份证号脱敏
 */
private String maskIdCard(String idCard) {
    // XBH_AI_PATCH_START
    if (idCard == null || idCard.length() < 10) {
        return "***";
    }
    return idCard.substring(0, 6) + "********" + idCard.substring(idCard.length() - 4);
    // XBH_AI_PATCH_END
}

/**
 * 手机号脱敏
 */
private String maskPhone(String phone) {
    // XBH_AI_PATCH_START
    if (phone == null || phone.length() < 7) {
        return "***";
    }
    return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
    // XBH_AI_PATCH_END
}
```

### 2. 认证授权信息

#### 检查要点

- [ ] 是否包含登录密码
- [ ] 是否包含Token/SessionID
- [ ] 是否包含API密钥
- [ ] 是否包含加密密钥
- [ ] 是否包含签名密钥
- [ ] 是否包含OAuth认证信息

#### 不合规示例

```java
// ❌ 严重：记录Token
Log.d("API", "Request token: " + authToken);

// ❌ 严重：记录API密钥
Log.i("Config", "API key: " + apiKey);

// ❌ 严重：记录加密密钥
Log.d("Security", "Encryption key: " + encryptionKey);
```

#### 合规示例

```java
// ✅ 正确：不记录敏感认证信息
Log.d("API", "Request with authentication");

// ✅ 正确：记录Token的部分信息
Log.d("API", "Request token: " + maskToken(authToken));

/**
 * Token脱敏
 */
private String maskToken(String token) {
    // XBH_AI_PATCH_START
    if (token == null || token.length() < 10) {
        return "***";
    }
    return token.substring(0, 4) + "***" + token.substring(token.length() - 4);
    // XBH_AI_PATCH_END
}
```

### 3. 系统敏感信息

#### 检查要点

- [ ] 是否包含数据库密码
- [ ] 是否包含服务器IP地址
- [ ] 是否包含端口号
- [ ] 是否包含文件路径
- [ ] 是否包含配置信息
- [ ] 是否包含内部接口地址

#### 不合规示例

```java
// ❌ 严重：记录数据库连接信息
Log.d("DB", "Database connection: jdbc:mysql://192.168.1.100:3306/db?user=admin&password=123456");

// ❌ 严重：记录服务器内部地址
Log.i("Network", "Server address: http://192.168.1.100:8080/api");

// ❌ 严重：记录文件系统路径
Log.d("File", "File path: /data/data/com.app/databases/user.db");
```

#### 合规示例

```java
// ✅ 正确：不记录敏感连接信息
Log.d("DB", "Database connection established");

// ✅ 正确：使用域名而非IP
Log.i("Network", "Server address: https://api.example.com");

// ✅ 正确：不记录完整路径
Log.d("File", "File operation: database file accessed");
```

### 4. 业务敏感信息

#### 检查要点

- [ ] 是否包含订单金额
- [ ] 是否包含交易流水号
- [ ] 是否包含支付信息
- [ ] 是否包含优惠券码
- [ ] 是否包含会员等级
- [ ] 是否包含积分余额

#### 不合规示例

```java
// ❌ 警告：记录订单详细信息
Log.d("Order", "Order created: orderId=" + orderId + ", amount=" + amount + ", payment=" + paymentMethod);

// ❌ 警告：记录优惠券码
Log.i("Promotion", "Coupon applied: code=" + couponCode);
```

#### 合规示例

```java
// ✅ 正确：记录订单状态而非详细金额
Log.d("Order", "Order created: orderId=" + orderId + ", status=pending");

// ✅ 正确：记录优惠券使用状态
Log.i("Promotion", "Coupon applied: type=discount, status=valid");
```

## 生产环境安全

### 1. 日志级别控制

#### 检查要点

- [ ] Debug日志是否在生产环境关闭
- [ ] Verbose日志是否在生产环境关闭
- [ ] 是否有动态日志级别控制
- [ ] 是否有日志开关配置

#### 配置示例

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志级别配置类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class LogConfig {
    
    // 生产环境日志级别
    public static final int PROD_LOG_LEVEL = BuildConfig.DEBUG ? 
        Log.VERBOSE : Log.WARN;
    
    /**
     * 检查日志是否应该输出
     */
    public static boolean shouldLog(int level) {
        // XBH_AI_PATCH_START
        return level >= PROD_LOG_LEVEL;
        // XBH_AI_PATCH_END
    }
}

// 使用示例
public void logDebug(String tag, String message) {
    // XBH_AI_PATCH_START
    if (LogConfig.shouldLog(Log.DEBUG)) {
        Log.d(tag, message);
    }
    // XBH_AI_PATCH_END
}
```

### 2. 日志文件权限

#### 检查要点

- [ ] 日志文件是否有权限控制
- [ ] 日志文件是否可被其他应用读取
- [ ] 日志文件是否存储在安全位置
- [ ] 日志文件是否加密存储

#### 安全配置

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志文件安全管理类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class SecureLogFile {
    
    private static final String LOG_DIR = "logs";
    private static final int LOG_FILE_PERMISSION = Context.MODE_PRIVATE;
    
    /**
     * 创建安全的日志文件
     */
    public static File createSecureLogFile(Context context, String fileName) {
        // XBH_AI_PATCH_START
        File logDir = new File(context.getFilesDir(), LOG_DIR);
        if (!logDir.exists()) {
            logDir.mkdirs();
        }
        
        File logFile = new File(logDir, fileName);
        
        // 设置文件权限（仅本应用可读写）
        logFile.setReadable(false, false);
        logFile.setReadable(true, true);
        logFile.setWritable(false, false);
        logFile.setWritable(true, true);
        
        return logFile;
        // XBH_AI_PATCH_END
    }
}
```

### 3. 日志上传安全

#### 检查要点

- [ ] 日志上传是否使用HTTPS
- [ ] 日志上传是否需要认证
- [ ] 日志是否加密后上传
- [ ] 日志上传前是否脱敏

#### 安全上传示例

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志安全上传类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class SecureLogUploader {
    
    /**
     * 安全上传日志
     */
    public static void uploadLogSecurely(Context context, File logFile) {
        // XBH_AI_PATCH_START
        try {
            // 1. 脱敏处理
            String sanitizedLog = sanitizeLogFile(logFile);
            
            // 2. 加密日志
            String encryptedLog = encryptLog(sanitizedLog);
            
            // 3. 使用HTTPS上传
            uploadToServer("https://log-server.example.com/api/upload", 
                encryptedLog, getAuthToken());
            
        } catch (Exception e) {
            Log.e("LogUpload", "Failed to upload log: " + e.getMessage());
        }
        // XBH_AI_PATCH_END
    }
    
    /**
     * 日志脱敏
     */
    private static String sanitizeLogFile(File logFile) throws IOException {
        // XBH_AI_PATCH_START
        StringBuilder content = new StringBuilder();
        BufferedReader reader = new BufferedReader(new FileReader(logFile));
        String line;
        
        while ((line = reader.readLine()) != null) {
            // 移除敏感信息
            line = line.replaceAll("password=\\S+", "password=***");
            line = line.replaceAll("token=\\S+", "token=***");
            line = line.replaceAll("idCard=\\d+", "idCard=***");
            content.append(line).append("\n");
        }
        
        reader.close();
        return content.toString();
        // XBH_AI_PATCH_END
    }
}
```

## 日志注入防护

### 1. 日志内容验证

#### 检查要点

- [ ] 日志内容是否进行长度限制
- [ ] 日志内容是否进行字符过滤
- [ ] 日志内容是否进行格式验证
- [ ] 日志内容是否转义特殊字符

#### 防护示例

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志内容安全验证类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class LogContentValidator {
    
    private static final int MAX_LOG_LENGTH = 4096;
    private static final Pattern DANGEROUS_PATTERN = 
        Pattern.compile("[<>\"'&\\n\\r\\x00-\\x1f]");
    
    /**
     * 验证并清理日志内容
     */
    public static String sanitizeLogContent(String content) {
        // XBH_AI_PATCH_START
        if (content == null) {
            return "null";
        }
        
        // 1. 长度限制
        if (content.length() > MAX_LOG_LENGTH) {
            content = content.substring(0, MAX_LOG_LENGTH) + "...[truncated]";
        }
        
        // 2. 移除危险字符
        content = DANGEROUS_PATTERN.matcher(content).replaceAll("");
        
        // 3. 转义特殊字符
        content = content.replace("<", "&lt;")
                         .replace(">", "&gt;")
                         .replace("\"", "&quot;")
                         .replace("'", "&#39;");
        
        return content;
        // XBH_AI_PATCH_END
    }
}

// 使用示例
public void safeLog(String tag, String message) {
    // XBH_AI_PATCH_START
    String safeMessage = LogContentValidator.sanitizeLogContent(message);
    Log.d(tag, safeMessage);
    // XBH_AI_PATCH_END
}
```

### 2. 日志伪造防护

#### 检查要点

- [ ] 是否防止日志行伪造
- [ ] 是否防止日志注入攻击
- [ ] 是否防止日志文件篡改
- [ ] 是否有日志完整性校验

#### 防护示例

```java
/**
 * label: XBH_AI_PATCH
 * desc: 日志防伪造类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class TamperProofLogger {
    
    private static final String LOG_PREFIX = "[XBH_LOG]";
    private static final String LOG_SIGNATURE = generateSignature();
    
    /**
     * 输出防伪造日志
     */
    public static void logSecure(String level, String tag, String message) {
        // XBH_AI_PATCH_START
        // 1. 移除换行符，防止日志伪造
        message = message.replace("\n", "\\n").replace("\r", "\\r");
        
        // 2. 添加前缀标识
        String secureMessage = String.format("%s[%s][%s] %s",
            LOG_PREFIX, level, tag, message);
        
        // 3. 添加签名（可选）
        String signature = generateLogSignature(secureMessage);
        secureMessage += " [sig:" + signature + "]";
        
        // 4. 输出日志
        Log.println(getLevelValue(level), tag, secureMessage);
        // XBH_AI_PATCH_END
    }
    
    /**
     * 生成日志签名
     */
    private static String generateLogSignature(String message) {
        // XBH_AI_PATCH_START
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update((message + LOG_SIGNATURE).getBytes());
            byte[] digest = md.digest();
            return bytesToHex(digest).substring(0, 8);
        } catch (Exception e) {
            return "error";
        }
        // XBH_AI_PATCH_END
    }
}
```

## 日志访问控制

### 1. 权限检查

#### 检查要点

- [ ] 是否限制日志访问权限
- [ ] 是否有日志查看审计
- [ ] 是否有日志导出限制
- [ ] 是否有日志删除限制

### 2. 敏感操作日志

#### 检查要点

- [ ] 敏感操作是否有专门日志
- [ ] 敏感日志是否加密存储
- [ ] 敏感日志是否有访问控制
- [ ] 敏感日志是否有审计记录

#### 示例实现

```java
/**
 * label: XBH_AI_PATCH
 * desc: 敏感操作日志记录类
 * author: 系统生成
 * time: 2026-03-03 10:00:00
 */
public class SensitiveOperationLogger {
    
    private static final String SENSITIVE_LOG_FILE = "sensitive_ops.log";
    private static final String ENCRYPTION_KEY = "your-encryption-key";
    
    /**
     * 记录敏感操作日志
     */
    public static void logSensitiveOperation(Context context, 
                                            String operation, 
                                            String userId, 
                                            String details) {
        // XBH_AI_PATCH_START
        try {
            // 1. 构建日志内容
            String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS")
                .format(new Date());
            String logEntry = String.format("[%s][%s][%s] %s\n",
                timestamp, userId, operation, details);
            
            // 2. 加密日志内容
            String encryptedLog = encrypt(logEntry, ENCRYPTION_KEY);
            
            // 3. 写入文件（私有模式）
            FileOutputStream fos = context.openFileOutput(
                SENSITIVE_LOG_FILE, Context.MODE_APPEND);
            fos.write(encryptedLog.getBytes());
            fos.write("\n".getBytes());
            fos.close();
            
            // 4. 记录审计信息
            auditLogAccess(context, userId, operation);
            
        } catch (Exception e) {
            Log.e("SensitiveLog", "Failed to log sensitive operation: " + 
                e.getMessage());
        }
        // XBH_AI_PATCH_END
    }
    
    /**
     * 审计日志访问
     */
    private static void auditLogAccess(Context context, String userId, 
                                      String operation) {
        // XBH_AI_PATCH_START
        String auditEntry = String.format("[%s] User %s accessed %s\n",
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()),
            userId, operation);
        
        try {
            FileOutputStream fos = context.openFileOutput(
                "audit.log", Context.MODE_APPEND);
            fos.write(auditEntry.getBytes());
            fos.close();
        } catch (Exception e) {
            // 静默失败
        }
        // XBH_AI_PATCH_END
    }
}
```

## 安全检查工具

### 自动化检查脚本

```python
import re
import sys

class LogSecurityChecker:
    """日志安全检查器"""
    
    # 敏感信息模式
    SENSITIVE_PATTERNS = [
        (r'password\s*=\s*\S+', '密码'),
        (r'token\s*=\s*\S+', 'Token'),
        (r'secret\s*=\s*\S+', '密钥'),
        (r'api[_-]?key\s*=\s*\S+', 'API密钥'),
        (r'\b\d{15,19}\b', '银行卡号'),
        (r'\b\d{17}[\dXx]\b', '身份证号'),
        (r'\b1[3-9]\d{9}\b', '手机号'),
        (r'\b[\w.-]+@[\w.-]+\.\w+\b', '邮箱地址'),
        (r'jdbc:\w+://[^\s]+', '数据库连接'),
        (r'\b(?:\d{1,3}\.){3}\d{1,3}:\d+\b', 'IP地址和端口'),
    ]
    
    def __init__(self):
        self.issues = []
    
    def check_log_line(self, line, line_number):
        """检查单行日志"""
        for pattern, desc in self.SENSITIVE_PATTERNS:
            matches = re.finditer(pattern, line, re.IGNORECASE)
            for match in matches:
                self.issues.append({
                    'line': line_number,
                    'type': desc,
                    'content': match.group(),
                    'context': line.strip()
                })
    
    def check_file(self, file_path):
        """检查日志文件"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line_number, line in enumerate(f, 1):
                    self.check_log_line(line, line_number)
        except Exception as e:
            print(f"Error reading file: {e}")
    
    def generate_report(self):
        """生成检查报告"""
        if not self.issues:
            print("✅ 未发现敏感信息泄露问题")
            return
        
        print(f"❌ 发现 {len(self.issues)} 个敏感信息问题：\n")
        
        for issue in self.issues:
            print(f"行号：{issue['line']}")
            print(f"类型：{issue['type']}")
            print(f"内容：{issue['content']}")
            print(f"上下文：{issue['context']}")
            print("-" * 80)

# 使用示例
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python log_security_check.py <log_file>")
        sys.exit(1)
    
    checker = LogSecurityChecker()
    checker.check_file(sys.argv[1])
    checker.generate_report()
```

## 安全检查清单总结

### 必须检查项（严重）

- [ ] 用户密码是否脱敏
- [ ] Token/SessionID是否脱敏
- [ ] API密钥是否脱敏
- [ ] 身份证号是否脱敏
- [ ] 银行卡号是否脱敏
- [ ] 生产环境是否关闭Debug日志
- [ ] 日志文件是否有权限控制
- [ ] 日志上传是否使用HTTPS

### 应该检查项（警告）

- [ ] 手机号是否脱敏
- [ ] 邮箱地址是否脱敏
- [ ] 服务器IP是否隐藏
- [ ] 数据库连接信息是否隐藏
- [ ] 文件路径是否简化
- [ ] 订单金额是否隐藏
- [ ] 日志内容是否验证
- [ ] 日志长度是否限制

### 建议检查项（建议）

- [ ] 日志是否有完整性校验
- [ ] 日志是否有防伪造机制
- [ ] 敏感日志是否加密存储
- [ ] 日志访问是否有审计
- [ ] 日志是否有定期清理机制
- [ ] 日志是否有备份机制

## 应急响应

### 发现敏感信息泄露后的处理步骤

1. **立即响应**
   - 停止相关日志输出
   - 修改泄露的密钥/密码
   - 通知安全团队

2. **问题修复**
   - 修改代码，移除敏感信息
   - 添加脱敏处理
   - 增加安全检查

3. **影响评估**
   - 分析泄露范围
   - 评估潜在风险
   - 制定缓解措施

4. **预防措施**
   - 更新安全检查流程
   - 加强代码审查
   - 完善监控系统

## 总结

日志安全是应用安全的重要组成部分，必须从以下方面全面保障：

1. **敏感信息保护**：严格控制和脱敏敏感信息
2. **生产环境安全**：合理配置日志级别和权限
3. **注入防护**：防止日志伪造和注入攻击
4. **访问控制**：限制日志访问和操作权限
5. **持续监控**：建立自动化检查和审计机制

通过严格遵循本检查清单，可以有效降低日志安全风险，保护用户隐私和系统安全。
