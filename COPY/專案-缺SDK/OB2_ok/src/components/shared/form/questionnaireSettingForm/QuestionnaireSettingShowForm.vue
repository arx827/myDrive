<template>
  <a-form-model :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <template>
      <a-table :columns="showColumns.columns" :data-source="conditionList" :rowKey="showColumns.rowKey"
               :pagination="showColumns.pagination">
      </a-table>
    </template>
  </a-form-model>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { QuestConditionDto } from "@fubonlife/obd-api-axios-sdk";
import MappingUtil from "@/assets/config/MappingUtil";

@Component
export default class QuestionnaireSettingShowForm extends Vue {

  //條件細項列表
  @Prop()
  conditionList:Array<QuestConditionDto>;

  //純顯示的欄位參數
  showColumns = {
    rowKey: "questSequence",
    pagination: {
      pageSize: 15,
      hideOnSinglePage: true
    },
    columns: [
      {
        key: "questConditionDesc",
        title: "條件",
        dataIndex: "questConditionDesc",
        width: 205
      },
      {
        key: "questConditionExpress",
        title: "運算式",
        dataIndex: "questConditionExpress",
        width: 130,
        customRender: (data: string) => {
          return MappingUtil.getSeletedList("questConditionExpress", data);
        }
      },
      {
        key: "questConditionColumn",
        title: "條件欄位",
        dataIndex: "questConditionColumn"
      },
      {
        key: "questConditionPara",
        title: "條件參數",
        dataIndex: "questConditionPara"
      }
    ]
  };
}
</script>

<style scoped>
  /** 調整 Table 間距 */
  ::v-deep .ant-table-thead > tr > th { 
    padding: 10px 5px !important;
  }

  /** 調整 Table 列高 */
  ::v-deep .ant-table-tbody > tr > td {
    height: 38px;
    padding: 5px !important;
    word-break: break-all; /* 數字,英文自動換行 */
  }
</style>