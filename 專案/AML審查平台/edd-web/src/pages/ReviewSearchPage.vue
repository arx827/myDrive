<template>
  <div style="background: #f0f2f5">
    <div class="card">
      <collapse-area :searchArea="true" :isOpenSearch="collapseAreaOption" @toggle="toggleArea">
        <template v-slot:area>
          <div class="card__form">
            <a-form-model
              ref="assignmentFilter"
              :layout="'vertical'"
              :model="form"
              :rules="rules"
              :hideRequiredMark="true"
            >
              <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                <!-- 作業別 -->
                <a-col :lg="8" :xxl="6">
                  <a-form-model-item prop="operType">
                    <span  slot="label">
                      作業別 <span class="mark-required">*</span>
                    </span>
                    <a-select
                      size="large"
                      v-model="form.operType"
                      allow-clear
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
                <a-col :lg="8" :xxl="6">
                  <a-form-model-item prop="renew" label="來源">
                    <a-select
                      size="large"
                      v-model="form.renew"
                      allow-clear
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
                <!-- 產生日期 -->
                <a-col :lg="8" :xxl="6">
                  <a-form-model-item prop="rptDate" >
                    <span slot="label">
                      產生日期 <span class="mark-required">*</span>
                    </span>
                    <date-picker
                      type="date"
                      v-model="form.rptDate"
                      :formatter="formatter"
                      :range="true"
                      :disabledDate="disabledDate"
                      size="large"
                      :allowClear="true"
                      placeholder="請選擇"
                    />
                  </a-form-model-item>
                </a-col>
                <!-- 案件類型 -->
                <a-col :lg="16" :xxl="{span:12, order:2}">
                  <a-form-model-item prop="custType" label="案件類型">
                    <a-tree-select
                      v-model="form.custType"
                      :tree-data="custTypeOpts"
                      tree-checkable
                      size="large"
                      tree-default-expand-all
                      placeholder="請選擇"
                    >
                    </a-tree-select>
                  </a-form-model-item>
                </a-col>
                <!-- 交易案號 -->
                <a-col :lg="8" :xxl="{span:6, order:1}">
                  <a-form-model-item prop="caseNo" label="交易案號">
                    <a-input
                      :allowClear="true"
                      class="input"
                      type="text"
                      size="large"
                      v-model="form.caseNo"
                      placeholder="請輸入"
                    ></a-input> </a-form-model-item
                ></a-col>
                <!-- 系統別 -->
                <a-col :lg="8" :xxl="{span:6, order:3}">
                  <a-form-model-item prop="system" label="系統別">
                    <a-select
                      size="large"
                      v-model="form.sysType"
                      allow-clear
                      placeholder="請選擇"
                    >
                      <a-select-option v-for="item in sysTypeOpts" :key="item.key">
                        {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- 保單號碼 -->
                <a-col :lg="8" :xxl="{span:6, order:4}">
                  <a-form-model-item label="保單號碼">
                    <a-row>
                      <a-input-group size="large">
                        <a-row :gutter="13" type="flex" align="bottom">
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
                          {{ inumberErrorMes }}{{ insuranceIDErrorMes }}{{ gidErrorMes }}
                        </div>
                      </a-input-group>
                    </a-row>
                  </a-form-model-item>
                </a-col>
                <!-- 客戶 -->
                <a-col :lg="16" :xxl="{span:12, order:5}">
                  <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                    <!-- 客戶ID -->
                    <a-col :span="12">
                      <a-form-model-item prop="custId" label="客戶ID">
                        <a-input
                          :allowClear="true"
                          class="input"
                          type="text"
                          size="large"
                          v-model="form.custId"
                          placeholder="請輸入"
                        ></a-input></a-form-model-item
                    ></a-col>
                    <!-- 客戶姓名 -->
                    <a-col :span="12">
                      <a-form-model-item prop="custName" label="客戶姓名">
                        <a-input
                          :allowClear="true"
                          class="input"
                          type="text"
                          size="large"
                          v-model="form.custName"
                          placeholder="請輸入"
                        ></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- 要保人 -->
                <a-col :lg="16" :xxl="{span:12, order:6}">
                  <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                    <!-- 要保人ID -->
                    <a-col :lg="12" :xxl="12">
                      <a-form-model-item prop="applId" label="要保人ID">
                        <a-input
                          :allowClear="true"
                          class="input"
                          type="text"
                          size="large"
                          v-model="form.applId"
                          placeholder="請輸入"
                        ></a-input> </a-form-model-item
                    ></a-col>
                    <!-- 要保人姓名 -->
                    <a-col :lg="12" :xxl="12">
                      <a-form-model-item prop="applName" label="要保人姓名">
                        <a-input
                          :allowClear="true"
                          class="input"
                          type="text"
                          size="large"
                          v-model="form.applName"
                          placeholder="請輸入"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>

              <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                <!-- 審查部門、審查科別、審查人員 -->
                <a-col :xs="24" :md="24" :lg="24" :xxl="{span:18, order:7}">
                  <review-fields
                    ref="reviewFields"
                    :isRequired="[false, false, false]"
                    :isDisabled="[false, false, false]"
                    @submitData="getReviewData"
                    :xsSpan="24"
                    :mdSpan="12"
                    :lgSpan="8"
                    :xxlSpan="8"
                  >
                  </review-fields>
                </a-col>
              </a-row>

              <a-divider type="horizontal" />
                <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                  <!-- AML審查檔號 -->
                  <a-col :lg="8" :xxl="{span:6, order:8}">
                    <a-form-model-item prop="efileNo">
                      <span slot="label"> AML審查檔號 </span>
                      <a-input
                        :allowClear="true"
                        class="input"
                        type="text"
                        size="large"
                        v-model="form.efileNo"
                        placeholder="請輸入"
                      ></a-input> </a-form-model-item
                  ></a-col>
                </a-row>
            </a-form-model>
            
            <div align="center">
              <a-button class="button btn--primary btn__layout--green searchButton" @click="onSearch()"
                >查詢</a-button
              >
            </div>
          </div>
        </template>
      </collapse-area>
    </div>
    <!--查詢列表區-->
    <div class="card--title resultDom" style="margin-top: 10.5px" v-if="isResultShow">
      <div style="display: flex; justify-content: space-between">
        <div align="left">
          <span class="title">查詢結果</span><small class="grid__small" v-if="isEmptyData == false">(雙擊列表可查看明細)</small>
        </div>
      </div>
      <div class="fbl-table">
        <FblDataGrid
          v-if="isResultShow"
          :rowClassName="setRowClass"          
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :emptyData="isEmptyData"
          :scroll="{ x: 'max-content' }"
          :rowTipsTxt="rowTipsTxt"
          @rowDblclick="onRowDblclick"
          @rowMouseover="setRowTipsTxt"
          @tableChange="onMasterPageChange($event)"
        >
          <template v-slot:download>
            <div>
              <a :href="files"><a-icon type="download" /></a>
            </div>
          </template>
        </FblDataGrid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
  FblRow,
} from "@/components/shared/data-grid/models";
import CollapseArea from "@/components/shared/CollapseArea.vue";
import ReviewFields from "@/components/shared/ReviewFields.vue";
import { Modal } from "ant-design-vue";
import moment from "moment";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

