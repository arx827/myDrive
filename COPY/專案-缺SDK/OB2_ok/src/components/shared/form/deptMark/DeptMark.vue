<template>
  <div>
    <a-spin :spinning="isLoading">
      <div class="result__table">
        <FblDataGrid
          :themeColor="'theme2'"
          :scroll="scroll"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :loading="isLoading"
          :pagination="grid.pagination"
          :empty-data="grid.data.length <= 0"
          @tableChange="onPageChange($event)"
        >
          <template v-slot:contentTemp="slotProps">
            <div
              v-if="
                slotProps.data.content && slotProps.data.content.length > 250
              "
            >
              <a-popover
                :content="slotProps.data.content"
                trigger="click"
                :overlayStyle="{ maxWidth: '50%' }"
              >
                <p>{{ slotProps.data.content.substring(0, 250) + "..." }}</p>
              </a-popover>
            </div>
            <div v-else>
              <p>{{ slotProps.data.content }}</p>
            </div>
          </template>
        </FblDataGrid>
      </div>
    </a-spin>
  </div>
</template>

<script src="./DeptMark.ts" lang="ts"></script>