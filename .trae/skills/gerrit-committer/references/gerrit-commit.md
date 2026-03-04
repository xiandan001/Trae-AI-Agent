# Git 提交信息生成规则

## 文档说明

本文档定义了Git提交信息的标准格式规范，所有提交信息必须严格遵循本规范。

---

## 输入内容说明

### 用户输入格式

我会输入ones单的标题和链接，如下：

```
#652126 【UI】外设移除后，OSD设置的麦克风、摄像头一级菜单仍显示历史接入的外设名称
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
```

### 可选输入信息

用户也可以提供以下可选信息：

- **涉及的仓库**：如`app`, `lib_middleware5`等
- **提交类型**：`STORY`或`BUG`
- **修改说明**：具体的修改内容描述
- **part标记**：如`part2`, `part3`等

---

## 输出严格格式要求

### 标准格式模板

```
STORY/BUG-OnesID: [涉及仓库] 简短描述 partn

Ones链接

Why:
XXXXX

How:
XXXXX
```

### 空行要求（强制）

1. **标题行后**：必须空一行
2. **Ones链接后**：必须空一行
3. **Why部分后**：必须空一行

**示例**：
```
BUG-652126:标题

链接

Why:
内容

How:
内容
```

---

## 各字段详细规范

### 1. 标题行（第一行）

格式：`STORY/BUG-OnesID: [涉及仓库] 简短描述 partn`

#### 1.1 ID前缀

- **功能需求**：使用`STORY-`前缀
- **问题修复**：使用`BUG-`前缀
- **示例**：
  - `BUG-652126`：问题修复
  - `STORY-652127`：功能需求

#### 1.2 冒号格式

- 必须使用英文字符`:`
- 冒号后必须有一个空格
- **正确示例**：`BUG-652126: `
- **错误示例**：`BUG-652126：`（使用中文冒号）

#### 1.3 简短描述

- 对应问题单标题，将中文`【】`替换为英文`[]`
- 与输入的ones标题保持一致
- 建议控制在50字符以内（软限制）
- **示例**：
  - 输入：`【UI】外设移除后...`
  - 输出：`[UI]外设移除后...`

#### 1.4 涉及仓库

- **多仓库提交**：使用`[repo1,repo2]`格式
  - 用方括号`[]`包裹
  - 两边各留一个空格
  - 仓库间用英文逗号分隔，**无空格**
  - 仓库名为最顶层目录名或通用名称
- **单仓库提交**：**当前项目名，例如[XbhAiScreen]**

**示例**：
- 多仓库：`BUG-652126: [app,lib_middleware5]标题 `
- 单仓库：`BUG-652126: [XbhAiScreen]标题`

#### 1.5 part标记

- **用途**：同一功能多次提交时使用
- **格式**：`part2`, `part3`等（无空格）
- **位置**：在涉及仓库后直接添加
  - 有仓库：`[repo1,repo2]part2`
  - 无仓库：直接加在描述后（不推荐，最好有仓库标记）
- **规则**：第一次提交不写part标记

**示例**：
- 第一次提交：`BUG-652126: 标题`
- 第二次提交：`BUG-652126: 标题 [app]part2`
- 第三次提交：`BUG-652126: 标题 [app]part3`

---

### 2. Ones链接

#### 2.1 格式要求

- 直接从Ones系统复制完整链接
- 必须是可点击的完整URL
- **必须单独占一行**

#### 2.2 链接示例

```
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
```

#### 2.3 注意事项

- 不要在链接前后添加其他文字
- 不要使用短链接服务
- 确保链接可直接访问

---

### 3. Why部分

#### 3.1 格式要求

- 以`Why:`开头（大写W，英文字符冒号）
- 使用简体中文简要说明问题原因或修改背景
- 不超过3点（硬限制）
- 每点结尾使用英文分号`;`
- **每点必须独占一行，新的点需要换行**

#### 3.2 撰写建议

**句式建议**：
- 使用`由于xxx导致了xxx`的句式
- 说明问题的根本原因
- 避免描述表面现象

**示例**：
```
Why:
1、由于memoryEnabled=false时直接使用getDefaultDigitalMic()获取设备名称，但返回的是历史保存的设备信息，没有检查设备是否仍在当前连接的设备列表中；
```

#### 3.3 内容要求

- 说明问题的根本原因或修改背景
- 每点控制在100字以内
- 逻辑清晰，层次分明
- 使用序号`1、`、`2、`、`3、`编号

---

### 4. How部分

#### 4.1 格式要求

- 以`How:`开头（大写H，英文字符冒号）
- 使用简体中文说明解决方案或修改内容
- 不超过3点（硬限制）
- 每点结尾使用英文分号`;`
- **每点必须独占一行，新的点需要换行**

#### 4.2 撰写建议

**句式建议**：
- 使用`修改xxx，解决了xxx`的句式
- 突出关键的修改点
- 说明修改达到的效果

