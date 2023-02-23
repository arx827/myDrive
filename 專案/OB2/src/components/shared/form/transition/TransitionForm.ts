import { Vue, Component, Prop } from "vue-property-decorator";
import {
  FblColumnType,
  FblPageEvent,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { AxiosResponse } from "axios";
import { GetTransitionInfoResDto } from "@fubonlife/obd-api-axios-sdk";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import VlidationUtil from "@/assets/config/ValidationUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";


@Component({ components: { FblDataGrid } })
export default class FileUploadForm extends Vue {
  h = this.$createElement;
  
  // 名單序號資訊(主名單)
  get getMainPackNo() {

    if(VlidationUtil.isEmpty(PackMatchModule.pickupResult) != null && VlidationUtil.isEmpty(PackMatchModule.pickupResult.mainCasePack) != null) {
      return PackMatchModule.pickupResult.mainCasePack.packNo;
    }
  }

  // 名單序號資訊(當前名單)
  get getFirstPackNo() {

    if(VlidationUtil.isEmpty(PackMatchModule.pickupResult) != null && VlidationUtil.isEmpty(PackMatchModule.pickupResult.firstCasePack) != null) {
      return PackMatchModule.pickupResult.firstCasePack.packNo;
    }
  }

  // 歸戶提示訊息紀錄
  get tansitionResultInfo(){
    return PackMatchModule.transitionResult;
  }
  
  // 欲合併的資料欄位
  rowSpanData = [];

  // checkbox 欄位
  checkedObject = {};

  // 欄位資料
  gridData = {
    rowKey: 'caseNo',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'isSelected',
        align: 'center',
        title: this.$t('transition_followUp').toString(),     // 續訪
        width: 80,
        customRender: (data, record, index, column) => {
          return {
            children: this.h('a-checkbox', {
              on: { change : this.handleCheckChange }
            }),
            attrs: {
              rowSpan: this.rowSpanData[index]
            }
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'packNo',
        width: 150,
        title: this.$t('transition_packNo').toString(),       // 名單序號
        // 上下合併
        customRender: (data, record, index, column) => {
          return {
            children: data.packNo,
            attrs: {
              rowSpan: this.rowSpanData[index],
            },
          };
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'caseStatusName',
        title: this.$t('transition_caseNo').toString(),       // 案件狀態
      },
      {
        type: FblColumnType.PLAIN,
        property: 'custName',
        width: 200,
        title: this.$t('transition_custName').toString(),     // 受訪者姓名
      },
      {
        type: FblColumnType.PLAIN,
        property: 'custTypeName',
        width: 130,
        title: this.$t('transition_custType').toString(),     // 受訪者身分
      },
      {
        type: FblColumnType.PLAIN,
        property: 'casePolicy',
        title: this.$t('transition_casePolicy').toString(),   // 保單號碼
        width: 150,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'taskName',
        title: this.$t('transition_taskItem').toString(),     // 電訪項目
      },
      {
        type: FblColumnType.PLAIN,
        property: 'dueContDateRoc',
        title: this.$t('transition_dueContDate').toString(),  // 應電訪日
      },
      {
        type: FblColumnType.PLAIN,
        property: 'agentAssignTime',
        title: this.$t('transition_agentAssignTime').toString(),  // 指定聯絡時段
      },
      {
        type: FblColumnType.PLAIN,
        property: 'visitDate',
        title: this.$t('transition_visitDate').toString(),  // 方便聯絡時段
      },
    ],
  };

  // ============================================================================== Function ========================================================================

  /**
   * @description 取得歸戶換場清單
   * @author B1529
   * @version 2022/03/15
   */
  getGridData() {

    LoadingUtil.show();

    this.$transitionApi.getTransitionInfoUsingPOST({
      'mainPackNo' : this.getMainPackNo,
      'firstPackNo' : this.getFirstPackNo,
    })
    .then((res : AxiosResponse<GetTransitionInfoResDto>) => {

      // 塞入歸戶換場清單
      if( !VlidationUtil.isEmpty(res.data) && !VlidationUtil.isEmpty(res.data.transitionInfos)){
        this.gridData.data = res.data.transitionInfos;
      }

      // 初始化 checkedObject
      if(!VlidationUtil.isEmpty(this.gridData.data)){
        this.checkedObject = {};
  
        // 處理合併欄位
        this.rowSpanData = this.getRowSpan('packNo');
  
        // 處理合併CheckBox
        this.renderCheckBox();
      }
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      LoadingUtil.close();
    });
  }

  // 表格合併
  getRowSpan(property) {
    let rowSpanList = [];
    const dataTitle = this.gridData.data.map((dto) => dto[property]);
    // 計算相同元素並以物件key顯示
    const countedColumns = dataTitle.reduce(function (all, col) {
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
            for (var i = 0; i < item - 1; i++) {
                rowSpanList.push(0);
            }
        }
    });
    return rowSpanList;
  }

  // 重整載入CheckBox
  renderCheckBox() {
      // checkBox 合併
      this.gridData.columns.find((i) => i.property == "isSelected")["customRender"] = (data, record, index) => {


          // 取得紀錄用勾選清單
          let transitionResult = this.tansitionResultInfo;
          if(!VlidationUtil.isEmpty(transitionResult) && !VlidationUtil.isEmpty(transitionResult[data.packNo]) && data.isSelected.show){
              data.isSelected.checked = transitionResult[data.packNo].checked;
          }

          // CheckBox 用樣式
          let checkBoxLayout = {
              style: {display: data.isSelected.show ? "block" : "none"},
              attrs:{
                checked : data.isSelected.checked
              },
              on: {change: this.handleCheckChange},
          };

          // 唯讀
          if (data.isSelected.disable) {
              Object.assign(checkBoxLayout["attrs"], {disabled : data.isSelected.disable});
          }

          // 預設選取的資訊
          Object.assign(this.checkedObject, {[data.packNo] : {
              checked : (data.isSelected.show && data.isSelected.checked),
              custName : data.custName
            } 
          });

          return {
              children: this.h("a-checkbox", checkBoxLayout),
              attrs: {
                  rowSpan: this.rowSpanData[index],
              },
          };
      };

      // 名單序號 合併
      this.gridData.columns.find((i) => i.property == "packNo")["customRender"] = (data, record, index) => {
          return {
              children: data.packNo,
              attrs: {
                  rowSpan: this.rowSpanData[index],
              },
          };
      };
  }

  
  // ================================================================== Event =====================================================================
  
  // 勾選狀態改變
  handleCheckChange(e) {
    let isChecked = e.target.checked;
    // 使用 原生事件 找出 該行的 rowKey
    let thatRowKey = e.nativeEvent.path.find((i) => Array.from(i.classList).includes('ant-table-row')).dataset.rowKey;
    // 使用 thisGridData 找到 名單序號
    let thatGridDataNo = this.gridData.data.find((i) => i.caseNo == thatRowKey).packNo;
    this.checkedObject[thatGridDataNo].checked = isChecked;
    // 紀錄勾選名單
    PackMatchModule.putTrasitionPackNos(this.checkedObject);
    // Object.assign(this.checkedObject, { [thatGridDataNo]: isChecked });
    this.gridData.data.find((i) => i.caseNo == thatRowKey).isSelected.checked = isChecked;
  }

  // 按鈕 『送出』
  onSubmit() {

    let followContactOption = [];
    if(!VlidationUtil.isEmpty(this.checkedObject)) {

      Object.keys(this.checkedObject).forEach((packNo) => {
        
        // 有勾選時
        if(this.checkedObject[packNo].checked){
          followContactOption.push({
            label : packNo + "_" + this.checkedObject[packNo].custName,
            value : packNo
          });
        }
        
      });
    }

    // 放入續訪下拉選單資料
    PackMatchModule.putfollowContactOption(followContactOption);
    // 紀錄勾選名單
    PackMatchModule.putTrasitionPackNos(this.checkedObject);

    this.$emit('onLeave');
  }

  // ===================================================================== Hooks =================================================================================

  created() {
    
    // 由於合併欄位 須在取得資料後 才處理合併，使用 async
    this.getGridData();
  }
}