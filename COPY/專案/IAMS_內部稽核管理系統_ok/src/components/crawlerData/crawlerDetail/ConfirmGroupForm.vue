<template>
  <InfoModal
    title="設定認列組別"
    :visible="getConfirmGroupModal.visible"
    :width="470"
    padding-size="normal"
    :footer="true"
    :mask-closable="false"
    @confirmModal="confirm"
    @closeModal="close"
  >
    <template slot="content">
      <a-form-model
        class="mt-2 mb-2 form--light"
      >
        <a-form-model-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <span slot="label">
            設定組別
          </span>
          <a-select
            v-if="getGroupOptions.length > 0"
            v-model="dataType"
            show-search
            class="input--select"
            :options="getGroupOptions"
            mode="multiple"
            :filter-option="filterGroupOptions"
            :dropdown-match-select-width="false"
            placeholder="請選擇認列組別"
            :allow-clear="true"
            :show-arrow="true"
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
import { Action, namespace } from 'vuex-class';

const detailModule = namespace('crawlerDataDetailVuex');
const modalControl = namespace('modalControl');

@Component({
	components: {
		IconTextButton,
		InfoModal,
	},
})
export default class ConfirmGroupForm extends Vue {
	@Action('setLoading') setLoading;

	@Prop()
  crawlerDataId;

  @detailModule.Getter('getGroupOptions') getGroupOptions; // 取得群組下拉

  @detailModule.Getter('getClaimGroup') getClaimGroup;

  @detailModule.Action('setDetailData') setDetailData;

  @detailModule.Getter('getConfirmGroupModal') getConfirmGroupModal;

  @detailModule.Action('setDetailModalState') setDetailModalState;

  @detailModule.Action('setEnumData') setEnumData; // 設定Enum

  @detailModule.Action('updateDetailData') updateDetailData; // 更新 detailData

  @modalControl.Action('setModalState') setModalState; // 全域 狀態彈窗

  dataType = [];

  filterGroupOptions(input, option) {
  	return (
  		option.componentOptions.children[0].text.indexOf(input) >= 0
  	);
  }

  /**
   * API
   */
  // API: 取得 組別 下拉 => vuex
  async getApi_Group() {
  	this.setLoading(true);
  	await this.$dataCollectApi.getGroupInDataCollectUsingGET()
  		.then((resp) => {
  			const getData = resp.data;
  			this.setEnumData({
  				groupOptions: getData.result,
  			});
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 儲存認列組別
  async getApi_SetClaimGroup() {
  	this.setLoading(true);
  	await this.$dataCollectApi.setClaimGroupInDataCollectUsingPOST({
  		crawlerDataId: this.crawlerDataId,
  		groups: this.dataType,
  	})
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '設定認列組別成功',
  					autoClose: 3,
  				},
  			});
  		})
  		.catch((err) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '設定認列組別失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * Event
   */
  async confirm() {
  	await this.getApi_SetClaimGroup();
  	this.setDetailData({
  		claimGroup: this.dataType,
  	});
  	this.close();
  }

  close() {
  	this.setDetailModalState({
  		confirmGroupModal: {
  			visible: false,
  		},
  	});
  }

	/**
   * 監聽
   */
	@Watch('getConfirmGroupModal.visible', { immediate: true })
  async watchVisible(val) {
  	if (val) {
  		await this.getApi_Group();
  	}
  }
}
</script>

<style lang="scss" scoped>
</style>
