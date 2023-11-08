import { ref } from 'vue';
import { Vue, Component, Watch } from "vue-property-decorator";
import AccordionArea from "@shared/AccordionArea.vue";
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';

// import {SysSelectDto} from '@fubonlife/ifap-api-axios-sdk'

import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { EmailRecordDto, EmailRecordPageInputDto, EmailRecordPageSpecDto } from "@fubonlife/ifap-api-axios-sdk";
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue'
import AjaxService from '@/services/ajaxService';

@Component({
  components: { AccordionArea, FblDataGrid },
})
export default class QueryEmailRecordPage extends Vue {
  @Action('setLoading') setLoading;

  dateFormat = 'YYYY/MM/DD';

	// 當前查詢條件，用來比對
	curSearchData = null;

  form = {
    syscode: [],
    subject: '',
    sentTime: [],
    recipient: '',
    senderArr: [],
    keyword: '',
    idCode: '',
  }

  // 清除條件後還可保留條件切頁
  tempForm={
    syscode: [],
    subject: '',
    sentTime: [],
    recipient: '',
    senderArr: [],
    keyword: '',
    idCode: '',
  }

// detail_郵件寄送紀錄
detailData = {
    visible: false,
    title: '',
    dataInfo: [
      {
        label: '寄件者',
        text: '',
      },
      {
        label: '收件者',
        text: '',
      },
      {
        label: '信件主旨',
        text: '',
      },
      {
        label: '寄送時間',
        text: '',
      },
      {
        label: '失敗類型',
        text: '',
      },
      {
        label: '信件結果',
        text: '',
      },
      {
        label: '約定之標頭',
        text: '',
      },
      {
        label: '重寄次數',
        text: '',
      },
    ],
    // detail_信件額外資訊
    extraInfoForMailDetailList: [
      {
        label: '',
        text: '',
      },
      {
        label: '',
        text: '',
      },
      {
        label: '',
        text: '',
      },
      {
        label: '',
        text: '',
      },
      {
        label: '',
        text: '',
      },
      {
        label: '',
        text: '',
      },
      {
        label: '',
        text: '',
      },
    ],
    // detail_信件內容
    content: '',
    // detail_附件資訊
    fileInfoForMailDetailList: [
      {
        label: '',
        text: '',
      },
    ],
  };

  /**
   * 下拉
   */
  // 系統別 下拉選單
  typeOptions = [];

  // 寄件者 下拉選單
  senderOptions = [];

