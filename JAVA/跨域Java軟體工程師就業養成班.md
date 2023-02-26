# JAVA 程式語言

### Java 簡介
  - #### Java語言的特性
    - ##### 簡單
      - Java 是 `C like` 語言，表示很多語法是繼承C的精神，但是Java不採用C的指標來操控記憶體位置。
      - C語言中記憶體的使用宣告及釋放必須完全由程式控制，Java則採用了「Garbage Collection」來回收不需使用的記憶體。
    - ##### 物件導向
      『 **繼承** 』、『 **封裝** 』、『 **多型** 』
    - ##### 跨平台性
      Java可以在不同的作業系統上執行，而且『無需重新編譯』。

  - #### Java技術種類
    - ##### Java SE
      Java Standard Edition **標準版**
      通常用來開發桌上型視窗程式或者簡易的指令程式。
    - ##### Java EE
      Java Enterprise Edition **企業版**
      主要用來開發網站伺服器端程式。
    - ##### Java ME
      Java Micro Edition **開發手持設備**
      在實用性上無法跟 Android 比。

  - #### Compile 編譯
    - 利用 `%JAVA_HOME%/bin/jabac.exe` 進行編譯
    - 步驟
      - 開啟 `cmd.exe`
      - 進入 `HelloWorld.java` 的目錄，例如 `cd C:\Java`
      - 語法： `Javac source_file`
      - 範例： `Javac HelloWorld.java`
    - 編譯完會產生 `HelloWorld.class`
      - C語言編譯完直接產生 `machine code` ，可以直接在作業系統上執行，但不同作業系統則需 『重新編譯』。
      - `Java` 編譯產生副檔名為 `class` 的檔案，並不能直接在作業系統上執行，class檔中含有俗稱的 `bytecodes`，為一種可以在 `JVM` 特殊環境中被執行的碼， `Oracle` 針對不同作業系統有提供相對應的JVM環境可以執行class。
    - 可以指定產生 `class` 的目錄
      - 例如：`javac -d C:\compile HelloWorld.java` ，表示產生的class會在 `C:\compile\HelloWorld.class`。

  - #### 執行Java
    - 執行Java指令：`java {main方法的類別名稱}`
      - 範例：java HelloWorld ~~.java~~ [註]沒有.java，執行時是類別名稱。
        如果 `HelloWorld.class` 在目前的cmd的當前目錄下，可以不用加任何參數。
    - 如果 `HelloWorld.class` 並不在目前的cmd的當前目錄下，可以利用 `-cp` 指定class位置，例如：class位置在C:\java\HelloWorld.class
      java -cp c:\Java Hello World
      - -cp：為 `-classpath` 的縮寫，表示class的路徑(path)，也就是指定class檔案的目錄，如果有多個class且散在不同目錄下，可以用 `;` 區隔(linux上為`:`)，如果省略則預設為當前cmd中的目錄。
      - `HelloWorld` 為 class的名稱，『無需加上`.class`，或者`.java`』

  - #### JRE (Java Runtime Environment)
    **JDK 一定會包含一個 JRE**
    - `JRE` 包含一個 Java虛擬機器 `JVM`(Java Virtual Machine)，以及標準的類別函式庫(Java SE API，ex: System.out.printIn)。
    - 不同的作業系統中執行必須安裝相對應的 `JVM` 版本，class檔案則可以在 `JVM` 中執行。以達到 `Write once run anywhere`

  - #### 標準的類別函式庫 (Java SE API)
    - 標準函式庫由Oracle工程師開發，提供程式語言基本的型別及類別，讓開發人員可以馬上利用，加速程式開發。
    - 通常在描述函式庫，有一些別名，意思都是相近
      - API (Application Programming Interface)
      - Library
      - Framework
      - SDK

  - #### 程式基本架構
    每個類別中，可以定義自己的屬性及方法
    ```java
      public class HelloWorld {
        public static void main(String[] args) {
          System.out.println("Hello World");
        }
      }
    ```
    - **public**：modifier：公開給其他類存取
    - **HelloWorld**：類別名稱
    - **void**：無回傳值
    - **main**：方法名稱
    - **args**：方法參數

  - #### 註解
    - 程式中可以利用以下方式做註解，註解通常用來說明程式，註解部分不會被編譯、不為程式邏輯的一部分。
      ```java 
      // 雙斜線，單行註解
      ```
      ```java
      /*
        斜線星號開頭，星號斜線結尾 為 多行註解
      */
      ```

  - #### 程式執行
    - JVM啟動執行時，會執行命令列中的 `class` (HelloWorld.class)，並尋找class中的 `public static void main` 方法，執行方法中的程式。
    - main方法包含兩個重要的 `modifier`(修飾詞) public static，缺一不可。
    - main方法無回傳值，`void` 表示無回傳值。
    - 每一隻Java程式(.java)
      - **類別名稱必須跟檔名一致**
      - **不一定會有main方法**
      - 多個Java程式可以組合成一個應用程式，執行時會只有於指令列中指定的類別 (java HelloWorld) 中的 `main()` 會被執行，作為整個應用程式的起點。
  
