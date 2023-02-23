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
    <AnnouncementModal
      :modal-announcement-show="showCheckInfoModal"
      :detail="announcementDetail"
      @closeAnnouncementModal="closeCheckInfoModal"
    />
  </div>
</template>

<script src="./AnnouncementSettingDataInfo.ts" />
