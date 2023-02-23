<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="coInfo__table__wrap bg__blue">
      <div class="container">
        <img
          src="@/assets/image_table.svg"
          alt=""
        >
      </div>
    </div>
    <div
      v-if="form !== null"
      class="container"
    >
      <div
        class="page__title primary__txt"
        :class="{'float-start': action === 'edit'}"
      >
        請確認以下{{ action === 'add'?'新增':'變更' }}內容
      </div>
      <div
        v-if="action === 'edit'"
        class="float-end mt-3"
      >
        「<span class="mark">＊</span>」符號表示變更項目
      </div>
      <div class="clearfix" />
      <div class="coInfo__edit__table bg__blue">
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">保單號碼-序號</label>
              <div>{{ policyNo }}-{{ policySeq }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">保險期間</label>
              <div>{{ startDate }} - {{ endDate }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">作業狀態</label>
              <div>{{ action === 'add'?'新增':'變更' }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">姓名<span
                v-if="action === 'edit'&&form.userName !== initForm.userName"
                class="mark"
              >＊</span></label>
              <div>
                {{ form.userName }}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">身分證字號<span
                v-if="action === 'edit'&&form.userId !== initForm.userId"
                class="mark"
              >＊</span></label>
              <div>
                {{ form.userId }}
              </div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">權限等級<span
                v-if="action === 'edit'&&form.authId !== initForm.authId"
                class="mark"
              >＊</span></label>
              <div v-if="authList!==null">
                {{ authList.find((e)=>(e.authId == form.authId)).authName }}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">聯絡電話(區碼/電話/分機)<span
                v-if="action === 'edit'&&form.utelAreaCode+form.utelNo+form.utelExtensionNo !== initForm.utelAreaCode+initForm.utelNo+initForm.utelExtensionNo"
                class="mark"
              >＊</span></label>
              <div>
                {{ form.utelAreaCode }}-{{ form.utelNo }}{{ form.utelExtensionNo?`#${form.utelExtensionNo}`:'' }}
              </div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">電子信箱<span
                v-if="action === 'edit'&&form.userEmail !== initForm.userEmail"
                class="mark"
              >＊</span></label>
              <div>
                {{ form.userEmail }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="coInfo__print__wrap"
      >
        <div class="coInfo__print__title">
          原印鑑
        </div>
        <div class="coInfo__print__content">
          <div class="row">
            <div class="col text-center">
              （公司章）
            </div>
            <div class="col text-center">
              （負責人章）
            </div>
          </div>
        </div>
      </div>
      <div class="block__btns text-center">
        <router-link
          :to="'/coInfo/change'"
        >
          <button
            class="btn__radius--primary--outline"
          >
            上一步
          </button>
        </router-link>
        <button
          class="btn__radius--primary"
          :disabled="isLoading"
          @click="saveAndDownload"
        >
          儲存並下載
        </button>
      </div>
      <div
        class="reminder__txt text-center"
      >
        <p>請列印此畫面，且加蓋印鑑，並將正本郵寄至本公司</p>
        <p>11049 台北市信義區東興路71號3樓</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { UserCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import notification from '@/plugins/info/infoNotification';
import infoModal from '@/plugins/info/infoModal';
import ActionType from './model';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class CoInfoAddComfirm extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  breadcrumb: {}

  form: UserCreation = null;

  initForm = null;

  policyId = null;

  policyNo = null;

  policySeq = null;

  startDate = null;

  endDate = null;

  // showPdfBlock = false; // "一級權限"人員需顯示列印區塊

  action = '';

  isLoading = false;

  authList = null;

  async getQuery() {
  	const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = JSON.parse(decryptString);
  	this.form = query.form;
  	// this.form = {
  	// 	policyId: query.policyId,
  	// 	policyNo: query.policyNo,
  	// 	policySeq: query.policySeq,
  	// 	authId: query.authId,
  	// 	userEmail: query.userEmail,
  	// 	userId: query.userId,
  	// 	userName: query.userName,
  	// 	utelAreaCode: query.utelAreaCode,
  	// 	utelExtensionNo: query.utelExtensionNo,
  	// 	utelNo: query.utelNo,
  	// };
  	this.initForm = query.initForm;
  	this.action = query !== null ? query.action : ActionType.Add;

  	const loginInfo = this.$user.getMe();
  	const policyDetail = this.$user.getPolicyDetail();
  	this.policyNo = loginInfo.policyNo;
  	this.policySeq = loginInfo.policySeq;
  	this.startDate = policyDetail.strDate;
  	this.endDate = policyDetail.endDate;
  	if (this.action === 'add') {
  		this.form.policyNo = loginInfo.policyNo;
  		this.form.policySeq = loginInfo.policySeq;
  	}
  	console.log(this.form);
  	await this.$userInfo.getAuthId().then((e) => {
  		this.authList = e;
  		// this.showPdfBlock = this.form.authId === this.authList.find((e) => (e.authName === '一級權限')).authId;
  	});
  	// this.showPdfBlock = this.form.authId === this.authList[0].val;
  }

  created() {
  	this.getQuery();
  }

  saveAndDownload() {
  	this.save();
  }

  downloadPdf(id) {
  	this.$userApi.exportCOUsingPOST(this.action === 'add' ? 'I' : 'U', id, { responseType: 'blob' })
  		.then((resp) => {
  			if (resp.headers['content-disposition']) {
  				let filename = '';
  				const disposition = resp.headers['content-disposition'];
  				if (disposition && disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
            resp.data as Blob,
            '承辦人基本資料變更內容.pdf',
            resp.headers['content-type'],
  				);
  				notification.success({ Content: this.action === ActionType.Add ? '新增成功!' : '變更成功!' });
  				this.$router.replace({ name: 'CO_CoInfoTable' });
  			} else {
  				this.$userApi.exportCOUsingPOST(this.action === 'add' ? 'I' : 'U', id)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally();
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.isLoading = false;
  	    this.setLoading(false);
  		});
  }

  save() {
  	const funcObj = {
  		add: this.$userApi.newUserUsingPOST,
  		edit: this.$userApi.updateUserUsingPOST,
  	};
  	this.isLoading = true;
  	this.setLoading(true);
  	funcObj[this.action](this.form)
  		.then((resp) => {
  			const res = resp as any;
  			// console.log(res.data);
  			if (res.data.status === 200) {
  				if (res.data.data.auditMessage.length !== 0) {
  					// 有稽核訊息(auditMessage)跳彈窗再下載
  					infoModal.alertForListError({
  						contentList: res.data.data.auditMessage,
  						onCallback: () => {
  							infoModal.alertForSingleError({
  								title: '提醒',
  								content: '請將異動申請書用印後寄回 富邦人壽團險部，審核完成後生效',
  								onCallback: () => {
  									this.downloadPdf(res.data.data.policyId);
  								},
  							});
  						},
  					});
  				} else {
  					infoModal.alertForSingleError({
  						title: '提醒',
  						content: '請將異動申請書用印後寄回 富邦人壽團險部，審核完成後生效',
  						onCallback: () => {
  							this.downloadPdf(res.data.data.policyId);
  						},
  					});
  				}
  			} else {
  				this.setLoading(false);
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.isLoading = false;
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.coInfo__print__content {
  padding-top: 230px;
  border-bottom: 1px #ddd dashed;
  padding-bottom: 10px;
}
.coInfo__print__wrap {
  margin: 25px 0 80px 0;
}
.coInfo__print__title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  background-color: #F5F5F5;
  border-radius: 4px;
  padding: 6px 0;
}
.coInfo__table__wrap {
  padding-bottom: 33px;
  padding-top: 27px;
}
.coInfo__edit__table {
  padding: 25px 90px;
  margin-top: 10px;
}
.block__btns {
  margin: 40px 0;
  button {
    width: 150px;
    max-width: 100%;
    margin: 0 5px;
  }
}
.form__line {
  margin-bottom: 23px;
}
.reminder__txt {
  margin-bottom: 40px;
  p {
    font-size: 14px;
    margin-bottom: 5px;
  }
}
</style>
