# 02、 SpringBoot2 入門
  - ## 1、 系統要求
    - [Java 8](https://www.java.com/zh-TW/) & 兼容java14 .
    - Maven 3.3+
    - idea 2019.1.2
      >  mac 安裝方式，先安裝 java SDK v1.8，
      >  然後安裝 IDE (Intellij 或 eclipse)

    - JDK 版本查看方式
      ```sh
      javac -version
      ```

    - Maven 版本查看方式
      ```bash
      mvn -v
      ```

    - ### 1.1、 maven設置
      ```xml
      <!-- .m2/settings.xml -->
      <mirrors>
        <mirror>
          <id>nexus-aliyun</id>
          <mirrorOf>central</mirrorOf>
          <name>Nexus aliyun</name>
          <url>http://maven.aliyun.com/nexus/content/groups/public</url>
        </mirror>
      </mirrors>

      <profiles>
        <profile>
          <id>jdk-1.8</id>
          <activation>
            <activeByDefault>true</activeByDefault>
            <jdk>1.8</jdk>
          </activation>
          <properties>
            <maven.compiler.source>1.8</maven.compiler.source>
            <maven.compiler.target>1.8</maven.compiler.target>
            <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
          </properties>
        </profile>
      </profiles>
      ```
  
  - ## 2、 HelloWorld
    需求：瀏覽發送 /hello，響應 Hello，Spring Boot 2

    - ### 2.1、 創建 maven 工程
      1. 開啟 intellij
      2. 創建 new Project
      3. 選擇 Java、Maven
      
    - ### 2.2、 引入依賴
      在 `pom.xml` 增加 `spring-boot-starter-parent` 、 `spring-boot-starter-web`

      ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>

        <groupId>com.example</groupId>
        <artifactId>myproject</artifactId>
        <version>0.0.1-SNAPSHOT</version>

        <parent>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-parent</artifactId>
          <version>2.7.9</version>
        </parent>

        <!-- Additional lines to be added here... -->
        <!-- 添加 starter 依賴 -->
        <dependencies>
          <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
        </dependencies>
      </project>
      ```
    
    - ### 2.3、 創建主程序
      - 在 `src/main/java/` 右鍵 `new / Java Class`，輸入 `com.atguigu.boot.MainApplication`。
      - 並加上 `@SpringBootApplication`，告訴 SpringBoot 這是一個 SpringBoot 應用
      - 並加上 `SpringApplication.run(MainApplication.class, args);`，告訴 `SpringApplication` 將主類為`MainApplication` 跑起來，並將 `args` 傳入。

      ```java
      /**
      * 主程序類 (相當於所有啟動的入口)
      * @SpringBootApplication：這是一個SpringBoot應用
      */
      @SpringBootApplication
      public class MainApplication {
        public static void main(String[] args) {
          SpringApplication.run(MainApplication.class, args);
        }
      }
      ```

    - ### 2.4 編寫業務
      - 在 `src/main/java/com/atguigu/boot` 右鍵 `new / Java Class`，輸入 `controller.HelloController`。
      - 並在 class 前面 標註註解，加上 `@Controller`
      - 編寫一個 `handleo1` 方法
      - 在方法上 標註註解，為 `/hello` 映射一個請求，加上 `@RequestMapping("/hello")`
      - 在 `handleo1` 方法內，撰寫 回傳值 `return "Hello, Spring Boot 2!";`

        ```java
        @Controller
        public class HelloController {
          @RequestMapping("/hello")
          public String handle01(){
            return "Hello, Spring Boot 2!";
          }
        }
        ```

      - 由於 返回值 要以字串的形式返回瀏覽器，所以 在 `@RequestMapping("/hello")` 前面還必須加上 `@ResponseBody`。

        ```java
        @Controller
        public class HelloController {
          @ResponseBody
          @RequestMapping("/hello")
          ...
        }
        ```

      - 然而，因為 `HelloController` 這個處理器，可能會處理非常多的請求，都要給瀏覽器返回字符串。所以可以將 `@ResponseBody` 搬到 `@Controller` 之上。

        ```java
        @ResponseBody
        @Controller
        public class HelloController {
          ...
        }
        ```

      - `SpringMVC` 有一個新註解 `@RestController`，它其實就是 `@Controller` 和 `ResponseBody` 的合體，所以可以直接改用 `@RestController`

        ```java
        @RestController
        public class HelloController {
          @RequestMapping("/hello")
          public String handle01(){
            return "Hello, Spring Boot 2!";
          }
        }
        ```

    - ### 2.5、 測試
      直接運行 `main` 方法

      - 可在主類 `MainApplication` 檔案中，`public static void main` 左側，點擊 run (綠色三角形) 按鈕，`Run 'MainApplication.main()'`。

      - 查找運行的 prot： 如： `Tomcat started on port(s): 8080`，表示 可在 `http://localhost:8080/` 找到該環境，
      
      - 後面加上 `/hello`，可測試 請求 `/hello` 時，瀏覽器會顯示 `Hello, Spring Boot 2!`

    - ### 2.6、 簡化配置
      `application.properties`

      - `SpringBoot` 只要在一處(`application.properties`)，就可以更改所有配置。
      - 在 `src/main/resources` 右鍵 選擇 `New / File`，輸入 `application.properties`，在這個檔案中，可以修改 `Tomcat` 的設置，包括 MVC 的設置。在 `src/main/resources/application.properties`
      - 如更改 `server.port`，

        ```
        server.port=8888
        ```

      - 重新啟動 `Run 'MainApplication.main()'`，即可看到 port 已經改為 8888。

      - 所有設定都可以在此檔案裡面做修改，未配置的項目，則會以 `SpringBoot2` 的預設為主。

      - 在官方文件的 [Application Properties](https://docs.spring.io/spring-boot/docs/2.7.9/reference/html/application-properties.html#appendix.application-properties)，可查看所有配置項的設定說明。

    - ### 2.7、 簡化部屬
      把項目打包成 `jar` 包，直接在目標服務器執行即可。
      - 以前，要將應用部署到server，server 必須安裝 `Tomcat`等套件，再把應用包成 `war`。
      - `Maven` 的 `pom.xml` 若沒有設定打包方式，默認就會是 `jar`，

        ```xml
          <packaging>jar</packaging>
        ```

      - 有了 `SpringBoot2` 以後，只要在 `pom.xml`，加上以下語法，就能將項目打包成 `jar`，`jar` 中，自帶了運行環境。

        ```xml
        <build>
          <plugins>
            <plugin>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
          </plugins>
        </build>
        ```

        - 點擊右邊 `Maven` 頁籤，打開 `Project` 的細項，找到 `Lifecycle`，選取 `clean` 和 `package` 這兩項。(按住 `ALT` 可 多選)，再來點選上面的 `Run Maven Build` (綠色箭頭)。

        - 運行打包完之後，會產生 `/target/`，打包的 `jar` 就在裡面。
        - `cd` 到 該資料夾位置，
        - 執行
          ```bash
          java -jar <專案名稱>.jar
          ```
    
    > (windows)注意，取消掉 `cmd` 的 `快速編輯模式`。
