<template>
  <div class="marketingGioMarketingIndex">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        行銷區域維護
      </h2>
    </div>
    <div v-if="grid.data.length > 0" class="result__table">
      <a-table
        :columns="grid.columns"
        :data-source="grid.data"
        :pagination="false"
        size="small"
      >
        <!-- 排序設定 -->
        <template v-slot:areaId="record">
          <a-form-item
            :validateStatus="(record.areaIdError)?'error': ''"
          >
            <a-input-number
              v-if="record.key !== 1"
              v-model="record.areaId"
              class="a-form-control"
              :min="0"
              type="text"
              autocomplete="off"
              @change="onChangeAreaId"
            />
          </a-form-item>
        </template>
        <!-- action -->
        <template v-slot:action="record">
          <div class="d-flex">
            <button
              class="icon-button icon__edit"
              @click="onEditData(record)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_edit.svg"
                alt=""
              >
            </button>
            <button
              class="icon-button text-btn btn__bg--secondary"
              :class="{'btn__bg--disabled': record.status !== '0'}"
              :disabled="record.status !== '0'"
              @click="onApproving(record)"
            >
              主管核可
            </button>
            <button
              class="icon-button text-btn btn__bg--secondary"
              @click="onPreview(record)"
            >
              預覽
            </button>
            <button
              class="icon-button text-btn icon__delete"
              :class="{'btn__bg--disabled': record.status !== '1'}"
              :disabled="record.status !== '1'"
              @click="onPull(record)"
            >
              下架
            </button>
          </div>
        </template>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          {{ (record.description) ? `商品描述：${record.description}` : '無資料' }}
        </p>
      </a-table>
      <div class="confirm__button-group form-footer text-center">
        <button
          class="confirm__button confirm__button-submit"
          @click="onSaveSort"
        >
          儲存
        </button>
      </div>
      <!-- 預覽彈窗 -->
      <PreviewModal v-if="previewModal" :previewObj="previewObj" @close="closePreviewModal" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import PreviewModal from '@compononts/modal/PreviewModal.vue';

import { MarketingQueryDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';
import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({
  components: { FblDataGrid, LayoutLoading, PreviewModal },
})
export default class MarketingGioMarketing extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  pageLoading = false;

  previewModal = false;

  previewObj = {
    imgUrl: '',
    title: '',
    content: '',
  }

  grid = {
    data: [],
    columns: [
      {
        title: '排序設定',
        key: 'areaId',
        width: '100px',
        scopedSlots: { customRender: 'areaId' },
      },
      {
        title: '類別',
        dataIndex: 'areaName',
        key: 'areaName',
        customRender: (text) => {
          if (text.toUpperCase() !== 'BANNER') {
            return '行銷區塊';
          }
          return 'Banner';
        },
      },
      {
        title: '連結方式',
        dataIndex: 'urlStatus',
        key: 'urlStatus',
        customRender: (text) => {
          if (text !== null) {
            return this.$enum.getVal('marketingUrlStatus', text);
          }
          return ' ';
        },
      },
      {
        title: '商品主題',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: '狀態',
        dataIndex: 'status',
        key: 'status',
        customRender: (text) => {
          if (text !== null) {
            return this.h('p', { class: 'fw-bold' }, this.$enum.getVal('marketingStatus', text));
          }
          return ' ';
        },
      },
      {
        title: '',
        dataIndex: '',
        key: 'button',
        width: '260px',
        scopedSlots: { customRender: 'action' },
      },
    ],
  }

  /**
 * Func
 */
  getGrid(): void {
    this.pageLoading = true;
    this.$gioMarketingApi
      .findMarketingQueryUsingPOST1()
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          // TEST:
          // console.log(getData);
          getData.map((item, index) => {
            item.key = index + 1;
            item.description = item.productDescription;
            item.disabled = true;
            item.areaIdError = '';
          });
          this.grid.data = getData;
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 判斷是否重複 (排序)
  repeat() {
    const repeat = this.grid.data
      .map((i) => i.areaId)
      .filter((item, index, obj) => obj.indexOf(item) !== index);
    return repeat;
  }

  // 判斷是否有空值 (排序)
  isNull() {
    const isnull = this.grid.data
      .filter((item) => item.key !== 1) // 排除 1
      .map((i) => i.areaId)
      .filter((item) => !item);
    return isnull;
  }

  // 判斷是否超過1~10範圍 (排序)
  isExMax() {
    const isExMax = this.grid.data
      .filter((item) => item.key !== 1)
      .map((i) => i.areaId)
      .filter((item) => Number(item) > 10);
    return isExMax;
  }

  /**
 * Event
 */
  // 變更排序
  onChangeAreaId() {
    this.grid.data.map((i) => i.areaIdError = '');
  }

  // 儲存排序
  onSaveSort() {
    const $messageArr = []; // 多錯誤時顯示
    // 檢核空值
    if (this.isNull().length > 0) {
      $messageArr.push('排序空值');
    }
    // 無效排序
    if (this.isExMax().length > 0) {
      $messageArr.push('無效排序');
    }
    // 排序重複
    if (this.repeat().length > 0) {
      $messageArr.push('排序重複');
    }

    // 有兩項以上
    if ($messageArr) {
      if ($messageArr.length > 1) {
        this.grid.data.filter((i) => this.repeat().includes(i.areaId)).map((i) => i.areaIdError = 'error');
        this.grid.data.filter((item) => item.key !== 1).filter((i) => !i.areaId).map((i) => i.areaIdError = 'error');
        this.grid.data.filter((item) => item.key !== 1).filter((i) => Number(i.areaId) > 10).map((i) => i.areaIdError = 'error');
        const messageStr = $messageArr.join('、');
        // 有重複數
        Modal.error({
          title: this.h('div', {}, '排序錯誤'),
          content: `偵測到${messageStr}，請輸入有效排序1~10。`,
          okType: 'confrim',
          okText: '確定',
          icon: () =>
            this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
        });
      } else if ($messageArr.length == 1) {
        if (this.repeat().length > 0) {
          this.grid.data.filter((i) => this.repeat().includes(i.areaId)).map((i) => i.areaIdError = 'error');
          // 有重複數
          Modal.error({
            title: this.h('div', {}, '排序重複'),
            content: '偵測到項目重複排序，請重新設定。',
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        } else if (this.isNull().length > 0) {
          this.grid.data.filter((item) => item.key !== 1).filter((i) => !i.areaId).map((i) => i.areaIdError = 'error');
          Modal.error({
            title: this.h('div', {}, '排序空值'),
            content: '尚有項目排序空值，請輸入有效排序1~10。',
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        } else if (this.isExMax().length > 0) {
          this.grid.data.filter((item) => item.key !== 1).filter((i) => Number(i.areaId) > 10).map((i) => i.areaIdError = 'error');
          // console.log(this.grid.data.filter((item) => item.key !== 1));
          Modal.error({
            title: this.h('div', {}, '無效排序'),
            content: '偵測到無效排序，請輸入有效排序1~10。',
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      } else {
        this.setLoading(true);
        const sortObject = this.grid.data
        .filter((i) => i.areaName.toUpperCase() !== 'BANNER')
        .map((i) => ({
            areaId: i.areaId,
            areaName: i.areaName,
            id: i.id,
        }));

        this.$gioMarketingApi
        .sortUsingPOST(sortObject)
        .then(async (resp) => {
          // console.log(resp.data);
          await this.getGrid();
          if (resp.data.status == 200) {
            this.$infoNotification.success({
              Content: '已完成儲存',
            });
          } else {
            this.$infoNotification.error({
              Content: '無法完成儲存',
              apiError: resp.data.apiError,
            });
          }
        })
        .catch((error) => {
          console.log('error = ', error);
        })
        .finally(async () => {
          this.setLoading(false);
        });
      }
    }
  }

  // 編輯
  onEditData({ id }) {
    // TEST:
    // console.log(id);
    this.$global.changeRouterAndaddParam({
      toRouter: 'MarketingGioMarketingEdit',
      query: {
        id, // 明細檔ID
      },
    });
  }

  // 預覽
  onPreview(record) {
    // TEST:
    // console.log(record);
    this.previewObj.imgUrl = record.picBase64;
    this.previewObj.title = record.productName;
    this.previewObj.content = record.productDescription;
    this.previewModal = true;
  }

  // 關閉預覽彈窗
  closePreviewModal() {
    this.previewModal = false;
  }

  // 主管核可
  onApproving({ id, areaId }) {
    // console.log(id);
    this.$global.changeRouterAndaddParam({
      toRouter: 'MarketingGioMarketingApprove',
      query: {
        id,
        areaId,
      },
    });
  }

  // 下架
  onPull({ id }) {
    Modal.confirm({
      title: this.h('div', {}, '執行下架'),
      content: '即將執行下架此商品資料，您確定要下架嗎？',
      okType: 'warning',
      okText: '下架',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        // 下架
        this.pageLoading = true;
        this.$gioMarketingApi
          .offShelfUsingPOST(id)
          .then(async (resp) => {
            // console.log(resp.data);
            if (resp.data.status == 200) {
              await this.getGrid();
              this.$infoNotification.success({
                Content: '已完成下架',
              });
            } else {
              this.$infoNotification.error({
                Content: '無法完成下架。',
                apiError: resp.data.apiError,
              });
            }
          })
          .catch((error) => {
            console.log('error = ', error);
          })
          .finally(() => {
            this.pageLoading = false;
          });
      },
    });
  }

  /**
 * Hooks
 */
  created() {
    this.getGrid();
  }

  /**
 * 監聽
 */
  // @Watch('grid', { deep: true })
  // watchgrid(val) {
  //   console.log(val);
  // }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-table-expanded-row {
    background-color: $TABLE-EXPENDED-ROW-BG;
    &:hover {
      background-color: $TABLE-EXPENDED-ROW-BG;
    }
  }
  .confirm__button-group {
    margin-top: 20px;
  }
  .ant-form-item {
    margin-bottom: 0;
    .ant-form-item-control {
      line-height: 1;
    }
  }
}
</style>
