# Lecture_4 迴圈
  ```java
  class Lecture4 {
    "流程控制：Loops 迴圈"
  }
  // Keywords:
  while, do, for, break, continue
  ```

## Loops 的本質
  循環可用於重複語句而無需編寫類似的語句。
  - 例如，輸出 100 次 "Hello, Java."。
  
  ```java
  ...
    System.out.println("Hello, Java.");
    System.out.println("Hello, Java.");
    .
    . // Copy and paste for 97 times.
    .
    System.out.println("Hello, Java.");
  ...
  ```

  ```java
  ...
    int cnt = 0;
    while (cnt < 100) {
      System.out.println("Hello, Java.");
      cnt++;
    }
  ...
  ```
  - 這是一個演示循環功能的玩具示例。
  - 在實踐中，任何重複幾次的例程都可以通過將它們放進 `Loop` 來完成。

## 成也迴圈，敗也迴圈
  - Loop 提供強大的  `計算能力`。
  - Loop 帶來了一種`高效` 的編程方式。
  - Loop 可能會消耗大量時間。
    - 我們將很快介紹算法的分析。

## `while` Loops
  while 循環在條件為 `true` 時，重複執行語句。

  ```java
  ...
    while (/* 條件：布林表達式 */) {
      // Loop body.
    }
  ...
  ```

  - 如果條件被評估為 `true`，則執行一次循環體並重新檢查條件。
  - 一旦條件被評估為 `false`，Loop 就不再繼續。

  ![image_4-1](./image/image_4-1.png)

## 範例
  編寫一個程序，對 1 到 100 的所有整數 加總
  - 在數學上，總和 = 1 + 2 + · · · + 100。
  - 有人可能會問為什麼不是 (1 + 100) × 100/2？
  - 以上公式只適用於等差級數！
  - 我們不假設數據是算術級數。 （為什麼？）
  - 相反，我們通過將方程分解為幾個語句來重寫方程，如下一頁所示。

  ```java
  ...
    int sum = 0;
    sum = sum + 1;
    sum = sum + 2;
    .
    .
    .
    sum = sum + 100;
  ...
  ```

  - 如您所見，存在許多類似的語句要被循環包裹！
  - 使用 while 循環，程序可以重新排列如下：

  ```java
  ...
    int sum = 0;
    int i = 1;
    while (i <= 100) {
      sum = sum + i;
      ++i;
    }
  ...
  ```

  - 您應該保證循環將按預期終止。
  - 實際上，循環步驟（迭代）的數量是未知的，直到給出輸入數據。

## Loops 故障
  很容易形成 無窮迴圈。

  ```java
  ...
    while (true);
  ...
  ```

  - ### 循環的常見錯誤如下：
    - 永遠沒有 start;
    - 永遠沒有 stop;
    - 不完整；
    - 超過預期的迭代次數；
    - （越來越多。）

## 範例（重新訪問）
  編寫一個程序，允許用戶重複輸入兩個隨機整數之和的新答案，直到正確為止。

  ```java
  ...
    while (z != x + y) {
      System.out.println("Try again?");
      z = input.nextInt();
    }
    System.out.println("Correct.");
  ...
  ```

## loop 設計策略
  - 找出 需要重複的語句。
  - 用適當的 loop 包裝這些語句 (while、for)。
  - 設置 `繼續` 的條件。

## 哨兵控制的 loops
  另一種控制 loop 的常用技術是在讀取和處理一組值時指定一個 `特殊值`。

  - 這個特殊的輸入值稱為 `標記值`，表示循環結束。
  - 例如，操作系統和GUI 應用程序。

## 範例：收銀員問題
  編寫一個程序，對連續輸入的正整數求和，然後在輸入為非正數時輸出和。
  
  ```java
  ...
    int total = 0, price = 0;
    Scanner input = new Scanner(System.in);

    System.out.println("Enter price?");
    price = input.nextInt();
    while (price > 0) {
      total += price;
      System.out.println("Enter price?");
      price = input.nextInt();
      // 上面這兩行重複了？
      // 因為無論如何都必須讓他先詢問一次
    }

    System.out.println("Total = " + total);
    input.close();
  ...
  ```

## `do-while` Loops
  `do-while` Loop 類似於 `while` Loop，不同之處在於`do-while` 首先執行 Loop body，然後才檢查loop條件。

  ```java
  ...
    do {
      // Loop body.
    } while (/* 條件：布林表達式 */);
  ...
  ```

  - 不要忘了 `do-while` loop結尾的分號。
  - `do-while` loop 也稱為 `後測試循環`，與 while loop 相反，`while` loop是 `前測試循環`。

  ![image_4-2](./image/image_4-2.png)

