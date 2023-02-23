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
          <IpkButton
            buttonType="primary"
            buttonText="全體發送"
            iconType="mail"
            :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
            :buttonKey="$buttonKey.buttonKey.SEND.val"
            @handleBtnEmit="openSendModal"
          />
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
    <NoticeModal
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

<script src="./NoticeSettingDataInfo.ts" />

<style lang="scss" scoped>
.buttonGroup {
  display: inline-block;
}
</style>
