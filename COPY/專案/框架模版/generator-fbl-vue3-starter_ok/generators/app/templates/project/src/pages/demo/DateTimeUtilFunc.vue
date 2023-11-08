<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import { ref, computed, getCurrentInstance } from 'vue'

const {
  proxy: { $dateTimeUtil },
} = getCurrentInstance()

const form1 = ref<{ date: string }>({
  date: '2022年12月20 14:30',
})
const form2 = ref<{ date: string }>({
  date: '2022年12月',
})
const form3 = ref<{
  time1: Dayjs
  time2: [Dayjs, Dayjs]
  date1: Dayjs
  date2: Dayjs
  date3: [Dayjs, Dayjs]
  date4: [Dayjs, Dayjs]
  date5: Dayjs
}>({
  time1: dayjs('09:00:00', 'HH:mm:ss'),
  time2: [dayjs('09:00:00', 'HH:mm:ss'), dayjs('10:00:00', 'HH:mm:ss')],
  date1: dayjs('2022/12/21'),
  date2: dayjs('2022/12/21 18:17'),
  date3: [dayjs('2022/12/07 18:17'), dayjs('2022/12/21 18:17')],
  date4: [dayjs('2022/12/07'), dayjs('2022/12/21')],
  date5: dayjs('2022/12/21'),
})

const form1_rocDate = computed<string>(() => {
  return $dateTimeUtil.transformRocDate(form1.value.date)
})
const form2_date = computed<string>(() => {
  return $dateTimeUtil.transformRocDate(form2.value.date)
})

type RangeValue = [Dayjs, Dayjs]
const dates = ref<RangeValue>()
const hackValue = ref<RangeValue>()

const disabledDate = (current: Dayjs) => {
  if (!dates.value || (dates.value as any).length === 0) {
    return false
  }
  const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 7
  const tooEarly = dates.value[1] && dates.value[1].diff(current, 'days') > 7
  return tooEarly || tooLate
}

const onOpenChange = (open: boolean) => {
  if (open) {
    dates.value = [] as any
    hackValue.value = form3.value.date4
  } else {
    hackValue.value = undefined
  }
}

const onChange = val => {
  form3.value.date4 = val
}

const onCalendarChange = val => {
  dates.value = val
}
</script>
<template>
  <div class="page__container flex-fill">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">文字Date轉換</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row class="d-flex align-items-center">
            <!-- 文字Date 欄位 -->
            <a-col class="col">
              <a-form-item label="文字Date">
                <a-input class="w-100" v-model:value="form1.date" placeholder="請輸入 文字Date" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div>顯示：</div>
        <div>{{ form1_rocDate }}</div>
      </div>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center">文字Date轉換 _ 整個月</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row class="d-flex align-items-center">
            <!-- 文字Date 欄位 -->
            <a-col class="col">
              <a-form-item label="文字Date">
                <a-input class="w-100" v-model:value="form2.date" placeholder="請輸入 文字Date" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div>顯示：</div>
        <div>{{ form2_date }}</div>
      </div>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center">時間選擇器</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <!-- 基本時間 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="基本">
              <a-time-picker
                class="w-100"
                v-model:value="form3.time1"
                :showNow="false"
                value-format="HH:mm:ss"
                :minuteStep="30"
                placeholder="請選擇時間"
              />
            </a-form-item>
          </a-col>

          <!-- 範圍時間 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="範圍時間">
              <a-time-range-picker
                class="w-100"
                value-format="HH:mm:ss"
                :minuteStep="30"
                v-model:value="form3.time2"
                :placeholder="['請選擇時間', '請選擇時間']"
              />
            </a-form-item>
          </a-col>
        </a-form>
      </div>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center">日期選擇器</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <!-- 基本日期 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="日期">
              <a-date-picker class="w-100" v-model:value="form3.date1" placeholder="請選擇日期" />
            </a-form-item>
          </a-col>

          <!-- 日期 + 時間 -->
          <a-col :span="24" :md="12" :xl="8">
            <a-form-item label="日期 + 時間">
              <a-date-picker
                class="w-100"
                v-model:value="form3.date2"
                placeholder="請選擇日期時間"
                showTime
                :showNow="false"
              />
            </a-form-item>
          </a-col>

          <!-- 範圍日期 -->
          <a-col :span="24">
            <a-form-item label="範圍日期">
              <a-range-picker
                class="w-100"
                v-model:value="form3.date3"
                :placeholder="['請選擇日期時間', '請選擇日期時間']"
                showTime
                :showNow="false"
              />
            </a-form-item>
          </a-col>

          <!-- Disabled 日期 -->
          <a-col :span="24">
            <a-form-item label="Disabled 日期 7 Days">
              <a-range-picker
                class="w-100"
                :value="hackValue || form3.date4"
                :disabled-date="disabledDate"
                :placeholder="['請選擇日期時間', '請選擇日期時間']"
                :showNow="false"
                @change="onChange"
                @openChange="onOpenChange"
                @calendarChange="onCalendarChange"
              />
            </a-form-item>
          </a-col>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
