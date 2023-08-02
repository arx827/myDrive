<template>
  <a-form-model
    ref="formRef"
    :layout="layout"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :label-align="labelAlign"
    :colon="colon"
  >
    <a-form-model-item
      v-for="levelState in levelStates"
      :key="levelState.config.property"
      :prop="levelState.config.property"
      :label="levelState.config.title"
    >
      <a-select 
        :style="selectStyle"
        :placeholder="levelState.config.placeholder"
        :mode="levelState.config.multiple ? 'multiple' : 'default'"
        :allow-clear="levelState.config.allowClear"
        :show-search="levelState.config.showSearch"
        option-filter-prop="children"
        v-model="levelState.value"
        @change="selectionChanged($event, levelState)"
      >
        <a-select-option
          v-for="option in levelState.options"
          :value="option.value"
          :key="option.value"
          :class="'opt'"
          >{{ option.label }}</a-select-option
        >
      </a-select>
    </a-form-model-item>
  </a-form-model>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { FblLevelConfig, FblLevelState } from "./models";
import { uuid } from "vue-uuid";
import {
  DEFAULT_BOOLEAN_OPERATORS,
  DEFAULT_DATETIME_OPERATORS,
  DEFAULT_DATE_OPERATORS,
  DEFAULT_NUMBER_OPERATORS,
  DEFAULT_STRING_OPERATORS,
  // FblFilter,
  FblFilterDataType,
  FblFilterItem,
  FblFilters,
  FblOperator,
  OPERATOR_TITLE_MAP,
} from "@/components/shared/filter-builder/models";
import { FormModel } from "ant-design-vue";

@Component
export default class FblLevelSelect extends Vue {
  public levelStates: FblLevelState[] = [];
  form: FormModel = null;

  @Prop()
  value!: { [key: string]: string | number };

  @Prop()
  levels!: FblLevelConfig[];

  @Prop({ default: false })
  disabled!: boolean;

  @Prop({default: () => { return {};}})
  labelCol: { span: number; offset?: number };

  @Prop({default: () => { return {};}})
  wrapperCol: { span: number; offset?: number };

  @Prop({default: 'horizontal'})
  layout: 'horizontal'|'vertical'|'inline';

  @Prop({default: 'right'})
  labelAlign: 'left' | 'right';

  @Prop({default: true})
  colon: boolean;

  @Prop({default: () => { return {};}})
  selectStyle: any;


  @Watch("value")
  onValueChanged(
    value: { [key: string]: string | number },
    oldValue: FblFilters
  ) {
    if (value === null || value === undefined) {
      this.clear();
      return;
    }
    this.levelStates.forEach((s) => {
      s.value = value[s.config.property];
    });
  }

  @Watch("levels")
  onPropertyChanged(value: FblLevelConfig[], oldValue: FblLevelConfig[]) {
    const selectedValues = this.levelStates.map((s) => s.value);
    this.levelStates = value.map((config, idx, arr) => {
      return {
        isFirst: idx === 0,
        isLast: idx === arr.length - 1,
        config,
        options: [],
        value: selectedValues.length > idx ? selectedValues[idx] : null,
      };
    });
    this.reloadOptions();
  }

  selectionChanged(value: string | number, currLevel: FblLevelState) {
    if(!currLevel.isLast){
        const idx = this.levelStates.indexOf(this.levelStates.filter(s => s.config.property === currLevel.config.property)[0]);
        for (let i = idx+1; i < this.levelStates.length; i++) {
          const s = this.levelStates[i];
          this.reloadOptionsInternal(s, i, this.levelStates, true);
        }
    }
    this.emitValue();
  }
  clear() {
    this.levelStates.forEach((s) => {
      s.value = s.config.multiple ? [] : null;
    });
  }
  emitValue() {
    this.$emit(
      "input",
      this.levelStates.reduce(function (map, s) {
        map[s.config.property] = s.value;
        return map;
      }, {})
    );
  }

  reloadOptions() {
    this.levelStates.forEach((s, idx, arr) => {
      this.reloadOptionsInternal(s, idx, arr, false);
    });
  }

  reloadOptionsInternal(
    currLevel: FblLevelState,
    idx: number,
    states: FblLevelState[],
    resetValue: boolean
  ) {
    const prevLevel = !currLevel.isFirst ? states[idx - 1] : null;
    const nextLevel = !currLevel.isLast ? states[idx + 1] : null;
    if(resetValue){
      currLevel.value = currLevel.config.multiple ? [] : null;
    }
    currLevel.config.load(prevLevel).then((options) => {
      currLevel.options = options;
      // if (nextLevel) {
      //   if (nextLevel.value !== null && nextLevel.value !== undefined) {
      //     this.reloadOptionsInternal(nextLevel, idx + 1, states, resetValue);
      //   }
      // }
    });
  }
  // uuid() {
  //   return uuid.v4();
  // }

  created() {
    const value = this.value ? this.value : {};
    this.levelStates = this.levels.map((lv, idx, arr) => {
      return {
        isFirst: idx === 0,
        isLast: idx === arr.length - 1,
        config: lv,
        options: [],
        value: value[lv.property] as string | number,
      };
    });
    this.emitValue();
    this.reloadOptions();
  }
}
</script>

<style scoped>
</style>