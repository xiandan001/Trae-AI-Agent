---
name: gerrit-committer
description: 自动化Gerrit代码提交流程，包括生成符合规范的提交信息、执行git操作并推送到Gerrit审查分支。此技能应在用户完成代码修改任务，需要提交代码到Gerrit时使用。
---

# Gerrit Committer

## 🚨 核心格式警告（必须严格遵守）

### ⚠️ 换行规则是核心要求

**Why和How部分每点必须独占一行，点与点之间必须换行分隔！**

**这是提交信息格式的最核心要求，必须严格遵守！**

#### 正确格式 ✅
```
How:
1、在MainPresenter中添加shouldBlockAutoResumeAfterWifiReconnect标志；
2、在MainActivity中封装stopAllProjection方法消除代码重复；
3、创建ProjectionManager单例类统一管理投屏状态；
```

#### 错误格式 ❌
```
How:
1、在MainPresenter中添加shouldBlockAutoResumeAfterWifiReconnect标志；2、在MainActivity中封装stopAllProjection方法消除代码重复；3、创建ProjectionManager单例类统一管理投屏状态；
```

**规则**：
- ✅ 每点必须独占一行
- ✅ 点与点之间必须换行
- ✅ 每个序号（1、2、3）后必须换行
- ❌ 禁止将多个点挤在一行
- ❌ 禁止使用分号连接多个点

---

## Overview

本技能用于自动化Gerrit代码提交流程。当用户完成代码修改任务后，该技能将根据gerrit-commit.md中的规范生成符合Gerrit要求的提交信息，并自动执行git add、git commit和git push操作，将代码推送到Gerrit审查分支。

## 使用时机

在以下情况下使用此技能：

1. 用户完成代码修改任务，明确表示需要提交代码
2. 用户说"提交代码"、"commit"、"push到Gerrit"等关键词
3. 用户已完成开发任务，需要进行代码审查流程

## 工作流程

### 步骤1: 自动生成提交信息到commit-message.txt

Skill会自动按照`references/gerrit-commit.md`中的规范，将生成的提交信息写入`.trae\skills\gerrit-committer\assets\commit-message.txt`文件，无需手动编辑。

生成格式：

```
STORY/BUG-OnesID: [涉及仓库] 简短描述 partn

Ones链接

Why:
(另起一行)问题原因或修改背景

How:
(另起一行)解决方案或修改内容
```

**关键要求：**

- ID前缀：功能需求使用`STORY-`，问题修复使用`BUG-`
- 冒号后必须有一个空格
- 简短描述控制在50个字符以内
- 多个仓库修改时使用`[仓库名1,仓库名2]`格式，单仓库不写此项
- 同一功能多次提交时添加`part2`、`part3`标记
- 标题行后、Ones链接后、Why部分后都必须有空行
- 所有标点必须是英文字符
- Ones链接必须是完整的可点击URL

### ⚠️ Why和How部分格式规则

**每点必须独占一行**，点与点之间必须换行分隔。

**正确格式**：
```
How:
1、修改DevicesFragment.kt中麦克风和摄像头的处理逻辑，在memoryEnabled=false的情况下添加设备存在性检查，确保返回的设备名称在当前设备列表中存在，若不存在则返回"无"；
2、添加点击事件的日志记录，便于后续调试；
```

**错误格式**：
```
How:
1、修改DevicesFragment.kt中麦克风和摄像头的处理逻辑，在memoryEnabled=false的情况下添加设备存在性检查，确保返回的设备名称在当前设备列表中存在，若不存在则返回"无"；2、添加点击事件的日志记录，便于后续调试；
```

**格式要求**：
- ✅ 每点必须独占一行
- ✅ 点与点之间必须换行
- ✅ 每点结尾使用分号`；`
- ✅ 不要将多个点挤在一行
- ❌ 禁止使用分号连接多个点

**Why部分**：
```
Why:
1、由于xxx导致了xxx；
2、由于yyy导致了yyy；
3、由于zzz导致了zzz；
```

**How部分**：
```
How:
1、修改xxx，解决了xxx；
2、修改yyy，解决了yyy；
3、修改zzz，解决了zzz；
```

**重要提示**：
- 每个序号（1、2、3...）后必须是换行
- 不能将多个点用分号或逗号连接
- 每点必须独立成行

### 步骤2: 执行Git操作

**自动生成提交信息到commit-message.txt**

Skill会自动按照`references/gerrit-commit.md`中的规范，将生成的提交信息写入`.trae\skills\gerrit-committer\assets\commit-message.txt`文件，无需手动编辑。

**打开执行目录并执行提交**

请直接打开以下路径，双击 `gerrit-commit.bat` 即可完成提交和推送：

```
项目根目录\.trae\skills\gerrit-committer\assets\
```

### 步骤3: 验证提交

确认以下内容：

1. 代码已成功推送到Gerrit
2. 提交信息格式符合规范
3. Gerrit审查链接已生成

