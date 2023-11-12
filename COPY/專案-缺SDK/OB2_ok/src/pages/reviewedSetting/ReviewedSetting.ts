import { Vue, Component, Watch } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import moment from 'moment';
import { AxiosResponse } from "axios";
import ReviewSettingUpdate from "@/components/shared/form/reviewSettingUpdateForm/ReviewSettingUpdateForm.vue";
import { RoleInfoDto, Option, UserRolesUpdate, ReviewSettingCreation, ReviewSettingCreationTypeEnum, ReviewSubTypeDto } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { Modal } from "ant-design-vue";
import { MenuItemsModule } from "@/plugins/store/MenuItemsModule";
import { mapActions } from "vuex";
import InfRecord from "@/components/shared/form/history/infRecord/InfRecord.vue"
import MailRecord from "@/components/shared/form/history/mailHistory/MailHistory.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";    

@Component({
    components: {
        ReviewSettingUpdate,InfRecord,MailRecord,HiddenFolde
    }
})
export default class ReviewedSetting extends Vue {
    

    // =======================================

    //transfer左側資料
    reviewSettingRolesMockData = [];
    //transfer右側資料
    reviewSettingIdRole = [];

    //覆核類型下拉選單
    reviewSettingOptions: Option[] = [
    ]
    //覆核主類型下拉選單
    reviewTypeOptions: Option[] = [


    ]
    //覆核子類型下拉選單
    reviewSubTypeOptions: Option[] = [

    ]
    //初始子類型下拉選單
    iniaReviewTypeOptions: Option[] = [
    ];
    //初始子類型下拉選單
    iniaReviewSubTypeOptions: Option[] = [
    ];
    //原始主類別項目
    originalReviewType = [];


    //原始子類別項目
    originalReviewSubType = [];

    //上方搜尋項目
    reviewedSettingSearchForm = {
        selectedReviewedSettingType: "",
        selectedReviewedType: "",
        selectedReviewedSubType: "",
    };
    //上方搜尋Dto
    afterSearchReviewedSettingDto: ReviewSettingCreation = {

    }

    reviewTypeDisable: boolean = false;

    reviewSubTypeDisable: boolean = false;
    thirdMenuId: string = "";

    majorTypeAndSubTypeMap = new Map<string, ReviewSubTypeDto[]>();

    //第三層選單切換按鈕
    // thirdMenuButtonClick(data) {
    //     // this.thirdMenuId = data.menuId;
    //     MenuItemsModule.updateThirdMenuId(data.menuId);
    //     this.thirdMenuId = MenuItemsModule.thirdMenuId$;
    // }

    created() {
        this.initSearchOptions();
        this.reload();
    }
    
    
    


    /**@author B1530 
     * @version 2022/01/14 
     * 初始化上方下拉選單
     */
    initSearchOptions() {
        //覆核類別下拉選單
        this.$commonApi.findByTypeIdUsingGET("MAJOR_TYPE")
            .then((resp) => {
                this.reviewSettingOptions = this.reviewSettingOptions.concat(resp.data.filter(e=>e.value!="PC"&&e.value!="SUSPECTIVE"&&e.value!="IMPAIRMENT"));
            }).catch((err) => {//取得覆核類型下拉選單失敗
                ErrorModalUtil.modalError(this.$t("reviewSP_reviewSettingType_Options_Failed").toString());
            })
        // 覆核主類別下拉選單
        this.$reviewedSettingApi.getAllReviewTypeUsingGET1()
            .then((resp) => {
                resp.data.forEach((reviewType) => {
                    // this.reviewTypeOptions.push({ label: reviewType.description, value: reviewType.reviewTypeId });
                    this.originalReviewType.push(
                        {
                            description: reviewType.description,
                            reviewTypeId: reviewType.reviewTypeId,
                            type: reviewType.type
                        });
                    this.iniaReviewTypeOptions.push({ label: reviewType.description, value: reviewType.reviewTypeId });


                })
            }).catch((err) => {//取得覆核主類型下拉選單失敗
                ErrorModalUtil.modalError(this.$t("reviewSP_reviewMajorType_Options_Failed").toString())
            })
        // 覆核子類別下拉選單

        this.$reviewedSettingApi.getAllReviewSubTypeUsingGET1()
            .then((resp) => {

                const object = resp.data.majorTypeSubTypeMapping;
                for (let key in object) {
                    this.majorTypeAndSubTypeMap.set(key, object[key]);
                }
            }).catch((err) => {//取得覆核子類型下拉選單失敗
                ErrorModalUtil.modalError(this.$t("reviewSP_reviewSubjectType_Options_Failed").toString())
            })


    }

