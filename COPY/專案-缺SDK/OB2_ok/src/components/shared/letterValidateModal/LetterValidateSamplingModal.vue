<template>
  <div class="letterValidateSampling_modal">
    <div class="fbl-table">
      <a-table
        :rowKey="(record, index)=>{return record.letterValidSamplePk + ';' + record.caseNo + ';' + record.mailByPostId}"
        :columns="letterValidateSamplingGrid.columns"
        :data-source="letterValidateSamplingGrid.data"
        :pagination="false"
        size="middle"
        :empty-data="letterValidateSamplingGrid.data.length <= 0"
      >
        <!-- 選取 -->
        <template slot="cehckBoxTemp" slot-scope="slotProps, rowData">
          <a-checkbox
            v-if="slotProps != null && slotProps.show"
            :checked="slotProps.checked"
            @change="onCheckedChange($event, rowData)"
          />
        </template>

        <!-- 信函異常註記 -->
        <template slot="verifyAbnormalRemarkTemp" slot-scope="slotProps, rowData">
          <a-textarea
            v-if="rowData.letterValidSampleCheckBoxDto.checked && rowData.letterValidSampleCheckBoxDto.show"
            v-model="rowData.verifyAbnormalRemark"
            :maxLength="50"
            :autoSize="{ minRows: 2, maxRows: 2 }"
          ></a-textarea>
        </template>

        <!-- 保單號碼 -->
        <template slot="casePolicyTemp" slot-scope="slotProps, rowData">
          <a
            @click="clickCasePolicy($event, rowData)"
            :class="slotProps.clicked?'casePolicy_bg_color_yel':''"
          >{{slotProps.casePolicy}}</a>
        </template>
      </a-table>
    </div>
  </div>
</template>


<script src="./LetterValidateSamplingModal.ts" lang="ts"></script>

<style lang="less">
.letterValidateSampling_modal {
  .fbl-table {
    // width: 50%;
    // padding-left: 24px;
    // padding-right: 12px;
    margin: 10px 0;
  }
  .dataNumBar {
    margin: 0 30px;
  }
  .casePolicy_bg_color_yel {
    background-color: @COLOR-MAIN8;
  }
}
</style>
