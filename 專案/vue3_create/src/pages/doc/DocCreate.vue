<script setup lang="ts">
import Img_bundler from '@img/bundler.37740380.png'
import Img_esm from '@img/esm.3070012d.png'
import Img_vuex from '@img/1_FswHvFsErWNxNkDluWp6Jg.jpeg'
import Img_antd from '@img/antd.png'
import Img_bs from '@img/bootstrap.png'
import Img_yaoman from '@img/yaoman_執行畫面.png'
import Img_jfrog from '@img/jfrog.png'
import Img_vscode_1 from '@img/vscode_1.png'
import Img_vscode_2 from '@img/md_image1.png'
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">Vue3模板 說明</h5>
      <ul>
        <li>『 簡單生成 』，能夠簡易生成專案的基礎架構</li>
        <li>『 減少設定 』，減少重複的開發前設定</li>
        <li>『 統一規範 』，底層已設置 ESLint、VSCode 程式碼統一規範</li>
        <li>『 模組架構 』，模組化修改更容易</li>
        <li>『 快速上手 』，已涵蓋Demo程式碼，入門簡易</li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">開發環境</h5>
      <ul>
        <li>NVM (latest)(選配)</li>
        <li>Node 14.18+ 或 16+ (LTS：長期支援版)(Vite兼容性需求)</li>
        <li>
          Npm (Npm版本，依 Node版本 對應) (
          <a href="https://nodejs.org/en/download/releases/" target="_blank">查詢對應版號</a> )
        </li>
        <li>Visual Studio Code (VScode)</li>
        <li>ESLint</li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">前端工具介紹</h5>
      <ul class="doc__tool-ul">
        <!-- Vue -->
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">Vue</h5>
          <div class="doc__info">
            <a-descriptions bordered size="small" :column="1">
              <a-descriptions-item label="類型">前端框架</a-descriptions-item>
              <a-descriptions-item label="版本號">(latest) 3.2.41</a-descriptions-item>
              <a-descriptions-item label="相關連結"
                ><a href="https://cn.vuejs.org/" target="_blank">https://cn.vuejs.org/</a></a-descriptions-item
              >
            </a-descriptions>
            <div class="doc__caption">
              <ul class="doc__caption-ul">
                <li>
                  是一款用於構建用戶界面的JavaScript 框架。基於標準HTML、CSS
                  和JavaScript構建，並提供了一套聲明式的、組件化的編程模型。
                </li>
                <li>Vue.js 官方團隊已在 2020/09/18 正式發佈 Vue 3.0 版本</li>
                <li>運行於 Node 版本: v16 以上</li>
                <li>
                  由於 Vue.js 開發團隊，在盡量不變動 API 的前提下，對 Vue.js 進行了底層核心的重寫，這對 Vue
                  2.x過去的幾個明顯缺點進行了重大的改進，並在此基礎上添加了一些更好用的新功能。
                </li>
                <li>避免全域套件污染，Vue3 開始不再提供功能的全域性註冊，而是註冊在根元件實體上。</li>
              </ul>
            </div>
          </div>
        </li>
        <!-- create-vue -->
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">Create-vue</h5>
          <div class="doc__info">
            <a-descriptions bordered size="small" :column="1">
              <a-descriptions-item label="類型">前端框架</a-descriptions-item>
              <a-descriptions-item label="版本號">(latest) 3.4.0</a-descriptions-item>
              <a-descriptions-item label="相關連結"
                ><a href="https://www.npmjs.com/package/create-vue" target="_blank"
                  >https://www.npmjs.com/package/create-vue</a
                ></a-descriptions-item
              >
            </a-descriptions>
            <div class="doc__caption">
              <ul class="doc__caption-ul">
                <li>Vue 官方的腳手架工具，能簡單生成基礎 Vue 架構</li>
                <li>npm init vue@[create-vue版本]，此安裝輸入的是create-vue版本號，並非輸入Vue版本號</li>
              </ul>
            </div>
          </div>
        </li>
        <!-- Vite -->
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">Vite</h5>
          <div class="doc__info">
            <a-descriptions bordered size="small" :column="1">
              <a-descriptions-item label="類型">建置工具</a-descriptions-item>
              <a-descriptions-item label="版本號">3.1.8</a-descriptions-item>
              <a-descriptions-item label="相關連結"
                ><a href="https://cn.vitejs.dev/" target="_blank">https://cn.vitejs.dev/</a></a-descriptions-item
              >
            </a-descriptions>
            <div class="doc__caption">
              <ul class="doc__caption-ul">
                <li>
                  <strong>建置工具：</strong> 提供開發者一個快速建置 Vue.js 架構，包含相關功能、套件安裝。<br />只要簡單勾選欲安裝的選項，建置工具就會產生Vue完整架構及完成相關設定。
                </li>
                <li>
                  <strong>Vite：</strong> 是 Vue.js 的作者所做的一個新的 bundler，不同於以往的建置工具
                  (如：<strong>VueCli</strong>)，<strong>Vite在本地端開發階段時不做打包</strong>，而是使用原生瀏覽器支援的
                  es6 module 來載入相依性 (等到瀏覽器遇到 import
                  語句時才發出模組的請求)，使前端啟動開發伺服器時，能快速啟動。
                </li>
                <li>
                  不過 Vite 在
                  <strong>production build 時還是會做打包</strong>，會將所有套件的相依性一起編譯進JavaScript。
                </li>
                <li>
                  Vite 延伸了原本打包的精神，並<strong>解決啟動開發環境時，緩慢的編譯速度</strong>
                  (只要檔案經過變更就需要重新打包)。
                </li>
                <li>Bundle 比較 (左圖為 Bundle、右圖為 ESM)</li>
              </ul>
              <div class="d-flex gap-3">
                <a-image-preview-group>
                  <a-image :src="Img_bundler" width="100%" />
                  <a-image :src="Img_esm" width="100%" />
                </a-image-preview-group>
              </div>
            </div>
          </div>
        </li>
        <!-- Pinia -->
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">Pinia</h5>
          <div class="doc__info">
            <a-descriptions bordered size="small" :column="1">
              <a-descriptions-item label="類型">全域狀態管理</a-descriptions-item>
              <a-descriptions-item label="版本號">2.0.14</a-descriptions-item>
              <a-descriptions-item label="相關連結"
                ><a href="https://pinia.vuejs.org/" target="_blank">https://pinia.vuejs.org/</a></a-descriptions-item
              >
            </a-descriptions>
            <div class="doc__caption">
              <ul class="doc__caption-ul">
                <li>可以管理複雜應用的資料狀態，比如元件間的通訊、多層巢狀的元件的傳值等等。</li>
                <li>資料管理不再只是 父傳子、子傳父。</li>
                <li>
                  可以進行全域性資料管理。如：loading 圖示開啟與關閉的狀態，整個專案共用同個loading
                  時，可以藉由全域狀態控制開關 (set)，並能取得目前loading狀態 (get)
                </li>
                <li>
                  Pinia vs. Vuex
                  <ul>
                    <li>移除 Mutations (簡化了複雜的使用方式)</li>
                    <li>Typescript 不再需要多餘的 types 來包裝 (對於TypeScript 更友善)</li>
                    <li>所有模組都已自動 namespaced (簡化繁瑣的命名宣告)</li>
                  </ul>
                </li>
                <li>使用方式與 Vuex 雷同，且為官方推薦套件。</li>
              </ul>
              <div class="d-flex gap-3">
                <a-image-preview-group>
                  <a-image class="border" :src="Img_vuex" width="100%" />
                </a-image-preview-group>
              </div>
            </div>
          </div>
        </li>
        <!-- Ant Design Vue -->
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">Ant Design Vue</h5>
          <div class="doc__info">
            <a-descriptions bordered size="small" :column="1">
              <a-descriptions-item label="類型">UI 組件庫</a-descriptions-item>
              <a-descriptions-item label="版本號">3.2.14</a-descriptions-item>
              <a-descriptions-item label="相關連結"
                ><a href="https://antdv.com/components/overview-cn" target="_blank"
                  >https://antdv.com/components/overview-cn</a
                ></a-descriptions-item
              >
            </a-descriptions>
            <div class="doc__caption">
              <ul class="doc__caption-ul">
                <li>為Ant Design的Vue版本UI組件庫。</li>
                <li>擁有豐富的Vue組件庫與開發方案，使開發Vue專案更省力。</li>
                <li>Ant Design Vue v3 版本，針對 Vue3 所開發，並針對TypeScript重構了所有組件。</li>
                <li>版本3 容量更小、更輕量，並修正舊版本Bug。</li>
              </ul>
              <div class="d-flex gap-3">
                <a-image-preview-group>
                  <a-image class="border" :src="Img_antd" width="100%" />
                </a-image-preview-group>
              </div>
            </div>
          </div>
        </li>
        <!-- Bootstrap -->
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">Bootstrap</h5>
          <div class="doc__info">
            <a-descriptions bordered size="small" :column="1">
              <a-descriptions-item label="類型">CSS 框架</a-descriptions-item>
              <a-descriptions-item label="版本號">5.2.2</a-descriptions-item>
              <a-descriptions-item label="相關連結"
                ><a href="https://getbootstrap.com/docs/5.0/getting-started/doc/" target="_blank"
                  >https://getbootstrap.com/docs/5.0/getting-started/doc/</a
                ></a-descriptions-item
              >
            </a-descriptions>
            <div class="doc__caption">
              <ul class="doc__caption-ul">
                <li>由Twitter開發者所開發。</li>
                <li>開發介面時，提高不同頁面樣式的統一性。</li>
                <li>提升客製化樣式時的開發速度。</li>
                <li>Bootstrap 5 已擺脫依賴於 jQuery 束縛 (舊版本Bootstrap 使用前，需要額外安裝 jQuery)。</li>
                <li>
                  由於專案越趨龐大，且客製化複雜，為了補足Ant Design Vue 調整設定上的不便， 使用Bootstrap來調整版面，
                  Bootstrap 擁有豐富的排版樣式，以及簡單易用的class名稱， 以Bootstrap 作為 Ant Design Vue
                  的輔助版面調整框架。
                </li>
              </ul>
              <div class="d-flex gap-3">
                <a-image-preview-group>
                  <a-image class="border" :src="Img_bs" width="100%" />
                </a-image-preview-group>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">生成器前置作業</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">確認 Node版本</h5>
          <PreCode type="bash">
            <template #code>
              {{
                `node -v
                v16.19.0`
              }}
            </template>
          </PreCode>
          <PreCode type="bash">
            <template #code>
              {{
                `npm -v
                8.5.5 (對應node版本)`
              }}
            </template>
          </PreCode>
          <p>正常出現版號，表示已安裝，若無 或 版號不符14.18+ 或 16+，請先安裝</p>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">確認 是否已有測試區帳號</h5>
          <ul>
            <li>
              NPM registry 後續設定會指向公司 [
              <a href="http://10.42.70.218/ui/login/" target="_blank">Artifactory</a> ]
            </li>
            <li>請先確認是否可正常登入</li>
          </ul>
          <div class="d-flex gap-3">
            <a-image-preview-group>
              <a-image class="border" :src="Img_jfrog" width="100%" />
            </a-image-preview-group>
          </div>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">設定 NPM registry</h5>
          <PreCode type="bash">
            <template #code>
              {{
                `npm config set strict-ssl false
npm config set registry http://10.42.70.218/artifactory/api/npm/npm/
npm config set @fubonlife:registry http://10.42.70.218/artifactory/api/npm/npm-local/
npm login --scope=@fubonlife --registry=http://10.42.70.218/artifactory/api/npm/npm-local/`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">安裝 Yeoman</h5>
          <PreCode type="bash">
            <template #code>
              {{ `npm install -g yo` }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">安裝 starter-vue3 產生器</h5>
          <PreCode type="bash">
            <template #code>
              {{ `npm install -g @fubonlife/generator-starter-vue3@1.0` }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">產生新專案</h5>
          生成器會自動產生專案資料夾(xxx-web)，無須手動新增資料夾
          <PreCode type="bash">
            <template #code>
              {{
                `cd [欲生成專案的路徑]
yo @fubonlife/starter-vue3`
              }}
            </template>
          </PreCode>
          <div class="d-flex gap-3">
            <a-image-preview-group>
              <a-image class="border" :src="Img_yaoman" width="50%" />
            </a-image-preview-group>
          </div>
          <p>若還未有 API Client SDK，請選擇 n，</p>
          <p>會因此項回答，產生不同資料，或報錯</p>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">安裝專案套件</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">進入專案資料夾</h5>
          <PreCode type="bash">
            <template #code>
              {{ `cd [專案路徑]` }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">安裝相依套件</h5>
          <PreCode type="bash">
            <template #code>
              {{ `npm install` }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">運行Dev</h5>
          <PreCode type="bash">
            <template #code>
              {{ `npm run dev` }}
            </template>
          </PreCode>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">安裝VScode所需延伸模組</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">開啟延伸模組</h5>
          vscode > 檢視 > 延伸模組 (<span class="c-red">Ctrl + Shift + X </span> )
          <div class="d-flex gap-3">
            <a-image-preview-group>
              <a-image class="border" :src="Img_vscode_1" width="50%" />
            </a-image-preview-group>
          </div>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">篩選 推薦模組</h5>
          <ul>
            <li>點選上方 『篩選』按鈕 > 『推薦』</li>
            <li>安裝所有『 工作區推薦 』模組</li>
            <li>部分模組需重新啟動</li>
          </ul>
          <div class="d-flex gap-3">
            <a-image-preview-group>
              <a-image class="border" :src="Img_vscode_2" width="50%" />
            </a-image-preview-group>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
