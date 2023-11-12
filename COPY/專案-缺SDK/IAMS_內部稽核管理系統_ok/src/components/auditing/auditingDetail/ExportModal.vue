<!-- 匯出總表 彈窗 -->
<template>
  <InfoModal
    title="匯出檔案"
    :visible="syncedVisible"
    :centered="true"
    :width="950"
    :closable="true"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div class="bgLight__wrap mt-4">
        <div class="graybar__wrap">
          <div class="graybar__list">
            <template v-for="(item, index) in uploadType">
              <CustomPopConfirm
                v-if="item.haveTemplate"
                :key="index"
                :title="`是否確認下載『${item.label}』`"
                @confirm="exportDoc(item)"
              >
                <button class="graybar__list__item flex-center">
                  <div class="list__item-text col-7">
                    <div class="list__item-icon" />{{ item.label }}
                  </div>
                </button>
              </CustomPopConfirm>
            </template>
          </div>
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import { Getter, Action, namespace } from 'vuex-class';
import { DataConfirmRequestDto } from '@fubonlife/iams-api-axios-sdk';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';

const modalControl = namespace('modalControl');

@Component({
	components: {
		InfoModal, ResponseMessage, FblDataGrid, CustomPopConfirm,
	},
})
export default class ReviewCommitModal extends Vue {
	@Action('setLoading') setLoading;

  @PropSync('visible')
  syncedVisible: boolean;

  uploadType = [];

  $query = {
  	auditDraftId: '',
  	year: '',
  	auditItemName: '',
  };

  reset() {
  	this.uploadType = [];
  	this.$query = {
  		auditDraftId: '',
  		year: '',
  		auditItemName: '',
  	};
  }

  init() {
  	this.reset();
  	this.$query = this.$global.getQuery();
  	this.getApi_docType();
  }

  /**
	 * API
	 */
  // API: 取得 資料類型 下拉選項
  getApi_docType() {
  	this.setLoading(true);
  	this.$workPaperApi.searchDocTypeUsingPOST()
  		.then((resp) => {
  			const getData = this.$global.deepCopyData(resp.data.result);
  			this.uploadType = getData.map((i) => ({
  				label: i.name,
  				value: i.id,
  				haveTemplate: i.haveTemplate,
  			}));
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 匯出總表
  getApi_exportDoc({ label, value: docType }) {
  	this.setLoading(true);
  	const submit = {
  		auditDraftId: this.$query.auditDraftId,
  		docType,
  	};
  	const exportDocName = `${this.$query.year}年度_${this.$query.auditItemName}_${label}`;
  	this.$workPaperApi.exportWorkPaperDocUsingPOST(submit, {	responseType: 'blob' })
  		.then((resp) => {
  			const downloadlink: HTMLAnchorElement = document.createElement('a');
  			const URL = window.URL || window.webkitURL;
  			const url = URL.createObjectURL(resp.data as unknown as Blob);
  			const downloadName = exportDocName;
  			downloadlink.setAttribute('href', url);
  			downloadlink.setAttribute('download', `${downloadName}`);
  			downloadlink.click();
  			downloadlink.remove();
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  /**
	* Event
	*/
  closeModal() {
  	this.syncedVisible = false;
  }

  exportDoc(item) {
  	this.getApi_exportDoc(item);
  }

  /**
	* Hook
	*/
  mounted() {
  	this.init();
  }

	/**
	* 監聽
	*/
	@Watch('syncedVisible')
  watchVisible(nV) {
  	if (nV) {
  		this.init();
  	}
  }
}
</script>

<style lang="scss" scoped>
  .bgLight__wrap {
    background-color: $BG-LIGHT;
    padding: 60px 100px 65px;
  }

.uploadList__container{
  margin-top:39px;
  .top__bar{
    margin: 0px auto;
    margin-bottom: 11px;
    max-width: 1089px;
    display: flex;
    justify-content: flex-end;
  }
}

.graybar__list {
  .graybar__list__item:nth-child(even){
    .list__item-text{
      color: #00BDBD;
    }
  }
  .graybar__list__item:nth-child(odd){
    .list__item-text{
      color: $COLOR-MAIN1;
    }
  }
  .graybar__list__item{
    cursor: pointer;
    background-color: $COLOR_LIGHT;
    border: none;
    width: 100%;
    padding: 15px 0px;
    border-bottom: 1px solid #C7C7C7;

    &:hover{
      background-color: $COLOR-MAIN4;
      .list__item-icon{
        background-color: $COLOR-MAIN1;
      }
    }
    .list__item-text{
      font-size: 25px;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
  }
  .graybar__list__item:nth-last-child(1) {
    border-bottom: none;
  }
  .list__item-icon {
      margin-right: 13px;
      width: 60px;
      height: 60px;
      background-color: $COLOR-MAIN4;
      background-image: url('~@assets/images/icon/icon_export2_o.svg');
      background-repeat: no-repeat;
      background-size: 30px 30px;
      background-position: center;
      border-radius: 50vh;
      &:hover {
        background-color: $COLOR-MAIN1;
      }
    }
  }
</style>
