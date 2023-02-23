<template>
  <div>
    <FblDataGrid
      :themeColor="'theme2'"
      :row-key="gridData.rowKey"
      :columns="gridData.columns"
      :data="gridData.data"
      :pagination="gridData.pagination"
      :scroll="gridData.scroll"
      @tableChange="onPageChange($event)"
    >
      <template v-slot:casePolicyTemp="slotProps">
        <a @click="openCaseHistory(slotProps.data)">{{
          slotProps.data.casePolicy
        }}</a>
      </template>
    </FblDataGrid>

    <!-- 案件歷程Modal -->
    <DragModal
      :visible="isShowCaseHistory"
      :title="$t('case_search_caseHistory')"
      :closable="true"
      :visibleFooter="false"
      :destroyOnClose="true"
      :isMasked="false"
      @cancel="isShowCaseHistory = false"
      width="2000px"
    >
      <CaseHistoryForm :caseHistoryParam="caseHistoryParam"></CaseHistoryForm>
    </DragModal>
  </div>
</template>
<script src="./PendingDetailForm.ts" lang="ts"></script>