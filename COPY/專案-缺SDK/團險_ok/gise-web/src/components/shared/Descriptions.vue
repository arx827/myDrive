<script setup lang="ts">
import { defineProps, ref, watchEffect } from 'vue'

export interface DescriptionsData {
  type: 'PLAIN' | 'TEMPLATE'
  label: string
  key?: string
  value?: string
  template?: string
  isRequired?: boolean
  underline?: boolean
  isShow?: boolean
}

interface DescriptionsProp {
  column: 1 | 2
  data: DescriptionsData[]
}

const $props = withDefaults(defineProps<DescriptionsProp>(), {
  column: 1,
})

let listData = ref<DescriptionsData[][]>([])
let underlineNums: Array<number> = []

// 找出要畫底線的位置
const getUnderlineNums = (dataList: DescriptionsData[]): Array<number> => {
  if (!dataList) return []
  let underlineNums: Array<number> = []
  dataList.forEach((dataItem, index) => {
    if (dataItem.underline === true) underlineNums.push(index)
  })

  return underlineNums
}

// 整理要顯示的欄位，過濾isShow = false
const filterToShowList = (dataList: DescriptionsData[]): DescriptionsData[] => {
  if (!dataList) return []
  return dataList.filter(data => {
    if (data?.isShow === false) return false
    return true
  })
}

// 將資料整理成要渲染的結構
const listDataAddUnderline = (dataList: DescriptionsData[], underlineNums: number[]): Array<DescriptionsData>[] => {
  let newListData: Array<DescriptionsData>[] = []
  let prevNum: number = 0
  if (underlineNums.length === 0) {
    newListData.push(dataList)
    return newListData
  }

  underlineNums.map(underlineNum => {
    newListData.push(dataList.slice(prevNum, underlineNum + 1))
    prevNum = underlineNum
  })

  if (prevNum < dataList.length) newListData.push(dataList.slice(prevNum + 1, dataList.length))
  return newListData
}

const getListData = ($props: DescriptionsProp) => {
  // console.log('$props.data', $props.data)
  underlineNums = getUnderlineNums($props.data)
  listData.value = listDataAddUnderline(filterToShowList($props.data), underlineNums)
}

watchEffect(() => getListData($props))
</script>

<template>
  <div class="flex flex-col divide-y-[1px] divide-dashed divide-neutral-entry">
    <div
      class="grid w-full gap-2 py-2 lg:gap-4 lg:py-4"
      :class="$props.column === 1 ? 'grid-cols-1' : 'lg:grid-cols-2'"
      v-for="(groupData, index) in listData"
      :key="index"
    >
      <template v-for="(item, itemIndex) in groupData" :key="itemIndex">
        <div class="grid grid-cols-2 items-center md:grid-cols-8 lg:grid-cols-3">
          <div
            class="col-span-1 text-left font-normal md:col-span-2 md:text-right md:font-semibold lg:col-span-1 lg:text-lg"
            :class="{ 'label--required': item.isRequired }"
          >
            {{ item.label }}
          </div>
          <div
            class="col-span-1 flex-1 pl-4 text-right font-semibold md:col-span-6 md:pl-8 md:text-left md:font-normal lg:col-span-2 lg:text-lg"
          >
            <template v-if="item.type === 'PLAIN'">
              {{ item.value }}
            </template>
            <template v-if="item.type === 'TEMPLATE'">
              <slot :name="item.template" />
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="css" scoped>
.label--required {
  @apply after:ml-[3px] after:font-mark after:text-base after:font-normal after:text-[#ff4d4f] after:content-['*'] before:md:ml-[3px] before:md:font-mark before:md:text-base before:md:font-normal before:md:text-[#ff4d4f] before:md:content-['*'] after:md:hidden;
}
</style>
