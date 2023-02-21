<script setup lang="ts">
import Img_ucreateCompDemo from '@img/createCompDemo.png'
import Img_todoList from '@img/todoList.png'

import { ref } from 'vue'

interface task {
  taskTitle: string
  uuid: string
  status?: 'todo' | 'complete'
}
const taskArr = ref<task[]>([
  {
    taskTitle: '環境建置',
    uuid: 'cd1f23e3-f350-4ea5-bd36-8095c2c0aede',
    status: 'todo',
  },
  {
    taskTitle: '基礎共用',
    uuid: '028b28cd-e263-4243-8b35-6d9a1ad5103d',
    status: 'complete',
  },
])
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">Component 規範</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          依照Vue官方，*.vue檔 template 區塊內的 Component 命名，<br />可以採用『
          <span class="text__highlight">大駝峰命名</span> 』命名 (PascalCase) 及『
          <span class="text__highlight">烤肉串命名</span> 』(又稱 kebab-case)，<br />如：FblPopConfirm.vue、fbl-pop-confirm.vue。
        </li>
        <li class="doc__tool-li">
          當使用與 HTML Tag 標籤名稱相同時，建議採用『 <span class="text__highlight">大駝峰命名</span> 』命名<br />
          如：{{`
          <header />
          、 <Header />`}}
          <p>原因：</p>
          <ul>
            <li>
              HTML不區分大小寫，{{`
              <header />
              、 <Header />`}} 會視為同一元件。
            </li>
            <li>為了讓編譯器或程式可以分辨 是 HTML Tag ？ 還是 Component ？</li>
          </ul>
        </li>
        <li class="doc__tool-li">
          <h6 class="d-flex align-items-center">格式： (網頁三巨頭 js、html、css)</h6>
          <p>
            JS =>
            <span class="text__highlight"
              >{{`
              <script setup lang="ts">
              `}}</span
            >
          </p>
          <p>
            HTML => <span class="text__highlight">{{`<template>`}}</span>
          </p>
          <p>
            CSS => <span class="text__highlight">{{`<style lang="scss">`}}</span>
          </p>
          <a-image-preview-group>
            <a-image class="border mt-2" :src="Img_ucreateCompDemo" width="50%" />
          </a-image-preview-group>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">練習用範本</h5>
      <ul class="doc__tool-ul">
        <li>檔案位置：<span class="c-red">components/practice/ToDoList.vue</span></li>
      </ul>
      <a-image-preview-group>
        <a-image class="border mt-3" :src="Img_todoList" width="50%" />
      </a-image-preview-group>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">新增Component</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h6 class="d-flex align-items-center">練習</h6>
          <ul>
            <li>請在此處 引入 ToDoList Component，並可正常顯示 (功能先不用串接)</li>
            <div>
              <!-- 請在此處引用 todoList component -->
              

            </div>
          </ul>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">Component傳參</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h6 class="d-flex align-items-center">練習</h6>
          <ul>
            <li>請將『標題』、『tasks list』改用參數傳送</li>
            <li>使用 props 方式，由父層傳遞進component</li>
            <li>defineProps</li>
            <div>
              <!-- 請在此處引用 todoList component -->
              
              
            </div>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
