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
    <IpkVxeTable
      ref="ipkGrid"
      :ipkGrid="pendingDataGrid"
      @sortChange="onPendingSortChange($event)"
      @getPendingSelected="getPendingSelected($event)"
      @checkboxChange="onCheckboxChange($event)"
      @checkboxAll="onCheckboxChange($event)"
      @handlePageChange="handlePageChange($event)"
    />
    <!-- 複製新增彈窗 -->
    <SsiAddAndEditModal
      :modalAddInfoShow="modalAddInfoShow"
      :addAndEditInfo="addAndEditInfo"
      @closeAddAndEditModal="closeAddAndEditModal"
    />
    <!-- 新增檢視彈窗 -->
    <SsiCheckInfoModal
      :modalCheckInfoShow="modalCheckInfoShow"
      :checkInfo="checkInfoForm"
      :isDisabled="isDisabled"
      :isPending="true"
      @closeCheckInfoModal="closeCheckInfoModal"
      @handleReject="handleReject($event)"
      @handleReview="handleReview($event)"
    />
    <!-- 編輯檢視彈窗 -->
    <CheckEditInfoCollapseModal
      :modal-check-edit-info-show="modalCheckEditInfoShow"
      :checkInfoEditFormTitle="checkInfoEditFormTitle"
      :afterForm="checkInfoAfterForm"
      :beforeForm="checkInfoBeforeForm"
      :isDisabled="isDisabled"
      @closeCheckEditInfoModal="closeCheckEditInfoModal"
      @handleReject="setRejectData($event)"
      @handleReview="setReviewData($event)"
    >
      <template v-slot:fileData>
        <div v-if="!isEmpty(fileAfterData)">
          <label class="form__label">附件(檔案類型/商品代碼/市場別)</label>
          <div
            v-for="(file, fileIndex) in fileAfterData"
            :key="fileIndex"
          >
            <div>
              <a-icon type="paper-clip" class="icon_margin" />
              <a
                class="checkInfo_file_input"
                :class="{'afterEditInfo': file.attachmentName.isEdit}"
                @click="handleDownloadAttachment(file.attachmentId.key, file.attachmentName.key)"
              >
                {{ file.attachmentName.key }}
              </a>
            </div>
            <div
              class="ms-3 checkInfo_file_input"
              :class="{'afterEditInfo': (file.attachmentType.isEdit && file.productCode.isEdit && file.market.isEdit)}"
            >
              (
              <span :class="{'afterEditInfo': file.attachmentType.isEdit}">
                {{ file.attachmentType.key }} /
              </span>
              &nbsp;
              <span :class="{'afterEditInfo': file.productCode.isEdit}">
                {{ file.productCode.key }} /
              </span>
              &nbsp;
              <span :class="{'afterEditInfo': file.market.isEdit}">
                {{ file.market.key }}
              </span>
              )
            </div>
          </div>
        </div>
        <div v-else>
          無
        </div>
      </template>
    </CheckEditInfoCollapseModal>
  </div>
</template>

<script src="./CounterpartySsiPendingInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
.afterEditInfo {
  color: red !important;
}
.form__label {
  font-weight: $TEXT-BOLD;
  display: block;
  margin: 0;
  padding: 0 0 8px;
  line-height: 1.5;
  white-space: initial;
  text-align: left;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