**示例**：
```
How:
1、修改DevicesFragment.kt中麦克风和摄像头的处理逻辑，在memoryEnabled=false的情况下添加设备存在性检查，确保返回的设备名称在当前设备列表中存在，若不存在则返回"无"；
```

#### 4.3 内容要求

- 说明具体的解决方案或修改内容
- 每点控制在100字以内
- 突出关键修改点
- 使用序号`1、`、`2、`、`3、`编号

---

## 完整输出示例

### 示例1：单仓库BUG提交

```
BUG-652126:[UI]外设移除后，OSD设置的麦克风、摄像头一级菜单仍显示历史接入的外设名称

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于memoryEnabled=false时直接使用getDefaultDigitalMic()和getUsingCameraName()获取设备名称，但这两个方法返回的是历史保存的设备信息，没有检查设备是否仍在当前连接的设备列表中；

How:
1、修改DevicesFragment.kt中麦克风和摄像头的处理逻辑，在memoryEnabled=false的情况下添加设备存在性检查，确保返回的设备名称在当前设备列表中存在，若不存在则返回"无"；
```

### 示例2：多仓库STORY提交

```
STORY-652127:[系统]新增设备热插拔功能 [app,lib_middleware5]

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/AbCdEfGhIjKlMnOpQ

Why:
1、由于现有系统不支持设备热插拔，用户需要在插入设备后重启系统才能识别，影响使用体验；

How:
1、在DeviceManager中新增设备热插拔监听接口，监听USB设备插入/拔出事件；
2、在OSD设置界面添加实时设备状态刷新功能，插入设备后自动更新设备列表；3、优化设备识别逻辑，减少识别延迟至1秒以内；
```

### 示例3：带part标记的提交

```
BUG-652128:[性能]优化视频解码性能 [framework]part2

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/1234567890abcdef

Why:
1、由于视频解码在4K分辨率下存在性能瓶颈，导致播放卡顿和延迟；

How:
1、优化解码器的内存管理，减少不必要的内存拷贝；
2、使用硬件加速解码，提高解码效率；
```

---

## 更多实用示例

### 场景1：UI修复（单仓库）

```
BUG-652130:[UI]设置界面的按钮点击无响应

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于SettingsFragment中按钮的OnClickListener被错误地设置为null，导致点击事件无法触发；

How:
1、修复SettingsFragment.kt中按钮的初始化逻辑，正确设置OnClickListener；
2、添加点击事件的日志记录，便于后续调试；
```

### 场景2：新增功能（单仓库）

```
STORY-652131:[系统]新增蓝牙配对功能

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于用户需求增加蓝牙设备连接功能，以支持无线音频输入；

How:
1、新增BluetoothManager类，封装蓝牙连接管理逻辑；
2、在OSD设置界面添加蓝牙配对UI；
3、实现蓝牙设备扫描、配对、连接的完整流程；
```

### 场景3：性能优化（多仓库）

```
STORY-652132:[性能]优化系统启动速度 [framework,vendor]

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于系统启动时加载了过多的服务和模块，导致启动时间过长（约20秒），影响用户体验；

How:
1、优化framework层的初始化流程，延迟加载非必要服务；
2、优化vendor层的驱动加载顺序，优先加载关键驱动；
3、添加启动性能监控，定位性能瓶颈；
```

### 场景4：跨模块修改（多仓库+part标记）

```
STORY-652133:[架构]重构网络请求模块 [app,lib_network,framework]part2

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于原有网络请求模块代码耦合度高，难以维护和扩展；

How:
1、重构NetworkClient类，使用责任链模式处理请求拦截；
2、新增NetworkConfig类，统一管理网络配置；
3、优化错误处理机制，提供更详细的错误信息；
```

### 场景5：文档更新

```
STORY-652134:[文档]更新API文档

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于新增了多个API接口，需要更新文档以保持同步；

How:
1、更新API.md文档，新增接口说明；
2、添加接口调用示例代码；
3、补充参数说明和返回值说明；
```

### 场景6：Bug修复+功能改进

```
BUG-652135:[UI]修复设置菜单滚动问题并优化动画效果

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于RecyclerView未启用ItemViewCache且使用了复杂的布局计算，导致滚动时频繁创建和销毁视图，造成卡顿；

How:
1、为RecyclerView启用ItemViewCache，缓存常用视图；
2、优化布局层级，减少不必要的嵌套；
3、使用ItemAnimator优化列表项进入动画，提升视觉体验；
```

### 场景7：安全修复

```
BUG-652136:[安全]修复敏感信息泄露问题

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于日志输出中包含了用户的敏感信息（如token、密码），存在信息泄露风险；

How:
1、移除所有日志中的敏感信息输出；
2、在日志工具类中添加敏感信息过滤机制；
3、使用ProGuard混淆，防止反编译获取敏感信息；
```

