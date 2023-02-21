<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'

const {
  proxy: { $numberUtil },
} = getCurrentInstance()

const form1 = ref<{ number: number }>({
  number: 0.212,
})
const form2 = ref<{ number: string | number; unit: number }>({
  number: 12.33021,
  unit: 2,
})
const form3 = ref<{ number: string | number }>({
  number: 4500.12,
})
const form4 = ref<{ number: string | number }>({
  number: 123.11,
})
const form5 = ref<{ number: string | number; ad: number }>({
  number: 132,
  ad: 5,
})

const form1_percen = computed<number>({
  get() {
    return $numberUtil.numToPercent(form1.value.number, 5)
  },
  set(val) {
    form1.value.number = $numberUtil.percentToNum(val, 5)
  },
})
const form2_round = computed<number>(() => $numberUtil.round(form2.value.number, form2.value.unit))
const form3_transfer = computed<number | string>({
  get() {
    return $numberUtil.transferPrice(form3.value.number)
  },
  set(val) {
    form3.value.number = $numberUtil.priceTransfer(val)
  },
})
const form4_numToCh = computed<number | string>(() => {
  return $numberUtil.intNumToCh(form4.value.number)
})
const form5_supplement = computed<string>(() => $numberUtil.padStart(form5.value.number, form5.value.ad))
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center">數字<swap-outlined class="mx-2" />百分比</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row class="d-flex align-items-center">
            <!-- 小數點 欄位 -->
            <a-col class="col">
              <a-form-item label="數字 (含小數)">
                <a-input-number class="w-100" v-model:value="form1.number" placeholder="請輸入 數字" />
              </a-form-item>
            </a-col>

            <a-col>
              <swap-outlined class="mx-3" />
            </a-col>

            <!-- 百分比 欄位 -->
            <a-col class="col">
              <a-form-item label="百分比 (含小數)">
                <a-input-number
                  class="w-100"
                  v-model:value="form1_percen"
                  placeholder="請輸入 百分比"
                  addon-after="%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>

    <div class="container__wrap">
      <h5>將數字 四捨五入 到 小數點後 n 位</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row class="d-flex align-items-center gap-3">
            <!-- 數字 欄位 -->
            <a-col class="col">
              <a-form-item label="數字 (含小數)">
                <a-input class="w-100" placeholder="請輸入 數字" v-model:value="form2.number" />
              </a-form-item>
            </a-col>

            <!-- 小數位 欄位 -->
            <a-col class="col">
              <a-form-item label="小數位數">
                <a-input-number class="w-100" v-model:value="form2.unit" :min="0" placeholder="請輸入 小數位數" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div>顯示：(小數 尾數0 隱藏)</div>
        <div>{{ form2_round }}</div>
      </div>
    </div>

    <div class="container__wrap">
      <h5 class="d-flex align-items-center">數字 <swap-outlined class="mx-2" /> 千分位</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row class="d-flex align-items-center">
            <!-- 數字 欄位 -->
            <a-col class="col">
              <a-form-item label="數字 (含小數)">
                <a-input class="w-100" placeholder="請輸入 數字" v-model:value="form3.number" />
              </a-form-item>
            </a-col>

            <a-col>
              <swap-outlined class="mx-3" />
            </a-col>

            <!-- 小數位 欄位 -->
            <a-col class="col">
              <a-form-item label="千分位">
                <a-input class="w-100" v-model:value="form3_transfer" placeholder="請輸入 數字" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>

    <div class="container__wrap">
      <h5>數字轉中文</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row class="d-flex align-items-center gap-3">
            <!-- 數字 欄位 -->
            <a-col class="col">
              <a-form-item label="數字 (含小數)">
                <a-input-number class="w-100" placeholder="請輸入 數字" v-model:value="form4.number" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div>顯示：</div>
        <div>{{ form4_numToCh }}</div>
      </div>
    </div>

    <div class="container__wrap">
      <h5>文字補零</h5>
      <div class="section__container">
        <a-form :labelWrap="true" :colon="false" :layout="'vertical'">
          <a-row class="d-flex align-items-center gap-3">
            <!-- 數字 欄位 -->
            <a-col class="col">
              <a-form-item label="數字 (含小數)">
                <a-input class="w-100" placeholder="請輸入 數字" v-model:value="form5.number" />
              </a-form-item>
            </a-col>

            <!-- 產出位數 -->
            <a-col class="col">
              <a-form-item label="產出位數">
                <a-input-number class="w-100" v-model:value="form5.ad" :min="0" placeholder="請輸入 產出位數" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div>顯示：(小數 尾數0 隱藏)</div>
        <div>{{ form5_supplement }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
