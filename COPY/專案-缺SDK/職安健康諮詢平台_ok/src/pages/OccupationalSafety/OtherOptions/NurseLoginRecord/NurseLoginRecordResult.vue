<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        查詢結果
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small"
          :disabled="!downloadEnabled"
          @click="downloadResult"
        >
          下載
        </button>
      </div>
    </div>
    <div class="table">
      <FblDataGrid
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data="gridData.data"
        :pagination="gridData.pagination"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
        @tableChange="onPageChange($event)"
      />
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="goback()"
      >
        返回
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { CertPassUserHistoryQueryDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid } })
export default class NurseLoginRecordResult extends Vue {
	@Action('setLoading') setLoading;

	$payLoad: CertPassUserHistoryQueryDto = null;

	// 查無資料則不提供下載功能
  downloadEnabled = true;

	gridData = {
		rowKey: 'rowkey',
		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['5', '10', '25'],
			showSizeChanger: true,
			showQuickJumper: true,
		},
		columns: [
			{
				type: FblColumnType.PLAIN,
				property: 'adId',
				title: '護理AD',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'name',
				title: '登入護理人員',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'loginDt',
				title: '登入時間',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'reviewAdId',
				title: '覆核人AD',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'reviewName',
				title: '覆核人員',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'reviewDt',
				title: '覆核時間',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'result',
				title: '覆核結果',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'reason',
				title: '原因',
				width: 200,
			},
		],
	}

	// JSON -> 'yyyy/mm/dd hh:mm:ss'
	formatDatetime(datetime) {
		const parts = datetime.split('T');
		let dtDisplay = parts[0].replaceAll('-', '/');
		dtDisplay = dtDisplay.concat(' ', parts[1].split('.')[0]);
		return dtDisplay;
	}

	// DTO -> FblDataGrid (for 護理師登入歷史紀錄-查詢)
	toGridData(rawData) {
		let curKey = 1;
		this.gridData.data = rawData.content;
		this.gridData.pagination.total = Number(rawData.totalElements);
		this.gridData.data.forEach((object) => {
			const inDt = object.loginDt; // 2022-07-15T14:58:07.687+0800
			object.loginDt = inDt && this.formatDatetime(inDt); // 2022/07/15 14:58:07
			const reDt = object.reviewDt;
			object.reviewDt = reDt && this.formatDatetime(reDt);
			object.rowkey = curKey;
			curKey += 1;
		});
		console.log(this.gridData.data);
	}

	// 切換至其他頁數
	onPageChange(e) {
		this.gridData.pagination = e.pagination;
  	this.getData();
	}

	// 獲取輸入參數(查詢、下載輸入皆為 CertPassUserHistoryQueryDto)
	// API: 護理師登入歷史紀錄-查詢
	getData() {
		this.setLoading(true);
		// 從 Index 頁取得篩選條件
		const query = this.$global.getQuery();
		this.$payLoad = {
			pageNo: this.gridData.pagination.current - 1,
			pageSize: this.gridData.pagination.pageSize,
			adId: query.adId,
			name: query.name,
			loginStartDt: query.loginStartDt,
			loginEndDt: query.loginEndDt,
			reviewAdId: query.reviewAdId,
			reviewName: query.reviewName,
			reviewStartDt: query.reviewStartDt,
			reviewEndDt: query.reviewEndDt,
			certPassLogProvedEnum: query.certPassLogProvedEnum,
  	};
		console.log(this.$payLoad);
		this.$AdminControlManagerApi.loginReviewWorkHistoryUsingPOST(this.$payLoad)
			.then((resp) => {
				if (resp.data.status == 200) {
					const rawData = resp.data.data;
					this.downloadEnabled = Number(rawData.totalElements) !== 0;
					if (rawData) {
						this.toGridData(rawData);
					}
  			} else {
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
						apiError: resp.data.apiError,
  				});
  			}
			})
			.catch((error) => {
				console.log('Error:', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 護理師登入歷史紀錄-下載
	downloadResult() {
		this.$AdminControlManagerApi.loginReviewWorkHistoryDownloadUsingPOST(this.$payLoad, { responseType: 'blob' })
			.then((resp) => {
				if (resp.status == 200) {
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
  				}
  			} else {
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
  				});
  			}
			})
			.catch((error) => {
				console.log('Error:', error);
			});
	}

	// 回上頁
	goback() {
  	this.$router.push({ name: 'NurseLoginRecordIndex' });
	}

	created() {
  	this.getData();
	}

	updated() {
  	window.parseWord();
	}
}
</script>
<style lang="scss" scoped>
  .btn__wrap {
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
