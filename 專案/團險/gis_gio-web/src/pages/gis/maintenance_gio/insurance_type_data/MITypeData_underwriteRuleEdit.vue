<template>
  <div class="miTypeDataUnderwriteRuleEdit">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        核保規則修改
      </h2>
    </div>
    <div class="main-HeaderInfo d-flex">
      <div class="info__item locker__item">
        <p class="info__item__title">
          險種代號
        </p>
        <p class="info__item__sub">
          {{ form.item }}
        </p>
      </div>
      <div class="info__item">
        <p class="info__item__title">
          屬性
        </p>
        <p class="info__item__sub">
          {{ getAttrName }}
        </p>
      </div>
    </div>
    <div class="main-EditGroup">
      <div class="main-EditGroup__header">
        <div class="main-Edit__leftBlock locker__block">
          檢核項目
        </div>
        <div class="main-Edit__middleBlock">
          檢核值
        </div>
        <div class="main-Edit__rightBlock">
          信息種類
        </div>
      </div>
      <div class="main-EditGroup__body">
        <a-form-model
          ref="miTypeDataUnderwriteRuleEditForm"
          :form="form"
          :model="form"
          :rules="rules"
        >
          <div
            v-for="(group_item, group_index) in mainEditGroupObject"
            :key="group_index"
            class="main-Edit__section"
          >
            <div class="main-Edit__titleWrap">
              <div class="main-Edit__title locker__block">
                {{ group_item.title }}
              </div>
            </div>
            <div
              v-for="(question_item, question_index) in group_item.question"
              :key="question_index"
              class="main-Edit__item"
            >
              <div class="main-Edit__item-title main-Edit__leftBlock">
                {{ question_item.q_title }}
              </div>
              <div class="main-Edit__item-formControl main-Edit__middleBlock">
                <a-form-model-item :prop="question_item.infoTypeKey" :validate-status="chooseOneMessage[question_item.chooseOne] ? 'error': ''">
                  <a-radio-group
                    v-if="question_item.validatorType === 'radio'"
                    v-model="form[question_item.infoTypeKey]"
                    :disabled="question_item.disabled"
                  >
                    <a-radio value="Y">
                      可
                    </a-radio>
                    <a-radio value="N">
                      否
                    </a-radio>
                  </a-radio-group>

                  <a-input
                    v-if="question_item.validatorType === 'input'"
                    v-model="form[question_item.infoTypeKey]"
                    :disabled="question_item.disabled"
                  />
                </a-form-model-item>
                <p v-if="chooseOneMessage[question_item.chooseOne]" class="message--error">
                  {{ chooseOneMessage[question_item.chooseOne] }}
                </p>
              </div>
              <div class="main-Edit__item-formType main-Edit__rightBlock">
                <a-select v-if="question_item.validatorKey" v-model="form[question_item.validatorKey]" @change="onChangeValidator">
                  <a-select-option
                    v-for="item in $enum.insurableInfoType"
                    :key="item.key"
                    :value="item.key"
                  >
                    {{ item.val }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>
        </a-form-model>
      </div>
    </div>
    <div class="confirm__button-group card-confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.go(-1)"
      >
        上一步
      </button>
      <button
        class="confirm__button confirm__button-submit"
        @click="onSubmit()"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { GiItemCheck } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';

@Component({
  components: { LayoutLoading },
})
export default class MaintenanceInsuranceTypeDataUnderwriteRuleEdit extends Vue {
  h = this.$createElement;

  formChanged = false;

  pageLoading = false;

  // 快取
  queryData = {
    attr: '',
    item: '',
    prodLine: '',
  }

  // 題目
  mainEditGroupObject: {
    title: string;
    question: {
      q_id?: string;
      q_title: string;
      validatorType: string;
      validatorKey?: string;
      disabled: boolean;
      infoTypeKey?: string;
      checkVal?: string;
      chooseOne?: string;
    }[];
  }[] = [
    {
      title: '基本限制項目',
      question: [
        {
          q_title: '是否可不加保',
          validatorType: 'radio',
          infoTypeKey: 'unAdd',
          validatorKey: 'unAddCheck',
          disabled: false,
        },
        {
          q_title: '員工不保，眷屬是否可加保',
          validatorType: 'radio',
          infoTypeKey: 'famAddOnly',
          validatorKey: 'famAddCheck',
          disabled: false,
        },
        {
          q_title: '年齡下限',
          validatorType: 'input',
          infoTypeKey: 'minAge',
          validatorKey: 'ageCheck',
          disabled: false,
        },
        {
          q_title: '年齡上限',
          validatorType: 'input',
          infoTypeKey: 'maxAge',
          disabled: false,
        },
        {
          q_title: '員眷保額比例',
          validatorType: 'input',
          infoTypeKey: 'famRate',
          validatorKey: 'famRateCheck',
          disabled: false,
        },
        {
          q_title: '不共存之險種代號1',
          validatorType: 'input',
          infoTypeKey: 'exclItem1',
          validatorKey: 'exclItemCheck',
          disabled: false,
          chooseOne: 'exclItemCheck',
        },
        {
          q_title: '不共存之險種代號2',
          validatorType: 'input',
          infoTypeKey: 'exclItem2',
          disabled: false,
          chooseOne: 'exclItemCheck',
        },
        {
          q_title: '不共存之險種代號3',
          validatorType: 'input',
          infoTypeKey: 'exclItem3',
          disabled: false,
          chooseOne: 'exclItemCheck',
        },
        {
          q_title: '不共存之險種代號4',
          validatorType: 'input',
          infoTypeKey: 'exclItem4',
          disabled: false,
          chooseOne: 'exclItemCheck',
        },
        {
          q_title: '不共存之險種代號5',
          validatorType: 'input',
          infoTypeKey: 'exclItem5',
          disabled: false,
          chooseOne: 'exclItemCheck',
        },
        {
          q_title: '限制險種代號',
          validatorType: 'input',
          infoTypeKey: 'coItem',
          validatorKey: 'coItemCheck',
          disabled: false,
        },
        {
          q_title: '限制險種代號之比例',
          validatorType: 'input',
          infoTypeKey: 'coItemRate',
          validatorKey: null,
          disabled: false,
        },
      ],
    },
    {
      title: '高齡限制項目',
      question: [
        {
          q_title: '高齡限額之起始年齡',
          validatorType: 'input',
          infoTypeKey: 'advAgeStart',
          validatorKey: 'advAgeCheck',
          disabled: false,
          chooseOne: 'advAgeCheck',
        },
        {
          q_title: '高齡限額之保額上限',
          validatorType: 'input',
          infoTypeKey: 'advAgeMaxSa',
          validatorKey: undefined,
          disabled: false,
          chooseOne: 'advAgeCheck',
        },
        {
          q_title: '高齡限額之合併計算之險種',
          validatorType: 'input',
          infoTypeKey: 'advAgeCoItem',
          validatorKey: undefined,
          disabled: false,
          chooseOne: 'advAgeCheck',
        },
        {
          q_title: '高齡限額之合併計算之保額上限',
          validatorType: 'input',
          infoTypeKey: 'advAgeCoItemSa',
          validatorKey: undefined,
          disabled: false,
          chooseOne: 'advAgeCheck',
        },
      ],
    },
    {
      title: '健康告知事項',
      question: [
        {
          q_title: '健康聲明書之起始保額',
          validatorType: 'input',
          infoTypeKey: 'hlNtcSa',
          validatorKey: 'hlNtcCheck',
          disabled: false,
          chooseOne: 'hlNtcCheck',
        },
        {
          q_title: '健康聲明書之起始年齡',
          validatorType: 'input',
          infoTypeKey: 'hlNtcAge',
          validatorKey: undefined,
          disabled: false,
          chooseOne: 'hlNtcCheck',
        },
        {
          q_title: '健康聲明書之合併計算之險種',
          validatorType: 'input',
          infoTypeKey: 'hlNtcCoItem',
          validatorKey: undefined,
          disabled: false,
          chooseOne: 'hlNtcCheck',
        },
        {
          q_title: '健康聲明書之合併計算之保額上限',
          validatorType: 'input',
          infoTypeKey: 'hlNtcCoItemSa',
          validatorKey: undefined,
          disabled: false,
          chooseOne: 'hlNtcCheck',
        },
      ],
    },
    {
      title: '失能告知事項',
      question: [
        {
          q_title: '失能告知書之起始年齡',
          validatorType: 'input',
          infoTypeKey: 'disNtcAge',
          validatorKey: 'disNtcCheck',
          disabled: false,
          chooseOne: 'disNtcCheck',
        },
        {
          q_title: '失能告知書之起始保額',
          validatorType: 'input',
          infoTypeKey: 'disNtcSa',
          validatorKey: undefined,
          disabled: false,
          chooseOne: 'disNtcCheck',
        },
        {
          q_title: '失能告知合併計算險種',
          validatorType: 'input',
          infoTypeKey: 'disNtcCoItem',
          validatorKey: undefined,
          disabled: false,
        },
        {
          q_title: '失能告知書之合併計算之險種',
          validatorType: 'input',
          infoTypeKey: 'disNtcCoItemSa',
          validatorKey: undefined,
          disabled: false,
        },
      ],
    },
    {
      title: '其他',
      question: [
        {
          q_title: '喪葬津貼同意書之最高年齡',
          validatorType: 'input',
          infoTypeKey: 'burNtcAge',
          validatorKey: 'burNtcAgeCheck',
          disabled: false,
        },
        {
          q_title: 'HIV檢驗報告',
          validatorType: 'input',
          infoTypeKey: 'hivRpt',
          validatorKey: 'hivRptCheck',
          disabled: false,
        },
      ],
    },
  ];

  form: GiItemCheck = {
    item: null,
    prodLine: null,
    insAttr: null,
    unAddCheck: null,
    unAdd: null,
    famAddCheck: null,
    famAddOnly: null,
    ageCheck: null,
    maxAge: null,
    minAge: null,
    famRateCheck: null,
    famRate: null,
    exclItemCheck: null,
    exclItem1: null,
    exclItem2: null,
    exclItem3: null,
    exclItem4: null,
    exclItem5: null,
    coItemCheck: null,
    coItem: null,
    coItemRate: null,
    advAgeCheck: null,
    advAgeStart: null,
    advAgeMaxSa: null,
    advAgeCoItem: null,
    advAgeCoItemSa: null,
    hlNtcCheck: null,
    hlNtcSa: null,
    hlNtcAge: null,
    hlNtcCoItem: null,
    hlNtcCoItemSa: null,
    disNtcCheck: null,
    disNtcAge: null,
    disNtcSa: null,
    disNtcCoItem: null,
    disNtcCoItemSa: null,
    burNtcAgeCheck: null,
    burNtcAge: null,
    hivRptCheck: null,
    hivRpt: null,
  };

  rules: { [key: string]: ValidationRule[] } = {
    unAdd: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
    ],
    famAddOnly: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
    ],
    maxAge: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
      {
        trigger: 'change',
        message: '最大不能超過100',
        validator: (rule, value) => Number(value) <= 100,
      },
    ],
    minAge: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
      {
        trigger: 'change',
        message: '最大不能超過100',
        validator: (rule, value) => Number(value) <= 100,
      },
    ],
    famRate: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
      {
        trigger: 'change',
        message: '最大不能超過100',
        validator: (rule, value) => Number(value) <= 100,
      },
    ],
    exclItem1: [],
    exclItem2: [],
    exclItem3: [],
    exclItem4: [],
    exclItem5: [],
    coItem: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
    ],
    coItemRate: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
      {
        trigger: 'change',
        message: '最大不能超過100',
        validator: (rule, value) => Number(value) <= 100,
      },
    ],
    advAgeStart: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    advAgeMaxSa: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    advAgeCoItem: [],
    advAgeCoItemSa: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    hlNtcSa: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    hlNtcAge: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    hlNtcCoItem: [],
    hlNtcCoItemSa: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    disNtcAge: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    disNtcSa: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    disNtcCoItem: [],
    disNtcCoItemSa: [
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    burNtcAge: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
      {
        trigger: 'change',
        pattern: new RegExp('^[0-9]+$'),
        message: '請輸入有效數字',
      },
    ],
    hivRpt: [
      {
        required: true,
        trigger: 'change',
        message: '必填欄位',
      },
    ],
  };

  // 檢核信息，影響檢核值範圍
  validatorObject = {
    unAddCheck: ['unAdd'],
    famAddCheck: ['famAddOnly'],
    ageCheck: ['maxAge', 'minAge'],
    famRateCheck: ['famRate'],
    exclItemCheck: ['exclItem1', 'exclItem2', 'exclItem3', 'exclItem4', 'exclItem5'],
    coItemCheck: ['coItem'],
    advAgeCheck: ['advAgeStart', 'advAgeMaxSa', 'advAgeCoItem', 'advAgeCoItemSa'],
    hlNtcCheck: ['hlNtcSa', 'hlNtcAge', 'hlNtcCoItem', 'hlNtcCoItemSa'],
    disNtcCheck: ['disNtcAge', 'disNtcSa'],
    burNtcAgeCheck: ['burNtcAge'],
    hivRptCheck: ['hivRpt'],
  }

  // disabled影響範圍
  disabledObject = {
    unAddCheck: ['unAdd'],
    famAddCheck: ['famAddOnly'],
    ageCheck: ['maxAge', 'minAge'],
    famRateCheck: ['famRate'],
    exclItemCheck: ['exclItem1', 'exclItem2', 'exclItem3', 'exclItem4', 'exclItem5'],
    coItemCheck: ['coItem', 'coItemRate'],
    advAgeCheck: ['advAgeStart', 'advAgeMaxSa', 'advAgeCoItem', 'advAgeCoItemSa'],
    hlNtcCheck: ['hlNtcSa', 'hlNtcAge', 'hlNtcCoItem', 'hlNtcCoItemSa'],
    disNtcCheck: ['disNtcAge', 'disNtcSa', 'disNtcCoItem', 'disNtcCoItemSa'],
    burNtcAgeCheck: ['burNtcAge'],
    hivRptCheck: ['hivRpt'],
  }

  // 請擇一填寫 errorMessage
  chooseOneMessage = {
    exclItemCheck: null,
    advAgeCheck: null,
    hlNtcCheck: null,
    disNtcCheck: null,
  }

  /**
   * Func
   */
  // 取得 Query 並帶入資料
  setEditParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.queryData = $query;
    }
  }

  async getGioCheckData() {
    await this.$gioInsuranceApi
    .insCheckUpdatePageUsingPOST(this.queryData)
    .then((resp) => {
      if (resp.data.status == 200) {
        const getData = resp.data.data;
        // TEST:
        // console.log(getData);
        this.form.item = getData.item;
        this.form.prodLine = getData.prodLine;
        this.form.insAttr = (getData.insAttr) ? getData.insAttr.id : null;
        this.form.unAdd = (getData.unAdd) ? getData.unAdd : null;
        this.form.unAddCheck = (getData.unAddCheck) ? getData.unAddCheck.id : null;

        this.form.famAddOnly = (getData.famAddOnly) ? getData.famAddOnly : null;
        this.form.famAddCheck = (getData.famAddCheck) ? getData.famAddCheck.id : null;

        this.form.minAge = getData.minAge;
        this.form.ageCheck = (getData.ageCheck) ? getData.ageCheck.id : null;
        this.form.maxAge = getData.maxAge;

        this.form.famRate = Number(getData.famRate);
        this.form.famRateCheck = (getData.famRateCheck) ? getData.famRateCheck.id : null;

        this.form.exclItem1 = getData.exclItem1;
        this.form.exclItem2 = getData.exclItem2;
        this.form.exclItem3 = getData.exclItem3;
        this.form.exclItem4 = getData.exclItem4;
        this.form.exclItem5 = getData.exclItem5;
        this.form.exclItemCheck = (getData.exclItemCheck) ? getData.exclItemCheck.id : null;

        this.form.coItem = getData.coItem;
        this.form.coItemCheck = (getData.coItemCheck) ? getData.coItemCheck.id : null;
        this.form.coItemRate = getData.coItemRate;

        this.form.advAgeStart = getData.advAgeStart;
        this.form.advAgeCheck = (getData.advAgeCheck) ? getData.advAgeCheck.id : null;

        this.form.advAgeMaxSa = getData.advAgeMaxSa;
        this.form.advAgeCoItem = getData.advAgeCoItem;
        this.form.advAgeCoItemSa = getData.advAgeCoItemSa;

        this.form.hlNtcSa = getData.hlNtcSa;
        this.form.hlNtcCheck = (getData.hlNtcCheck) ? getData.hlNtcCheck.id : null;
        this.form.hlNtcAge = getData.hlNtcAge;
        this.form.hlNtcCoItem = getData.hlNtcCoItem;
        this.form.hlNtcCoItemSa = getData.hlNtcCoItemSa;

        this.form.disNtcAge = getData.disNtcAge;
        this.form.disNtcCheck = (getData.disNtcCheck) ? getData.disNtcCheck.id : null;
        this.form.disNtcSa = getData.disNtcSa;
        this.form.disNtcCoItem = getData.disNtcCoItem;
        this.form.disNtcCoItemSa = getData.disNtcCoItemSa;

        this.form.burNtcAge = getData.burNtcAge;
        this.form.burNtcAgeCheck = (getData.burNtcAgeCheck) ? getData.burNtcAgeCheck.id : null;

        this.form.hivRpt = getData.hivRpt;
        this.form.hivRptCheck = (getData.hivRptCheck) ? getData.hivRptCheck.id : null;
      } else {
        const errorMsg = [];
        Object.values(resp.data.apiError).map((i) => {
          (i as any).map((j) => {
            errorMsg.push(j);
          });
        });
        Modal.error({
          title: this.h('div', {}, '錯誤訊息'),
          content: this.h('ul', {
            attrs: { class: 'list-with-border' },
          }, errorMsg.map((x) => this.h('li', x))),
          okType: 'confrim',
          okText: '確定',
          icon: () =>
            this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
        });
      }
    })
    .catch((error) => {
      console.log('error = ', error);
    })
    .finally(() => {
      this.pageLoading = false;
    });
  }

  get getAttrName() {
    if (this.form.insAttr) {
      return this.$enum.getVal('insurableAttrOptions', this.form.insAttr);
    }
      return false;
  }

  changeValidatorFunc() {
    // 找出所有 Check 關鍵字
    const checkItemArr = Object.keys(this.form).filter((i) => /Check$/.test(i));
    checkItemArr.map((i) => {
      // 設定檢核
      this.validatorObject[i].map((j) => {
        // 查找 Check 項目 對應的 檢核欄位
        Object.values(this.mainEditGroupObject).map((k) => {
          k.question.map((l) => {
            if (l.infoTypeKey === j && this.rules[j].find((i) => Object.keys(i).includes('required'))) {
              if (this.form[i] == '1' || this.form[i] == '2') {
                // 將擇一填寫的選項 必填取消
                if (Object.keys(this.chooseOneMessage).includes(i)) {
                  this.rules[j].find((i) => Object.keys(i).includes('required')).required = false;
                } else {
                  this.rules[j].find((i) => Object.keys(i).includes('required')).required = true;
                }
              } else {
                this.rules[j].find((i) => Object.keys(i).includes('required')).required = false;
              }
            }
          });
        });
      });

      // 設定disabled
      this.disabledObject[i].map((j) => {
        // 查找 Check 項目 對應的 檢核欄位
        Object.values(this.mainEditGroupObject).map((k) => {
          // 設定檢核
          k.question.map((l) => {
            if (l.infoTypeKey === j) {
              if (this.form[i] == '1' || this.form[i] == '2') {
                l.disabled = false;
              } else {
                l.disabled = true;
              }
            }
          });
        });
      });
    });
  }

  /**
   * Event
   */
  // onHandleAddComdify(event, obj) {
  //   if (event.target.value) {
  //     const formatVal = this.$global.delComdify(event.target.value);
  //     this.form[obj] = this.$global.autoAddComdify(formatVal);
  //   }
  // }

  // 確定修改
  onSubmit() {
    // 處理擇一欄位
    Object.keys(this.chooseOneMessage).map((i) => {
      // 是否需要檢核
      if (this.form[i] == '1' || this.form[i] == '2') {
        // 查找 Check 項目 對應的 檢核欄位 是否都是空
        if (this.validatorObject[i].every((j) => !this.form[j])) {
          this.chooseOneMessage[i] = '請擇一填寫。';
        }
      }
    });
    (this as any).$validateForm('miTypeDataUnderwriteRuleEditForm')
    .then((res) => {
      // 擇一欄位 有 error
      if (Object.keys(this.chooseOneMessage).some((i) => this.chooseOneMessage[i])) {
        throw new Error();
      }
      // API: 修改險種資料
      this.pageLoading = true;
      this.$gioInsuranceApi
        .insCheckUpdateUsingPOST(this.form)
        .then((resp) => {
          // TEST:
          // console.log(resp);
          if (resp.data.status == 200) {
            this.$router.push({ name: 'MaintenanceInsuranceTypeDataPlan', params: { underwriteType: 'rule' } }).then(() => {
              this.$infoNotification.success({
                Content: '已完成修改',
              });
            });
          } else {
            // 查找失敗訊息
            this.$infoNotification.error({
              Content: '無法完成修改項目，請再次嘗試。',
              apiError: resp.data.apiError,
            });
          }
        })
        .catch((error) => {
        // API失敗
          console.log(error.response);
        })
        .finally(() => {
          this.pageLoading = false;
        });
    })
    .catch((error) => {
      // 驗證失敗 要捲到 輸入框
      const getErrorEle = this.$el.querySelector('.has-error');
      if (getErrorEle) {
        // 新語法試用 scrollIntoView
        getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
      }
    });
  }

  onChangeValidator() {
    this.changeValidatorFunc();
    if ((this.$refs as any).miTypeDataUnderwriteRuleEditForm) {
      const old = JSON.parse(JSON.stringify(this.form));
      (this.$refs as any).miTypeDataUnderwriteRuleEditForm.resetFields();
      this.form = Object.assign(this.form, old);
    }
  }

  /**
   * Hooks
   */
  async created() {
    this.setEditParam();
    await this.getGioCheckData();
    this.changeValidatorFunc();
  }

  /**
   * 監聽
   */
  @Watch('form', { deep: true })
  watchForm(newVal) {
    // 擇一填寫的選項 error 歸零
    Object.keys(this.chooseOneMessage).map((i) => {
      this.validatorObject[i].map((j) => {
        if (this.form[i]) {
          this.chooseOneMessage[i] = null;
        }
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.main-header {
  margin-bottom: 20px;
}
.main-Edit__item {
  align-items: flex-start;
}
.ant-select {
  width: 95px;
}
.ant-select-selection {
  border-radius: 4px;
}
.ant-radio-wrapper,
.ant-checkbox-wrapper {
  margin-right: 10px;
}
::v-deep {
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-radio-wrapper {
    > span {
      &:not(.ant-radio) {
        min-width: auto;
      }
    }
  }
  .ant-form-item-children {
    display: block;
    line-height: 1;
  }
}
.confirm__button-group {
  margin-bottom: 20px;
}

</style>
