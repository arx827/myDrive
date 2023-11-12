<template>
  <div>
    <!-- Modal -->
    <div
      id="relevantScaleModel"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="relevantScaleModelLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <button
            type="button"
            class="modal-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <a-icon type="close" />
          </button>
          <div class="modal-body">
            <div class="event__wrap">
              <div class="event__block">
                <div class="page__title mt-0">
                  疾病風險參考
                </div>
                <div class="page__content">
                  十年內男女罹患心血管疾病之風險估算值
                </div>
              </div>
              <div class="img__scroll">
                <div class="img__wrap">
                  <img :src="imgData">
                </div>
              </div>
            </div>
            <div class="btn__wrap">
              <button
                class="btn__radius--primary"
                data-bs-dismiss="modal"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RelevantScaleModel extends Vue {
  @Prop()
	imgData
}
</script>

<style lang="scss" scoped>
  #relevantScaleModel {
    padding: 30px;
    margin-top: 30px;
  }
  .event__wrap {
    padding: 6px;
    line-height: 28px;
    @include rwd-lg {
      padding: 16px 70px;
    }
  }
  .img__scroll {
		overflow: scroll;
    height: 400px;
    width: 100%;
    @include rwd-sm {
      width: 100%;
      height: 100%;
    }
  }
	.img__wrap {
    height: 560px;
    width: 900px;
    img {
      width: 100%;
      height: 100%;
    }
    @include rwd-sm {
      width: 100%;
      height: 100%;
    }
	}
  .event__block {
    margin-bottom: 20px;
  }
  .btn__wrap {
    margin-top: 20px;
    margin-bottom: 26px;
    text-align: center;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