import { QryOptionsDto, SearchReviewVO } from "@fubonlife/edd-api-axios-sdk";


@Component({ components: { FblDataGrid, CollapseArea, ReviewFields } })
export default class ReviewSearch extends Vue {
 // public isReview: boolean = true;
  public isResultShow: boolean = false;
  public isEmptyData: boolean = false;
  // public isPagination: any;
  public isReviewValidate: boolean = false;
  public isFormValidate: boolean = false;
  public windowCheck: any = null;
  public rowTipsTxt: string = "";
  public actingRow: string = ""; // 正在處理之列表amlID

  public collapseAreaOption: boolean = true;

  h = this.$createElement;

  @Action public setLoading: (payload: boolean) => void;
  /**
   * 宣告 下拉選項
   */
  locale: locale = locale;
  // 作業別
  private operTypeOpts: Array<QryOptionsDto> = [];
  // 來源
  private renewOpts: Array<QryOptionsDto> = [];
  // 案件類型
  private custTypeOpts: { title: string; key: string; value: string; children: { key: string, value: string, title: string }[] } [] =  [
    {
      title: '全選',
      value: '*',
      key: '*',
      children: [ ]
    }
  ];
  // 系統別
  private sysTypeOpts: Array<QryOptionsDto> = [];
  // 審查人員
  private confirmEmpOpts: Array<QryOptionsDto> = [];

