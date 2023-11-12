<template>
  <div>
    <a-modal
      v-model="visibleSync"
      :mask-closable="false"
      :width="'90%'"
      :footer="null"
      class="common__modal fubon-backStage_modal"
      :after-close="onClose"
    >
      <div class="event__block">
        <div class="page__title m-0">
          {{ editData? '編輯使用者':'新增' }}
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
                prop="domainId"
                label="AD帳號"
              >
                <a-input
                  v-model="form.domainId"
                  disabled
                />
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <a-form-model-item
                prop="accountUnit"
                label="使用者單位"
              >
                <a-select
                  v-model="form.accountUnit"
                  :options="deptOptions"
                  style="color: #636363;"
                  disabled
                />
              </a-form-model-item>
            </div>
            <div class="col-sm-6">
              <a-form-model-item
                prop="roleUnit"
                label="角色名稱"
              >
                <a-select
                  v-model="form.roleUnit"
                  class="w-100"
                  mode="multiple"
                  :filter-option="$global.filterOption"
                  :dropdown-match-select-width="false"
                >
                  <a-select-option
                    v-for="role in roleOptions"
                    :key="role.value"
                    :value="role.value"
                  >
                    {{ role.label }}
                  </a-select-option>
                </a-select>
                <!-- <a-dropdown>
                  <div
                    class="health__category"
                  >
                    <div
                      v-for="(item, index) in roleOptions"
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
                      v-for="item in roleOptions"
                      :key="item.value"
                      :class="{'item__isCheck':item.isChecked}"
                    >
                      {{ item.label }}
                      <a-icon
                        v-if="item.isChecked"
                        type="check"
                        class="icon__check"
                      />
                    </a-menu-item>
                  </a-menu>
                </a-dropdown> -->
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <a-form-model-item
                prop="agent"
                label="目前協助代理的角色職務"
              >
                <a-textarea
                  v-model="agentList"
                  :auto-size="{ maxRows: 10 }"
                  :disabled="true"
                />
              </a-form-model-item>
            </div>
            <div class="col-sm-6">
              <a-form-model-item
                prop="enabled"
                label="帳號狀態"
              >
                <a-radio-group
                  v-model="form.enabled"
                  class="row"
                >
                  <div class="col-12 col-md d-flex mt-2">
                    <a-radio
                      :value="true"
                      class="mb-2"
                    >
                      生效
                    </a-radio>
                    <a-radio
                      :value="false"
                      class="mb-2"
                    >
                      停用
                    </a-radio>
                  </div>
                </a-radio-group>
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
	Vue, Component, Prop, Watch, PropSync,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { SearchSingleAccountDto, ModifyAccountRequest } from '@fubonlife/iams-api-axios-sdk';
// import {
// 	UserUpdateDto,
// } from '@fubonlife/oss-api-axios-sdk';
// import notification from '@/plugins/notification/infoNotification';

@Component({})
export default class AccountEditModal extends Vue {
  @Action('setLoading') setLoading;

  h = this.$createElement;

  @Prop()
  editData: SearchSingleAccountDto;

  @Prop()
  deptOptions;

  @PropSync('visible')
  visibleSync!: boolean

  // 角色下拉選項
  roleOptions = null;

  // 表單
  form = {
  	name: null,
  	domainId: null,
  	accountUnit: null,
  	roleUnit: null,
  	enabled: null,
  };

  // 檢核規則
  formRules = {
  	name: [{ required: true, message: '姓名不可為空' }],
  	domainId: [{ required: true, message: 'AD帳號不可為空' }],
  	accountUnit: [{ required: true, message: '使用者單位不可為空' }],
  	roleUnit: [{ validator: this.roleUnitValidator }],
  	enabled: [{ required: true, message: '帳號狀態不可為空' }],
  };

