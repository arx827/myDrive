shop-backend
===

## 專案初始化

### 準備開發環境
1. Maven 3.5+
2. IDE (Eclipse / IntelliJ) 需擴充支援 Project Lombok，可參考[這邊](https://www.baeldung.com/lombok-ide)
3. Maven Repository 指向公司 [Artifactory](http://10.42.70.218/artifactory)，設定步驟如下:
    1. AD 帳號登入: http://10.42.70.218/artifactory (注意帳號英文部分須為小寫)
    2. 點選右上角的個人帳號下拉選單，之後選擇 `Edit Profile`
    3. 在 `Current Password` 輸入方塊當中填入 AD 密碼，之後按下 `Unlock`
    3. 複製 `Encrypted Password` 處的加密密碼
    7. 在 `~/.m2` 資料夾下，新增一份檔案叫做 `settings.xml`，修改並填入以下內容:
      ```xml
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

### 設定調整

#### CrowdSSO 服務設定

1. 專案預設會啟用 CrowdSSO 服務，事前須先與 CrowdSSO 管理單位申請並取得一組 Crowd APP 帳號密碼，並將該帳密填入於 `shop-common/src/main/resources/config/application-local.yml`:
```yml
crowd:
  appname: YOUR_CROWD_APP_NAME
  password: YOUR_CROWD_APP_PASSWORD
```

2. 如果不需使用 CrowdSSO 服務，請逕行刪除以下:
   * 刪除 `shop-common/src/main/resources/config/application-local.yml` 當中的 `crowd` 段落
   * 刪除 `shop-api/src/main/java/shop/api/app/Application.java` 當中的 `@EnableFblCrowd` 標記

#### DB_Intra 連線設定

1. 專案預設使用 H2 來模擬一個測試用的 In-Memory DB_Intra 資料庫來存放測試的部門/員工資料。若決定暫時使用此模擬資料庫作為員工資料來源，請將測試部門/員工資料，填入於 `shop-common/src/main/resources/intra.sql`。
2. 若已經向 DB_Intra 維運單位申請到資料庫存取權限，請逕行修改位於 `shop-common/src/main/resources/config/application-local.yml` 的 JDBC 連線設定，直接使用真正的 DB_Intra 作為員工資料來源。
    ```yml
    spring:
      intra-datasource:
        driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
        password: YOUR_DB_PASSWORD
        jdbc-url: YOUR_DB_JDBC_URL
        username: YOUR_DB_USER_NAME
    ```

    * 以上修改完畢後，請接著進行以下步驟:
     1. 刪除 H2 專用的 SQL 腳本 `shop-common/src/main/resources/schema-intra.sql`, `shop-common/src/main/resources/data-intra.sql`
     2. 刪除 `shop-common/src/main/java/shop/common/config/IntraDataSourceConfiguration.java` 檔案當中的下列段落：

        ```
        @Bean
        public DataSourceInitializer dataSourceInitializer(@Qualifier("intraDataSource") DataSource datasource) {
            ResourceDatabasePopulator resourceDatabasePopulator = new ResourceDatabasePopulator();
            resourceDatabasePopulator.addScript(resourceLoader.getResource("classpath:/schema-" + platform + ".sql"));
            resourceDatabasePopulator.addScript(resourceLoader.getResource("classpath:/data-" + platform + ".sql"));

            DataSourceInitializer dataSourceInitializer = new DataSourceInitializer();
            dataSourceInitializer.setDataSource(datasource);
            dataSourceInitializer.setDatabasePopulator(resourceDatabasePopulator);
            return dataSourceInitializer;
        }
        ```

3. 若專案不需要使用 DB_Intra 則請刪除 `shop-common/src/main/resources/config/application-local.yml` 的 `spring.intra-datasource` 段落，並且也刪除以下檔案:
    * `shop-common/src/main/java/shop/common/config/IntraDataSourceConfiguration.java`
    * `shop-common/src/main/java/shop/common/config/IntraRepositoryConfiguration.java`
    * `shop-common/src/main/java/shop/common/service/impl/IntraDepartmentServiceImpl.java`
    * `shop-common/src/main/java/shop/common/service/impl/IntraEmployeeServiceImpl.java`
    * `shop-common/src/main/java/shop/common/service/IntraDepartmentService.java`
    * `shop-common/src/main/java/shop/common/service/IntraEmployeeService.java`
    * `shop-common/src/main/resources/intra.sql`
    * Package: `shop-common/src/main/java/shop/common/entity/intra`
    * Package: `shop-common/src/main/java/shop/common/repository/intra`

#### 主要資料庫連線設定

1. 專案預設使用 H2 來模擬一個測試用的 In-Memory 資料庫來存放 DEMO 資料，若決定暫時使用此模擬資料庫作為主要資料來源，則請調整 `shop-common/src/main/resources/primary.sql` 腳本內容。主要需要調整以下這一行:
```sql
-- 建立測試帳號， EMPLOYEE_ID '999999' 請自行修改為測試人員的員工號碼
INSERT INTO SHOP_ACCOUNT (ID, ENABLED, EMPLOYEE_ID) VALUES ('1', '1', '999999');
```

2. 若已經向 DBA 申請到專案用的 Oracle, MSSQL 資料庫:
  * 請逕行調整位於 `shop-common/src/main/resources/config/application-local.yml` 的主要資料來源 JDBC 設定，並刪除 H2 專用的 SQL 腳本 `shop-common/src/main/resources/primary.sql`:
    ```yaml
    spring:
      datasource:
        driver-class-name: oracle.jdbc.OracleDriver
        password: YOUR_DB_PASSWORD
        jdbc-url: YOUR_DB_JDBC_URL
        username: YOUR_DB_USER_NAME
    ```

   * 請依據資料庫類型，在 `shop-common/src/main/java/shop/common/config/PrimaryRepositoryConfiguration.java` 調整至適當 SQL Dialect:
     ```java
     private Map<String, Object> getVendorProperties() {
         Map<String, Object> retVal = jpaProperties.getHibernateProperties(new HibernateSettings());
         retVal.put("hibernate.dialect", "org.hibernate.dialect.Oracle12cDialect");
         return retVal;
     }
     ```
     * Oracle SQL Dialect 名稱: `org.hibernate.dialect.Oracle12cDialect`
     * MSSQL SQL Dialect 名稱: `org.hibernate.dialect.SQLServer2008Dialect`
     * DB2 SQL Dialect 名稱: `org.hibernate.dialect.DB2Dialect`


#### JWT 簽名設定

1. 專案使用 JWT 作為前後端身份識別的憑證，相關設定位於 `shop-common/src/main/resources/config/application-local.yml`
```yaml
jwt:
  secret: "YOUR_JWT_SECRET"
  expiration: 86400
  refresh-expiration: 86400
  issuer: dtw.fbl
```

2. 如果不需使用 JWT，請刪除 `shop-api/src/main/java/shop/api/app/Application.java` 當中的 `@EnableFblJwt` 標記

#### IDE 運行設定

1. 請在 IDE (Eclipse / IntelliJ) 將本專案的 Run Configuration 設為為普通 Java Application 即可，並套用設定如下:

  * Main Class: `com.fubonlife.abc.api.app.Application`
  * VM Arguments: `-Dspring.profiles.active=local`

2. 若成功運行之後，可利用瀏覽器前往 [http://localhost:8181/swagger-ui.html](http://localhost:8181/swagger-ui.html)。看看是否能正常看到 API 文件頁面。


#### 其它
  1. 本專案核心功能來自 `spring-boot-starter-fbl` 函數庫，更多關於 `spring-boot-starter-fbl` 的設定方式，請參閱[連結](http://sdtwlvx00098:7990/bitbucket/projects/VL901/repos/spring-boot-starter-fbl/browse)


## 編譯打包

1. 打包為 WAR 檔 (運行在 JBOSS EAP, Tomcat, WAS...)

```bash
## 一次打包全部子模組
$ mvn clean package -Pwar -Dmaven.test.skip=true

## 僅打包單一子模組 (例如: shop-batch)
$ mvn -pl :shop-batch -am clean package -Pwar -Dmaven.test.skip=true
```

2. 打包為可獨立運行之 JAR 檔 (用於 Docker 容器)

```
## 一次打包全部子模組
$ mvn clean package

## 僅打包單一子模組 (例如: shop-batch)
$ mvn -pl :shop-batch -am clean package -Dmaven.test.skip=true
```


## 發布 Client SDK

1. 專案預設能夠生成並發布 Java、Typescript 兩種語言的前端 SDK。針對生成 Typesript 的部分，會需要先在本機裝好前端開發工具 Node (10+)。

2. 請透過以下指令自動生成並發布 Client SDK。其中 `-Drevision` 可自行指定發布之版本號碼。

* 發布 `axios` SDK (採用 axios Http Client 實作適用任何 TypeScript 專案，例如: `Vue + Typescript` 之前端專案)
```
$ mvn clean -Psdk-axios -Drevision=1.0.0-BETA  deploy
```

* 發布 `angular` SDK (採用 Angular 的原生 `HttpClioent` 實作，僅適用 Angular 之前端專案)
```
$ mvn clean -Psdk-ng -Drevision=1.0.0-BETA  deploy
```

* 發布 `java` SDK (採用 `OkHttpClient` 實作，適用 Java 之前端專案)
```
$ mvn clean -Psdk-java -Drevision=1.0.0-BETA  deploy
```

* 發布 `swift` SDK (採用 `Alamofire` 實作，適用 Swift 之前端專案)
```
$ mvn clean -Psdk-swift -Drevision=1.0.0-BETA  deploy
```

* 亦可以一次同時發布多種 SDK，例如:
```
$ mvn clean -Psdk-axios,sdk-ng,sdk-java -Drevision=1.0.0-BETA  deploy
```


> 發布人員須事先向維運單位取得 [Artifactory](http://10.42.70.218/artifactory) 的 Maven、NPM 發佈權限才能順利發佈 Client SDK 。詳見：[本頁](02 軟體開發工具) 針對 `Maven` 和 `Node` 的安裝設定。

3. 發布 Client SDK 後，如果有需要開發前端專案，可以參考以下兩種 Web 前端開發框架:
   * Vue:  [vue-starter-fbl 前端框架產生器](http://sdtwlvx00098:7990/bitbucket/projects/VL901/repos/generator-vue-starter-fbl/browse)。
   * Angular: [ng-starter-fbl 前端框架產生器](http://sdtwlvx00098:7990/bitbucket/projects/VL901/repos/generator-ng-starter-fbl/browse)。


## JBoss EAP Domain Mode 建議部署設定

### shop-api 的 Domain 設定

1. `/jbossas/jboss-eap/domain/configuration/host.xml` 的 **jvms** 區塊，確認 Memory 加到適當的大小:

    ```xml
    <jvms>
        <jvm name="default">
            <heap size="64m" max-size="1024m"/>
            <jvm-options>
                <option value="-server"/>
                <option value="-XX:MetaspaceSize=96m"/>
                <option value="-XX:MaxMetaspaceSize=1024m"/>
                <option value="--add-exports=java.base/sun.nio.ch=ALL-UNNAMED"/>
            </jvm-options>
        </jvm>
    </jvms>

    ```


2. `/jbossas/jboss-eap/domain/configuration/domain.xml` 加入 Server Group:
    * JVM Option 記得指定 Spring Profile (例如 `dev`, `staging`, `prod`)
    * 調整適當的 `port-offset`
    * 調整 `initial-host` 指向 Domain 的 JGroups Peer Discovery 位置

    ```xml
    <server-groups>
        <server-group name="shop-api" profile="full-ha">
            <jvm name="default" env-classpath-ignored="false">
                <jvm-options>
                    <option value="-Dspring.profiles.active=dev"/>
                </jvm-options>
            </jvm>
            <socket-binding-group ref="full-ha-sockets" port-offset="10"/>
            <deployments>
            </deployments>
            <system-properties>
                <property name="initial_hosts" value="10.240.70.43[7600]"/>
            </system-properties>
        </server-group>
    </server-groups>
    ```


3. `/jbossas/jboss-eap/domain/configuration/host.xml`  的 **servers** 區塊，加入一至數台的 Servers，作爲 Server Group 的成員。
    * `group` 就是剛剛建立 Server Group Name
    * `custom.jboss.server.log.dir` 指向外部 Log 資料夾 (通常要在 LV 內)
    * 調整適當的 `port-offset`

    ```xml
    <servers>
        <server name="shop-api-dx287" group="shop-api" auto-start="true">
            <paths>
                <path name="custom.jboss.server.log.dir" path="/jbossLog/server/shop-api-dx287"/>
            </paths>
            <jvm name="default" debug-enabled="false" env-classpath-ignored="false"/>
            <socket-bindings socket-binding-group="full-ha-sockets" port-offset="10"/>
        </server>
    </servers>
    ```
