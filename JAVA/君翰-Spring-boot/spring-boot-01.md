## spring-boot-starter-fbl-with-spring-day1
  - ### 相關連結
    - #### [後端框架wiki - 資訊架構管理科](https://km.fubonlife.com.tw/confluence/pages/viewpage.action?pageId=791222107) 

  - ### 確認開發環境
    1. Maven 3.5+
    2. IDE (Eclipse / IntelliJ) 需擴充支援 Project Lombok，可參考[這邊](https://www.baeldung.com/lombok-ide)
    3. Maven Repository 指向公司 [Artifactory](http://10.42.70.218/artifactory)，設定步驟如下:
        - AD 帳號登入: http://10.42.70.218/artifactory (注意帳號英文部分須為小寫)
        - 點選右上角的個人帳號下拉選單，之後選擇 Edit Profile
        - 在 Current Password 輸入方塊當中填入 AD 密碼，之後按下 Unlock
        - 複製 Encrypted Password 處的加密密碼
        - 在 ~/.m2 資料夾下，新增一份檔案叫做 settings.xml，修改並填入以下內容:

          ```xml
          <!-- maven setting.xml -->
          <?xml version="1.0" encoding="UTF-8"?>
            <settings xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd" xmlns="http://maven.apache.org/SETTINGS/1.1.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <servers>
                <server>
                  <username>此處填入小寫 AD 帳號</username>
                  <password>此處填入加密密碼</password>
                  <id>central</id>
                </server>
                <server>
                  <username>此處填入小寫 AD 帳號</username>
                  <password>此處填入加密密碼</password>
                  <id>snapshots</id>
                </server>
              </servers>
              <profiles>
                <profile>
                  <repositories>
                    <repository>
                      <snapshots>
                        <enabled>false</enabled>
                      </snapshots>
                      <id>central</id>
                      <name>libs-release</name>
                      <url>http://10.42.70.218/artifactory/libs-release</url>
                    </repository>
                    <repository>
                      <snapshots />
                      <id>snapshots</id>
                      <name>libs-snapshot</name>
                      <url>http://10.42.70.218/artifactory/libs-snapshot</url>
                    </repository>
                  </repositories>
                  <pluginRepositories>
                    <pluginRepository>
                      <snapshots>
                        <enabled>false</enabled>
                      </snapshots>
                      <id>central</id>
                      <name>libs-release</name>
                      <url>http://10.42.70.218/artifactory/libs-release</url>
                    </pluginRepository>
                    <pluginRepository>
                      <snapshots />
                      <id>snapshots</id>
                      <name>libs-snapshot</name>
                      <url>http://10.42.70.218/artifactory/libs-snapshot</url>
                    </pluginRepository>
                  </pluginRepositories>
                  <id>artifactory</id>
                </profile>
              </profiles>
              <activeProfiles>
                <activeProfile>artifactory</activeProfile>
              </activeProfiles>
            </settings>
          ```

  - ### 使用產生器生成一個新專案
    - #### JPA版
      ```sh
      $ mvn archetype:generate -DarchetypeGroupId=com.fubonlife -DarchetypeArtifactId=spring-boot-starter-fbl-archetype -DarchetypeVersion=1.1.2
      ```

    - #### MyBatis版
      ```sh
      $ mvn archetype:generate -DarchetypeGroupId=com.fubonlife -DarchetypeArtifactId=spring-boot-starter-fbl-mybatis-dev-archetype -DarchetypeVersion=1.1.1
      ```

    - 範例
      - `groupId`: com.fubonlife
      - `artifactId`: shop-backend
      - `version` 1.0-SNAPSHOP : 
      - `package`: com.fubonlife
      - `code`: shop

  - ### 生成後的結構
    ```sh
    └── shop-backend        # maven 檔案，定義 這個專案 該要執行 編譯、打包、測試、部署 生命週期
        ├── shop-api/       # api
        ├── shop-batch/     # 排程
        ├── shop-common/    # 共用
        ├── pom.xml
        └── README.md
    ```

  - ### 設定調整
    - #### CrowdSSO 服務設定
      1. 專案預設會啟用 `CrowdSSO` 服務，事前須先與 `CrowdSSO` 管理單位申請並取得一組 `Crowd APP` 帳號密碼，並將該帳密填入於 `shop-common/src/main/resources/config/application-local.yml`:
      ```yml
      crowd:
        appname: YOUR_CROWD_APP_NAME
        password: YOUR_CROWD_APP_PASSWORD
      ```

      2. 如果不需使用 CrowdSSO 服務，請逕行刪除以下:
        - 刪除 shop-common/src/main/resources/config/application-local.yml 當中的 crowd 段落
        - 刪除 shop-api/src/main/java/shop/api/app/Application.java 當中的 @EnableFblCrowd 標記

      - 輸入測試帳密
        - appname: ssodemo
        - password: Password1

    - #### DB_Intra 連線設定
      1. 專案預設使用 H2 來模擬一個測試用的 In-Memory DB_Intra 資料庫來存放測試的部門/員工資料。若決定暫時使用此模擬資料庫作為員工資料來源，請將測試部門/員工資料，填入於 shop-common/src/main/resources/intra.sql。

      2. 若已經向 DB_Intra 維運單位申請到資料庫存取權限，請逕行修改位於 shop-common/src/main/resources/config/application-local.yml 的 JDBC 連線設定，直接使用真正的 DB_Intra 作為員工資料來源。

      ```yml
      spring:
        intra-datasource:
          driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
          password: YOUR_DB_PASSWORD
          jdbc-url: YOUR_DB_JDBC_URL
          username: YOUR_DB_USER_NAME
      ```




打 h2: http://localhost:8181/h2-console 
jdbc-url:  (intra  or  primary)   
password: password


