<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="6">
        <a-select
          v-if="propertyOptions"
          :placeholder="'搜尋欄位'"
          style="width: 100%"
          mode="default"
          v-model="selectedFilterItemIndex"
          :dropdownMatchSelectWidth="false"
          :allowClear="true"
        >
          <a-select-option
            v-for="(option, index) in propertyOptions"
            :key="index"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select
          placeholder="搜尋條件"
          style="width: 100%"
          mode="default"
          v-model="selectedOperator"
          :dropdownMatchSelectWidth="false"
        >
          <a-select-option
            v-for="option in operatorOptions"
            :key="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="11">
        <div v-if="!isBinaryOperator">
          <a-input
            v-if="
              !selectedFilterItem ||
              !selectedFilterItem.dataType ||
              (selectedFilterItem.dataType === 'STRING' &&
                !selectedFilterItem.enum)
            "
            type="text"
            placeholder="條件值"
            v-model="operand1"
            :disabled="!selectedOperator"
          />
          <a-select
            v-if="
              selectedFilterItem &&
              selectedFilterItem.dataType === 'STRING' &&
              selectedFilterItem.enum
            "
            style="width: 100%"
            mode="default"
            :disabled="!selectedOperator"
            v-model="operand1"
            :dropdownMatchSelectWidth="false"
          >
            <a-select-option v-for="e in selectedFilterItem.enum" :key="e">
              {{ e }}
            </a-select-option>
          </a-select>

          <a-input-number
            v-if="
              selectedFilterItem &&
              selectedFilterItem.dataType === 'NUMBER' &&
              !selectedFilterItem.enum
            "
            style="width: 100%"
            :placeholder="'條件值'"
            :disabled="!selectedOperator"
            v-model="operand1"
            :min="selectedFilterItem.min"
            :max="selectedFilterItem.max"
            :step="selectedFilterItem.step"
          ></a-input-number>
          <a-select
            v-if="
              selectedFilterItem &&
              selectedFilterItem.dataType === 'NUMBER' &&
              selectedFilterItem.enum
            "
            style="width: 100%"
            mode="default"
            :disabled="!selectedOperator"
            v-model="operand1"
            :dropdownMatchSelectWidth="false"
          >
            <template v-if="selectedFilterItem">
              <a-select-option v-for="e in selectedFilterItem.enum" :key="e">
                {{ e }}
              </a-select-option>
            </template>
          </a-select>
          <a-select
            v-if="
              selectedFilterItem && selectedFilterItem.dataType === 'BOOLEAN'
            "
            style="width: 100%"
            mode="default"
            :disabled="!selectedOperator"
            v-model="operand1"
            :dropdownMatchSelectWidth="false"
          >
            <a-select-option :title="'TRUE'" :key="true"></a-select-option>
            <a-select-option :title="'FALSE'" :key="false"></a-select-option>
          </a-select>
          <a-date-picker
            v-if="selectedFilterItem && selectedFilterItem.dataType === 'DATE'"
            style="width: 100%"
            :disabled="!selectedOperator"
            :format="'YYYY/MM/DD'"
            v-model="operand1"
          ></a-date-picker>
          <a-date-picker
            v-if="
              selectedFilterItem && selectedFilterItem.dataType === 'DATETIME'
            "
            style="width: 100%"
            :showTime="true"
            format="YYYY/MM/DD HH:mm:ss"
            v-model="operand1"
          ></a-date-picker>
        </div>
        <a-row
          :gutter="8"
          v-if="
            selectedFilterItem &&
            isBinaryOperator &&
            selectedFilterItem.dataType === 'NUMBER'
          "
        >
          <a-col :span="11">
            <a-input-number
              style="width: 100%"
              v-model="operand1"
              :placeholder="'最小值'"
              :min="selectedFilterItem.min"
              :max="selectedFilterItem.max"
              :step="selectedFilterItem.step"
            ></a-input-number>
          </a-col>
          <a-col :span="2" style="text-align: center">~</a-col>
          <a-col :span="11">
            <a-input-number
              style="width: 100%"
              v-model="operand2"
              :placeholder="'最大值'"
              :min="selectedFilterItem.min"
              :max="selectedFilterItem.max"
              :step="selectedFilterItem.step"
            ></a-input-number>
          </a-col>
        </a-row>
        <a-range-picker
          v-if="
            selectedFilterItem &&
            isBinaryOperator &&
            selectedFilterItem.dataType === 'DATE'
          "
          style="width: 100%"
          :format="'YYYY/MM/DD'"
          v-model="dateRange"
        ></a-range-picker>
        <a-range-picker
          v-if="
            selectedFilterItem &&
            isBinaryOperator &&
            selectedFilterItem.dataType === 'DATETIME'
          "
          style="width: 100%"
          :format="'YYYY/MM/DD HH:mm:ss'"
          v-model="dateTimeRange"
          :showTime="true"
        ></a-range-picker>
      </a-col>
      <a-col :span="1">
        <a-button type="link" icon="plus-circle" @click="addFilter()" />
      </a-col>
    </a-row>
    <br />
    <a-row>
      <a-col :span="23">
        <a-tag
          v-for="(filter, index) in currentValue.filters"
          :key="uuid() + filter.property"
          closable
          @close="removeFilter(index)"
        >
          {{ generateDisplay(filter) }}
        </a-tag>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { uuid } from "vue-uuid";
