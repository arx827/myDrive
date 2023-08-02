<script setup lang="ts">
import Img_tableComp from '@img/tableComp.png'
import { ref } from 'vue'

import { FblColumnType } from '@components/shared/data-grid/models'

// const $emit = defineEmits(['inspectClick', 'tableChange', 'onSelect', 'batch', 'update:selector'])

// ----------- FblDataGrid :Props ----------- //
const tableGrid = ref({
  rowKey: 'key',
  bordered: true,
  scroll: { x: true },
  pagination: {
    size: 'small',
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ['10', '25', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
  },
  dataSource: [
    {
      key: '1',
      title: 'rowKey',
      caption: '表格行 key 的取值',
      type: 'string|Function(record):string',
      default: 'key',
    },
    {
      key: '2',
      title: 'bordered',
      caption: '是否顯示外邊框和列邊框',
      type: 'boolean',
      default: 'false',
    },
    {
      key: '3',
      title: 'scroll',
      caption: '表格是否可滾動，也可以指定滾動區域的寬、高',
      type: 'object',
      default: '-',
    },
    {
      key: '4',
      title: 'pagination',
      caption: '分頁器，設為false時不展示和進行分頁',
      type: 'object',
      default: '-',
    },
    {
      key: '5',
      title: 'dataSource',
      caption: '數據陣列',
      type: 'object[]',
      default: '-',
    },
    {
      key: '6',
      title: 'columns',
      caption: '表格列的配置描述',
      type: 'object[]',
      default: '-',
    },
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '參數',
      dataIndex: 'title',
    },
    {
      type: FblColumnType.PLAIN,
      title: '說明',
      dataIndex: 'caption',
    },
    {
      type: FblColumnType.PLAIN,
      title: '類型',
      dataIndex: 'type',
    },
    {
      type: 'PLAIN',
      title: '默認值',
      dataIndex: 'default',
    },
  ],
})

const tableDataGridVueDemo = `
const tableGrid = ref({
  rowKey: 'key',
  bordered: true,
  scroll: { x: true },
  pagination: {
    size: 'small',
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ['10', '25', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => \`顯示\${range[0]}-\${range[1]}筆 共\${total}筆\`,
  },
  dataSource: [
    {
      key: '1',
      title: 'rowKey',
      caption: '表格行 key 的取值',
      type: 'string|Function(record):string',
      default: 'key',
    },
    ...
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '參數',
      dataIndex: 'title',
    },
    ...
  ],
})`

const tableDataGridTempDemo = `
<FblDataGrid
  class="ant-table-striped"
  v-bind="tableGrid"
  ...
>
...
</FblDataGrid>`

// ----------- RowSelection 屬性 ----------- //
const selectorValue = ref<string[]>([])
const RowSelection = ref({
  rowKey: 'key',
  bordered: true,
  scroll: { x: true },
  pagination: false,
  dataSource: [
    {
      key: '1',
      title: 'isSelect',
      caption: '是否開啟 checkBox 選單功能',
      type: 'boolean',
      default: 'false',
    },
    {
      key: '2',
      title: 'selector(v-model)',
      caption: '勾選選項 的 變數綁定',
      type: 'string[]',
      ddefault: '[]',
    },
    {
      key: '3',
      title: 'onSelectChange',
      caption: '用戶手動選擇/取消選擇某列 時 觸發',
      type: 'function(selectedRows)',
      default: '-',
    },
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '參數',
      dataIndex: 'title',
    },
    {
      type: FblColumnType.PLAIN,
      title: '說明',
      dataIndex: 'caption',
    },
    {
      type: FblColumnType.PLAIN,
      title: '類型',
      dataIndex: 'type',
    },
    {
      type: FblColumnType.PLAIN,
      title: '默認值',
      dataIndex: 'default',
    },
  ],
  isSelect: true,
})
const rowSelectionTempDemo = `
<FblDataGrid
  ...
  v-bind="RowSelection"
  v-model:selector="selectorValue"
  @onSelectChange="handleTableSelect"
  ...
>
...
</FblDataGrid>`
const rowSelectionJsDemo = `
const selectorValue = ref<string[]>([])

const handleTableSelect = selectedRows => {
  console.log('父層變數：', selectorValue.value)
  console.log('emit上來的 勾選事項：', selectedRows)
}`
const handleTableSelect = selectedRows => {
  console.log('父層變數：', selectorValue.value)
  console.log('emit上來的 勾選事項：', selectedRows)
}

