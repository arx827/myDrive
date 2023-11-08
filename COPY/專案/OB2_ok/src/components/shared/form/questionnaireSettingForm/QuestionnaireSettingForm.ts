import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Option, QuestMainDto, QuestDetailDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { LoginModule } from "@/plugins/store/LoginModule";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import message from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import difference from "lodash/difference";
import LoadingUtil from "@/assets/config/LoadingUtil";

@Component({ components: { FblLevelSelect } })
export default class QuestionnaireSettingForm extends Vue {

  @Prop()
  public initData: QuestMainDto;

  @Prop()
  public loading: boolean;

  /** 電訪代碼 - 名稱下拉選單 */
  selectTaskIdNameOptions:Option[] = [];

  /** 段落類型頁籤(預設選取題庫) */
  itemTypeCode = "rightLetter";

  /** 可配置列表 - 題庫 */
  originalRightList = [];

  /** 可配置列表 - 結束語 */
  originalEndList = [];

  /** 段落類型代碼對應Map */
  itemTypeCodeMap = new Map();

  /** 排序順序對應Map */
  itemSequenceMap = new Map();

  //Transfer物件參數
  disabled: boolean = false;
  locale: object = {};

  originalTargetKeys = [];
  rightTargetKeys = [];

  leftColumns = [
    {
      dataIndex: "itemContent",
      title: "題目內容"
    }
  ];
  rightColumns = [
    {
      dataIndex: "itemContent",
      title: "題目內容"
    }
  ];

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  created(): void {
    this.reset();

    //取得電訪代碼 + 電訪名稱下拉選單
    this.$taskSettingApi.getTaskIdNameSelectedUsingGET("ALL")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectTaskIdNameOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });
  }
  
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  reset() {
    //預設題庫頁籤
    this.itemTypeCode = "rightLetter";

    //清除可配置、已配置列表
    this.originalEndList = [];
    this.originalRightList = [];
    this.originalTargetKeys = [];
    this.rightTargetKeys = [];
    this.itemTypeCodeMap.clear();
    this.itemSequenceMap.clear();

    //取得可配置、已配置列表
    this.getSettingItem(()=>{ 
      //預設顯示題庫頁籤
      this.originalTargetKeys = this.originalRightList;
    });

    //塞入欄位資料
    this.initData.createDate = MomentUtil.transformRoc(this.initData.createDate);
    this.initData.updateDate = MomentUtil.transformRoc(this.initData.updateDate);
  }

  /** 頁籤異動 */
  onTabChange(){
    if(this.itemTypeCode == "rightLetter"){
      this.originalTargetKeys = this.originalRightList;
    }else if(this.itemTypeCode == "end"){
      this.originalTargetKeys = this.originalEndList;
    }
  }

  /** 配置窗異動 */
  onTransferChange(nextTargetKeys, direction, moveKeys) {
    if(direction == "right"){
      //加入 - 依話術類型配置排序加入
      for( let key of moveKeys ){
        let index = Number.parseInt( this.itemSequenceMap.get(key) ) - 1;
        let addIndex = this.rightTargetKeys.length;
        for(let i = 0; i < this.rightTargetKeys.length; i++){
          let rIndex = Number.parseInt( this.itemSequenceMap.get( this.rightTargetKeys[i] ) ) - 1;
          if( index < rIndex ){ addIndex = i; break; }
        }
        this.rightTargetKeys.splice(addIndex, 0, key);
      }
    }else if(direction == "left"){
      //移除
      this.rightTargetKeys = nextTargetKeys;
    }
  }

  /** Transfer套件用來左右轉換Table內項目的方法 */
  getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
    return {
      getCheckboxProps: (item) => ({
        props: { disabled: disabled || item.disabled },
      }),
      onSelectAll(selected, selectedRows) {
        const treeSelectedKeys = selectedRows
          .filter((item) => !item.disabled)
          .map(({ key }) => key);
        const diffKeys = selected
          ? difference(treeSelectedKeys, selectedKeys)
          : difference(selectedKeys, treeSelectedKeys);
        itemSelectAll(diffKeys, selected);
      },
      onSelect({ key }, selected) {
        itemSelect(key, selected);
      },
      selectedRowKeys: selectedKeys,
    };
  }

  /** 取得可配置、已配置列表 */
  getSettingItem(callBack?){
    LoadingUtil.show();
    this.$questSettingApi.selectCoreSystemSettingUsingGET(this.initData.coreSystemCode, "")
    .then((resp) => {
      //可配置列表
      resp.data.forEach(data => { this.setSettingItem(data, 0); });

      //已配置列表
      this.initData.questDetailDtoList.forEach(data => {
        //已在可配置列表項目不重複加入
        if(!this.itemTypeCodeMap.has(data.itemCode)){ this.setSettingItem(data, 1); }
        this.rightTargetKeys.push(data.itemCode);
      });

      callBack();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      LoadingUtil.close();
    });
  }

  /** 設定可配置、已配置列表 type => 0:有效項目, 1:失效項目 */
  setSettingItem(data, type){
    let obj = {key:data.itemCode, itemContent:data.itemCode + " - " + data.itemContent};
    if(data.itemTypeCode == "rightLetter"){
      (type == 0)
      ? this.originalRightList.push(obj)
      : this.originalRightList.splice(Number.parseInt(data.itemSequence) - 1, 0, obj);
    }else if(data.itemTypeCode == "end"){
      (type == 0)
      ? this.originalEndList.push(obj)
      : this.originalEndList.splice(Number.parseInt(data.itemSequence) - 1, 0, obj);
    }
    this.itemTypeCodeMap.set(data.itemCode, data.itemTypeCode);
    this.itemSequenceMap.set(data.itemCode, data.itemSequence);
  }

  /** 表單送出 */
  public doSubmit(){
    let dataList = new Array<QuestDetailDto>();
    this.rightTargetKeys.forEach( itemCode => {
      let data = {
        questCode: this.initData.questCode,
        itemCode: itemCode,
        itemTypeCode: this.itemTypeCodeMap.get( itemCode ),
        createId: this.avatarText,
        updateId: this.avatarText
      };
      dataList.push( data as QuestDetailDto );
    });

    this.$questSettingApi.doSaveQuestDetailUsingPOST(this.initData.questCode, this.avatarText, dataList)
    .then((resp) => {
      message.messageSuccess("儲存成功", true);
      this.$emit("formCallBack", false);//關閉視窗 並 更新列表
    })    
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  /** 預覽PDF (type => quest:問卷預覽, rightLetter:權益信函預覽) */
  public doReviewPdf(type) {
    let taskName = this.initData.taskName;
    let coreSystemCode = this.initData.coreSystemCode;
    let rightItemCodeList = new Array<string>();
    let endItemCodeList = new Array<string>();
    let itemCodeList = {"end":endItemCodeList, "rightLetter":rightItemCodeList};

    //分別塞入已配置列表(題庫、結束語)
    this.rightTargetKeys.forEach( itemCode => {
      if(this.itemTypeCodeMap.get(itemCode) == "rightLetter"){
        rightItemCodeList.push(itemCode);
      }else{
        endItemCodeList.push(itemCode);
      }
    });

    this.$questSettingApi.reviewQuestPDFUsingPOST(coreSystemCode, taskName, type, itemCodeList, { responseType: 'blob' })
    .then((resp) => {
      this.dealDownLoadData(resp.data, "review.pdf");
    })    
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  /** 處理後端回傳的檔案內容 */
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
        linkElement.setAttribute('target', '_blank');
        var clickEvent = new MouseEvent("click",
          {
            "view": window,
            "bubbles": true,
            "cancelable": false
          });
        linkElement.dispatchEvent(clickEvent);
      }
    } catch (ex) {
      console.error(ex);
    }
  }
}
