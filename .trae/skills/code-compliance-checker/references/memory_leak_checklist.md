# Android 内存泄漏检查清单

## 1. Handler 相关检查

### 1.1 Handler 匿名内部类写法检查

**问题模式：**
```java
// 错误写法 - 匿名内部类持有外部类引用
private Handler mHandler = new Handler() {
    @Override
    public void handleMessage(Message msg) {
        // 处理消息
    }
};
```

**正确写法：**
```java
// 使用静态内部类 + WeakReference
private static class MyHandler extends Handler {
    private final WeakReference<Activity> mActivity;
    
    MyHandler(Activity activity) {
        mActivity = new WeakReference<>(activity);
    }
    
    @Override
    public void handleMessage(Message msg) {
        Activity activity = mActivity.get();
        if (activity != null && !activity.isFinishing()) {
            // 处理消息
        }
    }
}
```

### 1.2 Runnable 匿名内部类检查

**问题模式：**
```java
// 错误写法
mHandler.post(new Runnable() {
    @Override
    public void run() {
        // 持有外部类引用
    }
});
```

**正确写法：**
```java
// 使用静态内部类
private static class MyRunnable implements Runnable {
    private final WeakReference<Activity> mActivity;
    
    MyRunnable(Activity activity) {
        mActivity = new WeakReference<>(activity);
    }
    
    @Override
    public void run() {
        Activity activity = mActivity.get();
        if (activity != null && !activity.isFinishing()) {
            // 执行操作
        }
    }
}
```

### 1.3 Handler 移除消息检查

**检查要点：**
- 在 Activity/Fragment 的 onDestroy() 中调用 `mHandler.removeCallbacksAndMessages(null)`
- 在 Activity/Fragment 的 onDestroy() 中移除所有待处理的 Runnable
- 在 Activity/Fragment 的 onDestroy() 中清除消息队列

**正确示例：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (mHandler != null) {
        mHandler.removeCallbacksAndMessages(null);
    }
}
```

## 2. 线程相关检查

### 2.1 线程池未关闭检查

**问题模式：**
```java
// 错误写法 - 线程池未关闭
private ExecutorService mExecutor = Executors.newFixedThreadPool(4);
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (mExecutor != null) {
        mExecutor.shutdownNow();
    }
}
```

### 2.2 AsyncTask 使用检查

**问题模式：**
```java
// 错误写法 - AsyncTask 持有 Activity 引用
new AsyncTask<Void, Void, Void>() {
    @Override
    protected Void doInBackground(Void... voids) {
        // 长时间任务
        return null;
    }
}.execute();
```

**正确写法：**
```java
private static class SafeAsyncTask extends AsyncTask<Void, Void, Void> {
    private final WeakReference<Activity> mActivity;
    
    SafeAsyncTask(Activity activity) {
        mActivity = new WeakReference<>(activity);
    }
    
    @Override
    protected Void doInBackground(Void... voids) {
        // 长时间任务
        return null;
    }
    
    @Override
    protected void onPostExecute(Void aVoid) {
        Activity activity = mActivity.get();
        if (activity != null && !activity.isFinishing()) {
            // 更新UI
        }
    }
}
```

### 2.3 Timer/TimerTask 检查

**问题模式：**
```java
// 错误写法 - Timer 未取消
Timer mTimer = new Timer();
mTimer.schedule(new TimerTask() {
    @Override
    public void run() {
        // 定时任务
    }
}, 0, 1000);
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (mTimer != null) {
        mTimer.cancel();
        mTimer = null;
    }
}
```

## 3. 静态变量检查

### 3.1 静态 Context 引用

**问题模式：**
```java
// 错误写法 - 静态持有 Context
private static Context sContext;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    sContext = this; // 泄漏 Activity
}
```

**正确写法：**
```java
// 使用 Application Context
private static Context sContext;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    sContext = getApplicationContext();
}
```

### 3.2 静态 View 引用

**问题模式：**
```java
// 错误写法 - 静态持有 View
private static View sView;
```

**正确写法：**
- 避免静态持有 View
- 如果必须使用，在合适的时机置为 null

### 3.3 静态集合持有对象

**问题模式：**
```java
// 错误写法 - 静态集合未清理
private static List<Bitmap> sBitmapList = new ArrayList<>();
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    // 清理集合中的对象
    if (!sBitmapList.isEmpty()) {
        for (Bitmap bitmap : sBitmapList) {
            if (bitmap != null && !bitmap.isRecycled()) {
                bitmap.recycle();
            }
        }
        sBitmapList.clear();
    }
}
```

## 4. 单例模式检查

### 4.1 单例持有 Context

**问题模式：**
```java
// 错误写法 - 单例持有 Activity 引用
public class Singleton {
    private static Singleton instance;
    private Context mContext;
    
