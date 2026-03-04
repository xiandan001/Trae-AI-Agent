# Android 架构符合性检查清单

## 1. 架构分层检查

### 1.1 分层原则
Android 应用应该遵循清晰的分层架构，通常包括：
- **表现层（Presentation Layer）**：Activity、Fragment、Adapter 等 UI 组件
- **业务逻辑层（Domain Layer）**：UseCase、业务逻辑处理
- **数据层（Data Layer）**：Repository、DataSource、数据库、网络请求等

### 1.2 层次依赖检查

**正确依赖方向：**
```
Presentation Layer → Domain Layer → Data Layer
```

**检查要点：**
- 上层可以依赖下层，下层不能依赖上层
- 表现层不能直接访问数据层
- 数据层不能访问表现层

**错误示例：**
```java
// 错误：数据层依赖表现层
public class UserRepository {
    private Activity mActivity; // 不应该持有 Activity 引用
    
    public void saveData(Activity activity) {
        mActivity = activity; // 错误
    }
}
```

**正确示例：**
```java
// 正确：通过回调或 LiveData/Flow 传递数据
public class UserRepository {
    private final MutableLiveData<User> mUserLiveData = new MutableLiveData<>();
    
    public LiveData<User> getUserLiveData() {
        return mUserLiveData;
    }
}
```

## 2. MVVM 架构检查

### 2.1 ViewModel 职责检查

**ViewModel 应该包含：**
- UI 相关的业务逻辑
- 数据的转换和处理
- 状态管理

**ViewModel 不应该包含：**
- Activity/Fragment 的引用
- View 的引用
- Context 的引用（除了 Application Context）

**错误示例：**
```java
// 错误：ViewModel 持有 View 引用
public class UserViewModel extends ViewModel {
    private Activity mActivity; // 错误
    private TextView mTextView; // 错误
    
    public UserViewModel(Activity activity) {
        mActivity = activity;
    }
}
```

**正确示例：**
```java
// 正确：ViewModel 不持有 View 引用
public class UserViewModel extends ViewModel {
    private final MutableLiveData<User> mUserLiveData = new MutableLiveData<>();
    
    public LiveData<User> getUserLiveData() {
        return mUserLiveData;
    }
    
    public void loadUser() {
        // 业务逻辑
    }
}
```

### 2.2 LiveData 使用检查

**检查要点：**
- LiveData 的观察应该在 View 层进行
- ViewModel 中应该暴露 LiveData 而不是 MutableLiveData
- 使用 LiveData 传递数据，避免回调地狱

**正确示例：**
```java
// ViewModel
public class UserViewModel extends ViewModel {
    private final MutableLiveData<User> mUserLiveData = new MutableLiveData<>();
    
    public LiveData<User> getUserLiveData() {
        return mUserLiveData;
    }
}

// Activity/Fragment
mViewModel.getUserLiveData().observe(this, user -> {
    // 更新 UI
});
```

### 2.3 DataBinding 检查

**检查要点：**
- 布局文件应该使用 DataBinding
- ViewModel 应该与布局绑定
- 避免在布局中使用过多的逻辑

**正确示例：**
```xml
<layout>
    <data>
        <variable
            name="viewModel"
            type="com.example.UserViewModel" />
    </data>
    
    <LinearLayout>
        <TextView
            android:text="@{viewModel.userName}" />
    </LinearLayout>
</layout>
```

## 3. Repository 模式检查

### 3.1 Repository 职责检查

**Repository 应该包含：**
- 数据的获取和存储
- 多数据源的协调（网络、缓存、数据库）
- 数据转换和映射

**Repository 不应该包含：**
- UI 相关的逻辑
- Activity/Fragment 的引用

**正确示例：**
```java
public class UserRepository {
    private final UserRemoteDataSource mRemoteDataSource;
    private final UserLocalDataSource mLocalDataSource;
    
    public LiveData<User> getUser(String userId) {
        // 从本地获取
        LiveData<User> localData = mLocalDataSource.getUser(userId);
        
        // 从网络获取并更新本地
        fetchUserFromNetwork(userId);
        
        return localData;
    }
    
    private void fetchUserFromNetwork(String userId) {
        // 网络请求逻辑
    }
}
```

### 3.2 DataSource 分层检查

**检查要点：**
- RemoteDataSource 负责网络请求
- LocalDataSource 负责本地存储（数据库、SharedPreferences）
- DataSource 不应该包含业务逻辑

