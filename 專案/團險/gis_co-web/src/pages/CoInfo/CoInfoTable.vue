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
    <div class="container">
      <div class="page__title">
        承辦人基本資料
        <div class="float-end">
          <div
            class="flex-center table__btn table__btn--add"
            @click="add"
          >
            <a-icon
              :style="{ color: 'white' }"
              type="plus"
            />
          </div>
        </div>
        <div class="clearfix" />
      </div>
      <fbl-data-grid
        class="query__table"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :scroll="{ x: true }"
      >
        <template
          slot="action"
          slot-scope="data"
        >
          <div class="d-flex">
            <div
              class="flex-center table__btn table__btn--edit"
              @click="editData(data.data)"
            >
              <img
                src="@/assets/button_edit.svg"
                alt=""
              >
            </div>
            <div
              class="flex-center table__btn table__btn--delete"
              @click="deleteData(data.data)"
            >
              <img
                src="@/assets/button_delet.svg"
                alt=""
              >
            </div>
          </div>
        </template>
      </fbl-data-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import notification from '@/plugins/info/infoNotification';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import infoModal from '@/plugins/info/infoModal';
import ActionType from './model';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class CoInfoTable extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  public grid = {
  	rowKey: 'userId',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'userName',
  			title: '姓名',
  			width: '120px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'userId',
  			title: '身分證字號',
  			width: '150px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'authNameList',
  			title: '權限',
  			width: '90px',
  			formatter: (data) => data.authNameList.toString(),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'utelNo',
  			title: '電話',
  			width: '180px',
  			formatter: (data) => `${data.utelAreaCode.length > 0 ? `${data.utelAreaCode}-` : ''}${data.utelNo}${data.utelExtensionNo ? `#${data.utelExtensionNo}` : ''}`,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'userEmail',
  			title: '電子信箱',
  			width: '180px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'status',
  			title: '狀態',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'action',
  			title: '',
  			width: '110px',
  			template: 'action',
  		},
  	],
  };

	authList = null;

  h = this.$createElement;

  add() {
  	this.$global.clearParam();
  	this.$router.push({ name: 'CoInfoChange' });
  }

  deleteData(data) {
  	Modal.confirm({
  		title: this.h('div', {}, '註銷確認'),
  		content: `您確定要註銷承辦人「${data.userName}」的資料嗎？`,
  		okType: 'danger',
  		okText: '確定',
  		cancelText: '取消',
  		icon: () => this.h('span', { attrs: { class: 'modal__icon modal__icon--delete' } }),
  		onOk: () => {
  			// API: 刪除
  			this.setLoading(true);
  			infoModal.alertForSingleError({
  				title: '提醒',
  				content: '請將異動申請書用印後寄回 富邦人壽團險部，審核完成後生效',
  				onCallback: () => {
  					this.downloadPdf(data.policyId);
  				},
  			});

  			// this.$userApi.deleteUserUsingPOST(data.policyId)
  			// 	.then((resp) => {
  			// 		if (resp.data.status === 200) {
  			// 			notification.success({
  			// 				Content: '刪除成功',
  			// 			});
  			// 			location.reload();
  			// 		} else {
  			// 			notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			// 		}
  			// 	})
  			// 	.catch((error) => {
  			// 		console.log('error status = ', error);
  			// 	})
  			// 	.finally(() => {
  			// 		this.setLoading(false);
  			// 	});
  		},
  	});
  	// 刷新難字
  	setTimeout(() => {
  		window.parseWord();
  	}, 100);
  }

  downloadPdf(id) {
  	this.setLoading(true);
  	this.$userApi.exportCOUsingPOST('D', id, { responseType: 'blob' })
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
            '承辦人基本資料內容.pdf',
            resp.headers['content-type'],
  				);
  			} else {
  				this.$userApi.exportCOUsingPOST('D', id)
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
  	    this.setLoading(false);
  		});
  }

  async editData(data) {
  	// 存下資料 導去編輯頁
  	this.$set(data, 'authId', this.authList.find((e) => (e.authName === data.authNameList[0])).authId);
  	const query = {
  		form: {
  			userName: data.userName,
  			userId: data.userId,
  			utelNo: data.utelNo,
  			utelExtensionNo: data.utelExtensionNo,
  			userEmail: data.userEmail,
  			authId: data.authId,
  			utelAreaCode: data.utelAreaCode,
  			policyNo: data.policyNo,
  			policySeq: data.policySeq,
  			policyId: data.policyId,
  		},
  		initForm: {
  			userName: data.userName,
  			userId: data.userId,
  			utelNo: data.utelNo,
  			utelExtensionNo: data.utelExtensionNo,
  			userEmail: data.userEmail,
  			authId: data.authId,
  			utelAreaCode: data.utelAreaCode,
  			policyNo: data.policyNo,
  			policySeq: data.policySeq,
  			policyId: data.policyId,
  		},
  		action: ActionType.Edit,
  	};
  	const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CoInfoChange',
  		query: encryptQuery,
  	});
  }

  getCoInfo() {
  	const loginInfo = this.$user.getMe();
  	const data = {
  		policyNo: loginInfo.policyNo,
  		policySeq: loginInfo.policySeq,
  	};
  	this.$userApi.listUsingPOST1(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.grid.data = resp.data.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.isDownloading = false;
  		});
  }

  async created() {
  	await this.$userInfo.getAuthId().then((e) => {
  		this.authList = e;
  	});
  	this.getCoInfo();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.coInfo__table__wrap {
  padding-bottom: 33px;
  padding-top: 27px;
}
.query__table {
  margin-bottom: 50px;
}
</style>
