<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="visibleSync"
      class="common__modal fubon-backStage_modal"
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
      >
        <div class="modal-container">
          <div class="modal-container__title">
            待覆核項目
          </div>
          <!--<a-form-model
            ref="formRef"
            :model="form"
          >
            <a-checkbox-group
              v-model="form.checkItem"
              style="width: 100%;"
            >
              <div
                v-for="(item, index) in respData"
                :key="index"
                class="modal-container__event__block"
              >
                <div class="row">
                  <div class="col-1">
                    <a-checkbox
                      :value="item.uuid"
                      name="type"
                    />
                  </div>
                  <div class="col-11">
                    <div class="option__block">
                      <div class="row">
                        <div class="col-6">
                          <div class="row">
                            <div class="col-6">
                              <div class="input__title">
                                角色名稱
                              </div>
                              <div>
                                {{ item.roleName }}
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="input__title">
                                申請人員
                              </div>
                              <div>
                                {{ item.crtName }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="row">
                            <div class="col-6">
                              <div class="input__title">
                                申請日期
                              </div>
                              <div>
                                {{ item.crtDt }}
                              </div>
                            </div>
                            <div class="col">
                              <div class="input__title">
                                是否啟用
                              </div>
                              <div>
                                {{ item.enabled }}
                              </div>
                            </div>
                            <div class="col">
                              <div class="input__title">
                                執行功能
                              </div>
                              <div>
                                {{ item.execAction }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr class="hr__line hr__line--margin">
                    <div class="row">
                      <div class="col-12">
                        <div class="input__title">
                          備註
                        </div>
                        <div v-if="item.remark">
                          {{ item.remark }}
                        </div>
                        <div v-else>
                          --
                        </div>
                      </div>
                    </div>
                    <hr class="hr__line hr__line--margin">
                    <div class="option__block">
                      <a-row :gutter="[16, 16]">
                        <a-col
                          :span="8"
                          class="input__title"
                        >
                          模組名稱
                        </a-col>
                        <a-col
                          :span="16"
                          class="input__title"
                        >
                          功能名稱
                        </a-col>
                      </a-row>
                      <a-row
                        v-for="(menu, indexOfMenu) in item.menus"
                        :key="indexOfMenu"
                        :gutter="[16, 16]"
                      >
                        <a-col :span="8">
                          {{ menu.parentName }}
                        </a-col>
                        <a-col :span="16">
                          {{ menu.menuName }} ({{ menu.parentId }}/{{ menu.menuId }})
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                </div>
              </div>
            </a-checkbox-group>
          </a-form-model> -->
          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary--outline mb-2"
              @click="onClose"
            >
              取消
            </button>
            <button
              :disabled="form.checkItem && form.checkItem.length === 0"
              class="btn__radius--primary--outline mb-2"
              @click="openBackModal"
            >
              退回
            </button>
            <button
              :disabled="form.checkItem && form.checkItem.length === 0"
              class="btn__radius--primary mb-2"
              @click="onAgree"
            >
              同意
            </button>
          </div>
        </div>
      </a-form-model>
    </a-modal>
    <BackModal
      :visible.sync="backModalVisible"
      :reject-info-list="rejectInfoList"
      @onReject="onReject"
      @closeBackModal="closeBackModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop, PropSync,
} from 'vue-property-decorator';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';
import moment from 'moment';
// import { CertPassUpdateDto } from '@fubonlife/oss-api-axios-sdk';
import BackModal from '@admin/roleMaintain/BackModal.vue';

@Component({
	components: {
		BackModal,
	},
})
export default class ViewNurseRecordModal extends Vue {
	@Action('setLoading') setLoading;

	@PropSync('visible')
	visibleSync: boolean;

	backModalVisible = false;

	form = {
		checkItem: [],
	}

	respData = [];

	rejectInfoList = [];

	@Watch('visible')
	onChange(val) {
		if (val) {
			this.fetchRoleReviewList();
		}
	}

	// API: 1.2.29.	查詢角色待覆核紀錄
	fetchRoleReviewList() {
		// this.setLoading(true);
		// this.$AdminControlAdminApi.queryRoleReviewListUsingPOST()
		// 	.then((resp) => {
		// 		if (resp.data.status === 200) {
		// 			this.respData = JSON.parse(JSON.stringify(resp.data.data));
		// 			this.respData.map((item) => {
		// 				item.crtDt = (item.crtDt) ? moment(item.crtDt).format('YYYY/MM/DD HH:mm:ss') : '';
		// 				item.enabled = item.enabled === 'Y' ? '是' : '否';
		// 				item.execAction = this.$enum.getVal('execActionEnum', item.execAction);
		// 			});
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status = ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	// API: 1.2.30.	更新角色待覆核紀錄
	async fetchUpdateReviewStatus(isAgree, certPassUpdateUserDtoList) {
		// const $form = {	isAgree,	certPassUpdateUserDtoList };
		// this.setLoading(true);
		// await this.$AdminControlAdminApi.updateRoleReviewStatusUsingPOST($form)
		// 	.then((resp) => {
		// 		// TEST:
		// 		// console.log(resp);
		// 		// console.log(JSON.stringify($form));
		// 		this.$global.changeRouterAndaddParam({
		// 			toRouter: 'RoleMaintainResult',
		// 			params: { type: isAgree ? 'check' : 'back' },
		// 			query: {
		// 				result: (resp.data.status === 200) ? 'success' : 'fail',
		// 				msg: (resp.data.status !== 200) && this.$global.getApiErrorMsg(resp.data.apiError).join(''),
		// 			},
		// 		});
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status = ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	reset() {
		this.respData = [];
		this.form.checkItem = [];
		this.rejectInfoList = [];
	}

	onClose() {
		this.visibleSync = false;
		this.reset();
	}

	onAgree() {
		const data = [...this.form.checkItem].map((uuid) => ({ uuid }));
		this.fetchUpdateReviewStatus(true, data);
	}

	async onReject(data) {
		await this.fetchUpdateReviewStatus(false, data);
		this.closeBackModal();
	}

	openBackModal() {
		const checkList = [];
		this.form.checkItem.forEach((uid) => {
			checkList.push(this.respData.find((el) => el.uuid === uid));
		});
		this.rejectInfoList = checkList;
		this.backModalVisible = true;
	}

	closeBackModal() {
		this.backModalVisible = false;
	}
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 20px;
    margin-bottom: 16px;
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
      font-weight: $BS-TEXT-BOLD;
    }
		.modal-container__event__block {
			background-color: $BS-COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			margin-bottom: 20px;
			padding-top: 30px;
			padding-bottom: 30px;
			padding-left: (30/1088)*100%;
      .modal-container__event__block__title {
        font-size: 20px;
        font-weight: $BS-TEXT-BOLD;
        margin-bottom: 20px;
      }
      .modal-container__event__block__option {
        font-size: 16px;
        margin-bottom: 20px;
        .modal-container__event__block__option__title {
          margin-bottom: 10px;
          font-weight: $BS-TEXT-BOLD;
        }
      }
		}
    .input__block {
      width: 100%
    }
  }
  .input__title {
    margin-bottom: 10px;
    font-weight: $BS-TEXT-BOLD;
  }
  .menuRowItem {
    margin-bottom: 10px;
  }
  .option__block {
    padding-right: (92/1088)*100%;
  }
  .option__block__item {
    margin-bottom: 20px;
    @include bs-rwd-xl {
      margin-bottom: 0px;
    }
  }
  .hr__line--margin {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .table--scroll {
    overflow-x: auto;
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
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
  }
</style>
