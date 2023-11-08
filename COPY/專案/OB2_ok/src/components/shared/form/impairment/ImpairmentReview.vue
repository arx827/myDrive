<template>
  <div class="section-card section__reviewWork">
    <div class="card__title-position">
      <!-- 覆核作業 -->
      <span class="card__title">{{$t('reviewWork')}}</span>
    </div>
    <div class="card__infomation">
      <a-form-model
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :model="form"
        :rules="reviewformRules"
        class="reviewWorkFormPage"
        labelAlign="right"
      >
        <!-- 覆核意見 -->
        <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]" v-if="$props.isEdit">
          <a-col flex="1">
            <a-form-model-item :label="$t('reviewOpinion')" 
              :has-feedback="callCommonUtilFeild(reviewValidateForm.reviewProcess).feedback"
              :validateStatus="callCommonUtilFeild(reviewValidateForm.reviewProcess).state"
              prop="reviewProcess">
                <a-popover
                placement="top"
                :content="callCommonUtilFeild(reviewValidateForm.reviewProcess).msg"
                :trigger="callCommonUtilFeild(reviewValidateForm.reviewProcess).hover"
                :visible="callCommonUtilFeild(reviewValidateForm.reviewProcess).hoverVisible"
                @visibleChange="callCommonUtilFeildVisibleChange(reviewValidateForm.reviewProcess)"
                :destroyTooltipOnHide="true"
              >
              <a-textarea
                v-model="form.formData1"
                :maxLength="200"
                :autoSize="{ minRows: 3, maxRows: 3 }"
                :disabled="!$props.isEdit"
              ></a-textarea>
              <!-- 改成用disable的方式 -->
              <!-- 唯讀時顯示 -->
              <!-- <p class="readonly__textarea" v-else>{{ form.formData1 }}</p> -->
                </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <div class="ant-form-item-label">
          <!-- 覆核歷程 -->
          <label>{{$t('reviewHistory')}}</label>
        </div>
        <FblDataGrid
          :themeColor="'theme2'"
          :scroll="{ x: true }"
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data="gridData.data"
          :pagination="gridData.pagination"
          :empty-data="gridData.data.length <= 0"
        >
        </FblDataGrid>

      </a-form-model>
    </div>
  </div>
</template>
<script src="./ImpairmentReview.ts" lang="ts"></script>