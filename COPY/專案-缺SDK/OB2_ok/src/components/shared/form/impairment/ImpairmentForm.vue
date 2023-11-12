<template>
  <!-- <div class="impairmentFormModal"> -->
  <div class="contentscrollbar">  
    <a-collapse v-model="activeKey" class="modal-collapse">
      <!-- 基本資料 -->
      <a-collapse-panel key="1" :header="'基本資料'">
        <FblDataGrid
          :themeColor="'theme2'"
          :scroll="{ x: true }"
          :row-key="impairmentgridData.rowKey"
          :columns="impairmentgridData.columns"
          :data="impairmentgridData.data"
          :pagination="impairmentgridData.pagination"
          :empty-data="impairmentgridData.data.length <= 0"
        >
        </FblDataGrid>
      </a-collapse-panel>
    </a-collapse>

    <a-collapse v-model="activeKey" class="modal-collapse">
      <!-- 新增/註銷聽語障註記檔 -->
      <a-collapse-panel key="2" :header="'新增/註銷聽語障註記檔'">
        <a-descriptions
          :layout="layoutStyle"
          :column="1"
          :size="sizeStyle"
          bordered
          >
          <!-- 新增 -->
          <a-descriptions-item 
          :label="'新增聽語障註記檔'" 
          :size="sizeStyle"
          >
            <!-- 聽障 -->
            <a-checkbox 
            :checked="chkIsAddNonHearing" 
            @change="chkIsAddNonHearingOption"
            :disabled="showimpairmentMarkReason"
            >
              {{$t('IS_HEARING')}}
            </a-checkbox>
            <!-- 語障 -->
            <a-checkbox 
            :checked="chkisAddNonLanguage"
            @change="chkisAddNonLanguageOption"
            :disabled="showimpairmentMarkReason"
            >
              {{$t('IS_LANGUAGE')}}
            </a-checkbox>
          </a-descriptions-item>

          <!-- 註銷 -->
          <a-descriptions-item :label="'註銷聽語障註記檔'">
            {{'原因:'}}
            <a-form-model-item
                prop="code"
              >
                <!-- 全部 -->
                <a-select
                  style="min-width: 230px;"
                  :options="selectImpairmentMarkReasonOptions"
                  v-model="this.impairmentMarkReasoncode"
                  @change="SelectOption"
                  :disabled="!showimpairmentMarkReasoncode"
                ></a-select>
              </a-form-model-item>
          </a-descriptions-item>
          <template slot="contResultTemp" >
          </template>
        </a-descriptions>
        
      </a-collapse-panel>
    </a-collapse>

    <div class="ant-form-item-label">
          <!-- 案件紀錄 -->
          <label>{{'案件紀錄'}}</label>
    </div>
        <FblDataGrid
          :themeColor="'theme2'"
          :scroll="{ x: true }"
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data="gridData.data"
          :pagination="gridData.pagination"
          :empty-data="gridData.data.length <= 0"
        >
        </FblDataGrid>

    <a-row type="flex" justify="end" class="modal__footerBar" :gutter="[10, 0]">
      <a-col>
        <!-- 確定 -->
        <a-button type="primary" @click="onSubmit">{{ $t('global_ok') }}</a-button>
      </a-col>
      <a-col>
        <!-- 離開 -->
        <a-button type="primary" @click="onLeave">{{ $t('global_leave') }}</a-button>
      </a-col>
    </a-row>
  </div>
</template>


<script src="./ImpairmentForm.ts" lang="ts"></script>

<style lang="less" scoped>
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
.modal__footerBar {
  margin-top: 20px;
}

.impairmentFormModal /deep/ .ant-table-content .ant-table-body {
  margin: 0;
}

/deep/ .compare-change {
  .ant-descriptions-item-label {
    width: 200px;
  }
}
.modal-collapse {
  border-radius: 4px 4px 0 0;
  /deep/ .ant-collapse-item {
    &:first-child {
      .ant-collapse-header {
        border-radius: 4px 4px 0 0;
      }
    }
    &:last-child {
      border-radius: 0;
      .ant-collapse-header {
        border-radius: 0;
      }
      .ant-collapse-content-active {
        border-radius: 0;
      }
    }
  }
}
.modal-descriptions-telList {
  background-color: @DESCRIPTION-HEADER-BG-DARK;
  padding: 12px 16px;
  border: 1px solid @DESCRIPTION-BORDER-COLOR;
  border-top: none;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
}

/deep/ .ant-descriptions {
  &-title {
    font-size: 14px;
    font-weight: 100;
    margin: 0;
    a {
      padding-left: 10px;
      .text-white-format();
    }
    .anticon {
      svg {
        width: 12px;
        height: 12px;
      }
      .text-white-format();
    }
  }
  &-view {
    border: none;
  }
}

/deep/ .ant-collapse-header {
  background-color: @COLLAPSE-HEADER-BG;
  .text-white-format();
}

/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
  background-color: @DESCRIPTION-HEADER-BG;
  font-weight: 10;
  .text-white-format();
}
// 如果不同標記符號要給紅色
.different {
  color: red;
  font-weight: 600;
  font-size: 16px;
}
// 如果清單內沒有資料需灰化
.noDataList {
  color: Silver;
}
.contentscrollbar {
     display: block;
     width: "100%";
     height: 800px;
     overflow-y: auto;
 }
</style>