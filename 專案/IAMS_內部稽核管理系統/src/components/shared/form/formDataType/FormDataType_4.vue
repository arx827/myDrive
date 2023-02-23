<template>
  <!-- 4.事件清單、委外作業清單 -->
  <a-form-model class="dataType_4">
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
      <!-- 資料檔案 -->
      <a-form-model-item
        label="資料檔案"
      >
        <a-input
          v-model="propData.fileName"
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
      <!-- 認列組別 -->
      <slot name="claimGroup" />
    </div>
  </a-form-model>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class CrawlerDataType_4 extends Vue {
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
        &:nth-child(3) {
          width: 100%;
        }
      }
    }
	}
</style>
