<template>
  <div class="btnGroup tabline">
    <div class="event__block form__title pb-3">
      Vxe-Expend-Table範例
    </div>
    <a-row>
      <div class="setting__desc" style="width: 100%">
        <div>
          使用方法：
        </div>
        <ul class="form__content">
          <li>import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';</li>
          <li><span class="text--bold">掛載元件</span>- 複製以下元件程式碼</li>
          <li>
            ＜IpkVxeTable<br>
            :ipkGrid="ipkGrid"<br>
            @handlePageChange="handlePageChange($event)"<br>
            @sortChange="onSortChange($event)"<br>
            @openCheckInfoModal="openCheckInfoModal($event)"<br>
            @getActionType="getActionType($event)"<br>
            /＞
          </li>
        </ul>
      </div>
    </a-row>
    <div class="mb-3">
      <button class="btn__main btn__main--primary" @click="openModal">
        <a-icon type="plus" class="icon_margin" />
        資金調撥
      </button>
    </div>
    <ExpandDataGridModal
      :showModalFlag="showModalFlag"
      @closeModal="closeModal"
    />
    <IpkVxeTable
      :ipkGrid="ipkGrid"
      @handlePageChange="handlePageChange($event)"
      @sortChange="onSortChange($event)"
      @openCheckInfoModal="openCheckInfoModal($event)"
      @getActionType="getActionType($event)"
    />
  </div>
</template>

<script src="./VxeTableExpandDemo.ts" lang="ts">
</script>

<style lang="scss" scoped>
::v-deep {
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
