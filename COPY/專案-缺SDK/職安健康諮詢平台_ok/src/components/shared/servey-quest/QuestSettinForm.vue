<template>
  <div class="d-flex">
    <div class="question__block">
      <div class="event__title">
        編輯題目
      </div>
      <a-form-model
        v-if="form"
        ref="QuestSettingForm"
        :form="form"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :layout="'vertical'"
      >
        <!-- 拖移範圍 -->
        <draggable
          v-model="form.itemList"
          class="list-group"
          ghost-class="ghost"
          :move="onMove"
          @change="onDragChange"
        >
          <transition-group>
            <a-row
              v-for="(item, index) in form.itemList"
              :key="index"
              class="questItem__wrap"
            >
              <a-col
                :xs="11"
                :sm="10"
                :md="7"
                :lg="4"
              >
                <div
                  class="dragBtn-wrap"
                  :class="{'dragBtn-wrap__disabled': item.isFixed}"
                >
                  <div class="question__icon__default">
                    <i
                      class="icon-button"
                      :class="getQuestType(item.type, 'className')"
                    />
                  </div>
                  <div
                    class="question__icon__default"
                    :class="iconClass(item)"
                  >
                    <a-icon
                      v-if="item.isFixed"
                      type="pushpin"
                      theme="filled"
                      class="btn__icon--white draggable__pushpin"
                    />
                    <div class="question__item">
                      {{ getQuestSeq(item) }}
                    </div>
                    <a-icon
                      v-if="item.isAnswer=='Y'"
                      type="star"
                      theme="filled"
                      class="btn__icon--white draggable__star"
                    />
                  </div>
                </div>
              </a-col>
              <a-col
                :xs="13"
                :sm="14"
                :md="17"
                :lg="19"
              >
                <div class="question__title">
                  <!-- 動態綁定檢核規則 -->
                  <a-form-model-item
                    :prop="'itemList.'+ index +'.title'"
                    :rules="rules.title"
                  >
                    <a-input
                      v-model="item.title"
                      type="text"
                      :disabled="item.isFixed"
                      placeholder="請輸入標題"
                    />
                    <div
                      v-if="!item.isFixed"
                      slot="label"
                      class="questTitle__panel"
                    >
                      <a-button
                        class="btn__remove"
                        @click.self="remove(item)"
                      >
                        <a-icon
                          type="delete"
                        />
                      </a-button>
                      <a-switch
                        v-model="item.enabled"
                        checked-children="啟用"
                        un-checked-children="停用"
                      />
                    </div>
                  </a-form-model-item>
                </div>
                <a-button
                  v-if="!item.isFixed && item.type!==0"
                  class="btn__required__default"
                  :class="{'btn__required__selected': item.isAnswer=='Y'}"
                  @click="handleRequired(item)"
                >
                  <a-icon
                    type="star"
                    theme="filled"
                  />
                  必選
                </a-button>
                <div class="question__desc">
                  <template v-if="item.type == 1 || item.type == 5">
                    <a-input type="text" />
                  </template>
                  <template v-if="item.type == 2">
                    <a-textarea />
                  </template>
                  <template v-if="item.type == 3 || item.type == 4">
                    <Radio
                      :form-item="item"
                      :field-key="index"
                      @itemInfoChange="itemInfoChange"
                    />
                  </template>
                  <template v-if="item.type == 6">
                    <a-rate
                      v-model="rateCount"
                      allow-half
                    />
                  </template>
                  <template v-if="item.type == 7">
                    <Matrix
                      :form-item="item"
                      :field-key="index"
                      @itemInfoChange="itemInfoChange"
                    />
                  </template>
                </div>
              </a-col>
            </a-row>
          </transition-group>
        </draggable>
      </a-form-model>
      <a-divider class="divider--green" />
    </div>
    <div class="choose__type__block btn__block bg__light">
      <div class="event__title">
        選擇題型
      </div>
      <div
        v-for="(btnItem, index) in serveyQuestTypeEnum"
        :key="index"
      >
        <QuestTypeBtn
          :btn-item="btnItem"
          @addQuestItem="addQuestItem"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import Radio from '@/components/shared/servey-quest/Radio.vue';
import Matrix from '@/components/shared/servey-quest/Matrix.vue';
import QuestTypeBtn from '@/components/shared/servey-quest/QuestTypeBtn.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { uuid } from 'vue-uuid';
import { questionnaireItem, questType } from './model';

@Component({ components: { Radio, Matrix, QuestTypeBtn } })
export default class QuestSettinForm extends Vue {
  @Prop()
  dataSource