  // 角色名稱驗證
  roleUnitValidator(rule, value, callback) {
  	const hasAuditor = value?.some((role) => role.includes('ROLE_Auditor:'));
  	const hasPracticeAuditor = value?.some((role) => role.includes('ROLE_Auditor_Practice:'));
  	if (hasAuditor && hasPracticeAuditor) return callback('查核人員的實習與非實習身份不能同時存在');

  	// 檢核無組別與組別有無重複 => 組長、查核人員、查核人員實習
  	const checkTeamRoles = [
  		{
  			role: 'ROLE_Audit_Team_Head',
  			roleName: '組長',
  		},
  		{
  			role: 'ROLE_Auditor_Practice',
  			roleName: '(實習)查核人員',
  		},
  		{
  			role: 'ROLE_Auditor',
  			roleName: '查核人員',
  		},
  	];
  	const checkTeamCallbackString = checkTeamRoles.filter((checkTeamRole) => this.checkTeamRepeat(value, checkTeamRole.role))
    ?.map((role) => `「${role.roleName}」`).join('、');
  	if (checkTeamCallbackString.length !== 0) callback(`請確認${checkTeamCallbackString}角色是否選擇「無組別」同時也選擇其他的組別`);

  	callback();
  }

  // 檢核是有否有同時選擇無組別與其他組別
  checkTeamRepeat(selectValue: string[], role: string): boolean {
  	const isSelectNoTeam = selectValue.includes(`${role}:*`);
  	if (isSelectNoTeam && selectValue.filter((selectRole) => selectRole.includes(`${role}:`)).length > 1) return true;
  	return false;
  }

  // 目前協助代理文字format
  get agentList() {
  	return this.editData?.agentRoleUnit?.join('\n');
  }

  initData() {
  	this.getRoleList();
  	if (this.editData) {
  		this.form.name = this.editData.name;
  		this.form.domainId = this.editData.domainId;
  	  this.form.accountUnit = this.editData.accountUnit;
  		this.form.enabled = this.editData.enabled;
  		this.form.roleUnit = [];
  		this.editData.roleUnit.forEach((role) => {
  			if (role.selected) this.form.roleUnit.push(role.value);
  		});
  	}
  }

  // 送出覆核
  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.applyForm();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // API: 取得角色名稱選單
  getRoleList() {
  	this.setLoading(true);
  	this.$accountApi.searchRoleAndUnitListInAccountUsingPOST()
  		.then((resp) => {
  			this.roleOptions = resp.data;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 修改使用者角色API(送出覆核)
  applyForm() {
  	this.setLoading(true);
  	const request: ModifyAccountRequest = {
  		accountId: this.editData.accountId,
  		domainId: this.editData.domainId,
  		empNo: this.editData.empNo,
  		roleUnit: this.form.roleUnit,
  		enabled: this.form.enabled,
  	};
  	this.$accountApi.modifyInAccountUsingPOST(request)
  		.then((resp) => {
  			console.log('resp');
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'AccountResult',
  				params: { type: 'edit' },
  				query: { result: 'success' },
  			});
  		})
  		.catch((error) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'AccountResult',
  				params: { type: 'edit' },
  				query: {
  					result: 'fail',
  					msg: error.response.data.message,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 取消
  onClose() {
  	// this.$emit('closeEditModal');
  	this.visibleSync = false;
  }

  /**
   * 監聽
   */

  @Watch('visible')
  watchVisible(val) {
  	if (val) this.initData();
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
    @include bs-rwd-sm {
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
  .query__wrap {
    background-color: #fff;
    padding: 8px 10px;
    width: 100%;
    border-radius: 4px;
  }
  ::v-deep {
    .ant-radio-disabled + span, .ant-checkbox-disabled + span, .ant-input:disabled, .ant-input-number-disabled {
      color: #636363;
    }
    .ant-table-thead > tr > th {
      font-weight: bold;
    }
    .ant-form-item-required::before {
      display: none;
    }
    label.ant-form-item-required::after {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 16px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: "*";
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