## 4. 依赖注入检查

### 4.1 依赖注入使用

**检查要点：**
- 使用 Dagger、Hilt 或 Koin 进行依赖注入
- 避免手动创建依赖
- 使用构造函数注入

**正确示例：**
```java
// 使用 Hilt
@HiltViewModel
public class UserViewModel extends ViewModel {
    private final UserRepository mUserRepository;
    
    @Inject
    public UserViewModel(UserRepository userRepository) {
        mUserRepository = userRepository;
    }
}
```

### 4.2 单例使用检查

**检查要点：**
- Repository、DataSource 应该是单例
- ViewModel 不应该是单例
- UseCase 可以是单例（如果无状态）

## 5. Clean Architecture 检查

### 5.1 UseCase 职责检查

**UseCase 应该包含：**
- 单一的业务逻辑
- 可复用的业务操作

**UseCase 不应该包含：**
- UI 逻辑
- 数据持久化逻辑

**正确示例：**
```java
public class GetUserUseCase {
    private final UserRepository mUserRepository;
    
    public GetUserUseCase(UserRepository userRepository) {
        mUserRepository = userRepository;
    }
    
    public LiveData<User> execute(String userId) {
        return mUserRepository.getUser(userId);
    }
}
```

### 5.2 实体（Entity）检查

**检查要点：**
- Entity 应该是纯粹的 POJO
- 不包含任何业务逻辑
- 不包含 Android 相关的类

**正确示例：**
```java
public class User {
    private String id;
    private String name;
    private String email;
    
    // Getters and Setters
}
```

## 6. 组件通信检查

### 6.1 事件总线使用

**检查要点：**
- 避免使用 EventBus、RxBus 等全局事件总线
- 优先使用 LiveData、Flow 或接口回调

### 6.2 Intent 传递数据

**检查要点：**
- Intent 传递的数据应该实现 Parcelable 或 Serializable
- 避免传递大对象
- 使用 Bundle 封装数据

### 6.3 接口回调使用

**检查要点：**
- 接口定义应该清晰明确
- 回调应该在主线程执行
- 避免回调地狱

## 7. 模块化检查

### 7.1 模块划分

**检查要点：**
- 按功能划分模块
- 模块之间依赖清晰
- 避免循环依赖

**示例模块划分：**
```
app/
  - 主模块
  - 依赖其他功能模块

feature-user/
  - 用户功能模块
  - 包含用户相关的 UI、业务逻辑、数据

feature-payment/
  - 支付功能模块
  - 独立的用户模块

core/
  - 核心模块
  - 基础类、工具类、网络库封装
```

### 7.2 模块接口检查

**检查要点：**
- 模块间通过接口通信
- 避免直接访问其他模块的内部实现
- 使用依赖倒置原则

## 8. 生命周期感知检查

### 8.1 Lifecycle 使用

**检查要点：**
- 组件应该实现 LifecycleObserver
- 避免在 Activity/Fragment 中直接管理组件生命周期

**正确示例：**
```java
public class LocationManager implements LifecycleObserver {
    
    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    public void startLocationUpdates() {
        // 开始定位
    }
    
    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    public void stopLocationUpdates() {
        // 停止定位
    }
}

// 在 Activity/Fragment 中
getLifecycle().addObserver(mLocationManager);
```

### 8.2 ViewModel 生命周期检查

**检查要点：**
- ViewModel 在 Activity/Fragment 销毁时自动清除
- 不要在 ViewModel 中持有 Activity/Fragment 的引用
- 使用 ViewModelProvider 获取 ViewModel

## 9. 协程/异步处理检查

### 9.1 协程使用

**检查要点：**
- 使用 ViewModelScope 在 ViewModel 中启动协程
- 使用 LifecycleScope 在 Activity/Fragment 中启动协程
- 不要使用 GlobalScope

**正确示例：**
```java
// 在 ViewModel 中
viewModelScope.launch {
    val user = userRepository.getUser(userId)
    _userLiveData.value = user
}

// 在 Activity/Fragment 中
lifecycleScope.launch {
    // 执行异步操作
}
```

### 9.2 线程切换检查

**检查要点：**
- 使用 withContext(Dispatchers.IO) 切换到 IO 线程
- 使用 withContext(Dispatchers.Main) 切换到主线程
- 避免阻塞主线程

