---
name: "adb-apk-installer"
description: "管理Android APK的安装和推送操作。当用户需要安装APK到Android设备时使用此skill。"
---

# ADB APK 安装管理器

## 功能概述

这个skill用于管理Android应用的安装和推送操作，支持通过ADB命令将APK文件安装或推送到连接的Android设备。

**重要提示**：
- 所有操作完成后都不会自动执行 `adb reboot` 命令
- 必须先询问用户，只有在用户明确确认后才能执行设备重启
- 推送到系统路径（/system/）的应用必须重启才能生效，但仍需用户确认

## 使用场景

当用户需要：
- 将APK文件安装到Android设备
- 将APK文件推送到设备的特定路径
- 管理多个APK文件的推送路径配置

## 工作流程

**核心原则**：
- ⚠️ **严禁**在安装/推送完成后自动执行 `adb reboot`
- 必须明确询问用户是否需要重启设备
- 只有在用户回复"是"或"Y"等明确确认后，才能执行 `adb reboot` 命令
- 如果用户拒绝或未明确确认，不得执行重启

### 1. 设备检测
- 执行 `adb devices` 命令检测连接的设备
- 根据设备数量进行不同处理：
  - **无设备连接**：提示用户"未检测到任何Android设备，请先连接设备"
  - **多个设备连接**：提示用户"检测到多个设备，请确保只连接一个设备后重试"
  - **单个设备连接**：继续执行后续操作

### 2. 安装方式选择
对于单个设备，按以下优先级执行：

#### 优先方式：Push模式
执行以下命令序列：
```bash
adb root
adb remount
adb push <apk_path> <target_path>
```

**注意事项**：
- 如果 `adb root` 命令失败（设备未获取root权限），自动降级到install模式
- `adb remount` 可能会失败，但不影响push操作
- Push成功后需要询问用户是否执行 `adb reboot` 重启设备

#### 降级方式：Install模式
当push模式不可用时，执行：
```bash
adb install -r -d -t <apk_path>
```

**参数说明**：
- `-r`：替换已存在的应用
- `-d`：允许降级安装
- `-t`：允许安装测试APK
- Install成功后需要询问用户是否执行 `adb shell pm clear <package_name>` 清除应用数据
- Install成功后需要询问用户是否执行 `adb reboot` 重启设备

### 3. 重启设备确认
无论使用哪种安装方式，安装完成后都需要询问用户是否执行 `adb reboot` 命令重启设备

### 4. 清除应用数据确认（仅Install模式）
当使用Install模式安装APK后，需要询问用户是否清除应用数据：
- 先从APK中提取包名（可以使用 `adb shell pm list packages` 或 `adb shell dumpsys package`）
- 显示清除数据的提示信息
- 只有在用户明确确认后才执行 `adb shell pm clear <package_name>`

## 配置管理

### Push路径配置

为了方便管理不同APK的推送路径，需要维护一个路径配置映射。

#### 配置格式
使用JSON格式存储APK路径与目标推送路径的映射关系：

```json
{
  "app1.apk": "/system/priv-app/App1/",
  "app2.apk": "/system/app/App2/",
  "custom-app.apk": "/data/local/tmp/"
}
```

#### 配置文件位置
配置文件存储在项目根目录下的 `.trae/skills/adb-apk-installer/assets/push-paths.json`

#### 配置管理操作

**添加路径映射**：
当用户提供新的APK路径时，检查配置文件：
- 如果APK路径已存在，询问是否更新
- 如果APK路径不存在，添加新条目

**删除路径映射**：
当用户请求删除某个APK的路径映射时：
- 从配置文件中移除对应条目
- 如果配置文件为空，保留空JSON对象 `{}`

**查看路径映射**：
列出当前所有的路径映射配置

### 使用示例

#### 示例1：安装已知APK
用户输入：`安装 /path/to/app.apk`

处理流程：
1. 检查配置文件中是否存在 `/path/to/app.apk` 的路径映射
2. 如果存在，使用配置的目标路径执行push模式
3. 如果不存在，询问用户：
   - 是否要添加路径映射？
   - 如果添加，目标路径是什么？
   - 如果不添加，直接使用install模式

#### 示例2：添加路径映射
用户输入：`添加路径映射 /path/to/app.apk -> /system/priv-app/App1/`

处理流程：
1. 读取现有配置文件
2. 添加新的映射关系
3. 保存配置文件
4. 确认添加成功

#### 示例3：删除路径映射
用户输入：`删除路径映射 /path/to/app.apk`

处理流程：
1. 读取现有配置文件
2. 删除指定APK的路径映射
3. 保存配置文件
4. 确认删除成功

#### 示例4：查看路径映射
用户输入：`查看路径映射`

处理流程：
1. 读取配置文件
2. 格式化输出所有路径映射

## 常见目标路径参考

### 系统应用路径
- `/system/priv-app/` - 系统特权应用（需要root）
- `/system/app/` - 系统应用（需要root）
- `/system_ext/priv-app/` - 系统扩展特权应用
- `/system_ext/app/` - 系统扩展应用

### 用户应用路径
- `/data/app/` - 用户应用（自动）
- `/data/local/tmp/` - 临时文件目录

### 供应商应用路径
- `/vendor/app/` - 供应商应用（需要root）
- `/product/app/` - 产品应用（需要root）

### 路径选择规则
**默认路径选择优先级**（当配置文件中不存在路径映射时）：
1. 优先检查项目根目录是否有 `.trae/skills/adb-apk-installer/assets/default-push-path.json` 配置文件
2. 如果存在项目特定配置，使用项目配置的默认路径
3. 如果不存在项目特定配置，使用 `/system/app/<AppName>/` 作为默认路径（系统应用）
4. 对于特权应用，使用 `/system/priv-app/<AppName>/`

