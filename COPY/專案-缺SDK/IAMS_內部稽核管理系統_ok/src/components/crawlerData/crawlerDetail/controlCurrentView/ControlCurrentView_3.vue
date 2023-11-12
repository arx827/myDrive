<!-- Tab 工作底稿 -->
<template>
  <div class="audit__page">
    <div class="audit__header d-flex align-items-center mb-2">
      <h4 class="mb-0">
        查核項目
      </h4>
      <a-form-model-item
        v-if="isEdit"
        class="ms-3 me-2"
      >
        <a-radio-group
          v-model="form.auditType"
          :options="auditTypeOptions"
        />
      </a-form-model-item>
      <a-form-model-item v-if="isEdit">
        <a-select
          v-model="form.checkItem"
          :disabled="form.auditType !== 'privateProgramType'"
          :placeholder="(form.auditType === 'privateProgramType') ? '請選擇查核項目' : ''"
          class="audit__header__select ms-1"
          :options="getRelProcess_3Data.privateOptions"
          :dropdown-match-select-width="false"
        />
      </a-form-model-item>
    </div>
    <div
      class="audit__container"
      :class="{'disabled': !isEdit}"
    >
      <div class="audit__sideWrap">
        <ul
          v-if="auditTypeOriginData && auditTypeOriginData.length > 0"
          class="audit__sideMenu"
        >
          <!-- {{ getRelProcess_3Data }} -->
          <template v-if="isEdit">
            <!-- 勾選項目 -->
            <li
              v-for="item in selectAuditArr"
              :key="item"
              class="audit__sideMenu__item d-flex align-items-center audit__sideMenu__item--selected"
              @click="onAddSelectAudit(item)"
            >
              <a-icon
                type="check"
                class="audit__sideMenu__icon"
              />
              {{ `${get_selectAuditDetail(item).sectionName} (${(get_selectAuditDetail(item).auditItemName !== '公版' ? '專屬 ' : '')}${get_selectAuditDetail(item).auditItemName})` }}
            </li>
            <!-- 未勾選項目 -->
            <li
              v-for="item in auditTypeOriginData.filter(i => !selectAuditArr.includes(i.auditProgramSectionId))"
              :key="item.auditProgramSectionId"
              class="audit__sideMenu__item d-flex align-items-center"
              :class="{'audit__borderTop': selectAuditArr.length > 0}"
              @click="onAddSelectAudit(item.auditProgramSectionId)"
            >
              <a-icon
                type="check"
                class="audit__sideMenu__icon"
              />
              {{ item.sectionName }}
            </li>
          </template>

          <!-- 不可編輯，全顯 -->
          <template v-else>
            <li
              v-for="item in getRelProcess_3Data.flat"
              :key="item.auditProgramSectionId"
              class="audit__sideMenu__item d-flex align-items-center"
              :class="{'audit__borderTop': selectAuditArr.length > 0, 'audit__sideMenu__item--selected': selectAuditArr.includes(item.auditProgramSectionId)}"
              @click="onAddSelectAudit(item.auditProgramSectionId)"
            >
              <a-icon
                type="check"
                class="audit__sideMenu__icon"
              />
              {{ `${item.sectionName} (${item.auditItemName !== '公版' ? '專屬 ' : ''}${item.auditItemName})` }}
            </li>
          </template>
        </ul>
        <div
          v-if="isEdit"
          class="audit__sideAddControlWrap d-flex align-items-start"
          :class="{'mt-3': auditTypeOriginData && auditTypeOriginData.length > 0}"
        >
          <span
            class="audit__sideAddControl__title"
          >新增Section</span>
          <a-form-item
            class="audit__sideAddControl__input"
            :validate-status="auditSideAddError ? 'error': ''"
            :help="auditSideAddError? '不得為空': null"
          >
            <a-input
              v-model="addAuditInput"
              @change="auditSideAddError = false"
            />
          </a-form-item>
          <a-button
            class="audit__sideAddControl__btn btn--primary"
            @click="onSaveSideMenu"
          >
            儲存
          </a-button>
        </div>
      </div>
      <div class="audit__textareaGroup">
        <a-collapse
          v-if="selectAuditArr && selectAuditArr.length > 0"
          v-model="activeKey"
        >
          <a-collapse-panel
            v-for="item in selectAuditArr"
            :key="item"
            :header="`${get_selectAuditDetail(item).sectionName} (${(get_selectAuditDetail(item).auditItemName !== '公版' ? '專屬 ' : '')}${get_selectAuditDetail(item).auditItemName})`"
            :show-arrow="false"
          >
            <ul>
              <template v-for="(itemLi, idx) in get_activeDetail(item)">
                <li
                  v-if="itemLi.operate !== 'delete'"
                  :key="idx"
                  class="textarea__item"
                >
                  <div class="d-flex">
                    <div class="main__textarea col">
                      <!-- <a-form-model
												v-if="dataTypeStr == 'A'"
												class="audit__actGroup d-flex align-items-center ms-auto"
											>
												<a-form-model-item>
													<a-input
														v-model="itemLi.relContent.article"
														:disabled="!isEdit"
													/>
												</a-form-model-item>
												<p class="audit__actUnit">
													條
												</p>
												<a-form-model-item>
													<a-input
														v-model="itemLi.relContent.paragraph"
														:disabled="!isEdit"
													/>
												</a-form-model-item>
												<p class="audit__actUnit">
													項
												</p>
												<a-form-model-item>
													<a-input
														v-model="itemLi.relContent.subparagraph"
														:disabled="!isEdit"
													/>
												</a-form-model-item>
												<p class="audit__actUnit">
													款
												</p>
												<a-form-model-item>
													<a-input
														v-model="itemLi.relContent.item"
														:disabled="!isEdit"
													/>
												</a-form-model-item>
												<p class="audit__actUnit">
													目
												</p>
											</a-form-model> -->
                      <a-form-item
                        class="audit__textarea__input w-100 m-0"
                        :validate-status="getCheckValidation.view3.includes(itemLi.dataRelId) ? 'error' : ''"
                      >
                        <a-textarea
                          v-model="itemLi.relContent.content"
                          class="audit__textarea"
                          :rows="2"
                          :disabled="!isEdit"
                          @change="clearCheckValidation({key: '3', auditItem: itemLi.dataRelId})"
                        />
                      </a-form-item>
                      <p
                        v-if="getCheckValidation.view3.includes(itemLi.dataRelId)"
                        :key="`contentError${idx}`"
                        class="text-end message--error"
                      >
                        不得為空
                      </p>
                    </div>
                    <div class="textarea__control d-flex align-items-start">
                      <button
                        v-if="isEdit"
                        class="btn__icon btn__icon--add_project"
                        @click="addTextareaArr(getRelProcess_3, itemLi, idx)"
                      />
                      <CustomPopConfirm
                        v-if="isEdit"
                        @confirm="removeTextareaArr(getRelProcess_3, itemLi)"
                      >
                        <button
                          class="btn__icon btn__icon--delete-action"
                        />
                      </CustomPopConfirm>
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { Action, Getter, namespace } from 'vuex-class';