  // 台灣日曆初始化
  formatter = this.$twDateFormatter;

  form = {
    operType: undefined,
    renew: undefined,
    rptDate: [], // 產生日期
    custType: undefined,
    fileStat: undefined,
    caseNo: "",
    sysType: undefined,

    policyNo: "", // 保單號碼
    policySeq: null, // 保單序號
    idDup: "", // 重複碼

    custId: "",
    custName: "",
    applId: "",
    applName: "",

    contDp: undefined, // 審查部門
    contUt: undefined, // 審查科別
    contId: undefined, // 審查人員

    efileNo: "", // AML審查檔號
  };

  inumberErrorMes = null;
  insuranceIDErrorMes = null;
  gidErrorMes = null;

  rules: { [key: string]: ValidationRule[] } = {
    operType: [
      {
        required: true,
        message: "請選擇作業別",
        trigger: "change",
      },
    ],
    rptDate: [
      {
        required: true,
        trigger: "change",
        validator: (rule, value, callback) => {
          if (
            this.form.rptDate[0] == null ||
            this.form.rptDate[1] == null
          ) {
            callback("請選擇結案日期");
          } else {
            let start = this.form.rptDate[0].valueOf();
            let end = this.form.rptDate[1].valueOf();
            let gap = (end - start) / 1000 / 60 / 60 / 24;
            if (gap > 31) {
              callback("最多篩選一個月期間");
            } else {
              callback();
            }
          }
        },
      },
    ],
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
    caseNo: [
      {
        required: false,
        trigger: "change",
        validator: (rule, value, callback) => {
          const vm = this;
          const rgx = /^[A-Za-z0-9]*$/;
          if (this.fullWidthAcd(value) || rgx.test(value) == false) {
            callback(new Error("請輸入半形英文或數字"));
          } else {
            callback();
          }
        },
      },
    ],
    custId: [
      {
        required: false,
        trigger: "change",
        validator: this.memberId,
      },
    ],
    custName: [
      {
        required: false,
        trigger: "change",
        validator: this.memberName,
      },
    ],
    applId: [
      {
        required: false,
        trigger: "change",
        validator: this.memberId,
      },
    ],
    applName: [
      {
        required: false,
        trigger: "change",
        validator: this.memberName,
      },
    ],
  };

  // data grid
  public grid: FblPDataGridHolder<SearchReviewVO & { isDisabled?: boolean; tipsTxt?: string }> = {
    rowKey: "efileNo",
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 1,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30", "40"],
      showQuickJumper: true,
    },
    columns: [],
  };

  toggleArea() {
    this.collapseAreaOption = !this.collapseAreaOption;
  }

/**
 * 產生下拉
 */
  // 選項預設值初始化
  init () {
    this.form = {
      operType: undefined,
      renew: undefined,
      rptDate: [], // 產生日期
      custType: undefined,
      fileStat: undefined,
      caseNo: "",
      sysType: undefined,

      policyNo: "", // 保單號碼
      policySeq: null, // 保單序號
      idDup: "", // 重複碼

      custId: "",
      custName: "",
      applId: "",
      applName: "",

      contDp: undefined, //審查部門
      contUt: undefined, //審查科別
      contId: undefined, //審查人員
      efileNo: "", //AML審查檔號
    }

    let date = new Date();
    let month = date.getMonth();
    let prevMonth = date.setMonth(month - 1);

    // 來源
    this.form.renew = 'N';
    // 產生日期
    this.form.rptDate[0] = new Date(prevMonth);
    this.form.rptDate[1] = new Date();

  }


