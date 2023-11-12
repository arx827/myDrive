<template>
  <InfoModal
    :visible="visible"
    :closable="true"
    :centered="true"
    :footer="null"
    body-size="large"
    padding-size="normal"
    @closeModal="close"
  >
    <template slot="content">
      <template v-if="contentData && contentData.length > 0">
        <div
          v-for="(contentItem, contentItemIndex) in contentData"
          :key="contentItemIndex"
          class="main__contentItem"
        >
          <div class="main__content">
            <component
              :is="getCurrentView(contentItem)"
              v-if="contentItem.caseType"
              :prop-data="contentItem"
            />
          </div>

          <div
            v-if="attatchments[contentItem.crawlerDataId] && attatchments[contentItem.crawlerDataId].length > 0"
            class="file__content"
          >
            <div class="file__header">
              <div class="file__header-img" />
              <span class="file__header-title">資料檔案</span>
            </div>
            <div class="file__list">
              <div
                v-for="(item, index) in attatchments[contentItem.crawlerDataId]"
                :key="index"
                class="file__list__item"
              >
                <a
                  class="file__list__text"
                  @click="onDownload(item)"
                >
                  {{ item.fileName }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-else
        class="d-flex m-3 flex-column justify-content-center align-items-center comp__empty"
      >
        <img
          src="@/assets/images/icon/icon-no-found.svg"
          alt=""
        >
        <div class="comp__empty--text">
          無關聯資料
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import InfoModal from '@shared/modal/InfoModal.vue';
import DataType__comp1 from '@shared/form/formDataType/FormDataType_1.vue'; // 法令函釋
import DataType__comp2 from '@shared/form/formDataType/FormDataType_2.vue'; // 主要檢查缺失
import DataType__comp3 from '@shared/form/formDataType/FormDataType_3.vue'; // 裁罰案件、年度檢查重點
import DataType__comp4 from '@shared/form/formDataType/FormDataType_4.vue'; // 事件清單、委外作業清單
import { Action, namespace } from 'vuex-class';

const modalControl = namespace('modalControl');

@Component({
	components: {
		InfoModal,
		DataType__comp1,
		DataType__comp2,
		DataType__comp3,
		DataType__comp4,
	},
})
export default class ConnectDataModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  @Prop()
  auditDraftContentId

	@modalControl.Action('setModalState') setModalState; // 全域 狀態彈窗

  contentData=[];

  attatchments={};

  /**
 * Event
 */

  getCurrentView({ caseType }) {
  	if (Object.keys(caseType)?.length > 0) {
  		return `DataType__${this.$enum.getDataTypeComp(Object.keys(caseType)[0])}`;
  	}
  	return 'DataType__comp1';
  }

  close() {
  	this.$emit('closeModal');
  }

  /**
   * API
   */
  // API: 取得檔案下載列表
  getApi_GetAttachment(crawlerDataId) {
  	this.setLoading(true);
  	this.$dataCollectApi.getAttachmentUsingGET(crawlerDataId)
  		.then((resp) => {
  			this.$set(this.attatchments, crawlerDataId, resp.data.result);
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 下載檔案
  onDownload({ attachmentId, fileName }) {
  	this.setLoading(true);
  	this.$auditPlanApi.downloadAttachmentInAuditPlanUsingGET(attachmentId, { responseType: 'blob' })
  		.then((resp) => {
  			const downloadlink: HTMLAnchorElement = document.createElement('a');
  			const URL = window.URL || window.webkitURL;
  			const url = URL.createObjectURL(resp.data as unknown as Blob);
  			const downloadName = fileName;
  			downloadlink.setAttribute('href', url);
  			downloadlink.setAttribute('download', `${downloadName}`);
  			downloadlink.click();
  			downloadlink.remove();
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API:
  getAPI_getData() {
  	this.setLoading(true);
  	this.$workPaperApi.getDraftContentRelUsingGET(this.auditDraftContentId)
  		.then((resp) => {
  			console.log('查詢內容資料關聯', resp);
  			this.contentData = resp.data.result;
  			this.contentData.forEach((item) => {
  				this.getApi_GetAttachment(item.crawlerDataId);
  				console.log(item.crawlerDataId);
  			});
  		})
  		.catch((err) => {
  			if (err?.response?.data?.total === 0) {
  				console.log(err);
  			} else {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: err?.response?.data?.message,
  					},
  				});
  			}
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

	@Watch('visible')
  onWatchVisible(wm) {
  	if (wm) {
  		this.getAPI_getData();
  	  this.attatchments = {};
  	}
  }
}

</script>

<style lang="scss" scoped>
.main__contentItem {
  background-color:$COLOR-MAIN10;
  & + & {
    margin-top: 30px;
  }
}
.main__content,
.file__content {
  padding: 25px;
  // background-color:$COLOR-MAIN10;
}

.file__content{
  border-top:1px solid #C7C7C7;
}
.file__header{
  display: flex;
  align-items: center;
}
.file__header-img{
  background-color: $COLOR_MAIN1;
  width: 5px;
  height: 25px;
}
.file__header-title{
  margin-left: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #000;
}
.file__list{
  margin-top: 6.5px;
  display: flex;
  flex-wrap: wrap;
  .file__list__item{
    display: flex;
    align-items: flex-start;;
    width: 48%;
    margin-top: 10px;
    .file__list__text{
      padding: 5px 22px;
      width: 100%;
      background-color: $COLOR_MAIN7;
      color: #0090FF;
    }
  }
  .file__list__item:nth-child(odd){
    margin-right: 4%;
  }

}

.comp__empty{
  background-color: $BG_LIGHT;
  padding: 2.5em 0em;
	.comp__empty--text{
		margin-left: -17px;
		color: #000000A6;
		margin-top: 5px;
	}
}

::v-deep {
  .ant-form-item {
    display: flex;
    align-items: flex-start;
    width: 20%;   // 預設 5等份
    margin-top: 4px;
    margin-bottom: 4px;
    .ant-form-item-label {
      line-height: 1.7;
      width: 5em;
      font-weight: 600;
    }
    .ant-form-item-control-wrapper {
      flex: 1 0 5em;
    }
    .ant-form-item-control {
      line-height: initial;
    }
  }
  .ant-input {
    height: auto;
    &[disabled] {
      border: 0;
      border-radius: 0;
      color: $COLOR-DARK;
      background: $COLOR-MAIN7;
    }
  }
  .detail__link__wrap {
    line-height: 1.5;
    .detail__link__label {
      text-align: right;
      font-size: 14px;
      width: 5rem;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      &::after {
        content: ':';
        position: relative;
        top: -0.5px;
        margin: 0 8px 0 2px;
      }
    }
    .detail__link {
      word-break: break-all;
    }
  }
}
</style>