  /**
   * data
   */
  // 星星總數
  rateCount: number = 5;

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
  	title: [{ required: true, trigger: 'change', message: '題目標題不能空白' }],
  }

  filterItemList = [];

  form = {
  	itemList: [],
  };

  // 問卷題型
  serveyQuestTypeEnum: questType[] = [
  	{
  		key: 0, val: '分類標題', className: 'button_title',
  	},
  	{
  		key: 1, val: '單行文字', className: 'button_singleLine',
  	},
  	{
  		key: 2, val: '多行文字', className: 'button_mtext',
  	},
  	{
  		key: 3, val: '單選題', className: 'button_MC',
  	},
  	{
  		key: 4, val: '多選題', className: 'button_MCQ',
  	},
  	{
  		key: 5, val: '數字題', className: 'button_number',
  	},
  	{
  		key: 6, val: '星級評分', className: 'button_star',
  	},
  	{
  		key: 7, val: '矩陣題', className: 'button_matrix',
  	},
  ]

  /**
   * func
   */
  // 新增對應的題型項目
  addQuestItem(type) {
  	let optDescList;
  	let weightingList;
  	switch (type) {
  	case 3:
  		optDescList = [{
  			id: uuid.v4(),
  			content: '',
  			isDesc: false,
  		}];
  		break;
  	case 4:
  		optDescList = [{
  			id: uuid.v4(),
  			content: '',
  			isDesc: false,
  		}];
  		break;
  	case 7:
  		optDescList = [{
  			id: uuid.v4(),
  			content: '',
  		}];
  		weightingList = [{
  			id: uuid.v4(),
  			content: '',
  		}];
  		break;
  	default:
  		optDescList = null;
  		weightingList = null;
  	}

  	const newAddItem: questionnaireItem = {
  		id: uuid.v4(),
  		title: '',
  		sort: this.form.itemList.length + 1,
  		type,
  		optDescList,
  		isAnswer: 'N',
  		enabled: true,
  		weightingList,
  	};
  	this.form.itemList.push(newAddItem);
  }

  // 取得題目序號
  getQuestSeq(item) {
  	const arr = (this.filterItemList.length > 0) ? this.filterItemList : this.form.itemList;
  	return (item.type == 0) ? '' : arr.map((i) => i.id).indexOf(item.id) + 1;
  }

  getQuestType(index: number, property: string) {
  	if (this.serveyQuestTypeEnum.find((i) => i.key === index)) {
  		return this.serveyQuestTypeEnum.find((i) => i.key === index)[property];
  	}
  	return '';
  }

  // 控制圖標icon css
  iconClass(item) {
  	const iconWrap = (item.isFixed || item.isAnswer == 'Y') ? 'question__icon__fixed' : 'align-items-center';
  	return iconWrap;
  }

  // 更新輸入資訊
  itemInfoChange(data) {
  	const { id, key, newOptList } = data;
  	this.form.itemList.find((i) => i.id == id)[key] = newOptList;
  }

  // 控制區塊是否可拖曳
  onMove({ relatedContext, draggedContext }) {
  	const relatedElement = relatedContext.element;
  	const draggedElement = draggedContext.element;
  	return (
  		(!relatedElement || !relatedElement.isFixed) && !draggedElement.isFixed
  	);
  }

  // 修改排序數字
  onDragChange() {
  	this.form.itemList.map((ele, index) => {
  		ele.sort = index + 1;
  	});
  }

  // 刪除
  remove(item) {
  	const index = this.form.itemList.indexOf(this.form.itemList.find((i) => i.id == item.id));
  	this.form.itemList.splice(index, 1);
  	// 修改排序
  	this.onDragChange();
  }

  validateForm(action) {
  	(this.$refs.QuestSettingForm as any).validate()
  		.then(() => {
  			const $submitItemList = this.form.itemList.map((item) => {
  				const {
  					id, enabled, weightingList, ...other
  				} = item;
  				if (weightingList) {
  					return {
  						enabled: (enabled) ? 'Y' : 'N',
  						weightingList: weightingList.map((i) => (i.content)),
  						...other,
  					};
  				}
  				return {
  					enabled: (enabled) ? 'Y' : 'N',
  					...other,
  				};
  			});
  			this.$emit('afterValidate', { action, questionList: $submitItemList });
  		})
  		.catch((error) => {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  		});
  }

  /**
   * Event
   */
  // 點擊按鈕，『必選』
  handleRequired(item) {
  	item.isAnswer = (item.isAnswer == 'Y') ? 'N' : 'Y';
  }

  handleSwitchChange(checked: boolean, record) {
  	this.form.itemList.find((i) => i.id == record.id).enabled = checked ? 'Y' : 'N';
  }

  /**
   * Hook
   */

	/**
   * 監聽
   */
	@Watch('dataSource', { immediate: true, deep: true })
  onDataSourceChanged(value) {
  	value.forEach((item, index) => {
  		const {
  			enabled, optDescList, weightingList, ...otherAttrs
  		} = item;
  		this.$set(this.form.itemList, index, {
  			id: uuid.v4(),
  			enabled: !!(enabled == 'Y'),
  			isFixed: false,
  			optDescList: optDescList && optDescList.map((opt) => ({
  				id: uuid.v4(),
  				content: opt.content,
  				isDesc: opt.isDesc,
  			})),
  			weightingList: weightingList && weightingList.map((opt) => ({
  				id: uuid.v4(),
  				content: (typeof (opt) == 'string') ? opt : opt.content,
  			})),
  			...otherAttrs,
  		});
  	});
  }

	@Watch('form.itemList', { deep: true })
	onItemListChanged(value) {
		// 過濾「分類標題」題型
  	this.filterItemList = [...value].filter((i) => i.type !== 0);
	}
}
</script>