// 取得下拉
  async getSelectOpts({bossDepId, depId}) {
      // 審查查詢API
      await this.$searchAMLReviewDataApi.getSelectOptsInSearchUsingPOST({ bossDepId, depId})
      .then(resp => {
        if(resp.data.success === true) {
          let getData = resp.data.data;
          let childrenList :{ key: string, value: string, title: string }[] = this.custTypeOpts[0].children;
          
          // 代入下拉資料
          this.operTypeOpts = getData.operTypeOpts;
          this.renewOpts = getData.renewOpts;
          this.sysTypeOpts = getData.sysTypeOpts;

          getData.custTypeOpts.forEach(function(data){
             if( data.value != "全選"){
              childrenList.push({ key: data.key, value: data.key, title: data.key +" "+data.value });
             }
          });
          
          this.custTypeOpts[0].children = childrenList;
        }
      });
      
    // 代入下拉預設
    this.init();
  }

  /**
   * 欄位檢核驗證
   */
  // 驗證審查元件
  validateReviewFields() {
    (this.$refs.reviewFields as any)
      .validateForm()
      .then((valid) => {
        this.isReviewValidate = valid;
      })
      .catch((valid) => {
        this.isReviewValidate = valid;
      });
  }
  // 保單號碼_檢核
  policyNoRule(rule, value, callback) {
    const vm = this;
    const rgx = /^(?:[a-zA-Z]|@|\d)*$/;
    if (rgx.test(value) == false) {
      vm.inumberErrorMes = "請輸入半形英文、@或數字";
      callback("");
    } else {
      vm.inumberErrorMes = null;
      callback();
    }
  }
  // 保單序號_檢核
  policySeqRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]*$/;
    if (value !== null && rgx.test(value) == false) {
      vm.insuranceIDErrorMes = "請輸入半形數字";
      callback("");
    } else {
      vm.insuranceIDErrorMes = null;
      callback();
    }
  }
  // 重複碼_檢核
  idDupRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]*$/;
    if (rgx.test(value) == false) {
      vm.gidErrorMes = "請輸入半形數字";
      callback("");
    } else {
      vm.gidErrorMes = null;
      callback();
    }
  }
  // 客戶、要保人ID
  memberId(rule, value, callback) {
    const vm = this;
    const rgx = /^[A-Za-z0-9@]*$/;
    if (rgx.test(value) == false) {
      callback(new Error("請輸入半形英文、@或數字"));
    } else {
      callback();
    }
  }
  // 客戶、要保人姓名
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


