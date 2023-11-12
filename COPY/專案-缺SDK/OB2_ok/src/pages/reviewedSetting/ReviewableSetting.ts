import { Vue, Component, Watch } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import moment from 'moment';
import { AxiosResponse } from "axios";
import ReviewSettingUpdate from "@/components/shared/form/reviewSettingUpdateForm/ReviewSettingUpdateForm.vue";
import { ReviewSubTypeDto, RoleInfoDto, Option, ReviewSettingCreation, ReviewSettingCreationTypeEnum } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { Modal } from "ant-design-vue";
import { MenuItemsModule } from "@/plugins/store/MenuItemsModule";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue"; 
@Component({
    components: {
        ReviewSettingUpdate,HiddenFolde
    }
})
export default class ReviewSetting extends Vue {
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
    reviewSettingSearchForm = {
        selectedReviewSettingType: "",
        selectedReviewType: "",
        selectedReviewSubType: "",
    };
    //上方搜尋Dto
    afterSearchReviewSettingDto: ReviewSettingCreation = {

    }

    reviewTypeDisable: boolean = false;
    reviewSubTypeDisable: boolean = false;
    thirdMenuId: string = "";

    majorTypeAndSubTypeMap = new Map<string, ReviewSubTypeDto[]>();


    async created() {
        await this.initSearchOptions();
        //從被覆核設定傳搜尋結果至vuex這裡接收其收尋結果
        if (MenuItemsModule.reviewableSettingSearchDto$ != null) {
            this.afterSearchReviewSettingDto = MenuItemsModule.reviewableSettingSearchDto$;
            this.reviewSettingSearchForm.selectedReviewSettingType = MenuItemsModule.reviewableSettingSearchDto$.type;
            
            await this.onReviewSettingTypeChange();
            this.reviewSettingSearchForm.selectedReviewType = MenuItemsModule.reviewableSettingSearchDto$.reviewTypeId;
            if (this.reviewSettingSearchForm.selectedReviewType != null && this.reviewSettingSearchForm.selectedReviewType != "") {
                this.validateSelectedselectedReviewType(null,this.reviewSettingSearchForm.selectedReviewType,()=>{});
                await this.onReviewTypeChange();
            }
            this.reviewSettingSearchForm.selectedReviewSubType = MenuItemsModule.reviewableSettingSearchDto$.reviewSubTypeId;
            if(this.reviewSettingSearchForm.selectedReviewSubType!= null &&this.reviewSettingSearchForm.selectedReviewSubType!= ""){
            this.validateSelectedselectedReviewSubType(null,this.reviewSettingSearchForm.selectedReviewSubType,()=>{});
            }
            this.isSubmitDisabled = false;
            
            
            this.reload();
        }

    }


    /**@author B1530 
     * @version 2022/01/14 
     * 初始化上方下拉選單
     */
    async initSearchOptions() {
        //覆核類別下拉選單
        await this.$commonApi.findByTypeIdWithStatusUsingPOST("MAJOR_TYPE")
            .then((resp) => {
                this.reviewSettingOptions = this.reviewSettingOptions.concat(resp.data);
            }).catch((err) => {//取得覆核主類型下拉選單失敗
                ErrorModalUtil.modalError(this.$t("reviewSP_reviewSettingType_Options_Failed").toString())
            })
        //覆核主類別下拉選單
        await this.$reviewedSettingApi.getAllReviewTypeUsingGET1()
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
        //覆核子類別下拉選單

        await this.$reviewedSettingApi.getAllReviewSubTypeUsingGET1()
            .then((resp) => {

                const object = resp.data.majorTypeSubTypeMapping;
                for (let key in object) {
                    this.majorTypeAndSubTypeMap.set(key, object[key]);
                }
            }).catch((err) => {//取得覆核子類型下拉選單失敗
                ErrorModalUtil.modalError(this.$t("reviewSP_reviewSubjectType_Options_Failed").toString())
            })


    }

