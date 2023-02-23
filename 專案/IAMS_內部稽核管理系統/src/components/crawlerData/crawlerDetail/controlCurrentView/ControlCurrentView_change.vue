<template>
  <KeepAlive>
    <component
      :is="currentView"
      v-if="currentView"
      :crawler-data-id="crawlerDataId"
      :data-type-str="dataTypeStr"
      @resetSearchSection="resetSearchSection"
    />
  </KeepAlive>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';

import ControlCurrentView1 from './ControlCurrentView_1.vue'; // 年度稽核計畫
import ControlCurrentView2 from './ControlCurrentView_2.vue'; // 查核行前規劃
import ControlCurrentView3 from './ControlCurrentView_3.vue'; // 工作底稿
import ControlCurrentView4 from './ControlCurrentView_4.vue'; // 資料檔案
import ControlCurrentView5 from './ControlCurrentView_5.vue'; // 歷程

const detailModule = namespace('crawlerDataDetailVuex');

@Component({
	components: {
		ControlCurrentView1,
		ControlCurrentView2,
		ControlCurrentView3,
		ControlCurrentView4,
		ControlCurrentView5,
	},
})
export default class ControlCurrentViewChange extends Vue {
  @Action('setLoading') setLoading;

  @detailModule.Action('setDetailData') setDetailData;

  @detailModule.Action('setrelProcess') setrelProcess;

  @detailModule.Action('setrelProcess3') setrelProcess3;

  @detailModule.Getter('getUpdate') getUpdate;

  @detailModule.Action('updated') updated;

  @detailModule.Action('delAllRelProcess') delAllRelProcess;

  @detailModule.Getter('getDetailData') getDetailData;

	@Prop()
  dataTypeStr: string;

	@Prop()
  activeTab: string;

	@Prop()
  crawlerDataId;

  $dataGroupId = '';

  auditorContentObj(data, relprocess) {
  	// console.log(data.auditItemName || '');
  	// console.log(data.dataRelId || '');
  	return {
  		dataRelId: data.dataRelId || '',
  		dataGroupId: data.dataGroupId || '',
  		dataGroupLogId: data.dataGroupLogId || '',
  		operate: data.operate || 'modify',
  		relProcess: relprocess,
  		relId: data.relId || '',
  		relItem: data.relItem || '',
  		auditItem: data.auditItem || '',
  		auditItemName: data.auditItemName || '',
  		relContent: data.relContent || {
  			content: '',
  			article: '',
  			paragraph: '',
  			subparagraph: '',
  			item: '',
  			seq: data.relContent?.seq || 0,
  		},
  	};
  }

  get currentView() {
  	return `ControlCurrentView${this.activeTab}`;
  }

  async getRelProcess_3() {
  	this.getApi_searchSection();
  }