const detailModule = namespace('crawlerDataDetailVuex');
const modalControl = namespace('modalControl');

@Component({
	components: {
		CustomPopConfirm,
	},
})
export default class ControlCurrentView_3 extends Vue {
	@Action('setLoading') setLoading;

	@detailModule.Getter('getDetailData') getDetailData;

	@detailModule.Action('setrelProcess3') setrelProcess3;

	@detailModule.Action('delRelProcess3') delRelProcess3;

	@detailModule.Getter('getRelProcess_3') getRelProcess_3;

	@detailModule.Getter('getRelProcess_3Data') getRelProcess_3Data;

	@detailModule.Getter('getCheckValidation') getCheckValidation;

	@detailModule.Action('clearCheckValidation') clearCheckValidation;

	@modalControl.Action('setModalState') setModalState;

	@detailModule.Getter('getAccountAgentList') getAccountAgentList;

	@Prop()
  dataTypeStr: string;

	// 權限
	get roleId() {
		return this.$global.getCurrentRole().id;
	}

	get isEdit() {
		const confirmStatus = this.getDetailData.groupStatus;
  	const confirmIsMe = [this.$user.getMe().employee.domainId, ...this.getAccountAgentList].includes(this.getDetailData.confrimUser);
  	// 權限為組長 或 查核人員，而且 資料確認人員 為自己
  	if (['ROLE_Audit_Team_Head', 'ROLE_Auditor'].includes(this.roleId) && confirmIsMe && confirmStatus === 'A') {
  		// 權限為組長 而且 資料確認人員 為自己
  		return true;
  	}
  	return false;
	}

