import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';
import { BatchSettingEditDto } from '@fubonlife/ipk-api-axios-sdk';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
})
export default class AddAndEditModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalAddInfoShow: boolean // modal開關

  @Prop()
  batchEditInfo: any // 新增修改資訊

  @Prop()
	childrenTab: any; // 子頁籤對應key值

  /**
  * data
  */
  modalVisible = false // modal開關

  modalTitle = '' // modal標題

  activeKey = '1' // 排程設定tabKey

  activeCollapseKey = '1' // 排程設定-時分秒框-開闔Key

  showSearchType = '' // 模糊查詢規則，預設空白

  editFormRules: { [key: string]: ValidationRule[] } = { // 新增彈窗表單驗證
    jobDesc: [],
    qrtzUrl: [],
    isExecutable: [],
    cronTrigger: [],
  };

  editForm = { // 修改彈窗 v-model綁定
    jobDesc: null,
    jobName: null,
    qrtzUrl: null,
    isExecutable: null,
    cronTrigger: null,
    cronTriggerName: null,
  };

  // 排程選項
  result = {
    month: {
      optionValue: '',
      rangeStart: 1,
      rangeEnd: 1,
      periodStart: 1,
      periodEnd: 1,
      specified: [],
    },
    day: {
      optionValue: '',
      periodStart: 1,
      periodEnd: 1,
      specified: [],
    },
    week: {
      optionValue: '',
      periodStart: '1',
      periodEnd: 1,
      specified: [],
    },
    hour: {
      optionValue: '',
      rangeStart: 0,
      rangeEnd: 1,
      periodStart: 0,
      periodEnd: 1,
      specified: [],
    },
    minute: {
      optionValue: '',
      rangeStart: 0,
      rangeEnd: 1,
      periodStart: 0,
      periodEnd: 1,
      specified: [],
    },
    second: {
      optionValue: '',
      periodStart: 10,
      periodEnd: 20,
      specified: [],
    },
  }

  // 週排程選項
  weekCheckOptionList = []

  // 月排程選項
  monthOptionList = []

  // 日排程選項
  dayOptionList = []

  // 時數排程選項
  hourOptionList = []

  // 分鐘排程選項
  minuteOptionList = []

  // 秒數排程選項
  secondOptionList = []

  // 修改前的排程描述
  beforeTriggerNameList = {
    month: '',
    week: '',
    day: '',
    hour: '',
    minute: '',
    second: '',
  }

  // 修改後的排程描述
  afterTriggerNameList = {
    month: '',
    week: '',
    day: '',
    hour: '',
    minute: '',
    second: '',
  }

  /**
  * computed
  */

  // 將前端設定"月排程"轉為cron表達式
  get monthsText() {
    let months = '';
    let value = this.result.month.optionValue || '';
    switch (value.toString()) {
      case this.$actEnum.numberConstant.ONE:
        months = '*';
        break;
      case this.$actEnum.numberConstant.TWO:
        months = `${this.result.month.rangeStart}-${this.result.month.rangeEnd}`;
        break;
      case this.$actEnum.numberConstant.THREE:
        months = `${this.result.month.periodStart}/${this.result.month.periodEnd}`;
        break;
      case this.$actEnum.numberConstant.FOUR:
        this.result.month.specified.sort().map((val) => {
          months += `${val},`;
        });
        months = months.slice(0, -1);
        break;
    }
    return months;
  }

  // 將前端設定"日排程"轉為cron表達式
  get daysText() {
    let days = '';
    let value = this.result.day.optionValue || '';
    switch (value.toString()) {
      case this.$actEnum.numberConstant.ONE:
        days = '*';
        break;
      case this.$actEnum.numberConstant.TWO:
        days = `${this.result.day.periodStart}/${this.result.day.periodEnd}`;
        break;
      case this.$actEnum.numberConstant.THREE:
        days = 'L';
        break;
      case this.$actEnum.numberConstant.FOUR:
        this.result.day.specified.sort().map((val) => {
          days += `${val},`;
        });
        days = days.slice(0, -1);
        break;
      case this.$actEnum.numberConstant.FIVE:
      case this.$actEnum.numberConstant.SIX:
        days = '?';
        break;
    }
    return days;
  }

  // 將前端設定"週排程"轉為cron表達式
  get weeksText() {
    let weeks = '';
    let value = this.result.day.optionValue || '';
    switch (value.toString()) {
      case this.$actEnum.numberConstant.ONE:
      case this.$actEnum.numberConstant.TWO:
      case this.$actEnum.numberConstant.THREE:
      case this.$actEnum.numberConstant.FOUR:
        weeks = '?';
        break;
      case this.$actEnum.numberConstant.FIVE:
        weeks = `${this.result.week.periodStart}/${this.result.week.periodEnd}`;
        break;
      case this.$actEnum.numberConstant.SIX:
        this.result.week.specified.sort().map((val) => {
          weeks += `${val},`;
        });
        weeks = weeks.slice(0, -1);
        break;
    }
    return weeks;
  }

  // 將前端設定"時數"轉為cron表達式
  get hoursText() {
    let hours = '';
    let value = this.result.hour.optionValue || '';
    switch (value.toString()) {
      case this.$actEnum.numberConstant.ONE:
        hours = '*';
        break;
      case this.$actEnum.numberConstant.TWO:
        hours = `${this.result.hour.rangeStart}-${this.result.hour.rangeEnd}`;
        break;
      case this.$actEnum.numberConstant.THREE:
        hours = `${this.result.hour.periodStart}/${this.result.hour.periodEnd}`;
        break;
      case this.$actEnum.numberConstant.FOUR:
        this.result.hour.specified.sort().map((val) => {
          hours += `${val},`;
        });
        hours = hours.slice(0, -1);
        break;
    }
    return hours;
  }

  // 將前端設定"分鐘數"轉為cron表達式
  get minutesText() {
    let minutes = '';
    let value = this.result.minute.optionValue || '';
    switch (value.toString()) {
      case this.$actEnum.numberConstant.ONE:
        minutes = '*';
        break;
      case this.$actEnum.numberConstant.TWO:
        minutes = `${this.result.minute.rangeStart}-${this.result.minute.rangeEnd}`;
        break;
      case this.$actEnum.numberConstant.THREE:
        minutes = `${this.result.minute.periodStart}/${this.result.minute.periodEnd}`;
        break;
      case this.$actEnum.numberConstant.FOUR:
        this.result.minute.specified.sort().map((val) => {
          minutes += `${val},`;
        });
        minutes = minutes.slice(0, -1);
        break;
    }
    return minutes;
  }

  // 將前端設定"秒數"轉為cron表達式
  get secondsText() {
    let seconds = '';
    let value = this.result.second.optionValue || '';
    switch (value.toString()) {
      case this.$actEnum.numberConstant.ONE:
        seconds = `${this.result.second.periodStart}/${this.result.second.periodEnd}`;
        break;
      case this.$actEnum.numberConstant.TWO:
        this.result.second.specified.sort().map((val) => {
          seconds += `${val},`;
        });
        seconds = seconds.slice(0, -1);
        break;
    }
    return seconds;
  }

  // 取得轉換後的cron表達式
  get cron() {
    return `${this.secondsText || '0'} ${this.minutesText || '0'} ${this.hoursText || '0'} ${this.daysText || '*'} ${this.monthsText || '*'} ${this.weeksText || '?'}`;
  }

  // 異動前排程描述
  get beforeCronTriggerName() {
    return `${this.beforeTriggerNameList.month || ''} ${this.beforeTriggerNameList.week || ''} ${this.beforeTriggerNameList.day || ''}  ${this.beforeTriggerNameList.hour || ''} ${this.beforeTriggerNameList.minute || ''} ${this.beforeTriggerNameList.second || ''} 觸發排程`;
  }

  // 異動後排程描述
  get afterCronTriggerName() {
    return `${this.afterTriggerNameList.month || ''} ${this.afterTriggerNameList.week || ''} ${this.afterTriggerNameList.day || ''}  ${this.afterTriggerNameList.hour || ''} ${this.afterTriggerNameList.minute || ''} ${this.afterTriggerNameList.second || ''} 觸發排程`;
  }

  /**
  * watch
  */
  @Watch('modalAddInfoShow')
  onChange(val) {
    this.modalVisible = val;
  }

  // 設定修改資料
  @Watch('batchEditInfo', { immediate: true, deep: true })
  onValChange(val) {
    this.modalTitle = this.$actEnum.constant.MODIFY.key;
    this.setEditInfo(val);
  }

  // 如果修改排程彈窗打開後，解析cron表達式
  @Watch('modalVisible')
  onVisibleChange(val) {
    if (val) {
      let cronTrigger = this.editForm.cronTrigger;
      if (cronTrigger) {
        this.secondsReverseExp(cronTrigger, this.beforeTriggerNameList);
        this.minutesReverseExp(cronTrigger, this.beforeTriggerNameList);
        this.hoursReverseExp(cronTrigger, this.beforeTriggerNameList);
        this.daysReverseExp(cronTrigger, this.beforeTriggerNameList);
        this.daysReverseExp(cronTrigger, this.beforeTriggerNameList);
        this.monthsReverseExp(cronTrigger, this.beforeTriggerNameList);
      }
    }
  }

  // 取得異動後的排程
  @Watch('cron')
  onTriggerChange(val) {
    if (val) {
      let cronTrigger = val;
      if (cronTrigger) {
        this.secondsReverseExp(cronTrigger, this.afterTriggerNameList);
        this.minutesReverseExp(cronTrigger, this.afterTriggerNameList);
        this.hoursReverseExp(cronTrigger, this.afterTriggerNameList);
        this.daysReverseExp(cronTrigger, this.afterTriggerNameList);
        this.daysReverseExp(cronTrigger, this.afterTriggerNameList);
        this.monthsReverseExp(cronTrigger, this.afterTriggerNameList);
      }
    }
  }

  /**
  * hook
  */
  created() {
    this.resetOption();
    this.weekCheckOptionList = this.$actEnum.weekCheckOptionList;
    this.monthOptionList = this.setMonthOptionList();
    this.dayOptionList = this.setDayOptionList();
    this.hourOptionList = this.setHourOptionList();
    this.minuteOptionList = this.setSecOrMinOptionList();
    this.secondOptionList = this.setSecOrMinOptionList();
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeEditBatchModal;
  }

  /**
  * methods
  */
  // 若排程會跨日，則將預設值修改為不會跨日的值
  setValueBelowMaxValue(date, start, end, maxVal) {
    // 若起始值與結尾值加總超過最大值，則將結尾值修改為最大值減去起始值
    let result = this.result[date];
    if ((Number(result[start]) + Number(result[end])) > maxVal) {
      result[end] = maxVal - result[start];
    }
   }

  // 重整資料
  resetOption() {
    this.result = {
      month: {
        optionValue: '',
        rangeStart: 1,
        rangeEnd: 1,
        periodStart: 1,
        periodEnd: 1,
        specified: [],
      },
      day: {
        optionValue: '',
        periodStart: 1,
        periodEnd: 1,
        specified: [],
      },
      week: {
        optionValue: '',
        periodStart: '1',
        periodEnd: 1,
        specified: [],
      },
      hour: {
        optionValue: '',
        rangeStart: 0,
        rangeEnd: 1,
        periodStart: 0,
        periodEnd: 1,
        specified: [],
      },
      minute: {
        optionValue: '',
        rangeStart: 0,
        rangeEnd: 1,
        periodStart: 0,
        periodEnd: 1,
        specified: [],
      },
      second: {
        optionValue: '',
        periodStart: 10,
        periodEnd: 20,
        specified: [],
      },
    };
    this.activeKey = '1';
    this.activeCollapseKey = '1';
  }

  // 設定修改彈窗資料
  setEditInfo(val) {
    // 必填檢核條件
    this.editFormRules = {
      jobDesc: [{ required: true, message: '請輸入批次描述', trigger: 'change' }],
      qrtzUrl: [{ required: true, message: '請輸入URL', trigger: 'change' }],
      isExecutable: [{ required: true, message: '請選擇是否開啟排程', trigger: 'change' }],
      cronTrigger: [{ required: true, message: '' }],
    };

    let isExecutable = false;
    if (val.editInfo.isExecutable) {
      isExecutable = val.editInfo.isExecutable === 'Y';
    }

    // 修改資訊
    this.editForm = {
      jobDesc: val.editInfo.jobDesc,
      jobName: val.editInfo.jobName,
      qrtzUrl: val.editInfo.qrtzUrl,
      isExecutable,
      cronTrigger: val.editInfo.cronTrigger,
      cronTriggerName: val.editInfo.cronTriggerName,
    };
  }

  // 關閉modal
  closeEditBatchModal(action) {
    this.$nextTick(() => {
      (this.$refs.formRef as any).clearValidate();
    });

    if (validateUtil.isEmpty(action)) {
      this.resetOption();
      this.$emit('closeEditBatchModal');
      return;
    }

    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.resetOption();
        this.$emit('closeEditBatchModal');
      },
    });
  }

  // 儲存
  saveInfo() {
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.BATCH_SETTING_TAB.val, this.$buttonKey.buttonKey.MODIFY.val);
    if (!getButtonsAuthInfoObj.byPass) {
      InfoModal.alertError({
        confirm: false,
        content: getButtonsAuthInfoObj.message,
      });
      return;
    }
    // 驗證必填欄位
    if (validateUtil.isEmpty(this.editForm.jobDesc) || validateUtil.isEmpty(this.editForm.qrtzUrl)
    || validateUtil.isEmpty(this.editForm.isExecutable.toString())) {
      InfoModal.alertInfo({
        confirm: false,
        content: `儲存失敗，${this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message}`,
      });
      // 紅框提示訊息，不需顯示表達式框框
      (this.$refs.formRef as any).validate((valid) => {
        if (!valid) {
          (this.$refs.formRef as any).clearValidate(['cronTrigger']);
          return false;
        }
      });
      return;
    }
    // call API
    this.editInfo();
  }

  // 修改排程設定
  editInfo() {
    // 整理後端所需格式
    this.editForm.cronTrigger = this.cron;
    // 避免值的更改造成畫面變動，用JSON.parse & JSON.stringify拷貝
    let isExecutable = JSON.parse(JSON.stringify(this.editForm.isExecutable));

    const batchSettingEditDto: BatchSettingEditDto = {
      qrtzUrl: this.editForm.qrtzUrl,
      isExecutable: isExecutable ? 'Y' : 'N',
      cronTrigger: this.editForm.cronTrigger,
      jobDesc: this.editForm.jobDesc,
      jobName: this.editForm.jobName,
      cronTriggerName: this.afterCronTriggerName,
    };
    this.$batchSettingApi.modifyBatchSettingUsingPOST(batchSettingEditDto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      if (!isSuccess) {
        this.$message.error(message, 10);
        return;
      }
      this.$message.success(message, 10);
      this.$emit('closeEditBatchModal');
      this.resetOption();
      // 查詢
      this.$emit('handleSearch', false);
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 下拉選單(複選)模糊查詢
  filterOption(input, option) {
    let keys = input.split(this.showSearchType);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      if (option.componentOptions.children[0].text.indexOf(keys[i]) >= 0) {
        count++;
      }
    }
    return count > 0;
  }

  // 多選下拉 - 全選
  selectALL(item, list) {
    this.result[item].specified = list.map((item) => item.value);
  }

  // 多選下拉 - 清除
  clearALL(item) {
    this.result[item].specified = undefined;
  }

  // 設定日排程選單
  setDayOptionList() {
    let dayOptionList = [];
    for (let i = 1; i <= this.getDays(); i++) {
      dayOptionList.push(
        {
          label: i.toString(),
          value: i.toString(),
        },
      );
    }
    return dayOptionList;
  }

  // 取得當月總天數
  getDays() {
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    let days = date.getDate();
    return days;
  }

  // 設定月排程選單
  setMonthOptionList() {
    let monthOptionList = [];
    for (let i = 1; i <= 12; i++) {
      monthOptionList.push(
        {
          label: i.toString(),
          value: i.toString(),
        },
      );
    }
    return monthOptionList;
  }

  // 設定時數排程選單
  setHourOptionList() {
    let hourOptionList = [];
    for (let i = 0; i <= 23; i++) {
      hourOptionList.push(
        {
          label: i.toString(),
          value: i.toString(),
        },
      );
    }
    return hourOptionList;
  }

  // 設定分/秒排程選單
  setSecOrMinOptionList() {
    let secOrMinOptionList = [];
    for (let i = 0; i <= 59; i++) {
      secOrMinOptionList.push(
        {
          label: i.toString(),
          value: i.toString(),
        },
      );
    }
    return secOrMinOptionList;
  }

  // 如果選到週-指定星期幾,當前沒有值則預設勾選星期一
  setWeekSpecifiedValue() {
    if (this.result.day.optionValue !== this.$actEnum.numberConstant.SIX) {
      return;
    }
    if (validateUtil.isEmpty(this.result.week.specified)) {
      this.result.week.specified = ['2'];
    }
  }

  // 月排程-cron表達式轉換成前端選項
   monthsReverseExp(cron, triggerNameList) {
    let months = cron.split(' ')[4];
    let month = this.result.month;
    switch (true) {
      case months.includes('*'):
        month.optionValue = this.$actEnum.numberConstant.ONE;
        triggerNameList.month = '每個月';
        break;
      case months.includes('-'):
        month.optionValue = this.$actEnum.numberConstant.TWO;
        month.rangeStart = months.split('-')[0];
        month.rangeEnd = months.split('-')[1];
        triggerNameList.month = `從${month.rangeStart}月到${month.rangeEnd}月`;
        break;
      case months.includes('/'):
        month.optionValue = this.$actEnum.numberConstant.THREE;
        month.periodStart = months.split('/')[0];
        month.periodEnd = months.split('/')[1];
        triggerNameList.month = `從${month.rangeStart}月開始，每${month.rangeEnd}月`;
        break;
      case months.includes(','):
        month.optionValue = this.$actEnum.numberConstant.FOUR;
        month.specified = months.split(',').map(String).sort();
        triggerNameList.month = `${months}月`;
        break;
      default:
        month.optionValue = this.$actEnum.numberConstant.FOUR;
        month.specified = months.split(',').map(String).sort();
        triggerNameList.month = `${months}月`;
    }
    this.result.month = month;
  }

  // 日&週排程-cron表達式轉換成前端選項
  daysReverseExp(cron, triggerNameList) {
    let days = cron.split(' ')[3];
    let weeks = cron.split(' ')[5];
    let day = this.result.day;
    let week = this.result.week;
    let getWeekText = '';
    // 如果日排程為?，則抓週排程的值，因為cron表達式中，日&週為互斥，若其一有值，另一方則設為?(不指定)
    if (!days.includes('?')) {
      switch (true) {
        case days.includes('*'):
          day.optionValue = this.$actEnum.numberConstant.ONE;
          triggerNameList.day = '每日';
          triggerNameList.week = '';
          break;
        case days.includes('?'):
          break;
        case days.includes('/'):
          day.optionValue = this.$actEnum.numberConstant.TWO;
          day.periodStart = days.split('/')[0];
          day.periodEnd = days.split('/')[1];
          triggerNameList.day = `從${day.periodStart}日開始，每${day.periodEnd}天`;
          triggerNameList.week = '';
          break;
        case days.includes('L'):
          day.optionValue = this.$actEnum.numberConstant.THREE;
          triggerNameList.day = '當月的最後一天';
          triggerNameList.week = '';
          break;
        case days.includes(','):
          day.optionValue = this.$actEnum.numberConstant.FOUR;
          day.specified = days.split(',').map(String).sort();
          triggerNameList.day = `第${days}天`;
          triggerNameList.week = '';
          break;
        default:
          day.optionValue = this.$actEnum.numberConstant.FOUR;
          day.specified = days.split(',').map(String).sort();
          triggerNameList.day = `第${days}天`;
          triggerNameList.week = '';
      }
    } else {
      // 如果日排程為?，則抓週排程的值，因為cron表達式中，日&週為互斥，若其一有值，另一方則設為?(不指定)
      switch (true) {
        case weeks.includes('/'):
          day.optionValue = this.$actEnum.numberConstant.FIVE;
          week.periodStart = weeks.split('/')[0];
          week.periodEnd = weeks.split('/')[1];
          triggerNameList.week = `從${this.$actEnum.getLabel('weekCheckOptionList', week.periodStart)}開始，每${week.periodEnd}週`;
          triggerNameList.day = '';
          break;
        case weeks.includes(','):
          day.optionValue = this.$actEnum.numberConstant.SIX;
          week.specified = weeks.split(',').map(String).sort();
          // 以選項value取得中文label
          week.specified.forEach((item) => {
            getWeekText += `${this.$actEnum.getLabel('weekCheckOptionList', item)},`;
          });
          getWeekText = getWeekText.slice(0, -1);
          triggerNameList.week = `${getWeekText}`;
          triggerNameList.day = '';
          break;
        default:
          day.optionValue = this.$actEnum.numberConstant.SIX;
          week.specified = weeks.split(',').map(String).sort();
          // 以選項value取得中文label
          week.specified.forEach((item) => {
            getWeekText += `${this.$actEnum.getLabel('weekCheckOptionList', item)},`;
          });
          getWeekText = getWeekText.slice(0, -1);
          triggerNameList.week = `${getWeekText}`;
          triggerNameList.day = '';
      }
    }
    this.result.day = day;
    this.result.week = week;
  }

  // 時數排程-cron表達式轉換成前端選項
  hoursReverseExp(hours, triggerNameList) {
    let val = hours.split(' ')[2];
    let hour = this.result.hour;
    switch (true) {
      case val.includes('*'):
        hour.optionValue = this.$actEnum.numberConstant.ONE;
        triggerNameList.hour = '每小時';
        break;
      case val.includes('-'):
        hour.optionValue = this.$actEnum.numberConstant.TWO;
        hour.rangeStart = val.split('-')[0];
        hour.rangeEnd = val.split('-')[1];
        triggerNameList.hour = `從${hour.rangeStart}點到${hour.rangeEnd}點`;
        break;
      case val.includes('/'):
        hour.optionValue = this.$actEnum.numberConstant.THREE;
        hour.periodStart = val.split('/')[0];
        hour.periodEnd = val.split('/')[1];
        triggerNameList.hour = `從${hour.periodStart}點開始，每${hour.periodEnd}小時`;
        break;
      case val.includes(','):
        hour.optionValue = this.$actEnum.numberConstant.FOUR;
        hour.specified = val.split(',').map(String).sort();
        triggerNameList.hour = `${val}點`;
        break;

      default:
        hour.optionValue = this.$actEnum.numberConstant.FOUR;
        hour.specified = val.split(',').map(String).sort();
        triggerNameList.hour = `${val}點`;
      }
    this.result.hour = hour;
  }

  // 分鐘數排程-cron表達式轉換成前端選項
  minutesReverseExp(minutes, triggerNameList) {
    let val = minutes.split(' ')[1];
    let minute = this.result.minute;
    switch (true) {
      case val.includes('*'):
        minute.optionValue = this.$actEnum.numberConstant.ONE;
        triggerNameList.minute = '每分鐘';
        break;
      case val.includes('-'):
        minute.optionValue = this.$actEnum.numberConstant.TWO;
        minute.rangeStart = val.split('-')[0];
        minute.rangeEnd = val.split('-')[1];
        triggerNameList.minute = `從${minute.rangeStart}分到${minute.rangeEnd}分`;
        break;
      case val.includes('/'):
        minute.optionValue = this.$actEnum.numberConstant.THREE;
        minute.periodStart = val.split('/')[0];
        minute.periodEnd = val.split('/')[1];
        triggerNameList.minute = `從${minute.periodStart}分開始，每${minute.periodEnd}分`;
        break;
      case val.includes(','):
        minute.optionValue = this.$actEnum.numberConstant.FOUR;
        minute.specified = val.split(',').map(String).sort();
        triggerNameList.minute = `${val}分`;
        break;
      default:
        minute.optionValue = this.$actEnum.numberConstant.FOUR;
        minute.specified = val.split(',').map(String).sort();
        triggerNameList.minute = `${val}分`;
    }
    this.result.minute = minute;
  }

  // 秒數排程-cron表達式轉換成前端選項
  secondsReverseExp(seconds, triggerNameList) {
    let val = seconds.split(' ')[0];
    let second = this.result.second;
    switch (true) {
      case val.includes('/'):
        second.optionValue = this.$actEnum.numberConstant.ONE;
        second.periodStart = val.split('/')[0];
        second.periodEnd = val.split('/')[1];
        triggerNameList.second = `從${second.periodStart}秒開始，每${second.periodEnd}秒`;
        break;
      case val.includes(','):
        second.optionValue = this.$actEnum.numberConstant.TWO;
        second.specified = val.split(',').map(String).sort();
        triggerNameList.second = `${val}秒`;
        break;
      default:
        second.optionValue = this.$actEnum.numberConstant.TWO;
        second.specified = val.split(',').map(String).sort();
        triggerNameList.second = `${val}秒`;
    }
    this.result.second = second;
  }
}
