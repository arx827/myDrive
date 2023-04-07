# Lecture 7: 物件導向程式設計 (OOP)
  ```java
  class Lecture7 {
    // 物件導向編程 (OOP)
  }
  // Keywords:
  class, new, this, static, null, extends, super, final, abstract, interface, implements, protected, package, import, enum
  ```

## Object & Class
  - `Object` 在 `字段`（屬性）中保存 `自己的` 狀態，並通過關聯的 `方法` 公開其行為。
  - 為了創建這些 Objects，我們收集所有與函數關聯的屬性並將它們放在一個 `new Class` 中。
  - `Class 是創建實例（也稱為運行時 Objects）的藍圖。`
  - Class 充當 `派生` 類型。
  - Class 是 Java 中的構建塊。

## 範例：點
  - 我們定義一個 new class 如下：
    - 按照慣例，給一個首字母大寫的 class name；
    - 在 class 主體中聲明 數據 和 函數 成員。

    ```java
    ...
      public class Point {
        double x, y;      // Data members.
      }
    ...
    ```

  - 現在我們使用這個 class 來創建一些點。
    ```java
    ...
      public class PointDemo {
        public static void main(String[] args) {
          Point p1 = new Point();
          p1.x = 1;
          p1.y = 2;

          Point p2 = new Point(); p2.x = 3;
          p2.y = 4;

          System.out.printf("(%.2f, %.2f)\n", p1.x, p1.y);
          System.out.printf("(%.2f, %.2f)\n", p2.x, p2.y);
        }
      }
    ...
    ```
  - 你能畫出內存分配的當前狀態嗎？
    ![image_7-21](./image/image_7-21.png)

## 封裝
  - 每個成員都可以有一個訪問修飾符，比如 `public` 和 `private`。
    - `public`：所有類都可以訪問。
    - `private`：只能在它自己的類中訪問。
  - 在 OOP 中，我們隱藏內部狀態並公開對這些字段執行操作的方法。
  - 因此所有字段都應聲明為 `private` (私有)。
  - 但是，此 `private` 修飾符 [不保證任何信息安全](http://stackoverflow.com/questions/9201603/)。
    - 為什麼 私有 有利於 可維護性 和 模塊化。

## 函數成員
  - 如前所述，字段是隱藏的。
  - 因此，如有必要，我們為對象提供 `getter` 和 `setter`：
    - `getter`：返回對象的狀態。
    - `setter`：為對象的狀態設置一個值。
  - 例如，getX() 和 getY() 是 getters；
         setX() 和 setY() 是 Point 類中的 setters。

## 範例：Point（封裝）
  ```java
  ...
  public class Point {
    // Data members: fields or attributes
    private double x, y;
    
    // Function members: methods
    public double getX() { return x; }
    public double getY() { return y; }

    public void setX(double a) { x = a; }
    public void setY(double b) { y = b; }
  }
  ...
  ```

## 構造函數
  - 構造函數跟在 `new` 運算符之後，其作用與其他 方法 一樣。
  - 但是，`它的名稱應該與 class 的名稱相同`，並且 `沒有回傳類型`。
  - 如果需要，一個 class 可以有多個構造函數。
    - 調用 函數 `多載`。
  - 注意構造函數屬於 class 而不是 objects。
    - 換句話說，構造函數不能被任何 object 調用。
  - 如果您沒有定義任何顯式構造函數，Java 會為您假定一個 `默認構造函數`。
    - 此外，添加任何顯式構造函數都會禁用默認構造函數。

## 參數化構造函數
  - 您可以在對象就緒時初始化該對象。
  - 例如，
    ```java
    public class Point {
      ...
      // Default constructor
      public Point() {
        // Do something in common.
      }

      // Parameterized constructor
      public Point(double a, double b) {
        x = a;
        y = b;
      }
      ...
    }
    ```

## 自我參考 (this)
  - 您可以使用 this 在方法和構造函數中引用當前對象的任何（實例）成員。
  - 使用 this 關鍵字的最常見原因是 字段 被 方法參數 `遮蔽` (有相同變數)。
    - 回顧 變數作用域。
  - 您還可以使用 `this() `來 `調用同一 class 中的另一個構造函數`，。

## 範例：點（重新訪問）
  ```java
  public class Point {
    ...
    public Point(double x, double y) {
      this.x = x;
      this.y = y;
    }
    ...
  }
  ```
  但是，不能在 `static` methods 中使用 `this` 運算符。

## 實例成員
  - 請注意，在本講中 數據成員 和 函數成員 聲明為 `w/o static` (不加 static 的情況下)。
    - 通常，加 `static`，是 共用的元素
    - 通常，不加 `static`，是 各自擁有的元素
  - 它們被稱為 `實例成員(instance members)`，只有在創建 `object` 後才可以使用。
  - 從語義上講，每個 object 都有自己的狀態，這些狀態與應用的附屬方法相關聯。
    - 例如，可以在指定特定點 Object時調用 getX()。

## 範例：點之間的距離測量
  ```java
    public class Point {
      /* Ignore the previous part. */
      public double getDistanceFrom(Point that) {
        return Math.sqrt( Math.pow(this.x − that.x, 2)
                        + Math.pow(this.y − that.y, 2) );
      }
    }
  ```
  - 在 OOP 設計中，明確各種類型的對象之間的責任非常重要，即 [單一責任原則](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design))。
    - `高內聚、低耦合`。
    - 好萊塢原則：不要打電話給我們，我們會打電話給你。

