<template>
  <InfoModal
    title="匯出檔案"
    :visible="visible"
    :width="544"
    padding-size="normal"
    :closable="true"
    :centered="true"
    @closeModal="close"
  >
    <template slot="content">
      <div class="modal__subtitle">
        請選擇要不要匯出組別 !
      </div>
      <div class="d-flex justify-content-between">
        <a-button
          class="btn__icon--export flex-center"
          @click="handleExport(true)"
        >
          <div
            class="btn__icon--export-icon btn__icon-text--export2"
            alt=""
          />
          <div>
            <p class="btn__icon--export-text">
              匯出組別
            </p>
          </div>
        </a-button>
        <a-button
          class="btn__icon--export flex-center"
          @click="handleExport(false)"
        >
          <div
            class="btn__icon--export-icon btn__icon-text--export1"
            alt=""
          />
          <div>
            <p class="btn__icon--export-text">
              匯出無組別
            </p>
          </div>
        </a-button>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import InfoModal from '@/components/shared/modal/InfoModal.vue';

@Component({
	components: {
		InfoModal,
	},
})
export default class ExportModal extends Vue {
  @Prop()
  visible: boolean

  close() {
  	this.$emit('closeModal');
  }

  handleExport(include) {
  	this.$emit('click', include);
  }
}
</script>

<style lang="scss" scoped>
.modal__subtitle{
  color: $COLOR-LIGHT;
  margin-top: 13px;
  margin-bottom: 26px;
  line-height: 1em;
}
</style>
