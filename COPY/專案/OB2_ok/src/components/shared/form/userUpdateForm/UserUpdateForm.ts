import difference from 'lodash/difference';
import { Vue, Component,Prop,Watch} from "vue-property-decorator";

@Component
export default class UserUpdateForm extends Vue {

    @Prop()
    mockData;

    @Prop()
    targetKeys;

    @Prop()
    isRoleEnable;

    rightTargetKeys = [];
    disabled: boolean = false;

    originalTargetKeys: string[];

    locale: object = {};
    leftColumns = [
        {
            dataIndex: 'title',
            title: this.$t("global_division").toString(), // 科別
        },
        {
            dataIndex: 'account',
            title: this.$t("roleSP_account").toString(), // 帳號
        },
        {
            dataIndex: 'name',
            title: this.$t("agentSP_userName").toString(), // 使用者姓名
        },{
            dataIndex: 'status',
            title: this.$t("userStatus").toString(), // 使用者狀態
        },


       
    ];
    rightColumns = [
        {
            dataIndex: 'title',
            title: this.$t("global_division").toString(), // 科別
        },
        {
            dataIndex: 'account',
            title: this.$t("roleSP_account").toString(), // 帳號
        },
        {
            dataIndex: 'name',
            title: this.$t("agentSP_userName").toString(), // 使用者姓名
        },{
            dataIndex: 'status',
            title: this.$t("userStatus").toString(), // 使用者狀態
        },
       
    ];

    created() {

        this.locale = {
            itemUnit: null,
            itemsUnit: null,
            notFoundContent: null,
            searchPlaceholder: this.$t("roleSP_input_unitNameAndUserId").toString(), //輸入角色id或者角色名稱
        };

        this.originalTargetKeys = this.mockData;
        this.rightTargetKeys = this.targetKeys;
    }

    onChange(nextTargetKeys: any) {
        this.rightTargetKeys = nextTargetKeys;
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

    public submit() {
        let retval = this.rightTargetKeys;
      
        return retval;
    }

    public cancel() {
        // this.$emit("formCancel");
        return true;
    }
}