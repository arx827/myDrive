<template>
  <div style="background: #f0f2f5">
    <div class="card">
      <div class="card__form">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          layout="vertical"
          :hideRequiredMark="true"
        >
          <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
            <!-- 作業別 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item prop="operType">
                <span slot="label">
                  作業別
                  <span class="mark-required">*</span>
                </span>
                <a-select
                  size="large"
                  v-model="form.operType"
                  allow-clear
                  placeholder="請選擇"
                  @change="
                    form.applId = null;
                    form.applName = null;
                  "
                >
                  <a-select-option v-for="item in operTypeOpts" :key="item.key">
                    {{
                      item.key == "*"
                        ? `${item.value}`
                        : `${item.key} ${item.value}`
                    }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 來源 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item prop="renew">
                <span slot="label">
                  來源
                  <span class="mark-required">*</span>
                </span>
                <a-select
                  size="large"
                  v-model="form.renew"
                  allow-clear
                  placeholder="請選擇"
                >
                  <a-select-option v-for="item in renewOpts" :key="item.key">
                    {{
                      item.key == "*"
                        ? `${item.value}`
                        : `${item.key} ${item.value}`
                    }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 產生日期 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item prop="rptDate">
                <span slot="label">產生日期</span>
                <date-picker
                  type="date"
                  v-model="rptDate"
                  :formatter="formatter"
                  disabled
                ></date-picker>
              </a-form-model-item>
            </a-col>
            <!-- 案件類型 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item prop="custType">
                <span slot="label">
                  案件類型
                  <span class="mark-required">*</span>
                </span>
                <a-select
                  class="select"
                  size="large"
                  v-model="form.custType"
                  allow-clear
                  placeholder="請選擇"
                >
                  <a-select-option v-for="item in custTypeOpts" :key="item.key">
                    {{
                      item.key == "*"
                        ? `${item.value}`
                        : `${item.key} ${item.value}`
                    }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 交易案號 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item prop="caseNo">
                <span slot="label">
                  交易案號
                  <span class="mark-required">*</span>
                </span>
                <a-input
                  class="input"
                  type="text"
                  size="large"
                  :maxLength="20"
                  v-model="form.caseNo"
                  allow-clear
                  placeholder="請輸入"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <!-- 保單角色 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item prop="roleId">
                <span slot="label">
                  保單角色
                  <span class="mark-required">*</span>
                </span>
                <a-select
                  class="select"
                  size="large"
                  v-model="form.roleId"
                  allow-clear
                  placeholder="請選擇"
                >
                  <a-select-option v-for="item in roleTypeOpts" :key="item.key">
                    {{
                      item.key == "*"
                        ? `${item.value}`
                        : `${item.key} ${item.value}`
                    }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 系統別 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item prop="sysType">
                <span slot="label">
                  系統別
                  <span class="mark-required">*</span>
                </span>
                <a-select
                  class="select"
                  size="large"
                  v-model="form.sysType"
                  allow-clear
                  placeholder="請選擇"
                >
                  <a-select-option v-for="item in sysTypeOpts" :key="item.key">
                    {{
                      item.key == "*"
                        ? `${item.value}`
                        : `${item.key} ${item.value}`
                    }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 保單號碼 -->
            <a-col :lg="8" :xxl="6">
              <a-form-model-item>
                <span slot="label">
                  保單號碼
                  <span class="mark-required">*</span>
                </span>
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
                      {{ inumberErrorMes }} {{ insuranceIDErrorMes }}
                      {{ gidErrorMes }}
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
                  <a-form-model-item prop="custId">
                    <span slot="label">
                      客戶ID
                      <span class="mark-required">*</span>
                    </span>
                    <a-input
                      class="input"
                      type="text"
                      size="large"
                      :maxLength="10"
                      v-model="form.custId"
                      allow-clear
                      placeholder="請輸入"
                    />
                  </a-form-model-item>
                </a-col>
                <!-- 客戶姓名 -->
                <a-col :span="12">
                  <a-form-model-item prop="custName">
                    <span slot="label">
                      客戶姓名
                      <span class="mark-required">*</span>
                    </span>
                    <a-input
                      class="input"
                      type="text"
                      size="large"
                      :maxLength="100"
                      v-model="form.custName"
                      allow-clear
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
                      :disabled="form.operType == 'CL' ? false : true"
                      v-model="form.applId"
                      placeholder="請輸入"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <!-- 要保人姓名 -->
                <a-col :lg="12" :xxl="12">
                  <a-form-model-item prop="applName" label="要保人姓名">
                    <a-input
                      :allowClear="true"
                      class="input"
                      type="text"
                      size="large"
                      :disabled="form.operType == 'CL' ? false : true"
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
            <a-col :xs="24" :md="24" :lg="24" :xxl="18">
              <review-fields
                ref="reviewFields"
                :isRequired="[false, false, false]"
                :isDisabled="[true, true, true]"
                :xsSpan="24"
                :mdSpan="12"
                :lgSpan="8"
                :xxlSpan="8"
                @submitData="getReviewData"
              ></review-fields>
            </a-col>
          </a-row>
          <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
            <a-col :xs="24" :md="24" :lg="24" :xxl="24">
              <a-form-model-item prop="memoDese">
                <span slot="label">
                  AML審查原因
                  <span class="mark-required">*</span>
                </span>
                <a-input
                  class="input"
                  type="text"
                  size="large"
                  v-model="form.memoDese"
                  :maxLength="100"
                  allow-clear
                  placeholder="請輸入"
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div align="center">
            <a-popconfirm
              title="請確定要新增資料嗎？"
              ok-text="確定"
              cancel-text="取消"
              ok-type="green"
              icon=" "
              overlayClassName="customPopconfirm"
              @confirm="() => onSubmit()"
            >
              <a-button
                class="button btn--primary btn__layout--green searchButton"
              >
                新增
              </a-button>
            </a-popconfirm>
          </div>
        </a-form-model>
      </div>
    </div>
  </div>
</template>
<script lang="tsx">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import moment from "moment";
import ReviewFields from "@/components/shared/ReviewFields.vue";
import { Modal } from "ant-design-vue";
import {
  QryOptionsDto,
  AddAmlSelectOptsVO,
  AddAmlRequestDto,
} from "@fubonlife/edd-api-axios-sdk";

@Component({ components: { FblDataGrid, ReviewFields } })
export default class AddPage extends Vue {
  rptDate: Date = null;
  cont = {
    contDp: "",
    contUt: "",
    contId: "",
  };
  // 宣告下拉選項
  private operTypeOpts: Array<QryOptionsDto> = []; // 作業別選單
  private renewOpts: Array<QryOptionsDto> = []; // 來源選單
  private custTypeOpts: Array<QryOptionsDto> = []; // 案件類型
  private roleTypeOpts: Array<QryOptionsDto> = []; // 保單角色
  private sysTypeOpts: Array<QryOptionsDto> = []; // 系統別
  private dpOpts: Array<QryOptionsDto> = []; // 審查部門清單
  private utOpts: Array<QryOptionsDto> = []; // 審查科別清單
  private domainIdOpts: Array<QryOptionsDto> = []; // 審查(覆核)人員清單

  h = this.$createElement;

  @Action public setLoading: (payload: boolean) => void;

  inumber = {
    inumberFront: "",
    inumberMiddle: "",
    inumberBack: "",
    inumberAll: "",
  };
  formatter = this.$twDateFormatter;
  form: AddAmlRequestDto = {
    operType: undefined, // 作業別
    renew: undefined, // 來源
    rptDate: null, // 產生日期 預設今日
    custType: undefined, // 案件類型
    caseNo: undefined, // 交易案號
    roleId: undefined, // 保單角色
    sysType: undefined, // 系統別
    policyNo: "", // 保單號碼
    policySeq: null, // 保單序號
    idDup: "", // 重複碼
    custId: undefined, // 客戶ID
    custName: undefined, // 客戶姓名
    applId: "", // 要保人ID
    applName: "", // 要保人姓名
    memoDese: undefined, // 審查原因
  };

  rules = {
    operType: [
      {
        required: true,
        message: "請選擇作業別",
        trigger: "change",
      },
    ],
    renew: [
      {
        required: true,
        message: "請選擇來源",
        trigger: "change",
      },
    ],
    custType: [
      {
        required: true,
        message: "請選擇案件類型",
        trigger: "change",
      },
    ],
    caseNo: [
      { required: true, message: "請輸入交易案號", trigger: "change" },
      {
        pattern: /^[A-Za-z0-9]*$/,
        message: "請輸入半形英文或數字",
        trigger: "change",
      },
    ],
    roleId: [
      {
        required: true,
        message: "請選擇保單角色",
        trigger: "change",
      },
    ],
    sysType: [
      {
        required: true,
        message: "請選擇系統別",
        trigger: "change",
      },
    ],
    policyNo: [
      {
        trigger: "change",
        validator: this.policyNoRule,
      },
    ],
    policySeq: [
      {
        trigger: "change",
        validator: this.policySeqRule,
      },
    ],
    idDup: [
      {
        trigger: "change",
        validator: this.idDupRule,
      },
    ],
    custId: [
      { required: true, message: "請輸入客戶ID", trigger: "change" },
      {
        pattern: /^(?:[a-zA-Z]|@|\d)*$/,
        message: "請輸入半形英文、@或數字",
        trigger: "change",
      },
    ],
    custName: [
      { required: true, message: "請輸入客戶姓名", trigger: "change" },
      { validator: this.custNameRule, trigger: "change" },
    ],
    applId: [
      {
        required: false,
        trigger: "change",
        validator: this.custNameRule,
      },
    ],
    applName: [
      {
        required: false,
        trigger: "change",
        validator: this.custNameRule,
      },
    ],
    memoDese: [
      { required: true, message: "請輸入AML審查原因", trigger: "change" },
    ],
  };

  inumberErrorMes = null; // 保單號碼錯誤提示字
  insuranceIDErrorMes = null; // 保單ID錯誤提示字
  gidErrorMes = null; // 重複碼錯誤提示字
  policyNoRule(rule, value, callback) {
    const vm = this;
    const rgx = /^(?:[a-zA-Z]|@|\d)*$/;
    if (value == "") {
      vm.inumberErrorMes = "請輸入保單號碼";
      callback("");
    } else if (this.fullWidthAcd(value) || rgx.test(value) == false) {
      vm.inumberErrorMes = "請輸入半形英文、@或數字";
      callback("");
    } else {
      vm.inumberErrorMes = null;
      callback();
    }
  }
  policySeqRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]+$/;
    if (value != null && value !== "" && rgx.test(value) == false) {
      vm.insuranceIDErrorMes = "請輸入半形數字";
      callback("");
    } else {
      vm.insuranceIDErrorMes = null;
      callback();
    }
  }
  idDupRule(rule, value, callback) {
    const vm = this;
    const rgx = /^[0-9]+$/;
    if (value !== "" && rgx.test(value) == false) {
      vm.gidErrorMes = " 請輸入半形數字";
      callback("");
    } else {
      vm.gidErrorMes = null;
      callback();
    }
  }
  custNameRule(rule, value, callback) {
    if (this.fullWidthAcd(value)) {
      callback(new Error("請輸入中文、半形英文、符號或數字"));
    } else {
      callback();
    }
  }

  /**
   * Func
   */
  formReset() {
    this.form = {
      operType: undefined, // 作業別
      renew: undefined, // 來源
      rptDate: null, // 產生日期 預設今日
      custType: undefined, // 案件類型
      caseNo: undefined, // 交易案號
      roleId: undefined, // 保單角色
      sysType: undefined, // 系統別
      policyNo: "", // 保單號碼
      policySeq: null, // 保單序號
      idDup: "", // 重複碼
      custId: undefined, // 客戶ID
      custName: undefined, // 客戶姓名
      applId: "", // 要保人ID
      applName: "", // 要保人姓名
      memoDese: undefined, // 審查原因
    };

    //------------ 預設 ---------------
    // 作業別: 預設第一筆
    this.form.operType = this.operTypeOpts[0].key;
    // 來源: 預設 N交易件
    this.form.renew = "N";
    // 產生日期 預設 今日
    this.rptDate = new Date();
    // 案件類型 預設第一筆
    this.form.custType = this.custTypeOpts[0].key;

    // TEST:
    // this.form.caseNo = 'A134567';
    // this.form.roleId = '1';
    // this.form.sysType = 'F';

    // this.form.policyNo = '123456';
    // this.form.policySeq = 12;

    // this.form.custId = 'test1';
    // this.form.custName = 'test1';

    // this.form.memoDese = 'testmemo';
  }
  // API Func
  async getSelectOpts() {
    this.setLoading(true);
    const me = this.$user.getMe().employee;
    await this.$addAmlApi
      .getSelectOptsInAddAmlUsingPOST({
        bossDepId: me.bossDepId,
        depId: me.depId,
      })
      .then((resp) => {
        if (resp.data.success === true) {
          const getData = resp.data.data;
          // console.log(getData)
          // 代入下拉資料
          this.operTypeOpts = getData.operTypeOpts;
          this.renewOpts = getData.renewOpts;
          this.custTypeOpts = getData.custTypeOpts;
          this.sysTypeOpts = getData.sysTypeOpts;
          this.roleTypeOpts = getData.roleTypeOpts;
        }
      })
      .finally(() => {
        this.setLoading(false);
      });
    // 初始化
    this.formReset();
  }

  getSubmitData(data) {
    let submit = { ...data, ...this.cont };
    // 處理保單序號
    submit.policySeq = Number(submit.policySeq);

    // 空值的資料 不需要送參
    // Object.keys(submit).map((item) => {
    //   switch(true){
    //     case submit[item] == '':
    //     case submit[item] == null:
    //     case submit[item].length <= 0:
    //       delete submit[item];
    //     break;
    //   }
    // });
    return submit;
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
    this.cont.contDp = value.form.contDp;
    this.cont.contUt = value.form.contUt;
    this.cont.contId = value.form.contId;
  }
  // 新增
  onSubmit() {
    const vm = this;
    const result = false;
    let submit = this.getSubmitData(this.form);
    // 驗證form-rule
    (this.$refs.ruleForm as any)
      .validate()
      .then((valid) => {
        this.setLoading(true);
        this.$addAmlApi
          .addAmlGetAddAmlStatusInAddAmlUsingPOST(submit)
          .then((resp) => {
            // console.log(resp);
            if (resp.data.success == true) {
              if (resp.data.data.status != "error") {
                Modal.success({
                  okType: "green",
                  okText: "確定",
                  icon: "''",
                  centered: true,
                  content: this.h("div", { attrs: { class: "wrap" } }, [
                    this.h("a-icon", {
                      props: {
                        type: "check-circle",
                        theme: "filled",
                      },
                      attrs: {
                        class: "wrap__icon-success",
                      },
                    }),
                    this.h(
                      "div",
                      { attrs: { class: "wrap__text" } },
                      "新增成功"
                    ),
                    this.h("i", { attrs: { class: "wrap__img-success" } }),
                  ]),
                });
                this.formReset();
              } else {
                Modal.error({
                  okType: "green",
                  okText: "確定",
                  icon: "''",
                  centered: true,
                  content: this.h("div", {}, [
                    this.h("div", { attrs: { class: "wrap" } }, [
                      this.h("a-icon", {
                        props: {
                          type: "close-circle",
                          theme: "filled",
                        },
                        attrs: {
                          class: "wrap__icon-fail",
                        },
                      }),
                      this.h(
                        "div",
                        { attrs: { class: "wrap__text" } },
                        "新增失敗"
                      ),
                      this.h("i", { attrs: { class: "wrap__img-fail" } }),
                    ]),
                    this.h(
                      "ul",
                      { attrs: { class: "msgGroup list-with-border" } },
                      [this.h("li", {}, resp.data.data.statusDesc)]
                    ),
                  ]),
                });
              }
            } else {
              Modal.error({
                okType: "green",
                okText: "確定",
                icon: "''",
                centered: true,
                content: this.h("div", { attrs: { class: "wrap" } }, [
                  this.h("a-icon", {
                    props: {
                      type: "close-circle",
                      theme: "filled",
                    },
                    attrs: {
                      class: "wrap__icon-fail",
                    },
                  }),
                  this.h("div", { attrs: { class: "wrap__text" } }, "新增失敗"),
                  this.h("i", { attrs: { class: "wrap__img-fail" } }),
                ]),
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.setLoading(false);
          });

        //TODO:
        // API:系統別與保單號碼查詢AS400檢核是否存在?
        // 暫設定保單號碼為011為不存在，訊息:「請確認保單號碼是否正確?」
        // 暫設定交易案號為022為不存在，訊息:「請確認交易案號是否正確?」
        // if (vm.form.inumber == "011") {
        //   this.$notification.error({
        //     message: "新增失敗",
        //     description: "請確認保單號碼是否正確?",
        //     duration: 2,
        //   });
        // } else if (vm.form.cnumber == "022") {
        //   this.$notification.error({
        //     message: "新增失敗",
        //     description: "請確認交易案號是否正確?",
        //     duration: 2,
        //   });
        // } else {
        //   this.$notification.success({
        //     message: "新增成功",
        //     description: "已新增一筆AML審查件至「新增AML審查待審核資料夾」",
        //     duration: 2,
        //   });
        //   this.formReset(); //重置表單資料

        // let updatedMsg:string[] = ['保單號碼輸入錯誤，無此保單號碼。',
        //               '交易案號輸入錯誤。', 'AML審查原因，超過字數限制(100字)。']
        // Modal.error({
        //   title: this.h('p', {
        //     attrs: { style: 'font-size: 20px'}
        //   }, '無法新增'),
        //   okType: 'green',
        //   okText: '確定',
        //   content: this.h('ul', {
        //     attrs: { class: 'list-with-border'}
        //   }, updatedMsg.map(x => this.h('li', x))) ,
        //   icon: ()=>this.h('a-icon',{
        //     props: {
        //       type: 'close-circle',
        //       theme: 'filled'
        //     },
        //     style: {fontSize: '30px'}
        //   })
        // });
      })
      .catch((valid) => {
        // const enumErrorWording = {
        //   'operType': '作業別',
        //   'renew': '來源',
        //   'custType': '案件類型',
        //   'caseNo': '交易案號',
        //   'roleId': '保單角色',
        //   'sysType': '系統別',
        //   'policyNo': '保單號碼',
        //   'policySeq': '保單序號',
        //   'custId': '客戶ID',
        //   'custName': '客戶姓名',
        //   'memoDese': 'AML審查原因'
        // }
        // const errorItem = Object.keys(submit).filter(item => {
        //   if(Object.keys(enumErrorWording).includes(item)) {
        //     if(submit[item] == '' || submit[item] == undefined || submit[item] == null) {
        //       return enumErrorWording[item];
        //     }
        //   }
        // })
        // const errorString = errorItem.map(item => `【${enumErrorWording[item]}】`).join('、');
        // Modal.error({
        //   title: `提醒`,
        //   okType: 'green',
        //   okText: "確定",
        //   icon: () =>
        //     this.h("a-icon", {
        //       props: {
        //         type: "close-circle",
        //         theme: "filled",
        //       },
        //     }),
        //   content: `${errorString} 未填寫，請確認!`,
        //   onOk: () => {},
        // });
      });
  }

  /**
   * Hook
   */
  created() {
    this.getSelectOpts();
  }

  /**
   * 監聽
   */
  @Watch("rptDate", { immediate: true })
  watchRptDate(newVal) {
    this.form.rptDate = moment(newVal).format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
  }
}
</script>

<style scoped>
.title {
  font-size: 18px;
  color: #227fa8;
}
.mb-vaild {
  margin-bottom: 22px;
}
.message--error {
  color: #f5222d;
  margin-top: -16px;
}
</style>
