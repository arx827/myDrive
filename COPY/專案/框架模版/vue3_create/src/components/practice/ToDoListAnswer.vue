<script setup lang="ts">
import { ref, computed } from 'vue'

interface task {
  taskTitle: string
  uuid: string
  status?: 'todo' | 'complete'
}

const $props = withDefaults(
  defineProps<{
    title?: string
    taskArr?: task[] | []
  }>(),
  {
    title: 'Vue3 ToDoList',
    taskArr: () => [],
  },
)

let taskText = ref<string>('')

let currentType = ref<string>('all')
const $emit = defineEmits(['emitControl'])

const isComplete = item => {
  return item.status === 'complete'
}

const count = type => {
  switch (type) {
    case 'all':
      return $props.taskArr.length
    case 'todo':
      return $props.taskArr.filter(item => item.status === 'todo').length
    case 'complete':
      return $props.taskArr.filter(item => item.status === 'complete').length
  }
}

const currentArr = computed(() => {
  switch (currentType.value) {
    case 'todo':
      return $props.taskArr.filter(item => item.status === 'todo')
    case 'complete':
      return $props.taskArr.filter(item => item.status === 'complete')
    default:
      return [
        ...$props.taskArr.filter(item => item.status === 'todo'),
        ...$props.taskArr.filter(item => item.status === 'complete'),
      ]
  }
})

/**
 * Event
 */
const clickAdd = () => {
  $emit('emitControl', {
    type: 'add',
    data: {
      taskTitle: taskText.value,
    },
  })
  taskText.value = ''
}
const clickEdit = uuid => {
  $emit('emitControl', {
    type: 'edit',
    data: {
      uuid: uuid,
    },
  })
}
const clickDelete = uuid => {
  $emit('emitControl', {
    type: 'delete',
    data: {
      uuid: uuid,
    },
  })
}
const clickStatus = uuid => {
  $emit('emitControl', {
    type: 'changeStatus',
    data: {
      uuid: uuid,
    },
  })
}
const changeTabs = type => {
  if (count(type) > 0) {
    currentType.value = type
  }
}
</script>

<template>
  <div class="todolist__card shadow">
    <div class="todolist__title">{{ $props.title }}</div>
    <div class="todolist__inputWrap">
      <a-input class="todolist__input" v-model:value="taskText" @keydown.enter="clickAdd" />
      <button class="todolist__addBtn btn__main btn__secondary" @click="clickAdd">新增</button>
    </div>
    <ul class="todolist__tabs list-unstyled">
      <li class="todolist__tabs-item" :class="{ active: currentType === 'all' }" @click="changeTabs('all')">
        <span class="tabsName" :data-count="count('all')">All tasks</span>
      </li>
      <li
        class="todolist__tabs-item"
        :class="{ active: currentType === 'todo', disabled: count('todo') <= 0 }"
        @click="changeTabs('todo')"
      >
        <span class="tabsName" :data-count="count('todo')">Todo</span>
      </li>
      <li
        class="todolist__tabs-item"
        :class="{ active: currentType === 'complete', disabled: count('complete') <= 0 }"
        @click="changeTabs('complete')"
      >
        <span class="tabsName" :data-count="count('complete')">Complete</span>
      </li>
    </ul>
    <div class="todolist__list-wrap">
      <ul class="todolist__lists list-unstyled">
        <li class="todolist__lists-item" v-for="item in currentArr" :key="item.uuid">
          <div class="lists-item__task" :class="{ completeStyle: isComplete(item) }" @click="clickStatus(item.uuid)">
            <div class="iconBox">
              <DownSquareOutlined v-if="isComplete(item)" />
              <BorderOutlined v-else />
            </div>
            {{ item.taskTitle }}
          </div>
          <template v-if="!isComplete(item)">
            <button class="lists-item__button edit c-green" @click="clickEdit(item.uuid)">
              <FormOutlined />
            </button>
            <FblPopConfirm @confirm="clickDelete(item.uuid)">
              <button class="lists-item__button delete c-red"><DeleteFilled /></button>
            </FblPopConfirm>
          </template>
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
