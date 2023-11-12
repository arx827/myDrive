import { Vue, Component } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { Option } from "@fubonlife/obd-api-axios-sdk";
import {​​​​​​​​ LoginModule }​​​​​​​​ from"@/plugins/store/LoginModule"
import { Modal } from "ant-design-vue";
import difference from 'lodash/difference';
import MomentUtil from "@/assets/config/MomentUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import message from "@/assets/config/MessageUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";

@Component({
  components: { HiddenFolde}
})
export default class PersonTask extends Vue {

  /** 查詢表單參數 */
  searchForm = {
    taskId: ""
  };

  /** 顯示結果表單參數 */
  resultForm = {
    createId: "",
    createDate: "",
    updateId: "",
    updateDate: ""
  }

  //Transfer物件參數
  disabled: boolean = false;

  originalTargetKeys = [];
  rightTargetKeys = [];

  leftColumns = [
    {
      dataIndex: "userName",
      title: "人員"
    }
  ];
  rightColumns = [
    {
      dataIndex: "userName",
      title: "人員"
    }
  ];

  /** 電訪項目代碼-名稱下拉選單 */
  selectTaskIdNameOptions:Option[] = [];

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  created() {
    //取得電訪代碼 + 電訪名稱下拉選單
    this.$taskSettingApi.getTaskIdNameSelectedUsingGET("ALL")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectTaskIdNameOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });
  }

  /** 電訪項目代碼-名稱 下拉異動*/
  onTaskIdChange(){
    //清空可配置、已配置列表
    this.originalTargetKeys = [];
    this.rightTargetKeys = [];

    //清空異動人員、時間
    for(let key in this.resultForm){
      this.resultForm[key] = "";
    }

    LoadingUtil.show();
    this.$personTaskApi.findAllPersonTaskUsingGET(this.searchForm.taskId)
    .then((resp) => {
      //不重複加入判斷使用
      let originalMap = new Map();

      //塞入可配置人員列表
      resp.data.userTaskMapList.forEach(i => {
        this.originalTargetKeys.push( {key:i.USER_ID, userName:i.USER_ID + " - " + i.USER_NAME} );
        originalMap.set(i.USER_ID, i.USER_NAME);
      });

      //塞入已配置人員列表
      resp.data.personTaskDtoList.forEach(i => {
        //已在可配置列表項目不重複加入
        if(!originalMap.has(i.userId))
          this.originalTargetKeys.push( {key:i.userId, userName:i.userId + " - " + i.userName} );

        this.rightTargetKeys.push(i.userId);
      });

      //塞入建立日期、人員，最後異動日期、人員
      this.resultForm.createId = resp.data.createId;
      this.resultForm.createDate = (resp.data.createDate != null)? MomentUtil.transformRoc(resp.data.createDate):"";
      this.resultForm.updateId = resp.data.updateId;
      this.resultForm.updateDate = (resp.data.updateDate != null)? MomentUtil.transformRoc(resp.data.updateDate):"";
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      LoadingUtil.close();
    });
  }

  /** 配置窗異動 */
  onTransferChange(nextTargetKeys) {
    this.rightTargetKeys = nextTargetKeys;
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

  /** 送出設定 */
  submit() {
    Modal.confirm({
      title: "儲存",
      okText: "儲存",
      cancelText: "取消",
      content: "確定要儲存嗎?",
      centered: true,
      onOk: () => {
        this.updatePersonTask();
      }
    });
  }

  /** 儲存設定  */
  updatePersonTask(){
    LoadingUtil.show();
    this.$personTaskApi.updatePersonTaskDataUsingPUT(this.searchForm.taskId, this.avatarText, this.rightTargetKeys)
    .then((resp)=>{
      message.messageSuccess("儲存成功", true);
      
      //更新異動人員及日期
      this.resultForm.updateId = this.avatarText;
      this.resultForm.updateDate = MomentUtil.transformRoc(resp.data);

      //更新建立人員及日期
      if(this.resultForm.createDate == ""){
        this.resultForm.createId = this.avatarText;
        this.resultForm.createDate = MomentUtil.transformRoc(resp.data);
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      LoadingUtil.close();
    });
  }
}




