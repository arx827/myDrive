import { Vue, Component, Watch } from "vue-property-decorator";
import AccordionArea from "@shared/AccordionArea.vue";
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

import {
  FblColumnType,
  FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue'
import { ValidDomainPageOutputDto } from "@fubonlife/ifap-api-axios-sdk";
import AjaxService from "@/services/ajaxService";

@Component({
  	components: { AccordionArea, FblDataGrid },
})
export default class ValidDomainSettingPage extends Vue {
	@Action('setLoading') setLoading;

	/**
	 * Data
	 */
	// 查詢條件 (畫面綁定)
	form = {
		mailDomain: null,	// 郵件網域
	}

	// 暫存查詢條件 (API input使用，點"查詢"時才會賦值)
	formInput = this.copyData(this.form);

	// 條件檢核規則
	formRules: { [key: string]: ValidationRule[] } = {
    // mailDomain: [{ required: true, trigger: 'change', message: '欄位必填' }],
  }

	// Modal 整批匯入
	uploadDomainModal = {
    isShow: false,
		uploadFiles: [],	// 上傳的文件
	}

	// Modal 新增有效郵件清單
	addValidDomainModal = {
		isShow: false,
		data: {
			domain: null,
		},
		rules: {
			domain: [{ required: true, trigger: 'change', message: '欄位必填' }],
		},
	}

	// Modal 編輯有效郵件清單
	editValidDomainModal = {
		isShow: false,
		data: {
			domainNo: null,
			domain: null,
			updateName: null,
			updateDate: null,
		},
		rules: {
			domain: [{ required: true, trigger: 'change', message: '欄位必填' }],
		},
	}

	// 當前查詢條件，用來比對
	curSearchData = null;

	// Table
  grid: FblPDataGridHolder<ValidDomainPageOutputDto> = {
		rowKey: 'domainNo',
		data: [],
		pagination: {
			current: 1,
			pageSize: 15,
			total: 0,
			showSizeChanger: true,
			pageSizeOptions: ['15', '25', '50'],
			showQuickJumper: true,
		},
		columns: [
			{
				type: FblColumnType.PLAIN,
				property: 'domainNo',
				title: '序號',
				// width: 300,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'domain',
				title: '郵件網域',
				// width: 300,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updateName',
				title: '更新人員',
				// minWidth: 300,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updateDate',
				title: '更新時間',
				// width: 300,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'editControl',
				title: '編輯',
				fixed: 'right',
				width: 65,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'deleteControl',
				title: '刪除',
				fixed: 'right',
				width: 65,
			},
		],
  }

  /* * * * * * * * * * * * *
   *       Ajax Start      *
   * * * * * * * * * * * * */
	// API: 分頁查詢有效清單
	queryValidDomainApi() {
		this.setLoading(true);
		this.$validDomainApi.queryValidDomainPageSpecUsingPOST({
			mailDomain: this.formInput.mailDomain,
			page: this.grid.pagination.current - 1,
			size: this.grid.pagination.pageSize,
		})
		.then((resp) => {
			if (!resp.data.apiStatus) {
				this.$message.error(resp.data.apiErrorMessage);
				return;
			}
			// Success
			if (!this.isEmpty(resp.data.data)) {
				const respData = resp.data.data;
				this.grid.pagination.total = parseInt(respData.totalElements);
				this.grid.data = respData.content; // 資料放進格子
			} else {
				// 清空
				this.grid.pagination.total = 0;
				this.grid.data = [];
			}
		})
		.finally(() => {
			this.setLoading(false);
		})
	}

	// API: 上傳有效清單Excel
	uploadValidDomainApi() {
		const formData = new FormData();
    formData.append('file', this.uploadDomainModal.uploadFiles[0]);

		this.setLoading(true);
		AjaxService.postUploadFile('/api/validDomain/uploadValidDomain', formData)
		.then((resp) => {
			if (!resp.data.apiStatus) {
				this.$message.error(resp.data.apiErrorMessage);
				return;
			}
			// Success
			const respData = resp.data.data;
			this.uploadDomainModal.isShow = false;
			Modal.success({
				content: `上傳成功！上傳筆數: ${respData.rawDataCount} 筆、更新筆數: ${respData.actualUploadCount} 筆`,
				okText: "確定",
				onOk: this.search,
			});
		})
		.finally(() => {
			this.setLoading(false);
		});
	}

	// API: 匯出有效清單Excel
	exportValidDomainApi() {
		this.setLoading(true);
		AjaxService.postExportFile('/api/validDomain/exportValidDomain', {
			mailDomain: this.formInput.mailDomain,
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

	// API: 新增有效郵件清單
	insertValidDomainApi() {
		this.setLoading(true);
		this.$validDomainApi.insertValidDomainUsingPOST({
			mailDomain: this.addValidDomainModal.data.domain,
		})
		.then((resp) => {
			if (!resp.data.apiStatus) {
				this.$message.error(resp.data.apiErrorMessage);
				return;
			}
			// Success
			this.$message.success('新增成功');
			this.closeAddModal();
			// reloadPage
			this.queryValidDomainApi();
		})
		.finally(() => {
			this.setLoading(false);
		})
	}

	// API: 刪除有效郵件清單
	deletedValidDomainApi(data) {
		this.setLoading(true);
		this.$validDomainApi.deletedValidDomainUsingPOST({
			uuid: data.uuid,
		})
		.then((resp) => {
			if (!resp.data.apiStatus) {
				this.$message.error(resp.data.apiErrorMessage);
				return;
			}
			// Success reloadPage
			this.queryValidDomainApi();
		})
		.finally(() => {
			this.setLoading(false);
		})
	}

	// API: 更新有效郵件清單
	updateValidDomainApi(data) {
		this.setLoading(true);
		this.$validDomainApi.updateValidDomainUsingPOST({
			uuid: data.uuid,
			mailDomain: data.domain,
		})
		.then((resp) => {
			if (!resp.data.apiStatus) {
				this.$message.error(resp.data.apiErrorMessage);
				return;
			}
			// Success
			this.closeEditModal();
			this.$message.success('更新成功');
			// reloadPage
			this.queryValidDomainApi();
		})
		.finally(() => {
			this.setLoading(false);
		})
	}
	/* * * * * * * * * * * * *
	 *        Ajax End       *
   * * * * * * * * * * * * */

	/* * * * * * * * * * * * *
	 *    UI EVENT Start     *
	 * * * * * * * * * * * * */
	// 點"查詢"
	search() {
			// 當前條件
			this.curSearchData = this.getCurSearch();
			// 存入查詢條件(避免頁面異動查詢條件但沒點擊查詢就換頁)
			this.formInput = this.copyData(this.form);
			// 初始頁數
			this.grid.pagination.current = 1;
			this.queryValidDomainApi()
	}

	// 點"清除
	clearSearch() {
		// 清掉查詢條件
		(this.$refs.formRef as any).resetFields();
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
		this.exportValidDomainApi();
	}

	// 點"整批匯入"
	uploadMultiDomain() {
		this.uploadDomainModal.isShow = true;
	}

	// 點"新增"
	addValidDomain() {
    this.addValidDomainModal.isShow = true;
	}

	// Table change
	onPageChange(e) {
		const pagination = e.pagination;
    const p = this.grid.pagination;
		// 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== pagination.current || p.pageSize !== pagination.pageSize) {
      p.current = pagination.current;
      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== pagination.pageSize) {
        p.current = 1;
      }
      p.pageSize = pagination.pageSize;
      this.queryValidDomainApi();
    }
	}

	// 點Table"編輯"icon
	editValidDomain(data) {
		this.editValidDomainModal.data = this.copyData(data);
		this.editValidDomainModal.isShow = true;
	}

	// 點Table"刪除"icon
	deleteValidDomain(data) {
		console.log(data);
		Modal.confirm({
 			content: `確定要刪除 ${data.domain}?`,
			 okText: '是',
			 cancelText: '否',
			onOk: () => {
				this.deletedValidDomainApi(data);
			},
		})
	}

	// [整批匯入Modal] 選擇檔案
	customRequest(data) {
		// 驗證
		const accepts = ['xlsx']; // 只能接受 .xlsx
		const nameList = data.file.name.split(".");
		if (this.isEmpty(nameList) || !accepts.includes(nameList.pop())) {
			this.$message.error('檔案類型有誤，請重新上傳');
			return;
		}
		// 最大5MB
		if (data.file.size > 5000000) {
			this.$message.error('檔案大小超過 5MB，請重新上傳');
			return;
		}
		// 只能上傳一個，先清空
		this.uploadDomainModal.uploadFiles = [];
		this.uploadDomainModal.uploadFiles.push(data.file);
	}

	// [整批匯入Modal] 刪除檔案
	removeFile() {
		this.uploadDomainModal.uploadFiles = [];
	}

	// [整批匯入Modal] 點"上傳"
	uploadFile() {
		Modal.confirm({
			content: "是否確定匯入，點選「是」將會執行覆蓋有效郵件清單資料。",
			okText: '是',
			cancelText: '否',
		 	onOk: () => {
				this.uploadValidDomainApi();
		 	},
	 	})
	}

	// [新增有效郵件清單Modal] 點"確定"
	submitAddModal() {
		// 檢核欄位
		(this.$refs.formRefAddModal as any).validate((valid) => {
			if (valid) {
				// 檢核通過
				this.insertValidDomainApi();
			}
		});
	}

	// [新增有效郵件清單Modal] 關閉
	closeAddModal() {
		(this.$refs.formRefAddModal as any).clearValidate();
		(this.$refs.formRefAddModal as any).resetFields();
		this.addValidDomainModal.isShow = false;
	}

	// [編輯有效郵件清單Modal] 點"確定"
	submitEditModal() {
		(this.$refs.formRefEditModal as any).validate((valid) => {
			if (valid) {
				// 檢核通過
				this.updateValidDomainApi(this.editValidDomainModal.data);
			}
		});
	}

	// [編輯有效郵件清單Modal] 關閉
	closeEditModal() {
		(this.$refs.formRefEditModal as any).clearValidate();
		(this.$refs.formRefEditModal as any).resetFields();
		this.editValidDomainModal.isShow = false;
	}
	/* * * * * * * * * * * * *
   *     UI EVENT End      *
   * * * * * * * * * * * * */

	/**
	 * Data Process
	 */
	// 取得查詢條件
	getCurSearch() {
		return Object.values(this.form).join();
	}

	// 判斷空
	isEmpty(data) {
		return this.$validateUtil.isEmpty(data);
	}

	// 複製物件
	copyData(data) {
		return JSON.parse(JSON.stringify(data));
	}

	/**
	 * Computed
	 */
	// 總筆數資料轉型處理
	get getDataNum() {
		return Number(this.grid.pagination.total);
	}

	/**
	 * Init
	 */
	mounted() {

	}
}
