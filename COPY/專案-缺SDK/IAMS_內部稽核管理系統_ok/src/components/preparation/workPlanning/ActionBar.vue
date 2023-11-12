<template>
  <div class="d-flex justify-content-end">
    <!-- 查核人員 且為領隊 -->
    <div v-if="role === 'ROLE_Auditor' && isLeader && ['01', '04', '05'].includes(workMStatus)">
      <!-- <template> -->
      <CustomPopConfirm
        title="確認覆核？"
        @confirm="$emit('click', {
          type: 'submitReview'
        })"
      >
        <IconTextButton
          class="me-3"
          text="送出覆核"
          type="edit"
        />
      </CustomPopConfirm>
      <IconTextButton
        class="me-3"
        text="暫存"
        type="save"
        @click="$emit('click', {
          type: 'save'
        })"
      />
      <!-- <IconTextButton
          class="me-3"
          text="行前會議通知"
          type="mail"
          @click="$emit('click', {
            type: 'meeting'
          })"
        /> -->
      <!-- 查詢 現階段不用做 7/13 -->
      <!-- <IconTextButton
        class="me-3"
        text="查詢"
        type="search"
        @click="$emit('click', 'search')"
      /> -->
      <!-- <IconTextButton
        class="me-3"
        text="異動"
        type="change"
        :disabled="true"
        @click="$emit('click', 'change')"
      /> -->
    </div>
    <!-- 組長 -->
    <div v-if="role === 'ROLE_Audit_Team_Head' && ['02'].includes(workMStatus)">
      <IconTextButton
        class="me-3"
        text="通過"
        type="enter"
        @click="$emit('click', {
          type: 'sussess'
        })"
      />
      <IconTextButton
        class="me-3"
        text="退回"
        type="feedback"
        @click="$emit('click', {
          type: 'reject'
        })"
      />
      <!-- <IconTextButton
        class="me-3"
        text="查詢"
        type="search"
        @click="$emit('click', 'search')"
      /> -->
    </div>
    <!-- 部主管 -->
    <div v-if="role === 'ROLE_Audit_Department_Head' && ['03'].includes(workMStatus)">
      <IconTextButton
        class="me-3"
        text="通過"
        type="enter"
        @click="$emit('click', {
          type: 'sussess'
        })"
      />
      <IconTextButton
        class="me-3"
        text="退回"
        type="feedback"
        @click="$emit('click', {
          type: 'reject'
        })"
      />
      <!-- <IconTextButton
        class="me-3"
        text="查詢"
        type="search"
        @click="$emit('click', 'search')"
      /> -->
    </div>

    <!-- 所有權限皆可使用 -->
    <IconTextButton
      class="me-3"
      text="下載檔案(word)"
      type="download"
      @click="download"
    />
    <IconTextButton
      text="上一頁"
      type="return"
      @click="$emit('click', {
        type: 'back'
      })"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
// export interface todoListDataInterface{
//   img: string;
//   title: string;
//   count: number;
// }

@Component({
	components: { IconTextButton, CustomPopConfirm },
})
export default class ActionBar extends Vue {
  @Prop()
  role: string;

  @Prop()
  isLeader: boolean;

  @Prop()
  workMStatus: string;

  // WorkMStatus 資料表
  // 01.領隊處理。
  // 04.組長退回。
  // 05.部主管退回。

  // 02.組長覆核。

  // 03.部主管覆核。

  // 06.已完成簽核。
  // 07.送出查核行前通知。

  /*
   * 稽核人員:ROLE_Auditor
   * 組長:ROLE_Audit_Team_Head
   * 部主管:ROLE_Audit_Department_Head
   * 4. 窗口／UAO
   */

  clickHandler() {
  	console.log('click');
  }

  // 本組認列／非本組認列
  confirm(isConfirmed) {
  	this.$emit('confirm', isConfirmed);
  }

  toPage(routerName) {
  	this.$emit('toPage', routerName);
  }

  download() {
  	this.$emit('click', {
  		type: 'download',
  	});
  }
}
</script>

<style lang="scss" scoped>
</style>
