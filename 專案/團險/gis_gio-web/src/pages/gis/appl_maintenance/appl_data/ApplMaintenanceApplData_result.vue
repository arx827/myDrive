<template>
  <div class="ApplMaintenanceApplDataResultForm">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        保單資料變更
      </h2>
    </div>
    <a-form-model
      ref="ApplMaintenanceApplDataResultForm"
      class="gioFormGroup formW"
      :model="form"
      :colon="false"
      :rules="rules"
      :hideRequiredMark="true"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 17 }"
    >
      <div class="formContent container-fluid">
        <div class="formW720">
          <a-form-model-item label="保單號碼">
            <p>
              <!-- 1111111-000 -->
              {{ form.policyNo }}-{{ form.policySeq }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="統一編號">
            <p>
              <!-- 88888888 -->
              {{ form.uniformNumbers }}
            </p>
          </a-form-model-item>
        </div>
      </div>
      <div class="formContent container-fluid">
        <div class="formW720">
          <a-form-model-item label="要保單位 - 中文名稱">
            <p>
              <!-- 一路發ＯＯＯＯＯＯＯＯＯＯＯＯＯＯ公司 (預留空間) -->
              {{ form.chineseNameOfTheGuaranteeUnit }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="要保單位 - 英文名稱">
            <p>
              <!-- RICH CO (預留空間) -->
              {{ form.englishNameOfTheGuaranteeUnit }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="要保單位負責人">
            <p>
              <!-- 王發財 (預留空間) -->
              {{ form.personInChargeOfGuaranteeUnit }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="營業類別 / 職災編號">
            <p>
              <!-- 42/00 -->
              {{ form.businessType_occupationalAccidentNumber }} / {{ form.occupationalDisasterNumber }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="郵遞區號 / 登記地址">
            <p>
              <!-- 11072 台北市發財路1號 (預留空間) -->
              {{ form.registeredAddress_postalCode }} {{ form.registeredAddress }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="登記電話">
            <p>
              <!-- 02183757389 -->
              {{ form.registerPhone }}
            </p>
          </a-form-model-item>
        </div>
      </div>
      <div class="formContent container-fluid">
        <div class="formW720">
          <a-form-model-item label="加退保開放日數" prop="addAndAbandonDevelopmentDays" class="inputStyle">
            <a-input v-model="form.addAndAbandonDevelopmentDays" style="width: 19.5%" placeholder="e.g. 45" />
          </a-form-model-item>
          <a-form-model-item label="GOH短報件">
            <p>
              <!-- 是 -->
              {{ getGohShortReport }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="契約相當日">
            <p>
              <!-- 01 -->
              {{ form.contractTime }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="生效方式" prop="effectiveWay" class="form-item__bg--blue radioBtn-group d-flex align-item-center">
            <a-radio-group v-model="form.effectiveWay" name="radioGroup">
              <a-radio value="1">
                契約相當日
              </a-radio>
              <a-radio value="2">
                受理翌日
              </a-radio>
              <a-radio value="3">
                受僱日
              </a-radio>
              <br>
              <a-radio value="4">
                受理當日
              </a-radio>
              <a-radio value="5">
                職保生效日
              </a-radio>
              <a-radio value="6">
                職保生效日30天
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="是否可加津貼" prop="canTheAllowanceBeIncreased" class="form-item__bg--blue radioBtn-group d-flex align-item-center">
            <a-radio-group v-model="form.canTheAllowanceBeIncreased" name="radioGroup">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="是否提供繳費證明" prop="whetherToProvideProofOfPayment" class="form-item__bg--blue radioBtn-group d-flex align-item-center">
            <a-radio-group v-model="form.whetherToProvideProofOfPayment" name="radioGroup">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="GOPA是否須投保職保" prop="gopaNeedLaborInsurance" class="form-item__bg--blue radioBtn-group d-flex align-item-center">
            <a-radio-group v-model="form.gopaNeedLaborInsurance" name="radioGroup" :default-value="1">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="可投保屬性" prop="insurableAttributes" class="form-item__bg--blue checkBtn-group">
            <a-checkbox-group
              v-model="form.insurableAttributes"
              name="insuredAmountGroup"
              :options="insurableAttrOptions"
            />
          </a-form-model-item>
        </div>
      </div>
      <div class="formContent container-fluid">
        <div class="formW720">
          <a-form-model-item label="行政人員ID">
            <p>
              <!-- 陳曉佳 -->
              {{ form.administrativeStaffId }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="理賠人員ID">
            <p>
              <!-- - - -->
              {{ form.claimsAdjusterId }}
            </p>
          </a-form-model-item>
          <a-form-model-item
            :label="`業務人員1是否顯示： ${(form.businessStaff1)?form.businessStaff1:''}`"
            :label-col="{span: 24}"
            prop="businessStaff1Show"
            class="form-item__bg--blue radioBtn-group multiLine"
          >
            <a-radio-group v-model="form.businessStaff1Show" name="radioGroup" :default-value="1">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            :label="`業務人員2是否顯示： ${(form.businessStaff2)?form.businessStaff2:''}`"
            :label-col="{span: 24}"
            prop="businessStaff2Show"
            class="form-item__bg--blue radioBtn-group multiLine"
          >
            <a-radio-group v-model="form.businessStaff2Show" name="radioGroup" :default-value="1">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            :label="`業務人員3是否顯示： ${(form.businessStaff3)?form.businessStaff3:''}`"
            :label-col="{span: 24}"
            prop="businessStaff3Show"
            class="form-item__bg--blue radioBtn-group multiLine"
          >
            <a-radio-group v-model="form.businessStaff3Show" name="radioGroup" :default-value="1">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="行銷客服人員">
            <p>
              <!-- 林七七 -->
              {{ form.marketing_customerServiceStaff }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="隸屬區部">
            <p>
              <!-- 北部 -->
              {{ form.affiliatedDistrict }}
            </p>
          </a-form-model-item>
          <a-form-model-item label="開放員工查詢" prop="openEmployeeQuery" class="form-item__bg--blue radioBtn-group d-flex align-item-center">
            <a-radio-group v-model="form.openEmployeeQuery" name="radioGroup">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            label="開放承辦人使用團險整合服務系統"
            :label-col="{span: 24}"
            prop="developTheContractorUseGiissSystem"
            class="form-item__bg--blue radioBtn-group multiLine"
          >
            <a-radio-group v-model="form.developTheContractorUseGiissSystem" name="radioGroup">
              <a-radio value="1">
                是
              </a-radio>
              <a-radio value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </div>
      </div>
      <div class="formContent container-fluid">
        <div class="formW720">
          <!-- RC -->
          <a-form-model-item
            label="員工受益人類別"
            prop="employeeBeneficiaryCategory"
            class="form-item__bg--blue radioBtn-group d-flex align-item-center"
          >
            <p v-if="policyType === 'RC'">
              {{ $enum.getVal('beneficiaryCategory', form.employeeBeneficiaryCategory) }}
            </p>
            <a-radio-group
              v-else
              v-model="form.employeeBeneficiaryCategory"
              name="radioGroup"
              :options="$enum.beneficiaryCategory.filter(i => i.val !== '員工').map((i) => ({ label: i.val, value: i.key }))"
            />
          </a-form-model-item>
          <a-form-model-item
            label="配偶受益人類別"
            prop="spouseBeneficiaryCategory"
            class="form-item__bg--blue radioBtn-group d-flex align-item-center"
          >
            <p v-if="policyType === 'RC'">
              {{ $enum.getVal('beneficiaryCategory', form.spouseBeneficiaryCategory) }}
            </p>
            <a-radio-group
              v-else
              v-model="form.spouseBeneficiaryCategory"
              name="radioGroup"
              :options="$enum.beneficiaryCategory.map((i) => ({ label: i.val, value: i.key }))"
            />
          </a-form-model-item>
          <a-form-model-item
            label="子女受益人類別"
            prop="childBeneficiaryCategory"
            class="form-item__bg--blue radioBtn-group d-flex align-item-center"
          >
            <p v-if="policyType === 'RC'">
              {{ $enum.getVal('beneficiaryCategory', form.childBeneficiaryCategory) }}
            </p>
            <a-radio-group
              v-else
              v-model="form.childBeneficiaryCategory"
              name="radioGroup"
              :options="$enum.beneficiaryCategory.map((i) => ({ label: i.val, value: i.key }))"
            />
          </a-form-model-item>
          <a-form-model-item
            label="父母受益人類別"
            prop="parentBeneficiaryCategory"
            class="form-item__bg--blue radioBtn-group d-flex align-item-center"
          >
            <p v-if="policyType === 'RC'">
              {{ $enum.getVal('beneficiaryCategory', form.parentBeneficiaryCategory) }}
            </p>
            <a-radio-group
              v-else
              v-model="form.parentBeneficiaryCategory"
              name="radioGroup"
              :options="$enum.beneficiaryCategory.map((i) => ({ label: i.val, value: i.key }))"
            />
          </a-form-model-item>
        </div>
      </div>
    </a-form-model>
    <div class="confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="toApplMaintenanceApplData()"
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
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Modal } from 'ant-design-vue';
import { PolicyContentDto, PolicyMaintainDto, UpdateAs400Dto } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({})
export default class ApplMaintenanceApplDataResult extends Vue {
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
    faxTelephone: undefined,
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

  // GOH短報件
  get getGohShortReport() {
    if (this.form.gohShortReport === '1') {
      return '是';
    } if (this.form.gohShortReport === '0') {
      return '否';
    }
      return '';
  }

  // 可投保屬性 選單
  insurableAttrOptions = this.$enum.insurableAttrOptions.map((i) => ({ label: i.val, value: i.key }));

  customErrorMsg: { [key: string]: string } = {
    id: '',
  };

  // 保單號碼
  policyNum='';

  get policyType() {
    return this.$global.getPolicyType(this.policyNum);
    // return 'CB';
  }

  searchUnitCo: PolicyMaintainDto = {};

  rules: { [key: string]: ValidationRule[] } = {
    // 【加退保開發日數】欄位檢核
    addAndAbandonDevelopmentDays: [
      {
        required: true,
        message: '請輸入開發日數',
      },
      {
        pattern: /^[0-9]{1,}$/,
        message: '請輸入半形數字',
      },
    ],
    // 【生效方式】欄位檢核
    effectiveWay: [
      {
        required: true,
        message: '請選擇生效方式',
      },
    ],
    // 【是否可加津貼】欄位檢核
    canTheAllowanceBeIncreased: [
      {
        required: true,
        message: '請選擇是否可加津貼',
      },
    ],
    // 【是否提供繳費證明】欄位檢核
    whetherToProvideProofOfPayment: [
      {
        required: true,
        message: '請選擇是否提供繳費證明',
      },
    ],
    // 【GOPA是否須投保職保】欄位檢核
    gopaNeedLaborInsurance: [
      {
        required: true,
        message: '請選擇GOPA是否須投保職保',
      },
    ],
    // 【可投保屬性】欄位檢核
    insurableAttributes: [
      {
        required: true,
        message: '請選擇可投保屬性',
      },
    ],
    // 【業務人員1是否顯示】欄位檢核
    businessStaff1Show: [
      {
        required: true,
        message: '請選擇業務人員1是否顯示',
      },
    ],
    // 【業務人員2是否顯示】欄位檢核
    businessStaff2Show: [
      {
        required: true,
        message: '請選擇業務人員2是否顯示',
      },
    ],
    // 【業務人員3是否顯示】欄位檢核
    businessStaff3Show: [
      {
        required: true,
        message: '請選擇業務人員3是否顯示',
      },
    ],
     // 【開放員工查詢】欄位檢核
    openEmployeeQuery: [
      {
        required: true,
        message: '請選擇是否開放員工查詢',
      },
    ],
    // 【開放承辦人使用團險整合服務系統】欄位檢核
    developTheContractorUseGiissSystem: [
      {
        required: true,
        message: '請選擇是否開放承辦人使用團險整合服務系統',
      },
    ],
    // 【員工受益人類別】欄位檢核
    employeeBeneficiaryCategory: [
      {
        required: true,
        message: '請選擇員工受益人類別',
      },
    ],
  };

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

  // API: 查詢要保單位資料
  getCompanyInfo() {
    this.setLoading(true);
    this.$insDeptMaintainApi
      .queryUsingPOST(this.searchUnitCo)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
         // TEST:
          // console.log(getData);
          this.form = getData;
          if (this.form.employeeBeneficiaryCategory === null) { this.form.employeeBeneficiaryCategory = '12'; }
        } else {
          // 查找失敗訊息
          const getError = resp.data;
          this.$infoNotification.error({
            Content: '無法進行項目變更，請檢查是否有欄位漏填。',
            apiError: getError.apiError,
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

  // 欄位檢核
  // 半形字元檢核
  fullWidthAcd(rule, value) {
    return !this.$global.fullWidthAcd(value);
  }

  // 資料驗證
  // validateForm(refsName) {
  //   return (this.$refs[refsName] as any).validate();
  // }

  /**
   * Event
   */
  // 確認新增
  onSubmit() {
    const {
      addAndAbandonDevelopmentDays,
      businessStaff1,
      businessStaff1Show,
      businessStaff2,
      businessStaff2Show,
      businessStaff3,
      businessStaff3Show,
      canTheAllowanceBeIncreased,
      childBeneficiaryCategory,
      developTheContractorUseGiissSystem,
      effectiveWay,
      employeeBeneficiaryCategory,
      gopaNeedLaborInsurance,
      insurableAttributes,
      marketing_customerServiceStaff,
      openEmployeeQuery,
      parentBeneficiaryCategory,
      policyNo,
      policySeq,
      spouseBeneficiaryCategory,
      times,
      whetherToProvideProofOfPayment,
    } = this.form;
    const updateform = {
      addAndAbandonDevelopmentDays,
      businessStaff1,
      businessStaff1Show,
      businessStaff2,
      businessStaff2Show,
      businessStaff3,
      businessStaff3Show,
      canTheAllowanceBeIncreased,
      childBeneficiaryCategory,
      developTheContractorUseGiissSystem,
      effectiveWay,
      employeeBeneficiaryCategory,
      gopaNeedLaborInsurance,
      insurableAttributes,
      marketing_customerServiceStaff,
      openEmployeeQuery,
      parentBeneficiaryCategory,
      policyNo,
      policySeq,
      spouseBeneficiaryCategory,
      times,
      whetherToProvideProofOfPayment,
    };
    (this.$refs.ApplMaintenanceApplDataResultForm as any).validate()
    .then(() => {
      this.setLoading(true);
      this.$insDeptMaintainApi
        .updateUsingPOST(updateform)
        .then((resp) => {
          if (resp.data.status == 200) {
            // 成功訊息
            new Promise(() => {
              this.$global.changeRouterAndaddParam({
                toRouter: 'ApplMaintenanceApplDataConfirm',
                query: {
                  policyNum: this.policyNum,
                  searchUnitCo: this.searchUnitCo,
                },
              });
            }).then(() => {
              this.$infoNotification.success({
                Content: '已完成編輯',
              });
            });
          } else {
            // 查找失敗訊息
            this.$infoNotification.error({
              Content: '無法取得資料',
              apiError: resp.data.apiError,
            });
          }
        })
        .catch((error) => {
          // API失敗
          console.log('error', error.response);
        })
        .finally(() => {
          this.setLoading(false);
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
  // }
  }

  toApplMaintenanceApplData(): void {
    this.$global.changeRouterAndaddParam({
      toRouter: 'ApplMaintenanceApplData',
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
  // TEST:
  // @Watch('form')
  // watchForm(newVal) {
  //   console.log(newVal);
  // }
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
  .ant-form-item {
    margin-bottom: 6px;
  }
  .ant-form-item-control-wrapper {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .ant-form-item-control {
    line-height: 1;
  }
}

// ::v-deep .radioStyle{
//   background-color:#E6F4FF ;
//   max-width: 800px;
//   margin: 0 auto;
//   margin-bottom: 20px;
//   padding-left: 23px;
// }

.inputStyle{
  // max-width: 720px;
  margin: 0 auto;
  margin-bottom: 6px;
  ::v-deep {
    .ant-form-item-control-wrapper {
      padding-top: 2px;
      padding-bottom: 2px;
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

</style>
