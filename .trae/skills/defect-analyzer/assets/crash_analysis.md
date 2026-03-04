# Crash（崩溃）通用处理流程 - EDLA环境

## 1. Crash类型识别

### 1.1 常见Crash类型
- **NullPointerException**：空指针异常
- **ClassNotFoundException**：类未找到异常
- **ArrayIndexOutOfBoundsException**：数组越界异常
- **SecurityException**：安全异常
- **OutOfMemoryError**：内存溢出错误
- **IllegalStateException**：非法状态异常
- **IllegalArgumentException**：非法参数异常
- **ActivityNotFoundException**：Activity未找到异常
- **SQLiteException**：数据库异常
- **NetworkOnMainThreadException**：主线程网络异常

### 1.2 Crash分类
- **运行时异常**：程序运行时发生的异常
- **编译时异常**：代码编译时就能发现的异常
- **系统异常**：Android系统级别的异常
- **第三方库异常**：第三方库引发的异常

## 2. 日志收集

### 2.1 必需日志
1. **崩溃堆栈信息**：logcat中的崩溃堆栈
2. **应用日志**：应用崩溃前的日志输出
3. **设备信息**：设备型号、系统版本、应用版本

### 2.2 可选日志
1. **内存dump**：内存快照
2. **性能数据**：CPU、内存、网络使用情况
3. **用户行为日志**：崩溃前的用户操作轨迹

### 2.4 日志获取方法
```bash
# 获取应用日志
adb logcat -c  # 清除日志
adb logcat -v time > app_log.txt

# 过滤特定包名的日志
adb logcat | grep com.example.app

# 获取崩溃信息
adb logcat AndroidRuntime:E *:S > crash_log.txt

# 获取权限检查日志
adb logcat | grep -i permission > permission_log.txt

# 获取定时任务日志
adb logcat | grep -i schedule > schedule_log.txt
```

## 3. 分析步骤

### 3.1 堆栈信息分析
1. **定位崩溃位置**：找到堆栈顶部的异常位置
2. **识别异常类型**：确定具体的异常类型
3. **追踪调用链**：分析完整的调用链路

### 3.2 常见异常分析

#### 3.2.1 NullPointerException
1. **定位空对象**：找到哪个对象为null
2. **分析原因**：
   - 对象未初始化
   - 方法返回null
   - 数据库查询结果为null
   - Intent extras缺失
3. **解决方法**：
   - 添加null检查
   - 使用@NonNull注解
   - 提供默认值

#### 3.2.2 ArrayIndexOutOfBoundsException
1. **定位越界位置**：找到数组访问位置
2. **分析原因**：
   - 索引计算错误
   - 数组长度判断错误
   - 循环条件错误
   - 应用列表数组越界
3. **解决方法**：
   - 添加边界检查
   - 使用size()方法
   - 优化循环条件
   - 处理应用列表动态变化

#### 3.2.3 ClassNotFoundException
1. **定位缺失类**：找到哪个类未找到
2. **分析原因**：
   - 类不存在
   - 依赖库未添加
   - ProGuard混淆问题
   - 多dex加载问题
   - EDLA相关类未找到
3. **解决方法**：
   - 检查依赖
   - 添加keep规则
   - 配置multiDex
   - 检查EDLA API版本兼容性

#### 3.2.4 OutOfMemoryError
1. **分析内存使用**：查看内存分配情况
2. **分析原因**：
   - 内存泄漏
   - 大对象加载
   - 图片加载过大
   - 集合对象过大
   - 应用列表信息过多
3. **解决方法**：
   - 使用内存分析工具
   - 优化图片加载
   - 及时释放对象
   - 增加堆内存
   - 优化应用列表缓存

#### 3.2.5 SecurityException
1. **定位安全异常**：找到哪个操作触发了安全异常
2. **分析原因**：
   - 权限不足
   - 权限未授予
   - 策略限制
3. **解决方法**：
   - 添加权限检查
   - 处理权限被拒绝的情况

