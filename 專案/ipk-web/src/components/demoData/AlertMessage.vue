<template>
  <div class="btnGroup tabline">
    <div class="event__block form__title pb-3">
      Modal 訊息提示
    </div>
    <a-row>
      <a-col :span="24" class="setting__desc">
        各種提示訊息使用時機：
        <ul class="form__content">
          <li><span class="text--bold">alertError</span> -  系統執行失敗或錯誤時使用 (非驗證類的錯誤)。</li>
          <li><span class="text--bold">alertSuccess</span> - 系統執行成功時使用。</li>
          <li><span class="text--bold">alertInfo</span> - 提示訊息，使用情境如下：</li>
          <div>(1) 重複確認提醒 - 例如：刪除前跳確認通知。</div>
          <div>(2) 提示彈窗需輸入資訊時使用 - 例如：拒絕原因。</div>
          <div>(3) 驗證類的錯誤 - 例如：表單欄位驗證。</div>
        </ul>
      </a-col>
      <a-col offset="1" :span="10">
        <button class="btn__main btn__main--primary" @click="handleFail">
          alertError
        </button>
        <button class="btn__main btn__main--primary" @click="handleSuccess">
          alertSuccess
        </button>
        <button class="btn__main btn__main--primary" @click="handleInfo">
          alertInfo
        </button>
      </a-col>
    </a-row>
    <!-- 客製化訊息彈窗 -->
    <CustomizationModal
      :modalCustomizationShow="modalCustomizationShow"
      :title="'請輸入拒絕放行原因'"
      :content="'若確認拒絕放行，請輸入拒絕放行原因，謝謝。'"
      :confirm="true"
      @closeCustomizationModal="closeCustomizationModal($event)"
      @handleSubmit="closeCustomizationModal(reviewDto)"
    >
      <template v-slot:modalContent>
        <a-textarea
          v-model="rejectReason"
          :auto-size="{ minRows: 3, maxRows: 3 }"
          allow-clear
          style="width: 90%; margin-left: 27px"
          :maxLength="100"
          placeholder="請簡述拒絕放行原因。"
        />
      </template>
    </CustomizationModal>
  </div>
</template>

<script src="./AlertMessage.ts" lang="ts">
</script>

<style lang="scss" scoped>
li {
  margin: 10px 0;
}
// 表單標題
.form__title {
    color: #2F6A9A;
    font-size: 20px;
    font-weight: 700;
}
.setting__desc {
  border: 1px solid gray;
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 15px;
  width: 550px;
}
.form__content {
  list-style: decimal;
}
.text--bold {
  font-weight: bold;
  line-height: 1.5;
}
.event__block {
  margin-top: 20px;
}
</style>