    onReviewSettingTypeChange() {
        this.isSubmitDisabled = true;
        this.reviewedSettingValidateForm.selectedReviewedSettingType.state = "";
        this.reviewedSettingValidateForm.selectedReviewedSettingType.hover = "";
        this.reviewedSettingValidateForm.selectedReviewedSubType.state = "";
        this.reviewedSettingValidateForm.selectedReviewedSubType.hover = "";
        if (this.reviewedSettingSearchForm.selectedReviewedSettingType == "") {
            this.reviewTypeDisable = false;
            this.reviewSubTypeDisable = false;
            this.reviewedSettingSearchForm.selectedReviewedType = "";
            this.reviewedSettingSearchForm.selectedReviewedSubType = "";
            this.reviewTypeOptions = this.iniaReviewTypeOptions;
            this.reviewSubTypeOptions = [];

        } else if (this.reviewedSettingSearchForm.selectedReviewedSettingType == "PC" || this.reviewedSettingSearchForm.selectedReviewedSettingType == "SUSPECTIVE") {
            this.reviewedSettingSearchForm.selectedReviewedSubType = "";
            this.reviewedSettingSearchForm.selectedReviewedType = "";
            this.reviewedSettingValidateForm.selectedReviewedType.state = "";
            this.reviewedSettingValidateForm.selectedReviewedSubType.state = "";
            this.reviewTypeDisable = true;
            this.reviewSubTypeDisable = true;
        }
        else {
            this.reviewTypeDisable = false;
            this.reviewSubTypeDisable = false;
            this.reviewedSettingSearchForm.selectedReviewedType = "";
            this.reviewedSettingSearchForm.selectedReviewedSubType = "";
            this.reviewSubTypeOptions=[];
            this.reviewTypeOptions = [

            ]
            this.originalReviewType.filter(
                e => e.type == this.reviewedSettingSearchForm.selectedReviewedSettingType
            ).forEach(e => {
                this.reviewTypeOptions.push({
                    label: e.description,
                    value: e.reviewTypeId
                })
            })
        }
    }

    onReviewTypeChange() {
        this.isSubmitDisabled = true;
        this.reviewSubTypeDisable = false;
        this.reviewedSettingValidateForm.selectedReviewedType.state = "";
        this.reviewedSettingValidateForm.selectedReviewedType.hover = "";
        if (this.reviewedSettingSearchForm.selectedReviewedType == "") {
            this.reviewedSettingSearchForm.selectedReviewedSettingType = "";
            this.reviewedSettingSearchForm.selectedReviewedSubType = "";
            this.reviewSubTypeOptions = [];
        } else {
            if (this.reviewedSettingSearchForm.selectedReviewedType == "5" || this.reviewedSettingSearchForm.selectedReviewedType == "4") {
                this.reviewSubTypeDisable = true;
                this.reviewedSettingValidateForm.selectedReviewedSubType.state = "";
                this.reviewedSettingValidateForm.selectedReviewedSubType.hover = "";
            }

            this.reviewedSettingSearchForm.selectedReviewedSubType = "";
            this.reviewedSettingValidateForm.selectedReviewedSettingType.state = "";
            //取得照會 會辦等類別
            const slectedtype = this.originalReviewType
                .filter(e => e.reviewTypeId == this.reviewedSettingSearchForm.selectedReviewedType)
                .map(e => e.type)[0];
            //連動覆核類型
            this.reviewedSettingSearchForm.selectedReviewedSettingType = slectedtype;
            //建立子類型Options
            this.reviewSubTypeOptions = [];

            this.majorTypeAndSubTypeMap.get(this.reviewedSettingSearchForm.selectedReviewedType).forEach(
                reviewSubTypeDto => {
                    this.reviewSubTypeOptions.push({
                        label: reviewSubTypeDto.reviewSubTypeName,
                        value: reviewSubTypeDto.reviewSubTypeId

                    })
                }

            )
        }

    }
    onReviewSubTypeChange() {
        this.isSubmitDisabled = true;
        this.reviewedSettingValidateForm.selectedReviewedSubType.state = "";
        this.reviewedSettingValidateForm.selectedReviewedSubType.hover = "";
    }

