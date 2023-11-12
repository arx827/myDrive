<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center block--padding">
        <div class="page__title">
          作業環境評估表
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
import MotherForm from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherForm.vue';

@Component({ components: { MotherForm } })
export default class CaseMaintainWorkEnv extends Vue {
	// [個案維護] 表單類別
  formTypeEnum = null;

  formInput = {
  	caseId: null,
  	formNo: null,
  }

  created() {
  	const query = this.$global.getQuery();
  	this.formInput.formNo = query.formId;
  	this.formInput.caseId = query.caseId;
  	this.formTypeEnum = query.formTypeEnum;
  	console.log(this.formTypeEnum);
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
  .query__wrap {
    width: 100%;
    border-radius: 4px;
    background-color: #FFFFFF;
    padding: 10px;
    margin-top: 10px;
  }
  .radio--margin {
    margin-left: 0;
  }
  .title--green {
    font-size: 20px;
    color: #23C4A8;
    margin-top: 10px;
    font-weight: 600;
  }
  .caseMaintain__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
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
  .text-wrapper {
    white-space: pre-wrap;
  }
  ::v-deep {
    .caseMaintain__wrap {
      .ant-checkbox {
        vertical-align: middle;
      }
      .radio__title {
        margin-right: 8px;
        padding-left: 10px;
        text-align: center;
      }
      .ant-form-vertical .ant-form-item {
        padding: 0;
        margin: 0;
      }
      .ant-input {
        height: 40px;
      }
      .ant-checkbox-group {
        width: 100%;
      }
      textarea.ant-input {
        width: 92%;
        margin-left: 25px;
        margin-top: 3px;
      }
    }
  }
</style>
