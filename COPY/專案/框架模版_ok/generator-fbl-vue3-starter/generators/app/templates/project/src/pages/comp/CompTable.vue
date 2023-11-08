<script setup lang="ts">
import { useForm } from 'ant-design-vue/es/form'
import { getCurrentInstance, onMounted, ref } from 'vue'

const {
  proxy: { $cfEnum },
} = getCurrentInstance()

const grid = ref({
  rowKey: 'txCode',
  data: [
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
    {
      key: '3',
      txCode: 'E2AIP210910088',
      cfStatus: '1',
      applyId: 'B2212',
      ellipsisTest: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      applyDate: '2022/12/02 10:50:28',
      cutOffDatetime: '2022/12/02 10:50:28',
    },
  ],
  scroll: { x: true },
  pagination: {
    // size: 'small',
    current: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: ['10', '25', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
  },
  columns: [
    {
      type: 'PLAIN',
      title: '交易編號',
      dataIndex: 'txCode',
      key: 'txCode',
      inspect: true,
      headerCellTemp: 'customTitle',
      bodyCellTemp: 'txCode',
      fixed: 'left',
      formatter: data => data.txCode,
    },
    {
      type: 'TEMPLATE',
      title: '交易確認狀態',
      dataIndex: 'cfStatus',
      key: 'cfStatus',
      width: '110',
      bodyTemp: 'cfStatus',
    },
    {
      type: 'PLAIN',
      title: '送審人員',
      dataIndex: 'applyId',
      key: 'applyId',
    },
    {
      type: 'PLAIN',
      title: '測試文字刪節符',
      width: '150',
      key: 'ellipsisTest',
      dataIndex: 'ellipsisTest',
      ellipsis: true,
    },
    {
      type: 'PLAIN',
      title: '送審日期',
      key: 'applyDate',
      dataIndex: 'applyDate',
    },
    {
      type: 'PLAIN',
      title: '指示時間',
      key: 'cutOffDatetime',
      dataIndex: 'cutOffDatetime',
    },
    {
      type: 'TEMPLATE',
      title: '操控',
      width: '100',
      fixed: 'right',
      bodyCellTemp: 'action',
    },
  ],
})

const form = ref({
  inputText1: undefined,
  inputText2: undefined,
})

const formEl = ref(null)

const rulesRef = ref({
  inputText1: [
    {
      required: true,
      message: '交易編號 欄位必填',
    },
  ],
  inputText2: [
    {
      required: true,
      message: '送審人員 欄位必填',
    },
  ],
})

const { validate, validateInfos, resetFields } = useForm(form, rulesRef)

const selectorValue = ref<string[]>([])

interface ModalState {
  infoModal: {
    title: string
    visible: boolean
  }
}

const modalState = ref<ModalState>({
  infoModal: {
    title: '',
    visible: false,
  },
})

/**
 * Event
 */
// 新增
const addData = () => {
  modalState.value.infoModal.title = 'Add - 新增'
  modalState.value.infoModal.visible = true
  console.log('新增')
}
// 編輯
const editData = txCode => {
  modalState.value.infoModal.title = 'Edit - 編輯'
  modalState.value.infoModal.visible = true
  console.log('編輯', txCode)
}
// 刪除
const deleteData = txCode => {
  console.log('刪除', txCode)
}

const workContent = record => {
  console.log('另開視窗', record)
}

const handleTableChange = record => {
  console.log(record)
}

const handleTableSelect = selectedRows => {
  console.log('onSelect => ', selectedRows)
}

const multipleControl = () => {
  if (selectorValue.value.length > 0) {
    console.log('多筆操作 =>', selectorValue.value)
  }
}

// const handleExport = boo => {
//   console.log('handleExport', boo)
// }

const handleCancel = () => {
  modalState.value.infoModal.visible = false
  resetFields()
}
const handleConfirm = () => {
  validate()
    .then(() => {
      console.log(form)
      handleCancel()
    })
    .catch(err => {
      console.log('error', err)
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = formEl.value.querySelector('.ant-form-item-has-error')
      if (getErrorEle) {
        // 新語法試用 scrollIntoView
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
}

/**
 * Hook
 */
onMounted(() => {})
</script>
<template>
  <div class="page__container flex-fill">
    <div class="d-flex justify-content-end mb-2 gap-2">
      <a-button class="btn__secondary" @click="multipleControl" :disabled="!selectorValue.length">多筆操作</a-button>
      <a-button class="btn__danger" @click="multipleControl" :disabled="!selectorValue.length">多筆刪除</a-button>
      <button class="table__btn text-nowrap btn__primary" @click="addData">新增</button>
    </div>
    <FblDataGrid
      class="ant-table-striped popupContainerElement"
      bordered
      :dataSource="grid.data"
      :columns="grid.columns"
      :pagination="grid.pagination"
      :size="'small'"
      :isSelect="true"
      :scroll="grid.scroll"
      @inspectClick="workContent"
      @tableChange="handleTableChange"
      @onSelect="handleTableSelect"
      v-model:selector="selectorValue"
    >
      <template #customTitle>
        <span class="d-flex align-items-center"> <smile-outlined /> 交易編號(自定義temp標題) </span>
      </template>
      <template #txCode="{ scope: { text } }">
        <a class="link">{{ text }}</a>
      </template>

      <template #cfStatus="{ scope: { text } }">
        <a-badge
          :color="$cfEnum.getObject('cfStatusEnum', text).color"
          :text="$cfEnum.getObject('cfStatusEnum', text).label"
        ></a-badge>
      </template>
      <template #action="{ scope: { text, column } }">
        <div class="d-md-flex align-items-center justify-content-center flex-wrap gap-2">
          <button class="table__btn text-nowrap btn__secondary" @click="editData(text)">編輯</button>
          <FblPopConfirm
            @confirm="deleteData(text)"
            :popupContainer="!!column.fixed ? '.popupContainerElement .ant-table' : null"
          >
            <template #content>
              <div>其他說明文字</div>
            </template>
            <button class="table__btn text-nowrap btn__danger">刪除</button>
          </FblPopConfirm>
          <FblPopConfirm @confirm="deleteData(text)">
            <button class="table__btn text-nowrap btn__danger" :disabled="true">刪除</button>
          </FblPopConfirm>
        </div>
      </template>
    </FblDataGrid>
  </div>

  <ConfirmModal
    :title="modalState.infoModal.title"
    :width="544"
    padding-size="normal"
    :closable="true"
    :centered="true"
    @closeModal="handleCancel"
    v-model:visible="modalState.infoModal.visible"
  >
    <template #content>
      <div ref="formEl">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row :gutter="12">
            <!-- 文字輸入 -->
            <a-col :span="24" :md="12" :xl="12">
              <a-form-item label="交易編號" v-bind="validateInfos.inputText1">
                <a-input v-model:value="form.inputText1" placeholder="請輸入 交易編號" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :md="12" :xl="12">
              <a-form-item label="送審人員" v-bind="validateInfos.inputText2">
                <a-input v-model:value="form.inputText2" placeholder="請輸入 送審人員" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </template>
    <template #footer>
      <div class="modal-btn__wrap d-flex justify-content-center gap-3">
        <button class="modal-btn modal-btn__secondary" @click="handleCancel">取消</button>
        <button class="modal-btn modal-btn__primary" @click="handleConfirm">確認</button>
      </div>
    </template>
  </ConfirmModal>
  <!-- <InfoModal title="匯出系統代碼" v-model:visible="modalState.infoModal.visible" /> -->
</template>

<style scoped lang="scss">
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

// .table__btn {
//   width: 100%;
//   margin: 5px 0;
//   @include rwd-md() {
//     margin: 5px;
//   }
// }
</style>
