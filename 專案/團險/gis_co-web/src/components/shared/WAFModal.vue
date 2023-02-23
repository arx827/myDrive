<template>
  <a-modal
    :visible="getWAFModalSetting.visible"
    class="password__modal alert-modal"
    :closable="true"
    :footer="null"
    :width="850"
    @cancel="closeWAFModalModal"
  >
    <!-- eslint-disable-next-line  -->
    <div v-html="getWAFModalSetting.htmlContent" />
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { WAFModalModel } from '@/store/modules/Index';

@Component({ components: {} })
export default class WAFModal extends Vue {
	@Action('setWAFModal') setWAFModal;

	@Getter getWAFModalSetting!: WAFModalModel;

	closeWAFModalModal() {
		this.setWAFModal({
			...this.getWAFModalSetting,
			visible: false,
		});
	}
}
</script>

<style lang="less">

</style>