// ----------- 自定義 columns ----------- //
const customTempGrid = ref({
  rowKey: 'key',
  bordered: true,
  scroll: { x: true },
  pagination: false,
  dataSource: [
    {
      key: '1',
      title: 'type',
      caption: '資料型態',
      type: 'PLAIN | TEMPLATE',
      default: '-',
    },
    {
      key: '2',
      title: 'inspect',
      caption: '是否轉換為 連結字串',
      type: 'boolean',
      default: 'false',
    },
    {
      key: '3',
      title: 'headerCellTemp',
      caption: '標頭Template 對應 slot name',
      type: 'string',
      default: '-',
    },
    {
      key: '4',
      title: 'bodyCellTemp',
      caption: '內容Template slot name',
      type: 'string',
      default: '-',
    },
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '參數',
      dataIndex: 'title',
    },
    {
      type: FblColumnType.PLAIN,
      title: '說明',
      dataIndex: 'caption',
    },
    {
      type: FblColumnType.PLAIN,
      title: '類型',
      dataIndex: 'type',
    },
    {
      type: FblColumnType.PLAIN,
      title: '默認值',
      dataIndex: 'default',
    },
  ],
})
const customTempEventGrid = ref({
  rowKey: 'key',
  bordered: true,
  scroll: { x: true },
  pagination: false,
  dataSource: [
    {
      key: '1',
      title: 'inspectClick',
      caption: '當 inspect 為 true 時，點選連結字串，可觸發此Function',
      type: 'function()',
      default: '-',
    },
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '參數',
      dataIndex: 'title',
    },
    {
      type: FblColumnType.PLAIN,
      title: '說明',
      dataIndex: 'caption',
    },
    {
      type: FblColumnType.PLAIN,
      title: '類型',
      dataIndex: 'type',
    },
    {
      type: FblColumnType.PLAIN,
      title: '默認值',
      dataIndex: 'default',
    },
  ],
})
const customHeaderDemoGrid = ref({
  rowKey: 'txCode',
  bordered: true,
  scroll: { x: true },
  pagination: false,
  dataSource: [
    {
      key: '1',
      txCode: 'E2FEQ210923002',
      cfStatus: '3',
      applyId: 'B2212',
      ellipsisTest: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      applyDate: '2022/12/02 10:50:28',
      cutOffDatetime: '2022/12/02 10:50:28',
    },
    {
      key: '2',
      txCode: 'E2AIP210901071',
      cfStatus: '2',
      applyId: 'B2212',
      ellipsisTest: 'Lorem Ipsum is',
      applyDate: '2022/12/02 10:50:28',
      cutOffDatetime: '2022/12/02 10:50:28',
    },
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '交易編號',
      dataIndex: 'txCode',
      key: 'txCode',
      inspect: true,
      fixed: 'left',
      headerCellTemp: 'customTitle',
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '交易確認狀態',
      dataIndex: 'cfStatus',
      key: 'cfStatus',
      width: '150px',
      bodyCellTemp: 'cfStatus',
    },
    {
      type: FblColumnType.PLAIN,
      title: '送審人員',
      dataIndex: 'applyId',
      key: 'applyId',
    },
  ],
})
const customHeaderJsTemp = `import { ref } from 'vue'
const grid = ref({
  rowKey: 'txCode',
  bordered: true,
  scroll: { x: true },
  pagination: false,
  dataSource: [
    ...
  ],
  columns: [
    {
      type: FblColumnType.PLAIN,
      title: '交易編號',
      dataIndex: 'txCode',
      key: 'txCode',
      inspect: true,
      fixed: 'left',
      headerCellTemp: 'customTitle',                // 定義 標頭Template 對應 slot name
    },
    {
      type: FblColumnType.TEMPLATE,
      title: '交易確認狀態',
      dataIndex: 'cfStatus',
      key: 'cfStatus',
      width: '150px',
      bodyCellTemp: 'cfStatus',                     // 定義 內容Template 對應 slot name
    },
    ...
  ],
})
const workContent = record => {
  console.log('另開視窗', record)
}`
const customHeaderVueTemp = `
<!-- 定義inspectClick -->
<FblDataGrid class="ant-table-striped" v-bind="customHeaderDemoGrid" @inspectClick="workContent">
  <template #customTitle="{ scope: { title } }">
    <span class="d-flex align-items-center"> <smile-outlined /> {{ title }} (自定義temp標題) </span>
  </template>
  <template #cfStatus="{ scope: { text } }">
    <a-badge
      :color="$cfEnum.getObject('cfStatusEnum', text).color"
      :text="$cfEnum.getObject('cfStatusEnum', text).label"
    ></a-badge>
  </template>
</FblDataGrid>`

