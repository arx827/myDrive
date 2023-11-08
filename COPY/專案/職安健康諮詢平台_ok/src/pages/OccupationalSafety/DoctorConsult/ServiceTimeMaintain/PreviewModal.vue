<template>
  <div>
    <div
      id="previewModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="previewModalLabel"
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
            <div class="previewModal__wrap">
              <div
                v-if="modalTitle"
                class="previewModal-header__wrap"
              >
                <h1 class="previewModal__title">
                  {{ modalTitle }}
                </h1>
              </div>
              <div class="previewModal-body__wrap">
                <!-- <slot name="body" /> -->
                <div
                  v-for="(block, index) in serviceTimeDataGroup"
                  :key="index"
                  class="serviceTime__wrap"
                >
                  <a-row
                    :gutter="[16, 16]"
                    class="serviceTime__block bg__light"
                  >
                    <template v-for="(info, index) in block.infoGroup">
                      <a-col
                        :key="index"
                        :span="info.colSpan"
                      >
                        <div
                          class="block__title"
                        >
                          {{ info.label }}
                        </div>
                        <div class="block__content">
                          <template v-if="info.type=='input'">
                            {{ form[info.key] }}
                          </template>
                          <template v-if="info.type=='dropdown'">
                            {{ getOptionLabel(info.key ) }}
                          </template>
                          <template v-if="info.type=='datePicker'">
                            {{ getDate(form[info.key]) }}
                          </template>
                          <template v-if="info.type=='timePicker'">
                            {{ getTime(form[info.key[0]], form[info.key[1]]) }}
                          </template>
                          <template v-if="info.type=='editor'">
                            <div v-html="form[info.key]" />
                          </template>
                          <template v-if="info.type=='radioAndDatePicker'">
                            <div>{{ getOptionLabel(info.key[0]) }}</div>
                            <div v-if="form[info.key[0]] == '0'">
                              {{ getDate(form[info.key[1]]) }}
                            </div>
                          </template>
                        </div>
                      </a-col>
                    </template>
                  </a-row>
                </div>
              </div>
            </div>
            <div class="previewModal-footer__wrap">
              <div class="modal-btn__wrap text-center">
                <button
                  class="btn__radius--primary--bg--small"
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
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

import moment from 'moment';

@Component({})
export default class PreviewModal extends Vue {
  @Prop()
  modalTitle: string

  @Prop()
  optionEnum: object

  @Prop()
  formData: object

	@Prop()
	serviceTimeDataGroup: {infoGroup: {key: string | Array<string>; label: string; colSpan: string; type: string}[]}[]

	opts = null;

  form = null;

  /**
   * Func
   */
  // 取得下拉選單的中文值
  getOptionLabel(key) {
  	const data = this.form[key];
  	if (this.opts[key]) {
  		return this.opts[key].find((i) => i.value == data) ? this.opts[key].find((i) => i.value == data).label : data;
  	}
  	return '';
  }

  // 格式化日期
  getDate(data) {
  	return data && moment(data).format('yy/MM/DD');
  }

  // 格式化時間
  getTime(start, end) {
  	const startTime = start && moment(start).format('HH:mm');
  	const endTime = end && moment(end).format('HH:mm');
  	if (startTime && endTime) {
  		return `${startTime} ~ ${endTime}`;
  	}
  	return startTime || endTime;
  }

  /**
   * Hook
   */
	@Watch('optionEnum', { immediate: true, deep: true })
  optionEnumOnChange(val) {
  	if (val) {
  		this.opts = JSON.parse(JSON.stringify(val));
  	}
  }

	@Watch('formData', { immediate: true, deep: true })
	formOnChange(val) {
		if (val) {
			this.form = JSON.parse(JSON.stringify(val));
		}
	}
}
</script>

<style lang="scss" scoped>
	.serviceTime__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
    .block__title {
      font-weight: 600;
      color: $COLOR-BLACK;
      margin-bottom: 10px;
    }
  }
  .previewModal__wrap {
    padding: 30px 80px;
  }
  .previewModal__title{
    font-weight: 600;
    font-size: 30px;
  }

  .modal-btn__wrap {
    margin-top: 0;
    margin-bottom: 30px;
  }
</style>
