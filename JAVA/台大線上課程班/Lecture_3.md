# Lecture_3 分支
  ```java
  class Lecture3 {
    "流程控制：有條件的控制"
  }
  // Keywords:
  if, else, switch, case, default, break
  ```

## 流程控制
  - 我們繼續介紹算法的構建塊如下。
  - 首先，大多數語句是按順序執行的。
  - 如果已知分支（選擇）規則，程序可以處理多種情況。
  - 此外，程序可以在必要時重複操作。
  - 例如，還記得如何在輸入列表中找到最大值嗎？

## 分支的表示
  - `if-else` 的條件語句。
  - `switch-case-break-default` 的條件語句。
  - 條件運算符。

## 分支語句：if
  - 語法簡單，如下所示。
    ```java
    ...
      if(/* 條件：一個布林表達式 */) {
        // 選擇主體：條件語句。
      }
    ...
    ```
  - 如果條件被評估為 `true`，則條件語句將被執行一次。
  - 如果為 `false`，則選擇主體將被忽略（或者我們說程序跳轉到下一個段落）。
  - 請注意，如果正文僅包含單個語句，則可以省略大括號。

  ![image_3-1](./image/image_3-1.png)

## 範例：圓形面積（重新訪問）
  編寫一個程序，接收一個正數作為圓的半徑並輸出結果面積。

  ```java
  ...
    if (r > 0) {
      double A = r * r * 3.14;
      System.out.println(A);
    }
  ...
  ```

  `false` 的情況下怎麼辦？

## if-else 語句
  ```java
  ...
    if (/* 條件：一個布林表達式 */) {
      // Body for the true case.
    } else {
      // Body for the false case.
    }
  ...
  ```

  ![image_3-2](./image/image_3-2.png)

## 範例：圓形面積（重新訪問）
  現在為 `false` 情況添加條件語句。

  ```java
  ...
    if (r > 0) {
      double A = r * r * 3.14;
      System.out.println(A);
    } else {
      System.out.println("Not a circle.");
    }
  ...
  ```

## 巢狀條件語句 範例
  編寫一個程序，將百分比成績轉換為字母成績。

  ```java
  ...
    if (score >= 90)
      System.out.println("A");
    else {
      if (score >= 80)
        System.out.println("B");
      else {
        if (score >= 70)
          System.out.println("C");
        else {
          if (score >= 60)
            System.out.println("D");
          else
            System.out.println("F");
        }
      }
    }
  ...
  ```

## 多個分支
  ```java
  ...
    if (score >= 90)
      System.out.println("A");
    else if (score >= 80)
      System.out.println("B");
    else if (score >= 70)
      System.out.println("C");
    else if (score >= 60)
      System.out.println("D");
    else
      System.out.println("F");
  ...
  ```

  - 更容易閱讀！
  - 我們應該避免深縮排。

  ### 先前程序的替代方案如下所示：
    ```java
    ...
      if (score >= 90 && score <= 100)
        System.out.println("A");
      else if (score >= 80 && score < 90)
        System.out.println("B");
      else if (score >= 70 && score < 80)
        ...
    ...
    ```

    - 但是，條件的順序可能是相關的。（為什麼？）
      - 
    - 性能可能會因條件順序而降低。（為什麼？）
      - 

## 常見錯誤
  ```java
  ...
    if (r > 0);
      double A = r * r * 3.14;
      System.out.println(A);
  ...
  ```

  - 不要在條件後方添加分號。
  - 如果您在第 2 行這樣做，則此語句無效（無用）。
  - 多個條件語句應該用大括號分組。

## 不確定的範例
  