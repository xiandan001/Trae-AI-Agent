
---
name: "assemble-builder"
description: "自动执行Android Gradle assemble打包任务。当用户需要进行Android应用构建打包时使用此skill，支持动态获取构建变体并选择打包。"
---

# Assemble 构建管理器

## 功能概述

这个skill用于自动执行Android Gradle assemble打包任务，能够动态识别项目的所有构建变体，并支持用户选择具体的变体进行打包。

**重要说明**：
- 本skill严格使用 `./gradlew` 命令执行所有gradle操作
- **不要使用 `gradlew.bat` 命令**
- 无论在Windows、Linux还是Mac系统上，都统一使用 `./gradlew`

## 使用场景

当用户需要：
- 执行Android应用的assemble打包任务
- 查看项目支持的所有构建变体
- 使用优化参数进行快速打包

## 工作流程

### 1. 检测构建变体

当用户未指定具体的打包变体时，执行以下步骤：

#### 方式一：解析build.gradle或apkInfo.gradle文件（推荐，速度快）

直接读取项目的build.gradle或build.gradle.kts或apkInfo.gradle文件，提取以下信息：

**Product Flavors解析**
- 查找 `android { productFlavors { ... } }` 配置块
- 提取所有定义的flavor名称
- 示例配置：
  ```groovy
  android {
      productFlavors {
          xbh {
              dimension "default"
          }
          demo {
              dimension "default"
          }
      }
  }
  ```

**Build Types解析**
- 查找 `android { buildTypes { ... } }` 配置块
- 提取所有定义的build type名称（默认为debug和release）
- 示例配置：
  ```groovy
  android {
      buildTypes {
          debug {
              debuggable true
          }
          release {
              minifyEnabled true
              proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
          }
      }
  }
  ```

**生成构建变体**
- 将flavors和buildTypes进行笛卡尔积组合
- 生成格式：`assemble<Flavor><BuildType>`
- 示例输出：
  ```
  assembleDebug
  assembleRelease
  assembleXbhDebug
  assembleXbhRelease
  assembleDemoDebug
  assembleDemoRelease
  ```

#### 方式二：使用gradle命令（备用方案）

如果解析配置文件失败，可以使用以下命令快速获取assemble任务：

```bash
./gradlew tasks --group build --quiet
```

**注意**：`--group build` 参数只显示build组的任务，比 `--all` 快很多。

#### 解析构建变体
从命令输出中提取所有assemble任务，包括：
- `assembleDebug` - Debug构建
- `assembleRelease` - Release构建
- `assemble<Flavor>Debug` - 特定Flavor的Debug构建
- `assemble<Flavor>Release` - 特定Flavor的Release构建

#### 示例输出
假设项目有以下product flavors：
- `xbh`
- `demo`
- `internal`

则会检测到以下构建变体：
```
assembleDebug
assembleRelease
assembleXbhDebug
assembleXbhRelease
assembleDemoDebug
assembleDemoRelease
assembleInternalDebug
assembleInternalRelease
```

### 2. 用户选择构建变体

将检测到的所有构建变体以清晰的方式呈现给用户，格式如下：

```
检测到以下可用的构建变体：

1. assembleDebug
2. assembleRelease
3. assembleXbhDebug
4. assembleXbhRelease
5. assembleDemoDebug
6. assembleDemoRelease
7. assembleInternalDebug
8. assembleInternalRelease

请输入编号选择要构建的变体：
```

### 3. 执行构建任务

根据用户选择的变体执行打包命令，并添加以下优化参数：

#### 加速参数
- `--parallel` - 并行执行构建任务
- `--configure-on-demand` - 按需配置项目
- `--build-cache` - 启用构建缓存

#### 完整命令示例
```bash
./gradlew assembleXbhDebug --parallel --configure-on-demand --build-cache
```

### 4. 错误处理

当构建命令执行失败时：

#### 错误识别
分析错误输出，识别以下常见错误类型：
- **编译错误** - Java/Kotlin代码编译失败
- **依赖错误** - 依赖库下载失败或版本冲突
- **配置错误** - 构建配置文件错误
- **资源错误** - 资源文件问题
- **签名错误** - Release打包签名配置错误

#### 错误反馈
向用户提供以下信息：
```
构建失败！

失败原因：[具体错误类型]

错误详情：
[从命令输出中提取的关键错误信息]

建议：
[根据错误类型提供相应的解决建议]
```

#### 注意事项
- **不要尝试自动修复错误**
- 仅向用户报告错误原因和相关信息
- 让用户根据错误信息自行决定如何处理

## 直接指定变体

如果用户在请求中明确指定了要构建的变体，例如：
- "打包assembleXbhDebug"
- "执行assembleRelease"
- "构建demo flavor的debug版本"

则跳过变体检测和选择步骤，直接执行相应的构建命令。

## 使用示例

### 示例1：未指定变体
用户输入：`打包应用`

