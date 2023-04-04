# Lecture 6: 方法 與 遞歸
  ```java
  class Lecture6 {
    "Methods"
  }
  // Keywords:
  return
  ```

## Methods (又名程序和子程序)
  - 方法（或函數）可以用來定義 `可重用` 的代碼，從而可以 `組織` 和 `簡化` 代碼。
  - 方法/函數的概念源自數學，例如
    `f(x, y)`
    其中 x 和 y 表示兩個輸入參數。
  - 在計算機科學中，每個輸入參數都應聲明為特定類型。
  - 此外，應該為函數分配 `返回類型`！

## 範例：max
  ![image_6-1](./image/image_6-1.png)
  • 方法名和參數列表一起稱為方法簽名。

  方法重載取決於簽名。我們很快就會看到

## 備擇方案？
  ```java
  ...
    public static int max(int num1, int num2) {
      if (num1 > num2) {
        return num1;
      } else {
        return num2;
      }
    }
  ...
  ```

  ```java
  ...
    public static int max(int num1, int num2) {
      return num1 > num2 ? num1 : num2;
    }
  ...
  ```

> “All roads lead to Rome.”
> – Anonymous

> “但如你根本並無招式，敵人如何來破你的招式？”
> – 風清揚，笑傲江湖。第十回。傳劍

## 關於 return
- return 語句用於結束方法。
• 我們說被調用者是調用者調用的方法。
• 呼叫者有義務向被呼叫者提供輸入，並且
期望返回值。
• 被調用者應保證返回一個值。
• 這建立了兩者之間的關係（權利/義務）。
• 一旦指定返回類型（void 除外），此方法
應該保證返回該類型的值。

## 陷阱

以下兩種方法是不正確的。
```java
...
  public static int foo1() {
    while (true);
    return 0; // Unreachable code.
  }

  public static int foo2(int x) {
    if (x > 0)
      return x; // What if x <= 0?
  }
...
```

## 更多範例
  ```java
  ...
    // Method w/o return.
    public static void display(int[] A) {
      for (int i = 0; i < A.length; i++)
        System.out.printf("%d ", A[i]);
        System.out.println();
    }
    // Method returning array (reference)!
    public static int[] arrayGen(int size, int low, int high) {
      int[] A = new int[size];
      int numOfStates = high − low + 1;
      int offset = low;
      for (int i = 0; i < A.length; i++)
        A[i] = (int) (Math.random() * numOfStates) + offset;
        return A;
    }
  ...
  ```

## 方法調用
  ![image_6-2](./image/image_6-2.png)

  • 請注意，輸入參數是聲明的變量類型
  在方法中作為佔位符。
  • 調用方法時，調用者有義務
  按順序、數量和兼容類型提供參數，如
  在方法簽名中定義。

• 在 Java 中，方法調用使用按​​值傳遞。
• 當被調用者被調用時，程序控制被轉移
從調用者到被調用者。
• 對於每個方法調用，JVM 推送一個幀，它
在調用堆棧中存儲必要的信息。
• 一旦被調用者完成其例程，調用者就恢復其工作。

![image_6-3](./image/image_6-3.png)

## 可變範圍
• 變量作用域是指一個變量可以存在的區域
參考。
• 一對平衡的大括號定義了變量範圍。
• 一般來說，變量可以在類級別、方法中聲明
電平，或循環電平。
• 如果一個局部變量的標識符與類相同
變量，那麼本地的比類更可取
一個（即忽略後者）。
• 這稱為陰影效果。

## 範例
```java
...
  public class ScopeDemo {
    public static int x = 10; // Class level; global variable.
    public static void main(String[] args) {
      System.out.println(x); // Output 10.
      int x = 100; // Method level, aka local variable.
      x++;
      System.out.println(x); // Output 101.
      addOne();
      System.out.println(x); // Output ?
    }

    public static void addOne() {
      x = x + 1;
      System.out.println(x); // Output ?
    }
  }
...
```

