<template>
  <div class="btnGroup tabline">
    <a-row type="flex" :gutter="[16,16]">
      <a-col :span="12">
        <IpkVxeTable
          :ipkGrid="ipkGrid"
          @sortChange="onSortChange($event)"
          @openCheckInfoModal="openCheckInfoModal($event)"
          @handleRowCurrentChange="handleRowCurrentChange"
        />
      </a-col>
      <a-col :span="12" class="cardArea">
        <NoticeCard :noticeData="noticeData" />
      </a-col>
    </a-row>
  </div>
</template>
<script src="./MessageNotice.ts" />
<style>
  .notice {
    cursor: pointer;
  }

  .notice__title {
    font-weight: bold;
    font-size: 20px;
    color: #0093C1;
  }
</style>
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
}

.cardArea {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}
</style>
