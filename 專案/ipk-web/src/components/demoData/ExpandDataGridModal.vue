<template>
  <div class="btnGroup">
    <a-modal
      :visible="showModalFlag"
      title="資金傳票聯繫單"
      :closable="true"
      :maskClosable="false"
      :after-close="closeModal"
      :width="'80%'"
      :destroyOnClose="true"
      @cancel="closeModal"
    >
      <ExpandDataGrid
        :outerGridData="outerPendingGridData"
        :parentGridData="parentPendingGridData"
        :childrenGridData="childrenPendingGridData"
        :expandIconColumnIndex="2"
        @getPendingSelected="getPendingSelected($event)"
        @checkboxChange="onCheckboxChange($event)"
        @checkboxAll="onCheckboxChange($event)"
      />
      <template slot="footer">
        <a-button key="fork" class="btn__main btn__main--lightBlue">
          <a-icon type="fork" class="icon_margin" />
          合併
        </a-button>
        <a-button key="share-alt" class="btn__main btn__main--lightBlue">
          <a-icon type="share-alt" class="icon_margin" />
          取消合併
        </a-button>
        <a-button key="printer" class="btn__main btn__main--lightBlue">
          <a-icon type="printer" class="icon_margin" />
          列印
        </a-button>
        <a-button key="number" type="primary">
          <a-icon type="number" class="icon_margin" />
          取號
        </a-button>
        <a-button key="close" class="btn__main btn__main--lightBlue">
          <a-icon type="close" class="icon_margin" />
          取消
        </a-button>
        <a-button key="save" type="primary">
          <a-icon type="save" class="icon_margin" />
          儲存
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script src="./ExpandDataGridModal.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .vxe-table--render-default {
    $height: var(--tableHeight); // 取得computed變數tableHeight的值
    .vxe-table--fixed-left-wrapper {
      .vxe-table--body-wrapper {
        height: calc(#{$height}px - 17px);
      }
    }
    .vxe-table--fixed-right-wrapper {
      .vxe-table--body-wrapper {
        height: calc(#{$height}px - 17px);
      }
    }
  }

  .vxe-table--render-default .vxe-body--column:not(.col--ellipsis),
  .vxe-table--render-default .vxe-footer--column:not(.col--ellipsis), .vxe-table--render-default .vxe-header--column:not(.col--ellipsis) {
    padding: unset;
  }

  .vxe-cell {
    height: 32px;
    line-height: 32px;
  }

  .vxe-table--render-default .vxe-body--column.col--ellipsis,
  .vxe-table--render-default.vxe-editable .vxe-body--column, .vxe-table--render-default .vxe-footer--column.col--ellipsis, .vxe-table--render-default .vxe-header--column.col--ellipsis {
    height: 32px;
    line-height: 32px;
  }
}
</style>
