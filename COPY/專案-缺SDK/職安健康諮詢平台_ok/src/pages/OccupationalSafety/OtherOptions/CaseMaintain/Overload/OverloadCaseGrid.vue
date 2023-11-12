<template>
  <div>
    <div v-if="Object.keys(gridData.data).length > 0">
      <div
        v-for="(item, index) in Object.values(gridData.data)"
        :key="index"
      >
        <a-table
          class="table-overload"
          :row-key="gridData.rowKey"
          :data-source="item"
          :columns="gridData.columns[`table_${index}`]"
          :pagination="gridData.pagination"
          :scroll="{ x: true }"
        >
          <!-- 表單項目/編號 -->
          <template
            slot="formId"
            slot-scope="text, slotProps"
          >
            <div
              :class="{'text--green': slotProps.formType === 'E0401' || slotProps.formType === 'E0402' || slotProps.formType === 'E0404'}"
              @click="openFormPreviwModal(slotProps)"
            >
              {{ slotProps.formId }}
            </div>
          </template>
          <!-- 按鈕 功能列 -->
          <template
            slot="handleTemp"
            slot-scope="text, slotProps"
          >
            <div class="table__btnWrap">
              <!-- mail -->
              <button
                v-if="slotProps.formCategory === '自我評估'"
                class="icon__btn"
                :class="{'btn--disable':slotProps.status==='1' || form[index].isClose}"
                :disabled="slotProps.status==='1' || form[index].isClose"
                @click="onNotify(slotProps)"
              >
                <img
                  v-if="slotProps.recordId || !form[index].isClose"
                  src="@/assets/images/button_mail_green.svg"
                >
                <img
                  v-else
                  src="@/assets/images/button_mail_gray.svg"
                >
              </button>
              <!-- edit -->
              <button
                v-if="slotProps.formType == 'E0404'"
                class="icon__btn"
                :class="{'btn--disable': slotProps.status !=='0' || form[index].isClose}"
                :disabled="slotProps.status!=='0' || form[index].isClose"
                @click="onEdit(slotProps)"
              >
                <a-icon type="edit" />
              </button>
              <!-- add -->
              <button
                v-if="slotProps.formType == 'E0404'"
                class="icon__btn"
                :class="{'btn--disable': !slotProps.showAdd || form[index].isClose}"
                :disabled="!slotProps.showAdd || form[index].isClose"
                @click="onAdd(slotProps)"
              >
                <a-icon type="plus" />
              </button>
              <!-- upload -->
              <a-upload
                v-if="slotProps.formType == 'E0405'"
                name="file"
                accept=".pdf, .docx, .doc, .xls, .xlsx"
                :file-list="uploadedFileList"
                :custom-request="uploadFlie"
                :before-upload="beforeUpload"
                :show-upload-list="false"
                :disabled="form[index].isClose"
                @change="handleChange"
              >
                <button
                  class="icon__btn"
                  :class="{'btn--disable':form[index].isClose}"
                  :disabled="form[index].isClose"
                  @click="uploadBtn(slotProps, form[index])"
                >
                  <a-icon type="upload" />
                </button>
              </a-upload>
              <!-- download -->
              <button
                class="icon__btn"
                :class="{'btn--disable':!slotProps.recordId}"
                :disabled="!slotProps.recordId"
                @click="onDownload(slotProps)"
              >
                <a-icon type="download" />
              </button>
            </div>
          </template>
          <!-- 結案狀態/原因 -->
          <template
            slot="formCategory"
            slot-scope="text, slotProps"
          >
            <template v-if="slotProps.rowkey === item.length">
              <div class="pb-2">
                結案狀態/原因
              </div>
              <a-switch
                v-model="form[index].isClose"
                checked-children="結案"
                un-checked-children="未結"
                :class="{'switch--disable':slotProps.formCategory === 'Y'}"
                :disabled="slotProps.formCategory === 'Y'"
              />
            </template>
            <template v-else-if="slotProps.rowkey == item.length-1">
              班別類型：{{ slotProps.formCategory }}
            </template>
            <template v-else>
              {{ slotProps.formCategory }}
            </template>
          </template>
          <!-- 異常歷程 -->
          <template
            slot="formType"
            slot-scope="text, slotProps"
          >
            <template v-if="slotProps.rowkey == item.length">
              <a-checkbox
                v-model="form[index].isErrorClose"
                :disabled="form[index].isClose"
              >
                異常歷程
              </a-checkbox>
              <a-textarea
                v-model="form[index].closeDesc"
                :auto-size="{ minRows: 3 }"
                :disabled="form[index].isClose"
                placeholder="e.g. 已完成醫師諮詢。"
                class="mt-1"
              />
            </template>
            <template v-else>
              {{ formTypeEnum.find((i) => i.key == slotProps.formType) ? formTypeEnum.find((i) => i.key == slotProps.formType).name : slotProps.formType }}
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <div
      v-else
      class="table__nodata"
    >
      <div class="border nodata__wrap">
        <div class="nodata__text">
          暫無資料
        </div>
        <img src="@/assets/images/image_nothing.svg">
      </div>
    </div>

    <LoadModal
      :visible="previewModal.modalVisible && previewModal.modalName==='LoadModal'"
      :record-id="previewModal.recordId"
      @closeLoadModal="closeFormPreviwModal"
    />
    <YearModal
      :visible="previewModal.modalVisible && previewModal.modalName==='YearModal'"
      :record-id="previewModal.recordId"
      @closeYearModal="closeFormPreviwModal"
    />
    <DocTalkFormPreviewModal
      :visible="previewModal.modalVisible && previewModal.modalName==='DocTalkModal'"
      :record-id="previewModal.recordId"
      @closeFormModal="closeFormPreviwModal"
    />
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { CiIdDto, EmpWoReserveInfoIdDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import infoModal from '@/plugins/notification/infoModal';
import notification from '@/plugins/notification/infoNotification';
import LoadModal from '@/pages/OccupationalSafety/StrangePrevent/StrangeMyRecord/LoadModal.vue';
import YearModal from '@/pages/OccupationalSafety/StrangePrevent/StrangeMyRecord/YearModal.vue';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import DocTalkFormPreviewModal from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/Overload/DocTalkFormPreviewModal.vue';

@Component({
	components: { DocTalkFormPreviewModal, LoadModal, YearModal },
})
export default class OverloadCaseGrid extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  period: string

  @Prop()
  uid: number

  form = [];

	uploadedFileList = [];

	dataMonthRowSpan = {}

	formCategoryRowSpan = {}

	formTypeRowSpan = {}

	previewModal = {
		modalVisible: false,
		modalName: null,
		recordId: null,
	}

  formTypeEnum = [
  	{
  		key: 'E0401',
  		name: '職業壓力過負荷評估量表',
  		category: '自我評估',
  		previewModal: 'LoadModal',
  		apiMethod: 'downloadOslasPdfUsingPOST1',
  	},
  	{
  		key: 'E0402',
  		name: '十年內心血管疾病發病風險評估量表 (Framingham Risk Score)',
  		previewModal: 'YearModal',
  		category: '自我評估',
  		apiMethod: 'downloadFrstPdfUsingPOST1',
  	},
  	{
  		key: 'E0403',
  		name: '危害分級建議表',
  		category: '醫生諮詢',
  		previewModal: null,
  		apiMethod: 'downloadHerfPdfUsingPOST',
  	},
  	{
  		key: 'E0404',
  		name: '醫師面談結果及採行措施表',
  		category: '醫生諮詢',
  		previewModal: 'DocTalkModal',
  		apiMethod: 'downloadPirmtPdfUsingPOST',
  	},
  	{
  		key: 'E0405',
  		name: '醫生諮詢表',
  		category: '醫生諮詢',
  		previewModal: null,
  		apiMethod: '',
  	},
  ]

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: {},
  }

  onEdit(data) {
  	const { formType, recordId } = data;
  	if (formType == 'E0404') {
  		this.$global.changeRouterAndaddParam({
  			toRouter: 'CaseMaintainDocTalkForm',
  			params: {
  				type: 'edit',
  			},
  			query: {
  				recordId,
  			},
  		});
  	}
  }

  onAdd({ infoId }) {
  	this.fetchAddPhysicianInterview(infoId);
  }

  onDownload(data) {
  	if (data.formType === 'E0405') {
  		this.fetchDownloaddDocFile(data.reserveInfoId);
  	} else {
  		const method = this.formTypeEnum.find((i) => i.key === data.formType) && this.formTypeEnum.find((i) => i.key === data.formType).apiMethod;
  		method ? this.fetchOverloadDownload(JSON.parse(data.recordId), method) : this.$infoNotification.error({ content: '無法完成下載項目，請再次嘗試。' });
  	}
  }

  uploadFlie(options) {
  	if (this.beforeUpload) {
  	  this.fetchUploadDocFile(options.file);
  	}
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		'.pdf,.docx,.doc,.xls,.xlsx',
  		3,
  	);
  	if (vaildResult.vaild == false) {
  		infoModal.alertError({ content: '限上傳 pdf、doc、docx、xls、xlsx 格式' });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  resetFile() {
  	this.uploadedFileList = [];
  }

  async handleChange(e) {
  	this.resetFile();
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this.uploadedFileList = e.fileList.slice(-1);
  		this.uploadedFileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			return val;
  		});
  	}
  	if (e.file.status == 'removed') {
  		this.uploadedFileList = this.uploadedFileList.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  	}
  }

  // 	上傳
  uploadBtn(data, formCloseInfo) {
  	console.log(data, formCloseInfo);
  }

  openFormPreviwModal(data) {
  	this.previewModal.modalName = this.formTypeEnum.find((i) => i.key === data.formType).previewModal;
  	this.previewModal.modalVisible = true;
  	this.previewModal.recordId = data.recordId;
  }

  closeFormPreviwModal() {
  	this.previewModal.modalVisible = false;
  	this.previewModal.recordId = null;
  }

  // 表格-合併列
  getRowSpan(property, gridData) {
  	const rowSpanList = [];
  	const dataTitle = gridData.length > 0 && gridData.map((dto) => dto[property]);
  	// 計算相同元素並以物件key顯示
  	const countedColumns = dataTitle.reduce((all, col) => {
  		if (col in all) {
  			all[col]++;
  		} else {
  			all[col] = 1;
  		}
  		return all;
  	}, {});
  	// 取相同元素的值
  	Object.values(countedColumns as number).forEach((item) => {
  		rowSpanList.push(item);
  		if (item > 1) {
  			for (let i = 0; i < item - 1; i++) {
  				rowSpanList.push(0);
  			}
  		}
  	});
  	return rowSpanList;
  }

  // 處理表格合併欄位
  getOverloadGridData() {
  	for (const [key, value] of Object.entries(this.gridData.data)) {
  		const maxIndex = value.length - 1;
  		this.$set(this.dataMonthRowSpan, key, this.getRowSpan('dataMonth', value));
  		this.$set(this.formCategoryRowSpan, key, this.getRowSpan('formCategory', value));
  		this.$set(this.formTypeRowSpan, key, this.getRowSpan('formType', value));
  		this.gridData.columns = {
  			...this.gridData.columns,
  			[key]: [
  				{
  					title: '月份',
  					dataIndex: 'dataMonth',
  					key: 'dataMonth',
  					width: 50,
  					customRender: (data, record, index) => ({
  						children: `${data}月`,
  						style: {
  							textAlign: 'center',
  						},
  						attrs: {
  							rowSpan: this.dataMonthRowSpan[key][index],
  						} as any,
  					}),
  				},
  				{
  					title: '表單類別',
  					dataIndex: 'formCategory',
  					key: 'formCategory',
  					width: 100,
  					customCell: (record, index) => {
  						const obj = {
  							style: {} as any,
  							attrs: {} as any,
  						};
  						if (index === maxIndex - 1) {
  							obj.attrs.colSpan = this.gridData.columns[key].length;
  						}
  						if (this.formCategoryRowSpan[key][index] === 0) {
  							obj.style.display = 'none';
  						} else {
  							obj.attrs.rowSpan = this.formCategoryRowSpan[key][index];
  						}

  						return obj;
  					},
  					scopedSlots: { customRender: 'formCategory' },
  				},
  				{
  					title: '表單名稱',
  					dataIndex: 'formType',
  					key: 'formType',
  					width: 180,
  					customCell: (record, index) => {
  						const obj = {
  							style: {} as any,
  							attrs: {} as any,
  						};
  						if (index === maxIndex - 1) {
  							obj.style.display = 'none';
  						} else if (index === maxIndex) {
  							obj.attrs.colSpan = this.gridData.columns[key].length - 1;
  							obj.style.borderRight = '1px solid #e8e8e8';
  						}

  						if (this.formTypeRowSpan[key][index] === 0) {
  							obj.style.display = 'none';
  						} else {
  							obj.attrs.rowSpan = this.formTypeRowSpan[key][index];
  						}
  						return obj;
  					},
  					scopedSlots: { customRender: 'formType' },
  				},
  				{
  					title: '表單項目/編號',
  					dataIndex: 'formId',
  					key: 'formId',
  					width: 150,
  					customCell: (record, index) => {
  						const obj = {
  							style: {
  								borderRight: 'none',
  							} as any,
  							attrs: {} as any,
  						};
  						if (index > maxIndex - 2) {
  							obj.style.display = 'none';
  						}
  						return obj;
  					},
  					scopedSlots: { customRender: 'formId' },
  				},
  				{
  					title: '',
  					dataIndex: 'action',
  					key: 'action',
  					width: 150,
  					customCell: (record, index) => {
  						const obj = {
  							style: {} as any,
  							attrs: {} as any,
  						};
  						if (index > maxIndex - 2) {
  							obj.style.display = 'none';
  						}
  						return obj;
  					},
  					scopedSlots: { customRender: 'handleTemp' },
  				},
  				{
  					title: '執行狀態',
  					dataIndex: 'status',
  					key: 'status',
  					width: 90,
  					customRender: (data, record, index) => {
  						const obj = {
  							children: '--',
  							attrs: {} as any,
  						};
  						if (data) {
  							obj.children = data === '1' ? '完成' : '暫存';
  						}

  						if (index > maxIndex - 2) {
  							obj.attrs.colSpan = 0;
  						}
  						return obj as any;
  					},
  				},
  			],
  		};
  	}
  }

  // API: 新增醫師面談
  fetchAddPhysicianInterview(infoId) {
  	this.$AlRpnCaseInquiryControllerApi.addPhysicianInterviewUsingPOST({ infoId })
  		.then(() => {
  			this.fetchOverloadHistory();
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			notification.error({ content: '上傳失敗' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 上傳檔案(醫生諮詢)
  fetchUploadDocFile(file) {
  	this.setLoading(true);
  	this.$CaseMaintainUtilityApi.uploadFileAboutCaseMaintainUsingPOST(file)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp.data.data);
  			if (resp.data.status === 200) {
  				notification.success({ content: '上傳成功' });
  			} else {
  				notification.error({ content: resp.data.apiError && this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			notification.error({ content: '上傳失敗' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 發送通知
  onNotify({ formType, infoId }) {
  	infoModal.alertSuccess({
  		title: '是否發送Email表單填寫通知',
  		confirm: true,
  		content: '即將執行發送Email表單填寫通知給該位同仁，請問您確定要發送嗎？',
  		customContent: null,
  		onCallback: () => {
  			const API_KEYS = {
  				getSendFormNotificationUsingPOST: 'E0401', // 發送表單填寫通知
  				getSendTenYearMentalBurdenScaleNotificationUsingPOST: 'E0402', // 發送十年心力負荷量表通知
  			};

  			for (const [key, value] of Object.entries(API_KEYS)) {
  				if (value === formType) {
  					this.setLoading(true);
  					this.$AlRpnAlRpnWorkOvertimeListControllerApi[key]([infoId])
  						.then((resp) => {
  							// TEST:
  							// console.log(resp);
  							this.$global.changeRouterAndaddParam({
  								toRouter: 'CaseMaintainResult',
  								params: {
  									type: 'email',
  								},
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
  			}
  		},
  	});
  }

  // API: 個人負荷預防歷程查詢
  async fetchOverloadHistory() {
  	this.setLoading(true);
  	const searchForm = {
  		uid: this.uid,
  		year: this.period,
  	};
  	await this.$AlRpnCaseInquiryControllerApi.getPlphqUsingPOST(searchForm)
  		.then((resp) => {
  			// TEST:
  			// console.log('await: ', resp);
  			if (resp.data.status === 200) {
  				const getData = resp.data.data;
  				const sortData = getData.sort((a, b) => (JSON.parse(a.dataMonth) - JSON.parse(b.dataMonth)));
  				sortData.forEach(({
  					dataMonth, infoId, empWoPersonalLoadPreventionHistoryHofrQueryList, empWoPhysicianConsultationFormQueryLists, workClass, isClose, closeDesc, isErrorClose,
  				}, respIdx) => {
  					let rowkey = 1;
  					const month = moment(dataMonth).format('MM');
  					const mappingList = empWoPersonalLoadPreventionHistoryHofrQueryList && empWoPersonalLoadPreventionHistoryHofrQueryList.map(({ formType, recordId, ...other }) => ({
  						rowkey: rowkey++,
  						dataMonth: month,
  						infoId,
  						recordId: JSON.parse(recordId),
  						formType,
  						formCategory: this.formTypeEnum.find((i) => i.key === formType)?.category || formType,
  						...other,
  					}));
  					const mappingDocList = empWoPhysicianConsultationFormQueryLists && empWoPhysicianConsultationFormQueryLists.map(({
  							formType, fileNo, ...other
  						}) => ({
  							rowkey: rowkey++,
  							dataMonth: month,
  							infoId,
  							recordId: null,
  							formType: formType || 'E0405',
  							formCategory: this.formTypeEnum.find((i) => i.key === formType)?.category || '醫生諮詢',
  							forrmId: fileNo,
  							...other,
  						}));
  					const conbineList = mappingDocList ? mappingList.concat(mappingDocList) : mappingList;
  					this.gridData.data = {
  						...this.gridData.data,
  						[`table_${respIdx}`]: [
  							...conbineList,
  							{
  								rowkey: rowkey++,
  								dataMonth: month,
  								formCategory: workClass,
  							},
  							{
  								rowkey: rowkey++,
  								infoId,
  								dataMonth: month,
  								formCategory: isClose || 'N',
  								formType: closeDesc,
  								status: isErrorClose,
  							}],
  					};
  					this.form.push({
  						infoId,
  						isClose: !!(isClose === 'Y'),
  						closeDesc,
  						isErrorClose: !!(isErrorClose === 'Y'),
  					});
  					this.getOverloadGridData();
  				});
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

  // API: 下載檔案(醫生諮詢)
  fetchDownloaddDocFile(reserveInfoId) {
  	this.setLoading(true);
  	const $form: EmpWoReserveInfoIdDto = { reserveInfoId };
  	this.$CaseMaintainUtilityApi.getphysicianDownLoadUsingPOST($form, { responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			// console.log('export:', resp);
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
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
  				this.$CaseMaintainUtilityApi.getphysicianDownLoadUsingPOST($form)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 下載異常工作/十年心力負荷量/綜合評估/醫師面談結果之採行措施表
  fetchOverloadDownload(recordId, method) {
  	const $form: CiIdDto = {
  		recordId: [recordId],
  		uid: this.uid,
  	};
  	this.setLoading(true);
  	this.$AlRpnCaseInquiryControllerApi[method]($form, { responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			// console.log('export:', resp);
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
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
  				this.$AlRpnCaseInquiryControllerApi[method]($form)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  getFormList() {
  	return this.form.map((e) => ({
  		infoId: e.infoId,
  		closeDesc: e.closeDesc,
  		isClose: e.isClose ? 'Y' : 'N',
  		isErrorClose: e.isErrorClose ? 'Y' : 'N',
  	}));
  }

  // API: 修改個人歷程
  async modifyHistory() {
  	this.setLoading(true);
  	const $form = this.getFormList();
  	await this.$AlRpnCaseInquiryControllerApi.modifyPersonalHistoryUsingPOST($form)
  		.then((resp) => {
  			this.$emit('getModifyHistoryRespData', resp.data);
  		})
  	 	.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  @Watch('period')
  async periodOnChange(val) {
  	this.gridData.data = [];
  	this.form = [];
  	await this.fetchOverloadHistory();
  	this.$emit('getLastestUncloseCase');
  }
}
</script>
<style lang="scss" scoped>
.table__btnWrap {
  text-align: right;
  vertical-align: middle;
  button {
    margin-right: 10px;
    img {
      width: 16px;
      display: inline-block;
    }
  }
}
.icon__btn {
  background: #F5F8FC;
  border-radius: 16px;
  border: 0;
  width: 40px;
  height: 32px;
  color: #23C4A8;
  &:hover {
    color: #FFFFFF;
    background: #23C4A8;
    cursor: pointer;
		img {
			content: url("../../../../../assets/images/button_mail_white.svg");
		}
  }
  img {
    margin: auto;
  }
}
.btn--disable, .btn--disable:hover {
  background-color: #F5F5F5;
  color: #999999;
  cursor: not-allowed;
	img {
		content: url("../../../../../assets/images/button_mail_gray.svg");
	}
}
.text--green {
  text-decoration: underline;
  color: #23C4A8;
  white-space: pre-line;
	cursor: pointer;
}
.nodata__wrap {
  padding: 20px 0;
  width: 100%;
  text-align: center;
  .nodata__text {
    font-size: 20px;
    margin-bottom: 10px;
  }
  img {
    margin: auto;
  }
}
.table__nodata {
	margin-top: 25px;
  table {
    min-width: 100%;
  }
}
</style>
