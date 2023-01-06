<template>
  <div style="background: #f0f2f5">
    <div class="card">
      <collapse-area :searchArea="true" :isOpenSearch="collapseAreaOption" @toggle="toggleArea">
        <template v-slot:area>
          <div class="card__form">
            <a-form-model
              ref="ruleForm"
              :model="form"
              :rules="rules"
              layout="vertical"
            >
              <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item label="審查部門" prop="department">
                    <a-select
                      class="select"
                      size="large"
                      mode="multiple"
                      @change="handleChange"
                    >
                      <a-select-option
                        v-for="item in department"
                        :key="item.key"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item label="產生日期" prop="startdate">
                    <date-picker
                      type="date"
                      v-model="form.startdate"
                      :formatter="formatter"
                      :range="true"
                      size="large"
                      :allowClear="true"
                    />
                  </a-form-model-item>
                </a-col>

                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item label="結案日期" prop="enddate">
                    <date-picker
                      type="date"
                      v-model="form.enddate"
                      :formatter="formatter"
                      :range="true"
                      size="large"
                      :allowClear="true"
                    />
                  </a-form-model-item>
                </a-col>

                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item label="作業別" prop="operation">
                    <a-select
                      class="select"
                      size="large"
                      mode="multiple"
                      @change="handleChange"
                    >
                      <a-select-option
                        v-for="item in operation"
                        :key="item.key"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item label="案件類型" prop="type">
                    <a-select
                      class="select"
                      size="large"
                      mode="multiple"
                      @change="handleChange"
                    >
                      <a-select-option v-for="item in type" :key="item.key">
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item label="統計報表" prop="report">
                    <a-select class="select" size="large" v-model="form.report">
                      <a-select-option v-for="item in report" :key="item.key">
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
            <div align="center" style="margin-top: 24px">
              <a-button class="button btn__layout--green btn--primary submitButton" @click="onSubmit()"
                >查詢</a-button
              >
            </div>
          </div>
        </template>
      </collapse-area>
    </div>

    <div class="card" style="margin-top: 10.5px">
      <div style="display: flex; justify-content: space-between">
        <div align="left" class="title">查詢結果</div>
        <div align="right" style="">
          <a-button class="exportBtn" @click="onExport()">匯出</a-button>
        </div>
      </div>
      <fbl-data-grid
        class="fbl-table"
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :loading="isLoading"
        style="margin-top: 24px"
        :scroll="{ x: 'calc(700px + 50%)' }"
      >
      </fbl-data-grid>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import CollapseArea from "@/components/shared/CollapseArea.vue";
import moment from "moment";

class AssignmentDto {
  public proposerId: string;
  public proposerName: string;
  public type: string;
  public system: string;
  public insuranceNum: number;
  public insuranceSerial: number;
  public repeatCode: number;
  public produceDate: String;

  constructor(
    proposerId: string,
    proposerName: string,
    type: string,
    system: string,
    insuranceNum: number,
    insuranceSerial: number,
    repeatCode: number,
    produceDate: string
  ) {
    this.proposerId = proposerId;
    this.proposerName = proposerName;
    this.type = type;
    this.system = system;
    this.insuranceNum = insuranceNum;
    this.insuranceSerial = insuranceSerial;
    this.repeatCode = repeatCode;
    this.produceDate = produceDate;
  }
}

@Component({ components: { FblDataGrid, CollapseArea } })
export default class statisticsPage extends Vue {
  isLoading: boolean = false;
  public collapseAreaOption: boolean = true;
  department: { key: string; value: string }[] = [
    { key: "A", value: "VP200 保全服務部" },
    { key: "B", value: "VPR00 櫃檯服務部" },
    { key: "C", value: "VPH00 台中行政部" },
    { key: "D", value: "VPJ00 高雄行政部" },
    { key: "E", value: "VPK00 客戶利益部" },
    { key: "F", value: "VPE00 理賠部" },
    { key: "G", value: "VPK00 保費帳務部" },
    { key: "H", value: "VPD00 保單風險管理部" },
  ];
  operation: { key: string; value: string }[] = [
    { key: "A", value: "全選" },
    { key: "B", value: "AN-年金給付" },
    { key: "C", value: "ML-保單借款" },
    { key: "D", value: "ML_1-保單還款溢繳" },
    { key: "E", value: "MB-回饋分享金給付" },
    {
      key: "F",
      value:
        "MI-標的現金配息／基金贖回、投資收益／全委提解、專屬帳戶定期匯出或投資標的合併／基金下巿",
    },
    { key: "G", value: "PB1-滿期或祝壽保險金給付" },
    {
      key: "H",
      value:
        "PB2-生存、關懷、教育、升學、立業、健康檢查、無理賠回饋保險金或實物給付替代金或實物給付補償金給付",
    },
    { key: "I", value: "PB4-失效給付" },
    { key: "J", value: "PB5-停效出清" },
    { key: "K", value: "PB6-保障期滿給付" },
    { key: "L", value: "SN-SN07分期還本" },
  ];
  type: { key: string; value: string }[] = [
    { key: "0", value: "0-Renew" },
    { key: "1", value: "1-風險評級高風險" },
    { key: "2", value: "2-名單確認" },
    { key: "3", value: "3-累計大額交易" },
    { key: "4", value: "4-稅務犯罪" },
    { key: "5", value: "5-突有大額繳費" },
    { key: "6", value: "6-客戶國籍檢核" },
    { key: "7", value: "7-跨境交易" },
    { key: "8", value: "8-短進短出類" },
    { key: "9", value: "9-短期密集借/還款交易" },
    { key: "A", value: "A-大額還款交易" },
    { key: "B", value: "B-多張匯款條報繳" },
    { key: "C", value: "C-專屬匯款帳號大額繳費" },
    { key: "D", value: "D-交易前-客戶異常行為" },
    { key: "E", value: "E-異常交易-客戶身分資訊類" },
    { key: "F", value: "F-異常交易-其他類" },
  ];
  report: { key: string; value: string }[] = [
    { key: "A", value: "各行政部總審核件數" },
    { key: "B", value: "各行政部總通報件數" },
    { key: "C", value: "高風險進階審查件數統計" },
    { key: "D", value: "AML疑似交易態樣件數統計" },
  ];