### 场景8：兼容性修复

```
BUG-652137:[兼容性]修复Android 8.0以下系统崩溃问题

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于使用了Android 8.0引入的新API，在低版本系统上运行时导致崩溃；

How:
1、为新API添加版本判断，只在Android 8.0及以上系统使用；
2、提供低版本系统的兼容实现；
3、添加版本兼容性测试；
```

### 场景9：代码重构

```
STORY-652138:[架构]重构数据持久化模块

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于原有数据持久化模块使用了SharedPreference存储复杂数据，导致数据解析效率低且难以扩展；

How:
1、使用Room数据库替换SharedPreference；
2、重构数据访问层，统一数据接口；
3、添加数据迁移机制，保证用户数据不丢失；
```

### 场景10：国际化支持

```
STORY-652139:[国际化]新增多语言支持

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于产品需要拓展海外市场，需要支持英文、日文等多语言；

How:
1、提取所有硬编码的字符串到资源文件；
2、创建多语言资源文件（values-en、values-ja等）；
3、实现语言切换功能，支持实时切换；
```

---

## 重要注意事项

### 1. 语言规范

- **必须使用简体中文**
- 所有内容使用简体中文
- 标点符号使用英文字符

### 2. 符号规范

- **不要使用任何注释符号**（如`#`）
- 所有标点必须是英文字符
- 冒号、分号、逗号等使用英文符号

### 3. 格式规范

- **严格遵守空行要求**
- 确保各部分之间有正确的空行分隔
- 不要有多余的空行

### 4. 内容规范

- 确保Ones链接可直接点击访问
- 原因和方案描述要简洁明了
- 不要添加无意义的描述

### 5. 仓库标记规范

- **单仓库提交不要写`[仓库名]`**
- 多仓库提交使用`[repo1,repo2]`格式
- 仓库间用英文逗号分隔，无空格

### 6. part标记规范

- 同一仓库多次提交需加part标记
- 第一次提交不写part标记
- part标记无空格，如`part2`、`part3`

### 7. 内容真实性

- **请根据实际的代码修改进行实事求是**
- **禁止臆想杜撰**
- 描述要与实际代码修改保持一致

---

## 常见错误示例

### 错误1：使用中文标点

**错误**：
```
BUG-652126:标题 [app]
链接

Why:
1、由于xxx导致了xxx；
```

**正确**：
```
BUG-652126:标题 [app]

链接

Why:
1、由于xxx导致了xxx;
```

### 错误2：缺少空行

**错误**：
```
BUG-652126:标题 [app]
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
Why:
1、由于xxx;
```

**正确**：
```
BUG-652126:标题 [app]

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于xxx;
```

### 错误3：单仓库添加仓库标记

**错误**：
```
BUG-652126:标题 [app]
```

**正确**：
```
BUG-652126:标题
```

### 错误4：仓库标记格式错误

**错误**：
```
BUG-652126:标题 [app, lib_middleware5]
```

**正确**：
```
BUG-652126:标题 [app,lib_middleware5]
```

### 错误5：Why/How部分超过3点

**错误**：
```
Why:
1、由于xxx;
2、由于yyy;
3、由于zzz;
4、由于aaa;
```

**正确**：
```
Why:
1、由于xxx，导致yyy和zzz;
```

### 错误6：使用注释符号

**错误**：
```
BUG-652126:修复问题#12345
```

**正确**：
```
BUG-652126:修复问题
```

---

## 提交类型判断规则

### BUG类型关键词

以下关键词判定为BUG类型：

- 修复
- 问题
- 错误
- 异常
- 崩溃
- 失败
- 不显示
- 显示错误
- 失效
- 无法
- 报错
- bug、Bug

### STORY类型关键词

以下关键词判定为STORY类型：

- 新增
- 添加
- 实现
- 优化
- 重构
- 改进
- 升级
- 支持
- 功能
- 特性
- 需求

---

## 质量检查清单

生成提交信息后，请检查以下项目：

### 格式检查
- [ ] 标题行格式正确（STORY/BUG-OnesID: 描述 [仓库] part）
- [ ] 冒号后有空格
- [ ] 中文【】已替换为英文[]
- [ ] 多仓库使用[repo1,repo2]格式，无空格
- [ ] 单仓库不写仓库标记
- [ ] part标记格式正确（无空格）

### 空行检查
- [ ] 标题行后有空行
- [ ] Ones链接后有空行
- [ ] Why部分后有空行

### 内容检查
- [ ] Why部分不超过3点
- [ ] How部分不超过3点
- [ ] 所有标点符号为英文字符
- [ ] 不包含注释符号（#）
- [ ] 使用简体中文
- [ ] 描述简洁明了

### 一致性检查
- [ ] 提交类型与ones标题一致
- [ ] 仓库信息与实际修改一致
- [ ] 描述与实际代码修改一致
