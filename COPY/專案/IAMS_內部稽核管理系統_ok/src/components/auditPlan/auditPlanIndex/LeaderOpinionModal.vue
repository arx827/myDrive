<template>
  <InfoModal
    title="組長退回意見"
    :visible="visible"
    :width="544"
    :closable="true"
    :centered="true"
    @closeModal="close"
  >
    <template slot="content">
      <div class="modal__content-opinion">
        {{ message }}
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
export default class LeaderOpinionModal extends Vue {
  @Prop()
  visible: boolean;

  @Prop()
  message: string;

  close() {
  	this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>
.modal__content-opinion{
  background-color: $COLOR-LIGHT;
  margin-top: 14px;
  padding: 25px 27px;
}
</style>
