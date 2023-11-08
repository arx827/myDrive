<template>
  <div class="section-card section__countersignature">
    <div class="card__title-position">
      <!-- 聽語障 -->
      <span class="card__title">聽語障內容</span>
    </div>
    <div class="card__infomation">
      <!-- 會辦單覆核 時 顯示 -->
      <a-row type="flex" justify="end" :gutter="[10, 0]">
        <a-col>
          <!-- 案件調閱 -->
          <a-button type="primary" @click="caseCheck()">{{
            $t("caseCheck")
          }}</a-button>
        </a-col>
      </a-row>

    </div>


    <a-collapse v-model="activeKey" class="modal-collapse">
      <!-- 新增/註銷聽語障註記檔 -->
      
          <!-- :layout="layoutStyle" -->
      <a-collapse-panel key="2" :header="'新增/註銷聽語障註記檔'">
        <a-descriptions
          :column="1"
          bordered
          >
          <!-- 新增 -->
          <a-descriptions-item 
          :label="'新增聽語障註記檔'" 
          >
            <!-- 聽障 -->
            <a-checkbox 
            :checked="chkIsAddNonHearing" 
            @change="chkIsAddNonHearingOption"
            :disabled="!showimpairmentMarkReason"
            >
              {{$t('IS_HEARING')}}
            </a-checkbox>
            <!-- 語障 -->
            <a-checkbox 
            :checked="chkisAddNonLanguage"
            @change="chkisAddNonLanguageOption"
            :disabled="!showimpairmentMarkReason"
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
  </div>
</template>
<script src="./ImpairmentInfo.ts" lang="ts"></script>
<style lang="less" scoped>
.countersignatureModalFormPage {
  .infDepartment {
    .ant-form-item-label {
      width: 16.7%;
    }
    .ant-form-item-control-wrapper {
      width: 35%;
    }
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