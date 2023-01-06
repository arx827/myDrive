<template>
  <a-form-model
    ref="ruleForm"
    :layout="'vertical'"
    :model="form"
    :rules="rules"
    :hideRequiredMark="true"
  >
    <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="operationType">
          <span slot="label">
            作業別
            <span class="mark-required">*</span>
          </span>
          <a-select
            class="select"
            size="large"
            v-model="form.operationType"
            :allowClear="true"
          >
            <a-select-option v-for="item in operationType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item
          prop="caseResource"
          :label="$t('source_of_transaction')"
        >
          <a-select
            class="select"
            size="large"
            v-model="form.caseResource"
            :allowClear="true"
          >
            <a-select-option v-for="item in caseResource" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="caseType" :label="$t('category')">
          <a-select
            class="select"
            size="large"
            v-model="form.caseType"
            :allowClear="true"
          >
            <a-select-option v-for="item in caseType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="closeDate">
          <span slot="label">
            結案日期
            <span class="mark-required">*</span>
          </span>
          <date-picker
            type="date"
            v-model="form.closeDate"
            :formatter="formatter"
            :range="true"
            size="large"
            :allowClear="true"
          >
          </date-picker>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="systemType" :label="$t('system')">
          <a-select class="select" size="large" :allowClear="true">
            <a-select-option v-for="item in systemType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item>
          <span slot="label"> 保單號碼 </span>
          <a-row>
            <a-input-group size="large">
              <a-row :gutter="13" type="flex" align="bottom">
                <a-col :span="14">
                  <a-form-model-item prop="inumber">
                    <a-input
                      type="text"
                      size="large"
                      :maxLength="10"
                      v-model="form.inumber"
                      allow-clear
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item prop="insuranceID">
                    <a-input
                      type="text"
                      size="large"
                      :maxLength="2"
                      v-model="form.insuranceID"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="4">
                  <a-form-model-item prop="gid">
                    <a-input
                      type="text"
                      size="large"
                      :maxLength="1"
                      v-model="form.gid"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="message--error">
                {{ inumberErrorMes }}{{ insuranceIDErrorMes }}{{ gidErrorMes }}
              </div>
            </a-input-group>
          </a-row>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="transactionNum" :label="$t('transaction_num')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
            :max-length="20"
            v-model="form.transactionNum"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="customerId" :label="$t('customer_id')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
            :max-length="10"
            v-model="form.customerId"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="amlId" :label="$t('aml_id')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
            :max-length="18"
            v-model="form.amlId"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="dep" :label="$t('review_dep')">
          <a-select
            class="input"
            size="large"
            v-model="form.dep"
            @change="handleDepChange"
            :allowClear="true"
          >
            <a-select-option v-for="item in depData" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="div" :label="$t('review_div')">
          <a-select
            class="input"
            size="large"
            v-model="form.div"
            :default-value="defaultDiv[0]"
            @change="handleDivChange"
            :allowClear="true"
          >
            <a-select-option v-for="item in divs" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="emp" :label="$t('reviewer')">
          <a-select
            class="input"
            size="large"
            v-model="form.emp"
            :default-value="defaultEmp[0]"
            :allowClear="true"
          >
            <a-select-option v-for="item in emps" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

