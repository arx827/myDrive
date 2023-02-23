<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchPendingForm"
      :labelList="pendingLabelList"
      :usualModalShow="false"
      :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
      @handleSearch="handleSearch($event)"
    />
    <div class="mx-0 mt-1 mb-2">
      <IpkButton
        buttonType="primary"
        buttonText="放行"
        iconType="check"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReviewList($cfEnum.reviewStatus.APPROVAL.val)"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="拒絕"
        iconType="stop"
        :buttonDisabled="isEmpty(selectedRowList)"
        :childrenTab="$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$cfButtonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleRejectList($cfEnum.reviewStatus.REJECT.val)"
      />
    </div>
    <DataCashAddModal
      :checkInfo="checkInfo"
      :cashModalAddInfoShow="cashModalAddInfoShow"
      @closeAddAndEditModal="closeCashAddModal"
      @getPendingInfoCount="getPendingInfoCount"
      @reSearch="reSearch"
    />
    <DataEquityAddModal
      :checkInfo="checkInfo"
      :equityModalAddInfoShow="equityModalAddInfoShow"
      @closeAddAndEditModal="closeEquityAddModal"
      @getPendingInfoCount="getPendingInfoCount"
      @reSearch="reSearch"
    />
    <IpkVxeTable
      ref="ipkGrid"
      :ipkGrid="pendingDataGrid"
      @sortChange="onPendingSortChange($event)"
      @getPendingSelected="getPendingSelected($event)"
      @checkboxChange="onCheckboxChange($event)"
      @checkboxAll="onCheckboxChange($event)"
      @handlePageChange="handlePageChange($event)"
    />
    <CheckInfoModal
      :modal-check-info-show="modalCheckInfoShow"
      :form="checkInfoAddForm"
      :isDisabled="isDisabled"
      @closeCheckInfoModal="closeCheckInfoModal"
    />
    <CheckEditInfoCollapseModal
      :modal-check-edit-info-show="modalCheckEditInfoShow"
      :checkInfoEditFormTitle="checkInfoEditFormTitle"
      :afterForm="checkInfoAfterForm"
      :beforeForm="checkInfoBeforeForm"
      :isDisabled="isDisabled"
      @closeCheckEditInfoModal="closeCheckEditInfoModal"
      @handleReject="handleReject($event, $cfEnum.constant.MODIFY.val)"
      @handleReview="handleReview($event, $cfEnum.constant.MODIFY.val)"
    >
      <template v-slot:noCompareColumn>
        <a-form-model
          layout="vertical"
          :model="oriForm"
        >
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="24">
              <a-form-model-item prop="custodianBankCode" label="保管機構">
                <a-input
                  v-model="oriForm.custodianBankCode"
                  class="checkInfo__input"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="12">
              <a-form-model-item prop="currency" label="幣別">
                <a-input
                  v-model="oriForm.currency"
                  class="checkInfo__input"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="type" label="使用類別">
                <a-input
                  v-model="oriForm.type"
                  class="checkInfo__input"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </template>
    </CheckEditInfoCollapseModal>
    <PendingCheckInfoModal
      :addAndEditInfo="checkInfo"
      :modal-add-info-show="modalAddInfoShow"
      :form="checkInfoAddForm"
      :isDisabled="isDisabled"
      :activeKey="activeKey"
      @handleReject="handleReject($event, $cfEnum.constant.ADD.val)"
      @handleReview="handleReview($event, $cfEnum.constant.ADD.val)"
      @closeCheckInfoModal="closeCheckInfoModal()"
    />
  </div>
</template>

<script src="./FubonSsiPendingInfo.ts" lang="ts" />

<style lang="scss" scoped>
</style>
