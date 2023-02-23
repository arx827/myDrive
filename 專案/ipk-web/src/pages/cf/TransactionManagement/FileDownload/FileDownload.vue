<template>
  <div>
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualModalShow="false"
      @handleSearch="handleSearch($event)"
    />
    <IpkVxeTable
      ref="ipkGrid"
      :ipkGrid="ipkGrid"
      @sortChange="onSortChange($event)"
      @handleDownloadFile="handleDownload($event)"
      @handlePageChange="handlePageChange($event)"
    />
  </div>
</template>
<script src="./FileDownload.ts" lang="ts" />

<style lang="scss" scoped>

</style>