/**
 * Event
 */
  // 審查部門、科別、人員 (接收子層emit)
  getReviewData(value) {
    this.form.contDp = value.form.contDp;
    this.form.contUt = value.form.contUt;
    this.form.contId = value.form.contId;
  }

  // 查詢列表
  onSearch() {
    // 判斷 待覆核 & AML審查檔號欄位
    if(this.form.efileNo){
      this.isFormValidate = true;
      this.isReviewValidate = true;

      this.isResultShow = false;
      this.grid.pagination.current = 1;
      this.reloadDetail();
    }else{
      // 若沒輸入 AML審查檔號，進行表單輸入驗證
      this.validateReviewFields();
      // 驗證此page的欄位
      (this.$refs.assignmentFilter as any)
        .validate()
        .then((valid) => {
          this.isFormValidate = valid;
          this.isResultShow = false;
          this.grid.pagination.current = 1;
          this.reloadDetail();
        })
        .catch((valid) => {
          this.isFormValidate = valid;
        });
    }
  }

  // 顯示查詢Lists
  reloadDetail() {
    this.isEmptyData = false;
    this.setLoading(true);
    let submit = this.getSubmitData(this.form);

    // 查詢結果
    // 帶入table欄位資料
    this.grid.columns = [
      {
        type: FblColumnType.PLAIN,
        property: "efileNo",
        title: "AML審查檔號",
        fixed: "left",
        sorter: (a, b) => a.efileNo.localeCompare(b.efileNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "combineNo",
        title: "併入AML審查檔號",
        fixed: "left",
        sorter: (a, b) => a.combineNo.localeCompare(b.combineNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "fileStat",
        title: "案件狀態",
        fixed: "left",
        sorter: (a, b) => a.fileStat.localeCompare(b.fileStat),
      },      
      {
        type: FblColumnType.PLAIN,
        property: "operType",
        title: "作業別",
        fixed: "left",
        formatter: (data) => {
          return `${(data.operType as any).code}`;
        },
        sorter: (a, b) => a.operType.code.localeCompare(b.operType.code),
      },
      {
        type: FblColumnType.PLAIN,
        property: "custTypes",
        title: "案件類型",
        customRender: (data) => {
          return data.custTypes.map(x => this.$createElement('div', `${x.description}`));
        },
        sorter: (a, b) => a.custTypes[0].description.localeCompare(b.custTypes[0].description),
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseNo",
        title: "交易案號",
        sorter: (a, b) => a.caseNo.localeCompare(b.caseNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
        formatter: (data) => {
          return `${(data.sysType as any).code}`;
        },
        sorter: (a, b) => a.sysType.code.localeCompare(b.sysType.code),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        formatter: (data) => {
          return `${data.policyNo}-${data.policySeq} ${data.idDup}`;
        },
        sorter: (a, b) => a.policyNo.localeCompare(b.policyNo),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applId",
        title: "要保人ID",
        sorter: (a, b) => a.applId.localeCompare(b.applId),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applFname",
        title: "要保人姓名",
        sorter: (a, b) => a.applFname.localeCompare(b.applFname),
      },
      {
        type: FblColumnType.PLAIN,
        property: "applRiskLvl",
        title: "風險評級",
        sorter: (a, b) => a.applRiskLvl.localeCompare(b.applRiskLvl),
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: "客戶ID",
        customRender: (data) => {
          return data.clients.length > 1 ? data.clients[0].custId + '等' : data.clients[0].custId;
        },
        sorter: (a, b) => a.clients[0].custId.localeCompare(b.clients[0].custId),
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: "客戶姓名",
        customRender: (data) => {
          if(data.clients.length > 0 && data.clients[0].custName) {
            return data.clients[0].custName;
          }else{
            return '';
          }
        },
        sorter: (a, b) => a.clients[0].custName.localeCompare(b.clients[0].custName),
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: "客戶生日",
        customRender: (data) => {
            if(data.clients) {
              return (data.clients as any).map(x => this.$createElement('div', x.bithday))
            }else{
              return '';
            }
        },
        sorter: (a, b) => a.clients[0].bithday.localeCompare(b.clients[0].bithday),
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: "客戶國籍",
        customRender: (data) => {
            if(data.clients) {
              return (data.clients as any).map(x => this.$createElement('div', x.national))
            }else{
              return '';
            }
        },
        sorter: (a, b) => a.clients[0].national.localeCompare(b.clients[0].national),
      },     
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: "名單類型",
        customRender: (data) => {
          return (data.clients[0].listType as any).map(x => this.$createElement('div', x.description))
        },
        sorter: (a, b) => a.clients[0].listType[0].description.localeCompare(b.clients[0].listType[0].description),
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: "保單角色",
        customRender: (data) => {
            if(data.clients) {
              return (data.clients as any).map(x => this.$createElement('div', x.roleType.description))
            }else{
              return '';
            }
        },
        sorter: (a, b) => a.clients[0].roleType.description.localeCompare(b.clients[0].roleType.description),
      },       
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: "審查部門",
        formatter: (data) => {
          if(data.cont && data.cont.bossDepName){
            return data.cont.bossDepName;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          if(a.cont && a.cont.bossDepName){
            return a.cont.bossDepName.localeCompare(b.cont.bossDepName);
          }else{
            return false;
          }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: "審查科別",
        formatter: (data) => {
          if(data.cont && data.cont.depName){
            return data.cont.depName;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          if(a.cont && a.cont.depName){
            return a.cont.depName.localeCompare(b.cont.depName);
          }else{
            return false;
          }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: "審查人員代號",
        formatter: (data) => {
          if(data.cont && data.cont.domainId){
            return data.cont.domainId;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          if(a.cont && a.cont.depName){
            return a.cont.domainId.localeCompare(b.cont.domainId);
          }else{
            return false;
          }
        }
      },   
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: "審查人員",
        formatter: (data) => {
          if(data.cont && data.cont.name){
            return data.cont.name;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          if(a.cont && a.cont.name){
            return a.cont.name.localeCompare(b.cont.name);
          }else{
            return false;
          }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "reviewLevel",
        title: "覆核層級",
        customRender: (data) => {
          return (data.reviewLevel == null) ? '' : data.reviewLevel.level;
        },
        sorter: (a, b) => {
          if(a.reviewLevel == null){
            return a.reviewLevel.Level.localeCompare(b.reviewLevel.level);
          }else{
            return false;
          }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "reviewer",
        title: "覆核主管代號",
        formatter: (data) => {
          return (data.reviewer == null) ? '' :data.reviewer.domainId;
        },
        sorter: (a, b) => {
          return a.reviewer.domainId.localeCompare(b.reviewer.domainId);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "reviewer",
        title: "覆核主管姓名",
        formatter: (data) => {
          return (data.reviewer == null) ? '' :data.reviewer.name;
        },
        sorter: (a, b) => {
          return a.reviewer.name.localeCompare(b.reviewer.name);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "rptDate",
        title: "產生日期",
        sorter: (a, b) =>
          moment(a.rptDate).unix() - moment(b.rptDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "pickupDate",
        title: "審查日期",
        sorter: (a, b) =>
          moment(a.pickupDate).unix() - moment(b.pickupDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "contDate",
        title: "退回重審日期",
        sorter: (a, b) =>
          moment(a.contDate).unix() - moment(b.contDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "updDate",
        title: "異動日期",
        sorter: (a, b) =>
          moment(a.updDate).unix() - moment(b.updDate).unix(),
      },
      {
        type: FblColumnType.PLAIN,
        property: "updDate",
        title: "可疑通報",
        formatter: (data) => {
          // return (data.reviewResult == null) ? '' :data.reviewResult.announcedInd;
          return '';
        },
        sorter: (a, b) => {
          // return a.reviewResult.announcedInd.localeCompare(b.reviewResult.announcedInd);
          return false;
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "renew",
        title: "來源",
        formatter: (data) => {
          return `${(data.renew as any).description}`;
        },
        sorter: (a, b) => a.renew.description.localeCompare(b.renew.description),
      },
    ];
    this.isEmptyData = false;
    this.$searchAMLReviewDataApi.getListInSearchUsingPOST({
      "filter": submit,
      "pageIndex": this.grid.pagination.current - 1,
      "pageSize": this.grid.pagination.pageSize
    })
    .then(resp => {
      if(resp.data.success === true) {
        let getData = resp.data.data;
        this.grid.data = getData.content;
        this.grid.pagination.total = parseInt(getData.totalElements);
        if(getData.content.length > 0){
          // 處理 softLock disabled 與 tipsTxt  
          this.grid.data.map((item,index) => {
            if((item.softLock as any).code != 'N' && item.fileStat == '待審查'){
              this.grid.data[index].isDisabled = true;
              this.grid.data[index].tipsTxt = (item.softLock as any).description;
            }
          })      
        }
      }
    })
    .catch((error) => {
      console.log(error);
      this.grid.data = [];
    })    
    .finally(() => {
      this.setLoading(false);
      this.isResultShow = true;
      this.rowTipsTxt = "";      
    });
  }

  // table 事件
  onMasterPageChange(e){
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if(p.current !== e.current || p.pageSize !== e.pageSize) {
      p.current = e.current;
      // 切換顯示筆數時，跳回第一頁
      if(p.pageSize !== e.pageSize) {
        p.current = 1;
      }
      p.pageSize = e.pageSize;
      this.grid.pagination = p;
      this.reloadDetail();
    }
  }
  // 表格 雙擊事件
  onRowDblclick(row: FblRow<SearchReviewVO & { isDisabled: boolean; tipsTxt: string }>) {
    if (row.data.isDisabled) return;
    let vm = this;
    let efileNo = `${row.data.efileNo}`;
    // 讓另開的新視窗sessionStorage能*複製*相同的資訊
    if(row.data.combineNo != null && row.data.combineNo != ''){
      efileNo = row.data.combineNo;
    }
    sessionStorage["review_assignment_page"] = efileNo;
    sessionStorage["review_assignment_renew"] = JSON.stringify(row.data.renew);
    sessionStorage["review_assignment_custtypes"] = JSON.stringify(
      row.data.custTypes
    );

    vm.windowCheck = window.open(
      vm.$router.resolve({ name: 'ReviewSearchDetail',query:{searchEfileNo : efileNo} }).href,
      row.data.efileNo
    );

    vm.actingRow = row.data.efileNo.replace("@","");
  }

  // webSocket
  receiveMessage(e) {
    // console.log(e.data, e.origin, window.location.origin);
    if (e.data.type || e.origin != window.location.origin) {
      return;
    }
  }
  // 開啟明細頁後將sessionStorage["review_assignment_page"]清空，也不做任何卡控
  inspectLocalStorage() {
    sessionStorage["review_assignment_page"] = "";
  }


/**
 * Func
 */
  // 日期選擇 卡控
  disabledDate(current, dates) {
    const date = new Date(dates[0]);
    //如果還未點選任一時間 取消限制(全開)
    if (dates[0] && dates[1]) {
      return false;
    } else {
      //當有選取時 打開限制(前後 31days)
      return (
        current <
          moment()
            .year(date.getFullYear())
            .month(date.getMonth())
            .date(date.getDate() - 31) ||
        current >
          moment()
            .year(date.getFullYear())
            .month(date.getMonth())
            .date(date.getDate())
            .add(31, "d")
      );
    }
  }

  // //row disabled 樣式
  setRowClass(record) {
    return record.isDisabled ? "data-row-disable" : "";
  }
  setRowTipsTxt(e: any) {
    let tipsTxt = e.data.tipsTxt;
    this.rowTipsTxt = tipsTxt;
  }

  getSubmitData(data) {
    let submit = JSON.parse(JSON.stringify(data));
    // 時間格式 處理
    if(submit.rptDate){
      submit.rptDate.map((item, index) => {
        submit.rptDate[index] = moment(submit.rptDate[index]).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
      })
    }
    if(submit.rptDate){
      submit.rptDate.map((item, index) => {
        submit.rptDate[index] = moment(submit.rptDate[index]).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
      })
    }
    // 案件類型 處理
    if(submit.custType){
      let string = submit.custType;
      submit.custType = [];
      submit.custType[0] = string.join(",");
    }
    // 空值的資料 不需要送參
    Object.keys(submit).map((item) => {
      switch(true){
        case submit[item] == '':
        case submit[item] == null:
        case submit[item].length <= 0:
          delete submit[item];
        break;
      }
    });
    return submit;
  }

/**
 * Hook
 */
  created() {
    let date = new Date();
    let month = date.getMonth();
    let prevMonth = date.setMonth(month - 1);

    //預設系統日
    this.form.rptDate[0] = new Date(prevMonth);
    this.form.rptDate[1] = new Date();
  }
  mounted() {
    window.addEventListener("message", this.receiveMessage, false);
    // 偵測 localStorage 是否有任何資料被變動
    onstorage = this.inspectLocalStorage;
  }

/**
 * 監聽
 */
  // 表格data format、取得下拉資料
  @Watch('$route', { deep: true, immediate: true })
  async watchRouter(newVal, oldVal) {
    let vm = this;
    if(oldVal && newVal.path !== oldVal.path){
      // TODO: 捲到頂
      let getEle = document.getElementsByClassName('ant-layout-content');
      getEle[0].scrollTop = 0;
      // TODO: 查詢資料 Format
      this.grid.data = [];
      this.isResultShow = false;
    }
    const $me:any = this.$user.getMe().employee;
    
    await this.getSelectOpts($me);
    this.init();
  }
@Watch('grid.data', { deep: true, immediate: true })
  watchGrid(newVal) {
    if(newVal.length > 0) {
      this.isEmptyData = false;
    }else{
      this.isEmptyData = true;
    }
    
  }
  
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  color: #227fa8;
}
.container {
  background-color: transparent;
}
.message--error {
  color: #f5222d;
  margin-top: -16px;
}
.fbl-table {
  margin-top: 15px;
}

.fbl-table__list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

/* 雙擊提醒小字 */
.grid__small {
  font-size: 14px;
  color: #227fa8;
  margin-left: 5px;
}

::v-deep {
  .ant-table-row {
    &:not(.data-row-disable) {
      cursor: pointer;
    }
  }
}
</style>