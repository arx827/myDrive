<template>
  <div class="container">
    <div class="page__title">
      上傳資料列表
    </div>
    <!-- <div class="table">
      <a-table
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data-source="gridData.data"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
        :pagination="false"
        bordered
      />
    </div> -->
    <div class="btn__wrap text-center">
      <router-link :to="'/occupationSafety/ErgonomicHazard/BuildData/index'">
        <button class="btn__radius--primary--outline mb-2">
          返回上傳
        </button>
      </router-link>
      <button
        class="btn__radius--primary mb-2"
        @click="goResult()"
      >
        儲存
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';

@Component({ components: { FblDataGrid } })
export default class BuildDataList extends Vue {
}
</script>

<style lang="scss" scoped>
  .table {
    margin-bottom: 40px;
  }
  .btn__wrap {
    margin-bottom: 40px;
    button {
			margin-right: 5px;
      width: 200px;
      max-width: 100%;
    }
  }
  ::v-deep {
    .ant-table-thead > tr >th {
      background-color: $COLOR-MAIN1;
      color: white;
    }
  }
</style>
