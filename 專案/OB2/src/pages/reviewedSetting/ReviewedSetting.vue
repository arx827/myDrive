<template @keyup.enter="onReviewedSettingSearch">
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
                  reviewedSettingValidateForm.selectedReviewedSettingType
                    .feedback
                "
                :validateStatus="
                  reviewedSettingValidateForm.selectedReviewedSettingType.state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    reviewedSettingValidateForm.selectedReviewedSettingType
                      .content
                  "
                  :trigger="
                    reviewedSettingValidateForm.selectedReviewedSettingType
                      .trigger
                  "
                  :destroyTooltipOnHide="true"
                  :visible="isreviewedSettingValidateVisible"
                >
                  <span
                    @mouseleave="isreviewedSettingValidateVisible = false"
                    @mousemove="reviewedSettingValidateMouseOver()"
                  >
                    <a-select
                      style="width: 100%"
                      :filter-option="filterOption"
                      :options="reviewSettingOptions"
                      v-model="
                        reviewedSettingSearchForm.selectedReviewedSettingType
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
                  reviewedSettingValidateForm.selectedReviewedType.feedback
                "
                :validateStatus="
                  reviewedSettingValidateForm.selectedReviewedType.state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    reviewedSettingValidateForm.selectedReviewedType.content
                  "
                  :trigger="
                    reviewedSettingValidateForm.selectedReviewedType.trigger
                  "
                  :destroyTooltipOnHide="true"
                  :visible="isReviewedTypeValidateVisible"
                >
                  <span
                    @mouseleave="isReviewedTypeValidateVisible = false"
                    @mousemove="reviewedTypeValidateMouseOver()"
                  >
                    <a-select
                      style="width: 100%"
                      :filter-option="filterOption"
                      :options="reviewTypeOptions"
                      v-model="reviewedSettingSearchForm.selectedReviewedType"
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
                  reviewedSettingValidateForm.selectedReviewedSubType.feedback
                "
                :validateStatus="
                  reviewedSettingValidateForm.selectedReviewedSubType.state
                "
              >
                <a-popover
                  placement="top"
                  :content="
                    reviewedSettingValidateForm.selectedReviewedSubType.content
                  "
                  :trigger="
                    reviewedSettingValidateForm.selectedReviewedSubType.trigger
                  "
                  :destroyTooltipOnHide="true"
                  :visible="isReviewedSubTypeValidateVisible"
                >
                  <span
                    @mouseleave="isReviewedSubTypeValidateVisible = false"
                    @mousemove="reviewedSubTypeValidateMouseOver()"
                  >
                    <a-select
                      style="width: 100%"
                      :filter-option="filterOption"
                      :options="reviewSubTypeOptions"
                      v-model="
                        reviewedSettingSearchForm.selectedReviewedSubType
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
                <a-button type="primary" @click="onReviewedSettingSearch">
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
        <a-button type="primary" @click="onReviewedSettingSubmit()">{{
          $t("global_save")
        }}</a-button>
        <a-button @click="onReviewedSettingCancel()">{{
          $t("global_cancel")
        }}</a-button>
      </a-space>
    </a-row>

  </div>
</template>


<script lang="ts" src="./ReviewedSetting.ts" >
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
</script>

<style scoped>
</style>