  grid: FblPDataGridHolder<EmailRecordDto> = {
    rowKey: 'uuid',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      total: 5,
      showSizeChanger: true,
      pageSizeOptions: ['15', '25', '50'],
      showQuickJumper: true,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'sender',
        title: '寄件者',
        width: 300,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'recipient',
        title: '收件者',
        width: 300,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'subject',
        title: '信件主旨',
        minWidth: 300,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'sentTime',
        title: '寄送時間',
        width: 180,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'type',
        title: '失敗類型',
        width: 180,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'messageDesc',
        title: '信件結果',
        width: 180,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'idCode',
        title: '約定之標頭',
        width: 180,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'retryTime',
        title: '重寄次數',
        width: 180,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'detailControl',
        fixed: 'right',
        title: '詳細',
        width: 60,
      },
    ],
  }

  selectCurrentDate = null

  initPage() {
    // ---------- 設定預設 ---------- //
    // 寄送時間
    this.form.sentTime = [moment(new Date()).subtract(90, 'days'), moment(new Date())];
    // 寄件者
    if (this.senderOptions.length > 0) {
      this.form.senderArr[0] = this.senderOptions[0].value;
    }
  }

  clearValidate() {
    (this.$refs.formRef as any).clearValidate();
  }

  formRules: { [key: string]: ValidationRule[] } = {
    senderArr: [{ required: true, trigger: 'change', message: '欄位必填' }],
    idCode: [],
    sentTime: [],
  }

  // 切換檢核條件
  get filterFormRule() {
    if (this.form.sentTime.length <= 1) {
      this.formRules.idCode = [{ required: true, trigger: 'change', message: '請擇一填寫' }]
    } else {
      this.formRules.idCode = []
    }
    if (!this.form.idCode) {
      this.formRules.sentTime = [{ required: true, trigger: 'change', message: '請擇一填寫' }]
    } else {
      this.formRules.sentTime = []
    }
    return this.formRules;
  }

  // 取得總筆數資料 (筆數資料會在 剛開始取得資料時，更新 grid.pagination)
  get getDataNum() {
    return Number(this.grid.pagination.total);
  }

  // API: 發送紀錄查詢分頁
  getGridData() {
    this.setLoading(true);
    const startTime = this.tempForm.sentTime.length == 0 ? null : moment(this.tempForm.sentTime[0]).format('YYYY/MM/DD');
    const endTime = this.tempForm.sentTime.length == 0 ? null : moment(this.tempForm.sentTime[1]).format('YYYY/MM/DD');
    const formData = {
      page: this.grid.pagination.current - 1,
      size: this.grid.pagination.pageSize,
      emailRecordPageSpecDto: {
        startTime,
        endTime,
        idCode: this.tempForm.idCode,
        senderList: this.tempForm.senderArr,
        recipient: this.tempForm.recipient,
        subject: this.tempForm.subject,
        syscodeList: this.tempForm.syscode,
        keyword: this.tempForm.keyword,
      },

    }
    this.$emailRecordApi.queryEmailRecordPageSpecUsingPOST(formData)
      .then((resp) => {
        if (!resp.data.apiStatus) {
          this.$message.error(resp.data.apiErrorMessage);
          return;
        }
        // Success
          const getData = this.copyData(resp.data.data);
          const p = { ...this.grid.pagination };
          p.total = parseInt(resp.data.data.totalElements);
          this.grid.data = resp.data.data.content; // 資料放進格子
          this.grid.pagination = p;
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 使用AD帳號查詢應用系統寄件帳號及名稱
  async getQuerySysInfoWebUsing() {
    this.setLoading(true);
    await this.$emailRecordApi.querySysInfoWebUsingPOST()
      .then((resp) => {
        if (!resp.data.apiStatus) {
          this.$message.error(resp.data.apiErrorMessage);
          return;
        }
          const getData = this.copyData(resp.data.data);
          this.typeOptions = getData.sysInfo.map((i) => ({
            value: i.syscode,
            label: i.sysName,
          }))
          this.senderOptions = getData.senderInfo.map((i, index) => ({
            value: i.senderKey,
            label: i.senderLabel,
          }))
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 發送紀錄細項查詢
  getEmailRecordDetail(gridData) {
    // console.log('rowData =>', gridData)
    this.setLoading(true);

    // title
    this.detailData.title = gridData.subject;

    // TODO:
    // console.log('changeThis =>', this.detailData)

    this.$emailRecordApi.queryEmailRecordDetailUsingPOST({ idCode: gridData.idCode })
      .then((resp) => {
        if (!resp.data.apiStatus) {
          this.$message.error(resp.data.apiErrorMessage);
          return;
        }
          const getData = this.copyData(resp.data.data);
          // console.log('resp 資料=>', getData) // dataInfo 資料
          // 郵件紀錄
          this.detailData.dataInfo.find((i) => i.label === '寄件者').text = gridData.sender;
          this.detailData.dataInfo.find((i) => i.label === '收件者').text = gridData.recipient;
          this.detailData.dataInfo.find((i) => i.label === '信件主旨').text = gridData.subject;
          this.detailData.dataInfo.find((i) => i.label === '寄送時間').text = gridData.sentTime;
          this.detailData.dataInfo.find((i) => i.label === '失敗類型').text = gridData.type;
          this.detailData.dataInfo.find((i) => i.label === '信件結果').text = gridData.messageDesc;
          this.detailData.dataInfo.find((i) => i.label === '約定之標頭').text = gridData.idCode;
          this.detailData.dataInfo.find((i) => i.label === '重寄次數').text = gridData.retryTime;

          // 額外資訊
          this.detailData.extraInfoForMailDetailList = getData.extraInfoForMailDetailList && getData.extraInfoForMailDetailList.map((i) => ({
            label: i.columnName,
            text: i.columnData,
          }))

          // 郵件內容
          this.detailData.content = getData.content

          // 郵件附件名稱   (uuid應隱藏,並將值傳進dowmloadMailFileUsingPOST() )
          this.detailData.fileInfoForMailDetailList = getData.fileInfoForMailDetailList;
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // 取得查詢條件
	getCurSearch() {
		return Object.values(this.form).join();
	}

  	// API: 匯出有效清單Excel
  exportEmailRecordApi() {
		this.setLoading(true);
		AjaxService.postExportFile('/api/emailRecord/exportEmailRecord', {
			 startTime: this.tempForm.sentTime.length == 0 ? null : moment(this.tempForm.sentTime[0]).format('YYYY/MM/DD'),
        endTime: this.tempForm.sentTime.length == 0 ? null : moment(this.tempForm.sentTime[1]).format('YYYY/MM/DD'),
        idCode: this.tempForm.idCode,
        senderList: this.tempForm.senderArr,
        recipient: this.tempForm.recipient,
        subject: this.tempForm.subject,
        syscodeList: this.tempForm.syscode,
        keyword: this.tempForm.keyword,
		})
		.then((resp) => {
			if (!resp.data.apiStatus) {
				this.$message.error(resp.data.apiErrorMessage);
			}
		})
		.finally(() => {
			this.setLoading(false);
		})
	}

  /**
   * Event
   */
  // 下載附件檔案
  onClickDownloadWithFileId({ fileName, uuid }) {
    this.setLoading(true);

    this.$emailRecordApi.dowmloadMailFileUsingPOST({ fileId: uuid })
    .then((res) => {
      if (res.status === 200 && (res.data as any).status !== 400) {
        this.$emailRecordApi.dowmloadMailFileUsingPOST({ fileId: uuid }, { responseType: 'blob' })
          .then((res) => {
            if (res.status === 200) {
              const blob = new Blob([res.data] as BlobPart[])
              const blobURL = window.URL.createObjectURL(blob);
              const tempLink = document.createElement('a');
              tempLink.style.display = 'none';
              tempLink.href = blobURL;
              tempLink.setAttribute('download', fileName);
              tempLink.setAttribute('target', '_blank');
              document.body.appendChild(tempLink);
              tempLink.click();
              document.body.removeChild(tempLink);
              setTimeout(() => {
                window.URL.revokeObjectURL(blobURL)
              }, 100)
            }
          })
      } else {
        Modal.error({ content: '下載錯誤' })
      }
    })
    .finally(() => {
      this.setLoading(false);
    })
  }

  // 下拉模糊搜尋
  handleSearch(item, $event) {
    // console.log(item, $event);
  }

  // 查詢
  searchSubmit() {
    (this.$refs.formRef as any).clearValidate();
    // 檢核欄位
    (this.$refs.formRef as any).validate((valid) => {
			if (valid) {
        // 檢核通過
        // 清除條件後還可保留條件切頁
        this.tempForm = this.copyData(this.form);
        // 初始頁數
        this.grid.pagination.current = 1;
				this.getGridData()
        	// 當前條件
			this.curSearchData = this.getCurSearch();
			}
		});
  }

  // table 事件 (change page)
  onMasterPageChange(e) {
    const $pagination = e.pagination;
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== $pagination.current || p.pageSize !== $pagination.pageSize) {
      p.current = $pagination.current;
      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== $pagination.pageSize) {
        p.current = 1;
      }
      p.pageSize = $pagination.pageSize;
      this.grid.pagination = p;
      this.getGridData();
    }
  }

  // 點"匯出"
	exportFile() {
    if (this.curSearchData != this.getCurSearch()) {
			Modal.warning({
				content: '請先執行查詢，再執行匯出',
				okText: "確定",
			})
			return;
		}
		this.exportEmailRecordApi();
	}

  detailClick(grid) {
    if (grid.idCode) {
      this.getEmailRecordDetail(grid)
      this.detailData.visible = true;
    }
  }

  closeModal() {
    this.detailData.visible = false;
  }

  changePicker(a, b) {
    this.form.sentTime = a.length ? a : []
  }

  openChange(val) {
    if (val) {
      this.selectCurrentDate = this.form.sentTime.length ? this.form.sentTime[0] : null
    }
    this.selectCurrentDate = null
  }

  calendarChange(date, dateString) {
    if (date.length <= 1) {
      this.selectCurrentDate = date[0]
    } else {
      this.selectCurrentDate = null
    }
  }

  disabledDate(current, date) {
    if (this.selectCurrentDate != null) {
      return current < moment(this.selectCurrentDate).add(-90, 'days') || current > moment(this.selectCurrentDate).add(90, 'days')
    }
    return false
  }

  /**
   * Event
   */
  // 清除
  resetFrom() {
    (this.$refs.formRef as any).resetFields();
    this.initPage();
  }

  async mounted() {
    await this.getQuerySysInfoWebUsing();
    this.initPage();
    this.tempForm = this.copyData(this.form);
    this.getGridData();
    // this.form.senderArr = ['ifap@ut.fubonlife.com.tw']
    // this.form.idCode = 'VL907_85b8c51893134d08a24f3ed059c70a8d'
  }

  /**
   * 監聽
   */
  @Watch('form', { deep: true })
  watchForm() {
    // 欄位變更時，清空所有驗證
    this.clearValidate();
  }

   /**
   * 複製物件
   */
  copyData(data) {
    return JSON.parse(JSON.stringify(data));
  }
}
