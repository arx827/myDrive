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

/**
 * Event
 */
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">練習用模板</h5>
      <div class="w-100">
        <!-- 請在此處引用 todoList component -->
        <ToDoList title="工作列表" :task-arr="taskArr" />
      </div>
      <p class="text-end">請依下方說明，在此模板操作</p>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">新增 Task</h5>
      <ul>
        <li>點選『新增』按鈕，新增 task 列表</li>
        <li>在ToDoList Component中，使用 emit 方式更新 父層 列表資訊</li>
        <li>defineEmits</li>
        <li>清空輸入欄位</li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">刪除 Task</h5>
      <ul>
        <li>點選單筆『刪除』按鈕</li>
        <li>在ToDoList Component中，使用 emit 回傳該筆 task</li>
        <li>defineEmits</li>
        <li>刪除該筆『工作列表』</li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">編輯 Task</h5>
      <ul>
        <li>點選單筆『編輯』按鈕</li>
        <li>開啟彈窗 CustomModal，並將原始資料 呈現 編輯欄位</li>
        <li>defineEmits</li>
        <li>藉由index傳遞，找到該筆資料並更新</li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">更完善的 工作列表</h5>
      <ul>
        <li>增加 todo 勾選按鈕，勾選後為 complete，再次勾選則切換回 todo</li>
        <li>complete 加 刪除線 及 顏色變淡，並隱藏 編輯與刪除按鈕</li>
        <li>依照『todo』、『complete』切換Tab顯示，並連動 count</li>
        <li>All tasks 時，需排序 complete 在 Todo 下方</li>
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
