<template>
  <div style="background: #f0f2f5">
    <div class="card--title">
      <collapse-area :searchArea="true" :isOpenSearch="collapseAreaOption" @toggle="toggleArea">
        <template v-slot:escape>
          <div>
            <div class="title">{{pageTitle}}</div>
            <a-divider type="horizontal" />
          </div>
        </template>
        <template v-slot:area>
          <div class="card__form--title">
            <a-form-model
              ref="assignmentFilter"
              :form="form"
              :layout="'vertical'"
              :model="form"
              :rules="rules"
              :hideRequiredMark="true"
            >
              <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                <!-- 作業別 -->
                <a-col :lg="8" :xxl="6">
                  <a-form-model-item prop="operType">
                    <span slot="label">
                      作業別 <span class="mark-required">*</span>
                    </span>
                    <a-select
                      size="large"
                      v-model="form.operType"
                      allow-clear
                      placeholder="請選擇"
                      @change="handleOperTypeChange"
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
                  <!-- 待審查 -->
                  <a-form-model-item prop="rptDate" v-if="!isConfirm">
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
                  <!-- 待覆核 -->
                  <a-form-model-item prop="contDate" v-else>
                    <span slot="label">
                      審查日期 <span class="mark-required">*</span>
                    </span>
                    <date-picker
                      type="date"
                      v-model="form.contDate"
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
                <a-col :lg="8" :xxl="6">
                  <a-form-model-item prop="custType" label="案件類型">
                    <a-select
                      v-model="form.custType"
                      size="large"
                      allow-clear
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
                <!-- 案件狀態 -->
                <a-col :lg="8" :xxl="6">
                  <a-form-model-item prop="fileStat" label="案件狀態">
                    <a-select
                      size="large"
                      v-model="form.fileStat"
                      allow-clear
                      placeholder="請選擇"
                    >
                      <a-select-option v-for="item in fileStatOpts" :key="item.key">
                        {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- 交易案號 -->
                <a-col :lg="8" :xxl="6">
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
                <a-col :lg="8" :xxl="6">
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
                <a-col :lg="8" :xxl="6">
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
                <a-col :lg="16" :xxl="12">
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
                <a-col :lg="16" :xxl="12">
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
                <!-- 覆核人員 -->
                <a-col :lg="8" :xxl="{span: 6, order: 2}" v-if="isConfirm">
                  <a-form-model-item prop="reviewerId">
                    <span slot="label"> 覆核人員 </span>
                    <a-select
                      class="input"
                      size="large"
                      v-model="form.reviewerId"
                      allow-clear
                      placeholder="請選擇"
                    >
                      <a-select-option v-for="person in confirmEmpOpts" :key="person.key">
                        {{ person.value }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- 審查部門、審查科別、審查人員 -->
                <a-col :lg="24" :xxl="18">
                  <review-fields
                    ref="reviewFields"
                    :isRequired="[true, false, false]"
                    :isDisabled="[true, false, false]"
                    @submitData="getReviewData"
                    @updateConfirmEmp="updateConfirmEmp"
                    :xsSpan="24"
                    :mdSpan="12"
                    :lgSpan="8"
                    :xxlSpan="8"
                  >
                  </review-fields>
                </a-col>
              </a-row>
              <template v-if="isConfirm">
                <a-divider type="horizontal" />
                <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
                  <!-- AML審查檔號 -->
                  <a-col :lg="8" :xxl="6">
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
              </template>
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
          <span class="title">查詢結果</span><small class="grid__small" v-if="!isEmptyData">(雙擊列表可查看明細)</small>
        </div>
        <div align="right">
          <a-button class="exportBtn" @click="onExport()" v-if="!isEmptyData"
            >匯出</a-button
          >
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

import { QryOptionsDto, MainResponseDto } from "@fubonlife/edd-api-axios-sdk";
import Global from "@/plugins/global";

@Component({ components: { FblDataGrid, CollapseArea, ReviewFields } })
export default class ReviewAssignment extends Vue {
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

  @Getter public isConfirm: boolean;
  @Action public HandleAlreadyOpenDetail: (payload:boolean) => void;

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
  private custTypeOpts: Array<QryOptionsDto> = [];
  // 案件狀態
  private fileStatOpts: Array<QryOptionsDto> = [];
  // 系統別
  private sysTypeOpts: Array<QryOptionsDto> = [];
  // 審查人員
  private confirmEmpOpts: Array<QryOptionsDto> = [];
  // 初始系統別
  private initSysTypeOpts: Array<QryOptionsDto> = [];

  catchSubmit: {
    operType?: undefined,
    renew?: string,
    rptDate?: string[],  // 待審查_產生日期
    custType?: string[],
    fileStat?: string,
    caseNo?: string,
    sysType?: string,
    policyNo?: string, // 保單號碼
    policySeq?: number, // 保單序號
    idDup?: string, // 重複碼

    custId?: string,
    custName?: string,
    applId?: string,
    applName?: string,
    contDp?: string,
    contUt?: string,
    contId?: string,

    contDate?: string[], // 待覆核_產生日期
    efileNo?: string, // AML審查檔號
    reviewerId?: string, // 覆核人員
  };

  // 台灣日曆初始化
  formatter = this.$twDateFormatter;

  form = {
    operType: undefined,
    renew: undefined,
    rptDate: [],  // 待審查_產生日期
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

    contDate: [], // 待覆核_產生日期
    efileNo: "", // AML審查檔號
    reviewerId: undefined, // 覆核人員
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
          if (value[0] == null || value[1] == null) {
            callback("請選擇產生日期");
          } else {
            let start = value[0];
            let end = value[1];
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
    contDate: [
      {
        required: true,
        trigger: "change",
        validator: (rule, value, callback) => {
          if ( value[0] == null || value[1] == null ) {
            callback("請選擇審查日期");
          } else {
            let start = value[0].valueOf();
            let end = value[1].valueOf();
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
  
  initGridColumns = [
    {
      key: "efileNo",
      type: FblColumnType.PLAIN,
      property: "efileNo",
      title: "AML審查檔號",
      fixed: "left",
      sorter: (a, b) => a.efileNo.localeCompare(b.efileNo),
    },
    {
      key: "operType",
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
      key: "renew",
      type: FblColumnType.PLAIN,
      property: "renew",
      title: "來源",
      fixed: "left",
      formatter: (data) => {
        return `${(data.renew as any).description}`;
      },
      sorter: (a, b) => a.renew.description.localeCompare(b.renew.description),
    },
    {
      key: "rptDate",
      type: FblColumnType.PLAIN,
      property: "rptDate",
      title: "產生日期",
      fixed: "left",
      sorter: (a, b) =>
      moment(a.rptDate).unix() - moment(b.rptDate).unix(),
    },
    {
      key: "contDate",
      type: FblColumnType.PLAIN,
      property: "contDate",
      title: "審查日期",
      fixed: "left",
      sorter: (a, b) =>
      moment(a.contDate).unix() - moment(b.contDate).unix(),
    },
    {
      key: "custTypes",
      type: FblColumnType.PLAIN,
      property: "custTypes",
      title: "案件類型",
      customRender: (data) => {
        if(data.custTypes) {
          return data.custTypes.map(x => this.$createElement('div', `${x.description}`));
        }else{
          return '';
        }
      },
      sorter: (a, b) => a.custTypes[0].description.localeCompare(b.custTypes[0].description),
    },
    {
      key: "caseNo",
      type: FblColumnType.PLAIN,
      property: "caseNo",
      title: "交易案號",
      sorter: (a, b) => a.caseNo.localeCompare(b.caseNo),
    },
    {
      key: "sysType",
      type: FblColumnType.PLAIN,
      property: "sysType",
      title: "系統別",
      formatter: (data) => {
        return `${(data.sysType as any).code}`;
      },
      sorter: (a, b) => a.sysType.code.localeCompare(b.sysType.code),
    },
    {
      key: "policyNo",
      type: FblColumnType.PLAIN,
      property: "policyNo",
      title: "保單號碼",
      formatter: (data) => {
        return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}`;
      },
      sorter: (a, b) => a.policyNo.localeCompare(b.policyNo),
    },
    {
      key: "applId",
      type: FblColumnType.PLAIN,
      property: "applId",
      title: "要保人ID",
      sorter: (a, b) => a.applId.localeCompare(b.applId),
    },
    {
      key: "applFname",
      type: FblColumnType.PLAIN,
      property: "applFname",
      title: "要保人姓名",
      sorter: (a, b) => a.applFname.localeCompare(b.applFname),
    },
    {
      key: "applRiskLvl",
      type: FblColumnType.PLAIN,
      property: "applRiskLvl",
      title: "風險評級",
      formatter: (data) => {
        return data.applRiskLvl;
      },
      sorter: (a, b) => a.data.applRiskLvl.localeCompare(b.data.applRiskLvl),
    },
    {
      key: "custId",
      type: FblColumnType.PLAIN,
      property: "clients",
      title: "客戶ID",
      hidden: true,
      formatter: (data) => {
        return data.clients.length > 1 ? data.clients[0].custId + '等' : data.clients[0].custId;
      },
      sorter: (a, b) => a.clients[0].custId.localeCompare(b.clients[0].custId),
    },
    {
      key: "custName",
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
      key: "listType",
      type: FblColumnType.PLAIN,
      property: "clients",
      title: "名單類型",
      customRender: (data) => {
        if(data.clients[0].listType) {
          return (data.clients[0].listType as any).map(x => this.$createElement('div', x.description))
        }else{
          return ''
        }
      },
      sorter: (a, b) => a.clients[0].listType[0].description.localeCompare(b.clients[0].listType[0].description),
    },
    {
      key: "fileStat",
      type: FblColumnType.PLAIN,
      property: "fileStat",
      title: "案件狀態",
      sorter: (a, b) => a.fileStat.localeCompare(b.fileStat),
    },
    {
      key: "contBossDepName",
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
      key: "contDepName",
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
      key: "contName",
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
      key: "reviewerName",
      type: FblColumnType.PLAIN,
      property: "reviewer",
      title: "覆核人員",
      formatter: (data) => {
        if(data.reviewer && data.reviewer.name){
          return data.reviewer.name;
        }else{
          return '';
        }
      },
      sorter: (a, b) => {
        if(a.reviewer && a.reviewer.name){
          return a.reviewer.name.localeCompare(b.reviewer.name);
        }else{
          return false;
        }
      }
    },
  ];

  // data grid
  public grid: FblPDataGridHolder<MainResponseDto & { isDisabled?: boolean; tipsTxt?: string }> = {
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
      rptDate: [],
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

      contDate: [], // 待覆核_審查日期
      efileNo: "", //AML審查檔號
      reviewerId: undefined, //覆核人員
    }
    this.collapseAreaOption = true;
    let date = new Date();
    let month = date.getMonth();
    let prevMonth = date.setMonth(month - 1);

    if (!this.isConfirm){
      // 來源
      this.form.renew = 'N';
      // 待審查_產生日期
      this.form.rptDate[0] = new Date(prevMonth);
      this.form.rptDate[1] = new Date();
      // 案件類型
      this.form.custType = '1';
      // 案件狀態
      this.form.fileStat = '1';
      //設定系統別
      this.handleOperTypeChange(this.form.operType);

      // TEST:
      // this.form.operType = '*';
      // this.form.renew = undefined;
      // let mon = 8;
      // this.form.rptDate[0] = new Date(`2021/0${mon}/01`);
      // this.form.rptDate[1] = new Date(`2021/0${mon}/31`);
      // this.form.custType = undefined;
      // this.form.fileStat = undefined;

      // this.form.caseNo = 'MN0210102388056';
    }else{
      //this.form.operType = '*';
      // 來源
      this.form.renew = 'N';
      //this.form.custType = '1';
      this.form.fileStat = '3';
      // 待覆核_審查日期
      this.form.contDate[0] = new Date(prevMonth);
      this.form.contDate[1] = new Date();
      //設定系統別
      this.handleOperTypeChange(this.form.operType);

      // TEST:
      // this.form.operType = '*';
      // this.form.renew = undefined;
      // let mon = 9;
      // this.form.rptDate[0] = new Date(`2021/0${mon}/01`);
      // this.form.rptDate[1] = new Date(`2021/0${mon}/31`);
      // this.form.custType = undefined;
      // this.form.fileStat = undefined;
      // this.form.efileNo = 'VP110082700112';
    }
    // 檢核 重置
    (this.$refs.assignmentFilter as any).resetFields();
  }
  // 拆流_取得下拉
  async getSelectOpts({bossDepId, depId}) {
    this.setLoading(true);
    if(!this.isConfirm){
      // 待審查API
      await this.$reviewApi
      .getSelectOptsInReviewUsingPOST({ bossDepId, depId})
      .then(resp => {
        if(resp.data.success === true) {
          const getData = resp.data.data;

          // 代入下拉資料
          this.operTypeOpts = getData.operTypeOpts;
          this.renewOpts = getData.renewOpts;
          this.custTypeOpts = getData.custTypeOpts;
          this.fileStatOpts = getData.fileStatOpts;
          this.initSysTypeOpts = getData.sysTypeOpts;
        }
      })
      .finally(() => {
        this.setLoading(false);
      });
    }else{
      // 待覆核API
      await this.$confirmApi
      .getSelectOptsInConfirmUsingPOST({ bossDepId, depId })
      .then(resp => {
        if(resp.data.success === true) {
          const getData = resp.data.data;
          // 代入下拉資料
          this.operTypeOpts = getData.operTypeOpts;
          this.renewOpts = getData.renewOpts;
          this.custTypeOpts = getData.custTypeOpts;
          this.fileStatOpts = getData.fileStatOpts;
          this.initSysTypeOpts = getData.sysTypeOpts;
        }
      })
      .finally(() => {
        this.setLoading(false);
      });
    }
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
    if(this.isConfirm && this.form.efileNo){
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
    this.setLoading(true);
    let submit = (this.isConfirm && this.form.efileNo)? { efileNo: this.form.efileNo } : this.getSubmitData(this.form);
    // 送參前轉大寫 (針對 保單號碼、客戶ID、要保人ID、AML審查檔號)
    Object.keys(submit).map(item => {
      switch(item){
        case 'policyNo':
        case 'custId':
        case 'applId':
        case 'efileNo':
          submit[item] = submit[item].toUpperCase();
          break;
      }
    });
    // 暫存 catchSubmit (匯出用)
    this.catchSubmit = submit;
    
    // 拆流 (待審查/待覆核)
    if(!this.isConfirm) {
      // 待審查 查詢結果
      // 帶入table欄位資料
      this.grid.columns = this.initGridColumns.filter(item =>  !(item.key == "contDate" || item.key == "reviewerName")) as any;
      this.$reviewApi
      .getListInReviewUsingPOST({
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
              // 鎖定softLock 不是 "N"(未被鎖定)的案件
              if((item.softLock as any).code != 'N'){
                this.grid.data[index].isDisabled = true;
                this.grid.data[index].tipsTxt = (item.softLock as any).description;
              }
              // 鎖定已被併件的案件
              if(item.combineNo && item.combineNo != item.efileNo) {
                this.grid.data[index].isDisabled = true;
                this.grid.data[index].tipsTxt = "被併案件";
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
      })
    }else{
      // 待覆核 查詢結果
      // 帶入table欄位資料
      this.grid.columns = this.initGridColumns.filter(item =>  item.key !== "rptDate" ) as any;
      this.$confirmApi
      .getListInConfirmUsingPOST({
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
              if((item.softLock as any).code != 'N'){
                this.grid.data[index].isDisabled = true;
                this.grid.data[index].tipsTxt = (item.softLock as any).description;
              }
              // 鎖定已被併件的案件
              if(item.combineNo && item.combineNo != item.efileNo) {
                this.grid.data[index].isDisabled = true;
                this.grid.data[index].tipsTxt = "被併案件";
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
  onRowDblclick(row: FblRow<MainResponseDto & { isDisabled: boolean; tipsTxt: string }>) {
    let vm = this;
    function getNext(){
      vm.setLoading(true);
      // 有其他人員作業中，禁止作業
      vm.$reviewApi.getSoftLockInReviewUsingGET(row.data.efileNo)
      .then(resp => {
        if(resp.data.success == true) {
          const getDataCode = resp.data.data.toUpperCase();
          if(getDataCode !== 'N') {
            // 彈窗提醒
            Modal.error({
              title: `無法取件！`,
              content: `${row.data.efileNo.replace("@","")}案件，${resp.data.message}！`,
              icon: () => vm.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
              class: "modal__custom",
              okText: "確定",
              okType: "okButton",
            })
            return;
          }else{
            // 為避免有心人士清空 localStorage 造成上一個檢查失效
            if (!vm.windowCheck || vm.windowCheck.closed) {
              // 讓另開的新視窗sessionStorage能*複製*相同的資訊
              sessionStorage["review_assignment_page"] = row.data.efileNo;
              sessionStorage["review_assignment_data"] = JSON.stringify(row.data);
              vm.checkIsFinish(vm, row);
            } else {
              // 彈跳訊息用Notification的話，還訊息通知框沒顯示出來，畫面就跳去子視窗focus()
              Modal.error({
                title: `無法取件！`,
                content: `您正在處理AML審查檔號${row.data.efileNo.replace("@","")}案件，系統無法同時受理兩案件，請確認！`,
                icon: () => vm.h("a-icon", {
                  props: {
                    type: "close-circle",
                    theme: "filled",
                  },
                }),
                class: "modal__custom",
                okText: "確定",
                okType: "okButton",
                onOk: () => {
                  if (vm.windowCheck) vm.windowCheck.focus();
                },
              });
            }

            // 人員作業中，列表狀態鎖住
            row.data.isDisabled = true;
            row.data.tipsTxt = "人員作業中";
            vm.actingRow = row.data.efileNo.replace("@","");
          }
        }
      })
      .finally(() => {
        vm.setLoading(false);
      });
    }
    if (row.data.isDisabled) return;

    //避免有人連續點擊，一次開到兩筆
    if (sessionStorage["review_assignment_page"] || !localStorage["login_state"]) {
      let errorTitle = sessionStorage["review_assignment_page"] ? "取件時發生資料異常" : "連線逾時";
      Modal.error({
        title: `${errorTitle}，請重新登入。`,
        content: "",
        icon: () => vm.h("a-icon", {
          props: {
            type: "close-circle",
            theme: "filled",
          },
        }),
        class: "modal__custom",
        okText: "確定",
        okType: "okButton",
        onOk: () => {
          this.$user.signOut();
          window.location.href = process.env.VUE_APP_LOGIN_URL;
        },
      });
      return;
    }

    let efileNo = localStorage["review_assignment_page"];
    if (efileNo) {
      // 彈跳訊息用Notification的話，還訊息通知框沒顯示出來，畫面就跳去子視窗focus()
      Modal.error({
        title: `無法取件！`,
        content: `您正在處理AML審查檔號${efileNo.replace("@","")}案件，系統無法同時受理兩案件，請確認！`,
        icon: () => vm.h("a-icon", {
          props: {
            type: "close-circle",
            theme: "filled",
          },
        }),
        class: "modal__custom",
        okText: "確定",
        okType: "okButton",
        onOk: () => {
          if (this.windowCheck) this.windowCheck.focus();
        },
      });
      return;
    }
    
    // 登入人員 待審查時 審查人員非本人
    // 登入人員 待覆核時 覆核人員非本人
    let dataName;
    let wording;
    if(!this.isConfirm){
      dataName = 'cont';
      wording = '審查';
    }else{
      dataName = 'reviewer';
      wording = '覆核';
    }
    // 登入人員 覆核時 審查人員不得為自己 (球員兼裁判)
    if(this.isConfirm){
      if(row.data.cont.domainId != null && this.$user.getMe().employee.domainId == row.data.cont.domainId){
        Modal.error({
          title: `提醒`,
          content: `審查人員為自己的案件不能取件覆核`,
          okType: 'green',
          okText: "確定",
          icon: () =>
            this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
            }),
          onOk: () => {},
        });
        return;
      }
    }
    // 審查 / 覆核 共用
    if (
      row.data[dataName] != null &&
      row.data[dataName].domainId != null &&
      (
        (!this.isConfirm && (row.data.fileStat == "審查中" || row.data.fileStat == "2" || row.data.fileStat == "退回重審" || row.data.fileStat == "20") && this.$user.getMe().employee.domainId !== row.data[dataName].domainId) || 
        (this.isConfirm && (row.data.fileStat == "覆核中" || row.data.fileStat == "4" || row.data.fileStat == "核決中" || row.data.fileStat == "41") && this.$user.getMe().employee.domainId !== row.data[dataName].domainId)
      )
    ) {
      Modal.confirm({
        title: `提醒`,
        content: `本案已由${row.data[dataName].name}${wording}中，確定要改由您進行${wording}嗎?`,
        icon: () => this.h("a-icon", {
          props: {
            type: "exclamation-circle",
            theme: "filled",
          },
        }),
        class: "modal__confirm",
        okText: "確定",
        okType: "okButton",
        cancelText: "取消",
        onOk: () => {
          getNext();
        },
        onCancel: () => {},
      });
      return;
    }else{
      getNext();
    }
  }
  // webSocket
  receiveMessage(e) {
    // console.log(e.data, e.origin, window.location.origin);
    if (e.data.type || e.origin != window.location.origin) {
      return;
    }

    // TEST:
    // let content = "Get Message =>" + JSON.stringify(e.data) + "<br>";
    // content += "Url from " + e.origin;
    // document.getElementById("response").innerHTML = "<p>" + content + "</p>";

    //更新grid狀態
    // this.grid.data = this.grid.data.filter((item) => {
    //   // console.log(this.$_.findIndex(e.data, { amlId: item.amlId }));
    //   if (this.$_.findIndex(e.data, { amlId: item.amlId }) > -1) {
    //     item.isDisabled = true;
    //     item.tipsTxt = "被人工併案之案件"; //先寫死，之後改由子視窗吐tips 更新or併件
    //   }
    //   return item;
    // });
  }
  // TODO: 需多次驗證...若電腦當機而重開瀏覽器後發生*子視窗不存在、母視窗存在*就悲劇了
  inspectLocalStorage() {
    let efileNo = localStorage["review_assignment_page"];
    if (efileNo) {
      if (efileNo.includes(sessionStorage["review_assignment_page"])) {
        sessionStorage["review_assignment_page"] = "";
      }
      this.HandleAlreadyOpenDetail(true);
    } else {
      sessionStorage["review_assignment_page"] = "";

      // 解除列表鎖定狀態
      const targetRow = this.grid.data.find(element => element.efileNo === this.actingRow);
      if (targetRow && targetRow.softLock && targetRow.softLock.code.toUpperCase() == 'N') {
        targetRow.isDisabled = false;
        targetRow.tipsTxt = "";
      }
      this.HandleAlreadyOpenDetail(false);
    }
  }
  updateConfirmEmp() {
    // API: 更新覆核人員
  }
  // 匯出
  onExport() {
    this.setLoading(true);
    if(!this.isConfirm) {
      this.$reviewApi.exportReportInReviewUsingPOST(this.catchSubmit, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          let current = moment(new Date()).format("YYYY/MM/DD").split("/");
          let twYear = parseInt(current[0]) - 1911 + ""; 
          const downloadName = 'AML待審查清單_' + twYear + current[1] + current[2];
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}.xlsx`);
          downloadlink.click();
          downloadlink.remove();
        })
        .finally(() => {
          this.setLoading(false);
        });
    }else{
      this.$confirmApi.exportReportInConfirmUsingPOST(this.catchSubmit, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          let current = moment(new Date()).format("YYYY/MM/DD").split("/");
          let twYear = parseInt(current[0]) - 1911 + ""; 
          const downloadName = 'AML待覆核清單_' + twYear + current[1] + current[2];
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}.xlsx`);
          downloadlink.click();
          downloadlink.remove();
        })
        .finally(() => {
          this.setLoading(false);
        });
    }
  }


/**
 * Func
 */
  /** 拆流(待審查、待覆核)*/
  // 查詢頁標題 (拆流)
  get pageTitle():string {
    return (this.isConfirm) ? '待覆核' : '待審查';
  }
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
  // row disabled 樣式
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
    if(submit.contDate){
      submit.contDate.map((item, index) => {
        submit.contDate[index] = moment(submit.contDate[index]).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
      })
    }
    // 案件類型 處理
    if(submit.custType){
      let string = submit.custType;
      submit.custType = [];
      submit.custType[0] = string;
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

  openDetailPage(vm, row) {
    let enterPath = vm.isConfirm ? 'ReviewConfirmDetail' : 'ReviewDetail';
    vm.windowCheck = window.open(
      vm.$router.resolve({ name: enterPath }).href,
      row.data.efileNo
    );
    setTimeout(() => { //此頁sessionStorage作用只是複製資料到子視窗，開啟子視窗後就會清掉。
      sessionStorage["review_assignment_page"] = "";
    }, 1000);
  }

  checkIsFinish(vm, row) {
    const caseNo = JSON.parse(sessionStorage["review_assignment_data"]).caseNo;
    this.$reviewApi.checkIsFinishForMCUsingGET(caseNo)
    .then((resp) => { 
      if (resp.data.data == 0) {
        Modal.error({
            title: "保全案件尚未結案",
            content: "「本次交易金額」與「給付方式」尚未確定！",
            icon: () => this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
            }),
            class: "modal__custom",
            okText: "確定",
            okType: "okButton",
            onOk: () => {
              this.openDetailPage(vm, row);
            },
          });
      } else {
        this.openDetailPage(vm, row);
      }
    })
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

    //預設系統日
    this.form.contDate[0] = new Date(prevMonth);
    this.form.contDate[1] = new Date();
  }
  mounted() {
    window.addEventListener("message", this.receiveMessage, false);
    // 偵測 localStorage 是否有任何資料被變動
    onstorage = this.inspectLocalStorage;

    // 偵測 grid 更新 (明細頁觸發)
    window.addEventListener("storage", ($storage) => {
      if($storage.key == 'currentGridData' && $storage.newValue) {
        let {table , efileNo: $efileNo, type} = JSON.parse($storage.newValue);
        this[table].data.map((item, index) => {
          if(item.efileNo == $efileNo && item.softLock && item.softLock.code.toUpperCase() == "N") {
            switch(type) {
              case 'U':
                item.isDisabled = true;
                item.softLock.code = "U";
                item.description = "人員或批次執行更新資料中"
                item.tipsTxt = "人員或批次執行更新資料中";
                break;
              case 'D':
                this[table].data.splice(index, 1);
                this[table].pagination.total -= 1;
                break;
            }
          }
        })
      }
    }, false)
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
  // @Watch('refreshPage.assignment', { deep: true, immediate: true })
  // watchRefresh(newVal, oldVal) {
  //   if(newVal) {
  //     window.location.reload();
  //     this.setrefresh({page: 'assignment', control: false})
  //   }
  // }
  @Watch('grid.data', { deep: true, immediate: true })
  watchGrid(newVal) {
    if(newVal.length > 0) {
      this.isEmptyData = false;
    }else{
      this.isEmptyData = true;
    }
    
  }
  get contChange() {
    return { contDp: this.form.contDp, contUt: this.form.contUt };
  }
  @Watch('contChange', { immediate: true })
  watchContUt({contDp , contUt = '*'}) {
    if(contDp) {
      // 取得 覆核人員
      this.$confirmApi
        .getSelectReviewIdOptsInConfirmUsingPOST({ bossDepId: contDp, depId: contUt})
        .then(resp => {
          if(resp.data.success === true) {
            const getData = resp.data.data;
            // 代入下拉資料
            this.confirmEmpOpts = getData;
            this.form.reviewerId = undefined;
          }
        })
    }
  }
  handleOperTypeChange(value) {
    if (
      value == "CL" ||
      (value == "*" &&
        this.operTypeOpts.find((i) => i.key == "CL") != undefined)
    ) {
      this.sysTypeOpts = Object.assign(this.initSysTypeOpts);
    } else {
      this.sysTypeOpts = Object.assign(
        this.initSysTypeOpts.filter((c) => c.key != "H")
      );
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