## 靜態成員
  - `一旦 class 被加載`，`static members (靜態成員)` 就準備好了。
    - 例如，main()。
    - 您可以嘗試[靜態初始化塊](https://docs.oracle.com/javase/tutorial/java/javaOO/initial.html)。
  - 這些成員可以在沒有任何實例的情況下通過類名直接調用。
    - 例如，Math.PI。
  - 特別是，靜態方法執行算法。
    - 例如，Math.random() 和Arrays.sort()。
  - 請注意，靜態方法 可以 訪問其他靜態成員。（瑣碎的。）
  - 但是，靜態方法 不能 直接訪問實例成員。（為什麼？）

## 範例
  ```java
  ...
    public class Point {
      /* Ignore the previous part. */
      public static double measure(Point first, Point second) {
        // You cannot use this in static context.
        return Math.sqrt(Math.pow(first.x − second.x, 2) + Math.pow(first.y − second.y, 2));
      }
    }
  ...
  ```

  ```java
  ...
    public class PointDemo {
      public static void main(String[] args) {
        /* Ignore the previous part. */
        System.out.println(Point.measure(p1, p2));
      }
    }
  ...
  ```

## 另一個範例：Singleton Pattern (單例模式)
  - 單例模式 是設計模式之一 (23設計模式之一)。
    - `Design patterns (設計模式)` 是針對軟件設計中給定上下文中常見問題的高度可重用解決方案的集合。
    - "設計模式" 一詞由 Erich Gamma、Richard Helm、Ralph Johnson 和 John Vlissides 命名，通常被稱為四人幫 (GoF)。
  - 在某些情況下，系統中只需要一個這種類型的對象。

  - 步驟：
    - 總量控制，private 將 建構子 藏起來。
    - 自己實體化，只有自己能呼叫實體化。
    - 再將 實體化過後的 物件，public 給外部。

  ```java
  ...
    public class Singleton {
      // Do not allow to invoke the constructor by others.
      private Singleton() {}

      // Will be ready as soon as the class is loaded.
      private static Singleton instance = new Singleton();
      
      // Only way to obtain this singleton by the outside world.
      public static Singleton getInstance() {
        return instance;
      }
    }
  ...
  ```

## 對象消除：[垃圾收集 (GC)](http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html)
  - Java 通過GC 處理對象釋放。
    - 時間：預設時間段或出現記憶壓力時。
  - GC 是一個 `守護線程`，它搜索那些 `未引用` 的對象。
    - 當一個 object 不再被程序的任何部分引用時，它就被取消引用。 （如何？）
    - 要使 object 不被引用，只需將 `null` 分配給引用變數即可。
  - 請注意，您可以調用 `System.gc()` 來執行釋放過程。
    - 然而，頻繁調用GC `非常耗時`。

## 統一建模語言
  - 統一建模語言 (UML) 是一種用於指定、可視化、構建和記錄軟件系統工件以及業務建模和其他非軟件系統的工具。
    - http://www.tutorialspoint.com/uml/
    - http://www.mitchellsoftwareengineering.com/IntroToUML.pdf
  - 免費軟件：
    - http://staruml.io/ (適用於所有平台)

## 範例：Point 的類圖
  ![image_7-1](./image/image_7-1.png)
  - 由上而下分別為，`class name`、`data name`、`function name`
    - `+` 指公共。
    - `−` 指私人。

## HAS-A 關係
  - 關聯是一種弱關係，其中所有對像都有自己的生命週期並且沒有從屬關係。
    - 例如，老師 ↔ 學生；醫生 ↔ 病人。
  - 如果 A 使用 B，則它是一個 `集合`，說明B 獨立於A 存在。
    - 例如，騎士 ↔ 劍；公司 ↔ 員工。
  - 如果 A 擁有 B，則它是一個 `組合`，這意味著 B 在沒有 A 的系統中沒有任何意義或目的。
    - 例如，房子 ↔ 房間。

## 範例：線（聚合）
  ![image_7-2](./image/image_7-2.png)
  - +2：在一個線對像中使用兩個點對象。

  ```java
  public class Line {
    private Point head, tail;         // HAS-A 關係
    public Line(Point p1, Point p2) {
      head = p1;
      tail = p2;
    }

    /* Ignore some methods. */
    public double getLength() {
      return head.getDistanceFrom(tail);
    }
  }
  ```

  ![image_7-22](./image/image_7-22.png)

## 練習：圓圈
  ```java
  public class Circle {
    private Point center;            // HAS-A 關係
    private double radius;

    public Circle(Point c, double r) {
      center = c;
      radius = r;
    }

    public double getArea() {
      return radius * radius * Math.PI;
    }

    public boolean isOverlapped(Circle that) {
      return this.radius + that.radius > this.center.getDistanceFrom(that.center);
    }
  }
  ```

## 第一個 IS-A 關係：類別繼承
  - 我們可以通過 `繼承 (inheriting)` 預定義類（即原型）中常用的狀態和行為來定義新類。
  - 類是某個類的 `子類 (subclass)`，通過使用 `extends` 關鍵字稱為 `超類 (superclass)`。
  - 例如，

    ```java
      // Superclass (or parent class)
      class A {
        void doAction() {} // A can run doAction().
      }

      // Subclass (or child class)
      class B extends A {} // B can also run doAction().
    ```

## 範例：人與狗
  ![image_7-3](./image/image_7-3.png)

## 使用繼承之前
  ```java
    public class Human {
      public void eat() {}
      public void exercise() {}
      public void writeCode() {}
    }
  ```

  ```java
    public class Dog {
      public void eat() {}
      public void exercise() {}
      public void wag() {}
    }
  ```

## 使用繼承之後
  ![image_7-4](./image/image_7-4.png)
  將 `Human` 和 `Dog` 之間的公共部分移動到另一個類，例如 `Animal`，作為超類。

  ```java
  public class Animal { // extends Object; implicitly.
    public void eat() {}
    public void exercise() {}
  }
  ```

  ```java
  public class Human extends Animal {
    public void writeCode() {}
  }
  ```

  ```java
  public class Dog extends Animal {
    public void wag() {}
  }
  ```

## 練習：將 Cat 添加到 Animal Hierarchy
  ![image_7-5](./image/image_7-5.png)
  - [貓皇為什麼總是喜歡揉揉踏踏著奴才呢？](https://petsmao.nownews.com/20170124-10587)

  ![image_7-6](./image/image_7-6.png)

  ```java
  public class Cat extends Animal {
    public void stepping() {}
  }
  ```
  - 您可以通過擴展 `Animal` 添加更多種類的動物！
  - 同樣，代碼重用。

## 構造函數鏈
  - 一旦子類的構造函數被調用，JVM 將遞歸地調用其超類的構造函數。
  - 因此，您可能會認為將調用一整條構造函數鏈，一直返回到 `Object` 類的構造函數，這是 Java 中的最頂層的class。
  - 在這個意義上，我們可以說 `每個類都是 Object 的直接或遠距離子類`。

## 類層次結構的插圖
  ![image_7-7](./image/image_7-7.png)

## super Operator
  - 回想一下，`this` 用於引用對象本身。
  - 您可以使用 `super` 來引用 superclass 的（非私有）成員。
  - 請注意，`super()` 可用於調用其超類的構造函數，與 `this()` 類似。

## 函數覆蓋 (Method Overriding)
  > method overloading (多載)
  > method overriding (覆寫)

  - 子類應該 `重新實現` 從其超類繼承的方法。
  - 函數覆蓋要求如下：
    - 函數簽章與其超類相同；
    - 相同的返回類型；
    - 相對於其超類的可見度未降低 (如：您不能將可見性從公共降低為私有)。
  - 請注意，您不能覆蓋靜態函數。
  - 您應該使用 註釋 [@Override](https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Override.html) 來幫助您。
    > 函數聲明旨在覆蓋超類型中的函數聲明。如果使用此註釋類型對方法進行註釋，則要求編譯器生成錯誤消息

  ```java
  class B extends A {
    @Override   // annotation
    void doAction() { /* New impl. w/o changing API. */ }
  }
  ```

## 範例
  ![image_7-8](./image/image_7-8.png)

## 範例：覆寫 toString()
  - `Object` 提供了 toString() 方法，它被 `特意設計` 為由 `System`.out.println() 調用！
  - 默認情況下，它返回一個 hash code。
    ```java
    // 一般來說，System.out.println(Object)，會回傳 hash code
    System.out.println(p1);  // 印出 Point@15db9742
    ```
  - 它可以 `被覆蓋`，以便它返回一個信息字符串。
    ```java
      public class Point {
        ...
        @Override
        public String toString() {
          return "(" + x + ", " + y + ")";
        }
        ...
      }
    ```
    ```java
    System.out.printf("p1 = %s\n", p1);  // 印出 p1 = (10.0, 20.0)
    ```

## 另一個範例：ArrayList（重訪）
  ```java
    import java.util.Arrays;
    import java.util.ArrayList;
    
    public class ArrayListDemo2 {
      public static void main(String[] args) {
        String[] fx1 = {"TWD", "CAD", "JPY"};
        ArrayList<String> fx2 = new ArrayList<>(Arrays.asList(fx1));
        System.out.println(fx2); // Output [TWD, CAD, JPY].
      }
    }
  ```
  - 使用 `Arrays.asList()` 將數組轉換為 `ArrayList` 對象。
  - 好多了！！！

## 子類型 [多型](http://www.javaworld.com/article/3033445/learn-java/java-101-polymorphism-in-java.html)
  - `多型 (polymorphism)` 這個詞的字面意思是 "多種形式"。
  - OOP 設計規則之一是 `將接口(操作介面)與實作分開` 和 `程式抽象`，而不是實現。
    ![image_7-23](./image/image_7-23.png)
    - (GoF（1995 年）。最初的說法是"編程到接口，而不是實現"。)
  - 子類型 多型 滿足這條規則。
  - 如何為不同的實現創建一個 "單一" 接口？
    - 使用這些類型的 `超類` 作為 `佔位符`。

## 範例：依賴減少（解耦）
  ```java
  class HighSchoolStudent {
    void doHomework() {}
  }
  class CollegeStudent {
    void writeFinalReports() {}
  }
  ```
  - 現在讓這兩種學生去學習。

  ```java
  public class PolymorphismDemo {
    public static void main(String[] args) {
      HighSchoolStudent Emma = new HighSchoolStudent();
      goStudy(Emma);

      CollegeStudent Richard = new CollegeStudent();
      goStudy(Richard);
    }

    //------------ method overloading (函數多載) ------------//
    public static void goStudy(HighSchoolStudent student) {
      student.doHomework();
    }

    public static void goStudy(CollegeStudent student) {
      student.writeFinalReports();
    }

    // What if the 3rd kind of students comes into the system?
  }
  ```

## 使用繼承和子類型多型
  ```java
  class Student {
    // 只是先定義好 函數名
    void doMyJob() { /* Do not know the detail yet. */}
  }

  class HighSchoolStudent extends Student {
    void doHomework() {}
    @Override
    void doMyJob() { doHomework(); }
  }

  class CollegeStudent extends Student {
    void writeFinalReports() {}
    @Override
    void doMyJob() { writeFinalReports(); }
  }
  ```

  ```java
  public class PolymorphismDemo {
    public static void main(String[] args) {
      Student Emma = new HighSchoolStudent();
      goStudy(Emma);
      
      Student Richard = new CollegeStudent();
      goStudy(Richard);
    }
    // We can handle all kinds of students in this way!!!
    public static void goStudy(Student student) {
      student.doMyJob();
    }
  }
  ```

• 這個範例說明了 `toString()` 和 `println()` 之間的機制。

## [為什麼是 OOP？](https://en.wikipedia.org/wiki/Programming_paradigm)
  - OOP 是現代（大型）軟件設計的堅實基礎。
  - 特別是，偉大的 `重用機制` 和 `抽象` 是通過這三個概念實現的：
    - `封裝 (encapsulation)` 將內部（私有成員）與外部隔離，實現抽象並提供足夠的可訪問性（公共方法）；
    - `繼承 (inheritance)` 提供方法重寫而不改變方法簽名；
    - `多型 (polymorphism)` 利用超類作為佔位符來操縱實現（子類型對象）。
  - 我們使用 `PIE` 作為這三個概念的簡寫。

  ![image_7-9](./image/image_7-9.png)

  - 這導致了[框架](https://spring.io/) 的產生，它實際上完成了大部分工作，讓（應用程序）程序員只需要用 `業務邏輯規則` 進行定制並提供掛鉤的工作。
  - 這大大減少了編程時間並使創建越來越大的系統成為可能。
  - 在模擬中，我們經常在抽象層次上操作對象；我們在使用它們時不需要知道細節。
    - 例如，使用電腦和手機、駕駛汽車等。

## 另一個範例
  ```java
  class Animal {
    /* Ignore the previous part. */
    void speak() {}
  }

  class Dog extends Animal {
    @Override
    void speak() { System.out.println("Woof! Woof!"); }
  }

  class Cat extends Animal {
    @Override
    void speak() { System.out.println("Meow ̃"); }
  }

  class Bird extends Animal {
    @Override
    void speak() { System.out.println("Tweet!"); }
  }
  ```

  ```java
  public class PolymorphismDemo2 {
    public static void main(String[] args) {
      Animal[] animals = {new Dog(), new Cat(), new Bird()};
      for (Animal animal: animals) {
        animal.speak();   // 動態綁定 (執行當下才知道主體是誰)
      }
    }
  }
  ```
  - 同樣，Animal 是其三個子類型的佔位符。

## [里氏替換原則](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
  - 為方便起見，設 U 為 T 的子類型。
  - `我們通過引用（左側）操作對象（右側）！` `T t = new U();`
  - Liskov 指出，T 型對象可以用 U 型對象替換，而不會改變 T 的任何理想屬性（正確性、執行的任務等）。

## 鑄件
  - Upcasting (向上轉型、加寬轉換；向後兼容性)18 是將U 對象/變數轉換為T 變數。
    ```java
    U u1 = new U(); // Trivial.
    T t1 = u1; // OK.
    T t2 = new U(); // OK.
    ```
  - Downcasting (向下轉型、窄轉換；向前推進) 是將T 變數轉換為U 變數。
    ```java
    U u2 = (U) t2; // 好的，但是很危險。為什麼？
    U u3 = new T(); // 錯誤！為什麼？
    ```

## 解決方案：instanceof
  - 需要並始終允許向上轉型。 （為什麼？）
  - 但是，`向下轉型並不總是正確的，即使您使用轉型運算符也是如此`。
    - 事實上，如果使用任何轉換運算符，編譯時的類型檢查就會變得不可靠。 （為什麼？）
  - 更糟糕的是，一個 T 型變數可以指向所有 U 型變數。
    - 回想一下，T 型變數用作佔位符。
  - 需要運行時類型信息 (Run-time type information)(RTTI) 來解決錯誤：`ClassCastException`。
  - 我們可以使用 `instanceof` 在 `運行時` 檢查引用的對像是否是目標類型。
    ```java
    // 先檢查 是否為 完形鍊關係，是的話 才做強制轉型
    if(trista instanceof Human) {
      ((Human) trista).writeCode();
    }
    ```

## 範例
  ![image_7-10](./image/image_7-10.png)
  - 類繼承可以用 `有向圖`（directed graph）來表示。
    (`子類` 指向 `父類`)
    (可以順著箭頭方向 到達的 表示兩者有繼承關係)
  - 例如，`D` 是 `A` 和 `B` 的子類型，它們都可以從有向圖上的 `D` 到達。

  ```java
  class A {}
  class B extends A {}
  class C extends A {}
  class D extends B {}
  class E extends B {}
  class F extends D {}

  public class InstanceofDemo {
    public static void main(String[] args) {
      Object o = new D();
      System.out.println(o instanceof A); // Output true.
      System.out.println(o instanceof B); // Output true.
      System.out.println(o instanceof C); // Output false.
      System.out.println(o instanceof D); // Output true.
      System.out.println(o instanceof E); // Output false.
      System.out.println(o instanceof F); // Output false.
    }
  }
  ```

## 抽象類
  - `抽象`類是 聲明為`抽象`的類。
  - 通常，`抽象`類 位於類層次結構的頂部，充當佔位符。(例如，抽象工廠模式)
  - `抽象`類可能有一些方法`沒有實現`(方法聲明時不帶大括號，後面跟一個分號。) 並聲明為 `抽象`。
    - 它們是 `抽象` 方法。
    - 如果一個類有一個或多個 `抽象` 方法，那麼這個類本身必須被聲明為 `抽象` 的。
  - 所有抽象類 都不能 實例化。
  - 當繼承一個 `抽象` 類時，編輯器可以幫助您調用每一個 `抽象` 方法。

## 範例
  ![image_7-11](./image/image_7-11.png)
  - 在 UML 中，`抽象` 方法和類用斜體表示。
  - `draw()` 和 `resize()` 方法在 知道具體形狀的情況下 就 可以實現了 (兩者同屬抽象類)。

## final 關鍵詞 (在Java中，關鍵字const是保留的)
  - `final` 變數，是可以初始化一次並且以後不能更改的變數。
    - 編譯器確保您 `只能執行一次`。
    - `final` 變數，通常使用 `static` 關鍵字聲明並被視為常數，例如 Math.PI。
  - `final` 函數是一種 `不能被子類覆蓋的` 函數。
    - 如果一個函數具有不應更改的實現並且它對 Object 的一致狀態至關重要，則您可能希望將其設為 `final` 函數。
  - `final` class類，不能 被繼承。
    - 例如，數學。

## 另一種 IS-A 關係：接口(Interface) 繼承 
  - 不同類型的 Object 應該在 `沒有適當垂直關係的情況下` 一起工作。
  - 例如，考慮從 Animal 繼承的 `Bird` 和從 Transportation 繼承的 `Airplane`。
  - `Bird` 和 `Airplane` 都可以在天空中飛行，比如通過調用 `fly()` 方法。
  - 在語義上，方法 fly() 不能在它們的 父類 中定義。 （為什麼？）

  - 我們希望那些可以飛行的物體通過調用一個API 來飛行，就像 `Student` 的方式一樣。
  - 回想一下，`Object` 是一切的 superclass。
  - 那麼，使用 `Object` 作為佔位符怎麼樣？
    - 並不對。 （為什麼？）
    - 共同父類為 Object，但是在 Object 上加 fly()，還是需要判斷 來源。
    - 並非所有的 Object 都會 fly()
  - 顯然，我們需要一種 `橫向` 關係：`interface`。

  ```java
  public interface Flyable {
    void fly(); // Implicitly public and abstract.
    // 分號 表示 抽象方法
  }
  ```

  ![image_7-12](./image/image_7-12.png)

  使用 `implements` 去引用。

  ```java
  class Animal {}

  class Bird extends Animal implements Flyable {
    void flyByFlappingWings() {
      System.out.println("Flapping wings!");
    }

    @Override
    public void fly() { flyByFlappingWings(); }
  }

  class Transportation {}

  class Airplane extends Transportation implements Flyable {
    void flyByCastingMagic() {
      System.out.println("#$%@$ˆ@!#$!");
    }
    @Override
    public void fly() { flyByCastingMagic();}
  }
  ```

  ![image_7-13](./image/image_7-13.png)

  ```java
  public class InterfaceDemo {
    public static void main(String[] args) {
      Bird owl = new Bird();
      goFly(owl);

      Airplane a380 = new Airplane();
      goFly(a380);
    }
    public static void goFly(Flyable flyableObj) {
      flyableObj.fly();
    }
  }
  ```

  - 同樣，統一的`接口(interface)` 具有多種`實現(implements)`！

## 深入探討接口(Interfaces) (接口定義規格)
  - interface 是 object 和 client 端之間的 `契約`。
  - 如圖所示，`interface 是一種引用類型(reference type)，就像類(class)一樣`。
  - 與類(class)不同，接口(interface)用於定義沒有實現的方法，因此它們 `不能`（直接）實例化。(不能使用 new)
  - 此外，接口(interface) 是 `無狀態的`。(不能宣告變數)
  - 一個類可以通過為每個預定義的簽名提供方法體來實現 `多個接口`。

  - 請注意，一個接口可以擴展另一個接口！
    - 在某種意義上，就像 `契約` 的集合。
  - 例如，`Runnable`、`Callable` (兩者都與 Java 多線程有關)、`Serializable` (用於可以表示為字節序列的對象。這稱為對象序列化。) 和 `Comparable`。
  - 在JDK8 中，我們有如下新特性：
    - 我們可以聲明 `final static` 非空白字段和​​方法；
    - 我們還可以定義已經實現的 `默認` 方法；
    - Java 為 `Stream 框架` 中廣泛使用的 `lambdas` 定義了 `函數式接口`。 （敬請關注 Java Programming 2！）

## 接口(Interfaces) 和 抽象類(Abstract Classes) 的時機
  - 如果你想考慮使用抽象類(Abstract Classes)：
    - 在幾個密切相關的類之間共享代碼，並且
    - 聲明 `非靜態` 或 `非最終字段`。
    
  - 考慮在以下任何情況下使用接口(Interfaces)：
    - 無關聯的class將實現您的接口(Interfaces)；
    - 指定特定數據類型的行為，但不關心誰實現了它的行為；
    - 利用 `多重繼承`。

## 練習：RPG
  ![image_7-14](./image/image_7-14.png)

  - 首先，`Wizard`、`SeaDragon` 和 `Merchant` 是三個角色。
  - 特別是，`Wizard` 通過調用 `attack()` 與 `SeaDragon` 戰鬥。
  - `Wizard` 通過調用 `buyAndSell()` 與 `Merchant` 買賣東西。
  - 但是，`SeaDragon` 不能買賣東西；`Merchant` 不能攻擊他人。

  ![image_7-15](./image/image_7-15.png)

  ```java
  abstract public class Character {}
  ```

  ```java
  public interface Combat {
    void attack(Combat enemy);
  }
  ```

  ```java
  public interface Trade {
    void buyAndSell(Trade counterpart);
  }
  ```

  ```java
  public class Wizard extends Character implements Combat, Trade {
    @Override
    public void attack(Combat enemy) {}
    @Override
    public void buyAndSell(Trade counterpart) {}
  }
  ```
  ```java
  public class SeaDragon extends Character implements Combat {
    @Override
    public void attack(Combat enemy) {}
  }
  ```
  ```java
  public class Merchant extends Character implements Trade {
    @Override
    public void buyAndSell(Trade counterpart) {}
  }
  ```

## HAS-A（委託）與 IS-A（繼承）
• 類繼承是實現代碼重用的一種強大方式。
• 然而，類繼承違反了封裝！
• 這是因為子類的正確功能取決於其超類的實現細節。
• 為解決這個問題，我們贊成委派而不是繼承。25

25GoF (1995);另請參閱 Bloch (2018) 中的第 18 項。

## 範例：策略模式
• 此模式通過封裝每個算法並使它們可互換來定義一系列算法。
• 它涉及以下OO 設計原則：
  • 封裝變化；
  • 接口代碼；
  • 使用委派。

## 特刊：包裝類
  ![image_7-16](./image/image_7-16.png)

## 基元的自動裝箱和拆箱

Java 編譯器自動將基元包裝在相應的類型中，並在適當的地方解開它們。
```java
...
Integer i = 1; // Autoboxing.
Integer j = 2;
Integer k = i + 1; // Autounboxing and then autoboxing.
System.out.println(k); // Output 2.
System.out.println(k == j); // Output true.
Integer m = new Integer(i);
System.out.println(m == i); // Output false? System.out.println(m.equals(i)); // Output true!? ...
```

## 不可變對象
• 如果一個對像在構造後其狀態不能改變，則該對像被認為是不可變的。
• 通常用於值對象。
• 假設有一個存放不可變對象的池。
• 首次創建值對像後，如果需要，將重用該值對象。
• 這意味著當我們對不可變對象進行操作時會創建另一個對象。
• 另一個範例是字符串對象。26
• 使用不可變對像是一種很好的做法
並發編程.27

26請注意，StringBuffer 是 String 對象的可變版本。
27 請參閱 http://www.javapractices.com/topic/TopicAction.do?Id=29。

  ![image_7-17](./image/image_7-17.png)

```java
...
String str1 = "NTU";
String str2 = "ntu";
System.out.println("str1 = " + str1.toLowerCase());
System.out.println("str1 = " + str1);
str1 = str1.toLowerCase();
System.out.println("str1 = " + str1);
System.out.println(str1 == str2); // False?!
System.out.println(str1.equals(str2)); // True!
System.out.println(str1.intern() == str2); // True!!
...
```


• 您可以使用equals() 來檢查文本是否與其他文本相同。
• 您可以使用 intern() 來檢查包含文本與另一個相同的字符串對象的字符串池。 28

28 請參閱 GoF 中的實習模式 (1995)。

## 特刊：枚舉
- 枚舉類型是一組預定義選項的特殊類型。
• 您可以使用靜態方法values() 來枚舉所有選項。
• 這種機制增強了類型安全並使源代碼更具可讀性！

## 範例：顏色
```java
public enum Color {
  RED, BLUE, GREEN;
  public static Color random() {
    Color[] colors = values();
    return colors[(int) (Math.random() * colors.length)];
  }
}
```

• Color 確實是 Enum 的子類，具有三個對 Color 對象的最終和靜態引用，對應於枚舉值。
• 我們還可以為枚舉類型配備靜態方法。

```java
public class EnumDemo {
  public static void main(String[] args) {
    Color crayon color = Color.RED;
    Color tshirt color = Color.random();
    System.out.println(crayon color == tshirt color);
  }
}
```

## 鍛煉
```java
public class PowerMachine {
  private PowerState state;
  public void setState(PowerState state) {
    this.state = state;
  }

  public PowerState getState() { return state; }
}

enum PowerState {
  ON("The power is on."), OFF("The power is off."),
  SUSPEND("The power is low.");
  private String status;
  private PowerState(String str) { status = str; }
}
```

## 枚舉背後？
```java
public enum Action {PLAY, WORK, SLEEP, EAT}
```

```java
public class Action {
  public final static Action PLAY = new Action("PLAY");
  public final static Action WORK = new Action("WORK");
  public final static Action SLEEP = new Action("SLEEP");
  public final static Action EAT = new Action("EAT");

  private final String text;

  public static Action[] values() {
    return new Action[] {PLAY, WORK, SLEEP, EAT};
  }
  private Action(String str) { text = str;}
  // Some functionalities are not listed explicitly.
  // Check java.lang.Enum.
}
```

## 特刊：包、導入和訪問控制
• Java 源文件中的第一條語句（註釋除外）必須是包聲明（如果存在）。
• 包是一組提供訪問保護（如下所示）和命名空間管理的相關類型。

| 範圍\修飾符  | private | (package) | protected | public |
|------------|:-------:|:---------:|:---------:|:------:|
| class內     |    ✓    |     ✓     |     ✓     |   ✓    |
| package內   |    ✕    |     ✓     |     ✓     |   ✓    |
| 繼承class   |    ✕    |     ✕     |     ✓     |   ✓    |
| package外   |    ✕    |     ✕     |     ✕     |   ✓    |

## 範例
```java
package www.csie.ntu.edu.tw;

public class Util {
  void doAction1() {}
  public void doAction2() {}
  protected void doAction3() {}
  public static void doAction4() {}
}
```


• 使用package 表示該類所屬的包。
• 包由文件夾實現。

```java
import www.csie.ntu.edu.tw.Greeting;
public class ImportDemo {
  public static void main(String[] args) {
    Util util = new Util();
    util.doAction1(); // Error!
    util.doAction2(); // OK!
    util.doAction3(); // Error!!
    Util.doAction4(); // OK!!
  }
}
```

• 如您所見，doAction1() 不可見。 （為什麼？）
• 請注意，受保護的成員在繼承下是可見的，
即使分開在不同的包中。

## 範例：有關導入的更多信息
```java
import www.csie.ntu.edu.tw.*; // Import all classes.
import static www.csie.ntu.edu.tw.Util.doAction4;

public class GreetingDemo {
  public static void main(String[] args) {
    Util util = new Util();
    util.doAction2(); // ok!
    Util.doAction4(); // ok!!
    doAction4(); // No need to indicate the class name.
  }
}
```

• 使用通配符(*) 導入包中的所有類。
• 我們也可以只在包中導入靜態成員。

## 特刊：嵌套類
• 嵌套類是其封閉類的成員。
• 嵌套類增加了封裝性，也導致了更多
可讀和可維護的代碼。
• 特別是，密封只在一個地方使用的類是一種很好的做法。

## 嵌套類家族
  ![image_7-18](./image/image_7-18.png)

## 範例：按鍊錶堆疊
![image_7-19](./image/image_7-19.png)

```java
public class LinkedListStack {
  private Node first; // Trait of linked list!

  private class Node {
    String item;
    Node next;
  }

  public String pop() {
    String item = first.item;
    first = first.next; // Deja vu?
    return item;
  }

  public void push(String item) {
    oldfirst = first;
    first = new Node();
    first.item = item;
    first.next = oldfirst;
  }
}
```

```java
public class LinkedListStackDemo {
  public static void main(String[] args) {
    LinkedListStack langs = new LinkedListStack();
    langs.push("Java");
    langs.push("C++");
    langs.push("Python");
    System.out.println(langs.pop()); // Output Python.
    System.out.println(langs.pop()); // Output C++.
    System.out.println(langs.pop()); // Output Java.
  }
}
```
• 請注意方法push() 和pop() 的運行時間為O(1)！
• 輸出顯示 FILO（先進後出）屬性
堆。

## 練習：房子和房間
  ![image_7-20](./image/image_7-20.png)

```java
import java.util.ArrayList;
public class House {
  private ArrayList<Room> rooms = new ArrayList<>();
  private class Room {
    String name;
    
    @Override
    public String toString() { return name; }
  }

  public void add(String name) {
    Room room = new Room();
    room.name = name;
    rooms.add(room);
  }

  @Override
  public String toString() { return rooms.toString(); }
}
```

```java
public class HouseDemo {
  public static void main(String[] args) {
    House home = new House();
    home.add("Living room");
    home.add("Bedroom");
    home.add("Bathroom");
    home.add("Kitchen");
    home.add("Storeroom");
    System.out.println(home);
  }
}
```

## 匿名類
• 匿名類使您能夠同時聲明和實例化類。
• 除了沒有名稱外，它們類似於內部類。
• 如果您只需要一個實例，請使用匿名類
內部類。

## 範例：按鈕
```java
abstract class Button {
  abstract void onClicked();
}
public class AnonymousClassDemo1 {
  public static void main(String[] args) {
    Button btnOK = new Button() {
      @Override
      public void onClicked() {
        System.out.println("OK");
      }
    };
    btnOK.onClicked();
  }
}
```

## 練習：再飛一次
```java
public class AnonymousClassDemo2 {
  public static void main(String[] args) {
    Flyable butterfly = new Flyable() {
      @Override
      public void fly() { /* ... */ }
    };
    butterfly.fly();
  }
}
```
• 我們可以使用匿名類為一個接口實例化對象。

## 特刊：迭代器模式
• 迭代器是一種簡單且標準的接口，用於枚舉數據結構中的元素。
• 在 Java 中，我們現在繼續揭示 for-each 循環的機制：
• 一個實現接口Iterable 的類應該提供方法iterator() 的細節。
• 方法iterator() 應該返回一個由接口Iterator 定義的迭代器，它有兩個未實現的方法：hasNext() 和next()。
• 現在您的數據結構可以與for-each 循環兼容！

## 範例
```java
import java.util.Iterator;
class Box implements Iterable<String> {
  String[] items = {"Java", "C++", "Python"};
  public Iterator<String> iterator() {
    return new Iterator<String>() {
      private int ptr = 0;
      public boolean hasNext() { return ptr < items.length; }
      public String next() { return items[ptr++]; }
    };
  }
}
```

```java
public class IteratorDemo {
  public static void main(String[] args) {
    Box books = new Box();
    // for−each loop
    /*
    for (String book: books) {
                System.out.println(book);
    }
    */
    Iterator iter = books.iterator();
    while (iter.hasNext())
      System.out.println(iter.next());
  }
}
```

## 靜態嵌套類
• 靜態嵌套類是聲明為靜態的封閉類。
• 請注意，只有嵌套類可以是靜態的。
• 作為靜態成員，它可以訪問其他靜態成員而無需實例化封閉類。
• 特別是，可以直接實例化靜態嵌套類，而無需先實例化封閉類對象；它就像一個迷你包。

## 範例
```java
public class StaticClassDemo {
  public static class Greeting {
    @Override
    public String toString() {
      return "This is a static class.";
    }
  }
  public static void main(String[] args) {
    System.out.println(new StaticClassDemo.Greeting());
  }
}
```

## 相關連結

- [對象和內存分配](https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1152/lectures/Memory.pdf)、[本地檔案](./data/Memory.pdf)
- [物件導向編輯程序精華](https://www.csie.ntu.edu.tw/~htlin/course/oop13spring/doc/EssentialOOP)、[本地檔案](./data/EssentialOOP.pdf)
- [繼承和多型](http://enos.itcollege.ee/~jpoial/java/naited/RelationBetweenClasses_slides.pdf)、[本地檔案](./data/RelationBetweenClasses_slides.pdf)