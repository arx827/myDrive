## JDK 設定
### Windows 安裝方式
  - [下載JDK - windows](https://www.oracle.com/tw/java/technologies/downloads/#java8-windows)
  - 安裝 到 合適的位置，例如 D:\development-tool\目錄下
  - 使用 [搜尋] 來尋找您的帳戶的環境變數
  - 新增「 JAVA_HOME 」，值為 D:\development-tool\<資料夾名稱>
  - 編輯「 Path 」，新增 %JAVA_HOME%\bin
  - 按下確定，存儲所有設定
  - 測試是否成功：
    ```bash
    查詢 Java 版號
    javac -version 
    
    # 會產生以下訊息
    javac 1.8.0_42
    ```

### Mac 安裝方式
  - [下載JDK - mac](https://www.oracle.com/tw/java/technologies/downloads/#java8-mac)
  - 安裝
  - 確認 Java 是否已安裝，在 Terminal 輸入：
    ```bash
    java -version
    ```
  - 如果 Java 已安裝，可以看到類似以下輸出
    ```bash
    java version "1.8.0_361"
    Java(TM) SE Runtime Environment (build 1.8.0_361-b09)
    Java HotSpot(TM) 64-Bit Server VM (build 25.361-b09, mixed mode)
    ```
  - 確認JAVA_HOME路徑：在Terminal中輸入以下命令
    ```bash
    /usr/libexec/java_home
    ```
    應該會看到類似以下的輸出：
    ```java
    /Library/Java/JavaVirtualMachines/jdk1.8.0_361.jdk/Contents/Home
    ```
    這是Java的安裝路徑，請將其複製以供稍後使用。
  - 設定 JAVA_HOME 環境變數：在Terminal中輸入以下命令：
    ```bash
    export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_361.jdk/Contents/Home
    ```
    將路徑替換 為 步驟2中複製 的 路徑。
  - 更新 PATH 環境變數：在Terminal中輸入以下命令：
    ```bash
    export PATH=$JAVA_HOME/bin:$PATH
    ```
  - 確認環境變數是否正確設定：在Terminal中輸入以下命令：
    ```sh
    echo $JAVA_HOME
    echo $PATH
    ```

    您應該會看到類似以下的輸出：

    ```sh
    /Library/Java/JavaVirtualMachines/jdk1.8.0_361.jdk/Contents/Home
    /Library/Java/JavaVirtualMachines/jdk1.8.0_361.jdk/Contents/Home/bin:/Users/b1060/.nvm/versions/node/v16.19.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/sbin
    ```

    如果顯示與您剛才設定的路徑不同，請檢查並重新設定環境變數。

## Intellij 安裝
