<template>
  <div class="container">
    <div class="page__title">
      產後未滿一年－分娩後一年內健康情形自我評估表
    </div>
    <div class="page__subtitle">
      可參閱醫師提供之實體<span>孕婦健康手冊</span>
    </div>
    <MotherForm :form-type="'WRITE'" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import PregnantModel from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanPreModel.vue';
import MotherForm from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherForm.vue';

@Component({ components: { PregnantModel, MotherForm } })
export default class MotherPlanAfterForm extends Vue {
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
