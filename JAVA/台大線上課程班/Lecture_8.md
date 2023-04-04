# Lecture 8: 異常處理和斷言
  ```java
  class Lecture8 {
    "《異常與異常處理》"
  }
  // Keywords:
  try, catch, finally, throw, throws, assert
  ```

## 介紹
• 異常是擾亂程序正常流程的事件。1
• 例如，打開丟失的文件。
• 當方法中發生錯誤時，該方法創建一個
異常對象並將其交給運行時系統。
• 這稱為拋出異常。
• 運行時系統在調用堆棧中搜索包含可以處理異常的代碼塊的方法，稱為異常處理程序
• 據說選擇的異常處理程序捕獲了異常。

1請注意，例外情況應為不可抗力。

## 處理塊：try-catch-finally
• 現在我們繼續介紹異常處理程序的三個組件：try、catch 和finally 塊。
• 首先我們將可能拋出異常的正常操作放在try 塊中。
• 然後我們寫下特定異常的處理程序。2
• 你可以考慮一個multi-catch（使用|來分隔它們）。3 • 通常，我們將超類型Exception放在最後一個catch中
子句來捕獲例外情況。
• Java 提供finally 塊，它總是在try 塊退出時執行。
• 此塊主要用於清理，例如關閉文件。

2嘗試處理每個異常，但一次都不要。
3同一個catch子句中的分組異常應該是兄弟。

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class ExceptionDemo {
  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);
    try {
      System.out.println("Enter an integer?");
      int x = input.nextInt();
    } catch (InputMismatchException e) {
      System.out.println("Not an integer.");
    } catch (Exception e) {
      System.out.println("Unknown exception.");
    } finally {
      input.close();
      System.out.println("Cleanup is done.");
    }
    System.out.println("End of program.");
  }
}
```

## 異常家族4
• 最高級別的異常系列是Throwable。
• Throwable 的所有子類型都可以分為兩組：未檢查的異常和已檢查的異常。
• 必須在編譯時檢查已檢查的異常。 • 例如，IOException 和Exception。
• 未經檢查的異常不會被編譯器強制處理或指定異常。
• 例如，RuntimeException。

4See https://www.programcreek.com/2009/02/ diagram-for-hierarchy-of-exception-classes/.

## 拋出異常
• 作為圖書館製造商，我們有時會禁止用戶的行為。
• Java 通過使用throw（發出）和throws（翻譯）提供了拋出機制。

```java
public class Circle {
  private double radius;
  public Circle(double r) throws Exception {
    if (r <= 0)
      throw new Exception("r <= 0");
      radius = r;
  }
}
```

## 定制例外

• 很明顯，我們利用繼承機制來創建我們自己的異常系列。
```java
public class InvalidRadiusException extends Exception {
  public InvalidRadiusException(double r) {
    super("Invalid radius: " + r); // Pass error message.
  }
}
```

```java
public class Circle {
  private double radius;
  public Circle(double r) throws InvalidRadiusException {
    if (r <= 0)
      throw new InvalidRadiusException(r);
      radius = r;
  }
}
```

```java
public class NewExceptionDemo {
  public static void main(String[] args) {
    try {
      new Circle(−10); // Check the result!
    } catch (InvalidRadiusException e) {}
  }
}
```

## 題外話：斷言
• 斷言是一種聲明，它使您能夠測試您對程序的假設，作為內部檢查。
• 在運行程序之前，將“-ea”添加到VM 參數以便可以測試這些斷言語句。

```java
public class AssertDemo {
  public static void main(String[] args) {
    int x = 1;
    assert("x is not equal to 2.", x == 2);
    // AssertionError occurs!!
    System.out.println("End of program.");
  }
}
```

## 單元測試：JUnit
• 但是，我們應該避免將測試代碼與正常代碼一起編寫！
• 試用 JUnit：https://junit.org/