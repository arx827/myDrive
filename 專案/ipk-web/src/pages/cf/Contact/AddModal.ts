import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class AddModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalAddInfoShow: boolean // modal開關

  /**
  * data
  */
  modalVisible = false // modal開關

  isSubmit = false; // 是否可點擊送出

  addFormRules: { [key: string]: ValidationRule[] } = { // 新增彈窗表單驗證
    productGroup: [],
    empDomain: [],
  };

  addForm = { // 新增彈窗 v-model綁定
    productGroup: undefined,
    empDomain: undefined,
    unitName: undefined,
    empName: undefined,
    tel: undefined,
  };

  // 下拉選單
  productGroup = [];

  /**
  * watch
  */
  @Watch('modalAddInfoShow')
  onChange(val) {
    this.modalVisible = val;
  }

  /**
  * hook
  */
  async created() {
    this.reset();

    // 取得下拉選單
    this.productGroup = await this.$cfCommon.getProductGroupOption(); // 產品群組
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAddModal;
  }

  /**
  * methods
  */
 // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 初始值
  reset() {
    this.addForm = {
      productGroup: undefined,
      empDomain: undefined,
      unitName: undefined,
      empName: undefined,
      tel: undefined,
    };
  }

  // 關閉modal
  closeAddModal(action) {
    // 清空驗證警示訊息
    this.$nextTick(() => {
      (this.$refs.formRef as any).clearValidate();
    });

    // 新增/修改成功時，關閉modal
    if (this.isEmpty(action)) {
      this.reset();
      this.$emit('closeAddModal');
      return;
    }

    // 點擊取消
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.reset();
        this.$emit('closeAddModal');
      },
    });
  }

  // 設定新增彈窗資料
  setAddInfo(val) {
    // 必填檢核條件
    this.addFormRules = {
      productGroup: [{ required: true, message: '請選擇產品群組', trigger: 'change' }],
      empDomain: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
    };
  }

  // 驗證是否可點擊送出
  validateSubmit() {
    let disabled = false;
    if (this.isEmpty(this.addForm.productGroup)
      || this.isEmpty(this.addForm.empDomain) || this.isEmpty(this.addForm.unitName)
      || this.isEmpty(this.addForm.empName) || this.isEmpty(this.addForm.tel)) {
      disabled = true;
    }
    return disabled;
  }

  // 新增前檢核
  validateBeforeAdd() {
    // 整理成後端格式
    let dto = {
      productGroup: this.addForm.productGroup,
      empDomain: this.addForm.empDomain,
    };

    // call API
    this.setLoading(true);
    this.$contactApi.checkBeforeAddUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.content;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        // 新增
        InfoModal.alertInfo({
          confirm: true,
          content: this.$commonMessageEnum.SUBMIT_CONFIRM_INFO?.message,
          onCallback: () => {
            this.addConfig();
          },
        });
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 新增申請
  addConfig() {
    // 整理成後端格式
    let dto = {
      productGroup: this.addForm.productGroup,
      empDomain: this.addForm.empDomain,
    };

    this.setLoading(true);
    this.$contactApi.addContactUsingPUT(dto)
      .then((res) => {
        const isSuccess = res.data.content;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        // 關閉modal
        this.closeAddModal(null);
        // 重新查詢
        this.$emit('handleSearch');
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 新增以前先查詢此員工資料
  findEmpBeforeAdd() {
    if (!this.addForm.empDomain) {
      return;
    }
    let dto = {
      productGroup: this.addForm.productGroup,
      empDomain: this.addForm.empDomain,
    };
    this.$contactApi.searchContactApiUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: '查無此聯繫人' });
          return;
        }
        this.addForm.unitName = content.unitName;
        this.addForm.empName = content.empName;
        this.addForm.tel = content.tel;
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 開始輸入後清空原本的資料
  resetEmpData() {
    this.addForm.unitName = null;
    this.addForm.empName = null;
    this.addForm.tel = null;
  }
}
