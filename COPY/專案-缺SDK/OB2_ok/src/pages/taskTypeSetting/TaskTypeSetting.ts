
import { Vue, Component } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import {​​​​​​​​ LoginModule }​​​​​​​​ from"@/plugins/store/LoginModule"
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Option } from "@fubonlife/obd-api-axios-sdk";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import difference from 'lodash/difference';
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import message from "@/assets/config/MessageUtil";
import Sortable from 'sortablejs';
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";

@Component({
  components: { HiddenFolde},
})
export default class testForm extends Vue {

  /** 表單欄位 */
  testForm = {
    coreSystemCode: "", //主機代碼
    itemTypeCode: "",   //段落類型
    itemTitleCode: "",  //題目類型
    itemCode: ""        //題目編號
  };

  //Transfer物件參數
  disabled: boolean = false;

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

  /** 查詢條件紀錄(段落類型) */
  queryItemTypeCode: string = "";

  /** 題目類型、編號(顯示/隱藏) */
  isItemsShow: boolean = false;

  /** 提示訊息(顯示/隱藏) */
  isPopTitleShow: boolean = false;
  isPopItemShow: boolean = false;

  //欄位檢核
  coreSystemValid = new validation();
  itemTypeValid = new validation();
  itemTitleValid = new validation();
  itemCodeValid = new validation();

  formRules: { [key: string]: ValidationRule[] } = {
    coreSystemCode: [{validator:this.validationCoreSystemCode, trigger:"blur" }],
    itemTypeCode: [{validator:this.validationItemTypeCode, trigger:"blur" }],
    itemTitleCode: [{validator:this.validationItems, trigger:"blur" }],
    itemCode: [{validator:this.validationItems, trigger:"blur" }]
  };

