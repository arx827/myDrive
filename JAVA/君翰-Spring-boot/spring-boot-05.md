# spring-boot-starter-fbl-with-vue-day5

- http://sdtwlvx00098:7990/bitbucket/projects/VL901/repos/generator-vue-starter-fbl/browse

- `yo` 是 `node` 跟 `npm` 裡面是做專案模型初始化工具
- 安裝 `vue` 的坑
  - 使用產生器生成一個新專案
    ```sh
    cd /path/to/generate/project
    yo @fubonlife/vue-starter-fbl
    ```

    - (如果吃不到 `yo` 的話，一樣在 cmd 中，輸入指令 `C:\Windows\System32\cmd.exe /k "C:\Program Files\nodejs\nodevars.bat"` 之後再下 `yo` 這條指令)

    - 之後在 `/path/to/generate/project` 路徑之下，就會生成一個新的資料夾叫做 `xxx-web`。
    > 新專案生成後，請接續閱讀新專案目錄下的 `READEME.md` 檔案開始後續開發。

- 發布 Client SDK
  - 專案預設能夠生成並發布 Java、Typescript 兩種語言的前端 SDK。針對生成 Typesript 的部分，會需要先在本機裝好前端開發工具 Node (10+)。

  - 請透過以下指令自動生成並發布 Client SDK。其中 `-Drevision` 可自行指定發布之版本號碼。

  - 發布 `axios` SDK (採用 axios Http Client 實作適用任何 TypeScript 專案，例如: `Vue + Typescript` 之前端專案)
    ```sh
    mvn clean -Psdk-axios -Drevision=1.0.0-BETA  deploy
    ```

  - 發布 `angular` SDK (採用 Angular 的原生 `HttpClioent` 實作，僅適用 Angular 之前端專案)
    ```sh
    mvn clean -Psdk-ng -Drevision=1.0.0-BETA  deploy
    ```

  - 發布 `java` SDK (採用 `OkHttpClient` 實作，適用 Java 之前端專案)
    ```sh
    mvn clean -Psdk-java -Drevision=1.0.0-BETA  deploy
    ```

  - 發布 `swift` SDK (採用 `Alamofire` 實作，適用 Swift 之前端專案)
    ```sh
    mvn clean -Psdk-swift -Drevision=1.0.0-BETA  deploy
    ```

  - 亦可以一次同時發布多種 SDK，例如:
    ```sh
    mvn clean -Psdk-axios,sdk-ng,sdk-java -Drevision=1.0.0-BETA  deploy
    ```

    > 發布人員須事先向維運單位取得 [Artifactory](http://10.42.70.218/ui/packages) 的 Maven、NPM 發佈權限才能順利發佈 Client SDK 。詳見：本頁 針對 `Maven` 和 `Node` 的安裝設定。

  - 發布 Client SDK 後，如果有需要開發前端專案，可以參考以下兩種 Web 前端開發框架:
    - `Vue`: [vue-starter-fbl 前端框架產生器](http://sdtwlvx00098:7990/bitbucket/projects/VL901/repos/generator-vue-starter-fbl/browse)。
    - `Angular`: [ng-starter-fbl 前端框架產生器](http://sdtwlvx00098:7990/bitbucket/projects/VL901/repos/generator-ng-starter-fbl/browse)。

- 按指令安裝所需套件及執行，後續會顯示網址埠號。
  - 安裝需要的套件指令
    ```bash
    npm install
    ```

  - 啟動指令
    ```bash
    npm run serve
    ```

- Visual Studio Code (VSCode)
  1. 參考頁面: [Link](https://code.visualstudio.com/)
  2. Install
  3. 安裝必要Plugin
      - 啟動 VSCode 後點選左側，Extensions 按鈕
      - 搜尋並安裝『Vetur』(下載數最多者)
      - 搜尋並安裝『Angular Language Service』
      - 搜尋並安裝『Auto Close Tag』
      - 搜尋並安裝『Material Icon Theme』
      - 搜尋並安裝『XML Tools』
      - 搜尋並安裝『YAML』
      - 最後重新啟動 VSCode


