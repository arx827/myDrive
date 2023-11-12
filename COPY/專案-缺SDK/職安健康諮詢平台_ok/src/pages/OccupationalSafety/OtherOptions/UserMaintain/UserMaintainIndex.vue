<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <div class="page__title">
          使用者維護
        </div>
        <div class="modal__btn">
          <button
            class="btn__main btn__main--light me-2"
            @click="historyModalVisible=true"
          >
            歷史異動紀錄
          </button>
          <button
            class="btn__main btn__main--light"
            @click="reviewModalVisible=true"
          >
            待覆核名單
          </button>
        </div>
      </div>
      <div class="userMaintain__wrap">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
        >
          <div class="userMaintain__block bg__light">
            <div class="userMaintain__block__title">
              使用者查詢
            </div>
            <div class="row">
              <a-form-model-item
                prop="name"
                label="姓名"
              >
                <a-input
                  v-model="form.name"
                  vue="true"
                  alt="webfont"
                  placeholder="e.g. 林曉春"
                />
              </a-form-model-item>
            </div>
            <div class="row">
              <div class="col-sm">
                <a-form-model-item
                  prop="adNum"
                  label="AD帳號"
                >
                  <a-input
                    v-model="form.adNum"
                    placeholder="e.g. A1234"
                  />
                </a-form-model-item>
              </div>
              <div class="col-sm">
                <a-form-model-item
                  prop="unit"
                  label="使用者單位"
                >
                  <a-select
                    v-model="form.unit"
                    :options="unitOptions"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-form-model>
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary--outline"
            @click="onReset"
          >
            重設
          </button>
          <button
            class="btn__radius--primary"
            @click="onSearch"
          >
            查詢
          </button>
        </div>
      </div>
    </div>
    <ReviewModal
      :visible="reviewModalVisible"
      @closeReviewModal="reviewModalVisible=false"
    />
    <HistoryModal
      :visible="historyModalVisible"
      @closeHistoryModal="historyModalVisible=false"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	UserManageQueryModelWithPage,
} from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';
import ReviewModal from '@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainReviewModal.vue';
import HistoryModal from '@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainHistoryModal.vue';

@Component({ components: { ReviewModal, HistoryModal } })
export default class UserMaintainIndex extends Vue {
  @Action('setLoading') setLoading;

  // 待覆核名單 Modal
  reviewModalVisible = false;

  // 歷史異動紀錄 Modal
  historyModalVisible = false;

  // 表單
  form = {
  	name: null,
  	adNum: null,
  	unit: 'VG800', // 預設
  };

  // 檢核規則
  formRules = {
  };

  // 使用者單位 下拉選項
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

  // 1.2.14.	查詢代理人部門清單 (下拉)
  searchDeptList() {
  	this.setLoading(true);
  	this.$AdminControlManagerApi.agentDeptListUsingPOST()
  		.then((resp) => {
  			this.unitOptions = resp.data.data.map((e) => ({
  				value: e.deptCd,
  				label: `${e.deptCd} ${e.deptName}`,
  			}));
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 1.2.33.	查詢使用者(page)
  searchUsers() {
  	this.setLoading(true);
  	const data: UserManageQueryModelWithPage = {
  		userDept: this.form.unit,
  		name: this.form.name,
  		adId: this.form.adNum,
  		pageNo: 0,
  		pageSize: 10,
  	};
  	this.$AdminControlAdminApi.usersPageUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (resp.data.data.content && resp.data.data.content.length > 0) {
  					this.$router.push({ name: 'UserMaintainList' });
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'UserMaintainList',
  						query: data,
  					});
  				} else {
  					notification.error({ content: '查無資料' });
  				}
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

  created() {
  	this.searchDeptList();
  }

  // 重設
  onReset() {
  	this.form.name = '';
  	this.form.adNum = '';
  	this.form.unit = 'VG800';
  }

  // 查詢
  onSearch() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.searchUsers();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
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
  .userMaintain__block__title {
    font-weight: 600;
    font-size: 24px;
    padding-bottom: 30px;
  }
	.modal__btn {
		text-align: center;
		margin-top: 15px;
		@include rwd-md {
			margin: 0;
		}
		.btn__main{
			padding: 4px 24px;
		}
	}
  .btn__wrap {
    margin: 50px 100px 50px 0;
    width: 100%;
    padding: 0;
    @include rwd-md {
      padding-right: 108px;
    }
    button {
      width: 98px;
      padding: 10px 20px;
      @include rwd-md {
        width: 200px;
        margin-right: 10px;
      }
      max-width: 100%;
      margin-right: 5px;
    }
    .btn__temp {
      width: 98px;
    }
  }
  ::v-deep {
    .ant-select-selection--single, .ant-input, .mx-input {
      height: 40px;
    }
    .ant-select-selection__rendered {
      line-height: 40px;
    }
    .ant-form-item-required::before {
      display: none;
    }
  }
</style>
