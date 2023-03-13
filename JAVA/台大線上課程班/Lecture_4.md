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
  很容易形成無限循環。

  ```java
  ...
    while (true);
  ...
  ```

  ### 循環的常見錯誤如下：
  - 沒有 start;
  - 沒有 stop;
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

## 循環設計策略
  - 確定需要重複的語句。
  - 用適當的循環包裝這些語句。
  - 設置 `繼續` 條件。

## 哨兵控制的循環
  另一種控制循環的常用技術是在讀取和處理一組值時指定一個特殊值。

  - 這個特殊的輸入值稱為標記值，表示循環結束。
  - 例如，操作系統和GUI 應用程序。

## 範例：收銀員問題
  編寫一個程序，對連續輸入的正整數求和，然後在輸入為非正數時輸出和。
  
  ```java
  ...
    int total = 0, price = 0;
    Scanner input = new Scanner(System.in);

    System.out.println("Enter price?"); price = input.nextInt();
    while (price > 0) {
      total += price;
      System.out.println("Enter price?");
      price = input.nextInt();
      // These two lines above repeat Line 5 and 6?!
    }

    System.out.println("Total = " + total);
    input.close();
  ...
  ```

## `do-while` Loops
  do-while 循環類似於 while 循環，不同之處在於它首先執行循環體，然後檢查循環條件。

  ```java
  ...
    do {
      // Loop body.
    } while (/* 條件：布林表達式 */);
  ...
  ```

  - 不要錯過do-while 循環末尾的分號。
  - do-while 循環也稱為後測試循環，與 while 循環相反，while 循環是前測試循環。

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
  for 循環使用整數計數器來控制主體執行的次數。

  ```java
  ...
    for (init action; condition; increment) {
      // Loop body.
    }
  ...
  ```

  - `init 動作`：聲明並初始化一個計數器。
  - `條件`：循環繼續。
  - `增量`：每次迭代後計數器如何變化。

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

  - 請注意，左側列表第 3 行中的第一個循環語句僅執行一次。
  - 確保您清楚for 循環的執行過程！

  ![image_4-3](./image/image_4-3.png)

## 鍛煉
  編寫一個程序，顯示 1 到 100 之間的所有偶數。
  - 您可以使用模塊化運算符 (%)。
    
    ```java
    ...
      for (int i = 1; i <= 100; i++) {
        // Good? if (i % 2 == 0) System.out.println(i);
      }
    ...
    ```

  - 也可以考慮以下替代方案：
    
    ```java
    ...
      for (int i = 2; i <= 100; i += 2) {
        // Which is better? System.out.println(i);
      }
    ...
    ```

## 更多練習
  - 編寫一個程序來計算 N ≥ 0 的階乘
    - 例如，10！ = 3628800。
  - 編寫程序計算xn，其中 xⁿ 是雙精度值，n 是整數。
    - 例如，2.0¹⁰ = 1024.0。
  - 編寫一個程序來計算
    ![image_4-4](./image/image_4-4.png)

    - 例如，程序輸出3.141492，N = 10000。
    - Inmath,p → π as N → ∞。
    - 與數學交朋友。

## 數值 範例：蒙特卡羅模擬
  - 令n 為樣本點總數，m 為落在四分之一圓內的樣本點數（如下頁所示）。
    - 只需使用 `Math.random()` 繪製一個點。
  - 編寫程序通過計算來估計 π
    ![image_4-5](./image/image_4-5.png)

    根據大數定律 (LLN)，其中 π^ → π 為 n → ∞。

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
            if (x * x + y * y < 1) m++;
          }

          System.out.println("pi = " + 4.0 * m / N);
          // Why 4.0 but not 4?
        }
      }
    ...
    ```

## 數值 範例：二分法求根
  - 考慮多項式 x³ − x − 2。
  - 現在我們繼續尋找根x′ 使得x′³ −x′ −2 = 0。
  - 首先選擇 a = 1 和 b = 2 作為初始猜測。5
  - 利用二分法，將搜索區間反复劃分為兩個子區間，並決定下一個搜索區間是哪個子區間。
  - 由於浮點數的精度有限，我們通過設置誤差容限（例如ε = 1e − 9）提前終止算法，以在效率和準確性之間取得平衡。

  ![image_4-7](./image/image_4-7.png)

  ```java
  ...
    double a=1,b=2,c=0,eps=1e−9; 3
    while(b − a > eps){
      c = (a + b) / 2; // Find the middle point.
      double fa = a * a * a − a − 2;
      double fc = c * c * c − c − 2;
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
  
