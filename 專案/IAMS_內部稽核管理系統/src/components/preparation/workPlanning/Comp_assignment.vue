<template>
  <!-- 查核範圍與工作分配 -->
  <div>
    <div class="d-flex justify-content-end">
      <a-button
        v-if="isLeader"
        class="add__btn"
        @click="addRow()"
      >
        新增
      </a-button>
    </div>
    <fbl-data-grid
      class="preparation-table"
      :row-key="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="false"
      :scroll="{ x: true }"
    >
      <template #handleTemp="slotProps">
        <div class="table__control d-flex mx-auto">
          <i
            class="btn__icon--edit-acion"
            :disabled="!isLeader"
            @click="() => (!isLeader) ? false : editRow(slotProps.data)"
          />
          <CustomPopConfirm
            title="確認刪除？"
            :disabled="!isLeader"
            @confirm="deleteRow(slotProps.data)"
          >
            <i
              class="btn__icon--delete-action ms-3"
              :disabled="!isLeader"
            />
          </CustomPopConfirm>
        </div>
      </template>
      <template #workPoint="{text}">
        <div>{{ text }}</div>

        <!-- 若要顯示斷行，改用此段 -->
        <!-- <pre>
        	<div v-html="text" />
				</pre> -->
      </template>
    </fbl-data-grid>
    <InfoModal
      :title="`${modelTitle}查核範圍與工作分配`"
      :visible="addAndEditData.visible"
      :centered="true"
      :width="768"
    >
      <template slot="content">
        <div class="container modal__main  mt-2">
          <a-form-model
            ref="formRef"
            :model="form"
            :hide-required-mark="true"
            :rules="formRules"
            :label-col="{span: 5}"
            :wrapper-col="{span: 19}"
            :label-align="'right'"
          >
            <a-form-model-item
              prop="workContent"
              :label="'Section'"
            >
              <a-input
                v-model="form.workContent"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="workPoint"
              :label="'查核重點'"
            >
              <a-textarea
                v-model="form.workPoint"
                class="list__item__textarea"
                :rows="8"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="itemDescs"
              :label="'相關部門'"
            >
              <a-tree-select
                v-model="form.itemDescs"
                class="itemDescs__select"
                mode="multiple"
                :tree-data="selectOption.units"
                tree-checkable
                :tree-default-expand-all="true"
                tree-node-filter-prop="title"
                dropdown-class-name="treeselect"
                :dropdown-style="{'maxHeight': '300px'}"
                :show-arrow="true"
                :dropdown-match-select-width="false"
                :disabled="!isLeader"
                placeholder="請選擇相關部門"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="auditors"
              :label="'查核人員'"
            >
              <a-select
                v-model="form.auditors"
                placeholder="請選擇查核人員"
                mode="multiple"
                :show-arrow="true"
                :dropdown-match-select-width="false"
              >
                <a-select-option
                  v-for="item in selectorMember"
                  :key="item.domainId"
                  :value="item.domainId"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div
          class="d-flex mt-4 justify-content-end"
        >
          <button
            class="btn--primary me-2"
            @click="submit"
          >
            確認
          </button>
          <button
            class="btn--dark ms-2"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </template>
    </InfoModal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, PropSync,
} from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { uuid } from 'vue-uuid';

const modalModule = namespace('modalControl');

@Component({
	components: {
		FblDataGrid,
		InfoModal,
		CustomPopConfirm,
	},
})
export default class Assignment extends Vue {
	@Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

  @Prop()
  role: string;

	@PropSync('tabsData')
	tabsDataSync;

	@Prop()
	selectOption;

	@Prop()
	showData;

	// 只有領隊才可以編輯
  @Prop()
  isLeader: boolean;

	// 彈窗 新增/編輯
	addAndEditData: {
		visible: boolean;
		type: string;
		quarterWorkDId?: string;
	} = {
		visible: false,
  	type: '',
	}

	form = {
		workContent: '',	// 查核內容
		workPoint: '', // 查核重點
		itemDescs: [], // 相關部門
		auditors: [], // 查核人員
	}

	// 限縮 查核人員 產生下拉
	get selectorMember() {
		return this.selectOption.member.filter((i) => this.showData.checkMansArr.includes(i.domainId));
	}

	formRules: { [key: string]: ValidationRule[] } ={
  	workContent: [{ required: true, message: '請填寫查核內容', trigger: 'change' }],
  	workPoint: [{ required: true, message: '請填寫查核重點', trigger: 'change' }],
  	// itemDescs: [{ required: true, message: '請選擇相關部門', trigger: 'change' }],
  	// auditors: [{ required: true, message: '請選擇查核人員', trigger: 'change' }],
	}

