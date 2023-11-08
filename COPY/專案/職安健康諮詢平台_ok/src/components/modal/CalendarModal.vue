<template>
  <div class="ant-modal-root customModal">
    <div class="ant-modal-mask" />
    <div
      tabindex="-1"
      role="dialog"
      class="ant-modal-wrap ant-modal-centered"
    >
      <div
        role="document"
        class="ant-modal"
      >
        <div class="ant-modal-content">
          <div
            class="icon-button icon__close"
            @click="onCalendarModalClose"
          >
            <a-icon type="close" />
          </div>
          <div class="ant-modal-body">
            <a-calendar @panelChange="onPanelChange">
              <div
                slot="dateFullCellRender"
                slot-scope="value"
              >
                <a-popover
                  v-if="getListData(value).length>0"
                  :title="getPopoverTitle(value)"
                  placement="bottomLeft"
                >
                  <template slot="content">
                    <li
                      v-for="(item, index) in getListData(value)"
                      :key="index"
                    >
                      <div class="popover-content__title">
                        {{ item.content }}
                      </div>
                      <div class="d-flex">
                        預約人數
                        <p class="ml-auto">
                          {{ item.count }}人
                        </p>
                      </div>
                    </li>
                  </template>
                  <div class="ant-fullcalendar-date">
                    <div class="ant-fullcalendar-value">
                      {{ getCellDate(value) }}
                    </div>
                    <div class="ant-fullcalendar-content">
                      <ul class="events">
                        <li
                          v-for="(item, index) in getListData(value)"
                          :key="index"
                        >
                          <a-badge
                            :status="item.type"
                            :text="item.content"
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </a-popover>
                <div
                  v-else
                  class="ant-fullcalendar-date"
                >
                  <div class="ant-fullcalendar-value">
                    {{ getCellDate(value) }}
                  </div>
                  <div class="ant-fullcalendar-content">
                    <ul class="events">
                      <li
                        v-for="(item, index) in getListData(value)"
                        :key="index"
                      >
                        <a-badge
                          :status="item.type"
                          :text="item.content"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </a-calendar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import moment from 'moment';

moment.updateLocale('zh-tw', {
	week: { dow: 1 },
	weekdaysMin: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
	monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
});
@Component({})
export default class CalendarModal extends Vue {
  @Prop()
  calendarListData

  // isSelected: boolean = false;

  getListData({ _d }) {
  	let listData;
  	this.calendarListData.forEach((i) => {
  		if (moment(_d).format('YYYY-MM-DD') === i.date) {
  			listData = i.listData.map((list) => ({ type: 'success', ...list }));
  		}
  	});
  	return listData || [];
  }

  /**
   * Func
   */
  getPopoverTitle({ _d }) {
  	const weekdaysList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  	const date = moment(_d).format('YYYY/MM/DD');
  	const dayName = weekdaysList[moment(_d).day()];
  	return `${date} ${dayName}`;
  }

  // 取得行事曆的日期
  getCellDate({ _d }) {
  	return moment(_d).format('DD');
  }

  // 判斷是否顯示行事曆單元格: 僅顯示工作日(星期一~星期五)
  showDateFullCell({ _d }) {
  	return (moment(_d).day() != 0 && moment(_d).day() != 6) || false;
  }

  /**
   * Event
   */
  onPanelChange(value) {
  	this.$emit('panelChanged', value);
  }

  onCalendarModalClose() {
  	this.$emit('close');
  }
}
</script>

<style lang="scss" scoped>
  .ant-modal {
    padding-bottom: 0;
  }
  .ant-modal-content {
    border-radius: 10px;
    .icon__close {
      position: absolute;
      left: -20px;
      top: -20px;
    }
  }
  .ant-modal-body {
    padding: 30px 90px;
    width: 900px;
    // height: 640px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  // calendar
  ::v-deep{
    .ant-modal-mask, .ant-modal-wrap {
      z-index: 1000;
    };
    .ant-fullcalendar-calendar-body {
      border-bottom: 1px solid $CALENDAR-FRAME-BORDER-COLOR;
    }
    .ant-fullcalendar-selected-day .ant-fullcalendar-date{
      background-color: $CALENDAR-FRAME-HOVER-BG;
    }
    .ant-fullcalendar-date {
      height: 96px;
      &:hover, &:active, &:focus {
        background-color: $CALENDAR-FRAME-HOVER-BG;
      }
    }
    .ant-fullcalendar-header {
      .ant-radio-group {
        // 硬解法 - 隱藏年/月切換
        display: none;
      }
      .ant-select {
        min-width: 100px;
      }
    }
    // event
    .ant-badge-status-success {
      background-color: $CALENDAR-DOT-COLOR;
    }
    .ant-badge-status-text {
      font-size: 14px;
    }
  }

  .events {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      line-height: 18px;
    }
  }
  .events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  .notes-month {
    text-align: center;
    font-size: 28px;
  }
  .notes-month section {
    font-size: 28px;
  }

  .popover-content__title {
    margin-bottom: 5px;
    color: $POPOVER-TEXT-COLOR-GREEN;
  }

  .ant-fullcalendar-fullscreen {
    .ant-fullcalendar-content {
      height: 58px;
    }
    ::v-deep {
      .ant-fullcalendar-table {
        .ant-fullcalendar-column-header {

          &:nth-last-child(1),
          &:nth-last-child(2){
            display: none;
          }
        }
        .ant-fullcalendar-tbody {
          tr {
            .ant-fullcalendar-cell {
              &:nth-last-child(1),
              &:nth-last-child(2){
                display: none;
              }
            }
          }
        }
      }
    }
  }
</style>