#### 3.2.6 IllegalStateException
1. **定位状态异常**：找到哪个操作触发了状态异常
2. **分析原因**：
   - 应用限制状态不正确
   - 定时任务状态不正确
3. **解决方法**：
   - 添加状态检查
   - 处理状态转换异常

### 3.3 上下文分析
1. **崩溃时机**：崩溃发生在哪个页面、哪个操作
2. **复现概率**：是否稳定复现
3. **设备差异**：是否只在特定设备上出现
4. **版本差异**：是否只在特定版本上出现
5. **EDLA场景分析**：
   - 是否在应用切换时崩溃
   - 是否在定时任务执行时崩溃

## 4. 解决方案

### 4.1 异常处理最佳实践
1. **全局异常处理**：实现Thread.UncaughtExceptionHandler
2. **异常捕获**：在关键位置添加try-catch
3. **防御性编程**：进行参数检查和边界检查
4. **优雅降级**：提供备用方案而非崩溃

### 4.2 EDLA特有Crash解决

#### 4.2.1 应用限制异常
1. **限制检查**：
   - 检查应用是否被限制
   - 检查应用启动限制状态
   - 检查应用是否在白名单中

2. **异常处理**：
   ```java
   try {
       PackageManager pm = context.getPackageManager();
       ApplicationInfo appInfo = pm.getApplicationInfo(packageName, 0);
   } catch (PackageManager.NameNotFoundException e) {
       Log.e(TAG, "应用未找到", e);
       // 处理应用未找到的情况
   }
   ```

#### 4.2.2 定时任务异常
1. **任务检查**：
   - 检查任务是否已设置
   - 检查任务执行条件
   - 检查任务权限

2. **异常处理**：
   ```java
   try {
       AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
       alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent);
   } catch (SecurityException e) {
       Log.e(TAG, "设置定时任务失败", e);
       // 处理权限不足情况
   }
   ```

### 4.3 常见问题修复

#### 4.3.1 空指针防护
```java
// 使用Optional或判空
if (object != null) {
    object.doSomething();
}

// 使用工具类
Objects.requireNonNull(object, "object cannot be null");
```

#### 4.3.2 数组越界防护
```java
// 检查数组边界
if (index >= 0 && index < array.length) {
    return array[index];
}

// 使用安全的访问方式
List.getOrDefault(index, defaultValue);
```

#### 4.3.3 类型转换防护
```java
// 使用instanceof检查
if (object instanceof String) {
    String str = (String) object;
}

// 使用try-catch捕获ClassCastException
try {
    String str = (String) object;
} catch (ClassCastException e) {
    Log.e(TAG, "类型转换失败", e);
}
```

### 4.4 内存优化
1. **及时释放**：及时释放不再使用的对象
2. **弱引用使用**：使用WeakReference避免内存泄漏
3. **图片优化**：使用适当大小的图片
4. **对象池**：复用对象减少GC
5. **应用列表优化**：优化应用信息缓存

## 5. 预防措施

### 5.1 代码规范
1. **使用注解**：@NonNull、@Nullable等
2. **静态检查**：使用Lint、FindBugs等工具
3. **单元测试**：编写单元测试覆盖关键逻辑
4. **代码审查**：定期进行代码审查

### 5.2 EDLA特有预防措施
1. **权限管理**：
   - 处理权限被拒绝的情况
   - 提供权限提示

2. **应用限制**：
   - 检查应用限制状态
   - 处理应用启动限制
   - 优化应用切换流程

### 5.3 工具推荐
1. **Crashlytics**：崩溃收集和分析
2. **Bugly**：腾讯的崩溃收集平台
3. **LeakCanary**：内存泄漏检测
4. **Android Lint**：代码静态分析
5. **EDLA测试工具**：专门的EDLA环境测试工具

### 5.4 测试策略
1. **边界测试**：测试各种边界情况
2. **异常测试**：模拟各种异常情况
3. **压力测试**：测试高负载场景
4. **兼容性测试**：在不同设备上测试
5. **EDLA场景测试**：
   - 权限变更测试
   - 定时任务测试

