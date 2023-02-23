<template>
  <div tabindex="-1" @keyup.enter="searchOtherAgent">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          ref="notificationAgentSearchModal"
          :model="notificationAgentSearchForm"
          class="notification-agent-search-modal"
        >
          <a-row>
            <!-- 業務員ID -->
            <a-col :span="7">
              <a-form-model-item prop="agentId">
                <span slot="label">{{
                  $t("notificationAgentSearchModal_agentId")
                }}</span>
                <a-input
                  type="text"
                  :maxLength="12"
                  v-model="notificationAgentSearchForm.agentId"
                />
              </a-form-model-item>
            </a-col>
            <!-- 業務員姓名 -->
            <a-col :span="7">
              <a-form-model-item prop="agentName">
                <span slot="label">{{
                  $t("notificationAgentSearchModal_agentName")
                }}</span>
                <a-input
                  type="text"
                  :maxLength="15"
                  v-model="notificationAgentSearchForm.agentName"
                />
              </a-form-model-item>
            </a-col>
            <!-- 單位代號 -->
            <a-col :span="7">
              <a-form-model-item prop="agentUnitId">
                <span slot="label">{{
                  $t("notificationAgentSearchModal_agentUnitId")
                }}</span>
                <a-input
                  type="text"
                  :maxLength="10"
                  v-model="notificationAgentSearchForm.agentUnitId"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button class="header-button" @click="searchOtherAgent">{{
                  $t("global_search")
                }}</a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-spin :spinning="isLoading">
      <div class="result__table">
        <FblDataGrid
          :themeColor="'theme2'"
          :rowKey="otherAgentGrid.rowKey"
          :columns="otherAgentGrid.columns"
          :data="otherAgentGrid.data"
          :pagination="otherAgentGrid.pagination"
          :scroll="otherAgentGrid.scroll"
          size="small"
          @tableChange="onPageChange($event)"
          ref="caseHistoryPageGrid"
        >
          <template v-slot:pickTemplate="slotProps">
            <a @click="pickAgent(slotProps.data)">{{
              $t("notificationAgentSearchModal_pickAgent")
            }}</a>
          </template>
        </FblDataGrid>
      </div>
    </a-spin>
  </div>
</template>

<script src="./NotificationAgentSearchModal.ts" lang="ts"></script>

<style lang="less" scoped>
.notification-agent-search-modal {
  padding: 5px 15px 20px;
  background: @COLOR-MAIN11;
  .ant-form-item {
    margin-bottom: 0;
  }
}

.datePicker__interval {
  .mx-datepicker {
    flex: 1;
  }
  .interval__symbol {
    margin: 0 5px;
  }
}

.searchBar {
  margin: 15px auto 0;
  .ant-btn {
    margin: 0 5px;
  }
}

.header-button {
  margin-right: auto;
  padding: 6px 10px;
  background-color: @ICON-BUTTON-BG-BLUE;
  color: @COLOR-WHITE;
  border-radius: 4px;
  border: 0;
  min-width: 33px;
  min-height: 33px;
  text-align: center;
  cursor: pointer;
}
.result__table {
  margin-top: 0.5rem !important;
}
</style>