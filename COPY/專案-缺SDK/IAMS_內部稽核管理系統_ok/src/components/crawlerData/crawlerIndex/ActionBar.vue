<template>
  <div>
    <div v-if="role == 'ROLE_Audit_Team_Head'">
      <a-tooltip
        :trigger="!isSelectItem? 'hover' : ''"
        placement="top"
        :overlay-class-name="'whiteTooltip'"
      >
        <template slot="title">
          <a-icon
            class="tip__icon"
            type="exclamation-circle"
          />
          <span class="tip__text">請先勾選</span>
        </template>
        <IconTextButton
          class="me-3"
          text="認列送出"
          type="enter"
          @click="isSelectItem && confirm(true)"
        />
      </a-tooltip>
      <a-tooltip
        :trigger="!isSelectItem? 'hover' : ''"
        placement="top"
        :overlay-class-name="'whiteTooltip'"
      >
        <template slot="title">
          <a-icon
            class="tip__icon"
            type="exclamation-circle"
          />
          <span class="tip__text">請先勾選</span>
        </template>
        <IconTextButton
          text="非本組認列"
          type="close"
          @click="isSelectItem && confirm(false)"
        />
      </a-tooltip>
    </div>
    <div v-if="role == 'ROLE_Auditor'">
      <IconTextButton
        class="me-3"
        text="上傳資料"
        type="upload"
        @click="$router.push({name: 'CrawlerDataUpload'})"
      />
      <a-tooltip
        :trigger="!isSelectItem? 'hover' : ''"
        placement="top"
        :overlay-class-name="'whiteTooltip'"
      >
        <template slot="title">
          <a-icon
            class="tip__icon"
            type="exclamation-circle"
          />
          <span class="tip__text">請先勾選</span>
        </template>
        <IconTextButton
          text="非本組認列"
          type="close"
          @click="isSelectItem && confirm(false)"
        />
      </a-tooltip>
    </div>
    <!-- <div v-if="role == 'ROLE_Audit_Department_Head'">
      <IconTextButton
        class="me-3"
        text="設定認列組別"
        type="group"
      />
      <IconTextButton
        class="me-3"
        text="全部通過"
        type="enter"
      />
      <IconTextButton
        text="全部退回"
        type="feedback"
      />
    </div> -->
    <div v-if="role == '4'">
      <IconTextButton
        class="me-3"
        text="上傳資料"
        type="upload"
        @click="toPage('CrawlerDataUpload')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
// export interface todoListDataInterface{
//   img: string;
//   title: string;
//   count: number;
// }

@Component({
	components: { IconTextButton	},
})
export default class ActionBar extends Vue {
  @Prop()
  role: string;

  @Prop()
  selectItems;

  @Watch('selectItems', { immediate: true, deep: true })
  onSelectItemsChanged(val) {
  	// console.log('selectItems', val);
  	if (val.length > 0) {
  		this.isSelectItem = true;
  	} else {
  		this.isSelectItem = false;
  	}
  }

  isSelectItem: boolean = false;

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
}
</script>

<style lang="scss" scoped>
.tip__icon{
  display: inline;
  color: $COLOR-MAIN1;
  vertical-align: middle;
  margin-right: 6px;
  ::v-deep{
    i {
      box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
    }
  }
}
.tip__text{
  color: $COLOR-MAIN1;
  font-size: 14px;
  line-height: 1em;
}
</style>
