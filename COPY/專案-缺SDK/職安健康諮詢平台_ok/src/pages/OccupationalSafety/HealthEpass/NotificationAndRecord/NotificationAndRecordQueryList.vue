<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          查詢結果
        </div>
      </div>
      <div class="notification__wrap">
        <div
          v-if="noticeLevel2DtoList"
          class="pb-5"
        >
          <div
            class="notification__label"
          >
            2級
          </div>
          <a-table
            :row-key="gridData.rowKey"
            :columns="gridData.columns"
            :data-source="gridData.data2"
            :row-selection="rowSelection2"
            :pagination="false"
          >
            <a-table
              slot="expandedRowRender"
              slot-scope="slotProps"
              :row-key="innerGridData.rowKey"
              :columns="innerGridData.columns"
              :data-source="innerGridData.data2[slotProps.index]"
              :pagination="false"
            />
          <!-- <p
            v-else
            slot="expandedRowRender"
            class="m-0"
          >
            暫無資料
          </p> -->
          </a-table>
        </div>
        <div
          v-if="noticeLeve3UpDtoList"
          class="pb-5"
        >
          <div
            class="notification__label mt-5"
          >
            3級以上
          </div>
          <a-table
            :row-key="gridData.rowKey"
            :columns="gridData.columns"
            :data-source="gridData.data3"
            :row-selection="rowSelection3"
            :pagination="false"
          >
            <a-table
              slot="expandedRowRender"
              slot-scope="slotProps"
              :row-key="innerGridData.rowKey"
              :columns="innerGridData.columns"
              :data-source="innerGridData.data3[slotProps.index]"
              :pagination="false"
            />
          <!-- <p
            v-else
            slot="expandedRowRender"
            class="m-0"
          >
            暫無資料
          </p> -->
          </a-table>
        </div>
      </div>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary--outline mx-1 mb-3"
          @click="back"
        >
          返回上一頁
        </button>
        <button
          class="btn__radius--primary--outline mx-1 mb-3"
          @click="sendDoctorConsult"
        >
          發送醫師諮詢
        </button>
        <button
          class="btn__radius--primary mx-1 mb-3"
          @click="sendNotification"
        >
          發送衛教通知
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';

@Component({ })
export default class NotificationAndRecordQueryList extends Vue {
@Action('setLoading') setLoading;

  h = this.$createElement;

  type: string = '';

	noticeLeve3UpDtoList = null;

	noticeLevel2DtoList = null;

	selectedRowAll2 = []; // 2級勾選列的資料

	selectedRowKeyAll2 = []; // 2級勾選列的index

	selectedRowAll3 = []; // 3級勾選列的資料

	selectedRowKeyAll3 = []; // 3級勾選列的index

  // 父層 欄位資料
  gridData = {
  	rowKey: 'index',
  	data2: [],
  	data3: [],
  	innerData: [],
  	columns: [
  		{
  			title: '檢查日期',
  			dataIndex: 'checkDate',
  			key: 'checkDate',
  			// width: 100,
  			customRender: (data) => {
  				if (data) {
  					return	moment(data).format('YYYY/MM/DD');
  				} return '';
  			},
  		},
  		{
  			title: '員工身分證號',
  			dataIndex: 'idNo',
  			key: 'idNo',
  			width: 150,
  		},
  		{
  			title: '員工姓名',
  			dataIndex: 'name',
  			key: 'name',
  			width: 100,
  		},
  		{
  			title: '工作縣市',
  			dataIndex: 'workArea',
  			key: 'workArea',
  			width: 100,
  		},
  		{
  			title: '衛教項目',
  			dataIndex: 'itemDesc',
  			key: 'itemDesc',
  			width: 200,
  		},
  	],
  }

  // 子層 欄位資料
  innerGridData = {
  	rowKey: 'rowKey',
  	data2: {},
  	data3: {},
  	pagination: false,
  	columns: [
  		{
  			title: '近期衛教發送時間',
  			dataIndex: 'eduSendDate',
  			key: 'eduSendDate',
  			customRender: (data) => {
  				if (data) {
  					return	this.h('ul', [this.h('li', moment(data).format('YYYY/MM/DD')), this.h('li', moment(data).format('HH:mm:ss'))]);
  				} return '';
  			},
  		},
  		{
  			title: '近期醫師諮詢發送時間',
  			dataIndex: 'consultSendDate',
  			key: 'consultSendDate',
  			customRender: (data) => {
  				if (data) {
  					return	this.h('ul', [this.h('li', moment(data).format('YYYY/MM/DD')), this.h('li', moment(data).format('HH:mm:ss'))]);
  				} return '';
  			},
  		},
  		{
  			title: '跟催紀錄 1',
  			dataIndex: 'follow1',
  			key: 'follow1',
  		},
  		{
  			title: '跟催紀錄 2',
  			dataIndex: 'follow2',
  			key: 'follow2',
  		},
  		{
  			title: '醫師諮詢時間',
  			dataIndex: 'consultDate',
  			key: 'consultDate',
  			customRender: (data) => {
  				if (data) {
  					return	this.h('ul', [this.h('li', moment(data).format('YYYY/MM/DD')), this.h('li', moment(data).format('HH:mm:ss'))]);
  				} return '';
  			},
  		},
  	],
  }