**正确示例：**
```java
viewModelScope.launch {
    val result = withContext(Dispatchers.IO) {
        // IO 操作
        performNetworkRequest()
    }
    // 自动切回主线程
    _resultLiveData.value = result
}
```

## 10. 数据流检查

### 10.1 单向数据流

**检查要点：**
- 数据流向应该是单向的：View → ViewModel → Repository
- 避免双向绑定导致的状态混乱
- 使用 LiveData/Flow 实现单向数据流

### 10.2 状态管理检查

**检查要点：**
- 使用单一数据源管理状态
- 避免状态分散在多个地方
- 使用 sealed class 表示不同的状态

**正确示例：**
```java
// 状态定义
sealed class UiState {
    object Loading : UiState()
    data class Success(val data: User) : UiState()
    data class Error(val message: String) : UiState()
}

// 在 ViewModel 中
private val _uiState = MutableLiveData<UiState>()
val uiState: LiveData<UiState> = _uiState

// 在 Activity/Fragment 中观察
mViewModel.uiState().observe(this, state -> {
    switch (state) {
        case Loading:
            showLoading();
            break;
        case Success:
            showData(state.getData());
            break;
        case Error:
            showError(state.getMessage());
            break;
    }
});
```

## 11. 接口设计检查

### 11.1 接口职责单一

**检查要点：**
- 接口应该职责单一
- 避免臃肿的接口
- 使用接口隔离原则

### 11.2 接口命名

**检查要点：**
- 接口名应该以 I 开头（可选，根据团队规范）
- 接口名应该是名词或名词短语
- 方法名应该清晰表达意图

## 12. 依赖方向检查

### 12.1 高层模块不依赖低层模块

**检查要点：**
- 高层模块（业务逻辑）不应该依赖低层模块（具体实现）
- 两者都应该依赖抽象（接口）

**正确示例：**
```java
// 定义接口
public interface UserRepository {
    LiveData<User> getUser(String userId);
}

// 高层模块依赖接口
public class GetUserUseCase {
    private final UserRepository mUserRepository;
    
    public GetUserUseCase(UserRepository userRepository) {
        mUserRepository = userRepository;
    }
}

// 低层模块实现接口
public class UserRepositoryImpl implements UserRepository {
    @Override
    public LiveData<User> getUser(String userId) {
        // 实现
    }
}
```

### 12.2 开闭原则

**检查要点：**
- 对扩展开放，对修改关闭
- 使用多态和依赖注入实现扩展性

## 13. 架构审查检查点

### 13.1 分层清晰性
- 每一层职责是否明确
- 层次依赖是否正确
- 是否有跨层访问

### 13.2 组件职责
- 组件职责是否单一
- 组件之间耦合度是否合理
- 是否有循环依赖

### 13.3 数据流向
- 数据流向是否清晰
- 是否遵循单向数据流
- 状态管理是否合理

### 13.4 可测试性
- 是否容易编写单元测试
- 是否容易编写集成测试
- 依赖是否可以 Mock

### 13.5 可维护性
- 代码结构是否清晰
- 是否易于扩展
- 是否易于理解

## 14. 常见架构问题

### 14.1 God Activity/Fragment

**问题：**
- Activity/Fragment 包含过多逻辑
- 难以维护和测试

**解决方案：**
- 将逻辑抽取到 ViewModel
- 使用 UseCase 封装业务逻辑
- 使用 Repository 管理数据

### 14.2 数据分散

**问题：**
- 相同的数据在多个地方管理
- 容易导致数据不一致

**解决方案：**
- 使用单一数据源
- 使用 LiveData/Flow 管理状态
- 使用 ViewModel 共享数据

### 14.3 回调地狱

**问题：**
- 多层嵌套的回调
- 代码难以阅读和维护

**解决方案：**
- 使用协程或 RxJava
- 使用 LiveData/Flow
- 使用链式调用

### 14.4 依赖注入混乱

**问题：**
- 手动创建依赖
- 依赖关系不清晰

**解决方案：**
- 使用 Dagger、Hilt 或 Koin
- 使用构造函数注入
- 遵循依赖注入最佳实践

## 15. 工具使用建议

### 15.1 架构图
- 使用 UML 图绘制架构
- 使用组件图表示模块关系
- 使用序列图表示交互流程

### 15.2 代码分析
- 使用静态分析工具检查架构问题
- 使用架构验证工具（如 ArchUnit）
- 定期进行架构审查