  public grid: FblPDataGridHolder<AssignmentDto> = {
    rowKey: "proposerId",

    data: [
      new AssignmentDto(
        "123",
        "蔡XX",
        "4-稅務犯罪",
        "F",
        1234567,
        1,
        111,
        "110/05/06"
      ),
      new AssignmentDto(
        "321",
        "蔡XX",
        "1-風險評級高風險",
        "A",
        7654321,
        2,
        222,
        "111/08/30"
      ),
      new AssignmentDto(
        "111",
        "蔡XX",
        "C-專屬匯款帳號大額繳費",
        "A",
        7654321,
        2,
        222,
        "110/05/05"
      ),
      new AssignmentDto(
        "458",
        "蔡XX",
        "F-異常交易-其他類",
        "A",
        7654321,
        2,
        222,
        "110/05/20"
      ),
    ],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "produceDate",
        title: "產生日期",
        width: 180,
        fixed: "left",
        align: "center",
        sorter: (a, b) =>
          moment(a.produceDate).unix() - moment(b.produceDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "proposerId",
        title: "要保人ID",
        width: 180,
        fixed: "left",
        align: "center",
        sorter: (a, b) => a.proposerId.localeCompare(b.proposerId),
      },
      {
        type: FblColumnType.PLAIN,
        property: "proposerName",
        title: "要保人姓名",
        width: 180,
        fixed: "left",
        align: "center",
        sorter: (a, b) => a.proposerName.localeCompare(b.proposerName),
      },
      {
        type: FblColumnType.PLAIN,
        property: "type",
        title: "案件類型",
        align: "center",
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
      {
        type: FblColumnType.PLAIN,
        property: "system",
        title: "系統別",
        align: "center",
        sorter: (a, b) => a.system.localeCompare(b.system),
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuranceNum",
        title: "保單號碼",
        align: "center",
        sorter: (a, b) => a.insuranceNum - b.insuranceNum,
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuranceSerial",
        title: "保單序號",
        align: "center",
        sorter: (a, b) => a.insuranceSerial - b.insuranceSerial,
      },
      {
        type: FblColumnType.PLAIN,
        property: "repeatCode",
        title: "重複碼",
        align: "center",
        sorter: (a, b) => a.repeatCode - b.repeatCode,
      },
    ],
  };

  formatter = this.$twDateFormatter;

  data() {
    return {
      locale,
      form: {
        startdate: [],
        enddate: [],
        report: "",
      },
      rules: {
        startdate: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                value[0] === null ||
                value[1] === null ||
                value.length === 0
              ) {
                callback(new Error("請選擇日期區間"));
              } else {
                let start = value[0].valueOf();
                let end = value[1].valueOf();
                let gap = (end - start) / 1000 / 60 / 60 / 24;
                if (gap > 365) {
                  callback(new Error("日期區間請勿大於1年"));
                } else {
                  callback();
                }
              }
            },
            trigger: "change",
          },
        ],
        report: [
          { required: true, message: "請選擇統計報表", trigger: "change" },
        ],
        enddate: [
          {
            required: false,
            validator: (rule, value, callback) => (rule, value, callback) => {
              if (
                value[0] === null ||
                value[1] === null ||
                value.length === 0
              ) {
                callback(new Error("請選擇日期區間"));
              } else {
                let start = value[0].valueOf();
                let end = value[1].valueOf();
                let gap = (end - start) / 1000 / 60 / 60 / 24;
                if (gap > 365) {
                  callback(new Error("日期區間請勿大於1年"));
                } else {
                  callback();
                }
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  }

  handleChange(value) {
    console.log(`Selected: ${value}`);
  }

  onSubmit() {
    (this.$refs.ruleForm as any).validate((valid) => {
      if (valid) {
        return true;
      } else {
        return false;
      }
    });
  }

  onExport() {}

  toggleArea() {
    this.collapseAreaOption = !this.collapseAreaOption;
  }
}
</script>

<style scoped>
.title {
  font-size: 18px;
  color: #227fa8;
}
</style>