### 项目特定配置
**default-push-path.json 配置格式**：
```json
{
  "XbhAiScreen": {
    "defaultPath": "/system/app/XbhAiScreen/",
    "apkName": "XbhAiScreen.apk"
  }
}
```

**配置说明**：
- `defaultPath`: APK推送的目标目录路径（必须以/结尾）
- `apkName`: APK在设备上的文件名（可自定义）

## 错误处理

### 设备连接错误
- 无设备连接：提示用户检查USB连接和USB调试是否开启
- 多设备连接：提示用户断开其他设备

### ADB命令错误
- `adb root` 失败：自动降级到install模式
- `adb remount` 失败：记录警告，继续执行push
- Push失败：提示具体错误信息，建议使用install模式
- Install失败：提示具体错误信息（如签名冲突、版本问题等）

### 配置文件错误
- 配置文件不存在：创建新的空配置文件
- JSON格式错误：提示用户配置文件格式错误，使用默认配置

## 命令执行顺序

### Push模式完整流程
```bash
# 1. 检查设备连接
adb devices

# 2. 获取root权限（可能失败）
adb root

# 3. 重新挂载系统分区为可写（可能失败）
adb remount

# 4. 推送APK文件到目标路径
adb push <apk_path> <target_path>

# 5. ⚠️ 重要：询问用户是否重启设备
# 询问方式：显示提示信息，等待用户明确确认
# 提示内容：
#   "APK推送成功！是否需要重启设备？(Y/N)"
#   "- 推送到系统路径的应用必须重启才能生效"
# 只有用户回复"Y"或"y"等明确确认后，才执行：
# adb reboot
# 如果用户拒绝或未明确确认，不得执行重启！
```

### Install模式完整流程
```bash
# 1. 检查设备连接
adb devices

# 2. 安装APK
adb install -r -d -t <apk_path>

# 3. ⚠️ 重要：询问用户是否清除应用数据
# 询问方式：显示提示信息，等待用户明确确认
# 提示内容：
#   "APK安装成功！是否需要清除应用数据？(Y/N)"
#   "- 清除数据可以删除应用的所有用户数据、缓存和设置"
#   "- 清除数据后应用将恢复到初始状态"
# 只有用户回复"Y"或"y"等明确确认后，才执行：
# adb shell pm clear <package_name>
# 注意：<package_name> 需要从APK中提取包名，可以使用：
# adb shell pm list packages | grep <app_keyword> 或
# adb shell dumpsys package | grep <app_keyword>

# 4. ⚠️ 重要：询问用户是否重启设备
# 询问方式：显示提示信息，等待用户明确确认
# 提示内容：
#   "APK安装成功！是否需要重启设备？(Y/N)"
#   "- 普通用户应用可以不重启，但建议重启以确保应用完全加载"
# 只有用户回复"Y"或"y"等明确确认后，才执行：
# adb reboot
# 如果用户拒绝或未明确确认，不得执行重启！
```

## 用户交互提示

### 询问目标路径
```
APK文件：/path/to/app.apk

请选择操作：
1. 添加路径映射
2. 直接安装（使用install模式）
3. 取消操作

如果选择1，请输入目标路径：
```

### 路径映射确认
```
添加路径映射：
APK路径：/path/to/app.apk
目标路径：/system/priv-app/App1/

确认添加？(Y/N)
```

### 路径映射更新确认
```
路径映射已存在：
当前目标路径：/system/app/App1/
新的目标路径：/system/priv-app/App1/

是否更新？(Y/N)
```

### 重启设备确认
```
APK安装/推送成功！

是否需要重启设备？
- 推送到系统路径（/system/）的应用必须重启才能生效
- 普通用户应用可以不重启，但建议重启以确保应用完全加载

确认重启设备？(Y/N)

⚠️ 注意：只有当用户明确回复"Y"或"y"时，才执行 `adb reboot` 命令
如果用户回复"N"、"n"或其他非确认内容，不得执行重启！
```

### 清除应用数据确认（仅Install模式）
```
APK安装成功！
包名：com.example.app

是否需要清除应用数据？
- 清除数据可以删除应用的所有用户数据、缓存和设置
- 清除数据后应用将恢复到初始状态
- 如需保留用户数据，请选择"否"

确认清除应用数据？(Y/N)

⚠️ 注意：只有当用户明确回复"Y"或"y"时，才执行 `adb shell pm clear <package_name>` 命令
如果用户回复"N"、"n"或其他非确认内容，不得执行清除数据操作！
```

## 注意事项

1. **⚠️ 重启确认**：严禁自动执行 `adb reboot`！安装/推送完成后必须明确询问用户，只有在用户明确回复"Y"或"y"等确认信息后，才能执行设备重启
2. **⚠️ 清除数据确认**：Install模式下，必须先询问用户是否清除应用数据，只有在用户明确回复"Y"或"y"等确认信息后，才能执行 `adb shell pm clear <package_name>` 命令
3. **Root权限**：Push模式需要设备获取root权限，否则会自动降级到install模式
4. **系统分区**：推送到系统路径（/system/）需要设备解锁并root
5. **签名问题**：Install模式下，如果APK签名与已安装应用不匹配，需要先卸载原应用
6. **数据备份**：安装新版本应用前，建议备份重要数据。如果选择清除应用数据，将无法恢复原有的用户数据

## 扩展功能

### 批量安装
支持一次性安装多个APK文件，按顺序逐个安装。

### 路径模板
支持使用模板变量，如：
- `{apk_name}` - APK文件名
- `{apk_base}` - APK基本名（不带扩展名）
- `{timestamp}` - 时间戳

示例：
```
"/system/priv-app/{apk_base}/"
```
