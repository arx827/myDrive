<template>
  <div class="section-card section__basic">
    <div class="card__title-position">
      <!-- 基本資料 -->
      <span class="card__title">{{$t('notificationBasic_basicInfo')}}</span>
    </div>
    <div class="card__infomation">
      <a-descriptions size="middle" :column="{ xs:1, sm:1, md:2, lg:2, xxl:3 }" bordered>
        <!-- 保單號碼(無保單號碼則顯示受理案號)： -->
        <a-descriptions-item :label="$t('notificationBasic_policyNoChangeNo')">
          <!-- <p v-if="insetPolicy">{{ form.policyNo }}</p> -->
          <a-form>
            <a-form-item>
              <!-- 請選擇保單號碼 -->
              <a-select 
                v-if="isEdit && !basicCaseNo"
                class="select"
                v-model="form.caseNo"
                :options="selectPolicyOptions"
                @change="getBasicData"
                style="width:150px"
                :getPopupContainer="trigger => trigger.parentNode"
              >
              </a-select>
            </a-form-item>
            <div v-if="!isEdit || (isEdit && basicCaseNo)">{{ basicInfoData.casePolicy }}</div>
          </a-form>
        </a-descriptions-item>

        <!-- 照會單號： -->
        <a-descriptions-item :label="$t('notificationBasic_notiInfoId')" :span="2">{{ basicInfoData.notiInfoId }}</a-descriptions-item>
        <!-- 照會次數： -->
        <a-descriptions-item :label="$t('notificationBasic_notiCount')">{{ basicInfoData.notiCount }}</a-descriptions-item>
        <!-- 要保人： -->
        <a-descriptions-item :label="$t('notificationBasic_pherName')">{{ basicInfoData.pherName }}</a-descriptions-item>
        <!-- 被保險人： -->
        <a-descriptions-item :label="$t('notificationBasic_insuName')">{{ basicInfoData.insuName }}</a-descriptions-item>
        <!-- 電訪項目： -->
        <a-descriptions-item :label="$t('notificationBasic_taskId')" :span="2">{{ basicInfoData.taskName }}</a-descriptions-item>
        <!-- 受訪者身分： -->
        <a-descriptions-item :label="$t('notificationBasic_custType')">{{ basicInfoData.custTypeDes }}</a-descriptions-item>
        <!-- 受訪者姓名： -->
        <a-descriptions-item :label="$t('notificationBasic_custName')">{{ basicInfoData.custName }}</a-descriptions-item>
        <!-- 招攬單位： -->
        <a-descriptions-item :label="$t('notificationBasic_agentUnitName')">{{ basicInfoData.agentUnitName }}</a-descriptions-item>
        <!-- 業務員： -->
        <a-descriptions-item :label="$t('notificationBasic_agentName')">{{ agentName }}
          <a-button
            class="callUpForm-callBtn"
            type="primary"
            :disabled="!basicInfoData.editCallUp || isCaseClosed"
            @click="onDialClick"
            v-if="!isReview"
            ><a-icon type="phone" theme="filled"
          /></a-button>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <!-- 聯絡業務員 -->
    <a-modal
      class="c-section c-section--else pointer-events-none"
      :visible="contactAgentShow"
      :title="$t('notificationBasic_contactAgent')"
      width="65%"
      :okText="$t('global_close')"
      :closable="false"
      :isMasked="false"
      :removeCancelButton="true"
      :destroyOnClose="true"
      @ok="contactAgentShow = false"
      @cancel="onLeave()"
    >
      <NotificationCallUpAgentModal 
        :caseNo="form.caseNo" 
        ref="notificationCallUpAgentModal"
        @closeForm="onFormCalcel"
        :notiInfoId="this.form.notiInfoId"
        :isFromOnDuty="true"
      />
      <template #footer>
        <!-- 儲存(關閉中) -->
        <a-row type="flex" justify="end">
          <!-- <a-button key="button" type="primary" @click="onFormSubmit" v-if="false">{{ 
            $t("global_save")
          }}</a-button> -->
          <!-- 離開 -->
          <a-button key="submit" @click="onLeave()">{{
            $t("global_leave")
          }}</a-button>
        </a-row>
      </template>

    </a-modal>
  </div>
</template>
<script src="./NotificationBasic.ts" lang="ts"></script>
<style lang="less" scoped>
  /deep/ .card__infomation {
    .ant-form-item {
      margin-bottom: 0;
    }
    .ant-descriptions-view {
      overflow: auto;
    }
    .ant-descriptions-item-label {
      white-space: nowrap;
    }
    .ant-descriptions-item-content {
      // 保留保單號碼 寬度
      min-width: 15em;
    }
    .callUpForm-callBtn {
      margin-left: 5px;
    }
  }
</style>