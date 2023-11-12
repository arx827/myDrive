<template>
  <a-modal
    v-model="modalVisible"
    class="common__modal cate__modal"
    :mask-closable="false"
    :after-close="handleClose"
    :footer="null"
    :width="'70%'"
  >
    <template slot="closeIcon">
      <a-icon type="close" />
    </template>
    <div class="previewModal__wrap">
      <!-- 活動資訊 -->
      <div class="actInfoGroup__wrap">
        <div class="event__title">
          活動資訊
        </div>
        <a-row
          :gutter="[16, 16]"
          class="actInfo-item"
        >
          <template v-for="(info, index) in actInfoDataGroup">
            <a-col
              :key="index"
              :span="info.colSpan"
            >
              <div class="info__label">
                {{ info.label }}
              </div>
              <div class="info__value">
                <template v-if="info.type=='input'">
                  {{ previewData[info.key] }}
                </template>
                <template v-if="info.type=='dropdown'">
                  {{ getOptionLabel(info.key, previewData[info.key] ) }}
                </template>
                <template v-if="info.type=='datePicker'">
                  {{ getDate(info.key) }}
                </template>
                <template v-if="info.type=='dateRangePicker'">
                  {{ getDateRange(info.key) }}
                </template>
                <template v-if="info.type=='timePicker'">
                  {{ getTime(info.key) }}
                </template>
              </div>
            </a-col>
          </template>
        </a-row>
      </div>
      <!-- 場次資訊 -->
      <div class="sessionInfoGroup_wrap">
        <div class="event__title">
          場次資訊
        </div>
        <div
          v-for="(sessionItem, index) in form.activitiesList"
          :key="index"
          class="form__card"
        >
          <a-row
            :gutter="[16, 16]"
            class="sessionInfo-item"
          >
            <template v-for="(info, index) in sessionInfoGroup">
              <a-col
                :key="index"
                :span="info.colSpan"
              >
                <div class="sessionInfo__label">
                  {{ info.label }}
                </div>
                <div class="sessionInfo__value">
                  <template v-if="info.type=='input'">
                    {{ sessionItem[info.key] }}
                  </template>
                  <template v-if="info.type=='inputGroup' && (sessionItem[info.key[0]] || sessionItem[info.key[1]])">
                    {{ `${sessionItem[info.key[0]]}~${sessionItem[info.key[1]]}` }}
                  </template>
                  <template v-if="info.type=='dropdown' || info.type=='radio'">
                    {{ getOptionLabel(info.key, sessionItem[info.key]) }}
                  </template>
                  <template v-if="info.type=='datePicker'">
                    {{ getDate(sessionItem[info.key]) }}
                  </template>
                </div>
              </a-col>
            </template>
          </a-row>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import moment from 'moment';

export interface infoGroupModel {
  key?: string | Array<string>;
  label?: string;
  colSpan?: string;
  type?: 'input' | 'datePicker' | 'dateRangePicker' | 'timePicker' | 'dropdown' | 'editor' | 'radio' | 'inputGroup';
}
@Component({})
export default class PerformancePreviewModal extends Vue {
  @Prop()
  form: object

  @Prop()
  optionEnum: object

  @Prop()
  visible: boolean

  previewData = {};

  opts = null;

  /**
   * data
   */
  // 活動資訊
  actInfoDataGroup: Array<infoGroupModel> = [
  	{
  		key: 'actName',
  		label: '活動名稱',
  		colSpan: '24',
  		type: 'input',
  	},
  	{
  		key: 'actDate',
  		label: '活動日期',
  		colSpan: '12',
  		type: 'datePicker',
  	},
  	{
  		key: ['actStartTime', 'actEndTime'],
  		label: '活動時間',
  		colSpan: '12',
  		type: 'timePicker',
  	},
  	{
  		key: 'signupDate',
  		label: '可報名期間（亦為報名表填寫期間）',
  		colSpan: '24',
  		type: 'dateRangePicker',
  	},
  	// {
  	// 	key: 'actEndTime',
  	// 	label: '報名表填寫截止時間',
  	// 	colSpan: '12',
  	// 	type: 'timePicker',
  	// },
  	{
  		key: 'remindDate',
  		label: '發送提醒通知日期',
  		colSpan: '12',
  		type: 'datePicker',
  	},
  	{
  		key: 'sendSatisfyQuestDate',
  		label: '滿意度問卷發送日期',
  		colSpan: '12',
  		type: 'datePicker',
  	},
  ]

