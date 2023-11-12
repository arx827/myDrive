<template>
  <InfoModal
    title="查核人員編輯"
    :visible="visible"
    :closable="false"
    @closeModal="close"
  >
    <template slot="content">
      <div class="content">
        <button
          class="btn--action mb-1 ms-auto"
          @click="addNewItem"
        >
          新增
        </button>
        <fbl-data-grid
          class="table--pale"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :bordered="true"
          :pagination="false"
        >
          <template
            v-slot:modifySelect="grid"
          >
            <a-form-model
              ref="form"
              :model="grid"
            >
              <a-form-model-item
                :key="grid.data.auditor.key"
                :prop="grid.data.modifyAuditor"
                :rules="{validator: grid.data.operate=='add' ? addAuditorValidator : null}"
              >
                <a-select
                  :key="grid.rowKey"
                  v-model="grid.data.modifyAuditor"
                  :allow-clear="true"
                  :show-search="true"
                  class="select--min-width"
                  placeholder="請選擇人員"
                >
                  <a-select-option
                    v-for="(auditor) in allAuditor"
                    :key="auditor.key"
                    :value="`${auditor.value}`"
                  >
                    {{ auditor.value }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-form-model>
          </template>
        </fbl-data-grid>
      </div>
      <div
        class="d-flex mt-4 justify-content-end"
      >
        <button
          class="btn--primary me-2"
          :disabled="isConfirm || isRepeat || disableConfirmDoubleCheck"
          @click="confirmModal"
        >
          確定
        </button>
        <button
          class="btn--dark ms-2"
          @click="cancel"
        >
          取消
        </button>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import { uuid } from 'vue-uuid';
import { UpdateAuditorRequestVO } from '@fubonlife/iams-api-axios-sdk';

const modalControl = namespace('modalControl');

interface GridData {
		rowKey?: string;
		auditor?: { key: string; value: string };
		modifyAuditor?: string;
		operate: string;
}

@Component({ components: { InfoModal, FblDataGrid } })
export default class EditAuditorModal extends Vue {
	@Action('setLoading') setLoading;

  @Prop()
  visible: boolean

	@Prop()
	auditDraftContentId: string

	@Prop()
	draftAuditor: []

	@modalControl.Action('setModalState') setModalState; // 全域 狀態彈窗

	allAuditor = [];

	request: UpdateAuditorRequestVO;

	// 不重複的，放在選單
	notRepeatAuditor = [];

	// 表格內容
	grid: FblPDataGridHolder<GridData> = {
		rowKey: 'rowKey',
		data: [],
		pagination: null,
		columns: [
			{
				title: '姓名',
				type: FblColumnType.PLAIN,
				property: 'auditor.value',
				width: '40%',
			},
			{
				title: '調整後',
				type: FblColumnType.TEMPLATE,
				template: 'modifySelect',
				property: 'modify',
				width: '60%',
			},
		],
	}

	// 若為true則disabled
	isConfirm: boolean = true;

	// 表單驗證是否validate通過，若repeat則為true 則disable送出紐
	isRepeat: boolean = false;

	// 表單驗證addItem項目是否重複
	isAddRepeat: boolean = false;

	// DoubleCheck: 因為validate針對該按鈕，因此在確認一次是否有不符合驗證的狀況，才可以確認 (true是disabled)
	disableConfirmDoubleCheck: boolean = false

	/**
 * Event
 */

	// --------------- custom validate event ----s---------
	addAuditorValidator(rule, value, callback) {
		this.disableConfirmDoubleCheck = false;
		this.filterAuditor();
		this.isRepeat = false;
		this.isAddRepeat = false;
		const addItem = this.grid.data.filter((item) => item.operate === 'add');
		const addItemModifyAuditor = addItem.map((item) => item.modifyAuditor).filter((item) => item !== undefined);
		const isAuditorsRepeat = new Set(addItemModifyAuditor).size !== addItemModifyAuditor.length;
		const isAddAuditorUndefined = addItemModifyAuditor.some((item) => item !== undefined);

		addItemModifyAuditor.forEach((addItem) => {
			if (this.notRepeatAuditor.some((item) => item === addItem) || isAuditorsRepeat) {
				this.disableConfirmDoubleCheck = true;
			}
		});
		if (this.notRepeatAuditor.some((item) => item == rule.field) && isAddAuditorUndefined) {
			this.isRepeat = true;
			callback('此人員已被選擇'); // 比對modify的auditor或已選的modifyAuditor，若選到則提示
		}
		if (isAuditorsRepeat && isAddAuditorUndefined) {
			this.isAddRepeat = true;
			callback('此人員已被選擇');
		}
		callback();
	}

	// ------------- End of custom validate event -----------

	// 新增按鈕
	addNewItem() {
		this.grid.data.push(
			{
				rowKey: `add${uuid.v4()}`,
				auditor: { key: undefined, value: undefined },
				modifyAuditor: undefined,
				operate: 'add',
			},
		);
	}

	// 過濾auditor
	filterAuditor() {
		const modifyItem = this.grid.data.filter((item) => item.operate === 'modify');
		this.notRepeatAuditor = [];
		modifyItem.forEach((item) => {
			if (!this.notRepeatAuditor.includes(item.modifyAuditor || item.auditor.value)) {
				this.notRepeatAuditor.push(item.modifyAuditor || item.auditor.value);
			}
		});
	}

	// reset() {
	// 	this.grid.data = [];
	// 	this.getRawData();
	// }

	// 取消
	cancel() {
		// this.reset();
		this.close();
	}

	close() {
  	this.$emit('closeModal');
	}

	getRawData() {
		console.log('getRawData');
		// ----------------------------改成map
		this.grid.data = this.draftAuditor.map((auditorItem) => ({
			rowKey: `add${uuid.v4()}`,
			auditor: auditorItem,
			modifyAuditor: undefined,
			operate: 'modify',
		}));
		// this.draftAuditor.forEach((element, index) => {
		// 	this.grid.data.push(
		// 		{
		// 			rowKey: `add${uuid.v4()}`,
		// 			auditor: element,
		// 			modifyAuditor: undefined,
		// 			operate: 'modify',
		// 		},
		// 	);
		// });
		// this.grid.data = this.$global.deepCopyData(this.fakeData);
	}

	getSectionAuditor() {
		const $query = this.$global.getParam().query.checkMan;
		this.allAuditor = $query.map((section) => ({ key: section.domainId, value: section.name }));
		// $query.forEach((section) => {
		// 	this.allAuditor.push({ key: section.domainId, value: section.name });
		// });
	}

	confirmModal() {
		let title = '新增' || '修改';
		// 刪除多新增的add
		const addItem = this.grid.data.filter((item) => item.operate === 'add' && item.modifyAuditor == undefined);
		addItem.forEach((item) => {
			this.grid.data.splice(this.grid.data.indexOf(item), 1);
		});
		const nonEmptyModify = this.grid.data.filter((item) => item.modifyAuditor !== undefined); // 選出有選擇東西的item
		nonEmptyModify.forEach((item) => {
			const modifyKey = this.allAuditor.find((item1) => item1.value === item.modifyAuditor).key;
			if (modifyKey) {
			// 將API資料中的auditor改為指定格式
				this.request.auditors.push({
					auditor: item.auditor.key ? item.auditor.key : ' ',
					modifyAuditor: modifyKey || '', // 想要將獲得的item.modifyAuditor轉為她對應的key直
					operate: item.operate,
				});

				switch (this.grid.data.some((item) => item.operate === 'add')) {
				case true: { // 1. 只有新增 2. 新增加修改
					title = '新增';
					item.operate = 'modify';
					break;
				}
				case false: { // 就只有編輯
					title = '編輯';
					break;
				}
				}
			}

			// item.modifyAuditor = undefined;

			setTimeout(() => {
			// item.auditor = { key: modifyKey, value: item.modifyAuditor };
				item.modifyAuditor = undefined;
			}, 100);
		});

		// setTimeout(() => {
		// 	this.fakeData = this.$global.deepCopyData(this.grid.data);
		// }, 3000);
		this.getAPI_updateAuditor(title);
	}

	/**
 * Hook
 */
	created() {
		// this.reset();
		this.getSectionAuditor();
		this.request = {
			auditDraftContentId: this.auditDraftContentId,
			auditors: [], // 要改或加的auditor
		};
		// this.getRawData();
	}

	get returnModifyAuditor() { // 幫watch取得目前選擇的modifyAuditor
		return this.grid.data.map((item) => (item.modifyAuditor));
	}

	@Watch('returnModifyAuditor', { immediate: true })
	modifyAuditorChange(newData, oldData) {
		// console.log('watch returnModifyAuditor:', newData);
		this.filterAuditor();
		this.isConfirm = !newData.some((item: any) => item !== undefined);
	}

	@Watch('visible')
	isVisible(visible) {
		if (visible) {
			this.getRawData();
		}
	}

	/**
 * API
 */

	// 對於modifyAuditor對應key的想法: 在要交出去時，才把他的value->key
	// API: 調整查核內容的查核人員
	getAPI_updateAuditor(title) {
		this.setLoading(true);
		this.$workPaperApi.updateDraftContentAuditorUsingPOST(this.request)
			.then((resp) => {
				if (resp.data.success) {
					console.log('調整查核內容查核人員', resp);
					this.$emit('reloadDraft');
					this.close(); // 成功關閉彈窗
				} else {
					console.log('調整查核內容查核人員', resp.statusText);
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: `${title}失敗`,
							content: resp.statusText,
						},
					});
				}
			})
			.catch((err) => {
				console.log('err', err.response);
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: `${title}失敗`,
						content: err.response.data.status,
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
				this.request.auditors = [];
			});
	}
}
</script>

<style lang="scss" scoped>
.content{
	background: white;
	padding: 10px;
	margin-top: 10px;
	margin-bottom: -10px;
	display: flex;
	flex-direction: column;
}
.select--min-width{
	min-width: 100px;
	width: 130px;
}
::v-deep{
	.table--pale .ant-table .ant-table-tbody > tr > td{
		vertical-align: middle;
	}
}
</style>
