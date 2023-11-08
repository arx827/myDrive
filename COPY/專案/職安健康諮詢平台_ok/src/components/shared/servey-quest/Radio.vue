<template>
  <div>
    <ul class="lists__english">
      <li
        v-for="(item, index) in itemInfo.optDescList"
        :key="index"
        class="questOpts-wrap"
      >
        <!-- 動態綁定檢核規則 -->
        <a-form-model-item
          class="optItem__input"
          :prop="'itemList.'+fieldKey+'.optDescList.'+index+'.content'"
          :rules="[{ required: true, trigger: 'change', message: '選項文字不能空白'}]"
        >
          <a-input
            v-model="item.content"
            :disabled="!!(formItem.isFixed)"
            class="question__input"
            type="text"
          />
        </a-form-model-item>
        <div
          v-if="!!!(formItem.isFixed)"
          class="optItem__panel"
        >
          <a-checkbox v-model="item.isDesc">
            含簡述
          </a-checkbox>
          <a-icon
            type="plus"
            class="question__icon"
            @click="handleAdd(item.id)"
          />
          <a-icon
            type="minus"
            class="question__icon"
            @click="handleDelete(item.id)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import { option } from './model';

@Component({ })
export default class Radio extends Vue {
  @Prop()
  fieldKey

  @Prop()
  formItem

  /**
   * data
   */
  rateCount: number = 5;

  itemInfo = {
  	optDescList: [],
  };

  /**
   * Event
   */
  // 點擊icon (+)，『新增』
  handleAdd(id) {
  	const { optDescList } = this.itemInfo;
  	const newItem: option = { content: '', id: uuid.v4() };
  	optDescList.splice(optDescList.indexOf(optDescList.find((i) => i.id == id)) + 1, 0, newItem);
  }

  // 點擊icon (-)，『刪除』
  handleDelete(id) {
  	const { optDescList } = this.itemInfo;
  	// 數量剩一個時, 不得刪除
  	if (this.itemInfo.optDescList.length == 1) {
  		return;
  	}
  	optDescList.splice(optDescList.indexOf(optDescList.find((i) => i.id == id)), 1);
  }

  /**
   * 監聽
   */
 @Watch('formItem', { immediate: true, deep: true })
  onFormItemChanged(val) {
  	if (val) {
  		this.itemInfo.optDescList = val.optDescList;
  	}
  }

	@Watch('itemInfo.optDescList', { deep: true })
 onItemInfoChanged(newOpt: option) {
  	this.$emit('itemInfoChange', {
  		id: this.formItem.id,
  		key: 'optDescList',
  		newOptList: newOpt,
  	});
 }
}
</script>
<style lang="scss" scoped>
.questOpts-wrap {
  display: flex;
  align-items: center;
  .optItem__input {
    flex: 1;
  }
  .optItem__panel {
    display: flex;
    align-items: center;
    margin-left: 25px;
  }
  .questOpts__item {
    width: 100%;
  }
  .ant-form-item {
    padding: 0;
    margin: 0;
    width: 100%;
  }
  .question__input {
    margin-left: 10px;
  }
  .question__icon {
    cursor: pointer;
    margin-left: 5px;
  }
  .ant-input-disabled {
    background-color: transparent;
    color: $COLOR-BLACK;
    cursor: not-allowed;
  }
}
.lists__english {
  counter-reset: c;
  li {
    margin-top: 10px;
    &::before{
      margin-right: 5px;
      content:counter(c, lower-alpha);
      counter-increment:c;
      display:inline-block;
    }
  }
}
</style>
