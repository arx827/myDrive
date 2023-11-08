import difference from 'lodash/difference';
import { Vue, Component, Prop } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import { GroupDtoEnableEnum } from "@fubonlife/obd-api-axios-sdk";
import { FunctionTransfer } from "@/components/shared/form/roleGroupForm/model";
import message from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";

@Component
export default class RoleUpdateForm extends Vue {

    @Prop()
    roleId: string;

    @Prop()
    isRoleEnable;

    // 目標資料 (右)
    targeFunctiontKeys: string[] = [];

    // 實際資料 (左)
    transferData: FunctionTransfer[] = [];

    // 穿梭框的語言項目
    locale: object = {};

    // 穿梭框 table 欄位
    functionColumn = [
        {
            dataIndex: 'title',
            title: this.$t('roleGF_groupCode').toString() // 功能代碼
        },
        {
            dataIndex: 'name',
            title: this.$t('roleGF_groupName').toString()    // 功能名稱
        },
        {
            dataIndex: 'status',
            title: this.$t('roleGF_groupStatus').toString()  // 功能狀態
        },
    ];

    created() {

        this.locale = {
            itemUnit: null,
            itemsUnit: null,
            notFoundContent: null,
            searchPlaceholder: this.$t('roleGF_searchPlaceholder').toString()    // 輸入功能代碼或者功能名稱
        };

        // 查詢 Transfer 左右框資料 
        this.loadAllGroup();
    }

    /**
     * 左右轉移
     * @param nextTargetKeys 
     */
    onChange(nextTargetKeys: any) {
        this.targeFunctiontKeys = nextTargetKeys;
    }

    //原本transfer套件用來左右轉換table內項目的方法
    getRowSelection({ selectedKeys, itemSelectAll, itemSelect }) {
        return {
            getCheckboxProps: item => ({ props: { disabled: !this.isRoleEnable || item.disabled } }),
            onSelectAll(selected, selectedRows) {
                const treeSelectedKeys = selectedRows
                    .filter(item => !item.disabled)
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

    /**
     * @description 查詢穿梭框左右的欄位資料
     * @version 2021/12/06
     * @author B1530
     */
    loadAllGroup() {

        LoadingUtil.show();
        // 查詢左邊所有群組資料
        const findAllGroups = this.$groupApi.findAllGroupdsIdUsingGET()
            .then((res) => {
                res.data.forEach(groupDto => {
                    this.transferData.push({
                        key: groupDto.id,
                        title: groupDto.id,
                        name: groupDto.name,
                        status: groupDto.enable == GroupDtoEnableEnum.Y ? this.$t('global_effective').toString() : this.$t('global_deactivate').toString()
                    });
                });

            }).catch((err) => {
                ErrorModalUtil.modalError("取得全部功能群組Dto失敗：" + err);
            });

        // 查詢右邊已設定的群組資料
        Promise.all([findAllGroups]).then((resolve) => {
            this.$groupApi.findGroupIdsByRoleIdUsingGET(this.roleId)
                .then((res: AxiosResponse<string[]>) => {
                    this.targeFunctiontKeys = res.data;
                }).catch((err) => {
                    ErrorModalUtil.modalError("透過roleId取得功能群組id失敗：" + err);
                });
        }).catch((err) => {
            ErrorModalUtil.modalError("查詢右邊已設定的群組資料失敗：" + err);
        }).finally(() => {
            LoadingUtil.close();
        });
    }

    /**
     * 異動群組送出
     * @returns 
     */
    public submit() {

        if (this.isRoleEnable) {
            LoadingUtil.show();
            this.$groupApi.modifyGroupsIdByRoleIdUsingPOST({
                roleId: this.roleId,
                groupIds: this.targeFunctiontKeys
            }).then(() => {

                LoadingUtil.close();
                message.messageSuccess(this.$t('roleGF_roleGroupChangeSuccess').toString());   // 角色功能異動成功
                this.$emit("roleGroupSubmit", false);

            }).catch((err) => {
                //角色群組異動失敗
                ErrorModalUtil.modalError(this.$t('roleSP_roleGoupModifyFailed').toString() + err);
                message.messageError(this.$t(err.response.data.apiErrorCode).toString());
            }).finally(() => {
                LoadingUtil.close();
            });
        } else {
            //已停用的角色無法進行授權異動
            ErrorModalUtil.modalError(this.$t('roleSP_disableRoleCannotModify').toString())
        }
    }
}