<style lang="scss" scoped>
.event__title {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
}
.btn__block {
  margin-top: 20px;
  padding: 20px 25px 20px 25px;
  border-radius: 10px;
}
.dragBtn-wrap {
  display: flex;
  &.dragBtn-wrap__disabled {
    .question__icon__default, .question__icon__default>i {
      cursor: not-allowed;
    }
  }
  .question__icon__default {
    display: flex;
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    &:first-of-type {
      margin-right: 5px;
      background-color: #BDBDBD;
      align-items: center;
    }
    &:last-of-type {
      background-color: #23C4A8;
      ::v-deep svg{
        font-size: 12px;
      }
    }
    ::v-deep svg{
      font-size: 16px;
    }
  }
  .question__item {
    color: $COLOR-WHITE;
    font-size: 20px;
  }
}
.question__title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  ::v-deep .ant-form-item {
    padding: 0;
    margin: 0;
    width: 100%;
    display: flex;
    .ant-form-item-label {
      order: 2;
      padding: 0;
    }
    .ant-form-item-control-wrapper {
      order: 1;
      flex: 1;
    }
  }
  .ant-input {
    padding: 0;
    border: none;
    border-bottom: 2px solid #D2D2D2;
    border-radius: 0;
    &:focus, &:hover {
      box-shadow: none;
    }
    &.ant-input-disabled {
      background-color: transparent;
      color: $COLOR-BLACK;
      cursor: not-allowed;
    }
  }
  .has-error {
    .ant-input {
      box-shadow: none;
      border-color: #f5222d;
    }
  }

  .questTitle__panel {
    display: flex;
    align-items: center;
    padding-left: 10px;
    border-bottom: 2px solid #D2D2D2;
    padding-bottom: 2px;
    .btn__remove {
      border: none;
      max-height: 25px;
      padding: 0;
    }
    .ant-switch {
      margin-left: 10px;
      width: 57px;
    }
  }
}
.question__desc {
  margin-top: 10px;
}
.questTypeBtn {
  display: flex;
  align-items: center;
  padding: 0;
  color: $COLOR-GRAY1;
  border-radius: 4px;
  &:focus, &:hover {
    background-color: #E6F7FF;
  }
  @include rwd-xl {
    width: 150px;
  }
  .questTypeBtn__icon {
    background-color: $BUTTON-MAIN;
    border-radius: 3px 0 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .questTypeBtn__label {
    white-space: initial;
    text-align: left;
    line-height: 1.5;
    padding: 10px;
  }
}
.btn__icon--white {
  color: $COLOR-WHITE;
  &.draggable__pushpin {
    position: absolute;
    left: 2px;
    top: 3px;
  }
  &.draggable__star {
    position: absolute;
    right: 2px;
    top: 3px;
  }
}
.questItem__wrap {
  margin-top: 40px;
}
.question__block {
  flex: 1;
  padding: 20px 25px 0 0;
}
.ant-input-lg {
  font-size: 16px;
}
.handle {
  color: $COLOR-WHITE;
}
.divider--green {
  height: 2px;
  background-color: $COLOR-MAIN1;
  margin-bottom: 0;
}
::v-deep {
  .ant-rate{
    svg{
      font-size: 31px !important;
    }
  }
}
</style>