	form = {
		auditType: '',
		checkItem: undefined,
	}

	// 專屬 查核項目 下拉
	checkItemOption = [];

	// 模式 enum
	auditTypeOptions = [
		{
			label: '公版',
			value: 'publicProgramType',
		},
		{
			label: '專屬',
			value: 'privateProgramType',
		},
	];

	// 原始 Type對應的查核項目 資料
	get auditTypeOriginData() {
		if (this.form.auditType === 'publicProgramType') {
			return this.getRelProcess_3Data.origin.publicProgramType;
		}
		return this.getRelProcess_3Data.origin.privateProgramType.filter((i) => i.auditItem === this.form.checkItem);
	}

	// 取得未勾選項目
	get auditTypeSelectData() {
		return '';
	}

	// 勾選項目
	selectAuditArr: string[] = [];

	// 全部勾選項目 詳細資料
	get selectAuditArrDetail() {
		return this.getRelProcess_3Data.flat.filter((i) => this.selectAuditArr.includes(i.auditProgramSectionId));
	}

	// 取得對應的勾選項目 詳細資料
	get_selectAuditDetail(relItem) {
		return this.selectAuditArrDetail.find((i) => i.auditProgramSectionId === relItem);
	}

	// 右方展開對應的 textarea
	get_activeDetail(relItem) {
		return this.getRelProcess_3.filter((i) => i.relItem === relItem).sort((a, b) => a.relContent.seq - b.relContent.seq);
	}

	// 右側開啟的 collapse id
	activeKey = [];

	addAuditInput = '';

	auditCatchArr = [];

	// 新增查核項目 檢核顯示/隱藏
	auditSideAddError = false;

	auditorContentObj(data, auditProgramSectionId) {
  	// console.log('data =>', data);
		// console.log(this.getDetailData);
		const findSection = this.selectAuditArrDetail.find((i) => i.auditProgramSectionId === auditProgramSectionId);

  	return {
  		dataRelId: '',
  		dataGroupId: this.getDetailData.dataGroupId || '',
  		dataGroupLogId: '',
  		operate: data.operate || 'modify',
  		relProcess: '3',
  		relId: data.id || '',
  		relItem: auditProgramSectionId || '',
  		auditItem: findSection.auditItem || null,
  		auditItemName: (findSection.auditItemName) ? (findSection.auditItemName !== '公版') ? findSection.auditItemName : '' : '' || '',
  		relContent: {
  			content: data.content || '',
  			article: '',
  			paragraph: '',
  			subparagraph: '',
  			item: '',
				seq: data.seq || 0,
  		},
  	};
	}

	selectAuditArrSort() {
		this.selectAuditArr.sort((a, b) => {
			const $public = this.getRelProcess_3Data.origin.publicProgramType.map((i) => i.auditProgramSectionId);
			if ($public.includes(a)) {
				if ($public.includes(b)) {
					return a.localeCompare(b);
				}
				return -1;
			}
			if ($public.includes(b)) {
				return 1;
			}
			return a.localeCompare(b);
		});
	}

	/**
   * Event
   */
	// 勾選 側邊選單
	onAddSelectAudit(auditProgramSectionId) {
		if (this.isEdit) {
			if (this.selectAuditArr.includes(auditProgramSectionId)) {
				this.selectAuditArr.splice(this.selectAuditArr.indexOf(auditProgramSectionId), 1);
				this.delRelProcess3(auditProgramSectionId);
			} else {
				this.selectAuditArr.push(auditProgramSectionId);
				this.selectAuditArrSort();
				this.getApi_getAuditProgramContents(auditProgramSectionId);
			}
			this.activeKey.map((i, idx) => {
				if (!this.selectAuditArr.includes(i)) {
					this.activeKey.splice(idx, 1);
				}
			});
		} else {
			return false;
		}
	}

	// 新增 右邊區塊 細項
	addTextareaArr(arr, relItem, idx) {
		// 該筆資料 在全部index中的序號(新增前)
		const allIdx = arr.indexOf(relItem);

		// 新增項目
		arr.splice(allIdx + 1, 0, this.auditorContentObj({ operate: 'add' }, relItem.relItem));

		// 重算序號
		arr
			.filter((i) => i.operate !== 'delete' && i.relItem === relItem.relItem)
			.map((i, arrIdx) => {
				if (i.operate !== 'delete') {
					i.relContent.seq = arrIdx + 1;
					i.operate = 'add';
				}
			});
	}

