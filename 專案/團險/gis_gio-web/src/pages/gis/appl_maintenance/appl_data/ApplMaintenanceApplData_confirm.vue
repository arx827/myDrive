<template>
  <div class="businessAddAndEdit">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        保單資料
      </h2>
      <div class="header-control__wrap ms-auto">
        <button class="card-header-btn text-btn btn__bg--primary" @click="toApplMaintenanceInsuranceTypeResult">
          險種檢核/計劃別維護
        </button>
        <button class="card-header-btn text-btn btn__bg--primary" @click="toApplMaintenanceApplDataResult">
          變更資料
        </button>
      </div>
    </div>

    <div class="formContent container-fluid">
      <a-form-model
        ref="businessAddAndEditForm"
        class="gioFormGroup formW720 inputStyle"
        :form="form"
        :model="form"
        :colon="false"
        :hideRequiredMark="true"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item label="保單號碼" class="inputStyle">
          <p>
            <!-- 1111111-000 -->
            {{ form.policyNo }}-{{ form.policySeq }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="統一編號" class="inputStyle">
          <p>
            <!-- 88888888 -->
            {{ form.uniformNumbers }}
          </p>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="formContent container-fluid">
      <a-form-model
        ref="ApplMaintenanceForm"
        class="gioFormGroup formW720 inputStyle"
        :form="form"
        :model="form"
        :colon="false"
        :hideRequiredMark="true"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item label="要保單位 - 中文名稱" class="inputStyle">
          <p>
            <!-- 一路發ＯＯＯＯＯＯＯＯＯＯＯＯＯＯ公司 (預留空間) -->
            {{ form.chineseNameOfTheGuaranteeUnit }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="要保單位 - 英文名稱" class="inputStyle">
          <p>
            <!-- RICH CO (預留空間) -->
            {{ form.englishNameOfTheGuaranteeUnit }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="要保單位負責人" class="inputStyle">
          <p>
            <!-- 王發財 (預留空間) -->
            {{ form.personInChargeOfGuaranteeUnit }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="營業類別 / 職災編號" class="inputStyle">
          <p>
            <!-- 42/00 -->
            {{ form.businessType_occupationalAccidentNumber }} / {{ form.occupationalDisasterNumber }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="郵遞區號 / 登記地址" class="inputStyle">
          <p>
            <!-- 11072 台北市發財路1號 (預留空間) -->
            {{ form.registeredAddress_postalCode }} {{ form.registeredAddress }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="登記電話" class="inputStyle">
          <p>
            <!-- 02183757389 -->
            {{ form.registerPhone }}
          </p>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="formContent container-fluid">
      <a-form-model
        ref="ApplMaintenanceForm"
        class="gioFormGroup formW720 inputStyle"
        :form="form"
        :model="form"
        :colon="false"
        :hideRequiredMark="true"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item label="加退保開放日數" class="inputStyle">
          <p>
            {{ form.addAndAbandonDevelopmentDays }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="GOH短報件" class="inputStyle">
          <p>
            <!-- 是 -->
            {{ getGohShortReport }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="契約相當日" class="inputStyle">
          <p>
            <!-- 01 -->
            {{ form.contractTime }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="生效方式" class="form-item__bg--blue multiLine">
          <p>
            <!-- 契約相當日 -->
            {{ getEffectiveWay }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="是否可加津貼" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.canTheAllowanceBeIncreased }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="是否提供繳費證明" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.whetherToProvideProofOfPayment }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="GOPA是否須投保職保" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.gopaNeedLaborInsurance }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="可投保屬性" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 員工、配偶 -->
            {{ getInsurableAttrOptions }}
          </p>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="formContent container-fluid">
      <a-form-model
        ref="businessAddAndEditForm"
        class="gioFormGroup formW720 inputStyle"
        :form="form"
        :model="form"
        :colon="false"
        :hideRequiredMark="true"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item label="行政人員ID" class="inputStyle">
          <p>
            <!-- 陳曉佳 -->
            {{ form.administrativeStaffId }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="理賠人員ID" class="inputStyle">
          <p>
            <!-- - - -->
            {{ form.claimsAdjusterId }}
          </p>
        </a-form-model-item>
        <a-form-model-item :label="`業務人員1是否顯示： ${(form.businessStaff1)?form.businessStaff1:''}`" :label-col="{span: 24}" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.businessStaff1Show }}
          </p>
        </a-form-model-item>
        <a-form-model-item :label="`業務人員2是否顯示： ${(form.businessStaff2)?form.businessStaff2:''}`" :label-col="{span: 24}" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.businessStaff2Show }}
          </p>
        </a-form-model-item>
        <a-form-model-item :label="`業務人員3是否顯示： ${(form.businessStaff3)?form.businessStaff3:''}`" :label-col="{span: 24}" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.businessStaff3Show }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="行銷客服人員" class="inputStyle">
          <p>
            <!-- 林七七 -->
            {{ form.marketing_customerServiceStaff }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="隸屬區部" class="inputStyle">
          <p>
            <!-- 北部 -->
            {{ form.affiliatedDistrict }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="開放員工查詢" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.openEmployeeQuery }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="開放承辦人使用團險整合服務系統" :label-col="{span: 24}" class="form-item__bg--blue multiLine">
          <p class="result__info">
            <!-- 是 -->
            {{ toComputed.developTheContractorUseGiissSystem }}
          </p>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="formContent container-fluid">
      <a-form-model
        ref="businessAddAndEditForm"
        class="gioFormGroup formW720 inputStyle"
        :form="form"
        :model="form"
        :colon="false"
        :hideRequiredMark="true"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item label="員工受益人類別" class="form-item__bg--blue">
          <p class="result__info">
            <!-- 依勞基法順位 -->
            {{ getEmployeeBeneficiaryCategory }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="配偶受益人類別" class="form-item__bg--blue">
          <p class="result__info">
            <!-- 依勞基法順位 -->
            {{ getSpouseBeneficiaryCategory }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="子女受益人類別" class="form-item__bg--blue">
          <p class="result__info">
            <!-- 依勞基法順位 -->
            {{ getChildBeneficiaryCategory }}
          </p>
        </a-form-model-item>
        <a-form-model-item label="父母受益人類別" class="form-item__bg--blue">
          <p class="result__info">
            <!-- 依勞基法順位 -->
            {{ getParentBeneficiaryCategory }}
          </p>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.push({name: 'ApplMaintenanceApplData'})"
      >
        返回查詢頁
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import { PolicyContentDto, PolicyMaintainDto } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({})
export default class ApplMaintenanceApplDataConfirm extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  form: PolicyContentDto = {
    addAndAbandonDevelopmentDays: undefined,
    administrativeStaffId: undefined,
    affiliatedDistrict: undefined,
    businessStaff1: undefined,
    businessStaff1Show: undefined,
    businessStaff2: undefined,
    businessStaff2Show: undefined,
    businessStaff3: undefined,
    businessStaff3Show: undefined,
    businessType_occupationalAccidentNumber: undefined,
    occupationalDisasterNumber: undefined,
    canTheAllowanceBeIncreased: undefined,
    childBeneficiaryCategory: undefined,
    chineseNameOfTheGuaranteeUnit: undefined,
    claimsAdjusterId: undefined,
    contractTime: undefined,
    developTheContractorUseGiissSystem: undefined,
    effectiveWay: undefined,
    employeeBeneficiaryCategory: undefined,
    englishNameOfTheGuaranteeUnit: undefined,
    gohShortReport: undefined,
    gopaNeedLaborInsurance: undefined,
    insurableAttributes: undefined,
    marketing_customerServiceStaff: undefined,
    openEmployeeQuery: undefined,
    parentBeneficiaryCategory: undefined,
    personInChargeOfGuaranteeUnit: undefined,
    policyNo: undefined,
    policySeq: undefined,
    registerPhone: undefined,
    registeredAddress: undefined,
    registeredAddress_postalCode: undefined,
    spouseBeneficiaryCategory: undefined,
    times: undefined,
    uniformNumbers: undefined,
    whetherToProvideProofOfPayment: undefined,
  };

  // 存放經1/0->是/否轉換的值
  toComputed: PolicyContentDto = {
    canTheAllowanceBeIncreased: undefined,
    whetherToProvideProofOfPayment: undefined,
    gopaNeedLaborInsurance: undefined,
    businessStaff1Show: undefined,
    businessStaff2Show: undefined,
    businessStaff3Show: undefined,
    developTheContractorUseGiissSystem: undefined,
    openEmployeeQuery: undefined,
  };

  // GOH短報件
  get getGohShortReport() {
    if (this.form.gohShortReport === '1') {
      return '是';
    }
    if (this.form.gohShortReport === '0') {
      return '否';
    }
    return '';
  }

  // 可投保屬性
  get getInsurableAttrOptions() {
    let $return;
    if (this.form.insurableAttributes && this.form.insurableAttributes.length > 0) {
      $return = this.form.insurableAttributes.map((i) => this.$enum.getVal('insurableAttrOptions', i)).join('、');
    } else {
      $return = '';
    }
    return $return;
  }

  // 生效方式
  get getEffectiveWay() {
    let $return;
    if (this.form.effectiveWay && this.form.effectiveWay.trim()) {
      $return = this.$enum.getVal('effectiveWay', this.form.effectiveWay);
    } else {
      $return = '';
    }
    return $return;
  }

  // 員工受益人類別
  get getEmployeeBeneficiaryCategory() {
    let $return;
    if (this.form.employeeBeneficiaryCategory && this.form.employeeBeneficiaryCategory.trim()) {
      $return = this.$enum.getVal('beneficiaryCategory', this.form.employeeBeneficiaryCategory);
    } else {
      $return = '';
    }
    return $return;
  }

  // 配偶受益人類別
  get getSpouseBeneficiaryCategory() {
    let $return;
    if (this.form.spouseBeneficiaryCategory && this.form.spouseBeneficiaryCategory.trim()) {
      $return = this.$enum.getVal('beneficiaryCategory', this.form.spouseBeneficiaryCategory);
    } else {
      $return = '';
    }
    return $return;
  }

  // 子女受益人類別
  get getChildBeneficiaryCategory() {
    let $return;
    if (this.form.childBeneficiaryCategory && this.form.childBeneficiaryCategory.trim()) {
      $return = this.$enum.getVal('beneficiaryCategory', this.form.childBeneficiaryCategory);
    } else {
      $return = '';
    }
    return $return;
  }

  // 父母受益人類別
  get getParentBeneficiaryCategory() {
    let $return;
    if (this.form.parentBeneficiaryCategory && this.form.parentBeneficiaryCategory.trim()) {
      $return = this.$enum.getVal('beneficiaryCategory', this.form.parentBeneficiaryCategory);
    } else {
      $return = '';
    }
    return $return;
  }

  // 接收值
  policyNum='';

  searchUnitCo: PolicyMaintainDto = {};

  // hasGetQuery = false;

  /**
   * Func
   */
  // 取得 Query 並帶入資料
  getQuery() {
    const $query = this.$global.getQuery();
    // TEST:
    // console.log($query);
    this.policyNum = $query.policyNum;
    this.searchUnitCo = $query.searchUnitCo;
  }

   // 查詢要保單位資料
  getCompanyInfo() {
    // if (this.hasQuery === false) {
      this.setLoading(true);
      this.$insDeptMaintainApi
        .queryUsingPOST(this.searchUnitCo)
        .then((resp) => {
          if (resp.data.status == 200) {
            const getData = resp.data.data;
            // TEST:
            // console.log(getData);
            this.form = getData;
          } else {
            // 查找失敗訊息
            const errorMsg = [];
            Object.values(resp.data.apiError).map((i) => {
              (i as any).map((j) => {
                errorMsg.push(j);
              });
            });
            Modal.error({
              title: this.h('div', {}, '查詢要保單位資料錯誤'),
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
          // API失敗
          console.log(error.response);
        })
        .finally(() => {
          this.setLoading(false);
        });
  }

  // 1/0 -> 是/否 轉換
  getComputedData(type) {
    if (type === '1') {
    return '是';
    } if (type === '0') {
    return '否';
    }
    return '';
  }

  /**
   * Event
   */
  // 跳轉險種檢核/計劃別維護頁面
  toApplMaintenanceInsuranceTypeResult(): void {
    this.$global.changeRouterAndaddParam({
      toRouter: 'ApplMaintenanceInsuranceTypeResult',
      query: {
        policyNo: this.searchUnitCo.policyNo,
        policySeq: this.searchUnitCo.policySeq,
      },
    });
  }

   // 跳轉變更資料頁面
  toApplMaintenanceApplDataResult(): void {
    this.$global.changeRouterAndaddParam({
      toRouter: 'ApplMaintenanceApplDataResult',
      query: {
        policyNum: this.policyNum,
        searchUnitCo: this.searchUnitCo,
      },
    });
  }

  /**
   * Hooks
   */
  created() {
    this.getQuery();
    // 查詢要保單位資料
    this.getCompanyInfo();
  }

  updated() {
  	window.parseWord();
  }

  /**
   * 監聽
   */
  // 將資料 1/0 轉換為 文字
  @Watch('form', { deep: true })
  watchForm(newVal) {
    if (newVal) {
      this.toComputed.canTheAllowanceBeIncreased = this.getComputedData(this.form.canTheAllowanceBeIncreased);
      this.toComputed.whetherToProvideProofOfPayment = this.getComputedData(this.form.whetherToProvideProofOfPayment);
      this.toComputed.gopaNeedLaborInsurance = this.getComputedData(this.form.gopaNeedLaborInsurance);
      this.toComputed.businessStaff1Show = this.getComputedData(this.form.businessStaff1Show);
      this.toComputed.businessStaff2Show = this.getComputedData(this.form.businessStaff2Show);
      this.toComputed.businessStaff3Show = this.getComputedData(this.form.businessStaff3Show);
      this.toComputed.developTheContractorUseGiissSystem = this.getComputedData(this.form.developTheContractorUseGiissSystem);
      this.toComputed.openEmployeeQuery = this.getComputedData(this.form.openEmployeeQuery);
    }
  }
}

</script>

<style lang="scss" scoped>
::v-deep {
  .formContent {
    padding: 20px 0 10px 0;
    margin-bottom: 20px;
  }
  .gioFormGroup {
    .ant-form-item-label {
      padding-bottom: 0px;
      padding-top: 0px;
      > label {
        margin-right: 30px;
      }
    }
  }
}

.form-item__bg--blue {
  margin-bottom: 20px;
}

.formW {
  max-width: 100%;
  margin: 0 auto;
}

.multiLine {
  padding: 6px 14px 0;

}

.ant-form-item-control {
  line-height: 1;
}

.card-header-btn {
    padding: 5px 18px;
    margin: 0 5px 0 5px;
}

// .confirm__button {
//   min-width: 220px;
//   margin: -11px 6px 22px 6px;
// }

.form-item__bg--blue {
  margin-bottom: 20px;
}

.result__info {
  font-size: 16px;
}

</style>
