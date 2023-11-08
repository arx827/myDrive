# IFAP Web

## 開發環境

1. 作業系統需安裝 **node** 10+
2. 確保 npm registry 指向公司 [Artifactory](http://10.42.70.218/artifactory)，可透過以下指令完成
   ```bash
   npm config set strict-ssl false
   npm config set registry http://10.42.70.218/artifactory/api/npm/npm/
   npm config set @fubonlife:registry http://10.42.70.218/artifactory/api/npm/npm-local/
   npm login --scope=@fubonlife --registry=http://10.42.70.218/artifactory/api/npm/npm-local/
   ```
   
3. 透過 `npm install -g @vue/cli@4.5.8` 指令來安裝 [Vue CLI](https://cli.vuejs.org/)
4. **IDE**: 建議使用 Visual Studio Code 或者 [WebStorm](https://www.jetbrains.com/webstorm/)

## 初始設定調整

本專案需搭配後端 OpenAPI 自動生成之 Client SDK 使用，使用前請確認至少已經發布一個個版本的 TypeScript Client SDK。並於 `package.json` 檔案上調整套件名稱及版本:
```json
// ...略...
"dependencies": {
    // ...略...
    "@fubonlife/ifap-api-ng-sdk": "1.0.0-BETA",
    // ...略...
},
// ...略...
```

## 安裝所需套件

```bash
# 在專案目錄下執行
$ npm install
```

## Local Run / Debug

```bash
# 在專案目錄下執行
$ npm run serve
```
> 接著瀏覽至 `http://localhost:8081/` (注意 Port 號可能不同，以 console 輸出顯示的為準) 即可看到網站。當原始碼有異動時，網站會自動 Hot Reload。

## 各環境設定

DEV, UAT, PROD 等各環境的 Runtime 設定 (例如 API Base URL)，可在 `.env`、`.env.local`、`.env.development`、`.env.uat` 系列檔案設定，須在打包以前就先設定好。

## 打包

1. 純粹打包為靜態網站目錄，請使用以下指令
    ```bash
    # 在專案目錄下執行
    $ npm run build:dev
    ```

2. 直接打包為 WAR 檔 (部署在 JBOSS EAP, WAS)，請使用以下指令
    ```bash
    # 在專案目錄下執行
    $ mvn package -Pdev

    # 亦可透過 profile 指定編譯為其他環境:
    # mvn package -Pstaging
    # mvn package -Puat
    # mvn package -Pprod
    ```

    > 預設會使用 ArtifactId (`ifap-web`) 作為 context root，可以透過指令參數改為客製化的 context root: `mvn package -Pdev -DcontextRoot=my-context-root`


## JBoss EAP Domain Mode 建議部署設定

1. `host.xml` 的 **jvms** 區塊，確認 Memory 加到適當的大小:

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


2. `domain.xml` 加入 Server Group:
    * 調整適當的 `port-offset`
    * 調整 `initial-host` 指向 Domain 的 JGroups Peer Discovery 位置

    ```xml
    <server-groups>
        <server-group name="ifap-web" profile="full-ha">
            <jvm name="default" env-classpath-ignored="false">
            </jvm>
            <socket-binding-group ref="full-ha-sockets" port-offset="21"/>
            <deployments>
            </deployments>
            <system-properties>
                <property name="initial_hosts" value="10.240.70.43[7600]"/>
            </system-properties>
        </server-group>
    </server-groups>
    ```


3. `host.xml`  的 **servers** 區塊，加入一至數台的 Servers，作爲 Server Group 的成員。
    * `group` 就是剛剛建立 Server Group Name
    * `custom.jboss.server.log.dir` 指向外部 Log 資料夾 (通常要在 LV 內)
    * 調整適當的 `port-offset`

    ```xml
    <servers>
        <server name="ifap-web-dx287" group="ifap-web" auto-start="true">
            <paths>
                <path name="custom.jboss.server.log.dir" path="/jbossLog/server/ifap-web-dx287"/>
            </paths>
            <jvm name="default" debug-enabled="false" env-classpath-ignored="false"/>
            <socket-bindings socket-binding-group="full-ha-sockets" port-offset="21"/>
        </server>
    </servers>
    ```


## 其他

1. 本專案初始架構是透過 [Vue CLI](https://cli.vuejs.org/) 4.5.8 生成。
2. 可透過 `vue --help` 來獲得更多幫助。