    async onReviewSettingTypeChange() {
        this.isSubmitDisabled = true;
        this.reviewSettingValidateForm.selectedReviewSettingType.state = "";
        this.reviewSettingValidateForm.selectedReviewSettingType.hover = "";
        this.reviewSettingValidateForm.selectedReviewType.state = "";
        this.reviewSettingValidateForm.selectedReviewType.hover = "";
        this.reviewSettingValidateForm.selectedReviewSubType.state = "";
        this.reviewSettingValidateForm.selectedReviewSubType.hover = "";
        if (this.reviewSettingSearchForm.selectedReviewSettingType == "") {
            this.reviewTypeDisable = false;
            this.reviewSubTypeDisable = false;
            this.reviewSettingSearchForm.selectedReviewType = "";
            this.reviewSettingSearchForm.selectedReviewSubType = "";
            this.reviewTypeOptions = this.iniaReviewTypeOptions;
            this.reviewSubTypeOptions = [
            ];
            
        } else if (this.reviewSettingSearchForm.selectedReviewSettingType == "PC" || this.reviewSettingSearchForm.selectedReviewSettingType == "SUSPECTIVE" || this.reviewSettingSearchForm.selectedReviewSettingType == "IMPAIRMENT") {
            this.reviewSettingSearchForm.selectedReviewSubType = "";
            this.reviewSettingSearchForm.selectedReviewType = "";
            this.reviewSettingValidateForm.selectedReviewType.state = "";
            this.reviewSettingValidateForm.selectedReviewSubType.state = "";
            this.reviewTypeDisable = true;
            this.reviewSubTypeDisable = true;
        }
        else {
            this.reviewTypeDisable = false;
            this.reviewSubTypeDisable = false;
            this.reviewSettingSearchForm.selectedReviewType = "";
            this.reviewSettingSearchForm.selectedReviewSubType = "";
            this.reviewSubTypeOptions=[];
            this.reviewTypeOptions = [

            ]
            this.originalReviewType.filter(
                e => e.type == this.reviewSettingSearchForm.selectedReviewSettingType
            ).forEach(e => {
                this.reviewTypeOptions.push({
                    label: e.description,
                    value: e.reviewTypeId
                })
            })
        }
    }