@Component
export default class AssignmentFilter extends Vue {
  private operationType: { key: string; value: string }[] = [
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

  private caseResource: { key: string; value: string }[] = [
    { key: "0", value: "1-交易案件" },
    { key: "1", value: "2-RENEW" },
    { key: "2", value: "全選" },
  ];

  private caseType: { key: string; value: string }[] = [
    { key: "000", value: "" },
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
  private systemType: { key: string; value: string }[] = [
    { key: "A", value: "A" },
    { key: "B", value: "F" },
  ];

  private reviewDep: { key: string; value: string }[] = [
    { key: "A", value: "選項一" },
    { key: "B", value: "選項二" },
    { key: "C", value: "選項三" },
  ];

  private reviewSec: { key: string; value: string }[] = [
    { key: "A", value: "選項一" },
    { key: "B", value: "選項二" },
    { key: "C", value: "選項三" },
  ];

  private reviewPeo: { key: string; value: string }[] = [
    { key: "A", value: "選項一" },
    { key: "B", value: "選項二" },
    { key: "C", value: "選項三" },
  ];

  formatter = this.$twDateFormatter;

  // 審查部門
  depData = ["VP200保全服務部", "PR00櫃檯服務部"];
  // 審查科別
  divData: object = {
    VP200保全服務部: ["保全直寄服務科", "北區保全一科", "北區保全四科"],
    PR00櫃檯服務部: ["市政櫃台服務科", "南京櫃台服務科"],
  };
  divs = this.divData[this.depData[0]];
  defaultDiv = this.divData[this.depData[0]][0];
  // 審查人員
  empData: object = {
    保全直寄服務科: ["林XX", "王XX"],
    北區保全一科: ["陳XX", "李XX"],
    北區保全四科: ["邱XX"],
    市政櫃台服務科: ["盧XX", "葉XX"],
    南京櫃台服務科: ["蔡XX", "吳XX", "林XX"],
  };
  emps = this.empData[this.divData["VP200保全服務部"][0]];
  defaultEmp = this.empData[this.divData["VP200保全服務部"][0]][0];

  form: {
    operationType: string;
    caseResource: string;
    caseType: string;
    closeDate: Date[];
    inumber: string; // 保單號碼
    insuranceID?: string; // 保單序號
    gid?: string; // 重複碼
    transactionNum: string;
    customerId: string;
    dep: string;
    div: string;
    emp: string;
    amlId: string;
  } = {
    operationType: undefined, //作業別
    caseResource: "1-交易案件", //交易來源
    caseType: "1-風險評級高風險", //案件類型
    closeDate: [], //結案日期
    inumber: "", // 保單號碼
    insuranceID: "", // 保單序號
    gid: "", // 重複碼
    transactionNum: "", //交易案號
    customerId: "", //客戶ID
    dep: "", //審查部門
    div: "", //審查科別
    emp: "", //審查人員
    amlId: "", //AML審查檔號
  };
  inumberErrorMes = null;
  insuranceIDErrorMes = null;
  gidErrorMes = null;

  rules: { [key: string]: ValidationRule[] } = {
    operationType: [
      { required: true, trigger: "change", message: "請選擇作業別" },
    ],
    inumber: [
      {
        required: false,
        validator: this.inumberRule,
      },
      {
        pattern: /^(?:[a-zA-Z]|@|\d)*$/,
        trigger: "change",
        validator: this.inumberRule,
      },
    ],
    insuranceID: [
      {
        pattern: /^[0-9]+$/,
        trigger: "change",
        validator: this.insuranceIDRule,
      },
    ],
    gid: [{ pattern: /^[0-9]+$/, trigger: "change", validator: this.gidRule }],
    transactionNum: [{ validator: this.ruleTransaction, trigger: "blur" }],
    customerId: [{ validator: this.ruleCustomerId, trigger: "blur" }],
    amlId: [{ validator: this.ruleAmlId, trigger: "blur" }],
    closeDate: [
      { required: true, validator: this.ruleDate, trigger: "change" },
    ],
  };

  //保單號碼檢核
  inumberRule(rule, value, callback) {
    const vm = this;
    const rgx = /^(?:[a-zA-Z]|@|\d)*$/;
    if (rgx.test(this.form.inumber) == false) {
      vm.inumberErrorMes = "請填入半形英數或@";
      callback("");
    } else {
      vm.inumberErrorMes = null;
      callback();
    }
  }

  insuranceIDRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]+$/;
    if (value !== "") {
      if (rgx.test(value) == false) {
        vm.insuranceIDErrorMes = "請輸入數字";
        callback("");
      } else {
        vm.insuranceIDErrorMes = null;
        callback();
      }
    } else {
      callback();
    }
  }

  gidRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]+$/;
    if (value !== "") {
      if (rgx.test(value) == false) {
        vm.gidErrorMes = "請輸入數字";
        callback("");
      } else {
        vm.gidErrorMes = null;
        callback();
      }
    } else {
      callback();
    }
  }

  //交易案件檢核
  ruleTransaction(rule, value, callback) {
    var re = /[a-zA-Z0-9]+$/; //判斷字串是否為數字
    if (value === "") {
      callback();
    } else {
      if (re.test(value)) {
        callback();
      } else {
        callback("請輸入英文或數字");
      }
    }
  }

  //客戶ID檢核
  ruleCustomerId(rule, value, callback) {
    var re = /^(?:[a-zA-Z]|@|\d)*$/;
    if (value === "") {
      callback();
    } else {
      if (re.test(value)) {
        callback();
      } else {
        callback("請輸入英文或數字");
      }
    }
  }

  //AML審查檔號檢核
  ruleAmlId(rule, value, callback) {
    var re = /[a-zA-Z0-9]+$/;
    if (value === "") {
      callback();
    } else {
      if (re.test(value)) {
        callback();
      } else {
        callback("請輸入英文或數字");
      }
    }
  }

  //結案日期
  created() {
    let date = new Date();
    let month = date.getMonth();
    let prevMonth = date.setMonth(month - 3);
    //預設系統日
    this.form.closeDate[0] = new Date(prevMonth);
    this.form.closeDate[1] = new Date();
  }

  //日期檢核
  ruleDate(rule, value, callback) {
    if (this.form.closeDate[0] == null || this.form.closeDate[1] == null) {
      callback("請選擇結案日期");
    } else {
      let start = this.form.closeDate[0].valueOf();
      let end = this.form.closeDate[1].valueOf();
      let gap = (end - start) / 1000 / 60 / 60 / 24;
      if (gap > 92) {
        callback("最多篩選三個月期間");
      } else {
        callback();
      }
    }
  }

  handleDepChange(value) {
    // 科別
    this.divs = this.divData[value];
    this.form.div = this.divData[value][0];
    // 人員
    this.emps = this.empData[this.divs[0]];
    this.form.emp = this.empData[this.divs[0]][0];
  }

  handleDivChange(value) {
    // 人員
    this.emps = this.empData[value];
    this.form.emp = this.empData[value][0];
  }

  validateForm() {
    // (this.$refs.ruleForm as any).validate((valid) => {});
    return (this.$refs.ruleForm as any).validate();
  }
}
</script>

<style scoped lang="less">
.select {
  width: 100%;
}
.ant-input-affix-wrapper .ant-input:focus {
  border: none;
  border-bottom: 1px solid white !important;
  box-shadow: none;
}
.title {
  font-size: 18px;
  color: #227fa8;
}
.message--error {
  color: #f5222d;
  margin-top: -16px;
}
.highlight {
  color: red;
}
.input {
  width: 100%;
}
</style>
