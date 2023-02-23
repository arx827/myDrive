<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="">
        <div class="row">
          <div class="col">
            <div class="page__title">
              項目明細
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="detail__status bg--pale">
              <div class="row">
                <div class="col-3">
                  <div class="row">
                    <div class="col">
                      <div class="status__title">
                        上傳檔案
                      </div>
                      <div>
                        <a
                          href="#"
                          @click.prevent="downloadLink(detailData)"
                        >
                          <u>{{ detailData.fileName }}</u>
                        </a>
                      </div>
                    </div>
                    <div class="col">
                      <div class="status__title">
                        作業類別
                      </div>
                      <div>
                        {{ detailData.procDesc }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="col-1 d-flex justify-content-center"
                  style="width: 12%;"
                >
                  <div class="border-right" />
                </div>
                <div class="col-3">
                  <div class="row">
                    <div class="col">
                      <div class="status__title">
                        上傳日期
                      </div>
                      <div>
                        {{ detailData.createDate }}
                      </div>
                    </div>
                    <div class="col">
                      <div class="status__title">
                        上傳時間
                      </div>
                      <div>
                        {{ detailData.createTime }}
                      </div>
                    </div>
                    <div class="col">
                      <div class="status__title">
                        上傳筆數
                      </div>
                      <div>
                        {{ detailData.totalCnt }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="col-1 d-flex justify-content-center"
                  style="width: 12%;"
                >
                  <div class="border-right" />
                </div>
                <div class="col-3">
                  <div class="row">
                    <div class="col">
                      <div class="status__title">
                        成功筆數
                      </div>
                      <div>
                        {{ detailData.successCnt }}
                      </div>
                    </div>
                    <div class="col">
                      <div class="status__title">
                        失敗筆數
                      </div>
                      <div>
                        {{ detailData.errorCnt }}
                      </div>
                    </div>
                    <div class="col">
                      <div class="status__title">
                        處理狀態
                      </div>
                      <div>
                        {{ detailData.statusDesc }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col position-relative">
            <a-radio-group
              v-model="tabValue"
              class="status__tab text-center w-100"
              default-value="1"
              button-style="solid"
            >
              <a-radio-button
                v-for="(item, index) in tabOption"
                :key="index"
                class="w-20"
                :value="item.value"
              >
                {{ item.name }}
              </a-radio-button>
            </a-radio-group>
            <a-dropdown :trigger="['click']">
              <a
                class="btn__radius--primary--small d-inline-flex px-4"
                href="#"
                style="position: absolute; top: 0; right: 10px;"
                @click="e => e.preventDefault()"
              >
                <img
                  class="me-1"
                  src="@/assets/button_download.svg"
                  alt=""
                >
                <span>附件下載</span>
              </a>
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="(item, index) in demoList"
                  :key="index"
                >
                  <a
                    href="javascript:;"
                    @click="downloadDemo(item.docId, item.fileName)"
                  >{{ item.fileName }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="datail__result-table">
              <fbl-data-grid
                class="result__table"
                :row-key="detailGrid.rowKey"
                :columns="detailGrid.columns"
                :data="detailGrid.data"
                :pagination="detailGrid.pagination"
                :custom-row="detailGrid.customRow"
                :scroll="{ x: true }"
                @tableChange="onPageChange($event)"
              />

              <div class="block__btns text-center mb-5">
                <button
                  class="btn__radius--primary"
                  @click="back"
                >
                  返回上傳結果
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class DatasUpload extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  tabValue = 'A'; // A:全部、S:成功、F:錯誤、H:健告、D:失能

  detailData = null;

  tabOption = [
  	{ name: '全部', value: 'A' },
  	{ name: '成功', value: 'S' },
  	{ name: '錯誤', value: 'F' },
  	{ name: '須補團體保險健康聲明書名單', value: 'H' },
  	{ name: '須補團險喪失工作能力保險問卷名單', value: 'D' },
  ]

  demoList = [];

	public detailGrid = {
  	rowKey: 'seq',
  	data: [
  	],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 1,
  		pageSizeOptions: ['10', '25', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'seq',
  			title: '序號',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insName',
  			title: '姓名',
  			width: '120px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'idNo',
  			title: '身分證字號',
  			width: '120px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtNo',
  			title: '保險證號',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'attrDesc',
  			title: '屬性',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'statusDesc',
  			title: '處理結果',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'errorMsg',
  			title: '檢核訊息',
  			width: '200px',
				formatter: (data) => data.errorMsg.join(),
  		},
  	],
	};

  @Watch('tabValue')
	onChange(val) {
  	this.callAPI(val);
	}

  getDemoFile() {
  	this.$uploadApi.batchUploadAttachedUsingPOST()
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.demoList = resp.data.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
  }

  created() {
  	const query = JSON.stringify(this.$global.getQuery().detailQuery);
  	const createDate = DateTimeFormmat.transformRocDate(moment(JSON.parse(query).createDate).format('YYYY/MM/DD'));
  	const createTime = moment(JSON.parse(query).createDate).format('HH:mm');
  	this.detailData = JSON.parse(query);
  	this.detailData.createDate = createDate;
  	this.detailData.createTime = createTime;
  	this.getDemoFile();
  	this.callAPI(this.tabValue);
  }

  callAPI(searchType) {
  	this.setLoading(true);
    	this.$uploadApi.batchUploadDetailUsingPOST(this.detailGrid.pagination.current - 1, { batchUploadId: this.detailData.uuid, status: searchType }, this.detailGrid.pagination.pageSize)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.detailGrid.data = resp.data.data.content;
  				this.detailGrid.pagination.total = parseInt(resp.data.data.totalElements);
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  downloadDemo(id, name) {
  	this.$docsetApi.downloadNasFileForDocsetUsingPOST(id, { responseType: 'blob' })
  		.then((resp) => {
  			console.log(resp);
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
  			} else {
  				this.$docsetApi.downloadNasFileForDocsetUsingPOST(id)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally();
  			}
  		});
  }

  downloadLink(data) {
  	this.$uploadApi.batchUploadDownloadFileUsingPOST(data.uuid, { responseType: 'blob' })
  		.then((resp) => {
  			console.log(data.fileName);
  			if (resp.headers['content-type']) {
  				this.$blobUtils.download(
            resp.data as Blob,
            `${data.fileName}`,
  				);
  			} else {
  				this.$uploadApi.batchUploadDownloadFileUsingPOST(data.uuid)
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
  			// console.log();
  		});
  }

  back() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'DatasUploadResult',
  		query: {
  			pagination: this.$global.getParam().query.pagination,
  		},
  	});
  	// setTimeout(() => {
  	// 	this.$router.push({ name: 'DatasUploadResult' });
  	// }, 300);
  }

  onPageChange(e) {
  	this.detailGrid.pagination = e.pagination;
  	this.callAPI(this.tabValue);
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.detail__status {
	padding: 28px 40px;
	margin-bottom: 30px;
	.status__title {
		color: #485057;
		font-size: 14px;
		font-weight: bold;
		margin-bottom: 5px;
	}
}

.status__tab {
	margin-bottom: 24px	;
}

.border-right {
	// border-left: 1px #D9D9D9 solid;
	height: 100%;
	width: 1px;
	background: #D9D9D9;
	// display: block;
}
</style>