## 提交信息生成示例

**场景1: 修复bug（单仓库）**

```
BUG-225335: HDMI 2和HDMI 3相互切换信源，画面显示安卓

https://ones.lango-tech.com:8000/project/#/team/N1EEt2Js/task/N5QAM6beTJuw1RUR

Why:
因为LiveTv的背景模式为透明主题导致的

How:
修改LiveTv的背景模式为非透明主题
```

**注意**：单仓库提交不添加仓库标记，只有多仓库提交时才添加 `[repo1,repo2]` 格式

**场景2: 新功能开发（多仓库）**

## 质量检查清单

生成提交信息后，自动检查以下项目：

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

### ⚠️ 换行检查（重点）
- [ ] Why部分每点独占一行
- [ ] How部分每点独占一行
- [ ] 点与点之间已换行
- [ ] 序号（1、2、3）后已换行
- [ ] 没有多个点挤在一行

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

### Why和How部分撰写技巧

#### Why部分撰写原则
- 使用"由于xxx导致了xxx"的句式
- 说明问题的根本原因
- 避免描述表面现象
- 每部分建议1-3点
- 每点控制在100字以内

#### How部分撰写原则
- 使用"修改xxx，解决了xxx"的句式
- 突出关键的修改点
- 说明修改达到的效果
- 每部分建议1-3点
- 每点控制在100字以内

## 错误处理和提示

### 常见错误和解决方法

#### ⚠️ 错误0：Why和How部分未换行（严重）

**错误示例**：
```
How:
1、在 CamFunctionsImpl.kt 的 getAllCamera() 方法中添加应用层去重逻辑，使用设备序列号或名称作为唯一标识，通过 HashSet 实现高效的去重查找（时间复杂度 O(n)）；2、修复 CameraFragment.kt 中 closeCamera() 方法的 NullPointerException 异常，移除无效的 null!! 赋值操作；
```

**问题**：多个点挤在一行，没有换行分隔。

**正确示例**：
```
How:
1、在 CamFunctionsImpl.kt 的 getAllCamera() 方法中添加应用层去重逻辑，使用设备序列号或名称作为唯一标识，通过 HashSet 实现高效的去重查找（时间复杂度 O(n)）；
2、修复 CameraFragment.kt 中 closeCamera() 方法的 NullPointerException 异常，移除无效的 null!! 赋值操作；
```

**修正方法**：
- 在每个分号`；`后必须换行
- 每个序号（1、2、3）后必须换行
- 不要将多个点用分号连接在一行

**格式规则**：
- ✅ 每点必须独占一行
- ✅ 点与点之间必须换行
- ✅ 每点结尾使用分号`；`
- ❌ 禁止将多个点挤在一行
- ❌ 禁止使用分号连接多个点

#### 错误1：ones链接格式错误

错误信息：
```
错误：Ones链接格式不正确
当前链接：xxx
正确格式：https://ones.lango-tech.com:xxx/project/#/team/xxx/task/xxx
```

解决方法：
- 检查链接是否完整
- 确保从ones系统复制完整链接

#### 错误2：提交类型推断失败

错误信息：
```
警告：无法从标题自动推断提交类型
请手动指定提交类型（STORY/BUG）
```

解决方法：
- 在输入中明确指定提交类型
- 检查ones标题是否清晰

#### 错误3：仓库信息缺失

错误信息：
```
警告：未提供仓库信息，正在从git状态推断...
推断结果：app
如不正确，请手动指定仓库信息
```

解决方法：
- 在输入中提供仓库信息
- 检查git工作区状态

#### 错误4：Why/How部分过长

错误信息：
```
警告：Why部分超过3点，建议精简
当前点数：5
建议精简至3点以内
```

解决方法：
- 合并相似点
- 突出核心问题和方案

## 常见问题（FAQ）

### Q1：如何判断提交类型是BUG还是STORY？

**A**：
- BUG：修复问题、错误、崩溃、异常等
- STORY：新增功能、优化、重构、改进等
- 如果不确定，可以不指定，系统会根据ones标题自动推断

### Q2：什么时候需要添加仓库标记？

**A**：
- 多个仓库同时修改时添加：`[repo1,repo2]`
- 单个仓库修改时不添加仓库标记
- 仓库名为顶层目录名或通用名称

### Q3：part标记什么时候使用？

**A**：
- 同一个ones任务需要多次提交时使用
- 第一次提交不写part标记
- 后续提交依次使用part2、part3等

### Q4：Why和How部分写多少合适？

**A**：
- 每部分建议1-3点
- Why部分说明问题原因或修改背景
- How部分说明解决方案或修改内容
- 每点控制在100字以内

### Q5：Why和How部分的点必须换行吗？

**A**：
**是的，这是必须遵守的格式要求！**

**格式规则**：
- 每点必须独占一行
- 点与点之间必须换行
- 序号（1、2、3）后必须换行

