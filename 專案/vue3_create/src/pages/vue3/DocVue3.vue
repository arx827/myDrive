<script setup lang="ts">
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
const customModal = ref({
  visible: false,
  loading: false,
  width: 'md',
  center: false,
  top: null,
  taskEdit: '',
  taskIdx: 0,
  footer: true,
  handleOk: () => {
    customModal.value.loading = true

    setTimeout(() => {
      taskArr.value[customModal.value.taskIdx].taskTitle = customModal.value.taskEdit
      customModal.value.handleCancel()
    }, 500)
  },
  handleCancel: () => {
    customModal.value.init()
  },
  init: () => {
    customModal.value.visible = false
    customModal.value.loading = false
    customModal.value.width = 'md'
    customModal.value.center = false
    customModal.value.top = null
    customModal.value.footer = true
    customModal.value.taskEdit = ''
    customModal.value.taskIdx = 0
  },
})
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary mb-3">Vue3基礎知識</h5>
      <ul>
        <li>
          請前往
          <a
            href="https://km.fubonlife.com.tw/confluence/pages/viewpage.action?pageId=985995740#Vue3%E6%A1%86%E6%9E%B6_%E4%BA%BA%E5%93%A1%E5%9F%B9%E8%82%B2%E8%A8%88%E7%95%AB-Vue3%E8%AA%B2%E7%A8%8B"
            target="_blank"
            >連結</a
          >
          節次 1-4 查看 Vue3課程相關簡報與影片
        </li>
        <li>
          課程大綱如下：
          <ul>
            <li>Vue3 基礎</li>
            <li>Vue3 進階</li>
            <li>Vue Router</li>
            <li>Pinia</li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary mb-3">ToDoList 小作業</h5>
      <small>實作 ToDoList，測試是否已掌握 Vue3寫法</small>
      <!-- 請在此處 實作功能 -->

      <!-- 請在此處 實作功能 -->
      <p class="mt-5">請依下方說明，在此處 串接 ToDoList component 功能</p>
      <p>此頁檔案位置：<span class="c-red">/src/pages/vue3/DocVue3.vue</span></p>
      <p>{{`<ToDoList />`}}檔案位置：<span class="c-red">/src/components/practice/ToDoList.vue</span></p>
      <h5 class="d-flex align-items-center text-primary mb-3">1. 嵌入 {{`<ToDoList />`}} component</h5>
      <p>(已使用 Unplugin-vue-components (自動import component)，不須import)</p>
      <h5 class="d-flex align-items-center text-primary mb-3">
        2. 使用 prop 方式，從此頁面更改 標題 與 傳遞 task 列表
      </h5>
      <h5 class="d-flex align-items-center text-primary mb-3">3. 新增 Task 功能</h5>
      <ul>
        <li>點選『新增』按鈕，新增 task 列表</li>
        <li>在 Component 中，使用 emit 方式更新 此頁面 列表資訊</li>
        <li>新增完 task 後，清空輸入欄位</li>
      </ul>
      <h5 class="d-flex align-items-center text-primary mb-3">4. 刪除 Task 功能</h5>
      <ul>
        <li>
          點選 task 列表中，單筆資訊 右方的 『
          <span class="inline__icon d-inline-block c-red"><DeleteFilled /></span> 』 按鈕
        </li>
        <li>串接子層中 {{`<FblPopConfirm />`}}，重複確認是否真的要刪除，在此Tag串接 @confirm 事件</li>
        <li>從子層 emit 刪除事件，刪除 此頁面 列表資訊</li>
      </ul>
      <h5 class="d-flex align-items-center text-primary mb-3">5. 編輯 Task 功能</h5>
      <ul>
        <li>
          點選 task 列表中，單筆資訊 右方的 『
          <span class="inline__icon d-inline-block c-green"><FormOutlined /></span> 』 按鈕
        </li>
        <li>開啟彈窗 {{`<CustomModal />`}}，彈窗會抓取該筆資料文字，並顯示於輸入框中，可進行編輯</li>
        <li>修改後，會將資訊儲存回 列表中，更新資料，並關閉修改彈窗</li>
      </ul>
      <h5 class="d-flex align-items-center text-primary mb-3">6. 進階優化：更完善的 工作列表</h5>
      <ul>
        <li>
          製作 todo 勾選按鈕，勾選後將該筆資料的 status 改為 'complete'『
          <span class="inline__icon d-inline-block"><CheckSquareOutlined /></span> 』，再次勾選則改回 'todo'『
          <span class="inline__icon d-inline-block"><BorderOutlined /></span> 』
        </li>
        <li>
          complete 狀態時，可在文字上增加刪除線 及 顏色變淡，並隱藏 編輯『
          <span class="inline__icon d-inline-block c-green"><FormOutlined /></span> 』與刪除『
          <span class="inline__icon d-inline-block c-red"><DeleteFilled /></span> 』按鈕
        </li>
        <li>點選Tabs 可切換顯示內容，依照『All』、『Todo』、『Complete』切換Tab顯示</li>
        <li>在Tab 旁顯示 count，如：Todo (3)</li>
      </ul>
      <h6 class="d-flex align-items-center text-primary justify-content-end mb-3">
        <RouterLink to="/vue3/doc-vue3-answer">[解]_ToDoList 小作業</RouterLink>
      </h6>
    </div>
  </div>
  <CustomModal
    v-model:visible="customModal.visible"
    title="變更工作項目"
    :width="customModal.width"
    :centered="customModal.center"
    :style="{ top: customModal.top }"
    :footer="customModal.footer"
    @ok="customModal.handleOk"
    @afterClose="customModal.init"
    @cancel="customModal.handleCancel"
  >
    <a-input class="todolist__input" v-model:value="customModal.taskEdit" />
    <template #footer>
      <a-button class="btn__primary" :loading="customModal.loading" @click="customModal.handleOk">送出</a-button>
    </template>
  </CustomModal>
</template>

<style scoped lang="scss"></style>
