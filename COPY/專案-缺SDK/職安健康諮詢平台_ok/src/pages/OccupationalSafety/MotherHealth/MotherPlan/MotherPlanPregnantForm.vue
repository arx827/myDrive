<template>
  <div class="container">
    <div class="page__title">
      媽咪妊娠中－懷孕期間健康情形自我評估表
    </div>
    <div class="page__subtitle">
      可參閱醫師提供之實體<span>孕婦健康手冊</span>
    </div>
    <MotherForm :form-type="'WRITE'" />
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { FormDataDto, MonPlanSaveDto } from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';
import PregnantModel from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanPreModel.vue';
import MotherForm from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherForm.vue';

@Component({ components: { PregnantModel, MotherForm } })
export default class MotherPlanPregnantForm extends Vue {

}
</script>
<style lang="scss" scoped>
  .page__subtitle {
    color: $TEXT-GREEN;
    margin-bottom: 20px;
    span {
      font-weight: $TEXT-BOLD;
    }
  }

</style>
