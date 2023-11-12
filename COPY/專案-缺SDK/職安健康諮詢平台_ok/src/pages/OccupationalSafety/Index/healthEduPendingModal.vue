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

      <div class="text-center">
        <img
          :src="qrcode"
          alt=""
        >
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { Action } from 'vuex-class';

@Component({ components: { FblDataGrid } })
export default class healthEduPendingModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  modalVisible = false;

  qrcode = null;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.getQrcode();
  	}
  }

  @Prop()
  sendInfoRecordId: number

  onClose() {
  	this.$emit('closeModal');
  }

  getQrcode() {
  	this.setLoading(true);
  	this.$ToDoListApi.healthEduPendingUsingPOST(this.sendInfoRecordId)
  		.then((resp) => {
  			console.log(resp.data.data);
  			this.qrcode = resp.data.data.picture;
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
</style>
