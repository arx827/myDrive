<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          個案維護
        </div>
      </div>
      <div class="caseMaintain__content">
        <div class="caseMaintain__header text-center">
          <h2 class="header-title">
            您想找誰？
          </h2>
          <h3 class="header-subtitle">
            必填二擇一
          </h3>
        </div>
        <div class="caseMaintain__block">
          <a-form-model
            ref="formRef"
            :model="form"
            layout="vertical"
            :colon="false"
            :rules="formRules"
          >
            <a-form-model-item
              prop="insName"
              label="員工姓名"
            >
              <a-input
                v-model="form.insName"
                placeholder="e.g. 林曉春"
                vue="true"
                alt="webfont"
                @keyup.enter="onSubmit"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="insId"
              label="身分證字號/員編"
            >
              <a-input
                v-model="form.insId"
                placeholder="e.g. 911234"
                @keyup.enter="onSubmit"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary"
          @click="onSubmit"
        >
          確定
        </button>
      </div>
    </div>
    <EmpSearchModal
      :visible="empSearchModalVisible"
      :result-datas="resultDatas"
      @closeSearchModal="empSearchModalVisible=false"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import infoModal from '@/plugins/notification/infoModal';
import EmpSearchModal from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMaintainEmpSearch.vue';

@Component({ components: { EmpSearchModal } })
export default class CaseMaintainIndex extends Vue {
  @Action('setLoading') setLoading;

  // 輸入內容
  userInfo = '';

  // 員工查詢Modal
  empSearchModalVisible = false;

  // 查詢結果(員工資料)
  resultDatas = [];

  // 表單
  form = {
  	insName: '',
  	insId: '',
  }

  // 表單檢核
  formRules= {
  	insName: [],
  	insId: [],
  }

  // 假資料
  fakeData = [
  	{
  		userName: '林曉春',
  		userId: 'G123457689',
  		id: '901234',
  		department: '系統整合部 系統支援二科',
  	},
  	{
  		userName: '林曉春',
  		userId: 'A123457689',
  		id: '901233',
  		department: '系統整合部 系統支援一科',
  	},
  ];

  // 確定
  onSubmit() {
  	if (this.form.insId) {
  		this.userInfo = this.form.insId;
  	} else {
  		this.userInfo = this.form.insName;
  	}
  	if (this.userInfo) {
  		this.setLoading(true);
  		// 員工資料查詢
  		this.$PCRRpnSendRemindAndModifyReservationApi.queryAccountUsingPOST(this.form.insId, this.form.insName)
  			.then(async (resp) => {
  				this.resultDatas = resp.data.data;
  				// this.resultDatas = this.fakeData;
  				if (this.resultDatas.length === 0) {
  					infoModal.alertError({
  						content: '查無資料',
  					});
  				} else if (this.resultDatas.length === 1) {
  					const id = await this.$encryptionDecryption.encrypt(JSON.stringify(resp.data.data[0].id));
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'CaseMaintainList',
  						query: { data: { ...resp.data.data[0], id } },
  					});
  				} else {
  					this.empSearchModalVisible = true;
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else {
  		infoModal.alertError({
  			content: '請擇一輸入員工姓名或身分證字號/員編，謝謝！',
  		});
  	}
  }

  created() {
  	sessionStorage.removeItem('case_tableType');
  	sessionStorage.removeItem('param');
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.caseMaintain__content {
  max-width: 350px;
	margin: auto;
	width: 100%;
}
.caseMaintain__header {
  margin-bottom: 20px;
  .header-title {
    font-size: 24px;
    font-weight: 600;
  }
  .header-subtitle {
    font-weight: 600;
    color: $TEXT-GREEN;
  }

}
.caseMaintain__block {
	max-width: 350px;
}

::v-deep {
	.ant-form-item-label > label {
		color: #000000;
		font-weight: 600;
		font-size: 16px;
	}
  .ant-input {
    height: 40px;
  }
}
</style>
