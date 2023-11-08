import CommonUtil, { AuthComonent } from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { default as ValidationUtil, default as VlidationUtil } from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import PendingDetailForm from "@/components/shared/form/pendingDetail/PendingDetailForm.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { LoginModule } from "@/plugins/store/LoginModule";
import { ComponentDto, CountAllTypePendingCaseDto, Option, PendingCaseManagementSearchInitDto, PendingCaseManagementStatisticDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import { GridColumnsChildren } from "./model";

@Component({
  components: { FblDataGrid, HiddenFolde, DragModal, PendingDetailForm }
})
export default class PendingCaseManagementPage extends Vue {

  // 部門、科別和電訪員欄位合併的資料列
  mergeColumns: string[] = [
    this.$t('pendingCaseManagement_total').toString(), // 合計
    this.$t('pendingCaseManagement_notYetPicked').toString(), // 尚待取件
  ]

  // 畫面元件
  authComponent: AuthComonent = {
    PENDDING_MANAGE_EXPORT: {
      show: false,
      enable: false
    },
    // 待覆核 欄位 6/30 不上，需設置 component 關閉
    PENDDING_MANAGE_COL_REVIEW: {
      show: false,
      enable: false
    },
  };

  // 搜尋結果是否可見
  isTableVisible: boolean = true;

  // 要搜尋過才能匯出
  exportDisable: boolean = true;

  // 內部視窗傳送資料
  pendingDetailTitle: string = "";
  record: object = null;
  item: string = "";

  // 項目明細視窗顯示
  showPendingDetailForm: boolean = false;

  gridDataSlotCustomRenderArray: string[] = [];

  // Pending項目動態欄位顯示
  pendingColumns: GridColumnsChildren[] = [];

  //DatePicker民國年的格式
  formatter = this.$twDateFormatter;
  formatterDateTime = this.$twDateTimeFormatter;
  //vue2 時間選擇器標題格式
  timeTitleFormat: string = MomentUtil.transTimePickerTitle(MomentUtil.default(new Date()));

  //查詢條件
  pendingCaseManagementForm = {
    departmentIdList: [],
    divisionIdList: [],
    tmrIdList: [],
    pendingItem: [],
  };

  rules: { [key: string]: ValidationRule[] } = {
  };

  // 更新時間
  updateDateTime = "";

  // ===================================== Grid ========================================================
  renderContent = (value, row, index) => {
    const obj = {
      children: value,
      attrs: {},
    };
    if (this.mergeColumns.includes(value)) {
      Object.assign(obj.attrs, {
        colSpan: 0,
      })
    }
    return obj;
  };

  grid = {
    rowKey: 'rowkey',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      total: 0,
      hideOnSinglePage: true
    },
    columns: [
      {
        title: this.$t('pendingCaseManagement_departmentName').toString(), // 部門
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: CommonUtil.countColumnWidth(6),
        fixed: 'left',
        align: "center",
        customRender: (text, row, index) => {
          if (this.mergeColumns.includes(text)) {
            return {
              children: text,
              attrs: {
                colSpan: 3,
              },
            };
          }
          return text
        },
      },
      {
        title: this.$t('pendingCaseManagement_divisionName').toString(), // 科別
        dataIndex: 'divisionName',
        key: 'divisionName',
        width: CommonUtil.countColumnWidth(6),
        fixed: 'left',
        align: "center",
        customRender: this.renderContent,
      },
      {
        title: this.$t('pendingCaseManagement_tmrName').toString(), // 電訪員
        dataIndex: 'tmrName',
        key: 'tmrName',
        width: CommonUtil.countColumnWidth(3),
        fixed: 'left',
        align: "center",
        customRender: this.renderContent,
      },
      {
        title: this.$t('pendingCaseManagement_pendingItem').toString(), // Pending項目
        children: [],
      },
    ]
  };

  // ===================================== 下拉式選單 ========================================================
  // 部門
  selectDepOptions: Option[] = [];
  // 科別
  selectDiviOptions: Option[] = [];
  // 電訪員
  selectTmrOptions: Option[] = [];
  // 電訪員清單
  allUserList: Option[] = [];
  // 科別清單
  allDivList: Option[] = [];

  //部門科別預設值
  departmentDefaultId: string;
  divdefaultId: string;

  // 部門、科別、電訪員連動下拉選單相關資訊
  depUnitInfo: object = {};
  depUserInfo: object = {};
  unitUserInfo: object = {};

  // Pending項目
  pendingItemOptions: Option[] = [];

  /**
   * 初始化頁面
   */
  created() {
    LoadingUtil.show();
    // 取得畫面元件權限 範例
    this.$authApi.getAuthComponentUsingGET(this.$route.path)
      .then((res: AxiosResponse<ComponentDto>) => {
        if (res.data.component) {
          this.authComponent.PENDDING_MANAGE_EXPORT = ValidationUtil.isEmpty(res.data.component.PENDDING_MANAGE_EXPORT) ? this.authComponent.PENDDING_MANAGE_EXPORT : res.data.component.PENDDING_MANAGE_EXPORT;
          //待覆核 欄位 6/30 不上，需設置 component 關閉
          this.authComponent.PENDDING_MANAGE_COL_REVIEW = ValidationUtil.isEmpty(res.data.component.PENDDING_MANAGE_COL_REVIEW) ? this.authComponent.PENDDING_MANAGE_COL_REVIEW : res.data.component.PENDDING_MANAGE_COL_REVIEW;
        }
      }).catch((err) => {
        console.log(err);
      });

    // 載入部門、科別、電訪員下拉選單資料
    this.$pendingApi.pendingCaseManagementSearchInitUsingGET()
      .then((resp: AxiosResponse<PendingCaseManagementSearchInitDto>) => {
        if (!VlidationUtil.isEmpty(resp.data.userUnitSuperUnitInfo)) {
          if (resp.data.unitDepInfo != null) {
            // 部門對應科別/人員資料
            this.depUnitInfo = resp.data.unitDepInfo.depUnitInfo;
            this.depUserInfo = resp.data.unitDepInfo.depUserInfo;
            // 科別對應人員資料
            this.unitUserInfo = resp.data.unitDepInfo.unitUserInfo;
            // 部門 下拉
            this.selectDepOptions = Object.assign(resp.data.unitDepInfo.departOptions);
            this.pendingCaseManagementForm.departmentIdList.push(resp.data.unitDepInfo.defaultDepId);
            this.departmentDefaultId = resp.data.unitDepInfo.defaultDepId;
            // 科別 下拉
            this.allDivList = resp.data.unitDepInfo.unitList;
            this.pendingCaseManagementForm.divisionIdList.push(resp.data.unitDepInfo.defaultUnitId);
            this.divdefaultId = resp.data.unitDepInfo.defaultUnitId;
            // 電訪員 下拉
            this.allUserList = resp.data.unitDepInfo.userList;
            // this.pendingCaseManagementForm.tmrIdList.push(LoginModule.loginState.me.id);
            // 有預設部門需一起異動科別/人員
            if (!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultDepId)) {
              this.onSelectDept();
            }
            // 有預設科別需一起異動人員
            if (!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultUnitId)) {
              this.onSeletDivi();
            }
          } else {
            ErrorModalUtil.modalError(this.$t('pendingCaseManagement_getAllUserAndUnit_occur_error2').toString()); // 取得使用者及部門科別清單發生異常
          }
        }
        // 載入Pending項目下拉選單資料
        this.pendingItemOptions = resp.data.pendingItemOption;

        // 使用者說預設先不搜尋
        // this.pendingCaseManagementPageSearch();
      })
      .catch((err) => {
        console.error(err);
        ErrorModalUtil.modalError(this.$t('pendingCaseManagement_dropDownMenuImportFail').toString()); // 下拉選單載入失敗
      })
      .finally(() => LoadingUtil.close());
  }

  /**
   * 選擇部門時，科別範圍限縮
   */
  onSelectDept() {
    // 匯出控制
    this.exportDisable = true;

    this.selectDiviOptions = [];
    this.selectTmrOptions = [];
    if (this.pendingCaseManagementForm.departmentIdList.length > 0) {
      this.pendingCaseManagementForm.departmentIdList.forEach((depId) => {
        // 取得部門對應的科別
        if (!ValidationUtil.isEmpty(this.depUnitInfo[depId])) {
          this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
        }
        // 取得部門對應人員
        if (!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
        }
      });
    } else {
      // 科別 下拉
      this.selectDiviOptions = Object.assign(this.allDivList);
      // 電訪員 下拉
      this.selectTmrOptions = Object.assign(this.allUserList);
    }
    //重置科別選項
    let unitIdTempList = Object.assign(this.pendingCaseManagementForm.divisionIdList);
    unitIdTempList.forEach((eachSelected) => {
      // 如果當前選擇的科別不在科別下拉選單裡，則要移除
      if (!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)) {
        if (this.pendingCaseManagementForm.divisionIdList.length > 0) {
          this.pendingCaseManagementForm.divisionIdList = this.pendingCaseManagementForm.divisionIdList.filter(unitId => unitId != eachSelected);
        }
      }
    });

    //重置電訪員選項
    let userIdTempList = Object.assign(this.pendingCaseManagementForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
        if (this.pendingCaseManagementForm.tmrIdList.length > 0) {
          this.pendingCaseManagementForm.tmrIdList = this.pendingCaseManagementForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });

    //連動科別異動
    this.onSeletDivi();
  }

  /**
   * 選擇科別時，電訪員範圍限縮
   */
  onSeletDivi() {
    // 匯出控制
    this.exportDisable = true;

    this.selectTmrOptions = [];
    // 有選擇科別
    if (this.pendingCaseManagementForm.divisionIdList.length > 0) {
      // 取得科別對應人員
      this.pendingCaseManagementForm.divisionIdList.forEach((unitId) => {
        if (!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });
    } else {
      // 有選擇部門
      if (this.pendingCaseManagementForm.departmentIdList.length > 0) {
        this.pendingCaseManagementForm.departmentIdList.forEach((depId) => {

          // 取得部門對應人員
          if (!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
            this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
          }
        });
      } else {
        // 電訪員 下拉
        this.selectTmrOptions = Object.assign(this.allUserList);
      }
    }
    //重置電訪員選項
    let userIdTempList = Object.assign(this.pendingCaseManagementForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {
      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
        if (this.pendingCaseManagementForm.tmrIdList.length > 0) {
          this.pendingCaseManagementForm.tmrIdList = this.pendingCaseManagementForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
  }

  // ===================================== 按鈕 事件 ========================================================
  // 查詢
  pendingCaseManagementPageSearch() {
    this.grid.pagination.current = 1;

    let tmrIdList = [];
    if (this.pendingCaseManagementForm.tmrIdList.length > 0) {
      tmrIdList = this.pendingCaseManagementForm.tmrIdList;
    } else if (this.pendingCaseManagementForm.departmentIdList.length > 0) {
      // 電訪員為必填，沒有填就填全部科員全部
      this.onSelectDept();
      this.onSeletDivi();
      tmrIdList = this.selectTmrOptions.map(s => s.value);
    } else {
      ErrorModalUtil.modalError(this.$t('pendingCaseManagement_departmentNameRequied').toString()); // 部門 必填
      return;
    }

    this.exportDisable = false;
    LoadingUtil.show();
    this.grid.data = [];

    // Pending項目為必填，沒有填就填全部
    this.pendingColumns = this.pendingItemOptions
      .filter(p => VlidationUtil.isEmpty(this.pendingCaseManagementForm.pendingItem) ||
        this.pendingCaseManagementForm.pendingItem.includes(p.value))
      .map(p => {
        this.gridDataSlotCustomRenderArray.push(p.value);
        return {
          title: p.label,
          dataIndex: p.value,
          key: p.value,
          align: "center",
          scopedSlots: { customRender: p.value },
        } as GridColumnsChildren;
      });
    this.grid.columns.find(c => c.title == this.$t('pendingCaseManagement_pendingItem').toString()).children = this.pendingColumns; // Pending項目

    this.$pendingApi.countAllTypePendingCaseUsingPOST({
      pendingItemList: this.pendingColumns.map(p => p.key),
      tmrIdList: tmrIdList
    } as CountAllTypePendingCaseDto)
      .then((resp: AxiosResponse<PendingCaseManagementStatisticDto>) => {
        let statisticData = new Map(Object
          .keys(resp.data.statisticByTmrId).map(
            k1 => [k1, new Map(Object.keys(resp.data.statisticByTmrId[k1]).map(k2 => [k2, resp.data.statisticByTmrId[k1][k2]]))]
          ));

        let rowkey = 0;

        // 加入『尚待取件』列表
        let notYetPicked = {
          rowkey: rowkey++,
          departmentName: this.$t('pendingCaseManagement_notYetPicked').toString(), // 尚待取件
          divisionName: this.$t('pendingCaseManagement_notYetPicked').toString(), // 尚待取件
          tmrName: this.$t('pendingCaseManagement_notYetPicked').toString(), // 尚待取件
          tmrId: "",
        };
        let pendingItemOfTheUser = statisticData.get("");
        if (pendingItemOfTheUser != null) {
          pendingItemOfTheUser.forEach((v, k) => {
            notYetPicked[k] = v;
          });
        }
        this.grid.data.push(notYetPicked);

        tmrIdList.forEach(t => {
          let tmr = resp.data.tmrInfoList.find(p => p.tmrId == t);
          if (!VlidationUtil.isEmpty(tmr)) {
            let tmrData = {
              rowkey: rowkey++,
              departmentName: tmr.departmentName,
              divisionName: tmr.divisionName,
              tmrId: tmr.tmrId,
              tmrName: tmr.tmrName,
            };
            let pendingItemOfTheUser = statisticData.get(t);
            if (pendingItemOfTheUser != null) {
              pendingItemOfTheUser.forEach((v, k) => {
                tmrData[k] = v;
              });
            }
            this.grid.data.push(tmrData);
          }
        });

        // 加入『合計』列表
        let sumMap = {};
        this.grid.data.forEach(g => {
          this.pendingColumns.forEach(p => {
            let oldNum = sumMap[p.key] ? sumMap[p.key] : 0;
            let newNum = parseInt(g[p.key]) ? parseInt(g[p.key]) : 0;
            sumMap[p.key] = oldNum + newNum;
          });
        });
        let sumData = {
          rowkey: rowkey,
          departmentName: this.$t('pendingCaseManagement_total').toString(), // 合計
          divisionName: this.$t('pendingCaseManagement_total').toString(), // 合計
          tmrName: this.$t('pendingCaseManagement_total').toString(), // 合計
        };
        this.pendingColumns.forEach(p => {
          sumData[p.key] = sumMap[p.key].toString();
        });
        this.grid.data.push(sumData);

        // 更新時間
        this.updateDateTime = MomentUtil.transformRocYearMonthDayHHMMSS(MomentUtil.transferDate(new Date()));

        this.isTableVisible = true;
      })
      .catch(e => console.error(e))
      .finally(() => LoadingUtil.close());
  }

  // 清除
  resetCasePageSearchForm() {
    this.exportDisable = true;
    this.grid.data = [];
    this.pendingCaseManagementForm.departmentIdList = [this.departmentDefaultId];
    this.onSelectDept();
    this.pendingCaseManagementForm.divisionIdList = [this.divdefaultId];
    this.onSeletDivi();
    this.pendingCaseManagementForm.tmrIdList = [];
    this.pendingCaseManagementForm.pendingItem = [];
    this.isTableVisible = false;
  }

  /**
   * 搜尋結果匯出
   */
  exportResult() {
    const fileName = this.$t('pendingCaseManagement_exportFileName').toString() + this.updateDateTime.replace(/\W/g, "") + ".xlsx"; // Pending案件管理_
    console.log(fileName);
    if (!this.exportDisable) {
      if (this.grid.data.length < 1) {
        ErrorModalUtil.modalError(this.$t('pendingCaseManagement_exportNodate').toString()); // 無符合資料，無法匯出
      } else {
        LoadingUtil.show();
        const pendingItemList = this.pendingItemOptions.filter(p => VlidationUtil.isEmpty(this.pendingCaseManagementForm.pendingItem) ||
          this.pendingCaseManagementForm.pendingItem.includes(p.value)).map(p => p.value);
        const tmrIdList = this.selectTmrOptions.filter(p => VlidationUtil.isEmpty(this.pendingCaseManagementForm.tmrIdList) ||
          this.pendingCaseManagementForm.tmrIdList.includes(p.value)).map(p => p.value);
        this.$pendingApi.exportUsingPOST({
          pendingItemList: pendingItemList,
          tmrIdList: tmrIdList
        } as CountAllTypePendingCaseDto, { responseType: 'blob' })
          .then((res) => {
            this.dealDownLoadData(res.data, fileName); // Pending案件管理_更新時間.xlsx
            MessageUtil.messageInfo(this.$t('pendingCaseManagement_exportSuccess').toString()); // 匯出成功
          })
          .catch((e) => {
            console.error(e);
            ErrorModalUtil.modalError(this.$t('pendingCaseManagement_exportFail').toString()) // 匯出失敗
          }).finally(() => {
            LoadingUtil.close();
          })
      }
    } else {
      ErrorModalUtil.modalError(this.$t('pendingCaseManagement_SearchBeforeExport').toString()); // 請先執行查詢再匯出
    }
  }

  /**
   * 處理後端回傳的下載內容
   * @param resData 
   * @param fileName 
   */
  dealDownLoadData(resData, fileName) {
    try {
      let blob;
      if (resData instanceof Blob) {
        blob = resData;
      } else {
        blob = new Blob([resData], { type: resData.type });
      }
      if (!!window.ActiveXObject || "ActiveXObject" in window) {  //IE瀏覽器
        (window.navigator as any).msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕
        // navigator.msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕
      } else {
        var linkElement = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        linkElement.setAttribute('href', url);
        linkElement.setAttribute("download", fileName);
        var clickEvent = new MouseEvent("click",
          {
            "view": window,
            "bubbles": true,
            "cancelable": false
          });
        linkElement.dispatchEvent(clickEvent);
      }
    } catch (e) {
      console.error(e);
      MessageUtil.messageError(this.$t('pendingCaseManagement_exportFail').toString()); // 匯出失敗
    }
  }

  // ===================================== Grid 事件 ========================================================
  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
    );
  }

  /**
   * 於『待電訪』(/PendingPage)開啟案件列表
   */
  openPendingPage(record: object, index: number, event: object, text: string, item: string) {
    if (record["tmrName"] != this.$t('pendingCaseManagement_total').toString()) { // 合計
      this.showPendingDetailForm = true;
      this.record = record;
      this.item = item;
      this.pendingDetailTitle = this.pendingItemOptions.find(p => p.value == item).label;
      console.log("record", record);
      console.log("item", item);
    }
  }

  /**
   * 分頁功能設定
   * @param pagination 
   * @param filters 
   * @param sorter 
   * @param param3 
   */
  onPageChange(pagination, filters, sorter, { currentDataSource }) {
    this.grid.pagination = pagination;
  }
}