	// 刪除 右邊區塊 細項
	removeTextareaArr(arr, relItem) {
		// 該筆 項數 (在所有Section中的位置)
		const currentNo = arr.indexOf(relItem);

		// 已有 dataRelId 更改 operate， 無 則直接刪除
		if (relItem.relId) {
			// 更改 operate
			arr[currentNo].operate = 'delete';
		} else {
			// 移除項目
			arr.splice(currentNo, 1);
		}

		// 重算序號
		arr
			.filter((i) => i.operate !== 'delete' && i.relItem === relItem.relItem)
			.map((i, arrIdx) => {
			// 排除篩除項目
				if (i.operate !== 'delete') {
					i.relContent.seq = arrIdx + 1;
					i.operate = 'add';
				}
			});

		// 計算該Section 是否還有項目，沒有的話，取消側邊勾選項目
		const currentAuditArr = arr.filter((i) => i.relItem === relItem.relItem && i.operate !== 'delete');
		if (currentAuditArr.length < 1) {
			this.onAddSelectAudit(relItem.relItem);
		}
	}

	// 新增 Section
	onSaveSideMenu() {
		const inputText = this.addAuditInput.trim();
  	if (!inputText) {
  		this.auditSideAddError = true;
  		return false;
  	}
		const programType = (this.form.auditType === 'publicProgramType') ? 'public' : 'private';
		this.getApi_createSession({
			auditItem: this.form.checkItem,
			programType,
			sectionName: this.addAuditInput,
		});
	}