## 範例（修訂）
  編寫一個程序，對連續輸入的正整數求和，然後在輸入為非正數時輸出和。
  
  ```java
  ...
    int total = 0, price = 0;
    Scanner input = new Scanner(System.in);

    do {
      total += price;
      System.out.println("Enter price?");
      price = input.nextInt();
    } while (price > 0);

    System.out.println("Total = " + total);
    input.close();
  ...
  ```

## `for` Loops
  for loop 使用整數計數器來控制主體執行的次數。

  ```java
  ...
    for (init action; condition; increment) {
      // Loop body.
    }
  ...
  ```

  - `init action (初始化動作)`：聲明並初始化一個計數器。
  - `condition (條件)`：loop繼續。
  - `increment (增量)`：每次迭代後計數器如何變化。

## 範例
  編寫一個從 1 到 100 求和的程序。

  ```java
  ...
    int sum = 0;
    int i = 1;
    while (i <= 100) {
      sum = sum + i;
      ++i;
    }
  ...
  ```

  ```java
  ...
    int sum = 0;
    for (int i = 1; i <= 100; ++i)
      sum = sum + i;
  ...
  ```

  - 請注意，while loop 中的 `int i = 1`，僅執行一次。
  - 確保您清楚for loop 的執行過程！

  ![image_4-3](./image/image_4-3.png)

## 鍛煉
  編寫一個程序，顯示 1 到 100 之間的所有偶數。
  - 您可以使用模塊化運算符 (%)。
    
    ```java
    ...
      for (int i = 1; i <= 100; i++) { // Good?
        if (i % 2 == 0) System.out.println(i);
      }
    ...
    ```

  - 也可以考慮以下替代方案：
    
    ```java
    ...
      for (int i = 2; i <= 100; i += 2) { // Which is better?
        System.out.println(i);
      }
    ...
    ```

    以效率來看的話，i += 2 較快，因為只要執行 50 次。
    但是一般性來說，i ++ 的做法，可以處理未知的陣列，而不是已知的 1 到 100。