    private Singleton(Context context) {
        mContext = context; // 泄漏风险
    }
    
    public static Singleton getInstance(Context context) {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton(context);
                }
            }
        }
        return instance;
    }
}
```

**正确写法：**
```java
public class Singleton {
    private static Singleton instance;
    private Context mContext;
    
    private Singleton(Context context) {
        mContext = context.getApplicationContext(); // 使用 Application Context
    }
    
    public static Singleton getInstance(Context context) {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton(context.getApplicationContext());
                }
            }
        }
        return instance;
    }
}
```

## 5. 资源未释放检查

### 5.1 Bitmap 未回收

**问题模式：**
```java
// 错误写法 - Bitmap 未回收
private Bitmap mBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.large_image);
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (mBitmap != null && !mBitmap.isRecycled()) {
        mBitmap.recycle();
        mBitmap = null;
    }
}
```

### 5.2 Cursor 未关闭

**问题模式：**
```java
// 错误写法 - Cursor 未关闭
Cursor cursor = getContentResolver().query(uri, null, null, null, null);
if (cursor != null && cursor.moveToFirst()) {
    // 使用 cursor
}
```

**正确写法：**
```java
Cursor cursor = null;
try {
    cursor = getContentResolver().query(uri, null, null, null, null);
    if (cursor != null && cursor.moveToFirst()) {
        // 使用 cursor
    }
} finally {
    if (cursor != null) {
        cursor.close();
    }
}
```

### 5.3 流未关闭

**问题模式：**
```java
// 错误写法 - 流未关闭
FileInputStream fis = new FileInputStream(file);
// 使用流
```

**正确写法：**
```java
FileInputStream fis = null;
try {
    fis = new FileInputStream(file);
    // 使用流
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 5.4 BroadcastReceiver 未注销

**问题模式：**
```java
// 错误写法 - BroadcastReceiver 未注销
registerReceiver(mReceiver, intentFilter);
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (mReceiver != null) {
        unregisterReceiver(mReceiver);
    }
}
```

## 6. 监听器未移除检查

### 6.1 监听器未注销

**问题模式：**
```java
// 错误写法 - 监听器未注销
mButton.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        // 处理点击
    }
});
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (mButton != null) {
        mButton.setOnClickListener(null);
    }
}
```

### 6.2 匿名监听器持有外部引用

**检查要点：**
- 检查是否使用了匿名内部类作为监听器
- 如果匿名内部类访问了外部类的成员，会导致内存泄漏

## 7. 静态内部类持有外部类引用

**问题模式：**
```java
// 错误写法 - 非静态内部类持有外部类引用
public class MyActivity extends Activity {
    private class InnerClass {
        // 持有 MyActivity 引用
    }
}
```

**正确写法：**
```java
// 使用静态内部类
public class MyActivity extends Activity {
    private static class InnerClass {
        // 不持有 MyActivity 引用
    }
}
```

## 8. WebView 相关检查

### 8.1 WebView 未销毁

**问题模式：**
```java
// 错误写法 - WebView 未销毁
private WebView mWebView;
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (mWebView != null) {
        mWebView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
        mWebView.clearHistory();
        ((ViewGroup) mWebView.getParent()).removeView(mWebView);
        mWebView.destroy();
        mWebView = null;
    }
}
```

## 9. 属性动画检查

**问题模式：**
```java
// 错误写法 - 动画未取消
ObjectAnimator animator = ObjectAnimator.ofFloat(view, "alpha", 0f, 1f);
animator.start();
```

**正确写法：**
```java
@Override
protected void onDestroy() {
    super.onDestroy();
    if (animator != null) {
        animator.cancel();
        animator = null;
    }
}
```

## 10. 检查工具使用建议

### 10.1 使用 Android Studio 的 Memory Profiler
- 在运行应用时使用 Memory Profiler 检查内存使用情况
- 观察内存分配和释放模式
- 检查是否有内存持续增长

### 10.2 使用 LeakCanary
- 集成 LeakCanary 进行自动内存泄漏检测
- 查看泄漏报告并修复问题

### 10.3 代码审查要点
- 检查所有匿名内部类的使用
- 检查所有静态变量的使用
- 检查所有 Handler 和 Runnable 的使用
- 检查所有线程和异步任务的使用
- 检查所有资源的创建和释放配对
