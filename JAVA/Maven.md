# Maven
<small>[菜鳥教程](https://www.runoob.com/maven/maven-tutorial.html)</small>

是 Apache 下的一個純 Java 開發的開源項目。
基於項目對像模型（縮寫：POM）概念，
Maven 利用一個中央信息片斷能管理一個項目的構建、報告和文檔等步驟。
Maven 是一個項目管理工具，可以對 Java 項目進行構建、依賴管理。
Maven 也可被用於構建和管理各種項目，例如C#，Ruby，Scala 和其他語言編寫的項目。

## Maven 教程
- ### Maven 功能
  - 構建
  - 文檔生成
  - 報告
  - 依賴
  - SCMs
  - 發布
  - 分發
  - 郵件列表

- ### 約定配置
  |目錄                                |目的                                                          |
  |:----------------------------------|:-------------------------------------------------------------|
  |${basedir}                         | 存放 `pom.xml` 和所有的子目錄                                   |
  |${basedir}/src/main/java           | 項目的 java 源代碼                                             |
  |${basedir}/src/main/resources      | 項目的資源，比如說 `property 文件`，`springmvc.xml`              |
  |${basedir}/src/test/java           | 項目的測試類，比如說 `Junit` 代碼                                |
  |${basedir}/src/test/resources      | 測試用的資源                                                   |
  |${basedir}/src/main/webapp/WEB-INF | web應用文件目錄，web項目的信息，比如存放web.xml、本地圖片、jsp視圖頁面|
  |${basedir}/target                  | 打包輸出目錄                                                   |
  |${basedir}/target/classes          | 編譯輸出目錄                                                   |
  |${basedir}/target/test-classes     | 測試編譯輸出目錄                                                |
  |Test.java                          | Maven 只會自動運行符合該命名規則的測試類                           |
  |~/.m2/repository                   | Maven 默認的本地倉庫目錄位置                                     |

- ### Maven 特點
  - 項目設置遵循統一的規則。
  - 任意工程中共享。
  - 依賴管理包括自動更新。
  - 一個龐大且不斷增長的庫。
  - 可擴展，能夠輕鬆編寫 Java 或 腳本語言 的插件。
  - 只需很少或不需要額外配置即可即時訪問新功能。
  - **基於模型的構建** − Maven 能夠將任意數量的項目構建到預定義的輸出類型中，如 JAR，WAR 或基於項目元數據的分發，而不需要在大多數情況下執行任何腳本。
  - **項目信息的一致性站點** − 使用與構建過程相同的元數據，Maven 能夠生成一個網站或PDF，包括您要添加的任何文檔，並添加到關於項目開發狀態的標準報告中。
  - **發布管理和發佈單獨的輸出** − Maven 將不需要額外的配置，就可以與源代碼管理系統（如 Subversion 或 Git）集成，並可以基於某個標籤管理項目的發布。它也可以將其發佈到分發位置供其他項目使用。Maven 能夠發佈單獨的輸出，如 JAR，包含其他依賴和文檔的歸檔，或者作為源代碼發布。
  - **向後兼容性** − 您可以很輕鬆的從舊版本 Maven 的多個模塊移植到 Maven 3 中。
  - 子項目使用父項目依賴時，正常情況子項目應該繼承父項目依賴，無需使用版本號，
  - **並行構建** − 編譯的速度能普遍提高 20 - 50 %。
  - **更好的錯誤報告** − Maven 改進了錯誤報告，它為您提供了 Maven wiki 頁面的鏈接，您可以點擊鏈接查看錯誤的完整描述。

---

## Maven 環境配置
  Maven 是一個基於Java 的工具，所以要做的第一件事情就是安裝 `JDK`。
  可以參考 [Java 開發環境配置](https://www.runoob.com/java/java-environment-setup.html)。

- ### 系統要求
  |項目    |要求                                                                                           |
  |:----- |:----------------------------------------------------------------------------------------------|
  |JDK    | Maven 3.3 要求 JDK 1.7 或以上<br>Maven 3.2 要求 JDK 1.6 或以上<br>Maven 3.0/3.1 要求 JDK 1.5 或以上|
  |儲存空間| Maven 自身安裝需要大約 10 MB 空間。除此之外，額外的磁盤空間將用於你的 本地 Maven 倉庫。你本地倉庫的大小取決於使用情況，但預期至少 `500 MB`|

- ### 檢查Java 安裝
  |操作系統| 任務        | 命令                    |
  |:----- |:---------- |:-----------------------|
  |Windows|打開命令控制台|`c : \> java - version `|
  |Linux  |打開命令終端  |`# java -version `      |
  |Mac    |打開終端     |`$ java - version `     |

- ### Maven 下載
  Maven 下載地址：http://maven.apache.org/download.cgi
  ![image1](./image_1.png)
  - #### 不同平台下載對應的包
    |系統    | 包名                          |
    |:----- |:----------------------------- |
    |Windows| apache-maven-3.3.9-bin.zip    |
    |Linux  |	apache-maven-3.3.9-bin.tar.gz |
    |Mac    |	apache-maven-3.3.9-bin.tar.gz |

  - #### 下載包後解壓到對應目錄
    |系統    | 包名                          |
    |:----- |:----------------------------- |
    |Windows| E:\Maven\apache-maven-3.3.9   |
    |Linux  |	/usr/local/apache-maven-3.3.9 |
    |Mac    |	/usr/local/apache-maven-3.3.9 |

- ### 設置Maven 環境變數
  添加環境變數MAVEN_HOME：

  <table>
    <thead>
      <tr>
        <th>系統</th>
        <th>配置</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Windows</td>
        <td>
          <p>右鍵"計算機"，選擇"屬性"，之後點擊"高級系統設置"，點擊"環境變數"，來設置環境變數，</p>
          <p>有以下系統變數需要配置：新建系統變數MAVEN_HOME，變數值：E:\Maven\apache-maven-3.3.9</p>
          <image src="./image_2.png"/>
          <p>編輯系統變數Path，添加變數值：;%MAVEN_HOME%\bin</p>
          <image src="./image_3.png"/>
          注意：注意多個值之間需要有分號隔開，然後點擊確定。
        </td>
      </tr>
      <tr>
        <td>Linux</td>
        <td>
          <p>下載解壓：</p>
          <p># wget http://mirrors.hust.edu.cn/apache/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz # tar -xvf apache-maven-3.3.9-bin.tar.gz # sudo mv -f apache-maven-3.3.9 /usr/local/</p>
          <p>編輯/etc/profile文件sudo vim /etc/profile，在文件末尾添加如下代碼：</p>
          <p>export MAVEN_HOME = /usr/ local / apache - maven - 3.3 . 9 export PATH = $ { PATH }: $ { MAVEN_HOME }/ bin</p>
          <p>保存文件，並運行如下命令使環境變數生效：</p>
          <p># source /etc/profile</p>
          <p>在控制台輸入如下命令，如果能看到Maven 相關版本信息，則說明Maven 已經安裝成功：</p>
          <p># mvn -v</p>
        </td>
      </tr>
      <tr>
        <td>Mac</td>
        <td>
          <p>下載解壓：</p>
          <p>$ curl - O http : //mirrors.hust.edu.cn/apache/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz </p>
          <p>$ tar - xvf apache - maven - 3.3 . 9 - bin . tar . gz</p>
          <p>$ sudo mv - f apache - maven - 3.3 . 9 / usr / local / </p>
          <p>編輯/etc/profile文件sudo vim /etc/profile，在文件末尾添加如下代碼：</p>
          <p>export MAVEN_HOME = /usr/ local / apache - maven - 3.3 . 9 export PATH = $ { PATH }: $ { MAVEN_HOME }/ bin</p>
          <p>保存文件，並運行如下命令使環境變數生效：</p>
          <p>$ source / etc / profile</p>
          <p>在控制台輸入如下命令，如果能看到Maven 相關版本信息，則說明Maven 已經安裝成功：</p>
          <p>$ mvn - v</p>
          <p>Apache Maven 3.3 . 9 ( bb52d8502b132ec0a5a3f4c09453c07478323dc5 ; 2015 - 11 - 11T00 : 41 : 47 + 08 : 00 ) Maven home : /usr/ local / apache - maven - 3.3 . 9 Java version : 1.8 . 0_31 , vendor : Oracle Corporation Java home</p>  
          <p>: /Library/ Java / JavaVirtualMachines / jdk1 . 8.0 _31 . jdk / Contents / Home / jre
            Default locale : zh_CN , platform encoding : ISO8859 - 1 
            OS name : "mac os x" , version : "10.13.4" , arch : "x86_64" , family : "mac"     </p>
        </td>
      </tr>
    </tbody>
  </table>
---

## Maven POM
  POM ( Project Object Model，項目對像模型 ) 是 Maven 工程的基本工作單元，是一個XML文件，
  包含了項目的基本信息，用於描述項目如何構建，聲明項目依賴，等等。

  執行任務或目標時，Maven 會在當前目錄中查找POM。
  它讀取POM，獲取所需的配置信息，然後執行目標。
  
  POM 中可以指定以下配置：
  - 項目依賴
  - 插件
  - 執行目標
  - 項目構建profile
  - 項目版本
  - 項目開發者列表
  - 相關郵件列表信息

  在創建POM 之前，我們首先需要描述項目組(groupId), 項目的唯一ID。
  ```xml
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    
    <!-- 模型版本 -->
    <modelVersion> 4.0.0 </modelVersion>

    <!-- 公司或者組織的唯一標誌，並且配置時生成的路徑也是由此生成，
    如com.companyname.project-group，
    maven會將該項目打包成的jar放本地路徑：/com/companyname/project-group -->
    <groupId> com.companyname.project-group </groupId>
      
    <!--項目的唯一ID，一個groupId下面可能多個項目，就是靠artifactId來區分的--> 
    <artifactId> project </artifactId>
    
    <!--版本號-->
    <version> 1.0 </version> 

  </project>
  ```
    
  所有 POM 文件都需要 project 元素和三個必需字段：`groupId`，`artifactId`，`version`。

  |節點    | 描述                          |
  |:----- |:----------------------------- |
  |project| 工程的根標籤。    |
  |modelVersion  | 模型版本需要設置為4.0。|
  |groupId    |	這是工程組的標識。它在一個組織或者項目中通常是唯一的。例如，一個銀行組織com.companyname.project-group 擁有所有的和銀行相關的項目。 |
  |artifactId    |	這是工程的標識。它通常是工程的名稱。例如，消費者銀行。groupId 和artifactId 一起定義了artifact 在倉庫中的位置。 |
  |version    |	這是工程的版本號。在artifact 的倉庫中，它用來區分不同的版本。 |

- ### 父（Super）POM
  父（Super）POM 是 Maven 默認的 POM。所有的 POM 都繼承自一個父 POM（無論是否顯式定義了這個父 POM ）。
  父 POM 包含了一些可以被繼承的默認設置。因此，當 Maven 發現需要下載 POM 中的依賴時，它會到 Super POM 中配置的默認倉庫http://repo1.maven.org/maven2 去下載。

  Maven 使用 effective pom（ Super pom 加上工程自己的配置 ）來執行相關的目標，它幫助開發者在 pom.xml 中做盡可能少的配置，當然這些配置可以被重寫。

  - 使用以下命令來查看Super POM 默認配置：
  ```xml
  mvn help : effective - pom
  ```

  接下來我們創建目錄 `MVN/project`，在該目錄下創建pom.xml，內容如下：
  ```xml
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    
    <!--模型版本-->
    <modelVersion> 4.0.0 </modelVersion>
    
    <!-- 公司或者組織的唯一標誌，並且配置時生成的路徑也是由此生成，
    如com.companyname.project-group，
    maven會將該項目打包成的jar放本地路徑：/com/companyname/project-group -->
    <groupId> com.companyname.project-group </groupId>
    
    <!--項目的唯一ID，一個groupId下面可能多個項目，就是靠artifactId來區分的-->
    <artifactId> project </artifactId>
    
    <!--版本號-->
    <version> 1.0 </version>
  
  </project>
  ```

  在命令控制台，進入 `MVN/project` 目錄，執行以下命令：
  ```bash
  C : \MVN\project> mvn help : effective - pom
  ```

  Maven 將會開始處理並顯示 effective-pom。
  ```xml
  [ INFO ] Scanning for projects ... Downloading : https : //repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-clean-plugin/2.5/maven-clean-plugin-2.5.pom ...
  [ INFO ] ------------------------------------------------------------------------
  [ INFO ] BUILD SUCCESS
  [ INFO ] ------------------------------------------------------------------------
  [ INFO ] Total time : 01 : 36 min
  [ INFO ] Finished at : 2018 - 09 - 05T11 : 31 : 28 + 08 : 00
  [ INFO ] Final Memory : 15M / 149M
  [ INFO ] ------------------------------------------------------------------------
  ```

  Effective POM 的結果就像在控制台中顯示的一樣，經過繼承、插值之後，使配置生效。
  ```xml
  <? xml version = " 1.0 " encoding = " UTF-8 " ?>
  <!-- ================================================================= -->
  <!-- -->
  <!-- Generated by Maven Help Plugin on 2012-07-05T11:41:51              -->
  <!-- See: http://maven.apache.org/plugins/maven-help-plugin/            -->
  <!-- -->
  <!-- ================================================================= -->
  <!-- ================================================================= -->
  <!-- -->
  <!-- Effective POM for project                                          -->
  <!-- 'com.companyname.project-group:project-name:jar:1.0'               -->
  <!-- -->
  <!-- ================================================================= -->
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/ 2001/XMLSchema-instance " xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion> 4.0.0 </modelVersion>
      <groupId> com.companyname.project-group </groupId>
      <artifactId> project </artifactId>
      <version> 1.0 </version>
      <build>
        <sourceDirectory> C:\MVN\project\src\main\java </sourceDirectory>
        <scriptSourceDirectory> src/main/scripts </scriptSourceDirectory>
        <testSourceDirectory> C:\MVN\project\src\test\java </testSourceDirectory>
        <outputDirectory> C:\MVN\project\target\classes </outputDirectory>
        <testOutputDirectory> C:\MVN\project\target\test-classes </testOutputDirectory>
        <resources>
          <resource>
            <mergeId> resource-0 </mergeId>
            <directory> C:\MVN\project\src\main\resources </directory>
          </resource>
        </resources>
        <testResources>
          <testResource>
            <mergeId> resource-1 </mergeId>
            <directory> C:\MVN\project\src\test\resources </directory>
          </testResource>
        </testResources>
        <directory> C:\MVN\project\target </directory>
        <finalName> project-1.0 </finalName>
        <pluginManagement>
          <plugins>
            <plugin>
              <artifactId> maven-antrun-plugin </artifactId>
              <version> 1.3 </version>
            </plugin>
            <plugin>
              <artifactId> maven-assembly-plugin </artifactId>
              <version> 2.2-beta-2 </version>
            </plugin>
            <plugin>
              <artifactId> maven-clean-plugin </artifactId>
              <version> 2.2 </version>
            </plugin>
            <plugin>
              <artifactId> maven-compiler-plugin </artifactId>
              <version> 2.0.2 </version>
            </plugin>
            <plugin>
              <artifactId> maven-dependency-plugin </artifactId>
              <version> 2.0 </version>
            </plugin>
            <plugin>
              <artifactId> maven-deploy-plugin </artifactId>
              <version> 2.4 </version>
            </plugin>
            <plugin>
              <artifactId> maven-ear-plugin </artifactId>
              <version> 2.3.1 </version>
            </plugin>
            <plugin>
              <artifactId> maven-ejb-plugin </artifactId>
              <version> 2.1 </version>
            </plugin>
            <plugin>
              <artifactId> maven-install-plugin </artifactId>
              <version> 2.2 </version>
            </plugin>
            <plugin>
              <artifactId> maven-jar-plugin </artifactId>
              <version> 2.2 </version>
            </plugin>
            <plugin>
              <artifactId> maven-javadoc-plugin </artifactId>
              <version> 2.5 </version>
            </plugin>
            <plugin>
              <artifactId> maven-plugin-plugin </artifactId>
              <version> 2.4.3 </version>
            </plugin>
            <plugin>
              <artifactId> maven-rar-plugin </artifactId>
              <version> 2.2 </version>
            </plugin>
            <plugin>
              <artifactId> maven-release-plugin </artifactId>
              <version> 2.0-beta-8 </version>
            </plugin>
            <plugin>
              <artifactId> maven-resources-plugin </artifactId>
              <version> 2.3 </version>
              </plugin>
            <plugin>
              <artifactId> maven-site-plugin </artifactId>
              <version> 2.0-beta-7 </version>
            </plugin>
            <plugin>
              <artifactId> maven-source-plugin </artifactId>
              <version> 2.0.4 </version>
            </plugin>
            <plugin>
              <artifactId> maven-surefire-plugin </artifactId>
              <version> 2.4.3 </version>
            </plugin>
            <plugin>
              <artifactId> maven-war-plugin </artifactId>
              <version> 2.1-alpha-2 </version>
            </plugin>
          </plugins>
        </pluginManagement>
        <plugins>
          <plugin>
            <artifactId> maven-help-plugin </artifactId>
            <version> 2.1.1 </version>
          </plugin>
        </plugins>
      </build>
      <repositories>
        <repository>
          <snapshots>
            <enabled> false </enabled>
          </snapshots>
          <id> central </id>
          <name> Maven Repository Switchboard </name>
          <url> http://repo1.maven.org/maven2 </url>
        </repository>
      </repositories>
      <pluginRepositories>
        <pluginRepository>
          <releases>
            <updatePolicy> never </updatePolicy>
          </releases>
          <snapshots>
            <enabled>false </enabled>
          </snapshots>
          <id> central </id>
          <name> Maven Plugin Repository </name>
          <url> http://repo1.maven.org/maven2 </url>
        </pluginRepository>
      </pluginRepositories>
      <reporting>
        <outputDirectory> C:\MVN\project\target/site </outputDirectory>
      </reporting>
    </project>
  ```
  在上面的 `pom.xml` 中，可以看到 Maven 在執行目標時需要用到的默認工程源碼目錄結構、輸出目錄、需要的插件、倉庫和報表目錄。

  Maven 的 `pom.xml` 文件也不需要手工編寫。

  Maven 提供了大量的原型插件來創建工程，包括工程結構和 `pom.xml`。
  
  - ### POM 標籤大全詳解
  ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0http://maven.apache.org/maven-v4_0_0.xsd">
      
      <!--父項目的坐標。如果項目中沒有規定某個元素的值，那麼父項目中的對應值即為項目的默認值。坐標包括group ID，artifact ID和version。-->
      <parent>
        <!--被繼承的父項目的構件標識符-->
        <artifactId />

        <!--被繼承的父項目的全球唯一標識符-->
        <groupId />  

        <!--被繼承的父項目的版本-->
        <version />

        <!--父項目的pom.xml文件的相對路徑。相對路徑允許你選擇一個不同的路徑。默認值是../pom.xml。
        Maven 首先在構建當前項目的地方尋找父項目的 pom，其次在文件系統的這個位置（relativePath位置），
        然後在本地倉庫，最後在遠程倉庫尋找父項目的pom。-->
        <relativePath />
      </parent>
      
      <!--聲明項目描述符遵循哪一個 POM模型版本。模型本身的版本很少改變，雖然如此，但它仍然是必不可少的，
      這是為了當 Maven 引入了新的特性或者其他模型變更的時候，確保穩定性。-->
      <modelVersion>4.0.0</modelVersion>
      
      <!--項目的全球唯一標識符，通常使用全限定的包名區分該項目和其他項目。並且構建時生成的路徑也是由此生成，
      如com.mycompany.app生成的相對路徑為：/com/mycompany/app -->
      <groupId>asia.banseon</groupId>
      
      <!--構件的標識符，它和 group ID一起唯一標識一個構件。換句話說，
      你不能有兩個不同的項目擁有同樣的artifact ID和groupID；在某個特定的group ID下，artifact ID也必須是唯一的。
      構件是項目產生的或使用的一個東西，Maven為項目產生的構件包括：JARs，源碼，二進制發布和WARs等。-->
      <artifactId> banseon-maven2 </artifactId>
      
      <!--項目產生的構件類型，例如jar、war、ear、pom。插件可以創建他們自己的構件類型，所以前面列的不是全部構件類型--> <packaging> jar </packaging>
      
      <!--項目當前版本，格式為:主版本.次版本.增量版本-限定版本號-->
      <version> 1.0-SNAPSHOT </version>
      
      <!--項目的名稱, Maven 產生的文檔用-->
      <name> banseon-maven </name>
      
      <!--項目主頁的URL, Maven 產生的文檔用-->
      <url> http://www.baidu.com/banseon </url>
      
      <!--項目的詳細描述, Maven 產生的文檔用。當這個元素能夠用 HTML 格式描述時（例如，CDATA中的文本會被解析器忽略，就可以包含HTML標籤）， 不鼓勵使用純文本描述。如果你需要修改產生的web站點的索引頁面，你應該修改你自己的索引頁文件，而不是調整這裡的文檔。-->
      <description> A maven project to study maven. </description>
      
      <!--描述了這個項目構建環境中的前提條件。-->
      <prerequisites>
        <!--構建該項目或使用該插件所需要的Maven的最低版本-->
        <maven />
      </prerequisites>
      
      <!--項目的問題管理系統(Bugzilla, Jira, Scarab,或任何你喜歡的問題管理系統)的名稱和URL，本例為jira --> <issueManagement>
        <!--問題管理系統（例如jira）的名字，-->
        <system> jira </system>
        
        <!--該項目使用的問題管理系統的URL -->
        <url> http://jira.baidu.com/banseon </url>
      </issueManagement>
      
      <!--項目持續集成信息-->
      <ciManagement>
        <!--持續集成系統的名字，例如continuum -->
        <system />

        <!--該項目使用的持續集成系統的URL（如果持續集成系統有web接口的話）。-->
        <url />
        
        <!--構建完成時，需要通知的開發者/用戶的配置項。包括被通知者信息和通知條件（錯誤，失敗，成功，警告）-->
        <notifiers>
          <!--配置一種方式，當構建中斷時，以該方式通知用戶/開發者-->
          <notifier>
            <!--傳送通知的途徑-->
            <type />
            
            <!--發生錯誤時是否通知-->
            <sendOnError />
            
            <!--構建失敗時是否通知-->
            <sendOnFailure />

            <!--構建成功時是否通知-->
            <sendOnSuccess />
            
            <!--發生警告時是否通知-->
            <sendOnWarning />
            
            <!--不贊成使用。通知發送到哪裡-->
            <address />
            
            <!--擴展配置項-->
            <configuration />
          </notifier>
        </notifiers>
      </ciManagement>
      
      <!--項目創建年份，4位數字。當產生版權信息時需要使用這個值。-->
      <inceptionYear />
      
      <!--項目相關郵件列表信息-->
      <mailingLists>
        <!--該元素描述了項目相關的所有郵件列表。自動產生的網站引用這些信息。-->
        <mailingList>
          <!--郵件的名稱-->
          <name> Demo </name>

          <!--發送郵件的地址或鏈接，如果是郵件地址，創建文檔時，mailto: 鏈接會被自動創建-->
          <post> banseon@126.com </post>
          
          <!--訂閱郵件的地址或鏈接，如果是郵件地址，創建文檔時，mailto: 鏈接會被自動創建-->
          <subscribe> banseon@126.com </subscribe>
          
          <!--取消訂閱郵件的地址或鏈接，如果是郵件地址，創建文檔時，mailto: 鏈接會被自動創建-->
          <unsubscribe> banseon@126.com </unsubscribe>
          
          <!--你可以瀏覽郵件信息的URL -->
          <archive> http:/hi.baidu.com/banseon/demo/dev/ </archive>
        </mailingList>
      </mailingLists>
      
      <!--項目開發者列表-->
      <developers>
        <!--某個項目開發者的信息-->
        <developer>

          <!-- SCM裡項目開發者的唯一標識符-->
          <id> HELLO WORLD </id>

          <!--項目開發者的全名-->
          <name> banseon </name>
          
          <!--項目開發者的email -->
          <email> banseon@126.com </email>
          
          <!--項目開發者的主頁的URL -->
          <url />
          
          <!--項目開發者在項目中扮演的角色，角色元素描述了各種角色-->
          <roles>
            <role> Project Manager </role>
            <role> Architect </role>
          </roles>
          
          <!--項目開發者所屬組織-->
          <organization> demo </organization>
          
          <!--項目開發者所屬組織的URL -->
          <organizationUrl> http://hi.baidu.com/banseon </organizationUrl>
          
          <!--項目開發者屬性，如即時消息如何處理等-->
          <properties>
            <dept> No </dept>
          </properties>
          
          <!--項目開發者所在時區， -11到12範圍內的整數。-->
          <timezone> -5 </timezone>
        </developer>
      </developers>
      
      <!--項目的其他貢獻者列表-->
      <contributors>
        <!--項目的其他貢獻者。參見developers/developer元素-->
        <contributor>
          <name />
          <email />
          <url />
          <organization />
          <organizationUrl />
          <roles />
          <timezone />
          <properties />
        </contributor>
      </contributors>

      <!--該元素描述了項目所有License列表。應該只列出該項目的license列表，不要列出依賴項目的license列表。如果列出多個license，用戶可以選擇它們中的一個而不是接受所有license。-->
      <licenses>
        <!--描述了項目的license，用於生成項目的web站點的license頁面，其他一些報表和validation也會用到該元素。-->
        <license>
          <!-- license用於法律上的名稱-->
          <name> Apache 2 </name>
          
          <!--官方的license正文頁面的URL -->
          <url> http://www.baidu.com/banseon/LICENSE-2.0.txt </url>
          
          <!--項目分發的主要方式： repo，可以從Maven庫下載manual， 用戶必須手動下載和安裝依賴-->
          <distribution> repo </distribution>
          
          <!--關於license的補充信息-->
          <comments> A business-friendly OSS license </comments>
        </license>
      </licenses>
      
      <!-- SCM(Source Control Management)標籤允許你配置你的代碼庫，供Maven web站點和其它插件使用。-->
      <scm>
        <!-- SCM的URL,該URL描述了版本庫和如何連接到版本庫。欲知詳情，請看SCMs提供的URL格式和列表。該連接只讀。-->
        <connection> 
          scm:svn:http://svn.baidu.com/banseon/maven/banseon/banseon-maven2-trunk(dao-trunk)
        </connection>
        
        <!--給開發者使用的，類似connection元素。即該連接不僅僅只讀-->
        <developerConnection> 
          scm:svn:http://svn.baidu.com/banseon/maven/banseon/dao-trunk
        </developerConnection>
        
        <!--當前代碼的標籤，在開發階段默認為HEAD -->
        <tag />
        
        <!--指向項目的可瀏覽SCM庫（例如ViewVC或者Fisheye）的URL。-->
        <url> http://svn.baidu.com/banseon </url>
      </scm>
      
      <!--描述項目所屬組織的各種屬性。Maven產生的文檔用-->
      <organization>
        <!--組織的全名-->
        <name> demo </name>
        
        <!--組織主頁的URL -->
        <url> http://www.baidu.com/banseon </url>
      </organization>
      
      <!--構建項目需要的信息-->
      <build>
        <!--該元素設置了項目源碼目錄，當構建項目的時候，構建系統會編譯目錄裡的源碼。該路徑是相對於pom.xml的相對路徑。-->
        <sourceDirectory />
        
        <!--該元素設置了項目腳本源碼目錄，該目錄和源碼目錄不同：絕大多數情況下，該目錄下的內容會被拷貝到輸出目錄(因為腳本是被解釋的，而不是被編譯的)。--> <scriptSourceDirectory />
        
        <!--該元素設置了項目單元測試使用的源碼目錄，當測試項目的時候，構建系統會編譯目錄裡的源碼。該路徑是相對於pom.xml的相對路徑。--> <testSourceDirectory />
        
        <!--被編譯過的應用程序class文件存放的目錄。-->
        <outputDirectory />
        
        <!--被編譯過的測試class文件存放的目錄。-->
        <testOutputDirectory />
        
        <!--使用來自該項目的一系列構建擴展-->
        <extensions>
          <!--描述使用到的構建擴展。-->
          <extension>
            <!--構建擴展的groupId -->
            <groupId />

            <!--構建擴展的artifactId -->
            <artifactId />
            
            <!--構建擴展的版本-->
            <version />
          </extension>
        </extensions>
        
        <!--當項目沒有規定目標（Maven2 叫做階段）時的默認值-->
        <defaultGoal />
        
        <!--這個元素描述了項目相關的所有資源路徑列表，例如和項目相關的屬性文件，這些資源被包含在最終的打包文件裡。-->
        <resources>
          <!--這個元素描述了項目相關或測試相關的所有資源路徑-->
          <resource>
            <!--描述了資源的目標路徑。該路徑相對target/classes目錄（例如${project.build.outputDirectory}）。舉個例子，如果你想資源在特定的包裡(org.apache.maven. messages)，你就必須該元素設置為org/apache/maven /messages。然而，如果你只是想把資源放到源碼目錄結構裡，就不需要該配置。-->
            <targetPath />
            
            <!--是否使用參數值代替參數名。參數值取自properties元素或者文件裡配置的屬性，文件在filters元素裡列出。-->
            <filtering />
            
            <!--描述存放資源的目錄，該路徑相對POM路徑-->
            <directory />
            
            <!--包含的模式列表，例如**/*.xml. -->
            <includes />
            
            <!--排除的模式列表，例如**/*.xml -->
            <excludes />
          </resource>
        </resources>
        
        <!--這個元素描述了單元測試相關的所有資源路徑，例如和單元測試相關的屬性文件。-->
        <testResources>
          <!--這個元素描述了測試相關的所有資源路徑，參見build/resources/resource元素的說明-->
          <testResource>
            <targetPath />
            <filtering />
            <directory />
            <includes />
            <excludes />
          </testResource>
        </testResources>
        
        <!--構建產生的所有文件存放的目錄-->
        <directory />
        
        <!--產生的構件的文件名，默認值是${artifactId}-${version}。-->
        <finalName />
        
        <!--當filtering開關打開時，使用到的過濾器屬性文件列表-->
        <filters />
        
        <!--子項目可以引用的默認插件信息。該插件配置項直到被引用時才會被解析或綁定到生命週期。給定插件的任何本地配置都會覆蓋這裡的配置-->
        <pluginManagement>
          <!--使用的插件列表。-->
          <plugins>
            <!-- plugin元素包含描述插件所需要的信息。-->
            <plugin>
              <!--插件在倉庫裡的group ID -->
              <groupId />

              <!--插件在倉庫裡的artifact ID -->
              <artifactId />
              
              <!--被使用的插件的版本（或版本範圍）-->
              <version />

              <!--是否從該插件下載Maven擴展（例如打包和類型處理器），由於性能原因，只有在真需要下載時，該元素才被設置成enabled。-->
              <extensions />
              
              <!--在構建生命週期中執行一組目標的配置。每個目標可能有不同的配置。-->
              <executions>
                <!-- execution元素包含了插件執行需要的信息-->
                <execution>
                  <!--執行目標的標識符，用於標識構建過程中的目標，或者匹配繼承過程中需要合併的執行目標-->
                  <id />
                  
                  <!--綁定了目標的構建生命週期階段，如果省略，目標會被綁定到源數據裡配置的默認階段-->
                  <phase />
                  
                  <!--配置的執行目標-->
                  <goals />

                  <!--配置是否被傳播到子POM -->
                  <inherited />
                  
                  <!--作為DOM對象的配置--> 
                  <configuration />
                </execution>
              </executions>
              
              <!--項目引入插件所需要的額外依賴-->
              <dependencies>
                <!--參見dependencies/dependency元素-->
                <dependency> 
                  ......
                </dependency>
              </dependencies>
              
              <!--任何配置是否被傳播到子項目-->
              <inherited />
              
              <!--作為DOM對象的配置-->
              <configuration />
            </plugin>
          </plugins>
        </pluginManagement>
        
        <!--使用的插件列表-->
        <plugins>
          <!--參見build/pluginManagement/plugins/plugin元素-->
          <plugin>
            <groupId />
            <artifactId />
            <version />
            <extensions />
            <executions>
              <execution>
                <id />
                <phase />
                <goals />
                <inherited />
                <configuration />
              </execution>
            </executions>
            <dependencies>
              <!--參見dependencies/dependency元素-->
              <dependency> 
                ......
              </dependency>
            </dependencies>
            <goals />
            <inherited />
            <configuration />
          </plugin>
        </plugins>
      </build>
      
      <!--在列的項目構建profile，如果被激活，會修改構建處理-->
      <profiles>
        <!--根據環境參數或命令行參數激活某個構建處理-->
        <profile>
          <!--構建配置的唯一標識符。即用於命令行激活，也用於在繼承時合併具有相同標識符的profile。-->
          <id />
          
          <!--自動觸發profile的條件邏輯。Activation是profile的開啟鑰匙。profile的力量來自於它能夠在某些特定的環境中自動使用某些特定的值；這些環境通過activation元素指定。activation元素並不是激活profile的唯一方式。-->
          <activation>
            <!-- profile默認是否激活的標誌-->
            <activeByDefault />
            
            <!--當匹配的jdk被檢測到，profile被激活。例如，1.4激活JDK1.4，1.4.0_2，而!1.4激活所有版本不是以1.4開頭的JDK。-->
            <jdk />
            
            <!--當匹配的操作系統屬性被檢測到，profile被激活。os元素可以定義一些操作系統相關的屬性。-->
            <os>
              <!--激活profile的操作系統的名字-->
              <name> Windows XP </name>
              
              <!--激活profile的操作系統所屬家族(如'windows') -->
              <family> Windows </family>
              
              <!--激活profile的操作系統體系結構-->
              <arch> x86 </arch>
              
              <!--激活profile的操作系統版本-->
              <version> 5.1.2600 </version>
            <os>
            
            <!--如果Maven檢測到某一個屬性（其值可以在POM中通過${名稱}引用），其擁有對應的名稱和值，Profile就會被激活。如果值字段是空的，那麼存在屬性名稱字段就會激活profile，否則按區分大小寫方式匹配屬性值字段-->
            <property>
              <!--激活profile的屬性的名稱-->
              <name> mavenVersion </name>
              
              <!--激活profile的屬性的值-->
              <value> 2.0.3 </value>
            </property>
            
            <!--提供一個文件名，通過檢測該文件的存在或不存在來激活profile。missing檢查文件是否存在，如果不存在則激活profile。另一方面，exists則會檢查文件是否存在，如果存在則激活profile。-->
            <file>
              <!--如果指定的文件存在，則激活profile。-->
              <exists> /usr/local/hudson/hudson-home/jobs/maven-guide-zh-to-production/workspace/ </exists>
              <!--如果指定的文件不存在，則激活profile。-->
              <missing> /usr/local/hudson/hudson-home/jobs/maven-guide-zh-to-production/workspace/ </missing>
            </file>
          </activation>
          
          <!--構建項目所需要的信息。參見build元素-->
          <build>
            <defaultGoal />
            <resources>
              <resource>
                <targetPath />
                <filtering />
                <directory />
                <includes />
                <excludes />
              </resource>
            </resources>
            <testResources>
              <testResource>
                <targetPath />
                <filtering />
                <directory />
                <includes />
                <excludes />
              </testResource>
            </testResources>
            <directory />
            <finalName />
            <filters />
            <pluginManagement>
              <plugins>
                <!--參見build/pluginManagement/plugins/plugin元素-->
                <plugin>
                  <groupId />
                  <artifactId />
                  <version />
                  <extensions />
                  <executions>
                    <execution>
                      <id />
                      <phase />
                      <goals />
                      <inherited />
                      <configuration />
                    </execution>
                  </executions>
                  <dependencies>
                    <!--參見dependencies/dependency元素-->
                    <dependency> 
                      ......
                    </dependency>
                  </dependencies>
                  <goals />
                  <inherited />
                  <configuration />
                </plugin>
              </plugins>
            </pluginManagement>
            <plugins>
              <!--參見build/pluginManagement/plugins/plugin元素-->
              <plugin>
                <groupId />
                <artifactId />
                <version />
                <extensions />
                <executions>
                  <execution>
                    <id />
                    <phase />
                    <goals />
                    <inherited />
                    <configuration />
                  </execution>
                </executions>
                <dependencies>
                  <!--參見dependencies/dependency元素-->
                  <dependency> 
                    ......
                  </dependency>
                </dependencies>
                <goals />
                <inherited />
                <configuration />
              </plugin>
            </plugins>
          </build>
          
          <!--模塊（有時稱作子項目） 被構建成項目的一部分。列出的每個模塊元素是指向該模塊的目錄的相對路徑-->
          <modules /> 
          <!--發現依賴和擴展的遠程倉庫列表。-->
          <repositories>
            <!--參見repositories/repository元素-->
            <repository>
              <releases>
                <enabled />
                <updatePolicy />
                <checksumPolicy />
              </releases>
              <snapshots>
                <enabled />
                <updatePolicy />
                <checksumPolicy />
              </snapshots>
              <id />
              <name />
              <url />
              <layout />
            </repository>
          </repositories>
          
          <!--發現插件的遠程倉庫列表，這些插件用於構建和報表-->
          <pluginRepositories>
            <!--包含需要連接到遠程插件倉庫的信息.參見repositories/repository元素-->
            <pluginRepository>
              <releases>
                <enabled />
                <updatePolicy />
                <checksumPolicy />
              </releases>
              <snapshots>
                <enabled />
                <updatePolicy />
                <checksumPolicy />
              </snapshots>
              <id />
              <name />
              <url />
              <layout />
            </pluginRepository>
          </pluginRepositories>
          
          <!--該元素描述了項目相關的所有依賴。這些依賴組成了項目構建過程中的一個個環節。它們自動從項目定義的倉庫中下載。要獲取更多信息，請看項目依賴機制。--> <dependencies>
            <!--參見dependencies/dependency元素-->
            <dependency> 
              ......
            </dependency>
          </dependencies>
          
          <!--不贊成使用. 現在Maven忽略該元素. -->
          <reports />
          <!--該元素包括使用報表插件產生報表的規範。當用戶執行"mvn site"，這些報表就會運行。在頁面導航欄能看到所有報表的鏈接。參見reporting元素--> <reporting> 
            ......
          </reporting>

          <!--參見dependencyManagement元素-->
          <dependencyManagement>
            <dependencies>
              <!--參見dependencies/dependency元素-->
              <dependency> 
                ......
              </dependency>
            </dependencies>
          </dependencyManagement>
          
          <!--參見distributionManagement元素-->
          <distributionManagement> 
            ......
          </distributionManagement>
          
          <!--參見properties元素-->
          <properties />
        </profile>
      </profiles>
      
      <!--模塊（有時稱作子項目） 被構建成項目的一部分。列出的每個模塊元素是指向該模塊的目錄的相對路徑-->
      <modules />
      <!--發現依賴和擴展的遠程倉庫列表。-->
      <repositories>
        <!--包含需要連接到遠程倉庫的信息-->
        <repository>
          <!--如何處理遠程倉庫裡發布版本的下載-->
          <releases>
            <!-- true或者false表示該倉庫是否為下載某種類型構件（發布版，快照版）開啟。-->
            <enabled />

            <!--該元素指定更新發生的頻率。Maven會比較本地POM和遠程POM的時間戳。這裡的選項是：always（一直），daily（默認，每日），interval：X（這裡X是以分鐘為單位的時間間隔），或者never（從不）。-->
            <updatePolicy />

            <!--當Maven驗證構件校驗文件失敗時該怎麼做：ignore（忽略），fail（失敗），或者warn（警告）。-->
            <checksumPolicy />
          </releases>

          <!--如何處理遠程倉庫裡快照版本的下載。有了releases和snapshots這兩組配置，POM就可以在每個單獨的倉庫中，為每種類型的構件採取不同的策略。例如，可能有人會決定只為開發目的開啟對快照版本下載的支持。參見repositories/repository/releases元素-->
          <snapshots>
            <enabled />
            <updatePolicy />
            <checksumPolicy />
          </snapshots>
          
          <!--遠程倉庫唯一標識符。可以用來匹配在settings.xml文件裡配置的遠程倉庫-->
          <id> banseon-repository-proxy </id>
          
          <!--遠程倉庫名稱-->
          <name> banseon-repository-proxy </name>
          
          <!--遠程倉庫URL，按protocol://hostname/path形式-->
          <url> http://192.168.1.169:9999/repository/ </url>
          
          <!--用於定位和排序構件的倉庫佈局類型-可以是default（默認）或者legacy（遺留）。Maven 2為其倉庫提供了一個默認的佈局；然而，Maven 1.x有一種不同的佈局。我們可以使用該元素指定佈局是default（默認）還是legacy（遺留）。-->
          <layout> default </layout>
        </repository>
      </repositories>
      
      <!--發現插件的遠程倉庫列表，這些插件用於構建和報表-->
      <pluginRepositories>
        <!--包含需要連接到遠程插件倉庫的信息.參見repositories/repository元素-->
        <pluginRepository> 
          ......
        </pluginRepository>
      </pluginRepositories>
      
      <!--該元素描述了項目相關的所有依賴。這些依賴組成了項目構建過程中的一個個環節。它們自動從項目定義的倉庫中下載。要獲取更多信息，請看項目依賴機制。--> <dependencies>
        <dependency>
          <!--依賴的group ID -->
          <groupId> org.apache.maven </groupId>
          
          <!--依賴的artifact ID -->
          <artifactId> maven-artifact </artifactId>
          
          <!--依賴的版本號。在Maven 2裡, 也可以配置成版本號的範圍。-->
          <version> 3.8.1 </version>
          
          <!--依賴類型，默認類型是jar。它通常表示依賴的文件的擴展名，但也有例外。一個類型可以被映射成另外一個擴展名或分類器。類型經常和使用的打包方式對應， 儘管這也有例外。一些類型的例子：jar，war，ejb-client和test-jar。如果設置extensions為true，就可以在plugin裡定義新的類型。所以前面的類型的例子不完整。-->
          <type> jar </type>
          
          <!--依賴的分類器。分類器可以區分屬於同一個POM，但不同構建方式的構件。分類器名被附加到文件名的版本號後面。例如，如果你想要構建兩個單獨的構件成JAR，一個使用Java 1.4編譯器，另一個使用Java 6編譯器，你就可以使用分類器來生成兩個單獨的JAR構件。-->
          <classifier> </classifier>
          
          <!--依賴範圍。在項目發布過程中，幫助決定哪些構件被包括進來。欲知詳情請參考依賴機制。- compile ：默認範圍，用於編譯- provided：類似於編譯，但支持你期待jdk或者容器提供，類似於classpath - runtime: 在執行時需要使用- test: 用於test任務時使用- system: 需要外在提供相應的元素。通過systemPath來取得- systemPath: 僅用於範圍為system。提供相應的路徑- optional: 當項目自身被依賴時，標註依賴是否傳遞。用於連續依賴時使用-->
          <scope> test </scope>
          
          <!--僅供system範圍使用。注意，不鼓勵使用這個元素，並且在新的版本中該元素可能被覆蓋掉。該元素為依賴規定了文件系統上的路徑。需要絕對路徑而不是相對路徑。推薦使用屬性匹配絕對路徑，例如${java.home}。-->
          <systemPath> </systemPath>
          
          <!--當計算傳遞依賴時， 從依賴構件列表裡，列出被排除的依賴構件集。即告訴maven你只依賴指定的項目，不依賴項目的依賴。此元素主要用於解決版本衝突問題--> <exclusions>
            <exclusion>
              <artifactId> spring-core </artifactId>
              <groupId> org.springframework </groupId>
            </exclusion>
          </exclusions>
          
          <!--可選依賴，如果你在項目B中把C依賴聲明為可選，你就需要在依賴於B的項目（例如項目A）中顯式的引用對C的依賴。可選依賴阻斷依賴的傳遞性。--> <optional> true </optional>
        </dependency>
      </dependencies>
      
      <!--不贊成使用. 現在Maven忽略該元素. -->
      <reports></reports>
      
      <!--該元素描述使用報表插件產生報表的規範。當用戶執行"mvn site"，這些報表就會運行。在頁面導航欄能看到所有報表的鏈接。-->
      <reporting>
        <!-- true，則，網站不包括默認的報表。這包括"項目信息"菜單中的報表。-->
        <excludeDefaults />
        
        <!--所有產生的報表存放到哪裡。默認值是${project.build.directory}/site。-->
        <outputDirectory />
        
        <!--使用的報表插件和他們的配置。-->
        <plugins>
          <!-- plugin元素包含描述報表插件需要的信息-->
          <plugin>
            <!--報表插件在倉庫裡的group ID -->
            <groupId />
            
            <!--報表插件在倉庫裡的artifact ID -->
            <artifactId />
            
            <!--被使用的報表插件的版本（或版本範圍）-->
            <version />
            
            <!--任何配置是否被傳播到子項目-->
            <inherited />
            
            <!--報表插件的配置-->
            <configuration />
            
            <!--一組報表的多重規範，每個規範可能有不同的配置。一個規範（報表集）對應一個執行目標。例如，有1，2，3，4，5，6，7，8，9個報表。1，2，5構成A報表集，對應一個執行目標。2，5，8構成B報表集，對應另一個執行目標-->
            <reportSets>
              <!--表示報表的一個集合，以及產生該集合的配置-->
              <reportSet>
                <!--報表集合的唯一標識符，POM繼承時用到-->
                <id />
                
                <!--產生報表集合時，被使用的報表的配置-->
                <configuration />
                
                <!--配置是否被繼承到子POMs -->
                <inherited />
                
                <!--這個集合裡使用到哪些報表-->
                <reports />
              </reportSet>
            </reportSets>
          </plugin>
        </plugins>
      </reporting>
      
      <!--繼承自該項目的所有子項目的默認依賴信息。這部分的依賴信息不會被立即解析,而是當子項目聲明一個依賴（必須描述group ID和artifact ID信息），如果group ID和artifact ID以外的一些信息沒有描述，則通過group ID和artifact ID 匹配到這裡的依賴，並使用這裡的依賴信息。-->
      <dependencyManagement>
        <dependencies>
          <!--參見dependencies/dependency元素-->
          <dependency> 
            ......
          </dependency>
        </dependencies>
      </dependencyManagement>
      
      <!--項目分發信息，在執行mvn deploy後表示要發布的位置。有了這些信息就可以把網站部署到遠程服務器或者把構件部署到遠程倉庫。--> <distributionManagement>
        <!--部署項目產生的構件到遠程倉庫需要的信息-->
        <repository>
          <!--是分配給快照一個唯一的版本號（由時間戳和構建流水號）？還是每次都使用相同的版本號？參見repositories/repository元素-->
          <uniqueVersion />
          <id> banseon-maven2 </id>
          <name> banseon maven2 </name>
          <url> file://${basedir}/target/deploy </url>
          <layout />
        </repository>
        
        <!--構件的快照部署到哪裡？如果沒有配置該元素，默認部署到repository元素配置的倉庫，參見distributionManagement/repository元素--> <snapshotRepository>
          <uniqueVersion />
          <id> banseon-maven2 </id>
          <name> Banseon-maven2 Snapshot Repository </name>
          <url> scp://svn.baidu.com/banseon:/usr/local/maven-snapshot </url>
          <layout />
        </snapshotRepository>
        
        <!--部署項目的網站需要的信息-->
        <site>
          <!--部署位置的唯一標識符，用來匹配站點和settings.xml文件裡的配置-->
          <id> banseon-site </id>
          
          <!--部署位置的名稱-->
          <name> business api website </name>
          
          <!--部署位置的URL，按protocol://hostname/path形式-->
          <url> scp://svn.baidu.com/banseon:/var/www/localhost/banseon-web </url>
        </site>
        
        <!--項目下載頁面的URL。如果沒有該元素，用戶應該參考主頁。使用該元素的原因是：幫助定位那些不在倉庫裡的構件（由於license限制）。-->
        <downloadUrl />
        
        <!--如果構件有了新的group ID和artifact ID（構件移到了新的位置），這裡列出構件的重定位信息。-->
        <relocation>
          <!--構件新的group ID -->
          <groupId />

          <!--構件新的artifact ID -->
          <artifactId />
          
          <!--構件新的版本號-->
          <version />
          
          <!--顯示給用戶的，關於移動的額外信息，例如原因。-->
          <message />
        </relocation>
        
        <!--給出該構件在遠程倉庫的狀態。不得在本地項目中設置該元素，因為這是工具自動更新的。有效的值有：none（默認），converted（倉庫管理員從Maven 1 POM轉換過來），partner（直接從夥伴Maven 2倉庫同步過來），deployed（從Maven 2實例部署），verified（被核實時正確的和最終的）。-->
        <status />
      </distributionManagement>
      
      <!--以值替代名稱，Properties可以在整個POM中使用，也可以作為觸發條件（見settings.xml配置文件裡activation元素的說明）。格式是<name>value</name> 。-->
      <properties />
    </project> 
  ```
---

## Maven 構建生命週期
  Maven 構建生命週期定義了一個項目構建跟發布的過程。
  一個典型的 Maven 構建（build）生命週期是由以下幾個階段的序列組成的：
  ![image4](./image_4.png)

  |階段|處理|描述|
  |---|---|---|
  |驗證 validate|驗證項目|驗證項目是否正確且所有必須訊息是可用的|
  |編譯 compile|執行編譯|源代碼編譯在此階段完成|
  |測試 Test|測試|使用適當的單元測試框架 (例如：JUnit) 運行測試|
  |包裝 package|打包|創建 JAR/WAR包，如在 pom.xml 中定義提及的包|
  |檢查 verify|檢查|對集成測試的結果進行檢查，以保證質量達標|
  |安裝 install|安裝|安裝打包的項目到本地倉庫，以供其他項目使用|
  |部署 deploy|部署|拷貝最終的工程包到遠程倉庫中，以共享給其他開發人員和工程|

  為了完成 default 生命週期，這些階段（包括其他未在上面羅列的生命週期階段）將被按順序地執行。

  Maven 有以下三個標準的生命週期：
  - **clean**：項目清理的處理
  - **默認（或構建）**：項目部署的處理
  - **站點**：項目站點文檔創建的處理

- ### 構建階段由插件目標標籤組成

---

## Maven 構建配置文件

---

## Maven 倉庫

---

## Maven 插件

---

## Maven 構建 Java 項目

---

## Maven 構建 & 項目測試

---

## Maven 引入外部依賴

---

## Maven 項目模板

---

## Maven 項目文檔

---

## Maven 快照 (SNAPSHOT)

---

## Maven 自動化構建

---

## Maven 依賴管理

---

## Maven 自動化部屬

---

## Maven Web 應用

---

## Maven Eclipse

---

## Maven NetBeans

---

## Maven IntelliJ