import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';

import { ValidationRule } from 'ant-design-vue/types/form-model/form';

@Component({})
export default class MultiCheckInfoForm extends Vue {
  /**
  * props
  */
  @Prop()
  checkInfoFormTitle: string; // 表單標題

  @Prop()
  form: object; // 表單內容

  @Prop()
  formRules: ValidationRule; // 表單資訊

  @Prop()
  badgeKey: string; // badge要對應的key值

  /**
  * data
  */
  checkInfoForm: object; // 表單資訊

  /**
  * watch
  */
  @Watch('form', { immediate: true, deep: true })
  onChangeForm(val) {
    if (this.isEmpty(val)) {
      return;
    }

    this.checkInfoForm = val;

    // 日期格式轉換
    Object.entries(this.checkInfoFormTitle).forEach(([key, item], index) => {
      Object.entries(this.checkInfoForm[(item as any).value]).forEach(([formKey, formItem], formIndex) => {
        if (validateUtil.isEmpty((formItem as any).key)) {
          return;
        }
        // date 型別
        // if ((formItem as any).type === 'date') {
        //   (formItem as any).key = dateUtil.transform((formItem as any).key, false);
        // }
        // string型別，無時間格式
        if ((formItem as any).type === 'date') {
          (formItem as any).key = moment((formItem as any).key).format('YYYY/MM/DD');
        }
        // string型別，有時間格式
        if ((formItem as any).type === 'dateTime') {
          (formItem as any).key = moment((formItem as any).key).format('YYYY/MM/DD HH:mm:ss');
        }
      });
    });

    this.$forceUpdate();
  }

  /**
  * hook
  */
  created() {
    this.checkInfoForm = { ...this.form };
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 取得對應badge顏色
  getBadgeObject(data) {
    return this.$cfEnum.getObject(this.badgeKey, data);
  }
}
