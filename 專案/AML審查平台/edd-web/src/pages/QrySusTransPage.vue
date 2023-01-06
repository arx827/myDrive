<template>
  <div style="background: #f0f2f5">
    <div class="card">
      <collapse-area :searchArea="true" :isOpenSearch="collapseAreaOption" @toggle="toggleArea">
        <template v-slot:area>
          <div class="card__form" style="margin-top: 20px;">
            <a-form-model
              ref="ruleForm"
              :layout="'vertical'"
              :model="form"
              :rules="rules"
              :hideRequiredMark="true"
            >
              <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                <!-- 作業別 -->
                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item prop="operType">
                    <span slot="label">
                      作業別
                      <span class="mark-required">*</span>
                    </span>
                    <a-select
                      class="select"
                      size="large"
                      v-model="form.operType"
                      :allowClear="true"
                      placeholder="請選擇"
                    >
                      <a-select-option
                        v-for="item in operTypeOpts"
                        :key="item.key"
                      >
                        {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- 來源 -->
                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item
                    prop="renew"
                    :label="$t('source')"
                  >
                    <a-select
                      class="select"
                      size="large"
                      v-model="form.renew"
                      :allowClear="true"
                      placeholder="請選擇"
                    >
                      <a-select-option
                        v-for="item in renewOpts"
                        :key="item.key"
                      >
                        {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- 結案日期 -->
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
                      :disabledDate="disabledDate"
                      :range="true"
                      size="large"
                      :allowClear="true"
                    >
                    </date-picker>
                  </a-form-model-item>
                </a-col>
                <!-- 案件類型 -->
                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item prop="custType" :label="$t('category')">
                    <a-select
                      class="select"
                      size="large"
                      v-model="form.custType"
                      :allowClear="true"
                      placeholder="請選擇"
                    >
                      <a-select-option
                        v-for="item in custTypeOpts"
                        :key="item.key"
                      >
                        {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- 交易案號 -->
                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item
                    prop="caseNo"
                    :label="$t('transaction_num')"
                  >
                    <a-input
                      :allowClear="true"
                      class="input"
                      type="text"
                      size="large"
                      :max-length="20"
                      v-model="form.caseNo"
                      placeholder="請輸入"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :lg="16" :xxl="12">
                  <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                    <!-- 系統別 -->
                    <a-col :xs="24" :md="12" :lg="12" :xxl="12">
                      <a-form-model-item prop="sysType" :label="$t('system')">
                        <a-select
                          v-model="form.sysType"
                          class="select"
                          size="large"
                          :allowClear="true"
                          placeholder="請選擇"
                        >
                          <a-select-option
                            v-for="item in sysTypeOpts"
                            :key="item.key"
                          >
                            {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <!-- 保單號碼 -->
                    <a-col :xs="24" :md="12" :lg="12" :xxl="12">
                      <a-form-model-item label="保單號碼">
                        <a-row>
                          <a-input-group size="large">
                            <a-row class="ant-form-explain-hide" :gutter="13" type="flex" align="bottom">
                              <a-col :span="14">
                                <a-form-model-item prop="policyNo">
                                  <a-input
                                    type="text"
                                    size="large"
                                    :maxLength="10"
                                    v-model="form.policyNo"
                                    allow-clear
                                    placeholder="請輸入"
                                  ></a-input>
                                </a-form-model-item>
                              </a-col>
                              <a-col :span="6">
                                <a-form-model-item prop="policySeq">
                                  <a-input
                                    type="text"
                                    size="large"
                                    :maxLength="2"
                                    v-model="form.policySeq"
                                  ></a-input>
                                </a-form-model-item>
                              </a-col>
                              <a-col :span="4">
                                <a-form-model-item prop="idDup">
                                  <a-input
                                    type="text"
                                    size="large"
                                    :maxLength="1"
                                    v-model="form.idDup"
                                  ></a-input>
                                </a-form-model-item>
                              </a-col>
                            </a-row>
                            <div class="message--error">
                              {{ policyNoErrorMes }}{{ policySeqErrorMes
                              }}{{ idDupErrorMes }}
                            </div>
                          </a-input-group>
                        </a-row>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :lg="16" :xxl="12">
                  <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                    <!-- 客戶ID -->
                    <a-col :xs="24" :md="12" :lg="12" :xxl="12">
                      <a-form-model-item prop="custId" :label="$t('customer_id')">
                        <a-input
                          :allowClear="true"
                          class="input"
                          type="text"
                          size="large"
                          :max-length="10"
                          v-model="form.custId"
                          placeholder="請輸入"
                        ></a-input>
                      </a-form-model-item>
                    </a-col>
                    <!-- 客戶姓名 -->
                    <a-col :xs="24" :md="12" :lg="12" :xxl="12">
                      <a-form-model-item prop="custName" :label="$t('customer_name')">
                        <a-input
                          :allowClear="true"
                          class="input"
                          type="text"
                          size="large"
                          :max-length="10"
                          v-model="form.custName"
                          placeholder="請輸入"
                        ></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- 審查部門、審查科別、審查人員 -->
                <a-col :xs="24" :md="24" :lg="24" :xxl="24">
                  <emp-selector
                    ref="empSelector"
                    :isRequired="[false, false, false]"
                    :isDisabled="[true, false, false]"
                    :xsSpan="24"
                    :mdSpan="12"
                    :lgSpan="8"
                    :xxlSpan="6"
                    :selectOpts="{
                      contDp: dpOpts,
                      contUt: utOpts,
                      contId: domainIdOpts,
                    }"
                    :form="{
                      contDp: form.contDp,
                      contUt: form.contUt,
                      contId: form.contId,
                    }"
                    @onChange="onEmpSelectorChange"
                  >
                  </emp-selector>
                </a-col>
                <a-divider type="horizontal" />
                <!-- AML審查檔號 -->
                <a-col :xs="24" :md="12" :lg="8" :xxl="6">
                  <a-form-model-item prop="efileNo" :label="$t('aml_id')">
                    <a-input
                      :allowClear="true"
                      class="input"
                      type="text"
                      size="large"
                      :max-length="14"
                      v-model="form.efileNo"
                      placeholder="請輸入"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <div align="center">
                    <a-button class="button btn--primary submitButton" @click="onSearch()"
                      >查詢</a-button
                    >
                  </div>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </template>
      </collapse-area>
    </div>
    <div v-if="isResultShow">
      <!--查詢列表區-->
      <a-row class="spin__wrap" v-if="isLoading">
        <a-spin
          :spinning="isLoading"
          tip="資料處理中，請稍候..."
          :delay="200"
          class="spin"
        >
        </a-spin>
      </a-row>
      <div class="card--title" style="margin-top: 10.5px">
        <div class="title">{{ $t("search_result") }}</div>
        <div class="fbl-table" style="margin-top: 24px">
          <fbl-data-grid
            v-if="isResultShow"
            :rowKey="grid.rowKey"
            :columns="grid.columns"
            :data="grid.data"
            :pagination="grid.pagination"
            :emptyData="isEmptyData"
            :scroll="{ x: true }"
            :rowTipsTxt="rowTipsTxt"
            @rowMouseover="setRowTipsTxt($event)"
            @actionClick="onMasterActionClick($event)"
            @tableChange="onTableChange"
          >
            <template v-slot:download="slotProps">
              <div>
                <!-- <a-button
                  type="link"
                  icon="download"
                  @click="onExport(slotProps.data.efileNo)"
                /> -->
                <img style="cursor: pointer" src="@/assets/images/icon-main-export.svg"
                  @click="onExport(slotProps.data.efileNo)" />
              </div>
            </template>
            <template v-slot:custTypes="slotProps">
              <span style="white-space: pre-line">
                {{ formatCustTypes(slotProps.data.custTypes) }}
              </span>
            </template>
            <template v-slot:listType="slotProps">
              <span style="white-space: pre-line">
                {{ formatListType(slotProps.data.listType) }}
              </span>
            </template>
            <template v-slot:policy="slotProps">
              <div>
                {{
                  slotProps.data.policyNo + "-" +
                    slotProps.data.policySeq + " " +
                    slotProps.data.idDup
                }}
              </div>
            </template>
            <template v-slot:custName="slotProps">
              <span style="white-space: pre-line">
                {{ formatCustName(slotProps.data.clients) }}
              </span>
            </template>
            <template v-slot:custId="slotProps">
              <span style="white-space: pre-line">
                {{ formatCustId(slotProps.data.clients) }}
              </span>
            </template>
          </fbl-data-grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
// import AssignmentFilter from "@/components/shared/sus-trans/AssignmentFilter.vue";
import CollapseArea from "@/components/shared/CollapseArea.vue";
import EmpSelector, { Iform } from "@/components/shared/EmpSelector.vue";
import {
  SelectOptsRequestDto,
  DeclareResponseVO,
  QryOptionsDto,
  DeclareRequestDto,
  DeclareQueryVO,
  PageOfDeclareResponseVO,
} from "@fubonlife/edd-api-axios-sdk";

import {
  FblColumnType,
  FblPDataGridHolder,
  FblRow,
  FblActionEvent,
} from "@/components/shared/data-grid/models";
import moment from "moment";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { UserService } from "@/plugins/user";
import { Dictionary } from "vue-router/types/router";
import fileDownload from "js-file-download";

@Component({ components: { FblDataGrid, CollapseArea, EmpSelector } })
export default class QrySusTransPage extends Vue {
  public isLoading: boolean = false;
  public isResultShow: boolean = false;
  public isEmptyData: boolean = false;
  public isFormValidate: boolean = false;
  public rowTipsTxt: string = "";
  public collapseAreaOption: boolean = true;

  // fliter options
  private operTypeOpts: Array<QryOptionsDto> = [];
  private renewOpts: Array<QryOptionsDto> = [];
  private sysTypeOpts: Array<QryOptionsDto> = [];
  private custTypeOpts: Array<QryOptionsDto> = [];
  private dpOpts: Array<QryOptionsDto> = [];
  private utOpts: Array<QryOptionsDto> = [];
  private domainIdOpts: Array<QryOptionsDto> = [];

  formatter = this.$twDateFormatter;

  form = {
    operType: undefined, //作業別
    sysType: undefined, //系統別
    renew: undefined, //交易來源
    custType: undefined, //案件類型
    closeDate: [], //結案日期
    policyNo: "", // 保單號碼
    policySeq: null, // 保單序號
    idDup: "", // 重複碼
    caseNo: "", //交易案號
    custId: "", //客戶ID
    custName: "", //客戶姓名
    contDp: undefined, //審查部門
    contUt: undefined, //審查科別
    contId: undefined, //審查人員
    efileNo: "", //AML審查檔號
  };
  policyNoErrorMes = null;
  policySeqErrorMes = null;
  idDupErrorMes = null;

  rules: { [key: string]: ValidationRule[] } = {
    operType: [{ required: true, trigger: "change", message: "請選擇作業別" }],
    policyNo: [
      {
        required: false,
        trigger: "change",
        validator: this.policyNoRule,
      },
    ],
    policySeq: [
      {
        required: false,
        trigger: "change",
        validator: this.policySeqRule,
      },
    ],
    idDup: [
      {
        required: false,
        trigger: "change",
        validator: this.idDupRule,
      },
    ],
    custName: [
      {
        required: false,
        trigger: "change",
        validator: this.memberName,
      },
    ],
    caseNo: [{ validator: this.caseNoRule, trigger: "blur" }],
    custId: [{ validator: this.custIdRule, trigger: "blur" }],
    efileNo: [{ validator: this.efileNoRule, trigger: "blur" }],
    closeDate: [
      { required: true, validator: this.ruleDate, trigger: "change" },
    ],
  };

  //保單號碼檢核
  policyNoRule(rule, value, callback) {
    const vm = this;
    const rgx = /^(?:[a-zA-Z]|@|\d)*$/;
    if (rgx.test(value) == false) {
      vm.policyNoErrorMes = "請輸入半形英文、@或數字";
      callback(" ");
    } else {
      vm.policyNoErrorMes = null;
      callback();
    }
  }
  //保單序號檢核
  policySeqRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]*$/;
    if (value !== null && rgx.test(value) == false) {
      vm.policySeqErrorMes = "請輸入半形數字";
      callback(" ");
    } else {
      vm.policySeqErrorMes = null;
      callback();
    }
  }
  //重複碼檢核
  idDupRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]*$/;
    if (rgx.test(value) == false) {
      vm.idDupErrorMes = "請輸入半形數字";
      callback(" ");
    } else {
      vm.idDupErrorMes = null;
      callback();
    }
  }

  //交易案件檢核
  caseNoRule(rule, value, callback) {
    var re = /[a-zA-Z0-9]+$/; //判斷字串是否為數字
    if (value === "" || value === undefined) {
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
  custIdRule(rule, value, callback) {
    var re = /^(?:[a-zA-Z]|@|\d)*$/;
    if (value === "" || value === undefined) {
      callback();
    } else {
      if (re.test(value)) {
        callback();
      } else {
        callback("請輸入英文或數字");
      }
    }
  }
  // 客戶姓名檢核
  memberName(rule, value, callback) {
    if (this.fullWidthAcd(value)) {
      callback(new Error("請輸入中文、半形英文、符號或數字"));
    } else {
      callback();
    }
  }
    // 全形偵測
  fullWidthAcd(str) {
    let checkVal = false;
    for (let i = 0, len = str.length; i < len; i++) {
      let strCode = str.charCodeAt(i);
      if (strCode > 65248 || strCode == 12288) {
        checkVal = true; // str 有全形回報
        break;
      }
    }
    return checkVal;
  }
  //AML審查檔號檢核
  efileNoRule(rule, value, callback) {
    var re = /^[a-zA-Z]{2}[0-9]+$/;
    if (value === "" || value === undefined) {
      callback();
    } else {
      if (re.test(value)) {
        callback();
      } else {
        callback("格式不符:第1~2碼英文，其他數字。");
      }
    }
  }

  //結案日期
  created() {
    let date = new Date();
    let month = date.getMonth();
    let prevMonth = date.setMonth(month - 3);
    // 結案日期
    this.form.closeDate[0] = new Date(prevMonth);
    this.form.closeDate[1] = new Date();

    // 審查部門/審查科別
    let user = new UserService();
    this.form.contDp = "VPK00"; //user.getMe().employee.bossDepId;
    this.form.contUt = "*"; // 預設全選

    // 交易來源
    this.form.renew = "N";

    // 案件類型
    this.form.custType = "2";

    this.getOptions();
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

  //data grid
  public grid: FblPDataGridHolder<DeclareResponseVO> = {
    rowKey: "efileNo",
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 1,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30", "40"],
    },
    columns: [
      {
        type: FblColumnType.TEMPLATE,
        template: "download",
        property: "efileNo",
        title: "匯出",
        width: 90,
        fixed: "left",
        align: "center",
        inspect: true,
      },
      {
        type: FblColumnType.PLAIN,
        property: "efileNo",
        title: "AML審查檔號",
        fixed: "left",
        align: "center",
        sorter: (a, b) => a.efileNo.localeCompare(b.efileNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "operType",
        title: "作業別",
        fixed: "left",
        align: "center",
        formatter: (data: DeclareResponseVO) => {
          return data.operType != null ? data.operType["code"] : "";
        },
        sorter: (a, b) => a.operType.localeCompare(b.operType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "renew",
        title: "來源",
        fixed: "left",
        align: "center",
        formatter: (data: DeclareResponseVO) => {
          return data.renew != null ? data.renew["description"] : "";
        },
        sorter: (a, b) => a.renew.localeCompare(b.renew),
      },
      {
        type: FblColumnType.TEMPLATE,
        template: "custTypes",
        title: "案件類型",
        align: "center",
        sorter: (a, b) =>
          this.formatCustTypes(a.custTypes).localeCompare(
            this.formatCustTypes(b.custTypes)
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "riskLvl",
        title: "風險評級",
        align: "center",
        sorter: (a, b) => a.riskLvl.localeCompare(b.riskLvl),
      },
      {
        type: FblColumnType.TEMPLATE,
        template: "listType",
        title: "名單類型",
        align: "center",
        sorter: (a, b) =>
          this.formatListType(a.listType).localeCompare(
            this.formatListType(b.listType)
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        align: "center",
        formatter: (data: DeclareResponseVO) => {
          return data.sysType != null ? data.sysType["code"] : "";
        },
        sorter: (a, b) => a.sysType.localeCompare(b.sysType),
      },
      {
        type: FblColumnType.TEMPLATE,
        template: "policy",
        title: "保單號碼",
        align: "center",
        sorter: (a, b) =>
          (a.policyNo + a.policySeq + a.idDup).localeCompare(
            b.policyNo + b.policySeq + b.idDup
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseNo",
        title: "交易案號",
        align: "center",
        sorter: (a, b) => a.caseNo.localeCompare(b.caseNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "role",
        title: "保單角色",
        align: "center",
        sorter: (a, b) => a.role.localeCompare(b.role),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applFname",
        title: "要保人姓名",
        align: "center",
        sorter: (a, b) => a.applFname.localeCompare(b.applFname),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applId",
        title: "要保人ID",
        align: "center",
        sorter: (a, b) => a.applId.localeCompare(b.applId),
      },
      {
        type: FblColumnType.TEMPLATE,
        template: "custName",
        title: "客戶姓名",
        align: "center",
        sorter: (a, b) =>
          this.formatCustName(a.clients).localeCompare(
            this.formatCustName(b.clients)
          ),
      },
      {
        type: FblColumnType.TEMPLATE,
        template: "custId",
        title: "客戶ID",
        align: "center",
        sorter: (a, b) =>
          this.formatCustId(a.clients).localeCompare(
            this.formatCustId(b.clients)
          ),
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: "審查部門",
        align: "center",
        sorter: (a, b) =>
          a.cont["bossDepName"].localeCompare(b.cont["bossDepName"]),
        formatter: (data: DeclareResponseVO) => {
          return data.cont.bossDepName;
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: "審查科別",
        align: "center",
        sorter: (a, b) => a.cont["depName"].localeCompare(b.cont["depName"]),
        formatter: (data: DeclareResponseVO) => {
          return data.cont.depName;
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: "審查人員",
        align: "center",
        sorter: (a, b) => a.cont["name"].localeCompare(b.cont["name"]),
        formatter: (data: DeclareResponseVO) => {
          return data.cont.name;
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "closeDate",
        title: "結案日期",
        align: "center",
        sorter: (a, b) => a.closeDate.localeCompare(b.closeDate),
      },
    ],
  };

  //表格之下載檔案之陣列
  downloadUrl: string = "";

  // 查詢結果api
  getList() {
    if (this.isFormValidate) {

      //結案日期轉換，不然toISOString會少一天
      const closeDateS = new Date(+new Date(this.form.closeDate[0]) + 8 * 3600 * 1000); //加入相差的8小時
      const closeDateE = new Date(+new Date(this.form.closeDate[1]) + 8 * 3600 * 1000); //加入相差的8小時

      const filter: DeclareQueryVO = {
        operType: this.form.operType,
        renew: this.form.renew,
        custType: this.form.custType != null ? [this.form.custType] : [],
        closeDate: [
          closeDateS.toISOString(),
          closeDateE.toISOString(),
        ],
        sysType: this.form.sysType,
        policyNo: this.form.policyNo,
        policySeq: parseInt(this.form.policySeq),
        idDup: this.form.idDup,
        caseNo: this.form.caseNo,
        custId: this.form.custId,
        custName: this.form.custName,
        efileNo: this.form.efileNo,
        contDp: this.form.contDp,
        contUt: this.form.contUt,
        contId: this.form.contId,
      };
      const body: DeclareRequestDto = {
        filter: filter,
        pageIndex: this.grid.pagination.current - 1,
        pageSize: this.grid.pagination.pageSize,
      };
      console.log(body);

      this.isLoading = true;
      this.$declareApi
        .getListInDeclareUsingPOST(body)
        .then((resp) => {
          console.log(resp);
          this.grid.pagination.total = parseInt(resp.data.data.totalElements);
          this.grid.data = resp.data.data.content;
        })
        .catch((error) => {
          console.log(error);
          this.grid.data = [];
          // TODO: show error message
        })
        .finally(() => {
          this.isResultShow = true;
          this.isLoading = false;
          this.rowTipsTxt = "";
        });
    }
  }

  onSearch() {
    // 驗證此page的欄位
    (this.$refs.ruleForm as any)
      .validate()
      .then((valid) => {
        this.isFormValidate = valid;
        this.getList();
      })
      .catch((valid) => {
        this.isFormValidate = valid;
      });
  }

  setRowTipsTxt(e) {
    let tipsTxt = (e.data as any).tipsTxt;
    this.rowTipsTxt = tipsTxt;
  }

  // 取得選項api
  getOptions() {
    const body: SelectOptsRequestDto = {
      bossDepId: this.form.contDp !== undefined ? this.form.contDp : "*",
      depId: this.form.contUt !== undefined ? this.form.contUt : "*",
    };
    console.log(body);
    this.$declareApi
      .getSelectOptsInDeclareUsingPOST(body)
      .then((resp) => {
        console.log(resp);
        this.operTypeOpts = resp.data.data.operTypeOpts;
        this.renewOpts = resp.data.data.renewOpts;
        this.custTypeOpts = resp.data.data.custTypeOpts;
        this.sysTypeOpts = resp.data.data.sysTypeOpts;
        this.dpOpts = resp.data.data.dpOpts;
        this.utOpts = resp.data.data.utOpts;
        this.domainIdOpts = resp.data.data.domainIdOpts;
      })
      .catch((error) => {
        console.log(error);
        // TODO: show error message
      });
  }

  onEmpSelectorChange(data: Iform) {
    console.log(data);
    this.form.contDp = data.contDp;
    this.form.contUt = data.contUt;
    this.form.contId = data.contId;
    // update opts
    this.getOptions();
  }

  formatCustTypes(items: Dictionary<string>[]) {
    var arr = [];
    items.forEach((item) => {
      arr.push(item["description"]);
    });
    return arr.join("\n");
  }

  formatListType(items: Dictionary<string>[]) {
    var arr = [];
    items.forEach((item) => {
      arr.push(item["code"] + " " + item["description"]);
    });
    return arr.join("\n");
  }

  formatCustName(items: Dictionary<string>[]) {
    var arr = [];
    items.forEach((item) => {
      arr.push(item["custName"]);
    });
    // return arr.join("\n");
    // return arr.length > 1 ? arr[0] + "等" : arr[0];
    return arr[0];
  }

  formatCustId(items: Dictionary<string>[]) {
    var arr = [];
    items.forEach((item) => {
      arr.push(item["custId"]);
    });
    // return arr.join("\n");
    return arr.length > 1 ? arr[0] + "等" : arr[0];
  }

  onTableChange(pagination) {
    const p = this.grid.pagination;
    if(p.current !== pagination.current || p.pageSize !== pagination.pageSize) {
      p.current = pagination.current;
      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== pagination.pageSize) {
        p.current = 1;
      }
      p.pageSize = pagination.pageSize;
      this.grid.pagination = p;
      this.getList();
    }
  }

  onExport(efileNo) { 
    console.log(efileNo);
    this.isLoading = true;
    this.$declareApi
      .exportInDeclareUsingGET(efileNo, {responseType: 'blob'})
      .then((resp) => {
        let current = moment(new Date()).format("YYYY/MM/DD").split("/");
        let twYear = parseInt(current[0]) - 1911 + ""; 
        const fileName = "可疑交易申報表_" + efileNo + "_" + twYear + current[1] + current[2] + ".docx";
        fileDownload(resp.data, fileName);
      })
      .catch((error) => {
        console.log(error);
        // TODO: show error message
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  toggleArea() {
    this.collapseAreaOption = !this.collapseAreaOption;
  }

  // 日期選擇範圍卡控(今日 ~ 今日-92天)
  disabledDate(current) {
    const date = new Date();
    return (
      current > date ||
      current <
        moment()
          .year(date.getFullYear())
          .month(date.getMonth())
          .date(date.getDate() - 93)
    );
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  color: #227fa8;
}
.button {
  background-color: #13c2c2;
  color: white;
  font-size: 16px;
  width: 200px;
  height: 40px;
  margin-top: 17px;
  margin-bottom: 8px;
  border-radius: 5px;
}
.container {
  background-color: transparent;
}
.card {
  background: white;
  padding: 10px 23px 10px 23px;
  border-radius: 2px;
}
.select {
  width: 100%;
}
.ant-input-affix-wrapper .ant-input:focus {
  border: none;
  border-bottom: 1px solid white !important;
  box-shadow: none;
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
/* spin */
$spinColor: #fff;
$spinFontSize: 20px;
.spin__wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.spin {
  position: absolute;
  top: calc((100% - 72.22px) / 2);
  left: calc((100% - 46px) / 2);
}
::v-deep {
  .ant-spin-dot-item {
    background: $spinColor;
  }
  .ant-spin-text {
    color: $spinColor;
    font-size: $spinFontSize;
  }
  .ant-form-explain-hide .ant-form-explain {
    display: none;
  }
}
</style>
