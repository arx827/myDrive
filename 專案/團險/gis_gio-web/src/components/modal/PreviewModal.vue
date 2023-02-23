<template>
  <div class="ant-modal-root customModal">
    <div class="ant-modal-mask" />
    <div tabindex="-1" role="dialog" class="ant-modal-wrap ant-modal-centered">
      <div role="document" class="ant-modal">
        <div class="ant-modal-content">
          <button type="button" aria-label="Close" class="ant-modal-close" @click="onPreviewModalClose">
            <span class="ant-modal-close-x">
              <i aria-label="icon: close" class="anticon anticon-close ant-modal-close-icon">
                <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                  <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                </svg>
              </i>
            </span>
          </button>
          <div class="ant-modal-body">
            <div class="previewWrap">
              <img class="previewImg img-fluid" :src="previewObj.imgUrl" alt="">
            </div>
            <div v-if="previewObj.title || previewObj.content" class="previewInfoWrap">
              <p class="previewTitle" :class="{'noTitle': previewObj.title.trim().length <= 0}">
                {{ previewObj.title }}
              </p>
              <p class="reviewCsontent">
                {{ previewObj.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Watch, Prop,
} from 'vue-property-decorator';

@Component({})
export default class PreviewModal extends Vue {
  @Prop()
  previewObj;

/**
 * Event
 */
  onPreviewModalClose() {
    this.$emit('close');
  }
}
</script>

<style lang="scss" scoped>
  .ant-modal {
    padding-bottom: 0;
  }
  .ant-modal-content {

  }
  .ant-modal-body {
    width: 350px;
    height: 350px;
    border-radius: 4px;
    overflow: hidden;
    padding: 0;
    position: relative;
  }
  .previewWrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .previewImg {
    min-width: 350px;
  }
  .ant-modal-close {
    left: -25px;
    top: -25px;
    border-radius: 50vh;
    border: 2px solid #FFF;
    .ant-modal-close-x {
      width: 20px;
      height: 20px;
      line-height: 1;
    }
    .ant-modal-close-icon {
      color: #FFF;
      font-size: 12px;
    }
  }
  .previewInfoWrap {
    position: absolute;
    bottom: 0;
    background: rgba(0, 0, 0, 70%);
    color: #FFF;
    padding: 20px;
    width: 100%;
  }
  .previewTitle {
    font-size: 20px;
    font-weight: bold;
    &:not(.noTitle) {
      + .previewContent {
        margin-top: 15px;
      }
    }
  }
  .previewContent {
    font-size: 14px;
  }
</style>