    /**
     * 上方按下搜尋後進行驗證和賦值
     */
    onReviewedSettingSearch() {
        this.isSubmitDisabled = false;
        this.validateSelectedselectedReviewedSettingType(null, this.reviewedSettingSearchForm.selectedReviewedSettingType, () => { });

        if (!this.reviewTypeDisable) {
            this.validateSelectedselectedReviewedType(null, this.reviewedSettingSearchForm.selectedReviewedType, () => { });
        } else {
            this.reviewedSettingValidateForm.selectedReviewedType.state = "success"
            this.reviewedSettingValidateForm.selectedReviewedType.feedback = false
        }
        if (!this.reviewSubTypeDisable) {
            this.validateSelectedselectedReviewedSubType(null, this.reviewedSettingSearchForm.selectedReviewedSubType, () => { });
        } else {
            this.reviewedSettingValidateForm.selectedReviewedSubType.state = "success"
            this.reviewedSettingValidateForm.selectedReviewedSubType.feedback = false
        }
        const isValidReviewedSettingType: boolean = this.reviewedSettingValidateForm.selectedReviewedSettingType.state == "success" ? true : false;
        const isValidreviewType: boolean = this.reviewedSettingValidateForm.selectedReviewedType.state == "success" ? true : false;
        const isValidreviewSubTyp: boolean = this.reviewedSettingValidateForm.selectedReviewedSubType.state == "success" ? true : false;

        //假設驗證成功才可以送出更新搜尋條件
        if (
            isValidReviewedSettingType
            && isValidreviewType
            && isValidreviewSubTyp
        ) {
            if (this.reviewedSettingSearchForm.selectedReviewedSettingType == "NOTI") {
                this.afterSearchReviewedSettingDto.type = ReviewSettingCreationTypeEnum.NOTI
            } else if (this.reviewedSettingSearchForm.selectedReviewedSettingType == "INF") {
                this.afterSearchReviewedSettingDto.type = ReviewSettingCreationTypeEnum.INF
            } else if (this.reviewedSettingSearchForm.selectedReviewedSettingType == "PC") {
                this.afterSearchReviewedSettingDto.type = ReviewSettingCreationTypeEnum.PC
            } else if (this.reviewedSettingSearchForm.selectedReviewedSettingType == "SUSPECTIVE") {

                this.afterSearchReviewedSettingDto.type = ReviewSettingCreationTypeEnum.SUSPECTIVE
            } else if (this.reviewedSettingSearchForm.selectedReviewedSettingType == "IMPAIRMENT") {

                this.afterSearchReviewedSettingDto.type = ReviewSettingCreationTypeEnum.IMPAIRMENT
            } else {
                this.afterSearchReviewedSettingDto.type = null;
            }
            this.afterSearchReviewedSettingDto.reviewTypeId = this.reviewedSettingSearchForm.selectedReviewedType;
            this.afterSearchReviewedSettingDto.reviewSubTypeId = this.reviewedSettingSearchForm.selectedReviewedSubType;


            this.reload();

        }

    }
    validRolesId = [];
    /** @author B1530
     *  @version 2022/01/14  
     *  render下方Transfer資料源
     */
    async reload() {

        if (this.reviewedSettingSearchForm.selectedReviewedSettingType !== "") {

            LoadingUtil.show();
            //所有角色
            await this.$roleApi.findAllRolesUsingGET()
                .then((res: AxiosResponse<RoleInfoDto[]>) => {
                    let rolesSet = res.data;
                    let tempararyMockData = []
                    rolesSet.forEach(i => {
                        if (i.status == "Y") {
                            tempararyMockData.push(
                                {
                                    key: i.id,
                                    title: i.id,
                                    description: i.roleName,

                                });
                            this.validRolesId.push(i.id);
                        }
                    });
                    this.reviewSettingRolesMockData = tempararyMockData;
                })
                .catch((err) => {
                    ErrorModalUtil.modalError(this.$t("reviewSP_all_roles_failed").toString());//取得所有有效角色失敗
                }).finally(() => {

                    LoadingUtil.close();
                });

        }
        // 根據上方搜尋條件找到其roleIds
        await this.$reviewedSettingApi.findRolesIdByReviewedSettingTermsUsingPOST(this.afterSearchReviewedSettingDto)
            .then((res) => {
                let tempararyReviewSettingRoles = [];
                let reviewRolesSet = res.data;

                reviewRolesSet.filter(roleId => this.validRolesId.includes(roleId)).forEach(i =>
                    tempararyReviewSettingRoles.push(
                        i
                    )
                )
                this.reviewSettingIdRole = tempararyReviewSettingRoles
            }).catch((err) => {
                ErrorModalUtil.modalError(this.$t("reviewSP_unauthorized_roles_failed").toString());//取得未受權角色失敗
            })
    }


