<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="upload__wrap">
        <div class="row">
          <div class="col">
            <div class="page__title">
              資料整批上傳
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <!-- <img
              class="img__people d-none d-md-block"
              src="@/assets/image_parents.svg"
              alt=""
            > -->
          </div>
          <div class="col-md-6 col-10">
            <DataUploadTab :tab-value="5" />
          </div>
          <div class="col-12">
            <div class="upload__result-table">
              <fbl-data-grid
                class="upload__table"
                :row-key="resultGrid.rowKey"
                :columns="resultGrid.columns"
                :data="resultGrid.data"
                :pagination="resultGrid.pagination"
                :custom-row="resultGrid.customRow"
                :scroll="{ x: true }"
                @tableChange="onPageChange($event)"
              >
                <template
                  slot="filelink"
                  slot-scope="data"
                >
                  <div class="d-flex">
                    <div
                      class="link__file"
                      @click="downloadLink(data.data)"
                    >
                      {{ data.data.fileName }}
                    </div>
                  </div>
                </template>
                <template
                  slot="action"
                  slot-scope="data"
                >
                  <div class="d-flex">
                    <div
                      class="flex-center btn__result__detail btn__radius--primary--small"
                      :class="{'disabled': data.data.statusDesc !== '處理完成'}"
                      @click="toDetail(data.data)"
                    >
                      明細
                    </div>
                  </div>
                </template>
              </fbl-data-grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DataUploadTab from '@/components/shared/dataUpload/DataUploadTab.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, FblDataGrid, DataUploadTab } })
export default class DataUploadResult extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  tabUploadValue = 1;

  public resultGrid = {
  	rowKey: 'createDate',
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
  			type: FblColumnType.TEMPLATE,
  			property: 'fileName',
  			title: '上傳檔案',
  			width: '150px',
  			template: 'filelink',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'procDesc',
  			title: '作業類別',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'createDate',
  			title: '上傳日期',
  			width: '100px',
  			formatter: (data) => DateTimeFormmat.transformRocDate(moment(data.createDate).format('YYYY/MM/DD')),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'createDate',
  			title: '上傳時間',
  			width: '100px',
  			formatter: (data) => moment(data.createDate).format('HH:mm'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'totalCnt',
  			title: '上傳筆數',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'successCnt',
  			title: '成功筆數',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'errorCnt',
  			title: '失敗筆數',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'statusDesc',
  			title: '處理狀態',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'action',
  			title: '明細',
  			width: '100px',
  			template: 'action',
  		},

  	],
  };

  created() {
  	if (this.$global.getParam() !== null && this.$global.getParam().query.pagination) {
  		this.resultGrid.pagination = this.$global.getParam().query.pagination;
  	}
  	this.getTableData();
  }

  toDetail(data) {
  	if (data.statusDesc !== '處理完成') return;
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'DatasUploadDetail',
  		query: {
  			detailQuery: data,
  			pagination: this.resultGrid.pagination,
  		},
  	});
  }

  downloadLink(data) {
  	this.$uploadApi.batchUploadDownloadFileUsingPOST(data.uuid, { responseType: 'blob' })
  		.then((resp) => {
  			console.log(data.fileName);
  			if (resp.headers['content-disposition']) {
  				this.$blobUtils.download(
            resp.data as Blob,
            `${data.fileName}`,
  				);
  			} else {
  				this.$uploadApi.batchUploadDownloadFileUsingPOST(data.uuid)
  		    .then((resp) => {
  						console.log(resp);
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

  getTableData() {
  	this.setLoading(true);
  	this.$uploadApi.batchUploadResultPageUsingPOST(this.resultGrid.pagination.current - 1, this.resultGrid.pagination.pageSize)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.resultGrid.data = resp.data.data.content;
  				this.resultGrid.pagination.total = parseInt(resp.data.data.totalElements);
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onPageChange(e) {
  	this.resultGrid.pagination = e.pagination;
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'self',
  		query: {
  			pagination: e.pagination,
  		},
  	});
  	this.getTableData();
  }

  handleChange() {
  	console.log('');
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>

.link__file {
  color: #4CAAF5;
  text-decoration: underline;
  cursor: pointer;
}

.upload__wrap {
  // padding-bottom: 40px;
  border-bottom: 1px #CECECE dashed;
  // margin-bottom: 70px;
}
.uploader__wrap {
  margin-top: 30px;
}
.upload__result__wrap {
  padding-top: 30px;
  padding-bottom: 40px;
}
.upload__result-title {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 30px;
}
.upload__result-table {
  margin-top: 38px;
}
.btn__result__detail {
  &[disabled], &.disabled {
    cursor: not-allowed;
    background-color: #CECECE;
    border: 1px #CECECE solid;
    color: #999999;
    &:hover {
      color: #999999;
      outline: 0;
    }
  }
}
::v-deep {
  .upload__table-span {
    th {
      border: 1px #ffffff solid;
    }
  }
  .ant-upload-text {
    font-size: 16px;
  }
  .ant-upload-hint {
    font-size: 14px;
    color: #0000006E;
  }
  .ant-upload-drag-icon {
    svg {
      width: 48px;
      height: 48px;
    }
  }
	.ant-radio-button-wrapper {
		padding: 0 22px;
	}
}
</style>
