<script setup lang="ts">
import { ref } from 'vue'
import { uuid } from 'vue-uuid'
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

// 課程用
/**
 * Event
 */
const emitControl = ({ type, data }) => {
  switch (type) {
    case 'add':
      taskArr.value.push({
        taskTitle: data.taskTitle,
        uuid: uuid.v4(),
        status: 'todo',
      })
      break
    case 'delete':
      taskArr.value.splice(
        taskArr.value.findIndex(i => i.uuid === data.uuid),
        1,
      )
      break
    case 'edit':
      customModal.value.visible = true
      customModal.value.taskEdit = taskArr.value.find(i => i.uuid === data.uuid).taskTitle
      customModal.value.taskIdx = taskArr.value.findIndex(i => i.uuid === data.uuid)
      break
    case 'changeStatus':
      taskArr.value.map(i => {
        if (i.uuid === data.uuid) {
          i.status = i.status === 'complete' ? 'todo' : 'complete'
        }
      })
      break
    default:
      break
  }
}
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">[解]_ToDoList 小作業</h5>
      <p>此頁檔案位置：<span class="c-red">/src/pages/vue3/DocVue3Answer.vue</span></p>
      <p>{{`<ToDoList />`}}檔案位置：<span class="c-red">/src/components/practice/ToDoListAnswer.vue</span></p>
      <div class="w-100">
        <!-- 請在此處引用 todoList component -->
        <ToDoListAnswer title="工作列表" :task-arr="taskArr" @emitControl="emitControl" />
      </div>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">新增 Task 功能</h5>
      <ul>
        <li>點選『新增』按鈕，新增 task 列表</li>
        <li>在 Component 中，使用 emit 方式更新 此頁面 列表資訊</li>
        <li>新增完 task 後，清空輸入欄位</li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">刪除 Task 功能</h5>
      <ul>
        <li>
          點選 task 列表中，單筆資訊 右方的 『
          <span class="inline__icon d-inline-block c-red"><DeleteFilled /></span> 』 按鈕
        </li>
        <li>串接子層中 {{`<FblPopConfirm />`}}，重複確認是否真的要刪除，在此Tag串接 @confirm 事件</li>
        <li>從子層 emit 刪除事件，刪除 此頁面 列表資訊</li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">編輯 Task 功能</h5>
      <ul>
        <li>
          點選 task 列表中，單筆資訊 右方的 『
          <span class="inline__icon d-inline-block c-green"><FormOutlined /></span> 』 按鈕
        </li>
        <li>開啟彈窗 {{`<CustomModal />`}}，彈窗會抓取該筆資料文字，並顯示於輸入框中，可進行編輯</li>
        <li>修改後，會將資訊儲存回 列表中，更新資料，並關閉修改彈窗</li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">進階優化：更完善的 工作列表</h5>
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
  </div>
</template>

<style scoped></style>
