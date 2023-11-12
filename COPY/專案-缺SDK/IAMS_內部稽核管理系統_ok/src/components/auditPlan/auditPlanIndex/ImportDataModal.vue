<template>
  <InfoModal
    title="重點查核項目-選擇項目匯入舊資料"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    :height-full-screen="true"
    :centered="false"
    :footer="true"
    @closeModal="close"
    @confirmModal="importData"
  >
    <template slot="content">
      <div class="content">
        <div class="search">
          <div class="search__item">
            <div class="search__label">
              月份：
            </div>
            <div class="search__input">
              <a-select
                v-model="form.month"
                placeholder="請選擇月份"
                :options="$enum.monthOption"
              />
            </div>
          </div>
          <div class="search__item">
            <div class="search__label">
              查核性質：
            </div>
            <div class="search__input">
              <a-select
                v-model="form.auditType"
                placeholder="請選擇查核性質"
                :options="typeOption"
              />
            </div>
          </div>
          <div class="search__item">
            <div class="search__label">
              查核項目：
            </div>
            <div class="search__input search__input--large">
              <a-select
                v-model="form.auditItems"
                placeholder="請選擇查核項目"
                :options="itemOption"
              />
            </div>
          </div>
          <button
            class="search__btn btn--search"
            @click="searchPointerAuditItem"
          >
            查詢
          </button>
        </div>
        <a-collapse
          v-if="pointAuditItemList && pointAuditItemList.length > 0"
          v-model="activeImportantCheckKey"
          :destroy-inactive-panel="false"
        >
          <a-collapse-panel
            v-for="(item,index) in pointAuditItemList"
            :key="item.key"
            :header="item.headerTitle"
          >
            <a-checkbox-group
              v-model="checkedPointAuditItemList[index].checked"
              class="w-100"
            >
              <div
                v-for="pointAuditItem in item.yapPointAuditItems"
                :key="pointAuditItem.yapPointAuditItemId"
                class="import__item"
              >
                <!-- v-model="pointAuditItem.isChecked" -->
                <a-checkbox
                  :value="pointAuditItem"
                  class="import__item__checkbox"
                />
                <div class="import__item__content">
                  {{ pointAuditItem.itemContent }}
                </div>
              </div>
            </a-checkbox-group>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import {
	SelectOptionDto, SearchAuditPlan, SearchAuditPlanMonthEnum, SearchAuditPlanAuditTypeEnum, YapDto, YapPointAuditItemDto,
} from '@fubonlife/iams-api-axios-sdk';

const modalModule = namespace('modalControl');

@Component({
	components: {
		InfoModal,
	},
})
export default class ImportDataModal extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

  @Prop()
  visible: boolean

  @Prop() // 查核性質
  typeOption: SelectOptionDto[]

  @Prop() // 查核項目
  itemOption: SelectOptionDto[]

  @Prop() // 預設要帶入得查核項目年度
  yap: YapDto

  @Prop() // 年度稽核計畫年份
  yapYear: string

  @Prop() // 重點查核項目大項（收合）
  yapPointAuditItemList

  @Watch('yap', { deep: true })
  onYapChanged(val: YapDto) {
  	if (val) {
  		console.log('import yap', val);
  		this.form.auditType = val.auditType as SearchAuditPlanAuditTypeEnum;
  		this.form.month = val.startMonth as SearchAuditPlanMonthEnum;
  		this.form.auditItems = val.auditItem;
  	}
  	// console.log('import form', this.form);
  }

  @Watch('visible')
  onVisibleChanged(val) {
  	if (val) {
  		this.checkedPointAuditItemList = this.$global.deepCopyData(this.yapPointAuditItemList).map((e) => ({ ...e, checked: [] }));
  		this.searchPointerAuditItem();
  	}
  }

  @Watch('yapPointAuditItemList', { immediate: true })
  onYapPointAuditItemListChanged(val) {
  	this.activeImportantCheckKey = val && val.map((e) => e.key);
  }

   @Watch('checkedPointAuditItemList', { deep: true })
  onCheckedPointAuditItemListChanged(val) {
  	console.log('checkedPointAuditItemList', this.checkedPointAuditItemList);
  }

  // 重點查核項目-目前展開的項目(for元件使用)
  activeImportantCheckKey = [];

  pointAuditItemList = null;

  checkedPointAuditItemList = null;

  form = {
  	month: '01' as SearchAuditPlanMonthEnum,
  	auditType: '1' as SearchAuditPlanAuditTypeEnum,
  	auditItems: '',
  }

  // API:查詢年度的重點查核項目
  searchPointerAuditItem() {
  	this.setLoading(true);
  	const requset: SearchAuditPlan = {
  		year: parseInt(this.yapYear),
  		...this.form,
  		auditItems: [this.form.auditItems],
  	};
  	this.$auditPlanApi.searchPointAuditItemInAuditPlanUsingPOST(requset)
  		.then((resp) => {
  			console.log(resp);
  			this.covertObjectToArrayItem(resp.data.result);
  		})
  		.catch((error) => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: error.response.data.message || '查詢重點查核項目舊資料 失敗',
  				},
  			});
  			this.pointAuditItemList = null;
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 將後端回覆的object的格式轉成陣列
  covertObjectToArrayItem(YapPointAuditItems) {
  	this.pointAuditItemList = this.$global.deepCopyData(this.yapPointAuditItemList).map((e) => ({
  		...e,
  		yapPointAuditItems: YapPointAuditItems[e.key] || [],
  	}));
  	console.log('pointAuditItemList', this.pointAuditItemList);
  }

  //
  importData() {
  	this.$emit('importData', { yapId: this.yap.yapId, importItems: this.checkedPointAuditItemList });
  	this.reset();
  	this.close();
  }

  reset() {
  	this.pointAuditItemList = null;
  	this.checkedPointAuditItemList = null;
  }

  close() {
  	// this.reset();
  	this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>
.content{
  margin-top: 16px;
  background-color: $BG-LIGHT;
  max-height: calc(100vh - 265px) ;
  overflow-y: auto;
  padding: 10px 36px;
  .search{
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 8px;
  }
  .search__item{
    display: flex;
    align-items: center;
    padding-right: 18px;
  }
  ::v-deep{
    .ant-select-selection{
      width: 100px;
    }
  }
  .search__input--large{
    ::v-deep .ant-select-selection{
      width: 240px;
    }
  }
  .search__btn{
    margin-left: 12px;
  }
  .search__label{
		font-size: 14px;
		font-weight: bold;
	}
  .import__item{
    display: flex;
    align-content: center;
    border: solid 1px $COLOR-MAIN5;
    padding: 12px 10px;
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .import__item__content{
    padding-left: 22px;
  }
  .import__item__checkbox{
    align-self: center;
  }
}
</style>