    compareStringArrays(firstArray: Array<string>, secondArray: Array<string>) {

        let flag: boolean = false;
        if (firstArray.length != secondArray.length) {
            flag = true;
        }
        for (let i = 0; i < firstArray.length; i++) {
            if (secondArray.indexOf(firstArray[i]) <= -1) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    isSubmitDisabled: boolean = true;
    /*
    * 儲存
    */
    async onReviewedSettingSubmit() {
        //上方的主類別不為null才執行
        if (this.isSubmitDisabled || this.reviewedSettingValidateForm.selectedReviewedType.state == "error" || this.reviewedSettingValidateForm.selectedReviewedSubType.state == "error") {

            ErrorModalUtil.modalError(this.$t("reviewSetting_failed_click_search_again").toString());
        } else {
            if (this.afterSearchReviewedSettingDto.type != null && this.reviewedSettingValidateForm.selectedReviewedType.state == "success" && this.reviewedSettingValidateForm.selectedReviewedSubType.state == "success") {
                Modal.confirm({
                    title: this.$t('global_save'), //儲存
                    content: this.$t('global_confirmSave').toString() + '？', //確認執行儲存
                    okText: this.$t('global_ok').toString(), //確認
                    cancelText: this.$t('global_cancel').toString(),  //取消
                    icon: 'warning',
                    onOk: async () => {
                        let reviewedSettingRoleIdList: Array<string> = [];
                        //取得transfer右側RoleId陣列
                        reviewedSettingRoleIdList = await (this.$refs.roleUpdate as any).submit();
                        let reviewSettingRolesList = [];
                        //得到可以覆核設定流程的角色Id
                        await this.$reviewSettingApi.findRolesIdByReviewSettingTermsUsingPOST(this.afterSearchReviewedSettingDto)
                            .then((res) => {
                                let reviewRolesSet = res.data;
                                reviewRolesSet.filter(roleId => this.validRolesId.includes(roleId)).forEach(roleId =>
                                    reviewSettingRolesList.push(
                                        roleId
                                    )
                                )
                            }).catch((err) => {//取得待更新的角色id失敗
                                ErrorModalUtil.modalError(this.$t("reviewSP_getUpdatedRoles_failed").toString());
                            });

                        let onPageChangeFlag: boolean;
                        //判斷是否要切換到可以覆核設定
                        onPageChangeFlag = reviewSettingRolesList.length == 0 ? true : false;

                        if (reviewedSettingRoleIdList.length == 0) {
                            //當回傳值為0的時候需要丟一個null進去後端才可以接收此Set
                            reviewedSettingRoleIdList = [null];

                            this.$reviewedSettingApi.updateReviewedSettingByRoleIdsUsingPOST(reviewedSettingRoleIdList, this.afterSearchReviewedSettingDto)
                                .then(() => {//儲存成功
                                    MessageUtil.messageSuccess(this.$t("global_save_success").toString());
                                })
                                .catch((err) => {//儲存失敗
                                    ErrorModalUtil.modalError(this.$t("global_save_failed").toString());
                                });

                            this.reload();
                        } else {
                            this.$reviewedSettingApi.updateReviewedSettingByRoleIdsUsingPOST(reviewedSettingRoleIdList, this.afterSearchReviewedSettingDto)
                                .then(() => {//儲存成功
                                    MessageUtil.messageSuccess(this.$t("global_save_success").toString());
                                })
                                .catch((err) => {//儲存失敗
                                    ErrorModalUtil.modalError(this.$t("global_save_failed").toString());
                                });
                            if (onPageChangeFlag) {
                                Modal.info(
                                    {
                                        class: "error-modal-util-class",
                                        title: () => this.$t("global_information").toString(),//提示訊息
                                        content: () => this.$t("reviewSP_reviewItem_set_reviewableSetting_not").toString(),//簽核項目尚未設定覆核者
                                        onOk: async () => {
                                            //切換到可以覆核設定頁面
                                            await MenuItemsModule.updateReviewableSettingActionSearchDto(this.afterSearchReviewedSettingDto);
                                            MenuItemsModule.updateTabActiveKey("2");

                                        }
                                    }
                                )

                            }
                        }


                    }
                    ,
                    onCancel: () => { },
                })
                    ;
            }
        }


    }


    onReviewedSettingCancel() {
        if(this.reviewSettingRolesMockData.length==0&&this.reviewSettingIdRole.length==0){
            return
        }else if(
            this.isSubmitDisabled&&(this.reviewSettingRolesMockData.length>0||this.reviewSettingIdRole.length>0)
        ){
            ErrorModalUtil.modalError(this.$t("reviewSetting_failed_click_search_again").toString());

        }else {
        this.onReviewedSettingSearch();
        }
    }


    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input) >= 0
        );
    }

    // =========================驗證篇Start=======================================================
    reviewedSettingValidateForm = {
        selectedReviewedSettingType: {
            hover: "",
            feedback: false,
            state: "",
            content: "",
        }, selectedReviewedType: {
            hover: "",
            feedback: false,
            state: "",
            content: "",
        },
        selectedReviewedSubType: {
            hover: "",
            feedback: false,
            state: "",
            content: "",
        }
    }
    /*
    * 搜尋時覆核類型不可為空白。
    * @param rule 驗證規則 
    * @param value 複合類型輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateSelectedselectedReviewedSettingType(rule, value, callback) {

        this.reviewedSettingValidateForm.selectedReviewedSettingType.feedback = true;
        this.reviewedSettingValidateForm.selectedReviewedSettingType.hover = "";
        if (value != null && value != "") {
            this.reviewedSettingValidateForm.selectedReviewedSettingType.state = "success";
            this.reviewedSettingValidateForm.selectedReviewedSettingType.feedback = false;
            callback();

        } else {

            this.reviewedSettingValidateForm.selectedReviewedSettingType.hover = "hover";
            this.reviewedSettingValidateForm.selectedReviewedSettingType.state = "error";
            this.reviewedSettingValidateForm.selectedReviewedSettingType.content = this.$t("reviewSP_reviewSettingType_not_blank").toString(); //覆核類型不可為空
            callback(false);
        }
    }
    /*
   * 搜尋時覆核主類型不可為空白。
   * @param rule 驗證規則 
   * @param value 覆合主類型輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
    validateSelectedselectedReviewedType(rule, value, callback) {

        this.reviewedSettingValidateForm.selectedReviewedType.feedback = true;
        this.reviewedSettingValidateForm.selectedReviewedType.hover = "";
        if (value != null && value != "") {
            this.reviewedSettingValidateForm.selectedReviewedType.state = "success";
            this.reviewedSettingValidateForm.selectedReviewedType.feedback = false;
            callback();

        } else {
            this.reviewedSettingValidateForm.selectedReviewedType.hover = "hover";
            this.reviewedSettingValidateForm.selectedReviewedType.state = "error";
            this.reviewedSettingValidateForm.selectedReviewedType.content = this.$t("reviewSP_reviewMajorType_not_blank").toString();//覆核主類型不可為空
            callback(false);
        }
    }
    /*
        * 搜尋時覆核子類型不可為空白。
        * @param rule 驗證規則 
        * @param value 覆核子類型輸入值 
        * @param callback 回乎函數，不帶參數表示驗證成功。
        * @returns 
        */
    validateSelectedselectedReviewedSubType(rule, value, callback) {

        this.reviewedSettingValidateForm.selectedReviewedSubType.feedback = true;
        this.reviewedSettingValidateForm.selectedReviewedSubType.hover = "";
        if (value != null && value != "") {
            this.reviewedSettingValidateForm.selectedReviewedSubType.state = "success";
            this.reviewedSettingValidateForm.selectedReviewedSubType.feedback = false;
            callback();

        } else {
            this.reviewedSettingValidateForm.selectedReviewedSubType.hover = "hover";
            this.reviewedSettingValidateForm.selectedReviewedSubType.state = "error";
            this.reviewedSettingValidateForm.selectedReviewedSubType.content = this.$t("reviewSP_reviewSubType_not_blank").toString(); //覆核次類別不可為空

            callback(false);
        }
    }
    //用來排除popOver不知名彈跳bug
    isreviewedSettingValidateVisible: boolean = false;
    isReviewedTypeValidateVisible: boolean = false;
    isReviewedSubTypeValidateVisible: boolean = false;
    reviewedSettingValidateMouseOver() {
        if (this.reviewedSettingValidateForm.selectedReviewedSettingType.state == "error") {
            this.isreviewedSettingValidateVisible = true;
        } else {
            this.isreviewedSettingValidateVisible = false;
        }

    }

    reviewedTypeValidateMouseOver() {
        if (this.reviewedSettingValidateForm.selectedReviewedType.state == "error") {
            this.isReviewedTypeValidateVisible = true;
        } else {
            this.isReviewedTypeValidateVisible = false;
        }

    }

    reviewedSubTypeValidateMouseOver() {
        if (this.reviewedSettingValidateForm.selectedReviewedSubType.state == "error") {
            this.isReviewedSubTypeValidateVisible = true;
        } else {
            this.isReviewedSubTypeValidateVisible = false;
        }

    }

}