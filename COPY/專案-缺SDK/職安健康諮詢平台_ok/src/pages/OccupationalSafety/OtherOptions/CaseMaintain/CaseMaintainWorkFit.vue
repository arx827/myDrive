<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center block--padding">
        <div class="page__title">
          工作適性安排建議表
        </div>
      </div>
      <div
        v-if="denyMsg.length > 0"
        class="page__card p-0 block--padding"
      >
        <div class="page__card__headerTitle" />
        <div class="card__info">
          {{ denyMsg }}
        </div>
      </div>
      <div class="caseMaintain__wrap">
        <MotherForm
          v-if="formInput.caseId&&formInput.formNo"
          :form-type="'CASE_WRITE'"
          :form-input="{caseId: formInput.caseId, formNo: formInput.formNo,}"
          :form-type-enum="formTypeEnum"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import MotherForm from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherForm.vue';

@Component({ components: { MotherForm } })
export default class CaseMaintainWorkFit extends Vue {
  @Action('setLoading') setLoading;

  // [個案維護] 表單類別
  formTypeEnum = null;

  formInput = {
  	caseId: null,
  	formNo: null,
  }

  denyMsg = '';

  selfFormID = null;

  // API:是否拒絕醫生諮詢
  checkIsDeny() {
  	this.setLoading(true);
  	this.$MONPLANRpnMaintainApi.isDenyUsingPOST({ formId: this.selfFormID, caseId: this.formInput.caseId })
  		.then((resp) => {
  			this.denyMsg = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  created() {
  	const query = this.$global.getQuery();
  	this.formInput.formNo = query.formId;
  	this.formInput.caseId = query.caseId;
  	this.formTypeEnum = query.formTypeEnum;
  	this.selfFormID = query.selfFormID;
  	this.checkIsDeny();
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 0;
    @include rwd-sm {
      padding-right: var(--bs-gutter-x, 8px);
      padding-left: var(--bs-gutter-x, 8px);
    }
  }
  .block--padding {
    margin: 0 30px;
    @include rwd-sm {
      margin: 0;
    }
  }
  .lable__title {
    color: #000000;
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .mark {
    width: 20px;
    height: 20px;
    color: #FC001A;
    font-size: 25px;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 27px;
  }
  .notMobile {
    display: none;
    @include rwd-sm {
      display: block;
    }
  }
  .isMobile {
    @include rwd-sm {
      display: none;
    }
  }

	// 提醒卡
  .page__card {
    border: 0.5px solid #CED4D9;
    margin-bottom: 20px;
    margin-top: 0;
    width: auto;
  }
  .page__card__headerTitle {
    height: 20px;
  }
  .card__info {
    color: #363636;
    font-weight: 600;
    text-align: center;
    padding: 20px 30px;
    font-size: 14px;
    @include rwd-lg {
      font-size: 20px;
    }
  }

  .query__wrap {
    width: 100%;
    border-radius: 4px;
    background-color: #FFFFFF;
    padding: 8px;
    margin-bottom: 10px;
    white-space: normal;
    word-wrap: break-word;
  }
  .query__light {
    width: 100%;
    border-radius: 4px;
    background-color: #F5F8FC;
    padding: 8px;
    margin-bottom: 10px;
  }
  .radio--margin {
    margin-left: 0;
  }
  .title--green {
    color: #23C4A8;
    margin-top: 10px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  .caseMaintain__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
    hr {
      border: 0;
      border-bottom: 1px solid #D1D1D1;
      margin: 5px 0;
      @include rwd-sm {
        margin: 10px 0;
      }
    }
  }
  .label--nowrap {
    white-space: wrap;
    @include rwd-lg {
      white-space: nowrap;
    }
  }
  .other__input {
    width: 100%;
    min-width: 160px;
    border: 0;
    border-bottom: 1px solid #D1D1D1;;
    background-color: rgba(255, 255, 255, 0);
    height: 21px;
    &:focus {
      outline: none;
    }
    margin-left: 0;
    @include rwd-md {
      margin-left: 10px;
    }
  }
  hr.other__hr {
    margin-bottom: 20px;
  }
  .block--sm {
    border-radius: 0px;
    @include rwd-sm {
      border-radius: 10px;
    }
  }
  .block__title {
    color: #000000;
    font-weight: 600;
    font-size: 18px;
    @include rwd-lg {
      font-size: 20px;
    }
  }
  .label--normal {
    font-weight: normal;
  }
  .btn__wrap {
    margin: 50px 100px 50px 0;
    width: 100%;
    padding: 0;
    @include rwd-md {
      padding-right: 108px;
    }
    button {
      width: 98px;
      padding: 10px 20px;
      @include rwd-md {
        width: 200px;
        margin-right: 10px;
      }
      max-width: 100%;
      margin-right: 5px;
    }
    .btn__temp {
      width: 98px;
    }
  }

  ::v-deep {
    .btn__upload {
    border-radius: 4px;
    background-color: #4D86FF;
    border: none;
    color: #fff;
    &:hover {
      color: #4D86FF;
      background-color: #fff;
    }
  }
    .caseMaintain__wrap {
      .radio__title {
        margin-right: 8px;
        padding-left: 10px;
        text-align: center;
      }
      .ant-form-vertical .ant-form-item {
        padding: 0;
        margin: 0;
      }
      .mx-input {
        height: 30px;
      }
      .ant-upload-list-item {
        width: 50%;
      }
      .ant-upload-list-item-name {
        color: #1797FB;
      }
      .ant-checkbox + span, span.ant-radio + * {
        flex-grow: 1;
      }
    }
  }
</style>
