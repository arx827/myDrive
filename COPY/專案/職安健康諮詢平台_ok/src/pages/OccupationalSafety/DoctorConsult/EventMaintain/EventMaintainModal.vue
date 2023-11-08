<template>
  <div>
    <!-- Modal -->
    <div
      id="exampleModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- <div class="modal-header border-0 p-0"> -->
          <button
            type="button"
            class="modal-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <a-icon type="close" />
          </button>
          <!-- </div> -->
          <div class="modal-body">
            <div class="event__wrap">
              <div class="event__block">
                <div class="block__title">
                  活動EDM Banner
                </div>
                <div class="block__content">
                  <img
                    class="img-fluid mt-3"
                    :src="pic"
                  >
                </div>
              </div>
              <div class="event__block">
                <div class="block__title">
                  活動說明
                </div>
                <div class="block__content editor__preview">
                  <div v-html="description" />
                </div>
              </div>
              <div class="event__block">
                <div class="block__title">
                  預約規範
                </div>
                <div class="block__content editor__preview">
                  <div v-html="appointmentSpec" />
                </div>
              </div>
              <div class="event__block">
                <div class="block__title">
                  個資聲明
                </div>
                <div class="block__content editor__preview">
                  <div v-html="personalInfoStatement" />
                </div>
              </div>
            </div>
            <div class="btn__wrap text-center">
              <button
                class="btn__radius--primary"
                data-bs-dismiss="modal"
              >
                關閉
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
export default class EventMaintainModal extends Vue {
  @Prop()
  pic: string

  @Prop()
  description: string

  @Prop()
  appointmentSpec: string

  @Prop()
  personalInfoStatement: string
}
</script>

<style lang="scss" scoped>
  .event__wrap {
    padding: 30px 10%;
    line-height: 28px;
    ol {
      list-style: decimal;
    }
    ul {
      list-style: disc;
    }
    ol,ul {
      margin-left: 20px;
    }
  }
  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    color: $COLOR-MAIN1;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
