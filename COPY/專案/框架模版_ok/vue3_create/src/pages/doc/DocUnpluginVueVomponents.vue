<script setup lang="ts">
import Img_unpluginComponents from '@img/unpluginComponents.png'
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">unplugin-vue-components 自動引入機制</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          套件：<a href="https://github.com/antfu/unplugin-vue-components" target="_blank">unplugin-vue-components</a>
        </li>
        <li class="doc__tool-li">支持 Vue2 和 Vue3</li>
        <li class="doc__tool-li">支持 Vite、Webpack、Vue Cli 等</li>
        <li class="doc__tool-li">完整的支持 TypeScript</li>
        <li class="doc__tool-li">Tree-shakable，打包時只安裝有用到的組件</li>
        <li class="doc__tool-li">以文件名稱作為命名空間</li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">unplugin-vue-components 使用方法</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">安裝套件</h5>
          <PreCode type="bash">
            <template #code>
              {{ `npm install unplugin-vue-components -D` }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">Vite配置</h5>
          <ul class="doc__tool-ul">
            <li class="doc__tool-li">套件會自動查找 引入的 Components 找到相應的檔案，自動全局引入</li>
            <li class="doc__tool-li">利用 include 、 exclude 設定 盤查掃描範圍 包含 及 排除</li>
            <li class="doc__tool-li">
              會自動產生 掛載於 全域Component 的 name 與 載入路徑檔案 對應位置檔 (auto-components.d.ts)，後面講解。
            </li>
            <li class="doc__tool-li">
              針對 UI組件庫，設定自動載入，以 Ant design Vue 為例，其他UI庫請查找
              <a href="https://github.com/antfu/unplugin-vue-components#importing-from-ui-libraries" target="_blank"
                >unplugin-vue-components</a
              >
            </li>
          </ul>
          <PreCode type="ts" class="mt-3">
            <template #code>
              {{
                `// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    ...
    plugins: [ 
      Components({
        // 從 './src/components/' 路徑查找
        resolvers: [
          // ant design vue 按需載入
          AntDesignVueResolver({
            // 自動引入 ant-design/icons-vue 中的圖標，須先安裝 @ant-design/icons-vue
            resolveIcons: true,
            importStyle: 'less',
          }),
        ],
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [/[/]node_modules[/]/, /[/].git[/]/, /[/].nuxt[/]/],
        // 產出TypeScript檔案位置及檔名
        dts: 'src/auto-components.d.ts',    
      }),
    ],
  }
})
`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">auto-components.d.ts</h5>
          <ul class="doc__tool-ul">
            <li class="doc__tool-li">
              小細節：此檔案為 npm run dev時產生，若有新增Component，或發生抓不到Component噴錯時，請重新 run dev
            </li>
            <li class="doc__tool-li">
              每次run dev 都會重新生成新檔，已把此檔案加入.gitignore忽略監聽名單，請勿將此檔案上傳Git
            </li>
          </ul>
          <a-image-preview-group>
            <a-image class="border mt-3" :src="Img_unpluginComponents" width="50%" />
          </a-image-preview-group>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
