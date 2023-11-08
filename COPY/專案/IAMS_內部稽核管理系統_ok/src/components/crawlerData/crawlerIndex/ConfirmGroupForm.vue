<template>
  <InfoModal
    title="設定認列組別"
    :visible="visible"
    :centered="true"
    :width="470"
    :mask-closable="false"
    padding-size="normal"
    :footer="true"
    @closeModal="close"
  >
    <template slot="content">
      <a-form-model
        ref="formRef"
        class="mt-2 mb-2 form--light"
        :model="ConfirmedForm"
        :rules="formRules"
        :hide-required-mark="true"
      >
        <a-form-model-item
          prop="option"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <span slot="label">
            設定組別
          </span>
          <a-select
            v-model="dataType"
            class="input--select"
            :options="groupOptions"
            :dropdown-match-select-width="false"
          />
        </a-form-model-item>
      </a-form-model>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { Action } from 'vuex-class';
// export interface todoListDataInterface{
//   img: string;
//   title: string;
//   count: number;
// }

@Component({
	components: {
		IconTextButton, InfoModal,
	},
})
export default class ConfirmGroupForm extends Vue {
  @Action('setLoading') setLoading;

  // 資料蒐集認列彈窗
  @Prop()
  visible: boolean;

  ConfirmedForm = {};

  dataType = '';

  groupOptions = [];

  formRules: { [key: string]: ValidationRule[] } = {
  	option: [{ required: true, message: '請選擇您想查詢的歷史異動', trigger: 'change' }],
  };

  /**
   * Func
   */
  getGroup() {
  	// // this.setLoading(true);
  	// this.$dataCollectApi.getGroupInDataCollectUsingGET()
  	// 	.then((resp) => {
  	// 		if (resp.status === 200) {
  	// 			console.log(resp.data);
  	// 			const getData = resp.data;
  	// 			this.groupOptions = getData.result;
  	// 		}
  	// 	})
  	// 	.catch((err) => {
  	// 		console.log(err);
  	// 	})
  	// 	.finally(() => {
  	// 		// this.setLoading(false);
  	// 	});
  }

  /**
   * Event
   */
  close() {
  	console.log('close');
  }

	/**
   * 監聽
   */
	@Watch('visible', { immediate: true })
  WatchVisible(val) {
  	if (val) {
  		// 取得下拉資料
  		this.getGroup();
  	}
  }
}
</script>

<style lang="scss" scoped>
</style>