**正确格式**：
```
How:
1、在 CamFunctionsImpl.kt 的 getAllCamera() 方法中添加应用层去重逻辑，使用设备序列号或名称作为唯一标识，通过 HashSet 实现高效的去重查找（时间复杂度 O(n)）；
2、修复 CameraFragment.kt 中 closeCamera() 方法的 NullPointerException 异常，移除无效的 null!! 赋值操作；
```

**错误格式**：
```
How:
1、在 CamFunctionsImpl.kt 的 getAllCamera() 方法中添加应用层去重逻辑，使用设备序列号或名称作为唯一标识，通过 HashSet 实现高效的去重查找（时间复杂度 O(n)）；2、修复 CameraFragment.kt 中 closeCamera() 方法的 NullPointerException 异常，移除无效的 null!! 赋值操作；
```

**注意**：
- 在每个分号`；`后必须换行
- 不要将多个点用分号连接在一行
- 这是提交信息格式的核心要求

## 更多实用示例

### 常见场景示例集

#### 场景1：UI修复（单仓库）

输入：
```
#652130 【UI】设置界面的按钮点击无响应
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
仓库：app
```

输出：
```
BUG-652130:[UI]设置界面的按钮点击无响应

https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV

Why:
1、由于SettingsFragment中按钮的OnClickListener被错误地设置为null，导致点击事件无法触发；

How:
1、修复SettingsFragment.kt中按钮的初始化逻辑，正确设置OnClickListener；
2、添加点击事件的日志记录，便于后续调试；
```

#### 场景2：新增功能（单仓库）

输入：
```
#652131 【系统】新增蓝牙配对功能
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
仓库：app
```

输出：
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

#### 场景3：性能优化（多仓库）

输入：
```
#652132 【性能】优化系统启动速度
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
仓库：framework, vendor
```

输出：
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

#### 场景4：跨模块修改（多仓库+part标记）

输入：
```
#652133 【架构】重构网络请求模块
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
仓库：app, lib_network, framework
part：2
```

输出：
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

#### 场景5：Bug修复+功能改进（复杂场景）

输入：
```
#652135 【UI】修复设置菜单滚动问题并优化动画效果
https://ones.lango-tech.com:7000/project/#/team/N1EEt2Js/task/Bq3dMrE6RUZCwZhV
仓库：app
修改：修复RecyclerView滚动卡顿问题，优化列表项进入动画
```

输出：
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

---

## 重要注意事项
1. **必须读取参考文档**：在生成提交信息前，务必读取`references/gerrit-commit.md`文件以获取最新的规范
2. **严格遵循格式**：提交信息必须严格按照格式要求，包括空行、标点符号等
3. **动态获取分支**：始终使用`git rev-parse --abbrev-ref HEAD`获取当前分支名称，不要硬编码
4. **Ones链接**：确保Ones链接是完整且可点击的URL
5. **简短描述**：控制在50个字符以内，简洁明了
6. **part标记**：同一仓库同一问题多次提交时添加part标记，第一次提交不写
7. **仓库标记规则**：
   - **单仓库提交**：不添加仓库标记 `[仓库名]`
   - **多仓库提交**：使用 `[repo1,repo2]` 格式
   - **仓库间无空格**：仓库间用英文逗号分隔，不要添加空格

## 资源说明

### assets\gerrit-commit.bat

Windows批处理脚本，用于执行Gerrit提交流程，执行以下操作：
- 读取assets\commit-message.txt文件内容（由skill自动生成）
- 显示提交信息供确认
- 询问用户是否为新提交或修改现有提交
- 使用Git Bash执行git操作
- 自动添加、提交并推送到Gerrit审查分支

使用方式：
1. Skill自动生成提交信息到commit-message.txt
2. 双击执行gerrit-commit.bat
3. 根据提示选择提交类型
4. 确认提交

### assets/commit-message.txt

提交信息文件，由skill自动生成，包含完整的Gerrit提交信息格式：

```
STORY/BUG-OnesID: [涉及仓库] 简短描述 partn

https://ones.lango-tech.com:8000/project/#/team/xxx/task/xxxxx

Why:
问题原因或修改背景

How:
解决方案或修改内容
```

使用方式：skill自动生成提交信息到此文件，无需手动编辑

### scripts/gerrit-commit.sh

自动化Gerrit提交流程的bash脚本，执行以下操作：
- 添加所有更改到暂存区
- 使用提供的提交信息进行提交
- 获取当前分支名称
- 推送到Gerrit审查分支（`refs/for/<branch>`）

使用方式：
```bash
bash scripts/gerrit-commit.sh "<提交信息>"
```

### references/gerrit-commit.md

Gerrit提交信息的详细规范文档，包含：
- 严格格式要求
- 各字段详细规范
- 完整示例
- 重要注意事项

在生成提交信息前必须阅读此文档以确保格式正确。
