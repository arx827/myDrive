import difference from "lodash/difference";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Option, QuestionBankLetterRightDto, QuestionBankLetterRightSubDto } from "@fubonlife/obd-api-axios-sdk";
import LoadingUtil from "@/assets/config/LoadingUtil";
import Sortable from 'sortablejs';

@Component
export default class questionBankLetterRightsSubForm extends Vue {
  //目前狀態(編輯 或 純顯示)
  @Prop()
  isSubEditing:boolean;

  //題目類型下拉選單
  @Prop()
  selectItemTitleOptions:Option[];

  //選取的答案選項(用於查詢條件)
  @Prop()
  answerOption:string;

  //已選取子題項目(Map列表)
  @Prop()
  selectedMap:Map<string, string>;

  //純顯示子題項目列表
  @Prop()
  showSubItem:Array<QuestionBankLetterRightSubDto>

  /** 查詢條件Form */
  subForm: QuestionBankLetterRightDto = {
    itemTitleCode: '',
    answerTypeCode: '',
    answerOption: ''
  }

  /** 所有子題項目(題目編號, 題目內容) */
  itemAllMap:Map<string, string> = new Map<string, string>();

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

  //純顯示的欄位參數
  showColumns = {
    rowKey: "subItemSequence",
    pagination: {
      pageSize: 15,
      hideOnSinglePage: true
    },
    columns: [
      {
        key: "subItemSequence",
        title: "顯示順序",
        dataIndex: "subItemSequence",
        align: "center",
        width: 100
      },
      {
        key: "subItem",
        title: "問題內容",
        dataIndex: "subItem",
        width: 375
      },
      {
        key: "rightsContent",
        title: "權益信函內容",
        dataIndex: "rightsContent"
      }
    ]
  };
  
  created() {
    if(this.isSubEditing){
      //將已選取項目加入已配置列表
      for(let [key, value] of this.selectedMap){
        this.rightTargetKeys.push(key);
      }

      //預設搜尋(全部)
      this.doQuery();
    }
  }

  mounted() {
    if(this.isSubEditing)
      this.initSortable();
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

  /** 查詢可配置列表 */
  doQuery() {
    //清空可配置列表
    this.originalTargetKeys = [];
    
    //將已選取加入可配置列表(避免查詢後已配置不顯示)
    for(let [key, value] of this.selectedMap){
      this.originalTargetKeys.push( {key:key, itemContent:key + " - " + value} );
      this.itemAllMap.set(key, value);
    }

    LoadingUtil.show();

    //塞入查詢條件
    this.subForm.answerTypeCode = "ATC03";//子題
    if(this.answerOption != '' && this.answerOption.indexOf(']') != -1 ){
      this.answerOption = this.answerOption.substr(this.answerOption.indexOf(']')+2);
    }
    
    this.subForm.answerOption = this.answerOption;

    this.$questionBankLetterRightsApi.selectByParamsUsingPOST(this.subForm as QuestionBankLetterRightDto)
    .then((resp) => {
      resp.data.forEach(i => {
        //已選取列表已有項目不重複加入
        if(!this.selectedMap.has(i.itemCode))
          this.originalTargetKeys.push( {key:i.itemCode, itemContent:i.itemCode + " - " + i.itemContent} );
        
        this.itemAllMap.set(i.itemCode, i.itemContent);
      });
    })
    .catch( console.error )
    .finally(() => {
      LoadingUtil.close();
    });
  }

  /** 配置窗異動 */
  onChange(nextTargetKeys, direction, moveKeys) {
    //更新已配置列表
    this.rightTargetKeys = nextTargetKeys;
    
    //更新已選取列表(Map)
    for(let key of moveKeys){
      if(direction == "right"){
        this.resetSelectedMap();
      }else{
        this.selectedMap.delete(key);
      }
    }
  }

  /** 確認送出 */
  public submit() {
    this.$emit("subFormCallBack", this.selectedMap);
  }

  /** 啟用表格拖拉 */
  initSortable() {
    var that = this;
    var el = this.$el.querySelectorAll('.ant-transfer-list-body .ant-table-tbody');
    Sortable.create(el[1], {
      handle: '.ant-table-row', animation: 150, group: { name: 'name', pull: true, put: true },
      onUpdate: function (e) {
        var oIndex = e.oldIndex;
        var nIndex = e.newIndex;
        if (oIndex === nIndex)
          return;
        
        that.updateSelectedList(oIndex, nIndex);
      },
      onStart: function (evt) {
      },
      onAdd: function (evt) {
      },
      onRemove: function (evt) {
      }
    });
  }

  /** 更新已選取列表順序(舊順序, 新順序) */
  updateSelectedList(oIndex, nIndex) {
    let selectKey = this.rightTargetKeys[oIndex];
    this.rightTargetKeys.splice(oIndex, 1);
    this.rightTargetKeys.splice(nIndex, 0, selectKey);

    this.resetSelectedMap();
  }

  /** 更新已選取列表(Map) */
  resetSelectedMap() {
    this.selectedMap.clear();
    for(let key of this.rightTargetKeys){
      this.selectedMap.set(key, this.itemAllMap.get(key));
    }
  }

}