
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";

import ValidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder
} from "@/components/shared/data-grid/models";
import PolicySkillForm from "@/components/shared/form/policySkillForm/PolicySkillForm.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { Option, PageOfUserSkillsDto, StaffDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import UserSkillsDto from "./Model";
@Component({
    components: { PolicySkillForm, HiddenFolde, FblDataGrid }
})
export default class PolicyTagSetting extends Vue {
    userTagsOptionTest: Option[] = [{

        label: "測試區",
        value: "1"

    }, {
        label: "顯示區",
        value: "2"

    }]


    tabActiveKey: string = "1";

    // ===================================== 下拉式選單 ========================================================
    // 部門
    selectDepOptions: Option[] = [];
    // 科別
    selectDiviOptions: Option[] = [];
    // 電訪員
    selectTmrOptions: Option[] = [];
    //使用者清單
    allUserList: Option[] = [];
    //使用者清單
    allDivList: Option[] = [];
    // 部門對應科別/人員資料(為map的形式)
    depUnitInfo = {};
    depUserInfo = {};
    // 科別對應人員資料
    unitUserInfo = {};

    //客戶標籤下拉選單
    userTagsOptions = [];
    //語言下拉選單
    userLanguageOptions = [];
    // ===================================== 下拉式選單  end========================================================

    //初始化表單資料
    iniAllUserStaffList = [];
    userSkillSearchForm = {
        departmentIdList: [],
        divisionIdList: [],
        tmrIdList: [],
        selectedLanguages: [],
        selectedTags: [],
    };

    userSuperUnitId: string = "";
     /**
   * 選擇部門時，科別範圍限縮
   */
  onSelectDept() {

    this.selectDiviOptions = [];
    this.selectTmrOptions = [];
    
    if (this.userSkillSearchForm.departmentIdList.length > 0) {

      this.userSkillSearchForm.departmentIdList.forEach((depId) => {
        
        // 取得部門對應的科別
        if(!ValidationUtil.isEmpty(this.depUnitInfo[depId])){
          this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
        }

        // 取得部門對應人員
        if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
        }
        
      });
        
    }else{
      // 科別 下拉
      this.selectDiviOptions = Object.assign(this.allDivList);
      
      // 電訪員 下拉
      this.selectTmrOptions = Object.assign(this.allUserList);
      
    }

