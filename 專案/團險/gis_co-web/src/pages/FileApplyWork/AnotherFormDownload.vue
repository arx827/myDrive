<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="page__title">
        其他表單下載
        <span class="float-end fw-normal">共 {{ grid.pagination.total }} 筆</span>
      </div>
      <fbl-data-grid
        class="query__table"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :custom-row="grid.customRow"
        :scroll="{ x: true }"
        @tableChange="onPageChange($event)"
      >
        <template
          slot="downloadFile"
          slot-scope="data"
        >
          <a
            class="icon__btn"
            href="#"
            @click.prevent="downloadFile(data.data)"
          >
            <img
              src="@/assets/button_download.svg"
              alt=""
            >
          </a>
        </template>
      </fbl-data-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, FblPageEvent } from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class AnotherFormDownload extends Vue {
  @Prop()
  breadcrumb: {}

	@Action('setLoading') setLoading;

  public grid = {
  	rowKey: 'id',
  	data: null,
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '25', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'docinstruction',
  			title: '表單名稱',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'id',
  			title: '',
  			width: 0,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'filePath',
  			title: '',
  			width: '62px',
  			template: 'downloadFile',
  		},
  	],
  };

  // 下載某列檔案
  downloadFile(data) {
  	this.setLoading(true);
  	// 文件下載-下載
  	this.$docDownloadApi.downloadDocFileUsingPOST(data.id, { responseType: 'blob' })
  		.then((resp) => {
  			let filename = '';
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
						resp.data as Blob,
						filename,
						resp.headers['content-type'],
  				);
  				this.setLoading(false);
  			} else {
  				this.$docDownloadApi.downloadDocFileUsingPOST(data.id)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  			// if (disposition) {
  			// 	this.$blobUtils.download(
  			// 		resp.data as Blob,
  			// 		`${data.docinstruction}_${Number.parseInt(moment().format('YYYY')) - 1911}${moment().format('MMDD')}.pdf`,
  			// 	);
  			// } else {
  			// 	this.$docDownloadApi.downloadDocFileUsingPOST(data.id)
  			// 		.then((resp) => {
  			// 			console.log(resp);
  			// 			const respData = JSON.stringify(resp);
  			// 			const apiErrorMsg = JSON.parse(respData).data.apiError;
  			// 			notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  			// 		}).catch((err) => {
  			// 			console.log(err);
  			// 		}).finally();
  			// }
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  getDatas() {
  	this.setLoading(true);
  	// 文件下載-查詢結果頁
  	this.$docDownloadApi.findDocDownloadQueryUsingPOST(this.$user.getMe().policyNo.charAt(0))
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.grid.data = resp.data.data;
  				this.grid.pagination.total = this.grid.data.length;
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
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
  	this.getDatas();
  }

  onPageChange(e) {
  	this.grid.pagination = e.pagination;
  	this.getDatas();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.page__title {
  margin-bottom: 10px;
}
::v-deep{
	.query__table {
		margin-bottom: 50px;
	}
}
.query__tab {
  width: 100%;
  margin-top: 12px;
  .ant-radio-button-wrapper {
    width: 176px;
    text-align: center;
  }
}
.query__total {
  margin-top: -30px;
}

::v-deep{
	.query__table {
		tr {
			td:first-child, th:first-child{
				padding-left: 32px;
			}
	  }
  }
  .ant-table-thead{
    tr th span{
        font-size: 14px;
    }
  }
}
</style>