  // FblPDataGridHolder<>
  grid = {
  	rowKey: 'quarterWorkDId',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'workContent',
  			title: 'Section',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'workPoint',
  			template: 'workPoint',
  			title: '查核重點',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'itemDescs',
  			title: '相關部門',
  			width: '150px',
  			formatter: (data) => data.itemDescs?.map((i) => `${i.departmentName}`).join('、'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'auditors',
  			title: '查核人員',
  			width: '150px',
  			formatter: (data) => data.auditors?.map((i) => i.name).join('、'),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: '',
  			template: 'handleTemp',
  			title: '',
  			width: '90px',
  			fixed: 'right',
  		},
  	],
  };

  get modelTitle() {
  	switch (this.addAndEditData.type) {
  	case 'add':
  		return '新增';
  	case 'edit':
  		return '編輯';
  	default:
  		return '';
  	}
  }

  resetFormData() {
  	this.form = {
  		workContent: '',	// 查核內容
  		workPoint: '', // 查核重點
  		itemDescs: [], // 相關部門
  		auditors: [], // 查核人員
  	};
  }

  addRow() {
  	this.resetFormData();
  	this.addAndEditData = {
  		visible: true,
  		type: 'add',
  	};
  }

  editRow(rowData) {
  	// console.log(rowData);
  	// console.log(rowData.itemDescs[0].departmentId.toUpperCase());
  	this.addAndEditData = {
  		visible: true,
  		type: 'edit',
  		quarterWorkDId: rowData.quarterWorkDId,
  	};
  	this.form = {
  		workContent: rowData.workContent,
  		workPoint: rowData.workPoint,
  		itemDescs: rowData.itemDescs?.map((i) => i.departmentId.toUpperCase()),
  		auditors: rowData.auditors?.map((i) => i.domainId.toUpperCase()),
  	};

  	// console.log(this.selectOption);
  }

  deleteRow({ quarterWorkDId }) {
  	if ((/^workNew/).test(quarterWorkDId)) {
  		// 不是系統帶出的，自己手動暫存的資料，直接刪除
  		const thatData = this.tabsDataSync.find((i) => i.quarterWorkDId === quarterWorkDId);
  		this.tabsDataSync.splice(this.tabsDataSync.indexOf(thatData), 1);

  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'success',
  				title: '刪除成功',
  				autoClose: 3,
  			},
  		});
  	} else {
  		// 呼叫API
  		this.$emit('click', {
  			type: 'deleteAssignment',
  			params: {
  				quarterWorkDId,
  			},
  		});
  	}
  }

  // 篩選 不在下拉選項內的 查核人員 及 領隊人員
  filterAuditMenber() {
  	const allMemberDomainId = this.selectOption.member.map((i) => i.domainId);
  	this.showData.checkMansArr = this.showData.checkMansArr.filter((i) => allMemberDomainId.includes(i));
  }

  // 暫存，並未送出
  submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.addAndEditData.visible = false;
  			switch (this.addAndEditData.type) {
  			case 'add':
  				this.tabsDataSync.push({
  					quarterWorkDId: `workNew${uuid.v4()}`,
  					delete: false,
  					seq: 1,
  					workContent: this.form.workContent,
  					workPoint: this.form.workPoint,
  					itemDescs: (this.showData.itemDescs) ? this.showData.itemDescs.map((i) => {
  						const thatUnit = [...this.selectOption.units[0].children, ...this.selectOption.units[1].children].find((j) => j.key === i);
  						return {
  							departmentId: (thatUnit) ? thatUnit.key : i,
  							departmentName: (thatUnit) ? thatUnit.label : '',
  						};
  					}) : this.showData.itemDescs,
  					auditors: this.form.auditors?.map((i) => this.selectOption.member.find((j) => j.domainId === i)),
  					operate: 'add',
  				});
  				break;
  			case 'edit':
  				const thatData = this.tabsDataSync.find((i) => i.quarterWorkDId === this.addAndEditData.quarterWorkDId);
  				thatData.workContent = this.form.workContent;
  				thatData.workPoint = this.form.workPoint;
  				thatData.itemDescs = this.form.itemDescs?.map((i) => {
  					const thatUnit = [...this.selectOption.units[0].children, ...this.selectOption.units[1].children].find((j) => j.key === i);
  					return {
  						departmentId: (thatUnit) ? thatUnit.key : i,
  						departmentName: (thatUnit) ? thatUnit.label : '',
  					};
  				}).filter((k) => k.departmentName !== '');
  				thatData.auditors = this.form.auditors?.map((i) => this.selectOption.member.find((j) => j.domainId === i));
  				thatData.operate = 'modify';
  				break;
  			}
  		}
  	});
  }

  closeModal() {
  	this.addAndEditData.visible = false;
  }

  created() {
  	// console.log('selectOption =>', this.selectOption);
  }

	@Watch('tabsDataSync', { immediate: true, deep: true })
  watchTabsData(nV) {
  	this.grid.data = nV;
  	// console.log(nV);
  }

	@Watch('showData', { immediate: true, deep: true })
	watchShowData(nV) {
  	// console.log(nV);
  	// console.log(nV.checkMansArr);
		// console.log(this.selectOption.member);
  	// console.log(this.tabsDataSync.filter((i) => {
		// 	i.auditors.map((j) => {
		// 		j.domainId.
		// 	})
		// }));

		// 情境 => 解決從工作規劃表 刪除查核人員，工作分配要跟著移除
		this.tabsDataSync.map((i) => {
			i.auditors = i.auditors.filter((j) => nV.checkMansArr.includes(j.domainId));
		});
	}
}
</script>

<style lang="scss" scoped>
.add__btn {
	@include button_base($BUTTON-LIGHT, $BUTTON-DARK, $BUTTON-DARK, $FONT-LIGHT, $BUTTON-DARK, $BUTTON-DARK, 4px, 13px,);
	line-height: 0;
	height: 26px;
	padding: 2px 20px;
	margin-bottom: 5px;
}
.modal__main {
	padding: 25px 75px;
  background-color: $BG-LIGHT;
}
.itemDescs__select {
	::v-deep {
		.ant-select-selection {
			padding-right: 40px;
		}
	}
}
</style>
