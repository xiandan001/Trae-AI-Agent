# 开发实现文档.agent.md

## 项目信息
- **项目名称**: [项目名称]
- **文档版本**: v1.0
- **创建日期**: [日期]
- **负责人**: [负责人]

## 1. 实现概述

### 1.1 实现范围
[描述本次实现的功能范围]

### 1.2 技术栈
- **前端**: [技术栈列表]
- **后端**: [技术栈列表]
- **数据库**: [数据库列表]

## 2. 业务逻辑实现

### 2.1 [模块名称]
#### 功能描述
[描述模块功能]

#### 实现要点
- [实现要点1]
- [实现要点2]

#### 代码结构
```
[目录结构]
```

#### 关键代码
```java
// AI_Agent_generate_begin
// 关键业务逻辑实现
// AI_Agent_generate_end
```

### 2.2 [模块名称]
[同上格式]

## 3. 数据处理逻辑

### 3.1 数据采集
[描述数据采集逻辑]

### 3.2 数据处理
[描述数据处理逻辑]

### 3.3 数据存储
[描述数据存储逻辑]

#### 数据处理示例
```java
// AI_Agent_generate_begin
// 数据处理逻辑实现
// AI_Agent_generate_end
```

## 4. 错误处理代码

### 4.1 异常定义
```java
/**
 * label: AI_Agent_generate
 * desc: 自定义业务异常
 * author: xxx
 * time: [日期]
 */
public class BusinessException extends RuntimeException {
    private int code;
    private String message;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
```

### 4.2 异常处理
```java
// AI_Agent_generate_begin
// 异常处理逻辑
// AI_Agent_generate_end
```

## 5. 单元测试编写

### 5.1 测试框架
- [测试框架名称]

### 5.2 测试用例

#### [测试用例名称]
```java
// AI_Agent_generate_begin
// 测试代码
@Test
public void testXXX() {
    // 测试逻辑
}
// AI_Agent_generate_end
```

### 5.3 测试覆盖率
- [测试覆盖率要求]

## 6. 代码注释规范

### 6.1 类注释
```java
/**
 * label: AI_Agent_generate
 * desc: [类描述]
 * author: xxx
 * time: [日期]
 */
public class XXX {
}
```

### 6.2 方法注释
```java
// AI_Agent_generate_begin
/**
 * 方法描述
 * @param param 参数说明
 * @return 返回值说明
 */
public XXX methodName(XXX param) {
    // 方法实现
}
// AI_Agent_generate_end
```

## 7. 模块文档生成

### 7.1 模块说明
[模块功能说明]

### 7.2 接口说明
[模块接口说明]

### 7.3 使用示例
[使用示例代码]

## 8. 开发进度

[提供给AI开发某个任务后更新的进度表]

| 任务 | 状态 | 完成度 |
|------|------|--------|
| [任务1] | 进行中/已完成 | 80% |
| [任务2] | 未开始/进行中/已完成 | 0% |

## 9. 附件
- [相关文档链接]
- [代码仓库名]
