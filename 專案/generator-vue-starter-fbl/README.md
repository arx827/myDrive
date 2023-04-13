# vue-starter-fbl 前端框架產生器

## 使用產生器

### 確認開發環境
1. 首先須確認電腦已經安裝了 [node.js](https://nodejs.org/) 10+
2. 確認 NPM registry 已經指向公司 [Artifactory](http://10.42.70.218/artifactory)，設定步驟如下:
   ```bash
   npm config set strict-ssl false
   npm config set registry http://10.42.70.218/artifactory/api/npm/npm/
   npm config set @fubonlife:registry http://10.42.70.218/artifactory/api/npm/npm-local/
   npm login --scope=@fubonlife --registry=http://10.42.70.218/artifactory/api/npm/npm-local/
   ```

3. 透過 npm 安裝 VueCLI: `npm install -g @vue/cli@4.5.8`
4. 透過 npm 安裝 [Yeoman](http://yeoman.io/): `npm install -g yo`
5. 透過 npm 安裝 vue-starter-fbl 產生器: `npm install -g @fubonlife/generator-vue-starter-fbl@1.0.13`

### 使用產生器生成一個新專案
```bash
$ cd /path/to/generate/project
$ yo @fubonlife/vue-starter-fbl
```
之後在 `/path/to/generate/project` 路徑之下，就會生成一個新的資料夾叫做 `xxx-web`。

> 新專案生成後，請接續閱讀新專案目錄下的 `READEME.md` 檔案開始後續開發。 


## 維運產生器

1. Clone 本專案
2. 透過 `npm install` 安裝相依套件
3. 建立臨時 link: `npm link`
4. 開始調整相關檔案
5. 測試方式:
  ```
  $ cd /path/to/generate/project
  $ yo @fubonlife/vue-starter-fbl
  ```
6. 發布更新後的產生器
  * 記得先調整 `package.json` 的版本號碼
  * 記得更新這份 `README.md` 當中提到產生器的版本號碼
  * 開始發布: `npm publish`
7. 移除臨時 link: `npm unlink`