处理流程：
1. 优先解析build.gradle文件获取变体
2. 如果解析失败，执行 `./gradlew tasks --group build --quiet` 获取任务
3. 解析并列出所有assemble变体
4. 等待用户选择
5. 执行用户选择的构建任务，包含优化参数：`./gradlew assembleXbhDebug --parallel --configure-on-demand --build-cache`
6. 返回构建结果或错误信息

**注意**：所有gradle命令都使用 `./gradlew`，不要使用 `gradlew.bat`

### 示例2：指定具体变体
用户输入：`打包assembleXbhDebug`

处理流程：
1. 识别用户指定的变体：`assembleXbhDebug`
2. 直接执行构建命令：`./gradlew assembleXbhDebug --parallel --configure-on-demand --build-cache`
3. 返回构建结果或错误信息

### 示例3：描述性指定
用户输入：`构建xbh flavor的release版本`

处理流程：
1. 识别用户意图：xbh flavor + release构建
2. 确定变体：`assembleXbhRelease`
3. 直接执行构建命令：`./gradlew assembleXbhRelease --parallel --configure-on-demand --build-cache`
4. 返回构建结果或错误信息

## 环境检测

### 操作系统检测
自动检测当前操作系统，统一使用 `./gradlew` 命令

**重要说明**：
- 本skill严格使用 `./gradlew` 命令
- **不要使用 `gradlew.bat` 命令**
- 在Windows系统上也需要使用 `./gradlew` 而不是 `gradlew.bat`

### Gradle Wrapper检测
检查项目根目录是否存在gradle wrapper：
- `./gradlew`

如果wrapper不存在，提示用户：
```
未检测到Gradle Wrapper文件！

请确保以下文件存在于项目根目录：
- gradlew

注意：不要使用 gradlew.bat，本skill只支持 ./gradlew 命令。

您可以使用以下命令生成Gradle Wrapper：
gradle wrapper --gradle-version <version>
```

## 构建输出处理

### 成功构建
构建成功后，提供以下信息：
```
构建成功！

构建变体：[变体名称]
APK输出路径：[APK文件路径]
构建时长：[X分Y秒]
```

### APK文件定位
在构建日志中搜索APK输出路径，通常位于：
- `app/build/outputs/apk/<flavor>/buildType/`
- `build/outputs/apk/<flavor>/buildType/`

## 常见问题

### Q: 为什么只能使用 ./gradlew 而不是 gradlew.bat？
A: 为了保持跨平台的一致性和简化实现，本skill严格使用 `./gradlew` 命令。无论在Windows、Linux还是Mac系统上都统一使用这个命令。

### Q: 为什么使用加速参数？
A: `--parallel`、`--configure-on-demand`和`--build-cache`可以显著提高构建速度，特别是在大型项目中。

### Q: 如何知道项目有哪些flavor？
A: 本skill会自动检测并列出所有可用的构建变体，包括所有flavor的组合。

### Q: 构建失败后怎么办？
A: 查看提供的错误详情和建议，根据具体错误信息进行相应的修复。本skill不会自动修改代码。

### Q: 可以同时构建多个变体吗？
A: 可以，用户可以指定多个变体，例如："构建xbh和demo的debug版本"，skill会依次执行构建。

## 注意事项

1. **Gradle Wrapper** - 确保项目包含 `./gradlew` 文件，**不要使用 `gradlew.bat`**
2. **磁盘空间** - 确保有足够的磁盘空间进行构建
3. **网络连接** - 首次构建需要下载依赖，需要稳定的网络连接
4. **环境配置** - 确保已配置好Android SDK和Java环境
5. **缓存清理** - 如遇到构建缓存问题，可使用 `./gradlew clean` 清理
6. **签名配置** - Release构建需要配置签名信息

## 扩展功能

### 构建配置文件
支持配置文件来管理常用构建选项和默认行为：

**配置文件位置**：`.trae/skills/assemble-builder/assets/config.json`

**配置文件使用说明**：

#### 1. 配置文件状态
- skill首次运行时，会自动创建默认配置文件
- 如果配置文件不存在，skill会自动生成默认配置
- 默认配置采用保守设置，适用于大多数项目

#### 2. 修改配置文件
根据项目需求修改配置文件：

**设置默认构建变体**：
```json
{
  "defaultFlavor": "xbh",
  "defaultBuildType": "Debug"
}
```
设置后，当用户未指定变体时，将自动构建 `assembleXbhDebug`

**添加快速构建别名**：
```json
{
  "buildAliases": {
    "快速打包": "assembleXbhDebug",
    "发布包": "assembleXbhRelease",
    "测试包": "assembleDemoDebug"
  }
}
```
用户可以直接说"快速打包"，系统自动构建对应的变体

**自定义gradle参数**：
```json
{
  "gradleArgs": [
    "--max-workers=4",
    "--gradle-user-home=C:/gradle"
  ]
}
```
每次构建都会附加这些参数

#### 3. 配置文件优先级
配置文件的优先级高于交互式选择：
1. 如果用户明确指定了变体（如"打包assembleXbhDebug"），使用用户指定的
2. 如果用户未指定变体：
   - 优先检查配置文件中的 `defaultFlavor` 和 `defaultBuildType`
   - 如果配置了默认值，直接使用默认值进行构建
   - 如果未配置默认值，列出所有变体供用户选择

