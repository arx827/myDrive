<template>
  <div class="btnGroup tabline">
    <a-tabs v-model="activeKey" hide-add type="editable-card">
      <!-- 訊息通知 -->
      <a-tab-pane
        :key="$childrenTab.childrenTab.NOTICE.val"
        :closable="false"
      >
        <span slot="tab">
          <a-space>
            <span>{{ $childrenTab.childrenTab.NOTICE.key }}</span>
            <a-badge
              v-if="noticeCount"
              :count="noticeCount"
              :number-style="{ backgroundColor: activeKey === $childrenTab.childrenTab.NOTICE.val ? '#0093C1' : '#BEBEBE' }"
            />
          </a-space>
        </span>
        <MessageNotice v-if="activeDataInfoTab" />
      </a-tab-pane>
      <a-tab-pane
        :key="$childrenTab.childrenTab.TO_DO_LIST.val"
        :closable="false"
      >
        <span slot="tab">
          <a-space>
            <span>{{ $childrenTab.childrenTab.TO_DO_LIST.key }}</span>
            <a-badge
              v-if="todoCount"
              :count="todoCount"
              :number-style="{ backgroundColor: activeKey === $childrenTab.childrenTab.TO_DO_LIST.val ? '#0093C1' : '#BEBEBE' }"
            />
          </a-space>
        </span>
        <ToDoList v-if="activeTodoInfoTab" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script src="./MyNotice.ts" />
<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
}
</style>