import {
  DEFAULT_BOOLEAN_OPERATORS,
  DEFAULT_DATETIME_OPERATORS,
  DEFAULT_DATE_OPERATORS,
  DEFAULT_NUMBER_OPERATORS,
  DEFAULT_STRING_OPERATORS,
  FblFilter,
  FblFilterDataType,
  FblFilterItem,
  FblFilters,
  FblOperator,
  OPERATOR_TITLE_MAP,
} from "@/components/shared/filter-builder/models";

const DEFAULT_FILTER_ITEM: FblFilterItem = {
  property: "",
  title: "",
  dataType: FblFilterDataType.STRING,
};

@Component
export default class FblFilterBuilder extends Vue {
  public currentValue: FblFilters = { filters: [] };
  public propertyOptions: Array<{ label: string; value: FblFilterItem }> = [];
  public operatorOptions: Array<{ label: string; value: string }> = [];
  public selectedFilterItemIndex: number | null = null;
  // public selectedFilterItem: FblFilterItem | null = null;
  public selectedOperator: FblOperator | null = null;
  public operand1: any | null = null;
  public operand2: any | null = null;
  public dateRange: Array<any> = [];
  public dateTimeRange: Array<any> = [];
  public get isBinaryOperator() {
    return this.selectedOperator === FblOperator.BETWEEN;
  }
  public get selectedFilterItem(): FblFilterItem | null {
    if (
      this.selectedFilterItemIndex !== null &&
      this.selectedFilterItemIndex !== undefined
    ) {
      return this.propertyOptions[this.selectedFilterItemIndex].value;
    }
    this.clear();
    return null;
  }

  @Prop()
  value!: FblFilters;

  @Prop()
  items!: FblFilterItem[];

  @Prop({ default: false })
  disabled!: boolean;

  @Prop()
  initProperty: string;
  
  @Prop()
  initOperator: FblOperator; 

  @Watch("value")
  onValueChanged(value: FblFilters, oldValue: FblFilters) {
    this.currentValue = value;
  }

  @Watch("items")
  @Watch("disabled")
  onPropertyChanged(value: string, oldValue: string) {
    let a = 3;
    
    this.selectedOperator = null;
    this.operatorOptions = [];
    this.operand1 = null;
    this.operand2 = null;
  }