	/**
   * API
   */
	// API: 新增Section
	getApi_createSession({ auditItem, programType, sectionName }) {
		this.setLoading(true);
		this.$dataCollectApi.createSessionUsingPOST({ auditItem, programType, sectionName })
  		.then((resp) => {
  			const getData = resp.data.result;
				this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '新增Section成功',
  					autoClose: 3,
  				},
  			});
				this.addAuditInput = '';
				this.$emit('resetSearchSection');
  		})
  		.catch((err) => {
  			console.log(err);
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '新增Section失敗',
						content: err.response.data.message,
					},
				});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 查詢Section查核程式
	getApi_getAuditProgramContents(auditProgramSectionId) {
		this.setLoading(true);
		this.$dataCollectApi.getAuditProgramContentsUsingGET(auditProgramSectionId)
  		.then((resp) => {
  			const getData = resp.data.result;
				const result3 = this.$global.deepCopyData(getData.auditProgramContents);
				let setrelProcess = [];
				// 若無資料，則新增一筆空資料
				if (result3.length > 0) {
					setrelProcess = result3.map((i) => this.auditorContentObj({ ...i, operate: 'add' }, auditProgramSectionId));
				} else {
					setrelProcess = [this.auditorContentObj({ operate: 'add', seq: 1 }, auditProgramSectionId)];
				}

				const oldAuditItemRelProcess3Arr = this.getRelProcess_3.map((i) => i.relId);
				setrelProcess.map((i) => {
					if (!oldAuditItemRelProcess3Arr.includes(i.relId) || !i.relId) {
						this.setrelProcess3(i);
					}
				});
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	/**
   * Hook
   */
	async mounted() {
		// 預設 check 專屬
		this.form.auditType = 'privateProgramType';

		// default selectAuditArr
		const defaultSelectAuditArr = this.getRelProcess_3Data.flat.filter((i) => i.operate === 'add');
		this.selectAuditArr = defaultSelectAuditArr.map((i) => i.auditProgramSectionId);
		this.selectAuditArrSort();
		this.activeKey = [...this.selectAuditArr];
	}

	/**
   * 監聽
   */
	// 切換 公版/專屬
	@Watch('form.auditType', { deep: true })
	watchForm(nV) {
		this.$nextTick(() => {
			if (nV === 'privateProgramType') {
				this.form.checkItem = this.getRelProcess_3Data.privateOptions[0]?.value;
			} else {
				this.form.checkItem = undefined;
			}
		});
	}
}
</script>

<style lang="scss" scoped>
.audit__container {
	display: flex;
	flex-wrap: wrap;
}
.audit__header {
	.ant-form-item {
		width: auto;
	}
}
.audit__header__select {
	min-width: 15em;
}
.audit__sideWrap {
	width: 100%;
	margin-bottom: 20px;
	@include rwd-lg {
		margin-bottom: 0;
		max-width: 460px;
	}
}
.audit__sideMenu {
	border: 1px solid $COLOR-GRAY1;
	box-shadow: 0 2px 8px rgba(0, 0, 0, .16);
	.audit__act__icon {
		color: $BUTTON-DARK;
	}
}
.audit__sideAddControlWrap {
	// .btn__icon--add_project {
	// 	border: 0;
	// 	cursor: pointer;
	// 	display: block;
	// 	width: 27px;
	// 	height: 22px;
	// 	background-repeat: no-repeat;
	// 	background-size: contain;
	// 	background-image: url('~@images/icon/icon_add_project.svg');
	// 	background-color: #FFF;
	// }
	.audit__sideAddControl__title {
		white-space: nowrap;
		margin: 4px 0;
    line-height: 32px;
	}
	.audit__sideAddControl__input {
		margin-right: 10px;
		margin-left: 10px;
		flex: 1;
	}
	.audit__sideAddControl__btn {
		margin: 4px 0;
	}
}
.audit__sideMenu__item {
	font-size: 14px;
	padding: 10px;
	border: 1px solid $COLOR-LIGHT;
	cursor: pointer;
	word-break: break-word;
	::v-deep .btn__delete {
		padding: 0 10px;
	}
	&.audit__sideMenu__item--selected {
		background: $COLOR-MAIN4;
		.audit__sideMenu__icon {
			visibility: visible;
		}
	}
}
.audit__sideMenu__icon {
	color: $COLOR-MAIN1;
	visibility: hidden;
}

.audit__textareaGroup {
	flex: 1;
	@include rwd-lg {
		margin-left: 20px;
	}
  .ant-collapse {
    background: $COLOR-LIGHT;
    ::v-deep {
      .ant-collapse-header {
        color: $FONT-PRIMARY;
        // padding-left: 22px;
      }
    }
  }
  ::v-deep {
    .ant-collapse-content-box {
      padding: 0;
    }
  }
  .textarea__item {
    padding: 16px;
    + .textarea__item {
      border-top: 1px solid $COLOR-MAIN15;
    }
  }
  .ant-form-item {
    margin-top: 0;
    flex: 0;
  }
  .textarea__control {
    margin-left: 10px;
		margin-top: 10px;
    .btn__icon {
      width: 24px;
      height: 24px;
      border: 0;
      cursor: pointer;
      + .btn__icon {
        margin-left: 10px;
      }
    }
    .btn__icon--add_project {
      background: url('~@images/icon/icon_add_project.svg') #FFF no-repeat 100%;
    }
    .btn__icon--delete-action {
      background: url('~@images/icon/icon_delete-action.svg') #FFF no-repeat 100%;
    }
  }
  .audit__textarea {
    margin-top: 5px;
  }

	.ant-collapse {
		border: 0;
	}

	.ant-collapse-item {
		border: 1px solid #d9d9d9;
    border-radius: 5px;
    overflow: hidden;
		+ .ant-collapse-item {
			margin-top: 15px;
		}
	}
}

.audit__textarea__item {
	border: 1px solid $COLOR-MAIN5;
	.audit__textarea__header {
		border-bottom: 1px solid $COLOR-MAIN15;
		color: $COLOR-MAIN1;
		padding: 8px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		::v-deep {
			.audit__act__icon {
				margin-left: auto;
				svg {
					font-size: 25px;
				}
			}
		}
	}
	.audit__textarea {
		border: 0;
		padding: 18px 20px;
		font-size: 16px;
	}
	+ .audit__textarea__item {
		margin-top: 20px;
	}
}

.audit__actGroup {
	::v-deep {
		.ant-form-item-control {
			width: 4em;
		}
		.audit__actUnit {
			margin-left: 5px;
			margin-right: 5px;
			margin-bottom: 0;
		}
	}
}

.audit__borderTop {
	border-top: 1px solid #eee;
}

// disabled 樣式
.audit__container {
	&.disabled {
		.audit__sideMenu {
			background: $BG-GRAY;
		}
		.audit__sideMenu__item {
			border: 1px solid $BG-GRAY;
			cursor: auto;
		}
		.ant-input {
			&[disabled] {
				background: $COLOR-GRAY2;
				border-radius: 4px;
			}
		}
		::v-deep {
			.ant-collapse-header,
			.ant-collapse-content {
				background: $BG-GRAY;
			}
		}
	}
}
</style>
