import { Vue, Component } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import moment from 'moment';
import validateUtil from '@/plugins/util/validateUtil';

 @Component({
    components: {
      Breadcrumb,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
  })
  export default class FormDemo extends Vue {
   /**
    * data
    */
  isAdd = false;

  showInputText = false;

  form = {
    date: undefined,
    timeOpen: undefined,
    transactionDate: undefined,
    singleSelect: undefined,
    multiSelect: [],
    rejectDesc: undefined,
    textDesc: '',
    numDesc: undefined,
    numDesc1: '1000',
    numDesc2: '100',
    numDesc3: '',
    textarea: undefined,
    addItem: undefined,
    inputDate: undefined,
  }

  formRules = {
    date: [
      {
        required: true,
        message: '請輸入日期',
        trigger: 'change',
      },
    ],
    singleSelect: [
      {
        required: true,
        message: '請選擇',
        trigger: 'blur',
      },
    ],
    textDesc: [{
      required: false,
      validator: this.validate,
      trigger: 'change',
    }],
    inputDate: [{
      required: false,
      validator: this.validateInputValue,
      trigger: 'blur',
    }],
  };

  items = [
    { label: 'a1', value: 0 },
    { label: 'a2', value: 1 },
    { label: 'ccc', value: 2 },
    { label: 'b1', value: 3 },
    { label: 'b2', value: 4 },
  ]

  selectOpen = false;

  timeOpen = false;

   /**
    * hook
    */
  created() {
    this.form.date = moment(new Date(), 'YYYY-MM-DD');
  }

   /**
    * methods
    */
  //  日期選取樣式
  // getCurrentStyle(current, today) {
  //   const style = { border: '', borderRadius: '' };
  //   if (current.date() === 1) {
  //     style.border = '1px solid #1890ff';
  //     style.borderRadius = '50%';
  //   }
  //   return style;
  // }

  // 多選下拉 - 全選
  selectALL() {
    this.form.multiSelect = this.items.map((item) => item.value);
  }

  // 多選下拉 - 清除
  clearALL() {
    this.form.multiSelect = [];
  }

  // 篩選器
  filterOption(input, option) {
    let keys = input.split(' ');
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      if (option.componentOptions.children[0].text.indexOf(keys[i]) >= 0) {
        count++;
      }
    }
    return count > 0;
    // return option.componentOptions.children[0].text.indexOf(input) >= 0;
    // return option.componentOptions.propsData.value == 'b';
  }

  // 新增選項
  addOptionItem() {
    if (validateUtil.isEmpty(this.form.addItem)) {
      return;
    }
    let index = this.items.length + 1;
    this.items.push({ label: this.form.addItem, value: index });
    this.form.multiSelect.push(index);
    this.isAdd = false;
    this.form.addItem = undefined;
  }

  validate(rule: any, value: any, callback: any) {
    if (value) {
      if (!new RegExp('[a-zA-Z]').test(this.form.textDesc)) {
        this.form.textDesc = undefined;
        callback();
      }
    } else {
      callback();
    }
  }

  validateInputValue(rule: any, value: any, callback: any) {
    if (value) {
      callback('2022/12/01~2022/12/31');
    } else {
      callback('2022/12/01~2022/12/31');
    }
  }
 }
