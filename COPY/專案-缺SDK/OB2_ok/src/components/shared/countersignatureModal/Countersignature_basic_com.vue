<template>
  <div class="section-card section__basic">
    <div class="card__title-position">
      <!-- 基本資料 -->
      <span class="card__title">{{$t('infBasic_basicInfo')}}</span>
    </div>
    <div class="card__infomation">
      <a-descriptions size="middle" :column="{ xs:1, sm:1, md:2, lg:2, xxl:3 }" bordered>
        <!-- 保單號碼(無保單號碼則顯示受理案號)： -->
        <a-descriptions-item :label="$t('infBasic_policyNoChangeNo')">
          <!-- <p v-if="insetPolicy">{{ form.policyNo }}</p> -->
          <a-form>
            <a-form-item>
              <!-- 請選擇保單號碼 -->
              <a-select 
                v-if="isEdit"
                class="select"
                v-model="form.caseNo"
                :options="selectPolicyOptions"
                @change="getPolicyData"
                style="width:150px"
                :disable="basicCaseNo"
                :getPopupContainer="trigger => trigger.parentNode"
              >
              </a-select>
            </a-form-item>
            <div v-if="!isEdit">{{policyInfoData.casePolicy}}</div>
            <div v-if="!isEdit && !policyInfoData.casePolicy">{{policyInfoData.chageNo}}</div>
          </a-form>
        </a-descriptions-item>
        
        <!-- 受訪者身分： -->
        <a-descriptions-item :label="$t('infBasic_custType')">{{ policyInfoData.custTypeName }}</a-descriptions-item>
        <!-- 電訪項目： -->
        <a-descriptions-item :label="$t('infBasic_taskId')">{{ policyInfoData.taskName }}</a-descriptions-item>
        <!-- 要保人ID： -->
        <a-descriptions-item :label="$t('infBasic_pherId')">{{ policyInfoData.pherId }}</a-descriptions-item>
        <!-- 要保人姓名： -->
        <a-descriptions-item :label="$t('infBasic_pherName')">{{ policyInfoData.pherName }}</a-descriptions-item>
        <!-- 單位名稱： -->
        <a-descriptions-item :label="$t('infBasic_agentUnitName')">{{ policyInfoData.agentUnitName }}</a-descriptions-item>
        <!-- 被保人ID： -->
        <a-descriptions-item :label="$t('infBasic_insuId')">{{ policyInfoData.insuId }}</a-descriptions-item>
        <!-- 被保人姓名： -->
        <a-descriptions-item :label="$t('infBasic_insuName')">{{ policyInfoData.insuName }}</a-descriptions-item>
        <!-- 業務員： -->
        <a-descriptions-item :label="$t('infBasic_agentNames')">{{ policyInfoData.agentNames }}</a-descriptions-item>
        <!-- 法代/監護人ID： -->
        <a-descriptions-item :label="$t('infBasic_legalId')">{{ policyInfoData.legalId }}</a-descriptions-item>
        <!-- 法代/監護人姓名： -->
        <a-descriptions-item :label="$t('infBasic_legalName')">{{ policyInfoData.legalName }}</a-descriptions-item>
        <!-- 案件承辦： -->
        <a-descriptions-item :label="$t('infBasic_underTasker')">{{ policyInfoData.underTaker }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>
<script src="./Countersignature_basic_com.ts" lang="ts"></script>
<style lang="less" scoped>

  /deep/ .card__infomation {

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

  }
</style>