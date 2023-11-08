<template>
  <div>
    <a-modal
      ref="printModal"
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="handleClose"
      :footer="null"
      :width="'80%'"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div
        id="printMe"
        class="printModal__wrap"
      >
        <div class="printModal-header__wrap no-print">
          <h1 class="printModal__title">
            列印資訊
          </h1>
        </div>
        <div
          v-for="(item, index) in printDataList"
          :key="index"
          class="printInfo-block__wrap"
        >
          <div class="block-header__wrap">
            <div
              v-for="(header, headerIndex) in printInfoGroup.headerGroup"
              :key="headerIndex"
              class="headerItem"
            >
              <template v-if="header.property==='btn'">
                <button
                  class="icon-button btn__downloadList"
                  @click="downloadExcel(item.actId)"
                />
              </template>
              <template v-else>
                <div>{{ header.label }}</div>
                <h2>{{ item[header.property] }}</h2>
              </template>
            </div>
          </div>
          <a-row class="block-content__wrap">
            <a-col
              v-for="(contentBox, contentBoxIndex) in printInfoGroup.contentBoxGroup"
              :key="contentBoxIndex"
              :span="contentBox.colSpan"
              class="item-box__wrap"
            >
              <div
                v-for="(info, infoIndex) in contentBox.infoGroup"
                :key="infoIndex"
                class="item-box"
              >
                <div class="box-label">
                  {{ info.label }}
                </div>
                <div v-if="info.property==='actStatus'">
                  {{ $enum.getVal('releaseStatusEnum', item[info.property]) }}
                </div>
                <div v-else-if="info.property==='publicStatus'">
                  {{ $enum.getVal('publicStatusEnum', JSON.stringify(item[info.property])) }}
                </div>
                <div v-else>
                  {{ item[info.property] }}
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="printModal-footer__wrap">
        <div class="modal-btn__wrap text-center">
          <button
            class="btn__radius--primary--outline--small"
            @click="handleClose"
          >
            取消
          </button>
          <button
            v-print="printObj"
            class="btn__radius--primary--bg--small"
          >
            列印
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { PrintQueryDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

export interface InfoModule {
  colSpan?: string;
  label: string;
  property: string;
}
export interface PrintInfoModule {
  headerGroup: Array<InfoModule>;
  contentBoxGroup: {
    colSpan: string;
    infoGroup: Array<InfoModule>;
  }[];
}

@Component({})
export default class PrintModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  @Prop()
  optionEnum: object

  @Prop()
  printData: object

	opts = null;

  modalVisible = false;

  // 使用列印套件 @vue-print-nb
  printObj = {
  	id: 'printMe',
  	popTitle: '列印資訊',
  	beforeOpenCallback(vue) {
  		vue.setLoading(true);
  	},
  	openCallback(vue) {
  		vue.setLoading(false);
  	},
  }

  // 資料內容
  printDataList: Array<PrintQueryDto> = null;

  // 區塊內資料欄位標題
  printInfoGroup: PrintInfoModule = {
  	headerGroup: [
  		{
  			colSpan: '10',
  			label: '活動地點',
  			property: 'actLocation',
  		},
  		{
  			colSpan: '5',
  			label: '活動日期',
  			property: 'actDate',
  		},
  		{
  			colSpan: '5',
  			label: '活動時間',
  			property: 'actTime',
  		},
  		{
  			colSpan: '2',
  			label: '間距時間',
  			property: 'timeInterval',
  		},
  		{
  			colSpan: '2',
  			label: null,
  			property: 'btn',
  		},
  	],
  	contentBoxGroup: [
  		{
  			colSpan: '5',
  			infoGroup: [
  				{
  					label: '活動狀態',
  					property: 'actStatus',
  				},
  				{
  					label: '發布設定',
  					property: 'publicStatus',
  				},
  			],
  		},
  		{
  			colSpan: '9',
  			infoGroup: [
  				{
  					label: '護理人員',
  					property: 'nurseName',
  				},
  				{
  					label: '排班醫師',
  					property: 'physicianName',
  				},
  			],
  		},
  		{
  			colSpan: '9',
  			infoGroup: [
  				{
  					label: '排班日期',
  					property: 'actDate',
  				},
  				{
  					label: '排班時間',
  					property: 'actTime',
  				},
  			],
  		},
  	],
  };

  /**
   * Func
   */
  // API: 下載報名同仁資料
  downloadExcel(actId) {
  	this.setLoading(true);
  	const current = moment(new Date()).format('YYYY/MM/DD').split('/');
  	const twYear = `${parseInt(current[0]) - 1911}`;
  	const downloadName = `報名人員名單_${twYear}${current[1]}${current[2]}.xlsx`;
  	this.$PCRRpnRpnServiceFieldManagementApi.getDownLoadListRUsingPOST({ actId: JSON.parse(actId), fileName: downloadName }, { responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			// console.log('export:', resp);
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				this.$blobUtils.download(resp.data as Blob, downloadName);
  			} else {
  				this.$PCRRpnRpnServiceFieldManagementApi.getDownLoadListRUsingPOST({ actId: JSON.parse(actId), fileName: downloadName })
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 格式化日期
  getDate(data) {
  	return moment(data).format('yy/MM/DD');
  }

  /**
   * Event
   */
  handleClose() {
  	this.$emit('closeModal');
  }

  /**
   * Hook
   */

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

	@Watch('printData', { immediate: true, deep: true })
  printDataOnChange(val) {
  	if (val) {
  		this.printDataList = JSON.parse(JSON.stringify(val));
  	}
  }

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
  .printModal__title{
    font-weight: 600;
    font-size: 30px;
  }
  .printInfo-block__wrap {
    border: 1px solid $BORDER-COLOR-GREEN;
    border-radius: 4px;
    &:not(:first-of-type) {
      margin-top: 20px;
    }
    .block-header__wrap {
      background: $BG-GREEN;
      padding: 15px 35px;
      color: $COLOR-WHITE;
      h2 {
        font-size: 24px;
        color: $COLOR-WHITE;
      }
    }
    .block-content__wrap {
      padding: 20px 35px;
      .item-box__wrap {
        border-left: 2px solid  $BOX-BORDER-COLOR;
        .item-box {
          padding: 0 20px;
          &:not(:first-of-type) {
            margin-top: 15px;
          }
          .box-label {
            font-weight: 600;
            color: $COLOR-BLACK;
          }
        }
      }
    }
  }

  .block-header__wrap {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .headerItem {
      padding-right: 30px;
      &:first-of-type {
        width: 50%;
      }
      &:not(:last-of-type) {
        margin-right: 15px;
      }
      &:last-of-type {
        position: absolute;
        right: 0;
      }
    }
  }

  .modal-btn__wrap {
    margin-bottom: 10px;
    button {
      font-weight: 400;
    }
  }

  .btn__downloadList {
    background: url('~@images/button_list_green.svg') no-repeat center;
    background-color: $COLOR-MAIN10;
    float: right;
  }

  @media print {
    @page {
      size: A4 portrait;
    }
    * {
      -webkit-print-color-adjust: exact;
    }
    .headerItem:last-of-type {
      display: none;
    }
  }
</style>
