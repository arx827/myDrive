<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import editSvg from '@/assets/imgs/button_edit.svg?url'
const {
  proxy: { $modal },
} = getCurrentInstance()

const checked = ref<boolean>(true)

// 步驟條 Data
const progressbarArr = ['員工資料', '被保險人', '健康聲明', '繳費方式', '資料確認', '簽名送出']
const nowStep = 3

// Function
function onEditCardShadowAngle() {
  console.log('click => edit')
}

// Modal Plugin
const confirmModal1 = () => {
  $modal.confirm({
    title: '查無會員身分',
    content: '您尚未註冊會員，是否前往註冊？',
    okText: '註冊',
  })
}
const confirmModal2 = () => {
  $modal.confirm({
    title: '您確定要申請資料變更嗎？',
    content: '確定要對此被保險人申請資料變更嗎？',
    okText: '資料變更',
    okType: 'danger',
  })
}
const infoModal = () => {
  $modal.info({
    title: 'This is a info message',
    content: 'some messages...some messages...',
  })
}
const successModal = () => {
  $modal.success({
    title: 'This is a success message',
    content: 'some messages...some messages...',
  })
}
const errorModal = () => {
  $modal.error({
    title: 'This is a error message',
    content: 'some messages...some messages...',
  })
}

// TEST: card info
const cardInfoLabels = [
  { key: 'insattr', label: '與員工關係' },
  { key: 'name', label: '姓名' },
  { key: 'idNo', label: '身分證字號' },
  { key: 'birthDate', label: '生日' },
  { key: 'sex', label: '性別' },
]
const testCardInfoData = {
  insattr: {
    isEdit: false,
    value: '1',
  },
  name: {
    isEdit: true,
    value: '李二二',
  },
  idNo: {
    isEdit: false,
    value: 'A123452316',
  },
  birthDate: {
    isEdit: false,
    value: '1120226',
  },
  sex: {
    isEdit: false,
    value: 'M',
  },
}
const testCardInfoData2 = {
  insattr: '1',
  name: '李二二',
  idNo: 'A123452316',
  birthDate: '1120226',
  sex: 'M',
}

