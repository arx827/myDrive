<template>
  <div class="btnGroup tabline">
    <a-row>
      <a-col>
        <AdvancedSearch
          ref="advancedSearch"
          v-model="advancedSearchForm"
          :labelList="labelList"
          :functionName="functionName"
          :usualModalShow="false"
          :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
          @handleSearch="handleSearch"
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <!-- 新增按鈕 -->
        <div class="mb-2">
          <IpkButton
            buttonType="primary"
            buttonText="新增"
            iconType="plus"
            :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
            :buttonKey="$buttonKey.buttonKey.ADD.val"
            @handleBtnEmit="openAddAndEditModal($settingsEnum.constant.ADD.value)"
          />
        <!-- <button class="btn__main btn__main--primary me-2" @click="openSendModal">
          <i class="fa fa-envelope-o icon_margin" />
          發送測試信
        </button> -->
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <IpkVxeTable
          :ipkGrid="ipkGrid"
          @sortChange="onSortChange($event)"
          @openCheckInfoModal="openCheckInfoModal($event)"
          @getActionType="getActionType($event)"
          @handlePageChange="handlePageChange($event)"
        />
      </a-col>
    </a-row>
    <AddAndEditModal
      :showAddAndEditModal="showAddAndEditModal"
      :addAndEditInfo="addAndEditInfo"
      @closeAddAndEditModal="closeAddAndEditModal"
      @handleSearch="handleSearch"
    />
    <MailModal
      :modal-notice-show="showCheckInfoModal"
      :detail="detail"
      :showPreview="true"
      @modalClose="closeCheckInfoModal"
    />
    <SendModal
      :sendModalShow="showSendModal"
      @closeModal="closeSendModal"
    />
  </div>
</template>

<script src="./MailSettingDataInfo.ts" />

<style lang="scss" scoped>
.buttonGroup {
  display: inline-block;
}
</style>