  // 場次資訊
  sessionInfoGroup: Array<infoGroupModel> = [
  	{
  		key: 'sessionName',
  		label: '場次名稱',
  		colSpan: '24',
  		type: 'input',
  	},
  	{
  		key: 'wbInfoId',
  		label: '場次大樓',
  		colSpan: '12',
  		type: 'dropdown',
  	},
  	{
  		key: 'location',
  		label: '場次地點',
  		colSpan: '12',
  		type: 'input',
  	},
  	{
  		key: 'type',
  		label: '活動類型',
  		colSpan: '12',
  		type: 'radio',
  	},
  	{
  		key: ['minCount', 'maxCount'],
  		label: '人數限制(最低/最高)',
  		colSpan: '12',
  		type: 'inputGroup',
  	},
  ]

  modalVisible = false;

  /**
   * func
   */
  // 取得下拉選單的中文值
  getOptionLabel(key, data) {
  	if (this.opts[key]) {
  		return this.opts[key].find((i) => i.value == data) ? this.opts[key].find((i) => i.value == data).label : data;
  	}
  	return '';
  }

  // 格式化日期
  getDate(key: string): string {
  	return (this.previewData[key]) ? moment(this.previewData[key]).format('yy/MM/DD') : '';
  }

  // 格式化日期區間
  getDateRange(key: string): string {
  	const stDate = this.previewData[key] && this.previewData[key][0];
  	const enDate = this.previewData[key] && this.previewData[key][1];
  	if (stDate || enDate) {
  		return `${(stDate) ? moment(stDate).format('yy/MM/DD') : ''} ~ ${enDate ? moment(enDate).format('yy/MM/DD') : ''}`;
  	}
  	return '';
  }

  // 格式化時間
  getTime(keyArr: Array<string>): string {
  	const [key1, key2] = keyArr;
  	if (this.previewData[key1] || this.previewData[key2]) {
  	  return `${moment(this.previewData[key1]).format('HH:mm')}~${moment(this.previewData[key2]).format('HH:mm')}`;
  	}
  }

  /**
   * Event
   */
  handleClose() {
  	this.$emit('closeModal');
  }

  /**
   * Hook
   */
  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Watch('optionEnum', { immediate: true, deep: true })
  optionEnumOnChange(val) {
  	if (val) {
  		this.opts = JSON.parse(JSON.stringify(val));
  	}
  }

  @Watch('form', { immediate: true, deep: true })
  onFormChange(val) {
  	// TEST:
  	// console.log(val);
  	this.previewData = val ? JSON.parse(JSON.stringify(val)) : {};
  }
}
</script>
<style lang="scss" scoped>
.previewModal__wrap {
  padding: 15px 0 30px 0;
}
.form__card {
  background: $COLOR-MAIN10;
  padding: 40px 76px;
  margin: 20px 0px;
  width: 100%;
  min-height: 100px;
}

.actInfoGroup__wrap {
  .info__label {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
    color: $COLOR-GRAY1;
    line-height: 22px;
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .info__value {
    font-size: 20px;
    color: $COLOR-GRAY1;
    line-height: 28px;
  }
}

.sessionInfoGroup_wrap {
  margin-top: 40px;
}
.event__title {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
  color: $COLOR-MAIN1;
  line-height: 22px;
}

.sessionInfo__label {
  font-size: 16px;
  color: $COLOR-GRAY1;
  font-weight: $TEXT-BOLD;
}
.sessionInfo__value {
  font-size: 16px;
  color: $COLOR-GRAY1;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