    async onReviewTypeChange() {
        this.isSubmitDisabled = true;
        this.reviewSubTypeDisable = false;
        this.reviewSettingValidateForm.selectedReviewType.state = "";
        this.reviewSettingValidateForm.selectedReviewType.hover = "";
        if (this.reviewSettingSearchForm.selectedReviewType == "") {
            this.reviewSettingSearchForm.selectedReviewSettingType = "";
            this.reviewSettingSearchForm.selectedReviewSubType = "";
            this.reviewSubTypeOptions = [

            ];
        } else {
            if (this.reviewSettingSearchForm.selectedReviewType == "5" || this.reviewSettingSearchForm.selectedReviewType == "4") {
                this.reviewSubTypeDisable = true;
                this.reviewSettingValidateForm.selectedReviewSubType.state = "";
                this.reviewSettingValidateForm.selectedReviewSubType.hover = "";
            }
            this.reviewSettingSearchForm.selectedReviewSubType = null;
            this.reviewSettingValidateForm.selectedReviewSettingType.state = "";

            //取得照會 會辦等類別
            const slectedtype = this.originalReviewType
                .filter(e => e.reviewTypeId == this.reviewSettingSearchForm.selectedReviewType)
                .map(e => e.type)[0];

            this.reviewSettingSearchForm.selectedReviewSettingType = slectedtype;
            //建立子類型Options
            this.reviewSubTypeOptions = [];
            this.majorTypeAndSubTypeMap.get(this.reviewSettingSearchForm.selectedReviewType).forEach(
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
        this.reviewSettingValidateForm.selectedReviewSubType.state = "";
        this.reviewSettingValidateForm.selectedReviewSubType.hover = "";
    }

    /**
     * 上方按下搜尋後進行驗證和賦值
     */
    onReviewSettingSearch() {
        this.isSubmitDisabled = false;
        this.validateSelectedselectedReviewSettingType(null, this.reviewSettingSearchForm.selectedReviewSettingType, () => { });

        if (!this.reviewTypeDisable) {
            this.validateSelectedselectedReviewType(null, this.reviewSettingSearchForm.selectedReviewType, () => { });
        } else {
            this.reviewSettingValidateForm.selectedReviewType.state = "success"
            this.reviewSettingValidateForm.selectedReviewType.feedback = false
        }
        if (!this.reviewSubTypeDisable) {
            this.validateSelectedselectedReviewSubType(null, this.reviewSettingSearchForm.selectedReviewSubType, () => { });
        } else {
            this.reviewSettingValidateForm.selectedReviewSubType.state = "success"
            this.reviewSettingValidateForm.selectedReviewSubType.feedback = false
        }
        const isValidReviewSettingType: boolean = this.reviewSettingValidateForm.selectedReviewSettingType.state == "success" ? true : false;
        const isValidreviewType: boolean = this.reviewSettingValidateForm.selectedReviewType.state == "success" ? true : false;
        const isValidreviewSubTyp: boolean = this.reviewSettingValidateForm.selectedReviewSubType.state == "success" ? true : false;

        //假設驗證成功才可以送出
        if (
            isValidReviewSettingType
            && isValidreviewType
            && isValidreviewSubTyp
        ) {
            if (this.reviewSettingSearchForm.selectedReviewSettingType == "NOTI") {
                this.afterSearchReviewSettingDto.type = ReviewSettingCreationTypeEnum.NOTI
            } else if (this.reviewSettingSearchForm.selectedReviewSettingType == "INF") {
                this.afterSearchReviewSettingDto.type = ReviewSettingCreationTypeEnum.INF
            } else if (this.reviewSettingSearchForm.selectedReviewSettingType == "PC") {
                this.afterSearchReviewSettingDto.type = ReviewSettingCreationTypeEnum.PC
            } else if (this.reviewSettingSearchForm.selectedReviewSettingType == "SUSPECTIVE") {
                this.afterSearchReviewSettingDto.type = ReviewSettingCreationTypeEnum.SUSPECTIVE
            }else if (this.reviewSettingSearchForm.selectedReviewSettingType == "IMPAIRMENT") {
                this.afterSearchReviewSettingDto.type = ReviewSettingCreationTypeEnum.IMPAIRMENT
            }else {
                this.afterSearchReviewSettingDto.type = null;
            }
            this.afterSearchReviewSettingDto.reviewTypeId = this.reviewSettingSearchForm.selectedReviewType;
            this.afterSearchReviewSettingDto.reviewSubTypeId = this.reviewSettingSearchForm.selectedReviewSubType;
            
            this.reload();

        }

    }
    validRolesId = [];
    /** @author B1530
     *  @version 2022/01/14  
     *  render下方Transfer資料源
     */
    async reload() {

        if (this.reviewSettingSearchForm.selectedReviewSettingType !== "") {

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
                })

        }
        // 根據上方搜尋條件找到其roleIds
        await this.$reviewSettingApi.findRolesIdByReviewSettingTermsUsingPOST(this.afterSearchReviewSettingDto)
            .then((res) => {
                let reviewRolesSet = res.data;
                let tempararyReviewSettingRoles = [];
                reviewRolesSet.filter(roleId => this.validRolesId.includes(roleId)).forEach(i =>
                    tempararyReviewSettingRoles.push(
                        i
                    )
                )
                this.reviewSettingIdRole = tempararyReviewSettingRoles
            }).catch(error => {

                ErrorModalUtil.modalError(this.$t("reviewSP_unauthorized_roles_failed").toString());//取得所有有效角色失敗
            }).finally(() => {
                LoadingUtil.close();
            });
    }
    isSubmitDisabled: boolean = true;
    /*
    * 儲存
    */
    async onRoleFormSubmit() {
        if (this.isSubmitDisabled || this.reviewSettingValidateForm.selectedReviewType.state == "error" || this.reviewSettingValidateForm.selectedReviewSubType.state == "error") {

            ErrorModalUtil.modalError(this.$t("reviewSetting_failed_click_search_again").toString());
        } else {
            if (this.afterSearchReviewSettingDto.type != null && this.reviewSettingValidateForm.selectedReviewType.state != "error" && this.reviewSettingValidateForm.selectedReviewSubType.state != "error") {
                Modal.confirm({
                    title: this.$t('global_save'), //儲存
                    content: this.$t('global_confirmSave').toString() + '？', //資料無誤，確認執行儲存
                    okText: this.$t('global_ok').toString(), //確認
                    cancelText: this.$t('global_cancel').toString(),  //取消
                    icon: 'warning',
                    onOk: async () => {
                        let reviewSettingRoleIdList: Array<string> = [];
                        reviewSettingRoleIdList = await (this.$refs.roleUpdate as any).submit();
                        if (reviewSettingRoleIdList.length == 0) {
                            reviewSettingRoleIdList = [null];
                        }
                        this.$reviewSettingApi.updateReviewSettingByRoleIdsUsingPOST(reviewSettingRoleIdList, this.afterSearchReviewSettingDto)
                            .then(() => {
                                MessageUtil.messageSuccess(this.$t("global_save_success").toString()); //儲存成功
                            })
                            .catch((err) => {
                                ErrorModalUtil.modalError(this.$t("global_save_failed").toString());//儲存失敗
                            });


                        this.reload();

                    },
                    onCancel: () => { },
                })
                    ;
            }
        }


    }