  //下拉選單
  selectCoreSystemOptions:Option[] = [];
  selectItemTypeOptions:Option[] = [];
  selectItemTypeAllOptions:Option[] = [];
  selectItemTitleOptions:Option[] = [];

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  created() {
    //取得主機代碼下拉選單
    this.$taskSettingApi.getCoreSystemCodeSelectedUsingGET()
    .then((res:AxiosResponse<Option[]>) => {
      this.selectCoreSystemOptions = res.data;
      this.selectCoreSystemOptions.splice(0, 0, {label: "共用", value: "COMMON"});
    }).catch((err) => {
      console.log(err);
    })

    //取得段落類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("itemTypeCode")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectItemTypeAllOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });

    //取得題目類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("itemTitleCode")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectItemTitleOptions = res.data;
      this.selectItemTitleOptions.splice(0, 0, {label: "全部", value: "ALL" });
    }).catch((err) => {
      console.log(err);
    });
  }

  mounted() {
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

  /** 查詢 */
  clickQuery() {
    //欄位檢核
    if( !this.validateQuery() ) return;

    //清空可配置、已配置列表
    this.originalTargetKeys = [];
    this.rightTargetKeys = [];

    //取得欄位資料
    let coreSystemCode = this.testForm.coreSystemCode;
    let itemTypeCode = this.testForm.itemTypeCode;
    let itemCode = this.testForm.itemCode;
    let itemTitleCode = (this.testForm.itemTitleCode == "ALL")? "":this.testForm.itemTitleCode;

    //紀錄此次查尋條件
    this.queryItemTypeCode = itemTypeCode;

    LoadingUtil.show();

    this.$taskApi.findAllTaskUsingGET(coreSystemCode, itemTypeCode, itemCode, itemTitleCode)
    .then((resp) => {
      //不重複加入判斷使用
      let originalMap = new Map();

      //塞入可配置列表
      resp.data.questItemsDtoList.forEach(i => {
        this.originalTargetKeys.push( {key:i.itemCode, itemContent:i.itemCode + " - " + i.itemContent} );
        originalMap.set(i.itemCode, i.itemContent);
      });

      //塞入已配置列表
      resp.data.taskTypeDtoList.forEach(i => {
        //已在可配置列表項目不重複加入
        if(!originalMap.has(i.itemCode))
          this.originalTargetKeys.push( {key:i.itemCode, itemContent:i.itemCode + " - " + i.itemContent} );
        
        this.rightTargetKeys.push(i.itemCode);
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      LoadingUtil.close();
    });
  }

  /** 儲存 */
  submit() {
    //欄位檢核
    let valid = this.validateSubmit();
    if( valid.errMsg != "" ) ErrorModalUtil.modalError(valid.errMsg);
    if( !valid.vaild ) return;

    //取得欄位資料
    let coreSystemCode = this.testForm.coreSystemCode;
    let itemTypeCode = this.testForm.itemTypeCode;
    let updateId = this.avatarText;

    LoadingUtil.show();

    this.$taskApi.updateTaskTypeByUserIdUsingPUT(coreSystemCode, itemTypeCode, updateId, this.rightTargetKeys)
    .then((resp)=>{
      message.messageSuccess("儲存成功", true);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      LoadingUtil.close();
    });
  }

  /** 清除搜尋紀錄 */
  resetForm() {
    //清除檢核訊息
    this.coreSystemValid.reset();
    this.itemTypeValid.reset();
    this.itemTitleValid.reset();
    this.itemCodeValid.reset();

    this.isItemsShow = false;

    //清除查詢條件
    for(let key in this.testForm){
      this.testForm[key] = "";
    }

    //清除下拉選單
    this.selectItemTypeOptions = [];

    //清除可配置、已配置列表
    this.originalTargetKeys = [];
    this.rightTargetKeys = [];
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
      }
    });
  }

  /** 更新已選取列表順序(舊順序, 新順序) */
  updateSelectedList(oIndex, nIndex) {
    let selectKey = this.rightTargetKeys[oIndex];
    this.rightTargetKeys.splice(oIndex, 1);
    this.rightTargetKeys.splice(nIndex, 0, selectKey);
  }

  /** 配置窗異動 */
  onTransferChange(nextTargetKeys:any) {
    this.rightTargetKeys = nextTargetKeys;
  }

  /** 主機代碼下拉異動 
   *  @value open:開場白, end:結束語
   */
   onCoreSystemChange() {
    //清空段落類型
    this.testForm.itemTypeCode = "";
    this.onItemTypeChange();

    //共用
    if(this.testForm.coreSystemCode == "COMMON"){
      this.selectItemTypeOptions = this.selectItemTypeAllOptions.filter((element) => { return element.value == "open" || element.value == "end" });
    }else{
      this.selectItemTypeOptions = this.selectItemTypeAllOptions.filter((element) => { return element.value != "open" });
    }
  }

  /** 段落類型下拉異動 
   *  @value rightLetter:題庫
   */
  onItemTypeChange() {
    //清空題目編號、類型
    this.testForm.itemCode = "";
    this.testForm.itemTitleCode = "";

    //清空檢核訊息
    this.itemTitleValid.reset();
    this.itemCodeValid.reset();

    this.isItemsShow = (this.testForm.itemTypeCode == "rightLetter")? true:false;
  }

  /** 檢核所有欄位(儲存時) */
  validateSubmit() {
    let vaild = true;
    let errMsg = "";

    if(this.rightTargetKeys.length == 0){
      vaild = false;
      errMsg = "已配置方塊無任何資料";
    }else if(this.testForm.itemTypeCode != this.queryItemTypeCode){
      vaild = false;
      errMsg = "段落類型檢核失敗，請重新點選查詢按鈕";
    }

    this.validationCoreSystemCode(null, this.testForm.coreSystemCode, () => {
      if(this.coreSystemValid.state == "error"){
        vaild = false;
        errMsg = "";
      }
    });

    this.validationItemTypeCode(null, this.testForm.itemTypeCode, () => {
      if(this.itemTypeValid.state == "error"){
        vaild = false;
        errMsg = "";
      }
    });

    return {vaild:vaild, errMsg:errMsg};
  }

  /** 檢核所有欄位(查詢時) */
  validateQuery() {
    let vaild = true;

    this.validationCoreSystemCode(null, this.testForm.coreSystemCode, () => {
      if(this.coreSystemValid.state == "error") vaild = false;
    });

    this.validationItemTypeCode(null, this.testForm.itemTypeCode, () => {
      if(this.itemTypeValid.state == "error") vaild = false;
    });

    this.validationItems(null, this.testForm.itemTitleCode, () => {
      if(this.itemTitleValid.state == "error" || this.itemCodeValid.state == "error") vaild = false;
    });

    return vaild;
  }

  /** 檢核主機代碼 - 為必填 */
  validationCoreSystemCode(rule, value, callback) {
    this.coreSystemValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.coreSystemValid.msg = "請選擇主機代碼";
    }

    if(this.coreSystemValid.msg != ""){
      this.coreSystemValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核段落類型 - 為必填 */
  validationItemTypeCode(rule, value, callback) {
    this.itemTypeValid.reset();
    this.coreSystemValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.itemTypeValid.msg = "請選擇段落類型";
    }

    if(this.itemTypeValid.msg != ""){
      this.itemTypeValid.setError();
      callback(() => { });
    }

    if( validationUtil.isEmpty(this.testForm.coreSystemCode) ){
      this.coreSystemValid.msg = "請選擇主機代碼";
    }

    if(this.coreSystemValid.msg != ""){
      this.coreSystemValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核題目類型、編號 - 擇一填、編號僅可輸入英數字 */
  validationItems(rule, value, callback) {
    let field = (rule != null)? rule.field:"";

    this.isPopTitleShow = false;
    this.isPopItemShow = false;

    this.itemTitleValid.reset();
    this.itemCodeValid.reset();

    if( validationUtil.isEmpty(this.testForm.itemCode) && validationUtil.isEmpty(this.testForm.itemTitleCode) && this.isItemsShow ){
      this.itemTitleValid.msg = "題目類型及題目編號請擇一輸入";
      this.itemCodeValid.msg  = "題目類型及題目編號請擇一輸入";
    }else if( !validationUtil.isEmpty(this.testForm.itemCode) && !validationUtil.itemCodeValidation(this.testForm.itemCode) ){
      this.itemCodeValid.msg = "題目編號僅可輸入英數字";
    }

    if(this.itemTitleValid.msg != ""){
      this.itemTitleValid.setError();
    }

    if(this.itemCodeValid.msg != ""){
      this.itemCodeValid.setError();
    }

    if( (this.itemTitleValid.msg != "" && field == "itemTitleCode") || (this.itemCodeValid.msg != "" && field == "itemCode") ){
      callback(() => { });
    }

    callback();
  }

}