  /**
   * Func
   */
  async getGridData(level, data) {
  	this.gridData[level] = data;
  	this.gridData[level].forEach((element, index) => {
  		element.index = index;
  		this.innerGridData[level][element.index] = [
  			{
  				eduSendDate: element.eduSendDate,
  				consultSendDate: element.consultSendDate,
  				follow1: element.follow1,
  				follow2: element.follow2,
  				consultDate: element.consultDate,
  				rowKey: index,
  			},
  		];
  	});
  }

  get rowSelection2() {
  	return {
  		onChange: (selectedRowKeys, selectedRows) => {
  			// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  			this.selectedRowKeyAll2 = selectedRowKeys;
  			this.selectedRowAll2 = selectedRows;
  		},
  		getCheckboxProps: (record) => ({
  			props: {
  				// disabled: record.length === 0, // Column configuration not to be checked
  				name: record.name,
  			},
  		}),
  	};
  }

  get rowSelection3() {
  	return {
  		onChange: (selectedRowKeys, selectedRows) => {
  			// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  			this.selectedRowKeyAll3 = selectedRowKeys;
  			this.selectedRowAll3 = selectedRows;
  		},
  		getCheckboxProps: (record) => ({
  			props: {
  				// disabled: record.length === 0, // Column configuration not to be checked
  				name: record.name,
  			},
  		}),
  	};
  }

  reRenderTd() {
  	// 重新排序
  	// const tr = document.getElementsByTagName('tr');
  	const tr = document.getElementsByClassName('ant-table-row');
  	const trHead = document.getElementsByClassName('ant-table-thead');
  	// trHead.childNodes[0].
  	console.log(document.getElementsByClassName('rc-table-expand-icon-cell'));
  	document.getElementsByClassName('ant-table-expand-icon-th')[0].before(document.getElementsByClassName('ant-table-selection-column')[0]);
  	for (let index = 0; index < tr.length; index++) {
  		const element = tr[index];
  		// element.cells[1].after(element.cells[0]);
  		element.childNodes[1].after(element.childNodes[0]);
  	}
  }

  getPostDatas(type) {
  	const datas = [];
  	const arr = this.selectedRowAll2.concat(this.selectedRowAll3);
  	arr.forEach((element) => {
  		if (type === 'sendNotification') {
  			datas.push({
  				itemId: element.itemId,
  				uid: element.uid,
  			});
  		} else {
  			datas.push(element.uid);
  		}
  	});
  	return datas;
  }

  // 發送醫生諮詢
  sendDoctorConsult() {
  	this.setLoading(true);
  	const datas = this.getPostDatas('sendDoctorConsult');
  	this.$HeRpnHeRpnNoticeSentControllerApi.getSendPhysicianConsultationUsingPOST(datas)
  		.then((resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'NotificationAndRecordSendResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'fail',
  					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  			});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 發送衛教通知
  sendNotification() {
  	this.setLoading(true);
  	const datas = this.getPostDatas('sendNotification');
  	this.$HeRpnHeRpnNoticeSentControllerApi.getSendHealthEducationUsingPOST(datas)
  		.then((resp) => {
  			console.log(resp);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'NotificationAndRecordSendResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'fail',
  					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  			});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 回上一頁
  back() {
  	history.go(-1);
  }

  async getData() {
  	const query = JSON.parse(await this.$encryptionDecryption.decrypt(this.$global.getQuery()));
  	if (query.type === 'single') {
  		await this.$HeRpnHeRpnNoticeSentControllerApi.getNoticeSentSingleQueryUsingPOST(query.data)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					this.noticeLevel2DtoList = resp.data.data.noticeLevel2DtoList;
  					this.noticeLeve3UpDtoList = resp.data.data.noticeLeve3UpDtoList;
  				} else {
  					notification.error({
  					  content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					});
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else {
  		await this.$HeRpnHeRpnNoticeSentControllerApi.getNoticeSentBatchQueryUsingPOST(query.data)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					this.noticeLevel2DtoList = resp.data.data.noticeLevel2DtoList;
  					this.noticeLeve3UpDtoList = resp.data.data.noticeLeve3UpDtoList;
  				} else {
  					notification.error({
  							content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
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
  }

  /**
   * Hook
   */
  async created() {
  	await this.getData();
  	console.log(this.noticeLevel2DtoList);
  	await this.getGridData('data2', this.noticeLevel2DtoList);
  	await this.getGridData('data3', this.noticeLeve3UpDtoList);
  	console.log(this.gridData, this.innerGridData);
  	setTimeout(() => {
  		this.reRenderTd();
  	}, 500);
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>

.notification__label {
	display: inline-block;
	font-size: 16px;
	font-weight: 600;
	padding: 3px 12px;
	margin-bottom: 25px;
	color: #fff;
	background: #363636;
	border-radius: 15px;
}

::v-deep {
	.ant-table-body {
		overflow-x: auto;
	}
  .ant-table-header-column {
    font-weight: 900;
  }
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -12px -16px -13px;
  }
	// .ant-table-row {
	// 	display: block;
	// 	overflow: hidden;
	// 	width: 100%;
	// }
	.ant-table-expanded-row, .ant-table-expanded-row th, .ant-table-expanded-row:hover{
		background: #E6F7FF;
	}
}

</style>
