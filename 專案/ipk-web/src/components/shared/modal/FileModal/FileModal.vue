<template>
  <a-modal
    v-model="fileModalVisible"
    :title="'產檔'"
    :maskClosable="false"
    :keyboard="false"
    width="474px"
    :destroyOnClose="true"
    @cancel="closeFileModal"
  >
    <div>
      <div class="modal__body">
        <div>請選擇保管行</div>
        <div class="my-2">
          <a-radio-group v-model="custodian" :options="$cfEnum.custodianOption" />
        </div>
      </div>
    </div>
    <template slot="footer">
      <IpkButton
        buttonType="lightBlue"
        buttonText="取消"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closeFileModal"
      />
      <IpkButton
        buttonType="primary"
        buttonText="確認"
        iconType="check"
        :childrenTab="childrenTab"
        :buttonKey="buttonKey"
        @handleBtnEmit="submitDataFile"
      />
    </template>
  </a-modal>
</template>
<script src="./FileModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
</style>