## 更多練習
  - 編寫一個程序來計算 N ≥ 0 的[階乘](https://en.wikipedia.org/wiki/Factorial)
    - 例如，10！ = 3628800。 (10 * 9 * 8 *.... * 2 * 1)
    ```java
    // 自行練習
    Scanner input = new Scanner(System.in);
  
    System.out.println("Enter factorial num?");
    int factorialNum = input.nextInt(), total = factorialNum;
    input.close();
    for(int i = factorialNum - 1; i > 0; i--) {
      total *= i;
    }
    System.out.println("Total = " + total);
    ```

    ```java
    // 老師解答
    int s1 = 1;
    for(int i = 1; i<= 10; i++){
      s1 = s1 * i;
    }
    System.out.println("10! = " + s1);
    ```
  
  - 編寫程序計算xⁿ，其中 xⁿ 是雙精度值，n 是整數。
    - 例如，2.0¹⁰ = 1024.0。
    ```java
    // 自行練習
    Scanner input = new Scanner(System.in);
  
    System.out.println("Enter X ?");
    double x = input.nextInt();
    System.out.println("Enter n 次方 ?");
    int n = input.nextInt();
    input.close();
    double total = x;
    for(int i = n - 1; i > 0; i--) {
      total *= x;
    }
    System.out.println("Total = " + total);
    ```

    ```java
    // 老師解答
    int s2 = 1;
    for(int i = 1; i<= 10; i++){
      s2 = s2 * 2;
    }
    System.out.println("2^10 = " + s2);
    ```
  
  - 編寫一個程序來計算
    ![image_4-4](./image/image_4-4.png)

    - 例如，程序輸出3.141492，N = 10000。
    - 在數學中, p → π as N → ∞。
    - 與數學交朋友。

    ```java
    // 自行練習
    Scanner input = new Scanner(System.in);
		  
    System.out.println("Enter N");
    int N = input.nextInt();
    input.close();
    double total = 0;
    for(int i = 0; i <= N; i++) {
      int numPow = (int) Math.pow(-1, i);
      total += (double) numPow / (2 * i + 1);
    }
    System.out.println("Total = " + (4 * total));
    ```

    ```java
    // 老師解答
    double s3 = 0;
    for(int i = 0; i<= 10000; i++){
      s3 = s3 + Math.pow(-1, i) / (2 * i + 1);
    }
    s3 = s3 * 4;
    System.out.println("pi ~ " + s3);
    ```

## 數值 範例：蒙特卡羅模擬
  - let n 為樣本點總數，m 為落在四分之一圓內的樣本點數（如下頁所示）。
    - 只需使用 `Math.random()` 繪製一個點。
  - 編寫程序通過計算來估計 π
    ![image_4-5](./image/image_4-5.png)

    根據大數定律 (LLN)，其中 π^ → π as n → ∞。

    ![image_4-6](./image/image_4-6.png)

    ```java
    ...
      public class MonteCarloDemo {
        public static void main(String[] args) {
          int N = 100000;
          int m = 0;

          for(int i=1; i <= N; i++){
            double x = Math.random();
            double y = Math.random();
            // 落在 1/4 圓內
            if (x * x + y * y < 1) m++;
          }

          System.out.println("pi = " + 4.0 * m / N);
          // Why 4.0 but not 4?
          // 因為結果 需要 double型態，避免轉型
        }
      }
    ...
    ```
    - [蒙地卡羅方法](https://zh.wikipedia.org/wiki/%E8%92%99%E5%9C%B0%E5%8D%A1%E7%BE%85%E6%96%B9%E6%B3%95)
    - [AlphaGo Zero 中的蒙特卡羅樹搜索 (MCTS)](https://jonathan-hui.medium.com/monte-carlo-tree-search-mcts-in-alphago-zero-8a403588276a)

## 數值 範例：二分法求根
  - 考慮多項式 x³ − x − 2。
  - 現在我們繼續尋找根x′ 使得 x′³ − x′ − 2 = 0。
  - 首先選擇 a = 1 和 b = 2 作為初始猜測。
  - 利用二分法，將搜索區間反复劃分為兩個子區間，並決定下一個搜索區間是哪個子區間。
  - 由於浮點數的精度有限，我們通過設置誤差容限（例如ε = 1e − 9）提前終止算法，以在效率和準確性之間取得平衡。

  ![image_4-7](./image/image_4-7.png)

  ```java
  ...
    double a = 1, b = 2, c = 0, eps = 1e−9;
    while(b − a > eps){
      c = (a + b) / 2; // Find the middle point.
      double fa = a * a * a − a − 2;
      double fc = c * c * c − c − 2;
      // c 是否跟 a 同邊，不是的情況下，b = c，再繼續算
      if (fa * fc < 0) {
        b = c;
      } else {
        a = c;
      }
    }

    System.out.println("Root = " + c);
    double residual = c * c * c − c − 2;
    System.out.println("Residual = " + residual);
  ...
  ```

## 跳轉語句
  語句 `break` 和 `continue` 通常用於重複結構中以提供額外的控制。
  - loop 在執行 `break` 語句後，立即終止。
  - loop 在執行 `continue` 語句後，立即跳過本次迭代。
  - 在實踐中，`跳轉語句` 應該是有條件的。

## 範例：質數測試
  編寫一個程序，判斷輸入的整數是否為 [`質數`](https://en.wikipedia.org/wiki/Primality_test#Pseudocode)。

  - 令 x > 1 為任何自然數。
  - 如果 x 沒有正約數，則 x 是質數大於 1 和它自己。
  - 將 x 除以所有更小的自然數很簡單比 x。
  - 為了加速，您可以僅將 x 除以小於√X。 （為什麼？）
    - 只要檢查半邊就好了，有約數的時候，會是√X以下的數 乘上 √X以上的數字。如 21 = 3 * 7。

  ```java
  ...
    Scanner input = new Scanner(System.in);
    System.out.println("Enter x > 2?");
    int x = input.nextInt();
    boolean isPrime = true;
    input.close();

    for (int y = 2; y <= Math.sqrt(x); y++) {
      if (x % y == 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      System.out.println("Prime");
    } else {
      System.out.println("Composite");
    }
  ...
  ```

## 練習
<!-- TODO: -->
  - 通過擴展上一頁中的程序，編寫一個程序列出所有小於 100000 的質數。
    - 有 9592 個小於 100000 的質數。
    - 9592 個質數中最大的一個是 99991。
  - 通過檢查是否有質數來改進質數測試整數 m 從 2 到√n
    - 如何存儲已知的質數？
  - 通過使用簡單的 6k ± 1 改進質數測試優化，比測試所有 m 快 3 倍

## 另一個例子：收銀員問題（重訪）
  - 使用帶有 `break` 語句的 `無窮迴圈` 重做收銀員問題。

  ```java
  ...
    while (true) {
      System.out.println("Enter price?");
      price = input.nextInt();
      if (price <= 0) break; // Stop criteria.
      total += price;
    }
    System.out.println("Total = " + total);
  ...
  ```

## 等價：while 和 for loop
  如果預先知道 重複 `次數`，則可以使用 `for loop`；
  否則，最好使用 `while loop`。
  - 人們總是可以將 `for loop` 轉換為 `while loop`，反之亦然。

## 範例：複利
  編寫一個程序來確定投資價值翻倍的持有年限。

  - 令 `balance` 為當前金額，
  `goal` 為本次投資的目標，
  `r` 為年利率(%)。
  - 我們可以使用複合公式
      `balance = balance × (1 + r / 100.0)`。
  - 然後輸出 `持有年份 n` 和 `最終餘額`。

  ```java
  ...
    int r = 18; // 百分比.
    int balance = 100;
    int goal = 200;

    int years = 0;
    while (balance < goal) {
      balance *= (1 + r / 100.0);
      years++;
    }
    System.out.println("Holding years = " + years);
    System.out.println("Balance = " + balance);
  ...
  ```

  - 如果按月支付利息，您可以堅持幾個月才能達到目標？

  以下使用 for loop 實作
  ```java
  // 錯誤用法
    for (int years = 0; balance < goal; years++) {
      balance *= (1 + r / 100.0);
    }
    ...
    // scope issue. years 是 for 的區域變數
    System.out.println("Holding years = " + years);

  // 應該將 years 改寫成
  ...
    int years = 0; // years 應該在這宣告; 
    for (; balance < goal; years++) {
      balance *= (1 + r / 100.0);
    }
  ...
  ```

  ```java
  ...
    int years = 1; // Why?
    for (; ; years++) {
      balance *= (1 + r / 100.0);
      if (balance > goal) break;
    }
  ...
  ```

  - `for (; ; years++)`，將條件（中間語句）留空假定為 true。

## 嵌套循環示例
  編寫一個程序來顯示一個 9 × 9 乘法表。

  |1 |2 |3 |4 |5 |6 |7 |8 |9|
  |--|--|--|--|--|--|--|--|--|
  |2 |4 |6 |8 |10 |12 |14 |16 |18|
  |3 |6 |9 |12 |15 |18 |21 |24 |27|
  |4 |8 |12 |16 |20 |24 |28 |32 |36|
  |5 |10 |15 |20 |25 |30 |35 |40 |45|
  |6 |12 |18 |24 |30 |36 |42 |48 |54|
  |7 |14 |21 |28 |35 |42 |49 |56 |63|
  |8 |16 |24 |32 |40 |48 |56 |64 |72|
  |9 |18 |27 |36 |45 |54 |63 |72 |81|

  ```java
  ...
    public static void main(String[] args) {
      for (int i = 1; i <= 9; ++i) {
        
        // In row i, output each j.
        for (int j = 1; j <= 9; ++j) {
          System.out.printf("%3d", i * j);
        }
        System.out.println(); // 換行
      }
    }
  ...
  ```

  > `println` 是 line 的意思，會在最後增加 `/n` (new line);

  > `printf("%d", i)`， %d 是字串裡的變數
  > `%3d`，3 代表的是 欄位寬
  > `%d`：int (整數)
  > `%f`：float (浮點數)
  > `%s`：string (字串)

  - For each，內部迴圈 從 j=1 到 j=9。
  - 作為模擬，i 就像時鐘的時針，而 j 就像時鐘的分針一樣。

## 題外話：輸出格式
  - 使用System.out.printf() 顯示格式化輸出。
  - 例如，

    ```java
    ...
      System.out.printf("Pi = %4.2f", 3.1415926);
      // Output 3.14.
    ...
    ```

    ![image_4-8](./image/image_4-8.png)

  - 不指定寬度，只顯示小數點後6位。

    | 格式說明符   | 對應類型       | Example      |
    |:----------:|:-------------:|:------------:|
    | %b         | boolean       | true, false  |
    | %c         | char          | a            |
    | %d         | int           | 123          |
    | %f         | float, double | 3.141592     |
    | %e         | float, double | 6.626070e−34 |
    | %s         | String        | NTU          |

  - 默認情況下，輸出是右對齊的。
  - 如果值需要的空格多於指定的寬度，則寬度會自動增加。
  - 可以嘗試各種參數，例如格式說明符中間的加號(+)、減號(-) 和0。
  - 像 % + 8.2f、% − 8.2f 和 %08.2f。

## 具有多個項目的格式化輸出
  ![image_4-9](./image/image_4-9.png)

  - 所有項目都必須按 `順序`、`數量` 和 `確切類型` 匹配格式說明符。

## 範例：三角形
  <!-- TODO: -->
  ![image_4-10](./image/image_4-10.png)

  ```java
  ...
    // Case (a)
    for (int i = 1; i <= 5; i++) {
      for (int j = 1; j <= i; j++) {
        System.out.printf("*");
      }
      System.out.println();
    }
    // Case (b)
    // Your work here.
    // Case (c)
    // Your work here.
    // Case (d)
    // Your work here.
  ...
  ```












