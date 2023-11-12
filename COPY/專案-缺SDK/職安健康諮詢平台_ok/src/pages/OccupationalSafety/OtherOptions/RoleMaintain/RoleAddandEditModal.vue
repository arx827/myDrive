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
      <a-form-model
        ref="formRef"
        :model="form"
        :hide-required-mark="true"
        :colon="false"
        :rules="formRules"
      >
        <div class="modal-container">
          <div class="modal-container__title">
            {{ type === 'edit' ? '編輯' : '新增' }}角色
          </div>
          <div class="modal-container__event__block mb-0">
            <div class="option__block">
              <a-form-model-item
                prop="roleName"
                :rules="formRules.roleName"
              >
                <span slot="label">
                  角色名稱 <div class="mark-required"> * </div>
                </span>
                <a-input
                  v-model="form.roleName"
                  class="input__block"
                  placeholder="e.g. 系統管理員"
                />
              </a-form-model-item>
            </div>
            <div class="option__block">
              <a-form-model-item
                prop="remark"
              >
                <span slot="label">
                  備註  <div class="mark-required__desc"> 字數上限100字 </div>
                </span>
                <a-textarea
                  v-model="form.remark"
                  placeholder="字數上限100字。"
                  :max-length="100"
                  :auto-size="{ minRows: 3 }"
                  size="large"
                />
              </a-form-model-item>
            </div>
            <a-form-model-item
              prop="enabled"
              :rules="formRules.enabled"
            >
              <span slot="label">
                是否啟用 <div class="mark-required"> * </div>
              </span>
              <a-radio-group
                v-model="form.enabled"
                class="row"
              >
                <div class="col-3">
                  <a-radio
                    value="1"
                    class="radio__block"
                  >
                    是
                  </a-radio>
                </div>
                <div class="col-3">
                  <a-radio
                    value="2"
                    class="radio__block"
                  >
                    否
                  </a-radio>
                </div>
              </a-radio-group>
            </a-form-model-item>
            <hr class="hr__line hr__line--margin">
            <a-form-model-item
              prop="menuSelectedRowKeys"
              :rules="formRules.menuSelectedRowKeys"
            >
              <span
                slot="label"
                class="d-flex justify-content-between"
              >
                <div class="input__title">
                  功能明細  <div class="mark-required">
                    *
                  </div>
                </div>
                <a-input-search
                  v-model="searchValue"
                  class="input__searchBar"
                  placeholder="你想查詢什麼 ?"
                  @search="onSearch"
                />
              </span>
              <a-table
                :row-key="gridData.rowKey"
                :row-selection="{ selectedRowKeys: form.menuSelectedRowKeys, onChange: onSelectChange }"
                :columns="gridData.columns"
                :data-source="gridData.data"
                :pagination="false"
                :scroll="{ x: false, y: 500 }"
              >
                <template
                  slot="menuName"
                  slot-scope="slotProps"
                >
                  <div>{{ slotProps.menuName }} ({{ slotProps.parentId }}/{{ slotProps.menuId }})</div>
                </template>
              </a-table>
            </a-form-model-item>
          </div>
          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary--outline mb-2"
              @click="onClose"
            >
              返回
            </button>
            <button
              class="btn__radius--primary mb-2"
              @click="submit"
            >
              送出覆核
            </button>
          </div>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { RoleCreateOrUpdateDto, RoleMenuDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: {} })
