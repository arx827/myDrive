<template>
  <div>
    <ul
      v-if="itemInfo.optDescList !== null"
      class="lists__itemGroup"
    >
      <li
        v-for="(item, index) in itemInfo.optDescList"
        :key="index"
        class="questOpts-wrap item__disc"
      >
        <!-- 動態綁定檢核規則 -->
        <a-form-model-item
          :prop="'itemList.'+fieldKey+'.optDescList.'+index+'.content'"
          :rules="[{ required: true, trigger: 'change', message: '選項文字不能空白'}]"
        >
          <a-input
            v-model="item.content"
            class="question__input"
            type="text"
          />
        </a-form-model-item>
        <div class="d-flex">
          <a-icon
            type="plus"
            class="question__icon"
            @click="handleAdd(item.id, 'optDescList')"
          />
          <a-icon
            type="minus"
            class="question__icon"
            @click="handleDelete(item.id, 'optDescList')"
          />
        </div>
      </li>
    </ul>
    <a-button class="btn__required__weight">
      權重
    </a-button>
    <ul
      v-if="itemInfo.options !== null"
      class="lists__itemGroup"
    >
      <li
        v-for="(item, index) in itemInfo.weightingList"
        :key="index"
        class="questOpts-wrap item__decimal"
      >
        <a-form-model-item
          :prop="'itemList.'+fieldKey+'.weightingList.'+index+'.content'"
          :rules="[{ required: true, trigger: 'change', message: '權重文字不能空白'}]"
        >
          <a-input
            v-model="item.content"
            type="text"
            class="question__input"
          />
        </a-form-model-item>
        <div class="d-flex">
          <a-icon
            type="plus"
            class="question__icon"
            @click="handleAdd(item.id, 'weightingList')"
          />
          <a-icon
            type="minus"
            class="question__icon"
            @click="handleDelete(item.id, 'weightingList')"
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
export default class Matrix extends Vue {
  @Prop()
  fieldKey

  @Prop()
  formItem

  /**
   * data
   */
  isFixed = false;

  itemInfo = {
  	optDescList: [],
  	weightingList: [],
  };

  /**
   * Event
   */
  // 點擊icon (+)，『新增』
  handleAdd(id, key) {
  	const { itemInfo } = this;
  	const newItem: option = { content: '', id: uuid.v4() };
  	itemInfo[key].splice(itemInfo[key].indexOf(itemInfo[key].find((i) => i.id == id)) + 1, 0, newItem);
  }

  // 點擊icon (-)，『刪除』
  handleDelete(id, key) {
  	const { itemInfo } = this;
  	// 數量剩一個時, 不得刪除
  	if (itemInfo[key].length == 1) {
  		return;
  	}
  	itemInfo[key].splice(itemInfo[key].indexOf(itemInfo[key].find((i) => i.id == id)), 1);
  }

  /**
   * 監聽
   */
  @Watch('formItem', { immediate: true, deep: true })
  onFormItemChanged(val) {
  	if (val) {
  		const { optDescList, weightingList } = val;
  	  this.itemInfo.optDescList = optDescList;
  	  this.itemInfo.weightingList = weightingList;
  	}
  }

	@Watch('itemInfo', { deep: true })
  itemInfoChanged(newItemInfo) {
  	Object.keys(newItemInfo).forEach((key) => {
  		this.$emit('itemInfoChange', {
  			id: this.formItem.id,
  			key,
  			newOptList: newItemInfo[key],
  		});
  	});
  }
}
</script>
<style lang="scss" scoped>
.btn__required__weight {
  padding: 0px 14px;
  margin-top: 20px;
  height: 25px;
  background-color: #000000;
  color: $COLOR-WHITE;
}
.questOpts-wrap {
  display: flex;
  align-items: center;
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
    &:first-of-type {
      margin-left: 20px;
    }
  }
  .ant-input-disabled {
    background-color: transparent;
    color: $COLOR-BLACK;
    cursor: not-allowed;
  }
}
.lists__itemGroup {
  counter-reset: c;
  li {
    margin-top: 10px;
    &.item__disc::before{
      margin-right: 5px;
      content:counter(c, disc);
      counter-increment:c;
      display:inline-block;
    }
    &.item__decimal::before{
      margin-right: 5px;
      content:counter(c, decimal);
      counter-increment:c;
      display:inline-block;
    }
  }
}
</style>