const workContent = record => {
  console.log('另開視窗', record)
}
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">表格 Component 元件</h5>
      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">檔案位置</h5>
          src/components/shared/data-grid/FblDataGrid.vue
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">
            <span>相關參數，請參考 </span>
            <a href="https://2x.antdv.com/components/table-cn" target="_blank">Ant Design Vue - Table</a>
          </h5>
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">圖示</h5>
          <a-image-preview-group>
            <a-image class="border mt-1" :src="Img_tableComp" width="50%" />
          </a-image-preview-group>
        </li>
      </ul>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">FblDataGrid 常用屬性</h5>
      <FblDataGrid class="ant-table-striped" v-bind="tableGrid" />
      <a-collapse class="mt-5">
        <a-collapse-panel header="程式碼">
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{ tableDataGridVueDemo }}
            </template>
          </PreCode>
          <PreCode type="html" class="mt-3">
            <template #code>
              {{ tableDataGridTempDemo }}
            </template>
          </PreCode>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">RowSelection 屬性 (checkbox)</h5>
      <FblDataGrid
        class="ant-table-striped"
        v-bind="RowSelection"
        v-model:selector="selectorValue"
        @onSelectChange="handleTableSelect"
      />
      <a-collapse class="mt-5">
        <a-collapse-panel header="程式碼">
          <PreCode type="html" class="mt-3">
            <template #code>
              {{ rowSelectionTempDemo }}
            </template>
          </PreCode>
          <PreCode type="vue" class="mt-3">
            <template #code>
              {{ rowSelectionJsDemo }}
            </template>
          </PreCode>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">自定義 columns</h5>

      <ul class="doc__tool-ul">
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">屬性</h5>
          <FblDataGrid class="ant-table-striped" v-bind="customTempGrid" />
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">事件</h5>
          <FblDataGrid class="ant-table-striped" v-bind="customTempEventGrid" />
        </li>
        <li class="doc__tool-li">
          <h5 class="d-flex align-items-center">範例</h5>
          <FblDataGrid class="ant-table-striped" v-bind="customHeaderDemoGrid" @inspectClick="workContent">
            <template #customTitle="{ scope: { title } }">
              <span class="d-flex align-items-center"> <smile-outlined /> {{ title }} (自定義temp標題) </span>
            </template>
            <template #cfStatus="{ scope: { text } }">
              <a-badge
                :color="$cfEnum.getObject('cfStatusEnum', text).color"
                :text="$cfEnum.getObject('cfStatusEnum', text).label"
              ></a-badge>
            </template>
          </FblDataGrid>
          <a-collapse class="mt-5">
            <a-collapse-panel header="程式碼">
              <PreCode type="js" class="mt-3">
                <template #code>{{ customHeaderJsTemp }}</template>
              </PreCode>
              <PreCode type="vue" class="mt-3">
                <template #code>{{ customHeaderVueTemp }}</template>
              </PreCode>
            </a-collapse-panel>
          </a-collapse>
        </li>
      </ul>
    </div>
  </div>
</template>
