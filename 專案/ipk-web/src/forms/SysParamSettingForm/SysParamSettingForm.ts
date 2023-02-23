import {
 Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import ThirdLayerForm from '@/forms/ThirdLayerForm/ThirdLayerForm.vue';
import { SysParamSettingFormModel } from '@/forms/SysParamSettingForm/model';

@Component({
  components: {
    ThirdLayerForm,
  },
})
export default class SysParamSettingForm extends Vue {
  @Prop() public initData: any;

  @Prop() public loading: boolean;

  @Prop() public type: string;

  form: SysParamSettingFormModel = null;

  checked = false;

  continueAdd = false;

  thirdLayerVisible = false;

  title = '第三層選單';

  get isEditing(): boolean {
    return !!this.initData && !!this.initData.id;
  }

  created(): void {
    this.reset();
  }

  @Watch('initData')
  onInitDataChanged(): void {
    this.reset();
  }

  reset() {
    if (this.initData) {
      this.form = JSON.parse(JSON.stringify(this.initData));
      console.log(this.continueAdd);
      this.continueAdd = false;
    } else {
      this.form = null;
    }
  }

  public submit() {
    const value = {
      paramGroup: this.form.paramGroup,
      paramId: this.form.paramId,
      paramName: this.form.paramName,
      paramValue: this.form.paramValue,
      memo: this.form.memo,
    };
    if (this.type === 'modify') {
      this.$emit('submitModify', {
        value,
        isEditing: this.isEditing,
        initData: this.initData,
      });
    } else if (this.type === 'add') {
      this.$emit('submitAdd', {
        value,
        isEditing: this.isEditing,
        initData: this.initData,
        formVisible: this.continueAdd,
      });
    }
    console.log(this.form);
  }

  public cancel() {
    this.$emit('formCancel');
  }

  setParamGroup(e) {
    this.form.paramGroup = e;
    this.thirdLayerVisible = false;
  }
}