#### 4. 配置文件热更新
- 配置文件修改后，下一次构建会自动生效
- 无需重启skill或重新加载
- 配置文件错误时，skill会给出警告并使用默认值

#### 5. 配置文件示例
根据不同场景的配置示例：

**开发环境配置**：
```json
{
  "defaultFlavor": "xbh",
  "defaultBuildType": "Debug",
  "alwaysUseCache": true,
  "alwaysParallel": true,
  "configureOnDemand": true,
  "cleanBeforeBuild": false,
  "buildAliases": {
    "开发包": "assembleXbhDebug",
    "调试包": "assembleXbhDebug"
  }
}
```

**生产环境配置**：
```json
{
  "defaultFlavor": "xbh",
  "defaultBuildType": "Release",
  "alwaysUseCache": true,
  "alwaysParallel": true,
  "configureOnDemand": true,
  "cleanBeforeBuild": true,
  "buildAliases": {
    "发布包": "assembleXbhRelease",
    "正式包": "assembleXbhRelease"
  }
}
```

**CI/CD环境配置**：
```json
{
  "defaultFlavor": "internal",
  "defaultBuildType": "Release",
  "alwaysUseCache": true,
  "alwaysParallel": true,
  "configureOnDemand": true,
  "cleanBeforeBuild": true,
  "gradleArgs": [
    "--max-workers=8",
    "--build-cache"
  ],
  "outputDir": "build/ci-apks"
}
```

**配置字段说明**：

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `defaultFlavor` | string | null | 默认的product flavor名称 |
| `defaultBuildType` | string | Debug | 默认的构建类型（Debug/Release） |
| `alwaysUseCache` | boolean | true | 是否始终使用构建缓存（--build-cache） |
| `alwaysParallel` | boolean | true | 是否始终使用并行构建（--parallel） |
| `configureOnDemand` | boolean | true | 是否按需配置（--configure-on-demand） |
| `buildAliases` | object | {} | 快速构建别名映射 |
| `gradleArgs` | array | [] | 自定义gradle参数 |
| `outputDir` | string | null | APK输出目录覆盖路径 |
| `cleanBeforeBuild` | boolean | false | 构建前是否执行clean |

**完整配置示例**：
```json
{
  "defaultFlavor": "xbh",
  "defaultBuildType": "Debug",
  "alwaysUseCache": true,
  "alwaysParallel": true,
  "configureOnDemand": true,
  "buildAliases": {
    "快速打包": "assembleXbhDebug",
    "发布包": "assembleXbhRelease",
    "测试包": "assembleDemoDebug",
    "正式包": "assembleXbhRelease"
  },
  "gradleArgs": [
    "--max-workers=4",
    "--gradle-user-home=/path/to/gradle"
  ],
  "outputDir": "build/apks",
  "cleanBeforeBuild": false
}
```

**配置文件使用方式**：

1. **默认变体选择**
   - 当用户未指定具体变体时，优先使用配置中的 `defaultFlavor` 和 `defaultBuildType`
   - 如果配置了 `defaultFlavor: "xbh"` 和 `defaultBuildType: "Debug"`，则默认构建 `assembleXbhDebug`
   - 如果未配置默认值，则列出所有变体供用户选择

2. **构建参数控制**
   - `alwaysUseCache`: 控制是否自动添加 `--build-cache` 参数
   - `alwaysParallel`: 控制是否自动添加 `--parallel` 参数
   - `configureOnDemand`: 控制是否自动添加 `--configure-on-demand` 参数
   - 所有参数为false时，只执行基础assemble命令

3. **快速构建别名**
   - 用户可以直接使用别名进行构建，例如："快速打包"
   - 系统自动将别名转换为对应的assemble任务
   - 别名支持中英文混合

4. **自定义gradle参数**
   - 通过 `gradleArgs` 数组添加额外的gradle参数
   - 这些参数会附加到每次构建命令中
   - 示例：`["--max-workers=4", "--gradle-user-home=/path/to/gradle"]`

5. **APK输出目录**
   - `outputDir` 可以覆盖默认的APK输出路径
   - 构建成功后，使用此路径作为APK位置提示
   - 支持相对路径和绝对路径

6. **构建前清理**
   - `cleanBeforeBuild: true` 时，每次构建前自动执行 `./gradlew clean`
   - 适用于需要清理缓存的场景
   - 注意会增加构建时间

**配置文件不存在时的行为**：
- 自动创建默认配置文件
- 使用默认值：`alwaysUseCache: true`, `alwaysParallel: true`, `configureOnDemand: true`
- `buildAliases` 为空对象

**配置验证**：
- 加载配置文件时验证JSON格式
- 验证字段类型是否正确
- 验证buildAliases中的assemble任务是否存在
- 配置错误时使用默认值并给出警告

### 快速构建别名
支持为常用的构建变体创建别名，例如：
- "快速打包" -> `assembleXbhDebug`
- "发布包" -> `assembleXbhRelease`
- "测试包" -> `assembleDemoDebug`
