<script setup lang="ts">
import Img_1 from '@img/doc3-1.png'
import Img_2 from '@img/doc3-2.png'

const tmpl = `export default defineConfig(({ mode }) => {
  ...
  return {
    css: {
      preprocessorOptions: {
        less: {
          'table-header-bg': '#23C4A8',
          ...
        }
      }
    }
  }
})`

const scssTmpl = `// 宣告變數
$width: 300px;
$color: #fff;
// 多屬性變數
$main-font: '微軟正黑體', 'Helvetica', 'Arial';
$border: 1px solid $color;
// 使用變數
.test {
  color: $color;
  width: $width;
  font-family: $main-font;
  border: $border;
}`

const scssTmpl2 = `$color: #fff; // 全域
.test {
  $width: 100px; // 區域
  width: $width;
  color: $color;
}`
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">SCSS 變數</h5>
      <ul class="doc__tool-ul no-list-style ps-2">
        <li class="doc__tool-li">
          <h5>一、宣告使用</h5>
          <div>SCSS 變數的宣告主要依靠$關鍵字，並且依照屬性聲明來做撰寫</div>
          <PreCode type="scss" class="mt-3">
            <template #code>
              {{ scssTmpl }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h5>二、作用域:全域/區域</h5>
          <div>
            變數定義在 CSS {} 塊級區塊內，變成只能在此區塊內使用，稱為區域變數；
            非區塊內最外層的為全域變數，整份文件皆可以使用，稱為全域變數。 在值的後方添加！global
            可以將區域變數轉換為全域變數。
          </div>
          <PreCode type="scss" class="mt-3">
            <template #code>
              {{ scssTmpl2 }}
            </template>
          </PreCode>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">
        <a href="https://www.antdv.com/docs/vue/introduce-cn" target="_blank">Ant Design Vue</a>
      </h5>
      <ul class="doc__tool-ul no-list-style ps-2">
        <li class="doc__tool-li">
          <h5>一、簡介</h5>
          <ul>
            <li>
              <div>版號：3.2.14</div>

              <a-image-preview-group>
                <a-image class="border my-3" :src="Img_1" width="50%" />
              </a-image-preview-group>
            </li>
            <li>支持 Vue3</li>
            <li>支持 TypeScript</li>
            <li>
              <div class="d-flex align-items-center">安裝Ant design vue</div>
              <PreCode type="bash" class="mt-3">
                <template #code>
                  {{ `npm install ant-design-vue --save` }}
                </template>
              </PreCode>
            </li>
          </ul>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">二、設定自動載入Component</h5>
          <ul class="doc__tool-ul">
            <li>
              <div class="d-flex align-items-center">配置 vite.config.js</div>
              <PreCode type="vue" class="mt-3">
                <template #code>
                  {{
                    `import { defineConfig } from 'vite'
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
})`
                  }}
                </template>
              </PreCode>
            </li>
          </ul>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">三、注意事項</h5>
          <ul class="doc__tool-ul">
            <li>
              使用 unplugin-vue-components插件 自動載入Ant Design Vue組件，無法處理非組件模塊，如
              message，這類組件需要手動加載
            </li>
            <a
              href="https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/antdv.ts"
              target="_blank"
              >查看支援自動載入組件</a
            >
            <PreCode type="vue" class="mt-3">
              <template #code>
                {{
                  `import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css'; `
                }}
              </template>
            </PreCode>
            <li>vite只能用 <span class="c-red">ant-design-vue/es</span> 而非 ant-design-vue/lib</li>
          </ul>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">四、客製設定樣式變數</h5>
          <ul class="doc__tool-ul">
            <li>
              <a
                target="_blank"
                href="https://github.com/vueComponent/ant-design-vue/blob/main/components/style/themes/default.less"
                >官方變數一覽表</a
              >
            </li>
            <li>
              <div>至vite.config.ts設定欲更改變數</div>
              <PreCode type="ts">
                <template #code>
                  {{ tmpl }}
                </template>
              </PreCode>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">
        <a target="_blank" href="https://getbootstrap.com/docs/5.2/getting-started/introduction/">Bootstrap 5</a>
      </h5>
      <h6 class="c-red">* 生成器Bootstrap作為輔助使用，樣式使用主要以Ant Design Vue為主</h6>
      <ul class="doc__tool-ul no-list-style ps-2">
        <li class="doc__tool-li">
          <h5>一、簡介</h5>
          <ul>
            <li>
              <div>版號：5.2.2</div>
              <a-image-preview-group>
                <a-image class="border my-3" :src="Img_2" width="50%" />
              </a-image-preview-group>
            </li>
          </ul>
        </li>
        <li class="doc__tool-li">
          <h5>二、客製化</h5>
          <ul>
            <li>此生成器使用scss原檔，變數請使用scss語法更動</li>
            <li>
              <div>
                <span class="c-red">變數</span> 至檔案 \assets\style\vendors\bootstrap\_bsVaribles.scss 進行設定/調整
              </div>
              <div>
                <a target="_blank" href="https://github.com/twbs/bootstrap/blob/main/scss/_variables.scss"
                  >官網變數一覽表</a
                >
              </div>
            </li>
            <li>
              <div>
                <span class="c-red">模組引用</span> 至檔案 \assets\style\vendors\bootstrap\_bsCustom.scss 進行設定/調整
              </div>
            </li>
          </ul>
        </li>
        <li class="doc__tool-li">
          <h5>三、常用語法</h5>
          <ul>
            <li>
              <div><a target="_blank" href="https://getbootstrap.com/docs/5.0/layout/grid/">Grid</a></div>
            </li>
            <li>
              <div>
                <a target="_blank" href="https://getbootstrap.com/docs/5.0/helpers/text-truncation/">Helpers</a>
              </div>
            </li>
            <li>
              <div><a target="_blank" href="https://getbootstrap.com/docs/5.0/utilities/text/">Utilities</a></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
