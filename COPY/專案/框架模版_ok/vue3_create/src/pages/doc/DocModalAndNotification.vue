<script setup lang="ts">
import { ref } from 'vue'
const grid = ref({
  rowKey: 'key',
  data: [
    {
      key: '1',
      param: 'content',
      description: '彈窗內容',
      type: 'string |VNode |function(h)',
    },
    {
      key: '2',
      param: 'footer',
      description: '底部內容，當不需要默認底部按鈕時，可以設為 :footer="null"',
      type: 'string|slot',
    },
  ],
  scroll: { x: true },
  columns: [
    {
      type: 'PLAIN',
      title: '參數',
      dataIndex: 'param',
      key: 'param',
      width: '50',
    },
    {
      type: 'PLAIN',
      title: '類型',
      dataIndex: 'type',
      key: 'type',
      width: '50',
    },
    {
      type: 'PLAIN',
      title: '說明',
      dataIndex: 'description',
      key: 'description',
      width: '80',
    },
  ],
})

const grid2 = ref({
  rowKey: 'key',
  data: [
    {
      key: '1',
      param: 'placement',
      description: '彈出位置，可選 topLeft、topRight、bottomLeft、bottomRight, 預設 topRight',
      type: 'string',
    },
  ],
  scroll: { x: true },
  columns: [
    {
      type: 'PLAIN',
      title: '參數',
      dataIndex: 'param',
      key: 'param',
      width: '50',
    },
    {
      type: 'PLAIN',
      title: '類型',
      dataIndex: 'type',
      key: 'type',
      width: '50',
    },
    {
      type: 'PLAIN',
      title: '說明',
      dataIndex: 'description',
      key: 'description',
      width: '80',
    },
  ],
})
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">Modal</h5>
      <div>此生成器有將Antd Modal包成共用，可直接使用共用語法 (檔案: plugins/modal/index.ts)</div>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h6>頁面註冊宣告</h6>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{
                `const {
  proxy: { $modal },
} = getCurrentInstance()`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h6>在方法內使用</h6>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{
                `$modal.info({
  content: '訊息訊息',
  ...
})`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h6>Antd Modal 參數 <a target="_blank" href="https://www.antdv.com/components/modal-cn#API">官方文件</a></h6>
          <FblDataGrid
            class="ant-table-striped"
            bordered
            :dataSource="grid.data"
            :columns="grid.columns"
            :size="'small'"
            :scroll="grid.scroll"
          />
          <div class="my-3">
            <h6>補充: VNode、function(h)使用</h6>
            <h6 class="text-secondary">h()函數和createVNode()函數都是創建dom節點，他們的作用是一樣的。</h6>
            <h6 class="c-red">( {標籤}, {屬性}, {內容} )</h6>
            <PreCode type="vue" class="mt-3">
              <template #code>
                {{
                  `// function(h)
import { h } from 'vue';

$modal.info({
  content: h('div', {}, [
    h('p', 'some messages...some messages...'),
    h('p', 'some messages...some messages...'),
  ]),
  ...options
})

// VNode
import { createVNode } from 'vue'

$modal.info({
  content: createVNode('div', { style: 'color:red;' }, 'Some descriptions'),
  ...options
})
`
                }}
              </template>
            </PreCode>
          </div>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">Notification</h5>
      <div>此生成器有將Antd Notification包成共用，可直接使用共用語法 (檔案: plugins/notification/index.ts)</div>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h6>頁面註冊宣告</h6>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{
                `const {
  proxy: { $notification },
} = getCurrentInstance()`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h6>在方法內使用</h6>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{
                `$notification.info({
  content: '訊息訊息',
  ...
})`
              }}
            </template>
          </PreCode>
        </li>
        <li class="doc__tool-li">
          <h6>Notification 方法</h6>
          <div>詳見 檔案: plugins/notification/index.ts</div>
        </li>
        <li class="doc__tool-li">
          <h6>
            Notification 參數
            <a target="_blank" href="https://www.antdv.com/components/notification-cn#API">官方文件</a>
          </h6>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
