<template>
  <div>
    <a-modal
      v-model="modalVisible"
      :mask-closable="false"
      :width="'90%'"
      :footer="null"
      class="common__modal"
      :after-close="onClose"
    >
      <div class="event__block">
        <div class="page__title m-0">
          編輯使用者
        </div>
      </div>
      <div class="userMaintain__wrap">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
        >
          <div class="row">
            <div class="col-sm-6">
              <a-form-model-item
                prop="name"
                label="姓名"
              >
                <a-input
                  v-model="form.name"
                  vue="true"
                  alt="webfont"
                  disabled
                />
              </a-form-model-item>
            </div>
            <div class="col-sm-6">
              <a-form-model-item
                prop="adId"
                label="AD帳號"
              >
                <a-input
                  v-model="form.adId"
                  disabled
                />
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <a-form-model-item
                prop="userDept"
                label="使用者單位"
              >
                <a-select
                  v-model="form.userDept"
                  :options="unitOptions"
                  style="color: #636363;"
                  disabled
                />
              </a-form-model-item>
            </div>
            <div class="col-sm-6">
              <a-form-model-item
                prop="roleNames"
                label="角色名稱/權限說明"
              >
                <a-dropdown>
                  <div
                    class="health__category"
                  >
                    <div
                      v-for="(item, index) in showCateOpts"
                      :key="index"
                      class="health__category__item"
                      :data-id="item.id"
                    >
                      {{ item.name }}
                      <a-icon
                        class="btn__close"
                        type="close"
                        @click.stop="removeHealthItem(item.id)"
                      />
                    </div>
                  </div>
                  <a-menu
                    slot="overlay"
                    class="userMaintainDropdown__wrap"
                    @click="onClick"
                  >
                    <a-menu-item
                      v-for="item in cateSelected"
                      :key="item.id"
                      :class="{'item__isCheck':item.isChecked}"
                    >
                      {{ item.name }}
                      <a-icon
                        v-if="item.isChecked"
                        type="check"
                        class="icon__check"
                      />
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-form-model-item>
            </div>
          </div>
          <div class="btn__wrap text-center mb-1">
            <button
              class="btn__radius--primary--outline mx-1 mb-3"
              @click="onClose"
            >
              取消
            </button>
            <button
              class="btn__radius--primary mx-1 mb-3"
              @click="onSubmit"
            >
              送出覆核
            </button>
          </div>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	UserUpdateDto,
} from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';

@Component({})
export default class UserMaintainHistoryModal extends Vue {
  @Action('setLoading') setLoading;

  h = this.$createElement;

  @Prop()
  editData

