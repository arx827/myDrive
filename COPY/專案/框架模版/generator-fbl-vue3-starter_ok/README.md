# Fbl-Vue3-Starter 前端框架產生器

#### version : 1.0.45
  - ##### [jFrog - Artifacts - npm 位置](http://10.42.70.218/ui/repos/tree/General/npm-local%2F@fubonlife%2Fgenerator-fbl-vue3-starter%2F-%2F@fubonlife)

  ## 版本更新紀錄
  - 1.0.44，(2023/05/30)
    - img 資料夾名稱 變更為 imgs
    - 將 ::v-deep 改寫為 v-deep()
    - 推薦擴充套件 prettier 換套
    - css align-items:start => flex-start
  - 1.0.45，(2023/05/30)
    - 調整 importVue return 格式
    - plugins/global => deepCopyData 改寫法
  - 1.1.0，(2023/07/21)
    - 調整 env 環境變數，區分 proxy / api path
  - 1.1.1，(2023/07/21)
    - 引用日期套件(@fubonlife/vue-datepicker-next)升版 => 1.0.8

## 使用產生器
  - ### 確認開發環境
    1. 首先須確認電腦已經安裝了 [node.js](https://nodejs.org/) 16+ (LTS：長期支援版)
    2. 確認 NPM registry 已經指向公司 [Artifactory](http://10.42.70.218/artifactory)，設定步驟如下:
        ```bash
        npm config set strict-ssl false
        npm config set registry http://10.42.70.218/artifactory/api/npm/npm/
        npm config set @fubonlife:registry http://10.42.70.218/artifactory/api/npm/npm-local/
        npm login --scope=@fubonlife --registry=http://10.42.70.218/artifactory/api/npm/npm-local/
        ```
    3. 透過 npm 安裝 [Yeoman](http://yeoman.io/): `npm install -g yo`
    4. 透過 npm 安裝 fbl-vue3-starter 產生器: `npm install -g @fubonlife/generator-fbl-vue3-starter@1.0`
      已經安裝過也請重新執行一次，確保抓取最新版本
    5. IDE: 建議使用 Visual Studio Code

  - ### 使用產生器生成一個新專案
    ```bash
    $ cd [欲生成專案的路徑]
    $ yo @fubonlife/fbl-vue3-starter
    ```
    之後在 `[欲生成專案的路徑]` 路徑之下，就會生成一個新的資料夾叫做 `xxx-web`。

    > 新專案生成後，請接續閱讀新專案目錄下的 `READEME.md` 檔案開始後續開發。
  - ### 參考
    [vue3_create](http://sdtwlvx00098:7990/bitbucket/projects/VL905/repos/vue3_create/browse)，內含教學用範例及詳細說明頁。
    從 bitbucket 下載後，請先執行 `npm install`，安裝相應套件。

--------------------
## 維運產生器 <small>(此區為 生成器的維運人員使用，非維運人員，請略過)</small>
  1. Clone 本專案
  2. 透過 `npm install` 安裝相依套件
  3. 建立臨時 link: `npm link`
  4. 開始調整相關檔案
  5. 測試方式:
      ```
      $ cd /path/to/generate/project
      $ yo @fubonlife/fbl-vue3-starter
      ```
  6. 發布更新後的產生器
      - 記得先調整 `package.json` 的版本號碼
      - 記得更新這份 `README.md` 當中提到產生器的版本號碼
      - 登入Artifactory: `npm login`
      - 開始發布: `npm publish`
  7. 移除臨時 link: `npm unlink`