### Eclipse開發工具的介紹與使用
  - #### 下載 Eclipse zip
    - http://www.eclipse.org/downloads/eclipse-packages/
      - 下載Eclipse IDE for Java Developers
      - 如果後面課程有教授Servlet、Jsp才下載Java EE Developers
      - 解壓縮至c:\eclipse
      - [註]課堂我們使用OpenJDK8跟2020-06版本。如果要裝最近的Eclipse，請參考附錄2
  
  - #### Workspace
    - 一個workspace為一個實體目錄。可以建置多個專案。
    - 相關的Java專案可以放在同一個workspace中。
    - 左下角的 Use this as default xxx，不要勾，方便切換至其他目錄。

  - #### 設定 Source
    - 開發過程中我們會需要快速查詢使用的JDK程式，可以在eclipse中設定Source來源，方便切換至JDK的原始碼。
    - JDK安裝中有附src.zip，包含了『java原始碼』及javadoc。
    - 預設位置C:\Program Files\JDK8\src.zip

  - #### 設定編碼
    Preferences > General > Workspace
    Text file encoding 選 Other UTF-8

  - #### 產生Java Project
    File > New > Java Project

  - #### 確認使用正確的JavaSE xx 版本，按下Finish
    - Create a Java Project
    - 輸入 Project name
    - JRE 選擇 Use an execution environment JRE: JavaSE-1.8

  - #### 新增 class
    - 找到 New Java Class 按鈕
    - 輸入 class Name
    - 勾選 Public static void main(String[] args)，產生 main 方法

  - #### 執行 Java 程式
    - 程式檔案上按右鍵 > Run As > Java Application。
    - Toolbar 上按執行鍵，選擇要執行的應用程式。

  - #### Perspective
    - 開發過程中可以透過不同『視角』來檢視檔案，常用的有兩個
      - Java perspective
      - Debug perspective

  - #### 重設 Perspective 視窗排列
    - 每一個Perspective會有自己的視窗棑列
    - 可以自行移除或者重新編排Perspective中的視窗
    - 如果編排過程中有問題，可以Reset回復原始設定集值

  - #### Java Perspective
    - 主要用來編輯Java程式
    - `alt + /` 可以用來輔助程式開發的提示，
      - 例如 main (`alt + /`)可以帶出main方法
      - sysout 可以帶出 `System.out.println()`
    - `ctrl + /` 註解該行程式
    - `alt + 上 下`，搬動程式上下移動
    - `ctrl + alt + 下` 複製該行程式
    - 執行main方法，`ctrl + F11`

  - #### Java Compile
    - eclipse 會自動 compile java 程式，class檔 預設會放在專案下的 bin 目錄。
      - 例如 `bin/HelloWorld.class`
    - 可以利用專案偏好設定修改輸出位置，位於 `Java Build Path`。
    - 匯出檔案：File > expert > 選擇要匯出的檔案 (preferences) > 選擇資料夾
  
  - #### Java 編輯字型修改
    - 系統偏好設定中可以設定字型
    - 編輯區文字大小設定，輸入 `font`，在 `Java/ java Editor Text Font`
    - Window > Preferences > 搜尋 `font` > Colors and Fonts > Java > java Editor Text Font

  - #### Console 字型修改
    - 系統偏好設定中可以設定字型
    - 編輯區文字大小設定，輸入 `font`，在 `Debug/ Console font`
    - Window > Preferences > 搜尋 `font` > Colors and Fonts > Debug > Console font
  
  - #### 『重要』Auto Completion
    - Eclipse 會幫助編輯程式，自動帶出符合的程式，稱為 `Auto Completion`
    - Windows > Preferences > Java > Editor > Content Assist 中設定以下字觸發自動完成
      - 在 Auto Activation
        - 勾選 Enable auto activation
        - 在 Auto activation triggers for Java 輸入
          `.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_`

