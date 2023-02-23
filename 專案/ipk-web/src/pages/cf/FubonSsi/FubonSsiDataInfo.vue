<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualModalShow="false"
      :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
      @handleSearch="handleSearch($event)"
    />
    <IpkVxeTable
      class="pendingTable"
      :ipkGrid="ipkGrid"
      @getActionType="getActionType($event)"
      @handlePageChange="handlePageChange($event)"
    />
    <DataCheckInfoModal
      :checkInfo="checkInfo"
      :modalCheckInfoShow="modalCheckInfoShow"
      @closeCheckInfoModal="closeCheckInfoModal"
      @getPendingInfoCount="getPendingInfoCount"
    />
  </div>
</template>

<script src="./FubonSsiDataInfo.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-body {
    padding: 15px;
  }
}
</style>
