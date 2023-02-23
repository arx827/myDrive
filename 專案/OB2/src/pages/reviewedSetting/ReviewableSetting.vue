<template @keyup.enter="onReviewSettingSearch">
  <div>
    <hidden-folde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          ref="shiftsRules"
          style="background-color: #eef6f8"
        >
        
          <a-row>
            <a-col :span="6">
              <a-form-model-item
                :label="$t('reviewSP_reviewSettingType')"
                style="margin-bottom: 0px"
                :has-feedback="
                  reviewSettingValidateForm.selectedReviewSettingType
                    .feedback
                "
                :validateStatus="
                  reviewSettingValidateForm.selectedReviewSettingType.state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    reviewSettingValidateForm.selectedReviewSettingType
                      .content
                  "
                  :trigger="
                    reviewSettingValidateForm.selectedReviewSettingType
                      .trigger
                  "
                  :destroyTooltipOnHide="true"
                  :visible="isreviewSettingValidateVisible"
                >
                  <span
                    @mouseleave="isreviewSettingValidateVisible = false"
                    @mousemove="reviewSettingValidateMouseOver()"
                  >
                    <a-select
                      style="width: 100%"
                      :filter-option="filterOption"
                      :options="reviewSettingOptions"
                      v-model="
                        reviewSettingSearchForm.selectedReviewSettingType
                      "
                      @change="onReviewSettingTypeChange"
                    >
                    </a-select>
                  </span>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="6" style="padding-left: 10px">
              <a-form-model-item
                :label="$t('reviewSP_reviewMajorType')"
                style="margin-bottom: 0px"
                :has-feedback="
                  reviewSettingValidateForm.selectedReviewType.feedback
                "
                :validateStatus="
                  reviewSettingValidateForm.selectedReviewType.state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    reviewSettingValidateForm.selectedReviewType.content
                  "
                  :trigger="
                    reviewSettingValidateForm.selectedReviewType.trigger
                  "
                  :destroyTooltipOnHide="true"
                  :visible="isReviewTypeValidateVisible"
                >
                  <span
                    @mouseleave="isReviewTypeValidateVisible = false"
                    @mousemove="reviewTypeValidateMouseOver()"
                  >
                    <a-select
                      style="width: 100%"
                      :filter-option="filterOption"
                      :options="reviewTypeOptions"
                      v-model="reviewSettingSearchForm.selectedReviewType"
                      @change="onReviewTypeChange"
                      :disabled="reviewTypeDisable"
                    >
                    </a-select>
                  </span>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" style="padding-left: 10px">
              <a-form-model-item
                :label="$t('reviewSP_reviewSubjectType')"
                style="margin-bottom: 0px"
                :has-feedback="
                  reviewSettingValidateForm.selectedReviewSubType.feedback
                "
                :validateStatus="
                  reviewSettingValidateForm.selectedReviewSubType.state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    reviewSettingValidateForm.selectedReviewSubType.content
                  "
                  :trigger="
                    reviewSettingValidateForm.selectedReviewSubType.trigger
                  "
                  :destroyTooltipOnHide="true"
                  :visible="isReviewSubTypeValidateVisible"
                >
                  <span
                    @mouseleave="isReviewSubTypeValidateVisible = false"
                    @mousemove="reviewSubTypeValidateMouseOver()"
                  >
                    <a-select
                      style="width: 100%"
                      :filter-option="filterOption"
                      :options="reviewSubTypeOptions"
                      v-model="
                        reviewSettingSearchForm.selectedReviewSubType
                      "
                      :disabled="reviewSubTypeDisable"
                      @change="onReviewSubTypeChange()"
                    >
                    </a-select>
                  </span>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
            <a-space>
              <a-button type="primary" @click="onReviewSettingSearch">
                <!-- @click="onUserTaskSearch()" -->
                {{ $t("global_search") }}
              </a-button>
            

            </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </hidden-folde>
    <a-row></a-row>
    <a-row>
      <ReviewSettingUpdate
        :mockData="reviewSettingRolesMockData"
        :targetKeys="reviewSettingIdRole"
        ref="roleUpdate"
      >
      </ReviewSettingUpdate>
    </a-row>

    <a-row
      type="flex"
      justify="end"
      style="margin-top: 16px; padding-right: 16px"
    >
    
      <a-space>
        <a-button type="primary" @click="onRoleFormSubmit()">{{
          $t("global_save")
        }}</a-button>
        <a-button @click="onReviewSettingCancel()">{{ $t("global_cancel") }}</a-button>
      </a-space>
    </a-row>

  </div>
</template>

<script lang="ts" src="./ReviewableSetting.ts" >

</script>

<style scoped>
</style>