### 基本資料型別 (Primitive Data Types)
  - #### 整數
    - ##### 變數宣告
    - ##### 變數命名規格
    - ##### 基本型別宣告
    - ##### byte 怎麼計算？ 1 byte = 8 bit
    - ##### 相加
    - ##### 資料溢位 (Overflow)
  - #### 浮點數
  - #### char boolean
    - ##### 基本型別宣告
    - #### 跳脫字元
    - ##### 保留字
    - ##### Local Variable (區域變數)
    - ##### Operators (運算子)
    - ##### 算術運算子
    - ##### Binary Numeric Promotion 二元數字運算晉升
    - ##### 晉升(Promotion)與型別轉換(Casting)
    - ##### Comparison Operators (比較運算子)
    - ##### Conditional Operators (條件運算)
    - ##### 真假值
    - ##### Bitwise Operators (位元運算子)
    - ##### 遞增、遞減運算
    - ##### Assignment Operators (指定運算)
    - ##### Conditional Operator `?:` (三元運算)
    - ##### 運算優先順序 (Operator Precedence)

### 流程控制
### 迴圈
### Debug
### 類別Class 及 物件Object
### Package套件 & JAR
### String字串
### 陣列
### 方法
### Pass By Value
### 封裝
### 建構方法 Constructor
### 繼承
### 修飾子
### 多型
### 介面
### 匿名類別
### Object類別
### 例外處理
### 集合 Collection
### 泛型 Generic
### IO
### 附錄一：JDK安裝
  - #### Open JDK
    - ##### Redhat網站下載
      google redhat openjdk download
    - ##### https://developers.redhat.com/products/openjdk/download/

  - #### Open JDK 其他選擇
    - ##### Zulu OpenJDK
    - ##### ojdkbuild
      - ###### https://github.com/ojdkbuild/ojdkbuild
  
  - #### 解壓縮至 C:\Program Files
    1. 解壓縮全部
    2. 選 C:\Program Files

  - #### 修改資料夾名稱為 `JDK8`
  
  - #### 系統環境變數
    1. 控制台 > 系統及安全性 > 系統
    2. 進階系統設定
    3. 環境變數

  - #### 設定 `JAVA_HOME`
    1. 新增系統變數
    2. 變數名稱(N)：`JAVA_HOME`
    3. 變數值(V)：`C:\Program Files\JDK8`

  - #### 設定 `JAVA_HOME/bin` 到 `Path` 變數
    1. 系統變數
    2. 編輯 Path (Path變數為系統搜尋執行檔的位置)
    3. 變數值：
      新增 `%JAVA_HOME%\bin` (注意前後有%)

  - #### java - version
    - 打開 `cmd.exe` 執行 `java-version` 檢查版本
    - 打開 `cmd.exe` 執行 `where java` 檢查Java路徑

  - #### 顯示副檔名
    取消 『 **隱藏已知檔案類型的副檔名** 』
    1. 檢視
    2. 選項
    3. 檢視 > 取消勾選 隱藏已知檔案類型的副檔名
    4. 套用
  
### 附錄二：Eclipse新版安裝
  使用舊的JDK環境
  - #### Eclipse 2020-09
    - 2020-09之後版本的`eclipse`需要`JDK11`以上的版本才能啟動。
    - 可以使用 `Eclipse installer` 而不要下載`zip`檔的`eclipse`，會自動安裝 `jre` 供 `eclipse` 啟動。但安裝時間會比較久。https://www.eclipse.org/downloads/packages/

    - 安裝時，選擇 `Eclipse IDE for Enterprise java Developers` (Enterprise版本)
      1. 選擇 JDK 版本
      2. 設定安裝eclipse位置
      3. 執行 `Install`

    - 安裝完後，Eclipse會預設以所選的JDK版本啟動。環境預設執行專案也是所選的JDK版本。
    - 如果要以其他JDK版本執行專案，必須再另外設定。

    - 偏好設定中 Java/Installed JREs
      要新增JDK8的環境，目前圖示是eclipse附設安裝的jre 
      1. 開啟設定 (Preferences)
      2. Java > 
      3. Installed JREs >
      4. Add

    - 選擇 `Standard VM`
    - 選擇 `JDK8` 的目錄按下 `Finish`
      - JRE home：`C:\Program Files\JDK8`
      - JRE name：`JDK8`

    - 打勾 剛新增的 `JDK8`，表示預設使用這個版本的JDK

  - #### 產生Java Project
    Create a Java Project
    JRE 選擇 `Use a project specific JRE:` `JDK8`