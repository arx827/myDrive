<template>
  <div class="search-form">
    <template v-if="role !== '4'">
      <div class="search-form__item">
        <div class="search-form__label">
          資料類型
        </div>
        <a-select
          v-model="form.caseType"
          :disabled="form.toDo"
          show-search
          :filter-option="$global.filterOption"
          placeholder="請選擇資料類型"
          class="search-form__input--select"
          :allow-clear="true"
        >
          <a-select-option
            v-for="item in dataTypeList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
    </template>
    <div
      v-if="role !== 'ROLE_Auditor' && role !== 'ROLE_Audit_Team_Head'"
      class="search-form__item"
    >
      <div class="search-form__label">
        已認列組別
      </div>
      <a-select
        v-model="form.auditorTeam"
        :disabled="form.toDo"
        show-search
        :filter-option="$global.filterOption"
        :allow-clear="true"
        placeholder="請選擇已認列組別"
        class="search-form__input--select"
      >
        <a-select-option
          v-for="item in getGroupList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div
      v-if="role === 'ROLE_Audit_Team_Head' || role === 'ROLE_Auditor'"
      class="search-form__item"
    >
      <div class="search-form__label">
        認列狀態
      </div>
      <a-select
        v-model="form.claimStatus"
        :disabled="form.toDo"
        show-search
        :filter-option="$global.filterOption"
        :allow-clear="true"
        placeholder="請選擇認列狀態"
        class="search-form__input--select"
      >
        <a-select-option
          v-for="item in groupStatusList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div
      v-if="role !== 'ROLE_Audit_Team_Head' && role !== 'ROLE_Auditor'"
      class="search-form__item"
    >
      <div class="search-form__label">
        資料確認狀態
      </div>
      <a-select
        v-model="form.confirmStatus"
        :disabled="form.toDo"
        show-search
        :filter-option="$global.filterOption"
        :allow-clear="true"
        placeholder="請選擇資料確認狀態"
        class="search-form__input--select"
      >
        <a-select-option
          v-for="item in dataStatusList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div
      v-if="role === '4'"
      class="search-form__item"
    >
      <div class="search-form__label">
        年度
      </div>
      <a-select
        v-model="form.dataType"
        :disabled="form.toDo"
        show-search
        :filter-option="$global.filterOption"
        :allow-clear="true"
        class="search-form__input--select"
      >
        <a-select-option value="jack">
          110年
        </a-select-option>
      </a-select>
    </div>
    <div
      v-if="role === '4'"
      class="search-form__item"
    >
      <div class="search-form__label">
        月份
      </div>
      <a-select
        v-model="form.dataType"
        :disabled="form.toDo"
        show-search
        :filter-option="$global.filterOption"
        :allow-clear="true"
        class="search-form__input--select"
      >
        <a-select-option value="１">
          1月
        </a-select-option>
      </a-select>
    </div>
    <div class="search-form__item">
      <div class="search-form__label">
        資料摘要
      </div>
      <a-input
        v-model="form.summary"
        :disabled="form.toDo"
        :allow-clear="true"
        placeholder="請輸入摘要關鍵字"
        class="search-form__input--text"
      />
    </div>
    <div class="search-form__item">
      <a-form-model-item class="mb-0">
        <a-checkbox
          v-model="form.toDo"
          :disabled="todoDisabled"
        >
          待辦
        </a-checkbox>
      </a-form-model-item>
    </div>
    <button
      class="btn--search"
      @click="search"
    >
      查詢
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { SelectOptionDto, QueryDataCollectRequest } from '@fubonlife/iams-api-axios-sdk';
// export interface todoListDataInterface{
//   img: string;
//   title: string;
//   count: number;
// }

@Component({ components: { } })
export default class DataConfirmSearchForm extends Vue {
  @Prop()
  role: string;

  // 資料類型清單
  @Prop()
	dataTypeList: SelectOptionDto[];

  // 資料狀態清單
  @Prop()
	dataStatusList: SelectOptionDto[];

  // 認列狀態清單
  @Prop()
  groupStatusList: SelectOptionDto[];

  // 已認列組別清單
  @Prop()
	getGroupList: SelectOptionDto[];

  form: QueryDataCollectRequest = {
  	auditorTeam: undefined,
  	caseType: undefined,
  	claimStatus: undefined,
  	summary: undefined,
  	confirmStatus: undefined,
  	toDo: false,
  }

  get todoDisabled() {
  	return ['ROLE_Audit_Office_Boss_Vice', 'ROLE_Audit_Office_Boss'].includes(this.$global.getCurrentRoleId());
  }

  created() {
  	if (!this.todoDisabled) {
  		this.form.toDo = (this.$route.params.type === 'todo');
  	}
  	this.search();
  }

  search() {
  	this.$emit('search', this.form);
  }
}
</script>

<style lang="scss" scoped>

</style>