const isModalConsentVisible = ref<boolean>(false)
</script>
<template>
  <div class="container mx-auto p-3">
    <!-- TEST: Eason -->
    <FormTitle title="SetpBar 步驟條" />
    <ProgressbarStep :stepArr="progressbarArr" :now="nowStep" />

    <!-- TEST: 詩庭 -->

    <!-- TEST: 已review 結束 -->
    <FormTitle title="CardCollapse 折疊面板" />
    <CardCollapse v-model:collapsed="checked" title="要保人與被保險人聲明事項">
      <template #description>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tristique fermentum risus, eget
          pellentesque nisi porttitor in. Quisque et sapien eget ligula feugiat semper. Aliquam non mauris sit amet
          metus semper dignissim vel finibus turpis. In posuere eros vel libero facilisis, mattis posuere orci
          hendrerit. Morbi non ullamcorper odio, ac cursus tellus. Phasellus eu quam elit. Integer quis augue a ipsum
          egestas accumsan. Integer a justo id ante bibendum auctor at nec felis. Curabitur lectus urna, molestie vel
          elementum nec, tincidunt ac diam. Phasellus facilisis neque ut accumsan vehicula. Mauris facilisis neque ac
          consectetur cursus. Etiam id felis eget mi scelerisque mattis. Quisque aliquet et magna ut faucibus. Curabitur
          volutpat, nibh ut consectetur pellentesque, justo arcu malesuada est, gravida dictum neque quam hendrerit mi.
          Quisque sit amet eros et ante pellentesque mattis sit amet a urna. Praesent consequat ligula non vehicula
          pharetra. Aliquam sem enim, pulvinar a mauris nec, vehicula gravida massa. Donec ut imperdiet diam, sit amet
          commodo nulla. Aenean diam risus, scelerisque vel erat at, tincidunt bibendum nunc. Pellentesque habitant
          morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin eu rhoncus urna, pretium
          hendrerit eros. Phasellus laoreet efficitur rhoncus. Ut sodales porttitor molestie. Vestibulum ante ipsum
          primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas eleifend, erat eget tempus dapibus,
          nunc nisi pulvinar magna, facilisis tincidunt tellus quam sed elit. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas. Donec et nulla imperdiet, elementum orci eu, porttitor
          neque. Ut quam metus, commodo sed vestibulum sit amet, bibendum at dolor. Etiam luctus dui nulla, id venenatis
          est aliquet ut. Nunc quis erat suscipit massa pulvinar bibendum eu ut enim. Suspendisse ac luctus felis.
          Praesent at blandit erat. Vestibulum diam ipsum, pharetra eu posuere at, maximus at enim. Aliquam maximus ante
          et diam accumsan aliquam. Nunc vestibulum congue dolor, eu tempor urna pulvinar in. Duis quis mattis erat.
          Integer pellentesque tempor pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
          egestas. Morbi quis ex sit amet dolor posuere dapibus vel eu lacus. Maecenas sapien neque, porta a efficitur
          vulputate, tincidunt non nunc. Integer sed ligula sed erat varius faucibus. Suspendisse malesuada quam non
          quam porttitor, ut aliquet nulla tincidunt. Cras mollis dictum maximus. Suspendisse placerat pellentesque dui.
          Sed accumsan non leo non tempor. Maecenas porttitor suscipit sapien in tempor. Duis condimentum arcu eu mi
          ornare molestie. Maecenas vel est in risus gravida tristique. Suspendisse porttitor rhoncus ante id convallis.
          Aenean quis euismod lorem, eu vestibulum velit. Nulla ut elit at purus malesuada placerat vitae sed massa.
          Vivamus vehicula est quam. Integer in scelerisque urna. Pellentesque scelerisque bibendum fermentum. Etiam
          sapien augue, condimentum et ante sit amet, aliquet euismod mauris. Nunc sit amet dapibus neque. Praesent sit
          amet eros sapien. Phasellus dui dolor, eleifend quis nibh at, auctor dictum leo. Cras urna nulla, pulvinar et
          consectetur euismod, pellentesque sit amet leo. Integer efficitur tincidunt neque ut elementum. Nulla
          dignissim lectus et elit volutpat, eget egestas dolor tincidunt.
        </p>
      </template>
    </CardCollapse>

    <FormTitle title="CardNotice 注意事項" />
    <CardNotice>
      <template #description>
        <p>所有被保險人皆已填寫完成後，再點選<a href="test">下一步</a>。</p>
        <ul>
          <li>1</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>7</li>
        </ul>
      </template>
    </CardNotice>

    <FormTitle title="CardShadowRound 區塊 - 圓角" />
    <div class="md:w-[540px] lg:w-[612px]">
      <CardShadowRound title="會員登入">
        <p>欄位資料</p>
        <p>欄位資料</p>
        <p>欄位資料</p>
        <p>欄位資料</p>
      </CardShadowRound>
    </div>

    <FormTitle title="CardShadowAngle 區塊 - 直角" />
    <CardShadowAngle @edit="onEditCardShadowAngle" title="申請資料&員工資料">
      <div>slotProps</div>
    </CardShadowAngle>

    <FormTitle title="CardInfo 卡片" />
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      <CardInfo title="被保人有效資料">
        <template #headerControl>
          <ButtonRectangle btn-style="secondary"> 修改 </ButtonRectangle>
          <ButtonRectangle btn-style="danger"> 退保 </ButtonRectangle>
        </template>
        <p>slot</p>
      </CardInfo>
      <CardInfo title="申請退保" type="danger">
        <template #headerControl>
          <ButtonRectangle btn-style="danger"> 取消 </ButtonRectangle>
        </template>
        <p>slot</p>
      </CardInfo>
      <CardInfo title="申請資料變更" type="warning" :columns="cardInfoLabels" :data="testCardInfoData">
        <template #headerControl>
          <ButtonRectangle btn-style="secondary"> 修改 </ButtonRectangle>
          <ButtonRectangle btn-style="danger"> 取消 </ButtonRectangle>
        </template>
        <template #customCell="{ data, column }">
          <span class="flex-1 text-right font-semibold" :class="data[column.key]?.isEdit && 'text-[#FAAD14]'">
            {{ data[column.key]?.value }}
          </span>
        </template>
        <p>slot</p>
      </CardInfo>
      <CardInfo title="申請加保" type="secondary" :columns="cardInfoLabels" :data="testCardInfoData2">
        <template #headerControl>
          <ButtonRectangle btn-style="secondary"> 修改 </ButtonRectangle>
          <ButtonRectangle btn-style="danger"> 取消 </ButtonRectangle>
        </template>
        <p>slot</p>
      </CardInfo>
    </div>

    <FormTitle title="Modal Plugin 彈窗插件"></FormTitle>
    <a-button class="btn__primary" @click="confirmModal1">confirm</a-button>
    <a-button class="btn__primary" @click="confirmModal2">confirm(danger)</a-button>
    <a-button class="btn__primary" @click="infoModal">info</a-button>
    <a-button class="btn__primary" @click="successModal">success</a-button>
    <a-button class="btn__primary" @click="errorModal">error</a-button>

    <!-- TEST: 巧吟 -->
    <div>
      <FormTitle title="button 按鈕元件"></FormTitle>
      <ButtonRoundedPrimary>btn-primary </ButtonRoundedPrimary>
      <ButtonRoundedPrimary disabled>btn-primary </ButtonRoundedPrimary>
      <ButtonRoundedPrimary size="full">btn-primary </ButtonRoundedPrimary>
      <ButtonRoundedSecondary>btn-secondary </ButtonRoundedSecondary>
      <ButtonRectangle>btn </ButtonRectangle>
      <ButtonRectangle btn-style="danger">btn-rectangle </ButtonRectangle>
      <ButtonRectangle btn-style="secondary"> btn-rectangle </ButtonRectangle>
      <ButtonRectangle disabled btn-style="secondary"> btn-rectangle </ButtonRectangle>
      <br />
      <ButtonIconic disabled tooltip="確定">
        <exclamation-circle-outlined />
      </ButtonIconic>
      <ButtonIconic tooltip="確定">
        <img :src="editSvg" alt="" />
      </ButtonIconic>
      <ButtonIconic btn-style="danger" tooltip="刪除">
        <exclamation-circle-outlined />
      </ButtonIconic>
      <ButtonIconicLarge>
        <template #icon>
          <exclamation-circle-outlined />
        </template>
        <template #text> 申請專區 </template>
      </ButtonIconicLarge>
    </div>

    <!-- TEST: 佩泠 -->
    <FormTitle title="彈窗"></FormTitle>
    <ButtonRoundedPrimary @click="() => (isModalConsentVisible = true)">確認彈窗 </ButtonRoundedPrimary>

    <ModalConsent title="測試測試測試測試" v-model:visible="isModalConsentVisible">
      <template #content>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis deserunt nisi ratione mollitia, veritatis
        assumenda perferendis, animi eum, culpa at temporibus. Repudiandae, laboriosam fugiat eum animi officiis beatae
        reiciendis corporis?orem ipsum dolor sit amet consectetur adipisicing elit. Corporis deserunt nisi ratione
        mollitia, veritatis assumenda perferendis, animi eum, culpa at temporibus. Repudiandae, laboriosam fugiat eum
        animi officiis beatae reiciendis corporis?orem ipsum dolor sit amet consectetur adipisicing elit. Corporis
        deserunt nisi ratione mollitia, veritatis assumenda perferendis, animi eum, culpa at temporibus. Repudiandae,
        laboriosam fugiat eum animi officiis beatae reiciendis corporis?orem ipsum dolor sit amet consectetur
        adipisicing elit. Corporis deserunt nisi ratione mollitia, veritatis assumenda perferendis, animi eum, culpa at
        temporibus. Repudiandae, laboriosam fugiat eum animi officiis beatae reiciendis corporis?orem ipsum dolor sit
        amet consectetur adipisicing elit. Corporis deserunt nisi ratione mollitia,
      </template>
    </ModalConsent>
  </div>
</template>

<style scoped>
:deep(.collapseCard .ant-collapse-content-box) {
  @apply max-h-[200px] overflow-auto;
}

/* TEST: 單純在這頁 demo 頁使用 */
h4 {
  @apply mt-10;
}
</style>