  @Watch("selectedFilterItemIndex")
  onSelectedFilterItemChanged() {
    const item = this.selectedFilterItem;
    if (item) {
      let operators: FblOperator[] = [];
      if (item.dataType === FblFilterDataType.STRING) {
        operators = DEFAULT_STRING_OPERATORS;
      } else if (item.dataType === FblFilterDataType.NUMBER) {
        operators = DEFAULT_NUMBER_OPERATORS;
      } else if (item.dataType === FblFilterDataType.BOOLEAN) {
        operators = DEFAULT_BOOLEAN_OPERATORS;
      } else if (item.dataType === FblFilterDataType.DATE) {
        operators = DEFAULT_DATE_OPERATORS;
      } else if (item.dataType === FblFilterDataType.DATETIME) {
        operators = DEFAULT_DATETIME_OPERATORS;
      }
      this.operatorOptions = operators
        .filter((o) =>
          item.excludedOperators
            ? item.excludedOperators.indexOf(o) === -1
            : true
        )
        .map((o) => {
          return {
            label: OPERATOR_TITLE_MAP[FblOperator[o]],
            value: o,
          };
        });
    }
  }

  @Watch("selectedOperator")
  onSelectedOperatorChanged(value: FblOperator, oldValue: FblOperator) {
    if (this.isBinaryOperator) {
      if (!this.operand1 || !this.operand2) {
        return;
      }
    } else {
      if (!this.operand1) {
        return;
      }
    }
  }
  @Watch("dateRange")
  onDateRangeChanged(): void {
    this.operand1 = this.dateRange[0];
    this.operand2 = this.dateRange[1];
  }

  @Watch("dateTimeRange")
  onDateTimeRangeChanged(): void {
    this.operand1 = this.dateTimeRange[0];
    this.operand2 = this.dateTimeRange[1];
  }

  findSchemaItemByProperty(name: string) {
    return this.items.filter((i) => i.property === name)[0];
  }

  clear() {
    this.selectedFilterItemIndex = null;
    this.selectedOperator = null;
    this.operatorOptions = [];
    this.operand1 = null;
    this.operand2 = null;
  }

  resetInit(){
    if(this.initProperty){
      const filterItem = this.findSchemaItemByProperty(this.initProperty);
      const idx = this.items.indexOf(filterItem);
      this.selectedFilterItemIndex = idx;
      this.onSelectedFilterItemChanged();
      if(this.initOperator){
        this.selectedOperator = this.initOperator;
      }
    }
  }

  generateDisplay(filter: FblFilter) {
    const filterItem = this.findSchemaItemByProperty(filter.property);
    const operandDisplay =
      filter.operand.length === 2
        ? `${filter.operand[0]} ~ ${filter.operand[1]}`
        : filter.operand[0];
    return `${filterItem.title} ${
      OPERATOR_TITLE_MAP[FblOperator[filter.operator]]
    } ${operandDisplay}`;
  }
  addFilter() {
    if (this.isBinaryOperator) {
      if (
        this.operand1 === undefined ||
        this.operand1 === null ||
        this.operand2 === undefined ||
        this.operand2 === null
      ) {
        return;
      }
    } else {
      if (this.operand1 === undefined || this.operand1 === null) {
        return;
      }
    }
    const filter: FblFilter = {
      property: this.selectedFilterItem!.property,
      operator: this.selectedOperator!,
      operand: this.isBinaryOperator
        ? [this.operand1, this.operand2]
        : [this.operand1],
    };
    this.currentValue.filters.push(filter);
    this.clear();
    this.resetInit();
    this.$emit("input", this.currentValue);
    //////////////this.onChange(this.value);
  }
  removeFilter(index) {
    if (index > -1) {
      this.currentValue.filters.splice(index, 1);
    }
    this.$emit("input", this.currentValue);
    //////////////this.onChange(this.value);
  }
  flush() {
    this.addFilter();
  }
  uuid() {
    return uuid.v4();
  }

  created() {
    this.currentValue = this.value;
    this.propertyOptions = this.items.map((i) => {
      return {
        label: i.title,
        value: i,
      };
    });
    this.resetInit();
  }
}
</script>

<style>
</style>