## Math 工具箱：Math 類
• Math 類提供基本的數學函數和
兩個常量 Math.PI 和 Math.E。
• 所有方法都是公共和靜態的。
• 你可以在這裡參考Math 的官方手冊。
• 作為一名專業工程師，您應該能夠
閱讀手冊！3

您可能聽說過 [RTFM](https://en.wikipedia.org/wiki/RTFM)

## 特刊：方法重載
• 名稱衝突沒問題。
• 具有相同名稱的方法可以共存並被識別
方法簽名。
• 這可以使程序更清晰、更易讀。

```java
...
  public static int max(int x, int y) { ... }
  
  // Different types.
  public static double max(double x, double y) { ... }

  // Different numbers of inputs.
  public static int max(int x, int y, int z) { ... }
...
```

## 特刊：Varargs
  JDK5 為支持一種類型的任意數量參數的方法提供了簡寫。

  ```java
  ...
    /* You don’t need to do these.
    public static int max(int n1, int n2) { ... }
    public static int max(int n1, int n2, int n3) { ... } */

    public static int max(int... nums) { ... }
    // Equivalent to public static int max(int[] nums) { ... }

    public static void main(String[] args) {
      int x = max(100, 200, 300);
      int y = max(100, 200, 300, 400);
    }
  ...
  ```

## 特刊：main(String[] args)
  - 我現在可以解釋自己了：程序通過調用方法 main() 以及一個字符串數組作為程序參數來開始工作。

  ```java
  ...
    public static void main(String[] args) {
    for (String arg: args)
      System.out.println(arg);
    }
  ...
  ```

  - 在 Eclipse 中，您可以通過將“${string prompt}”作為程序參數添加到 JVM 來打開輸入對話框。

## 遞歸
  遞歸是根據自身定義某物的過程。

  • 調用自身的方法被稱為遞歸的。
  • 遞歸是流量控制的另一種形式。
  • 它是沒有任何循環的重複。

  ![image_6-4](./image/image_6-4.png)

  - Try [Fractal](https://en.wikipedia.org/wiki/Fractal).

## 範例：階乘（重新訪問）
  • 例如，
    4！ = 4 × 3 × 2 × 1（考慮到循環）
    = 4 × 3！ （考慮到遞歸）= 4×（3×2！）
    = 4×(3×(2×1!))
    = 4×(3×(2×(1×0!)))
    = 4×(3×(2×(1×1)))
    = 24。
  • 找到模式？

編寫一個程序來確定 n!通過遞歸。

```java
...
  public static int factorial(int n) {
    if (n < 2)
      return 1; // Base case.
    else
      return n * factorial(n − 1);
  }
...
```

• 記住在遞歸中設置基本情況。 （為什麼？）
• 時間複雜度是多少？

![image_6-5](./image/image_6-5.png)

```java
...
  int s = 1;
  for (int i = n; i > 1; i++) {
    s *= i;
  }
...
```

• 兩者都在 O(n) 時間內運行。
• 一個有趣的問題是，我們能否始終將遞歸
方法變成循環版本的那個？
• 肯定的。
• Church 和 Turing5 證明了循環和遞歸
是等價的。

http://plato.stanford.edu/entries/church-turing/

## 評論
• 遞歸承擔大量開銷。
• 因此遞歸算法的執行速度可能比
迭代等價物。
• 此外，深度遞歸會耗盡調用堆棧，這是
限制，並導致堆棧溢出 6 錯誤。

See https://stackoverflow.com/, https://www.oreilly.com/, and https://www.quora.com/ Does-reading-Copying-and-Pasting-from-Stack-Overflow-make-you-a-better

## 內存佈局
![image_6-6](./image/image_6-6.png)

## 練習：求和（重溫）

編寫一個函數，通過遞歸計算從 1 到 n 的和。

• 例如，n = 100 所以我們有
  sum(100) = 100 + sum(99)
           = 100 + 99 + sum(98)
           = 100 + 99 + 98 + sum(97)
           .
           .
           .
           = 100 + 99 + 98 + · · · + 1。
你能找到遞歸關係嗎？

```java
...
public static int sum(int n) {
  if (n == 1)
    return 1;
  else
    return n + sum(n − 1);
}
...
```

```java
public static int sum(int n) {
  return n == 1 ? 1 : n + sum(n − 1);
}
```


時間複雜度？

## 練習：最大公約數 (GCD)

令a和b為兩個正整數。通過遞歸計算 GCD(a, b)。


• 我們繼續實施歐幾里德算法。7
• 例如，
  GCD(54, 32) = GCD(32, 22)
              = GCD(22, 10)
              = GCD(10, 2)
              = 2。
https://en.wikipedia.org/wiki/Euclidean_algorithm


```java
...
public static int gcd by recursion(int a, int b) {
  int r = a % b;
  if (r == 0)
    return b;
  return gcd_by_recursion(b, r); // Straightforward?!
}
...
```

```java
...
  public static int gcd by loop(int a, int b) {
    int r = a % b;
    while (r > 0) {
      a = b;
      b = r;
      r = a % b;
    }
    return b;
  }
...
```

## 範例：斐波那契數列
令 n ≥ 0 為整數。計算第n個斐波那契數Fn

• 設置F0 =0 和F1 =1。
• 對於 n > 1，斐波那契數列可以通過
Fn = Fn−1 + Fn−2。
• 前 10 個數字如下：0、1、1、2、3、5、8、13、21、
和 34。

```java
...
public static int fib(int n) {
  if (n < 2) {
    return n;
  } else {
    return fib(n − 1) + fib(n − 2);
  }
}
...
```

• 簡短明了！
• 但是，該算法的性能很差！！ • 時間複雜度：O(2n)。 （為什麼！！！）

![image_6-7](./image/image_6-7.png)

```java
...
  public static double fib2(int n) {
    if (n < 2) return n;
    
    int x = 0, y = 1;
    for (int i = 2; i <= n; i++) {
      int z = x + y;
      x = y;
      y = z;
    }
    return y; // Why not z?
  }
...
```

• 所以它可以在O(n) 時間內完成！
• 前一個（通過遞歸）在時間上不是最優的。
• 你能找到斐波那契數列的線性遞歸嗎？
• 事實上，這道題可以在O(logn) 時間內完成！

## 分而治之

• 我們經常使用分而治之的策略9 將原始問題分解為更易於管理的子問題。
  • 例如，冒泡排序。
• 這對程序開發有以下好處：更易於編寫、重用、調試、修改、維護，也更好地促進團隊合作。

![image_6-8](./image/image_6-8.png)

## 概念：抽象

• 抽象過程是決定我們需要突出哪些細節以及我們可以忽略哪些細節。
• 抽象無處不在。
• 算法是對逐步過程的抽象
獲取輸入並產生輸出。
• 編程語言是一組字符串的抽象，
每一個都被解釋為一些計算。 • 和更多。
• 抽象過程還引入了層次。
• 層與層之間明確定義的接口使我們能夠構建大型
和復雜的系統。

## 範例：計算機系統
  ![image_6-9](./image/image_6-9.png)

## 範例：圖形用戶界面 (GUI)
  ![image_6-10](./image/image_6-10.png)

  • 你對電磁理論和通信系統一無所知；您知道如何使用手機，因為您熟悉界面！

## 範例：應用程序編程接口 (API)
  ![image_6-11](./image/image_6-11.png)

  在構建應用程序時，API 通過抽象底層實現並僅公開開發人員需要的對像或操作來簡化編程。

## 概念：抽象（已結束）
• 正如我們所見，方法/函數是控制抽象。
• 此外，像ArrayList 這樣的數據結構是數據抽象。
• 人們可以將對象的概念視為一種結合數據和操作抽象的方式。
• 對象無處不在。
• 例如，描述您的手機。
  • 屬性：電池狀態、4G 信號、電話簿、專輯、音樂庫、剪輯等。
• 功能？你可以給它起名字。