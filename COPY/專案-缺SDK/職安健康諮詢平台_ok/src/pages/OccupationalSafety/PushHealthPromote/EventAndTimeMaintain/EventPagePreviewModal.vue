<template>
  <a-modal
    v-model="modalVisible"
    class="common__modal cate__modal"
    :mask-closable="false"
    :after-close="handleClose"
    :footer="null"
    :width="'70%'"
  >
    <template slot="closeIcon">
      <a-icon type="close" />
    </template>
    <div class="previewModal__wrap">
      <div class="event__title">
        活動EDM Banner
      </div>
      <!-- banner -->
      <div class="block__content">
        <img
          class="img-fluid mt-3"
          :src="pic"
        >
      </div>
      <!-- banner img 外開連結 -->
      <div
        v-if="pic"
        class="link__block"
      >
        <a-icon
          type="paper-clip"
          class="icon__style"
        />
        <a
          :title="previewData.fileName"
          :href="pic"
          :download="previewData.fileName"
          class="link__style"
        >
          {{ previewData.fileName }}
        </a>
      </div>

      <!-- 活動摘要 -->
      <div class="event__block">
        <div class="event__title">
          活動摘要
        </div>
        <div class="info__item__content editor__preview">
          <div v-html="previewData.actSummary" />
        </div>
      </div>

      <!-- 活動說明 -->
      <div class="event__block">
        <div class="event__title">
          活動說明
        </div>
        <div class="info__item__content editor__preview">
          <div v-html="previewData.actDesc" />
        </div>
      </div>

      <!-- 個資聲明 -->
      <div class="event__block">
        <div class="event__title">
          個資聲明
        </div>
        <div class="block__content editor__preview">
          <div v-html="previewData.personalInfoStatement" />
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class EventPagePreviewModal extends Vue {
  @Prop()
  form: object

  @Prop()
  pic

  @Prop()
  visible: boolean

  /**
   * data
   */
  previewData = {};

  modalVisible = false;

  /**
   * func
   */

  /**
   * Event
   */
  handleClose() {
  	this.$emit('closeModal');
  }

  /**
   * Hook
   */
  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Watch('form', { immediate: true, deep: true })
  onFormChange(val) {
  	if (val) {
  		this.previewData = val;
  	}
  }
}
</script>
<style lang="scss" scoped>
.previewModal__wrap {
  padding: 15px 0 30px 0;
}
.event__block {
  margin-bottom: 20px;
  margin-top: 20px
}
.event__title {
  font-size: 16px;
  font-weight: $TEXT-BOLD;
  color: $COLOR-MAIN1;
  margin-bottom: 5px;
}
.img__content {
  width: 904px;
  height: 236px;
}

.link__block {
  margin-top: 20px;
  margin-bottom: 30px;
}

.icon__style {
  font-size: 11px !important;
  color: #8C8C8C;
}

.link__style {
  color: #1797FB;
  font-size: 14px;
}

.info__item__content {
  font-size: 16px;
  line-height: 29px;
  color: $COLOR-BLACK;
  ::v-deep {
    p {
      margin-bottom: 0;
    }
  }
}
.info__item__block {
  margin-top: 20px;
}
</style>
