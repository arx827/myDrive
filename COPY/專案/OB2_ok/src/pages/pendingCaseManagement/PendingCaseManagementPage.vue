<template >
  <div tabindex="-1" @keyup.enter="pendingCaseManagementPageSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ xs: 8, md: 11, xxl: 9 }"
          :wrapper-col="{ xs: 16, md: 13, xxl: 15 }"
          ref="PendingCaseManagementPage"
          :model="pendingCaseManagementForm"
          class="PendingCaseManagementPage"
        >
          <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
            <!--部門 -->
            <a-col :xs="24" :md="12" :xl="6" :xxl="6">
              <a-form-model-item required>
                <span slot="label"
                  >{{ $t("pendingCaseManagement_departmentName") }}
                </span>
                <a-select
                  class="select"
                  mode="multiple"
                  v-model="pendingCaseManagementForm.departmentIdList"
                  :allowClear="true"
                  :options="selectDepOptions"
                  :filter-option="filterOption"
                  @change="onSelectDept"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 科別 -->
            <a-col :xs="24" :md="12" :xl="6" :xxl="6">
              <a-form-model-item>
                <span slot="label">
                  {{ $t("pendingCaseManagement_divisionName") }}
                </span>
                <a-select
                  class="select"
                  mode="multiple"
                  v-model="pendingCaseManagementForm.divisionIdList"
                  :allowClear="true"
                  :options="selectDiviOptions"
                  :filter-option="filterOption"
                  @change="onSeletDivi"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 電訪員 -->
            <a-col :xs="24" :md="12" :xl="6" :xxl="6">
              <a-form-model-item>
                <span slot="label">
                  {{ $t("pendingCaseManagement_tmrName") }}
                </span>
                <a-select
                  class="select"
                  v-model="pendingCaseManagementForm.tmrIdList"
                  mode="multiple"
                  :allowClear="true"
                  :options="selectTmrOptions"
                  :filter-option="filterOption"
                  @change="exportDisable = true"
                  :placeholder="$t('global_all')"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- Pending項目 -->
            <a-col :xs="24" :md="12" :xl="6" :xxl="6">
              <a-form-model-item>
                <span slot="label">
                  {{ $t("pendingCaseManagement_pendingItem") }}
                </span>
                <a-select
                  class="select"
                  mode="multiple"
                  :allowClear="true"
                  v-model="pendingCaseManagementForm.pendingItem"
                  :options="pendingItemOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                  @change="exportDisable = true"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div>
            <a-row
              type="flex"
              justify="center"
              align="middle"
              class="searchBar"
            >
              <!-- 查詢 -->
              <a-button
                type="primary"
                @click="pendingCaseManagementPageSearch"
                >{{ $t("global_search") }}</a-button
              >
              <!-- 清除 -->
              <a-button type="default" @click="resetCasePageSearchForm">{{
                $t("global_clean")
              }}</a-button>
              <a-divider
                type="vertical"
                v-if="authComponent.PENDDING_MANAGE_EXPORT.show"
              ></a-divider>
              <!-- 匯出 -->
              <a-button
                class="ml-auto"
                type="primary"
                @click="exportResult"
                v-if="authComponent.PENDDING_MANAGE_EXPORT.show"
                :disabled="!authComponent.PENDDING_MANAGE_EXPORT.enable"
                >{{ $t("global_export") }}</a-button
              >
            </a-row>
          </div>
        </a-form-model>
      </template>
    </HiddenFolde>
    <a-row type="flex" class="dataNumBar" justify="space-between">
      <a-col>
        <div class="d-flex">
          <p class="updateTime-txt" v-if="isTableVisible">
            {{ $t("pendingCaseManagement_dataUpdateTime") + updateDateTime }}
          </p>
        </div>
      </a-col>
    </a-row>
    <div class="fbl-table">
      <a-table
        v-if="isTableVisible"
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data-source="grid.data"
        :pagination="grid.pagination"
        :scroll="{ y: 600 }"
        bordered
        size="small"
        class="pending_group"
        @change="onPageChange"
      >
        <template
          v-for="(item, index) in gridDataSlotCustomRenderArray"
          :slot="item"
          slot-scope="text, record, index, event"
        >
          <template
            v-if="
              text != '0' &&
              record['tmrName'] != $t('pendingCaseManagement_total') &&
              item != 'PENDDING_MENU'
            "
          >
            <!-- REVIEW_MENU(待覆核 6/30 不上)，UAT component:PENDDING_MANAGE_COL_REVIEW show = N: false ==> 空白 -->
            <p
              :key="index"
              v-if="
                item == 'REVIEW_MENU' &&
                !authComponent.PENDDING_MANAGE_COL_REVIEW.show
              "
            >
              <!-- 給空白 -->
            </p>
            <!-- 其餘照舊判斷顯示 -->
            <a
              v-else
              :key="index"
              @click="openPendingPage(record, index, event, text, item)"
              >{{ text }}
            </a>
          </template>
          <template
            v-else-if="
              text == '0' &&
              item == 'PENDDING_MENU' &&
              record['tmrName'] != $t('pendingCaseManagement_total')
            "
          >
            <!-- REVIEW_MENU(待覆核 6/30 不上)，UAT component:PENDDING_MANAGE_COL_REVIEW show = N: false ==> 空白 -->
            <p
              :key="index"
              v-if="
                item == 'REVIEW_MENU' &&
                !authComponent.PENDDING_MANAGE_COL_REVIEW.show
              "
              style="color: tomato"
            >
              <!-- 給空白 -->
            </p>
            <!-- 其餘照舊判斷顯示 -->
            <p :key="index" v-else style="color: tomato">{{ text }}</p>
          </template>
          <template v-else>
            <!-- REVIEW_MENU(待覆核 6/30 不上)，UAT component:PENDDING_MANAGE_COL_REVIEW show = N: false ==> 空白 -->
            <p
              :key="index"
              v-if="
                item == 'REVIEW_MENU' &&
                !authComponent.PENDDING_MANAGE_COL_REVIEW.show
              "
              style="color: tomato"
            >
              <!-- 給空白 -->
            </p>
            <!-- 其餘照舊判斷顯示 -->
            <p :key="index" v-else>{{ text }}</p>
          </template>
        </template>
      </a-table>
    </div>
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showPendingDetailForm"
      :title="$t('pendingCaseManagement_pendingItemTitle') + pendingDetailTitle"
      width="2000px"
      :okText="$t('pendingCaseManagement_close')"
      :closable="true"
      @cancel="showPendingDetailForm = false"
      :removeCancelButton="true"
      :isMasked="false"
    >
      <PendingDetailForm
        ref="pendingDetailForm"
        :record="record"
        :item="item"
      />
      <template slot="footer">
        <a-button
          type="primary"
          @click="showPendingDetailForm = !showPendingDetailForm"
        >
          {{ $t("pendingCaseManagement_close") }}
        </a-button>
      </template>
    </DragModal>
  </div>
</template>

<script src="./PendingCaseManagementPage.ts" lang="ts"></script>

<style lang="less" scoped>
/deep/ .pending_group {
  .ant-table-header-column {
    justify-content: center;
    display: flex;
  }
}

.PendingCaseManagementPage {
  padding: 5px 15px 20px;
  background: @COLOR-MAIN11;
  .ant-form-item {
    margin-bottom: 0;
  }
}

.updateTime-txt {
  margin-left: auto;
  color: @FONT-COLOR-BLUE-LIGHT;
}

.searchBar {
  // width: 30%;
  margin: 15px auto 0;
  .ant-btn {
    margin: 0 5px;
  }
}

.dataNumBar {
  margin: 0 30px;
}

.fbl-table {
  padding-left: 24px;
  padding-right: 12px;
  margin: 10px 0;
  // 針對『尚待取件』、『合計』文字置中 (硬解)
  /deep/ .ant-table-fixed-left {
    .ant-table-body-outer {
      .ant-table-row:first-child {
        td:first-child {
          text-align: center;
        }
      }
      .ant-table-row:last-child {
        td:first-child {
          text-align: center;
        }
      }
    }
  }
}
</style>
