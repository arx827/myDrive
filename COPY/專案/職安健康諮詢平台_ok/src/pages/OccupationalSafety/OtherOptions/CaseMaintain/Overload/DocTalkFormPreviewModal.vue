<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="modal-container">
        <DocTalkForm
          v-if="recordId"
          :is-readonly="true"
          :record-id-prop="recordId"
        />

        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary mb-2"
            @click="onClose"
          >
            返回
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import DocTalkForm from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/Overload/DocTalkForm.vue';

@Component({ components: { DocTalkForm } })
export default class CaseOverloadPreviewModal extends Vue {
  @Prop()
  visible: boolean

  @Prop()
  recordId: number

  modalVisible = false;

  // 負荷評估量表控制
  loadModalVisible = false;

  // 十年內心血管疾病發病風險評估量表控制
  yearModalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  onClose() {
  	this.$emit('closeFormModal');
  }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
		margin-bottom: 16px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    padding-top: 6px;
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $TEXT-BOLD;
    }
  }
</style>
