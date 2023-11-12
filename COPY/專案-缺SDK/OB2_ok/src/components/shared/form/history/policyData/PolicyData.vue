<template>
  <div>
    <a-spin :spinning="isLoading">
      <div class="result__table">
        <FblDataGrid
          :themeColor="'theme1'"
          :scroll="{ x: 500, y: 300 }"
          :row-key="policyDataGrid.rowKey"
          :columns="policyDataGrid.columns"
          :data="policyDataGrid.data"
          :pagination="policyDataGrid.pagination"
          @tableChange="onPageChange($event)"
          @handleEllipsisClick="handleEllipsisClick"
          @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        >
          <template v-slot:alink_isSecretCase_template="slotProps">
            <a style="color:red;" v-if="slotProps.data.isSecretCase=='Y'" @click="clickLinkIsSecretCase(slotProps.data)">{{slotProps.data.isSecretCase}}</a>
          </template>
          <!-- 險種tooltip -->
          <template v-slot:insuranceCode_template="slotProps">
            <a-tooltip overlayClassName="policyData_insurance_code_tooltip" 
              trigger="click"
              v-if="slotProps.data.insuranceCode" 
              :arrowPointAtCenter="true"
              :destroyTooltipOnHide="true"
              :visible="slotProps.data.isInsuranceCodTipShow"
              placement="top" :title='slotProps.data.productDesc'>
              <span class="grid_pop_cursor" @click="() => {slotProps.data.isInsuranceCodTipShow=true}" @mouseleave="()=>{slotProps.data.isInsuranceCodTipShow=false}">{{slotProps.data.insuranceCode}}</span>
            </a-tooltip>
          </template>
          <!-- 業務員 popover -->
          <template v-slot:agentName_template="slotProps">
              <a-popover
                v-if="slotProps.data.policyDataAgentInfo"
                trigger="click"
                :arrowPointAtCenter="true"
                :destroyTooltipOnHide="true"
                :visible="slotProps.data.isAgentInfoPopShow"
                :mouseEnterDelay="3"
                placement="leftTop"
              >
                <span class="grid_pop_cursor ellipsisForTemplate" @click="()=>{slotProps.data.isAgentInfoPopShow=true}" @mouseleave="()=>{slotProps.data.isAgentInfoPopShow=false}" >{{slotProps.data.policyDataAgentInfo.agentName}}</span>
                <template slot="content">
                    <div>{{$t('policyData_agentInfo_title_1')}}{{slotProps.data.policyDataAgentInfo.agentId}}</div>
                    <div>{{$t('policyData_agentInfo_title_2')}}{{slotProps.data.policyDataAgentInfo.agentName}}</div>
                    <div>{{$t('policyData_agentInfo_title_3')}}{{slotProps.data.policyDataAgentInfo.agentUnitId}}{{slotProps.data.policyDataAgentInfo.agentUnitName}}</div>
                    <div>{{$t('policyData_agentInfo_title_4')}}{{slotProps.data.policyDataAgentInfo.agentOccup}}</div>
                    <div>{{$t('policyData_agentInfo_title_5')}}{{slotProps.data.policyDataAgentInfo.managerName}}</div>
                    <div>{{$t('policyData_agentInfo_title_6')}}{{slotProps.data.policyDataAgentInfo.managerId}}</div>
                </template>
              </a-popover>
          </template>

        </FblDataGrid>
      </div>
    </a-spin>

    <!-- 密戶 彈窗 客戶提醒 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="isShowCustomerNotice"
      :title="$t('policyData_custNot_title')"
      width="45%"
      :okText="$t('global_close')"
      :closable="true"
      @ok="isShowCustomerNotice = false"
      @cancel="isShowCustomerNotice = false"
      :removeCancelButton="true"
      :isMasked="false"
    >
      <a-descriptions class="customer_notice_desc" size="middle" :column="{ xs:1, sm:1, md:2, lg:2, xxl:1 }" bordered>
        <!-- 〔非本人接聽時〕 -->
        <a-descriptions-item :label="$t('policyData_custNot_label_1')"> 
          <div class="customer_notice_cont_important">
            <!-- 重點： -->
            <span>{{$t('policyData_custNot_cont_title_1')}}</span>
            <!-- 勿表明是富邦人壽來電 -->
            <span>{{$t('policyData_custNot_cont_1')}}</span>
          </div>
          <div>
            <!-- 話術： -->
            <span class="customer_notice_cont_salesTalk">{{$t('policyData_custNot_cont_title_2')}}</span>
            <span>{{$t('policyData_custNot_cont_2')}}</span>
          </div>
        </a-descriptions-item>
        <!-- 〔保戶詢問保單相關問題〕 -->
        <a-descriptions-item :label="$t('policyData_custNot_label_2')">
          <!-- 話術： -->
          <span class="customer_notice_cont_salesTalk">{{$t('policyData_custNot_cont_title_2')}}</span>
          <span>{{$t('policyData_custNot_cont_3')}}</span>
        </a-descriptions-item>
      </a-descriptions>
    </DragModal>

  </div>
</template>

<script src="./PolicyData.ts" lang="ts"></script>

<style lang="less" scoped>
// tooltip popover 指上改為手指
.grid_pop_cursor{
  cursor:pointer;
}

.ellipsisForTemplate{
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  text-align: "left";
}
</style>

<style lang="less">
  // 險種 tooltip 顏色改為白底
 .policyData_insurance_code_tooltip {
    
    .ant-tooltip-inner {
      color: @COLOR-BLACK;
      background-color: @COLOR-WHITE;
    }
    .ant-tooltip-placement-bottom
    .ant-tooltip-arrow,
    .ant-tooltip-placement-bottomLeft
    .ant-tooltip-arrow,
    .ant-tooltip-placement-bottomRight
    .ant-tooltip-arrow {
        border-bottom-color: @COLOR-WHITE;
    }
    .ant-tooltip-arrow {
      &::before {
        background-color: @COLOR-WHITE;
      }
    }
  }
  // 密戶 description css
  .customer_notice_desc{
    .ant-descriptions-view{
      overflow: auto;

      .ant-descriptions-item-label {
        white-space: nowrap;
        text-align: left;
        background-color: @COLOR-MAIN2;
        color: @COLOR-BLACK;
        font-weight: 600; // th 粗體顯示避免模糊
      }
      .ant-descriptions-item-content{
        .customer_notice_cont_important{
          color:@COLOR-MAIN3;
        }
        .customer_notice_cont_salesTalk{
          color:@COLOR-MAIN4;
        }
      }
    
    }
  }
  
  
</style>