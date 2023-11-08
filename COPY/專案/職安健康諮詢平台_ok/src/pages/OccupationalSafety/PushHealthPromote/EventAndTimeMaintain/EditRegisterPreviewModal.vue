<template>
  <!-- Modal -->
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
      <div
        v-for="(item, infoIndex) in previewInfoGroup"
        :key="infoIndex"
        class="quest__item"
      >
        <template v-if="item.enabled=='Y'">
          <div
            v-if="item.type!=0"
            class="previewForm__label"
          >
            <label>{{ item.title }}</label>
            <span
              v-if="item.isAnswer=='Y'"
              class="mark-required"
            >*</span>
          </div>
          <div class="previewForm__desc">
            <template v-if="item.type == 0">
              <h2 class="classification__label">
                {{ item.title }}
              </h2>
            </template>
            <template v-if="item.type == 1">
              <a-input
                allow-clear
                :placeholder="placeholder[infoIndex] || '請填入文字'"
              />
            </template>
            <template v-if="item.type == 2">
              <a-textarea :placeholder="placeholder[infoIndex] || '請填入文字'" />
            </template>
            <template v-if="item.type == 3">
              <a-row :gutter="[16,8]">
                <a-radio-group class="w-100">
                  <template v-for="(mcOpt, mcIndex) in item.optDescList">
                    <a-col
                      v-if="mcOpt.isDesc=='Y'"
                      :key="mcIndex"
                      :span="24"
                    >
                      <a-radio class="radioFormItem__default formItem__hasDesc">
                        {{ mcOpt.optionContent }}
                        <a-input
                          class="input_desc"
                          allow-clear
                          placeholder="請簡述原因，文字上限50字。"
                        />
                      </a-radio>
                    </a-col>
                    <a-col
                      v-else
                      :key="mcIndex"
                      :span="(item.title=='欲報名場次') ? 24 : 12"
                    >
                      <a-radio
                        class="radioFormItem__default"
                        :class="{'radioFormItem__session':item.title=='欲報名場次'}"
                        :value="mcOpt.sort"
                      >
                        {{ mcOpt.optionContent }}
                      </a-radio>
                    </a-col>
                  </template>
                </a-radio-group>
              </a-row>
            </template>
            <template v-if="item.type == 4">
              <a-row :gutter="[16,8]">
                <template
                  v-for="(mcqOpt, mcqIndex) in item.optDescList"
                >
                  <a-col
                    v-if="mcqOpt.isDesc=='Y'"
                    :key="mcqIndex"
                    :span="24"
                  >
                    <a-checkbox class="formItem__hasDesc">
                      {{ mcqOpt.optionContent }}
                      <a-input
                        class="input_desc"
                        allow-clear
                        placeholder="請簡述原因，文字上限50字。"
                      />
                    </a-checkbox>
                  </a-col>
                  <a-col
                    v-else
                    :key="mcqIndex"
                    :span="12"
                  >
                    <a-checkbox>
                      {{ mcqOpt.optionContent }}
                    </a-checkbox>
                  </a-col>
                </template>
              </a-row>
            </template>
            <template v-if="item.type == 5">
              <a-input
                allow-clear
                placeholder="請填入數字"
              />
            </template>
            <template v-if="item.type == 6">
              <a-rate allow-half />
            </template>
            <template v-if="item.type == 7">
              <div class="bg__light">
                <div class="row justify-content-center">
                  <div class="col-5" />
                  <div
                    v-for="(weightItem, weightItemIndex) in item.weightingList"
                    :key="weightItemIndex"
                    class="col matrix__label matrix__label--top"
                  >
                    {{ weightItem }}
                  </div>
                </div>
                <div
                  v-for="(radioItem, radioIndex) in item.optDescList"
                  :key="radioIndex"
                  class="matrix matrix__item"
                >
                  <a-radio-group
                    class="query__wrap row radio__wrap align-items-center justify-content-center"
                  >
                    <div class="col-5 d-flex align-items-center">
                      <div class="mark-required">
                        ＊
                      </div>
                      {{ radioItem.optionContent }}
                    </div>
                    <a-radio
                      v-for="(weight, weightIndex) in item.weightingList"
                      :key="weightIndex"
                      class="col"
                    />
                  </a-radio-group>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class EditRegisterPreviewModal extends Vue {
  @Prop()
  title: string

  @Prop()
  itemList

  @Prop()
  placeholder

  @Prop()
  visible: boolean

  /**
   * data
   */
  previewInfoGroup= [];

  rateCount: number = 5;

  modalVisible = false;

  /**
   * func
   */

  /**
   * Event
   */
  // 關閉彈窗
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

  @Watch('itemList', { immediate: true, deep: true })
  onItemListChange(val) {
  	if (val) {
  		this.previewInfoGroup = val;
  	}
  }
}
</script>
<style lang="scss" scoped>
.previewModal__wrap {
  padding: 15px 0 30px 0;
}
.radioFormItem__default {
  display: flex;
  align-items: center;
  font-weight: 400;
  &.radioFormItem__session {
    width: 100%;
    display: flex;
    align-items: center;
    background: $COLOR-MAIN10;
    padding: 15px;
    white-space: initial;
  }
}
.formItem__hasDesc {
  display: flex;
  align-items: center;
  ::v-deep {
    span.ant-radio + *, span.ant-checkbox + * {
      flex: 1;
      display: flex;
      align-items: center;
      padding-right: 0;
    }
  }
  .input_desc {
    margin-left: 15px;
    ::v-deep .ant-input {
      border: none;
      border-bottom: 1px solid #D1D1D1;
      border-radius: 0;
      padding: 0;
    }
  }
}
.quest__item {
  margin: 20px 0;
  font-weight: $TEXT-BOLD;
  color: $COLOR-BLACK;
}
.classification__label {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
  margin: 15px 0;
  color: $COLOR-BLACK;
}
::v-deep {
  input.ant-input{
    height: 40px;
  }
  .ant-rate{
    svg{
      font-size: 31px !important;
    }
  }
  .matrix__item {
    padding: 10px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(2n) {
      background-color: $COLOR-WHITE;
    }
    .ant-radio-wrapper {
      text-align: center;
    }
  }
  .matrix__block {
    flex: 1;
  }
  .matrix__label {
    white-space: initial;
    line-height: 2;
  }
  .matrix__label--left {
    text-align: left;
    padding-left: 10px;
  }
  .matrix__label--top {
    text-align: center;
  }
  .ant-radio-group {
    width: 100%;
  }
  .ant-radio-wrapper {
    margin-right: 0px !important;
  }
}
</style>
