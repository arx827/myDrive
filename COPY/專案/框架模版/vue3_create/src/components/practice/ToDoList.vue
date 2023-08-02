<script setup lang="ts">
import { ref } from 'vue'

// 型態宣告
// interface task {
//   taskTitle: string
//   uuid: string
//   status?: 'todo' | 'complete'
// }

let taskText = ref<string>('')

// 轉大駝峰
const changeTabName = item => {
  switch (item) {
    case 'all':
      return 'All tasks'
    default:
      return item.replace(/^./, item[0].toUpperCase())
  }
}

/**
 * Event
 */
const clickAdd = () => {
  console.log('新增')
}
</script>

<template>
  <div class="todolist__card shadow">
    <div class="todolist__title">Vue3 ToDoList</div>
    <div class="todolist__inputWrap">
      <a-input class="todolist__input" v-model:value="taskText" />
      <button class="todolist__addBtn btn__main btn__secondary" @click="clickAdd">新增</button>
    </div>
    <ul class="todolist__tabs list-unstyled">
      <li v-for="(item, idx) in ['all', 'todo', 'complete']" :key="idx" class="todolist__tabs-item">
        {{ changeTabName(item) }}
      </li>
    </ul>

    <div class="todolist__list-wrap">
      <ul class="todolist__lists list-unstyled">
        <li class="todolist__lists-item">
          <div class="lists-item__task">
            <div class="iconBox">
              <!-- 勾選狀態 -->
              <!-- <DownSquareOutlined /> -->

              <!-- 未勾選狀態 -->
              <BorderOutlined />
            </div>
            測試 Task
          </div>
          <button class="lists-item__button edit c-green">
            <FormOutlined />
          </button>
          <FblPopConfirm>
            <button class="lists-item__button delete c-red"><DeleteFilled /></button>
          </FblPopConfirm>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.todolist__card {
  margin: 20px 0;
  border-radius: 5px;
  overflow: hidden;
}
.todolist__title {
  font-weight: bold;
  font-size: 20px;
  background: $COLOR-MAIN7;
  color: $COLOR-WHITE;
  padding: 10px;
  text-align: center;
}
.todolist__inputWrap {
  display: flex;
  padding: 0 5px 10px;
  background: $COLOR-MAIN7;
}
.todolist__input {
  margin: 5px;
  flex: 1;
  border-radius: 5px;
  border: 1px solid $COLOR-GRAY4;
  padding: 5px 10px;
  &:focus-visible {
    outline: none;
  }
}
.todolist__addBtn {
  margin-left: 5px;
}
.todolist__tabs {
  display: flex;
  box-shadow: 0 1px 5px #5b5b5b;
  z-index: 10;
  position: relative;
  margin-bottom: 0;
}
.todolist__tabs-item {
  color: $COLOR-WHITE;
  background: lighten($COLOR-MAIN7, 10);
  padding: 10px 20px;
  flex: 1;
  text-align: center;
  &.active {
    background: $COLOR-MAIN1;
  }
  &.disabled {
    background: $COLOR-GRAY4;
  }
  + .todolist__tabs-item {
    border-left: 1px solid $COLOR-GRAY3;
  }
  &:not(.disabled, .active) {
    &:hover {
      cursor: pointer;
      background: lighten($COLOR-MAIN7, 20);
    }
  }
  .tabsName {
    &::after {
      content: '(' attr(data-count) ')';
      margin-left: 5px;
    }
  }
}

.todolist__list-wrap {
  background: $COLOR-MAIN1;
}

.todolist__lists {
  margin-bottom: 0;
}

.todolist__lists-item {
  padding: 10px;
  word-break: break-word;
  background: $COLOR-WHITE;
  display: flex;
  align-items: start;
  .lists-item__task {
    flex: 1;
    display: flex;
    cursor: pointer;
  }
  .iconBox {
    font-size: 24px;
    margin-right: 5px;
    line-height: 0;
    .anticon {
      line-height: 0;
    }
  }
  &:nth-child(2n) {
    background: darken($COLOR-WHITE, 5);
  }
  .lists-item__button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 5px;
  }
  .lists-item__delete {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
  }
}

.completeStyle {
  // color: $COLOR-MAIN1;
  text-decoration: line-through;
  color: #adadad;
}
</style>