    onReviewSettingCancel(){
        if(this.reviewSettingRolesMockData.length==0&&this.reviewSettingIdRole.length==0){
            return
        }else if(
            this.isSubmitDisabled&&(this.reviewSettingRolesMockData.length>0||this.reviewSettingIdRole.length>0)
        ){
            ErrorModalUtil.modalError(this.$t("reviewSetting_failed_click_search_again").toString());

        }else {
        this.onReviewSettingSearch();
        }
    }


    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input) >= 0
        );
    }

    // =========================驗證篇Start=======================================================
    reviewSettingValidateForm = {
        selectedReviewSettingType: {
            hover: "",
            feedback: false,
            state: "",
            content: "",
        }, selectedReviewType: {
            hover: "",
            feedback: false,
            state: "",
            content: "",
        },
        selectedReviewSubType: {
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
    validateSelectedselectedReviewSettingType(rule, value, callback) {

        this.reviewSettingValidateForm.selectedReviewSettingType.feedback = true;
        this.reviewSettingValidateForm.selectedReviewSettingType.hover = "";
        if (value != null && value != "") {
            this.reviewSettingValidateForm.selectedReviewSettingType.state = "success";
            this.reviewSettingValidateForm.selectedReviewSettingType.feedback = false;
            callback();

        } else {

            this.reviewSettingValidateForm.selectedReviewSettingType.hover = "hover";
            this.reviewSettingValidateForm.selectedReviewSettingType.state = "error";
            this.reviewSettingValidateForm.selectedReviewSettingType.content = this.$t("reviewSP_reviewSettingType_not_blank").toString(); //覆核類型不可為空
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
    validateSelectedselectedReviewType(rule, value, callback) {

        this.reviewSettingValidateForm.selectedReviewType.feedback = true;
        this.reviewSettingValidateForm.selectedReviewType.hover = "";
        if (value != null && value != "") {
            this.reviewSettingValidateForm.selectedReviewType.state = "success";
            this.reviewSettingValidateForm.selectedReviewType.feedback = false;
            callback();

        } else {
            this.reviewSettingValidateForm.selectedReviewType.hover = "hover";
            this.reviewSettingValidateForm.selectedReviewType.state = "error";
            this.reviewSettingValidateForm.selectedReviewType.content = this.$t("reviewSP_reviewMajorType_not_blank").toString();//覆核主類型不可為空
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
    validateSelectedselectedReviewSubType(rule, value, callback) {

        this.reviewSettingValidateForm.selectedReviewSubType.feedback = true;
        this.reviewSettingValidateForm.selectedReviewSubType.hover = "";
        if (value != null && value != "") {
            this.reviewSettingValidateForm.selectedReviewSubType.state = "success";
            this.reviewSettingValidateForm.selectedReviewSubType.feedback = false;
            callback();

        } else {
            this.reviewSettingValidateForm.selectedReviewSubType.hover = "hover";
            this.reviewSettingValidateForm.selectedReviewSubType.state = "error";
            this.reviewSettingValidateForm.selectedReviewSubType.content = this.$t("reviewSP_reviewSubType_not_blank").toString(); //覆核子類型不可為空
            callback(false);
        }
    }
    //用來排除popOver不知名彈跳bug
    isreviewSettingValidateVisible: boolean = false;
    isReviewTypeValidateVisible: boolean = false;
    isReviewSubTypeValidateVisible: boolean = false;
    reviewSettingValidateMouseOver() {
        if (this.reviewSettingValidateForm.selectedReviewSettingType.state == "error") {
            this.isreviewSettingValidateVisible = true;
        } else {
            this.isreviewSettingValidateVisible = false;
        }

    }

    reviewTypeValidateMouseOver() {
        if (this.reviewSettingValidateForm.selectedReviewType.state == "error") {
            this.isReviewTypeValidateVisible = true;
        } else {
            this.isReviewTypeValidateVisible = false;
        }

    }

    reviewSubTypeValidateMouseOver() {
        if (this.reviewSettingValidateForm.selectedReviewSubType.state == "error") {
            this.isReviewSubTypeValidateVisible = true;
        } else {
            this.isReviewSubTypeValidateVisible = false;
        }

    }

}