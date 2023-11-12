<template>
  <div class="actionBarWrap d-flex align-items-center flex-wrap justify-content-end">
    <template v-if="auditDraftSectionId">
      <a-dropdown
        :overlay-class-name="'linkButtonDropdown'"
        :placement="'bottomLeft'"
      >
        <IconTextButton
          text="網站連結"
          type="web_linke"
        />
        <a-menu
          slot="overlay"
        >
          <a-menu-item
            v-for="(item, index) in webSiteLinkArr"
            :key="index"
          >
            <a
              :href="item.link"
              target="_blank"
            >{{ item.name }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <IconTextButton
        text="上傳資料"
        type="upload"
        @click="handleClick('upload')"
      />

      <!-- 溝通 -->
      <IconTextButton
        v-if="showButtonStatus.commnuicateStartButton"
        text="溝通啟動"
        type="communicate"
        @click="handleClick('commnuicateStart')"
      />
      <IconTextButton
        v-if="showButtonStatus.commnuicateEndButton"
        text="溝通結束"
        type="communicate1"
        @click="handleClick('commnuicateEnd')"
      />
      <IconTextButton
        v-if="showButtonStatus.reportFinishButton"
        text="稽核報告審閱完畢"
        type="complete"
        @click="handleClick('reportFinish')"
      />
      <IconTextButton
        v-if="showButtonStatus.auditFinishButton"
        text="查核結束"
        type="check_fin"
        @click="handleClick('auditFinishButton')"
      />

      <IconTextButton
        v-if="showAddButton"
        text="新增查核"
        type="add"
        @click="handleClick('add')"
      />
      <IconTextButton
        v-if="sortDataNum"
        text="查核內容排序"
        type="sort"
        @click="handleClick('sort')"
      />
      <CustomPopConfirm
        v-if="showButtonStatus.submitButton"
        title="確認覆核？"
        @confirm="handleClick('submit')"
      >
        <IconTextButton
          text="送出覆核"
          type="edit"
        />
      </CustomPopConfirm>
      <CustomPopConfirm
        v-if="showButtonStatus.reviewButton"
        title="確認審畢？"
        @confirm="handleClick('review')"
      >
        <IconTextButton
          text="審畢"
          type="enter"
        />
      </CustomPopConfirm>
      <IconTextButton
        text="匯出總表"
        type="export"
        @click="handleClick('export')"
      />
    </template>
    <IconTextButton
      text="上一頁"
      type="return"
      @click="handleClick('back')"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import { RoleDto, WebsiteLink } from '@fubonlife/iams-api-axios-sdk';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { Getter, Action, namespace } from 'vuex-class';

@Component({
	components: { IconTextButton, CustomPopConfirm	},
})
export default class ActionBar extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
	role: RoleDto;

  @Prop()
	communicateType; // 溝通階段代碼

  @Prop()
	auditDraftSectionId; // SectionId

  @Prop()
	showButtonStatus; // 按鈕顯示狀態

  @Prop()
	sortDataNum; // 查核內容 數量

  @Prop()
  auditOpinionStatus: string;

  @Prop()
  checkMan: {domainId: string; name: string}[];

  webSiteLinkArr: WebsiteLink[] = [];

  // 查核狀態 不可編輯
  get isDisabledAuditOpinionStatus() {
  	return ['99'].includes(this.auditOpinionStatus);
  }

  // 新增查核 按鈕 顯示判斷
  get showAddButton() {
  	const inRole = ['ROLE_Auditor', 'ROLE_Audit_Team_Head'].includes(this.$global.getCurrentRoleId());
  	const inCheckMan = this.checkMan.map((i) => i.domainId).includes(this.$user.getMe().employee.domainId);
  	// -------- 可編輯條件 -------- //
  	// 角色為 查核人員、組長
  	// 為 Section查核人員
  	// 查核狀態非
  	return inRole && inCheckMan && !this.isDisabledAuditOpinionStatus;
  }

  /**
	 * API: 取得網站連結
	 */
  getApi_websiteLink() {
  	this.setLoading(true);
  	this.$workPaperApi.searchWebsiteLinkUsingGET()
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.webSiteLinkArr = getData;
  		})
  		.catch(() => {
  			console.error();
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  /**
	 * Event
	 */
  handleClick(action) {
  	this.$emit('click', action);
  }

  /**
	 * Hooks
	 */
  created() {
  	this.getApi_websiteLink();
  }
}
</script>

<style lang="scss" scoped>
.actionBarWrap {
  margin-left: -3px;
  margin-right: -3px;
  .btn__icon-text {
    margin: 6px;
  }
}
</style>
<style lang="scss">
.linkButtonDropdown {
  padding-top: 4px;
  .ant-dropdown-menu {
    border: 1px solid $COLOR-MAIN14;
    border-radius: 0;
  }
  .ant-dropdown-menu-item {
    border-bottom: 1px solid $COLOR-MAIN14;
    > a {
      &:hover {
        color: $COLOR-MAIN14;
      }
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