  /**
	 * API
	 */
  // 年度稽核計畫 查核行前規劃 API
  // API: 查詢查核項目
  getApi_getAuditSideMenuArr() {
  	this.setLoading(true);
  	this.$dataCollectApi
  		.getAuditorItemInDataCollectUsingGET()
  		.then(async (resp) => {
  			const getData = resp.data.result;
  			const auditorContent = await this.getApi_searchAuditorContent();
  			// console.log('取得查核項目內容 =>', auditorContent);
  			const result1 = this.$global.deepCopyData(getData);
  			const result2 = this.$global.deepCopyData(getData);
  			// 比對 並生成資料格式
  			// 年度稽核計畫
  			result1.map((i, index) => {
  				const $filter = (auditorContent as any).filter((j) => j.relProcess === '1').find((k) => k.auditItem === i.auditItem);
  				if ($filter) {
  					result1[index] = this.auditorContentObj({ ...$filter, auditItemName: i.auditItemName }, '1');
  				} else {
  					result1[index] = this.auditorContentObj({ ...i, dataGroupId: this.getDetailData.dataGroupId }, '1');
  				}
  				// console.log(result1[index]);
  			});
  			// 查核行前規劃
  			result2.map((i, index) => {
  				const $filter = (auditorContent as any).filter((j) => j.relProcess === '2').find((k) => k.auditItem === i.auditItem);
  				if ($filter) {
  					result2[index] = this.auditorContentObj({ ...$filter, auditItemName: i.auditItemName }, '2');
  				} else {
  					result2[index] = this.auditorContentObj({ ...i, dataGroupId: this.getDetailData.dataGroupId }, '2');
  				}
  			});
  			this.setrelProcess({
  				relProcess_1: result1,
  				relProcess_2: result2,
  			});
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 工作底稿 API
  // API: 查詢查核項目Section
  getApi_searchSection() {
  	this.setLoading(true);
  	this.$dataCollectApi.searchSectionUsingPOST()
  		.then(async (resp) => {
  			const getData = resp.data.result;
  			const auditorContent = await this.getApi_searchAuditorContent();
  			const auditorContentRelProcess3 = (auditorContent as any).filter((k) => k.relProcess === '3');
  			auditorContentRelProcess3.sort((a, b) => a.relContent.seq - b.relContent.seq);
  			const result3 = this.$global.deepCopyData(getData);

  			Object.keys(result3).map((i, index) => {
  				result3[i].map((j) => {
  					const $filter = auditorContentRelProcess3.find((l) => l.relItem === j.auditProgramSectionId);
  					j.operate = ($filter) ? 'add' : 'modify';
  					j.auditItemName = j.auditItemName || '公版';
  				});
  			});
  			// Vuex
  			this.setrelProcess({
  				relProcess_3_origin: this.$global.deepCopyData(result3),
  			});
  			auditorContentRelProcess3.map((i) => {
  				this.setrelProcess3(i);
  			});
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 取得查核項目內容
  async getApi_searchAuditorContent() {
  	this.setLoading(true);
  	return this.$dataCollectApi.getAuditorContentInDataCollectUsingGET(this.getDetailData.dataGroupId)
  		.then((resp) => resp.data.result)
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => { this.setLoading(false); });
  }

  /**
	 * Event
	 */
  resetSearchSection() {
  	this.getApi_searchSection();
  }

  /**
   * Hook
   */
  destroyed() {
  	// 清空vuex 資料
  	this.delAllRelProcess();
  }

  /**
   * 監聽
   */
  // @Watch('activeTab', { immediate: true })
  // watchActiveTab() {
  // 	this.currentView = `ControlCurrentView${this.activeTab}`;
  // }

  // 有dataGroupId 才打查核項目API
  @Watch('getDetailData.dataGroupId', { immediate: true })
  watchGetDetailData(nV) {
  	if (nV) {
  		this.getApi_getAuditSideMenuArr();
  		this.getRelProcess_3();
  	}
  }

  // 檢查觸發更新
  @Watch('getUpdate.relProcess')
  watchGetUpdate(nV) {
  	if (nV) {
  		this.getApi_getAuditSideMenuArr();
  		this.updated({
  			relProcess: false,
  		});
  	}
  }
}
</script>

<style lang="scss" scoped>
	.dataType__form__card {
		background: $BG-YELLOW;
	}
  ::v-deep .dataType__page {
    padding: 16px 55px;
  }
  ::v-deep {
    .ant-form-item {
      display: flex;
      align-items: flex-start;
      width: 20%;   // 預設 5等份
      margin-top: 4px;
      margin-bottom: 4px;
      .ant-form-item-label {
				line-height: 1.7;
				width: 5em;
        font-weight: 600;
			}
			.ant-form-item-control-wrapper {
				flex: 1 0 5em;
			}
			.ant-form-item-control {
				line-height: initial;
			}
    }
    .ant-input {
			height: auto;
			&[disabled] {
				border: 0;
				border-radius: 0;
				color: $COLOR-DARK;
				background: $COLOR-MAIN7;
			}
		}
		.audit__textarea__input {
			::v-deep .has-error {
				border: 1px solid $COLOR-MAIN17;
			}
		}
		.message--error {
			color: $FORMERROR-TEXT;
			margin-top: 2px;
			margin-bottom: 15px;
			font-size: 14px;
			transition: all 0.3s;
		}
  }
</style>