  @Prop()
  visible!: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) this.getItem();
  }

  cateSelected: {name: string; id: string; isChecked: boolean; roleName: string; remark: string}[] = null;

  // 使用者單位 下拉選項假資料
  unitOptions = [
  	// {
  	// 	value: 0,
  	// 	label: 'VG800 職安管理部（預設）',
  	// },
  	// {
  	// 	value: 1,
  	// 	label: 'VG800 職安管理部',
  	// },
  	// {
  	// 	value: 2,
  	// 	label: 'VG800 職安管理部',
  	// },
  ]

  // 表單
  form = {
  	name: null,
  	adId: null,
  	userDept: null,
  	roleNames: null,
  };

  // 檢核規則
  formRules = {
  	name: [{ required: true, message: '姓名不可為空' }],
  	adNum: [{ required: true, message: 'AD帳號不可為空' }],
  	unit: [{ required: true, message: '使用者單位不可為空' }],
  	roleNames: [{ required: true, message: '角色名稱/權限說明不可為空' }],
  };

  // 角色名稱/權限說明 下拉選項假資料
  roleNameOptions = [
  	// {
  	// 	itemName: '系統管理員：管理系統相關事務',
  	// 	itemId: '0',
  	// },
  	// {
  	// 	itemName: '護理人員：OOOO',
  	// 	itemId: '1',
  	// },
  	// {
  	// 	itemName: '主管：OOOO',
  	// 	itemId: '2',
  	// },
  ]

  @Watch('editData')
  setData() {
  	this.form = this.editData;
  	console.log(this.form);
  }

  created() {
  	// this.getItem();
  }

  get showCateOpts() {
  	if (!this.cateSelected) return;
  	const allOpts = this.cateSelected;
  	const arr = allOpts.filter((e: any) => e.isChecked);
  	return arr;
  }

  async getItem() {
  	await this.searchUserOpt();
  	// 角色名稱/權限說明 下拉選單API
  	this.cateSelected = this.roleNameOptions.map((e) => ({
  		name: e.itemName, id: e.itemId, isChecked: false, roleName: e.roleName, remark: e.remark,
  	}));
  	// 填入使用者角色
  	console.log(this.cateSelected);
  	const defaultRole = this.editData.roleNames;
  	defaultRole.forEach((element) => {
  		this.cateSelected.find((e) => e.id === element.roleId).isChecked = true;
  	});
  }

  // 角色名稱/權限說明 點擊下拉選項
  onClick({ key }) {
  	console.log(key);
  	console.log(this.cateSelected);
  	const target = this.cateSelected.find((e) => (e.id === key));
  	target.isChecked = !target.isChecked;
  	// this.cateSelected[key - 1].isChecked = !this.cateSelected[key - 1].isChecked;
  }

  // 移除項目
  removeHealthItem(removeID) {
  	this.cateSelected.forEach((element) => {
  		if (element.id === removeID) {
  			element.isChecked = false;
  		}
  	});
  }

  // 送出覆核
  onSubmit() {
  	this.form.roleNames = this.showCateOpts;
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.applyForm();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // API: 1.2.39.修改使用者角色API(送出覆核)
  applyForm() {
  	this.setLoading(true);
  	const data: UserUpdateDto = {
  		adId: this.editData.adId,
  		name: this.editData.name,
  		userDept: this.editData.userDept,
  		userId: this.editData.userId,
  		userRoleDtoList: this.showCateOpts.map((e) => ({
  			roleId: e.id,
  			roleName: e.roleName,
  			remark: e.remark,
  		})),
  	};
  	this.$AdminControlAdminApi.updateUserUsingPOST(data)
  		.then((resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'UserMaintainResult',
  				params: {
  						type: 'edit',
  				},
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'fail',
  					errorMsg: resp.data.status === 200 ? '' : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					type: '修改',
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

  // 取消
  onClose() {
  	this.$emit('closeEditModal');
  }

  // API: 1.2.40.查詢使用者角色選項
  async searchUserOpt() {
  	await this.$AdminControlAdminApi.queryUserRoleOptionsUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				// this.grid.data = resp.data.data;
  				this.roleNameOptions = resp.data.data.map((e) => ({
  					itemName: `${e.roleName}：${e.remark}`,
  					itemId: e.roleId,
  					remark: e.remark,
  					roleName: e.roleName,
  				}));
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .userMaintain__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
  }
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include rwd-sm {
      padding: 20px 70px;
    }
  }
  .content__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
	.table__wrap {
		overflow-x: scroll;
	}
  .query__table {
    min-width: 800px;
  }
  .query__wrap {
    background-color: #fff;
    padding: 8px 10px;
    width: 100%;
    border-radius: 4px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .health__category {
    min-height: 40px;
  }
  .icon__check {
    float: right;
    line-height: 22px;
    color: #4D86FF;
  }
  ::v-deep {
    .ant-radio-disabled + span, .ant-checkbox-disabled + span, .ant-input:disabled, .ant-input-number-disabled {
      color: #636363;
    }
    .ant-table-thead > tr > th {
      font-weight: bold;
    }
    .ant-form-item-required::before {
      &::before {
        display: none;
      }
      &::after {
        display: inline-block;
        margin-right: 4px;
        color: #f5222d;
        font-size: 16px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: "*";
      }
    }
    .ant-input, .ant-select-selection {
      height: 40px;
    }
    .ant-select-selection__rendered {
      line-height: 40px;
    }
  }
</style>

<style lang="scss">
/* 針對 antd 產生的下拉框 調整 (因為生成在app層，不在component裡，故寫成全域，className為自定義) */
.userMaintainDropdown__wrap {
  .ant-dropdown-menu-item {
    &:hover {
      background-color: #E6F7FF;
      .icon__check {
        color: #363636;
      }
    }
  }
  .item__isCheck {
    background-color: #F7F7F7;
  }
}
</style>