    //重置科別選項
    let unitIdTempList = Object.assign(this.userSkillSearchForm.divisionIdList);
    unitIdTempList.forEach((eachSelected)=>{

      // 如果當前選擇的科別不在科別下拉選單裡，則要移除
      if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
        if(this.userSkillSearchForm.divisionIdList.length > 0) {
          this.userSkillSearchForm.divisionIdList = this.userSkillSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
        }
      }
    });

    //重置電訪員選項
    let userIdTempList = Object.assign(this.userSkillSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.userSkillSearchForm.tmrIdList.length > 0) {
          this.userSkillSearchForm.tmrIdList = this.userSkillSearchForm.tmrIdList.filter(userId => userId != eachSelected);
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
    this.selectTmrOptions = [];


    // 有選擇科別
    if(this.userSkillSearchForm.divisionIdList.length > 0){

      // 取得科別對應人員
      this.userSkillSearchForm.divisionIdList.forEach( (unitId) => {
        if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });

    }else{

      // 有選擇部門
      if (this.userSkillSearchForm.departmentIdList.length > 0) {

        this.userSkillSearchForm.departmentIdList.forEach((depId) => {
  
          // 取得部門對應人員
          if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
            this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
          }
          
        });
          
      } else {
        // 電訪員 下拉
        this.selectTmrOptions = Object.assign(this.allUserList);
      }
    }

    //重置電訪員選項
    let userIdTempList = Object.assign(this.userSkillSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.userSkillSearchForm.tmrIdList.length > 0) {
          this.userSkillSearchForm.tmrIdList = this.userSkillSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
  }
    /**
  * 頁面開啟
  * @returns 
  */
    async created() {

        LoadingUtil.show();
        this.$unitApi.getAllDepUnitTmrOptionsUsingGET()
            .then((resp) => {
                if (resp.data != null) {

                    // 部門對應科別/人員資料
                    this.depUnitInfo = resp.data.depUnitInfo;
                    this.depUserInfo = resp.data.depUserInfo;

                    // 科別對應人員資料
                    this.unitUserInfo = resp.data.unitUserInfo;

                    // 部門 下拉
                    this.selectDepOptions = Object.assign(resp.data.departOptions);
                    this.userSkillSearchForm.departmentIdList.push(resp.data.defaultDepId);

                    // 科別 下拉
                    this.allDivList = resp.data.unitList;


                    // 電訪員 下拉
                    this.allUserList = resp.data.userList;


                    // 有預設部門需一起異動科別/人員
                    if (!ValidationUtil.isEmpty(resp.data.defaultDepId)) {
                        this.userSuperUnitId = resp.data.defaultDepId;
                        this.onSelectDept();
                    }
                } else {
                    ErrorModalUtil.modalError(this.$t('case_search_getAllUserAndUnit_occur_error2').toString()); //取得使用者及部門科別清單發生異常
                    LoadingUtil.close();
                }
                LoadingUtil.close();
                this.reload();
            })
            .catch((err) => {
                LoadingUtil.close();
            })


        //抓取使用者們(後端api修改不過濾部門)
        const getStaffs = this.$userApi.getAllUserWithStaffDtoUsingGET().then((res: AxiosResponse<StaffDto[]>) => {
            this.iniAllUserStaffList = res.data
        }).catch(error => { console.log(error) });

        this.$commonApi.findByTypeIdUsingGET("skill.language")
            .then((resp) => {
                resp.data.forEach((code) => {
                    this.userLanguageOptions.push({ label: code.label, value: code.value });
                })
            }).catch((err) => {
                ErrorModalUtil.modalError(this.$t('custMark_selectionL').toString())
            })
        //取得客戶標籤下拉選單
        this.$commonApi.findByTypeIdUsingGET("skill.tag")
            .then((resp) => {
                resp.data.forEach((code) => {
                    this.userTagsOptions.push({ label: code.label, value: code.value });
                })
            }).catch((err) => {
                ErrorModalUtil.modalError(this.$t('custMark_selectionT').toString())
            })

    }

    //避免搜尋連按導致無限迴圈的flag
    searchFlag: boolean = true;
    //判斷當下是否可執行匯出
    isExportDisable: boolean = true;
    async reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();
            this.$userSkillApi.paginateSkillsByUserIdUsingGET(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                (this.userSkillSearchForm.departmentIdList.length != 0) ? this.userSkillSearchForm.departmentIdList : null,
                (this.userSkillSearchForm.selectedLanguages.length != 0) ? this.userSkillSearchForm.selectedLanguages : null,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                (this.userSkillSearchForm.selectedTags.length != 0) ? this.userSkillSearchForm.selectedTags : null,
                (this.userSkillSearchForm.divisionIdList.length != 0) ? this.userSkillSearchForm.divisionIdList : null,
                (this.userSkillSearchForm.tmrIdList.length != 0) ? this.userSkillSearchForm.tmrIdList : null,
            ).then((resp: AxiosResponse<PageOfUserSkillsDto>) => {
                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.grid.data = resp.data.content;
                this.grid.pagination = p;
            }).catch(error => {
                //特殊保戶註記查詢失敗
                ErrorModalUtil.modalError(this.$t('custMark_paginateF').toString())
            })
                .finally(() => {
                    LoadingUtil.close();
                    this.isExportDisable = false;
                    if (this.grid.data.length == 0) {
                        //無符合篩選條件之資料、查詢結果
                        MessageUtil.messageInfo(this.$t('CUST_MARK_NOT_FOUND').toString());
                    }
                    this.searchFlag = true;
                }
                )
        }
    }

    /**
    * 上方enter搜尋
    */
    async onUserSkillSearch() {
        this.grid.pagination.current = 1;
        this.reload();
    }
    /**
    * 新增保戶註記設定搜尋條件清除
    * @returns 
    */
    resetUserSkillSearch() {
        this.userSkillSearchForm = {
            departmentIdList: [this.userSuperUnitId],
            divisionIdList: [],
            tmrIdList: [],
            selectedLanguages: [],
            selectedTags: [],
        };

        this.isExportDisable = true;
        //將下方資料清空
        this.grid.data = [];
        this.grid.pagination.total = 0;
    }

    //當user被選取時部門無法選擇
    onUserSelectChange() {
        this.isExportDisable = true;
    }



    onUserLanguageChanges() {
        this.isExportDisable = true;
    }

    onUserTagsChanges() {
        this.isExportDisable = true;
    }


    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input) >= 0
        );
    }




    /**
     * 電訪項目單筆技能新增/編輯表單送出
     */

    async userSkillSettingModalSubmit() {
        const flag = await (this.$refs.policySkillFormForm as any).validateBeforeSubmit();
        if (flag) {
            Modal.confirm({
                title: this.$t('global_save'), //儲存
                content: this.$t('global_confirmSave').toString() + '？', //資料無誤，確認執行儲存
                okText: this.$t('global_ok').toString(), //確認
                cancelText: this.$t('global_cancel').toString(),  //取消
                icon: 'warning',
                onOk: async () => {
                    await (this.$refs.policySkillFormForm as any).submit();
                },
                onCancel: () => { },
            })
                ;
        } else {
            return
        }

    }

    /**
    * 當單筆特保技能成功新增後
    */
    onTaskSettingSuccess(val) {
        this.userSkillFormVisible = val;
        this.reload();
    }

    /**
    * 特保技能單筆新增/編輯表單取消
    */
    userSkillSettingModalCancel() {
        this.userSkillFormVisible = false;
    }

    //控制是否顯示單筆電訪項目
    userSkillFormVisible: boolean = false;
    //傳入編輯或者新增的userSkill
    userSkillSettingData = {};

    // ======================匯出export section===================

    //匯出特殊保戶註記項目
    exportUserSkills() {
        if (this.isExportDisable) {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
        } else if (this.grid.data.length == 0) {
            ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合結果，無法匯出
        } else {
            LoadingUtil.show();
            //將查詢的結果匯出
            this.$userSkillApi.excelUserSkillUsingPOST1(
                (this.userSkillSearchForm.departmentIdList.length != 0) ? this.userSkillSearchForm.departmentIdList : null,
                (this.userSkillSearchForm.selectedLanguages.length != 0) ? this.userSkillSearchForm.selectedLanguages : null,
                (this.userSkillSearchForm.selectedTags.length != 0) ? this.userSkillSearchForm.selectedTags : null,
                (this.userSkillSearchForm.divisionIdList.length != 0) ? this.userSkillSearchForm.divisionIdList : null,
                (this.userSkillSearchForm.tmrIdList.length != 0) ? this.userSkillSearchForm.tmrIdList : null
                , { responseType: 'blob' })
                .then((res) => {
                    this.dealDownLoadData(res.data, "特殊保戶註記匯出.xlsx");
                    LoadingUtil.close();
                    MessageUtil.messageSuccess(this.$t("global_exportSuccess").toString()) //匯出成功
                })
                .catch((err) => {
                    ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                })
                .finally(() => {
                    LoadingUtil.close();
                });
        }
    }



    //處理後端回傳的下載內容
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
        } catch (ex) {
            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        }
    }

    //==========================和下方table相關==========================
    /**
    * 特殊保戶註記列表事件觸發選項
    * @param e 特殊保戶註記列資料觸發事件 
    * @returns 
    */
    onUserSkillsTableActionClick(e) {

        switch (e.action.name) {
            case "delete":
                this.userSkillsDelete(e.row.data);
                break;
            case "edit":
                this.showUserSkillsEditModal(e.row.data);
                break;

        }
    }

    /**
    * 特殊保戶註記列單筆資料刪除
    * @param data 特殊保戶註記列表單筆資料 
    * @returns 
    */
    userSkillsDelete(data) {
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('global_delete').toString(),
            content: this.$t('eventS_confirmDelete').toString() + '?',
            onOk: async () => {
                try {
                    await this.$userSkillApi.deleteUserSkillsByUserIdUsingPOST(data.userId);
                    MessageUtil.messageSuccess(this.$t('global_data_delete_success').toString()); //資料刪除成功
                    this.reload();
                } catch (err) {
                    MessageUtil.messageError(this.$t(err.response.data.apiErrorCode).toString() + "，" + this.$t('global_deleteFailed').toString()); //刪除失敗
                } finally {
                    this.reload();
                }
            }
        });
    }

    /**
    * 顯示編輯/新增保戶註記技能設定
   * @param data 電訪人員技能單筆資料 
   * @returns 
   */
    showUserSkillsEditModal(data) {
        this.userSkillFormVisible = true;
        this.titleText = this.$t('userSkill_edit').toString();//特保註記技能編輯
        this.userSkillSettingData = data;
    }

    titleText = "";
    /**
    * 新增特保註記技能
    * @returns 
    */
    showUserSkillsAddModal() {
        this.titleText = this.$t('userSkill_add').toString();//特保註記技能新增
        this.userSkillFormVisible = true;
        this.userSkillSettingData = {};

    }


    /**
    * 使用者電訪項目列表下一頁時維持相同的排序
    * @param e 使用者列表下一頁事件 
    * @returns 
    */
    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        this.reload();
    }



    // 使用者資料顯示設定
    grid: FblPDataGridHolder<UserSkillsDto> = {
        rowKey: "userId",
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        columns: [
            {
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "edit",
                        title: this.$t('global_edit').toString(),
                        edit: true
                    }, {
                        name: "delete",
                        title: this.$t('global_delete').toString(),
                        delete: true
                    }

                ],
            },
            {
                type: FblColumnType.PLAIN,
                property: "unitId",
                title: this.$t('global_division').toString(),
                formatter: (data: UserSkillsDto) => {
                    return data.unitName;
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "userId",
                title: this.$t('global_telemarketer').toString(),
                formatter: (data: UserSkillsDto) => {
                    return data.userName;
                },

            },
            {
                type: FblColumnType.PLAIN,
                property: "languageIds",
                title: this.$t('global_language').toString(),// 語言 多項 以;隔開
                formatter: (data: UserSkillsDto) => {
                    if (data.languageIds.length != 0) {
                        return data.languagesNameString;
                    } else {

                        return ""
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "tagIds",
                title: this.$t('custMark_tag').toString(),//客戶標籤
                formatter: (data: UserSkillsDto) => {
                    if (data.tagIds.length != 0) {
                        return data.tagNamesString;
                    } else {
                        return "";
                    }
                }

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('global_modified_user').toString(),//異動人員
                property: "updateId",
                formatter: (data: UserSkillsDto) => {
                    if (data.updateName == null || data.updateName == "") {
                        return "";
                    } else {
                        return data.updateName
                    }

                },

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('global_modified_date').toString(),
                property: "updateDate",//異動時間
                formatter: (data: UserSkillsDto) => {
                    return MomentUtil.transformRoc(data.updateDate);

                },

            },
        ]

    };

}