export default class ViewNurseRecordModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  @Prop()
  type: string

  @Prop()
  editData

  modalVisible = false;

  searchValue = '';

  form = {
  	roleId: null,
  	roleName: null,
  	remark: null,
  	enabled: null,
  	menuSelectedRowKeys: [],
  }

  formRules = {
  	roleName: [{ required: true, message: '請填入角色名稱' }],
  	enabled: [{ required: true, message: '請選擇是否啟用' }],
  }

  respData: Array<RoleMenuDto> = [];

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			title: '模組名稱',
  			dataIndex: 'parentName',
  			key: 'parentName',
  			width: 200,
  		},
  		{
  			title: '功能名稱',
  			key: 'menuName',
  			scopedSlots: { customRender: 'menuName' },
  		},
  	],
  }

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Watch('editData')
  onEditDataChange(val) {
  	if (val) {
  		const {
  			roleId, roleName, remark, enabled, menus,
  		} = val;
  		Object.assign(this.form, {
  			roleId,
  			roleName,
  			remark,
  			enabled: (enabled === 'Y') ? '1' : '2',
  		});
  		menus.forEach((el) => {
  			const rowkey = this.gridData.data.find((c) => c.menuId === el.menuId)?.rowkey;
  			if (rowkey) {
  				this.form.menuSelectedRowKeys.push(rowkey);
  			}
  		});
  	}
  }

  // API: 1.2.32.	查詢所有選單選項
  fetchMenuOpts() {
  	this.setLoading(true);
  	this.$AdminControlAdminApi.queryMenuOptionsUsingPOST()
  		.then((resp) => {
  			// console.log(resp);
  			if (resp.data.status === 200) {
  				const respData = JSON.parse(JSON.stringify(resp.data.data));
  				this.gridData.data = respData && respData.map((item, index) => ({ rowkey: index + 1, ...item }));
  				this.respData = this.gridData.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 1.2.25.	新增角色API(送出覆核)
  fetchCreateRole() {
  	const $form = this.mapToCreateForm();
  	this.setLoading(true);
  	this.$AdminControlAdminApi.createRoleUsingPOST($form)
    	.then((resp) => {
  			// console.log(resp);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'RoleMaintainResult',
  				params: { type: 'add' },
  				query: {
  					result: (resp.data.status === 200) ? 'success' : 'fail',
  					msg: (resp.data.status !== 200) && this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  			});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 1.2.26.	修改角色API(送出覆核)
  fetchUpdateRole() {
  	const $form = this.mapToCreateForm();
  	this.setLoading(true);
  	this.$AdminControlAdminApi.updateRoleUsingPOST($form)
  		.then((resp) => {
  			// console.log(resp);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'RoleMaintainResult',
  				params: { type: 'edit' },
  				query: {
  					result: (resp.data.status === 200) ? 'success' : 'fail',
  					msg: (resp.data.status !== 200) && this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  			});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onClose() {
  	this.$emit('closeRoleAddandEditModal');
  	this.reset();
  }

  reset() {
  	this.form = {
  		roleId: null,
  		roleName: null,
  		remark: null,
  		enabled: null,
  		menuSelectedRowKeys: [],
  	};
  	(this.$refs.formRef as any).resetFields();
  }

  mapToCreateForm(): RoleCreateOrUpdateDto {
  	const {
  		roleId, enabled, menuSelectedRowKeys, ...other
  	} = this.form;
  	const roleMenuDtoList = [];
  	menuSelectedRowKeys.forEach((e) => {
  		const findItem = this.gridData.data.find((c) => c.rowkey === e);
  		roleMenuDtoList.push({
  			menuId: findItem.menuId,
  			menuName: findItem.menuName,
  			parentId: findItem.parentId,
  			parentName: findItem.parentName,
  		});
  	});
  	return {
  		roleId,
  		enabled: (enabled === '1') ? 'Y' : 'N',
  		roleMenuDtoList,
  		...other,
  	};
  }

  onSearch() {
  	if (!this.searchValue || this.searchValue === '') {
  		this.gridData.data = this.respData;
  	} else {
  		// 搜尋是否有符合字串 用column來搜尋
  		const searchArray = [];
  		const filterData = [];
  		const regx = new RegExp(this.searchValue);
  		this.gridData.columns.forEach((item) => {
  			searchArray.push(item.dataIndex);
  		});
  		this.respData.forEach((item) => {
  			let include = false;
  			searchArray.forEach((key) => {
  				if (regx.test(item[key])) {
  					include = true;
  				}
  			});
  			if (include) {
  				filterData.push(item);
  			}
  		});
  		this.gridData.data = filterData;
  	}
  }

  onSelectChange(selectedRowKeys) {
  	this.form.menuSelectedRowKeys = selectedRowKeys;
  }

  submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			switch (this.type) {
  			case 'add':
  				this.fetchCreateRole();
  				break;
  			case 'edit':
  				this.fetchUpdateRole();
  				break;
  			default:
  				break;
  			}
  		} else {
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  			return false;
  		}
  	});
  }

  created() {
  	this.fetchMenuOpts();
  }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    padding-top: 6px;
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $TEXT-BOLD;
    }
		.modal-container__event__block {
			background-color: $COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			// margin-bottom: 20px;
			padding-top: 40px;
			padding-bottom: 30px;
			padding-left: calc(92/1088*100%);
			padding-right: calc(92/1088*100%);
      .modal-container__event__block__title {
        font-size: 20px;
        font-weight: $TEXT-BOLD;
        margin-bottom: 20px;
      }
      .modal-container__event__block__option {
        font-size: 16px;
        margin-bottom: 20px;
        .modal-container__event__block__option__title {
          margin-bottom: 10px;
          font-weight: $TEXT-BOLD;
        }
      }
		}
    .radio__block {
      width: 100%;
      background-color: #FFFFFF;
      border-radius: 4px;
      padding-top: 9px;
      padding-bottom:9px;
      padding-left: 12px;
    }
    .input__block {
      width: 100%
    }
  }
  .input__title {
    margin-bottom: 10px;
    font-weight: $TEXT-BOLD;
  }
  .mark-required {
    color: $ERROR-COLOR;
    margin-left: 5px;
  }
  .mark-required__desc {
    color: #999999;
    font-weight: 400;
    font-size: 14px;
    float: right;
  }
  .option__block {
    margin-bottom: 20px;
  }
  .hr__line--margin {
    margin-top: 30px;
    margin-bottom: 40px;
  }
  .table--scroll {
    overflow-x: auto;
  }
  .table__searchbar {
    margin-bottom: 10px;
  }
  .input__searchBar {
    width: 30%;
  }
  ::v-deep {
    .ant-input {
      height: 42px;
    }
    .ant-form-item {
      margin: 0px;
    }
    .mx-input {
      height: 42px;
    }
    .ant-table-header-column {
      font-weight: 900;
    }
    .ant-table-thead > tr >th {
      background-color: $COLOR-MAIN1;
      color: white;
    }
    .ant-table-body {
      border-radius: 4px 4px 0px 0px;
    }
    .ant-table-hide-scrollbar {
      margin-right: -15px;
    }
    .ant-table-scroll {
      border-radius: 4px 4px 0px 0px;
    }
    .ant-form-item-label {
      text-align: left;
      width: 100%;
    }
    .ant-form-item-label > label.ant-form-item-no-colon::after {
      display: none;
    }
  }
</style>
