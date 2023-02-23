<template>
  <div class="btnGroup tabline">
    <div class="event__block form__title pb-3">
      Vxe-Table範例
    </div>
    <a-row>
      <div class="setting__desc" style="width: 100%">
        <div>
          使用方法：
        </div>
        <ul class="form__content">
          <li>此頁面同時示範編輯欄位功能，若無需要編輯欄位功能則不需加相關設定</li>
          <li>import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';</li>
          <li><span class="text--bold">掛載元件</span>- 複製以下元件程式碼</li>
          <li>
            ＜IpkVxeTable<br>
            :ipkGrid="ipkGrid"<br>
            :showEditFlag="showEditFlag" -->如果需要編輯功能再加此項<br>
            @handlePageChange="handlePageChange($event)" -->如果需要分頁功能再加此項<br>
            @sortChange="onSortChange($event)"<br>
            @openCheckInfoModal="openCheckInfoModal($event)"<br>
            @getActionType="getActionType($event)"<br>
            @handleEditChange="handleEditChange($event)" -->如果需要編輯功能再加此項<br>
            /＞
          </li>
        </ul>
      </div>
    </a-row>
    <span v-if="showEditBtn">
      <button class="btn__main btn__main--primary me-2 mb-2" @click="showEditColumn()">
        <a-icon type="edit" class="icon_margin" />
        編輯
      </button>
    </span>
    <span v-if="showSaveBtn" class="mb-2">
      <button class="btn__main btn__main--primary me-2 mb-2" @click="saveEditColumn()">
        <a-icon type="save" class="icon_margin" />
        儲存
      </button>
      <button class="btn__main btn__main--lightBlue mb-2" @click="cancelEditColumn()">
        <a-icon type="close" class="icon_margin" />
        取消
      </button>
    </span>
    <IpkVxeTable
      :ipkGrid="ipkGrid"
      :showEditFlag="showEditFlag"
      @sortChange="onSortChange($event)"
      @openCheckInfoModal="openCheckInfoModal($event)"
      @getActionType="getActionType($event)"
      @handleEditChange="handleEditChange($event)"
    />
    <!-- @handlePageChange="handlePageChange($event)" -->
  </div>
</template>

<script src="./VxeTableDemo.ts" lang="ts">
</script>

<style lang="scss" scoped>
::v-deep {
  // 如table無設定分頁,需增加此項scss
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

  li {
    margin: 10px 0;
  }
  // 表單標題
  .form__title {
    color: #2F6A9A;
    font-size: 20px;
    font-weight: 700;
  }
  .setting__desc {
    border: 1px solid gray;
    padding: 15px;
    border-radius: 15px;
    margin-bottom: 15px;
    width: 550px;
  }
  .form__content {
    list-style: decimal;
  }
  .text--bold {
    font-weight: bold;
    line-height: 1.5;
  }
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
  .event__block {
    margin-top: 20px;
  }
}
</style>
