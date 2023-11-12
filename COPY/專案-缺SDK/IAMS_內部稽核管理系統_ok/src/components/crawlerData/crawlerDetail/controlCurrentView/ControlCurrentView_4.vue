<!-- Tab 資料檔案 -->
<template>
  <FblDataGrid
    :row-key="grid.rowKey"
    :columns="grid.columns"
    :data="grid.data"
    :pagination="grid.pagination"
    :empty-data="grid.data.length <= 0"
  >
    <template v-slot:handleDownload="slotProps">
      <div class="d-flex">
        <a
          class="docLink"
          @click="onDownload(slotProps)"
        >
          {{ slotProps.data.fileName }}
        </a>
      </div>
    </template>
  </FblDataGrid>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { Action } from 'vuex-class';

@Component({
	components: { FblDataGrid },
})
export default class ControlCurrentView_4 extends Vue {
	@Action('setLoading') setLoading;

	@Prop()
  crawlerDataId;

  public grid = {
  	rowKey: 'attachmentId',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'handleDownload',
  			property: 'fileName',
  			title: '檔案清單',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'createUserName',
  			title: '上傳人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'createDateTime',
  			title: '上傳日期',
  			formatter: (data) => this.$twDateTimeFormatter.stringify(data.createDateTime),
  		},
  	],
  };

  /**
   * API
   */
  // API: 查詢資料檔案
  getApi_GetAttachment() {
  	this.setLoading(true);
  	this.$dataCollectApi.getAttachmentUsingGET(this.crawlerDataId)
  		.then((resp) => {
  			this.grid.data = resp.data.result;
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 下載檔案
  onDownload({ data: { attachmentId, fileName } }) {
  	this.setLoading(true);
  	this.$dataCollectApi.downloadAttachmentInDataCollectUsingGET(attachmentId, { responseType: 'blob' })
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

  /**
   * Hook
   */
  created() {
  	this.getApi_GetAttachment();
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
		.ant-table-tbody {
			.ant-table-row-cell-break-word {
				white-space: nowrap;
				&:nth-child(1) {
					word-break: normal;
					white-space: initial;
				}
			}
		}
	}
</style>
