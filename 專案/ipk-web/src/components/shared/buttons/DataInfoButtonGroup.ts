import validateUtil from '@/plugins/util/validateUtil';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';

@Component({})
export default class DataInfoButtonGroup extends Vue {
	@Getter getMenuItem!: Array<any>;

	/**
   * props
   */
  // 匯出檔案的規格&配置
  @Prop()
  exportData: Array<any>;

	// 匯出欄位
	@Prop()
	exportColumns: Array<any>;

	// 檔案名稱
	@Prop()
	fileName: string;

	// 檔案類別
	@Prop()
	fileType: string;

	// 資料表名稱
	@Prop()
	sheetName: string;

	// 是否顯示新增按鈕
	@Prop({ default: false })
	showAddBtn: boolean;

	// 是否顯示上傳按鈕
	@Prop({ default: false })
	showUploadBtn: boolean;

	// 是否顯示匯出按鈕
	@Prop({ default: true })
	showExportBtn: boolean;

	// 是否顯示開啟匯出彈窗按鈕
	@Prop({ default: false })
	showExportModalBtn: boolean;

	// 上傳按鈕名稱
	@Prop({ default: '上傳' })
	uploadButtonName: string;

	// 子頁籤對應key值
	@Prop()
	childrenTab: any;

	// 按鈕對應key值 (目前批次頁面的查詢按鈕actionCode不為search，因此另外傳buttonKey進來)
	@Prop()
	buttonKey: any;

	/**
   * methods
   */
	// 開啟新增彈窗
	openAddAndEditModal(actionType, editDto) {
		// 驗證權限
		if (!this.$authService.getButtonsAuthInfo(this.$route.name, this.childrenTab, this.$buttonKey.buttonKey.ADD.val)) {
			InfoModal.alertInfo({
        confirm: false,
        content: '無此按鈕權限。',
      });
			return;
		}
		// 與父元件溝通
		this.$emit('openAddAndEditModal', { actionType, editDto });
	}

	// 開啟上傳彈窗
	openUploadModal() {
		// 驗證權限
		if (!this.$authService.getButtonsAuthInfo(this.$route.name, this.childrenTab, this.$buttonKey.buttonKey.UPLOAD.val)) {
			InfoModal.alertError({
        confirm: false,
        content: '無此按鈕權限。',
      });
			return;
		}
		// 與父元件溝通
		this.$emit('openUploadModal');
	}

	// 開啟匯出彈窗按鈕
	openCustomizationModal() {
		// 如果未傳buttonKey,則固定帶SEARCH
		// const buttonKey = this.buttonKey ? this.buttonKey : this.$buttonKey.buttonKey.SEARCH.val;
		// 驗證權限
		// if (!this.$authService.getButtonsAuthInfo(this.$route.name, this.childrenTab, buttonKey)) {
		// 	InfoModal.alertError({
    //     confirm: false,
    //     content: '無此按鈕權限。',
    //   });
		// 	return;
		// }
		// 與父元件溝通
		this.$emit('openCustomizationModal');
	}

	// 檢查exportData是否有值
	checkExportData() {
		// 如果未傳buttonKey,則固定帶SEARCH
		const buttonKey = this.buttonKey ? this.buttonKey : this.$buttonKey.buttonKey.SEARCH.val;
		// 驗證權限
		if (!this.$authService.getButtonsAuthInfo(this.$route.name, this.childrenTab, buttonKey)) {
			InfoModal.alertError({
        confirm: false,
        content: '無此按鈕權限。',
      });
			return;
		}
		// 判斷是否查詢有資料
		if (validateUtil.isEmpty(this.exportData)) {
			InfoModal.alertError({
        confirm: false,
        content: '無資料匯出。',
      });
			return;
		}
		// 執行匯出
		(this.$refs.exportBtn as any).exportExcel();
	}
}