## 6. 常见Crash场景及处理

### 6.1 Activity启动崩溃
**问题**：Activity启动时崩溃
**原因**：Intent参数缺失、权限问题
**解决**：添加参数检查、申请权限

### 6.2 数据库操作崩溃
**问题**：数据库操作时崩溃
**原因**：SQL语句错误、表不存在
**解决**：检查SQL语句、添加异常处理

### 6.3 网络请求崩溃
**问题**：网络请求时崩溃
**原因**：JSON解析错误、网络异常
**解决**：添加异常处理、使用Gson/Jackson等库

### 6.4 多线程崩溃
**问题**：多线程操作时崩溃
**原因**：线程安全问题、并发访问
**解决**：使用同步机制、线程安全集合

### 6.5 应用切换崩溃
**问题**：切换应用时崩溃
**原因**：应用限制检查异常、权限问题
**解决**：
- 添加应用存在性检查
- 处理应用限制异常
- 优化应用切换流程

### 6.7 定时任务崩溃
**问题**：执行定时任务时崩溃
**原因**：权限不足、任务配置错误
**解决**：
- 检查定时任务权限
- 添加异常处理
- 验证任务配置

## 7. 分析检查清单

### 7.1 通用检查
- [ ] 获取完整的崩溃堆栈信息
- [ ] 识别崩溃类型和崩溃位置
- [ ] 分析崩溃的根本原因
- [ ] 检查相关代码逻辑
- [ ] 提供具体的修复方案
- [ ] 验证修复方案的有效性
- [ ] 添加异常处理和防护措施
- [ ] 更新单元测试覆盖

## 8. 案例分析

### 8.1 案例一：空指针崩溃
**现象**：点击按钮时崩溃，NullPointerException
**原因**：findViewById返回null，未检查直接使用
**解决**：添加null检查或使用ViewBinding

### 8.2 案例二：数组越界崩溃
**现象**：列表滑动时崩溃，ArrayIndexOutOfBoundsException
**原因**：Adapter数据源长度与getCount返回值不一致
**解决**：确保数据源长度和方法返回值一致

### 8.3 案例三：内存溢出崩溃
**现象**：加载大图片时崩溃，OutOfMemoryError
**原因**：一次性加载过多大图片
**解决**：使用图片加载库、压缩图片大小

### 8.4 案例四：类型转换崩溃
**现象**：Fragment切换时崩溃，ClassCastException
**原因**：错误的类型转换
**解决**：使用instanceof检查后再转换

### 8.5 案例五：应用切换崩溃
**现象**：切换应用时崩溃，ActivityNotFoundException
**原因**：应用不存在或被卸载
**解决**：
- 添加应用存在性检查
- 处理应用未找到的情况
- 更新应用白名单

## 9. Crash报告分析技巧

### 9.1 崩溃堆栈阅读
1. **从上到下**：首先关注堆栈顶部
2. **关注包名**：重点关注自己应用的代码
3. **忽略系统类**：通常不是系统类的问题
4. **查找关键信息**：类名、方法名、行号

### 9.2 崩溃统计
1. **崩溃率**：计算崩溃率，判断严重程度
2. **影响用户**：统计受影响的用户数量
3. **设备分布**：分析崩溃在哪些设备上出现
4. **版本分布**：分析崩溃在哪些版本上出现
5. **场景分布**：分析崩溃发生的场景（应用切换等）

### 9.3 崩溃趋势
1. **时间趋势**：分析崩溃随时间的变化
2. **版本趋势**：分析不同版本的崩溃情况
3. **修复效果**：评估修复方案的效果

## 10. EDLA环境Crash调试技巧

### 10.1 日志过滤
```bash
# 过滤权限检查日志
adb logcat | grep -i permission

# 过滤定时任务日志
adb logcat | grep -i schedule
```

### 10.2 应用限制检查
```bash
# 查看应用限制状态
adb shell dumpsys device_policy | grep restrictions

# 查看应用安装状态
adb shell pm list packages
```

