import { Option } from '@fubonlife/obd-api-axios-sdk'
import { AxiosResponse } from "axios";
import { Vue } from "vue-property-decorator";
import { FblMenuItem } from "@/components/shared/side-menu/model";
import { MenuDto, MenuNode } from "@fubonlife/obd-api-axios-sdk";

export default class MappingUtil extends Vue {

  /** 取得DB key, Value對照表 */
  static initSeletedList(){
    let typeList = ["answerTypeCode", "itemTypeCode", "itemTitleCode", "businessType", "taskTypeCode", 
                    "respDepart", "executeTime", "costSetting", "questConditionExpress"];
    let dataMap = ( sessionStorage.getItem("selectedMappingList") == null )? 
                  new Map<string, object>():new Map(JSON.parse(sessionStorage.getItem("selectedMappingList")));
    
    typeList.forEach( (type) => {
      if( dataMap.get(type) == null ){
        Vue.prototype.$commonApi.findByTypeIdUsingGET(type)
        .then((resp:AxiosResponse<Option[]>) => {
          //塞入對照清單
          let listMap = {};
          resp.data.forEach( (data) => {
            listMap[data.value] = data.label;
          });
          //加入額外對照資料
          if(type == "answerTypeCode") listMap["null"] = "無選項";
          dataMap.set(type, listMap);
  
          //存入暫存
          sessionStorage.setItem( "selectedMappingList", JSON.stringify(Array.from(dataMap.entries())) );
        }).catch((err) => {
          console.log(err);
        })
      }
    });
  }

  /** 取得 sys_common_code 對照表 內容
   * @param type => 代碼類別編號, data => 代碼
   * @returns 代碼名稱(code_name)
   */
  static getSeletedList(type:string, data:string){
    let dataMap = ( sessionStorage.getItem("selectedMappingList") == null )? 
                  new Map<string, object>():new Map(JSON.parse(sessionStorage.getItem("selectedMappingList")));
    let list = dataMap.get(type);
    return (list[data] == null || !list[data])? data:list[data];
  }

  /** 是否啟用 對照 */
  static enableCode(data:string): string{
    switch (data) {
      case "0":
        return "啟用";
      case "1":
        return "停用";
      default:
        return data;
    }
  }

  /** 是否 對照 */
  static yesNo(data:string): string{
    switch (data) {
      case "Y":
        return "是";
      case "N":
        return "否";
      default:
        return data;
    }
  }

  /** 運算式 中文 轉 keyCode */
  static expressToCode(data:string): string{
    switch (data) {
      case "等於":
        return "EQ";
      case "不等於":
        return "NEQ";
      case "或":
        return "OR";
      case "包含":
        return "CONTAINS";
      case "不包含":
        return "NCONTAINS";
      default:
        return "EQ"; //預設選取等於
    }
  }

  static toMenuItem(node: MenuNode): FblMenuItem {
    const item = node.item;
    return {
      key: item.menuId,
      title: item.menuName,
      route: item.uri,
      // uri:
      children: node.children.map((c) => this.toMenuItem(c)),
      disabled: item.isLeaf && !item.enable,
    };
  }
}