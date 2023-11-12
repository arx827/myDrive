<template>
  <a-modal
    :visible="visible"
    :closable="false"
    :footer="null"
    :width="995"
    wrap-class-name="modal__signout"
    centered="centered"
    :z-index="2000"
  >
    <div class="d-flex timeout">
      <div class="row w-100">
        <div class="col">
          <div class="title">
            角色異動通知
          </div>
          <div class="content">
            當前登入帳號的角色清單被異動，
            <br>請重新指定目前要登入的角色。
          </div>
          <div class="flex">
            <a-form-model
              ref="formRef"
              :model="form"
              :rules="formRules"
            >
              <a-form-model-item
                prop="title"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 21 }"
              >
                <a-select
                  v-model="form.selectedRole"
                  :allow-clear="true"
                  :show-search="true"
                  placeholder="請選擇登入角色"
                >
                  <a-select-option
                    v-for="(role) in roleList"
                    :key="role.id"
                    :label-in-value="true"
                    :value="role.roleId"
                  >
                    {{ role.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-form-model>
          </div>
          <button
            class="btn--backhome"
            @click="onSubmit"
          >
            確定
          </button>
        </div>
        <div class="col">
          <img
            class="img"
            src="@/assets/images/icon_time_out.svg"
            alt=""
          >
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { RoleDto } from '@fubonlife/iams-api-axios-sdk';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { Getter, Action, namespace } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

const modalModule = namespace('modalControl');

@Component({
	components: { IconTextButton, InfoModal },
})
export default class ChangeRole extends Vue {
  @modalModule.Action('setModalState') setModalState;

	@Getter is403ChangingRole!: string;

  @Action('setIs403ChangingRole') setIs403ChangingRole;

  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  roleList: RoleDto & {
    roleId: string;
    roleUnitId: string;
    type: string;
  }[] = null;

  form = {
  	selectedRole: null,
  }

  formRules: { [key: string]: ValidationRule[] } ={
  	role: [{ required: true, message: '請選擇角色', trigger: 'change' }],
  }

  @Watch('visible')
  onVisibleChanged(val) {
  	console.log('onVisibleChanged', val);
  	if (val) this.setRoleList();
  }

  created() {
  	// console.log('created', this.visible);
  }

  //
  async getRoleList() {
  	this.setLoading(true);
  	let result = null;
  	await this.$roleApi.searchAccountRoleListInRoleUsingGET()
  		.then((resp) => {
  			result = resp.data.result;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  	return result;
  }

  // 取得登入者角色清單
  async setRoleList() {
  	const respData = await this.getRoleList();
  	this.roleList = respData.reduce((prvValue, curValue) => {
  		if (curValue.roleUnits.length > 0) {
  			const roles = [];
  			for (let i = 0; i < curValue.roleUnits.length; i++) {
  				roles.push({
  					...curValue,
  					type: 'roleUnitId',
  					roleUnits: [curValue.roleUnits[i]], // 切換角色API需要：有組別的角色則roleUnits、roleId 都為 roleUnits[i].id
  					roleId: curValue.roleUnits[i].id,
  					roleUnitId: curValue.roleUnits[i].id,
  					name: curValue.roleUnits[i].auditorTeamName, // 有組別角色的名字，取roleUnits裡的.auditorTeamName
  				});
  			}
  			return prvValue.concat(roles);
  		}
  		return [...prvValue, {
  			...curValue,
  			type: 'roleId',
  			roleId: curValue.id, // 切換角色API需要：無組別的角色則roleUnits為null、roleId為 id
  			roleUnitId: null,
  		}];
  	}, []);
  	console.log('this.roleList', this.roleList);
  }

  onSubmit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.changeRole(this.form.selectedRole);
  		}
  	});
  }

  onSelectRoleHandle(role) {
  	console.log(role);
  }

  // API: 切換角色
  changeRole(role) {
  	this.setLoading(true);
  	console.log('role', role);
  	const requset = this.roleList.filter((roleItem) => roleItem.roleId === role)[0].type === 'roleUnitId' ? { roleUnitId: role } : { roleId: role };
  	console.log('request', requset);
  	this.$accountApi.switchRoleUnitUsingPOST(requset)
  		.then((resp) => {
  			this.closeModal();
  			this.$emit('reloadHeader');
  			if (this.$route.name === 'Index') {
  				this.$router.replace('/refresh');
  			} else {
  				this.$router.push({ name: 'Index' });
  			}
  		})
  		.catch((resp) => {
  			console.log(resp);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '切換角色失敗',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  closeModal() {
  	this.form.selectedRole = null;
  	this.setIs403ChangingRole(false);
  	this.setModalState({ // 有共用彈窗就把關閉
  		resultModal: {
  			visible: false,
  		},
  	});
  }
}
</script>

<style lang="scss" scoped>
.timeout{
  padding: 90px 90px 90px 126px;
}

.modal__signout{
  .title{
    font-size: 56px;
    color: #000;
    // margin-bottom: 30px;
    font-weight: bold;
    margin-top: 30px;
  }
  .content{
    font-size: 20px;
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 24px;
  }
  img{
    width: 100%;
  }
}
</style>
