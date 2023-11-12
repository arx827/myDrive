<template>
  <fragment>
    <!-- 3.裁罰案件、年度檢查重點 -->
    <a-form-model class="dataType_3">
      <div
        class="d-flex flex-wrap dataType__page"
        :class="{'hasCrawlerDataId': showCrawlerDataId}"
      >
        <!-- 資料型態 -->
        <a-form-model-item
          label="資料型態"
        >
          <a-input
            v-model="getDataType"
            type="text"
            disabled
          />
        </a-form-model-item>
        <!-- 發布日期 -->
        <a-form-model-item
          label="發布日期"
        >
          <a-input
            v-model="propData.releaseDate"
            type="text"
            disabled
          />
        </a-form-model-item>
        <!-- 代碼 -->
        <a-form-model-item
          v-if="showCrawlerDataId"
          label="代碼"
          class="align-items-center"
        >
          <span>{{ propData.crawlerDataId }}</span>
        </a-form-model-item>
        <!-- 標題 -->
        <a-form-model-item
          label="標題"
        >
          <a-input
            v-model="propData.subject"
            type="text"
            disabled
          />
        </a-form-model-item>
        <!-- 內容 -->
        <a-form-model-item
          label="內容"
        >
          <a-textarea
            v-model="propData.content"
            :auto-size="{ minRows: 1, maxRows: 7 }"
            disabled
          />
        </a-form-model-item>
        <!-- 連結 -->
        <div class="detail__link__wrap d-flex">
          <span class="detail__link__label">連結</span>
          <a
            class="detail__link col"
            :href="propData.pageUrl"
            target="_blank"
          >{{ propData.pageUrl }}</a>
        </div>
        <!-- 認列組別 -->
        <slot name="claimGroup" />
      </div>
    </a-form-model>
  </fragment>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, Emit,
} from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import ConfirmGroupForm from '@components/crawlerData/crawlerDetail/ConfirmGroupForm.vue';
import InspectedUnitModal from '@components/auditPlan/auditPlanIndex/InspectedUnitModal.vue';
import { Action, Getter, namespace } from 'vuex-class';

const detailModule = namespace('crawlerDataDetailVuex');

@Component({
	components: {
		IconTextButton,
		ConfirmGroupForm,
		InspectedUnitModal,
	},
})
export default class CrawlerDataType_3 extends Vue {
  @Prop()
  propData;

  @Prop({ default: false })
  showCrawlerDataId;

  get getDataType() {
  	if (this.propData.caseType) {
  		return Object.values(this.propData.caseType)[0];
  	}
  	return '';
  }
}
</script>

<style lang="scss" scoped>
	::v-deep {
    .ant-form-item {
      &:nth-child(1) {
        width: 40%;
      }
      &:nth-child(2) {
        width: 60%;
      }
    }
    .hasCrawlerDataId {
      .ant-form-item {
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5) {
          width: 100%;
        }
      }
    }
    :not(.hasCrawlerDataId) {
      .ant-form-item {
        &:nth-child(3),
        &:nth-child(4) {
          width: 100%;
        }
      }
    }
	}
</style>
