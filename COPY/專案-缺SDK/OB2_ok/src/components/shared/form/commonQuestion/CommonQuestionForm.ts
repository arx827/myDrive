import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { CommonQuestionReturnDto, CommonQuestionDto } from '@fubonlife/obd-api-axios-sdk';
import { AxiosResponse } from "axios";
import { default as LoadingUtil } from "@/assets/config/LoadingUtil";

@Component
export default class CommonQuestionForm extends Vue {
    type = "";
    queryText = "";
    menuText = "";
    //常見問題選單資料
    commonData = [];
    //常見問題內容資料
    commonContentData = [];
    //傳送查詢的資料
    commonSendData: CommonQuestionDto = {};
    //開啟的選單資訊
    openKeys = [];
    //開啟的內容資訊
    activeKey = [];
    //不需開啟的內容資訊
    toRemoveList = [];

    created() {
      
        LoadingUtil.show();
        this.$commonQuestionApi.getCommonQuestionUsingPOST()
          .then((resp: AxiosResponse<CommonQuestionReturnDto>) => {
             this.commonData = resp.data.commonQuestionMainDto;
             for(let data of this.commonData){
               this.toRemoveList.push(data.missionTypeDesc);
             }
          })
          .catch((err) => {
            console.log(err);
            return;
          })
          .finally(() => { LoadingUtil.close() });

    }

    itemClick(e){
        this.menuText = e.key; 
        this.type = "item";
        this.queryClick(this.type);
    }

    queryClick(type){
        this.commonSendData = {
            type: type,
            menuID: this.menuText,
            queryTxt: this.queryText
        }
        if(type == "item"){
          this.queryText = "";
        }else{
          this.openKeys = [];
        }
        LoadingUtil.show();
        this.$commonQuestionApi.getCommonContentUsingPOST(this.commonSendData)
          .then((resp) => {
            this.commonContentData = resp.data.commonQuestionContentChildDto;
          })
          .catch((err) => {
            console.log(err);
            return;
          })
          .finally(() => { LoadingUtil.close() });
    }

    onOpenChange(openKeys) {
      this.openKeys = openKeys;
    }

    handleCollapseChange(){
      let toRemoveList = this.toRemoveList;
      this.activeKey = this.activeKey.filter(function(item) {
        return !toRemoveList.includes(item);
      });
    }

}