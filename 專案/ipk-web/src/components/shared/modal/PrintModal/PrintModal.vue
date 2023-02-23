<template>
  <a-modal
    v-model="printModalVisible"
    title="列印"
    :maskClosable="false"
    :keyboard="false"
    width="474px"
    :destroyOnClose="true"
    @cancel="closePrintModal"
  >
    <div>
      <div class="modal__body">
        <div>表單類型</div>
        <a-select
          v-model="fileCode"
          placeholder="請選擇"
          allowClear
          class="my-2 w-100"
        >
          <a-select-option
            v-for="(item, index1) in fileCodeOption"
            :key="index1"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <div>檔案格式</div>
        <div class="my-2">
          <a-radio-group v-model="fileExtension">
            <!-- <a-radio :value="$cfEnum.fileExtensionEnum.PDF">
              {{ $cfEnum.fileExtensionEnum.PDF }}
            </a-radio> -->
            <a-radio :value="$cfEnum.fileExtensionEnum.EXCEL">
              {{ $cfEnum.fileExtensionEnum.EXCEL }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <template slot="footer">
      <IpkButton
        buttonType="lightBlue"
        buttonText="取消"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closePrintModal"
      />
      <!-- TODO: 權限待修改 -->
      <IpkButton
        buttonType="primary"
        buttonText="確認"
        iconType="check"
        :buttonDisabled="isEmpty(fileCode) || isEmpty(fileExtension)"
        :childrenTab="childrenTab"
        :buttonKey="buttonKey"
        @handleBtnEmit="submitPrintModal"
      />
    </template>
  </a-modal>
</template>
<script src="./PrintModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
</style>
