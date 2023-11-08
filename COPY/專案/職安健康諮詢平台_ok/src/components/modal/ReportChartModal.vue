<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal"
      :mask-closable="false"
      :after-close="onClose"
      :width="'90%'"
      on-ok="handleOk"
    >
      <template slot="footer">
        <div class="btn__wrap text-center mt-0 mb-4">
          <button
            class="btn__radius--primary"
            @click="onClose"
          >
            返回
          </button>
        </div>
      </template>
      <template slot="title">
        <div class="page__title m-0">
          圖表分析
        </div>
      </template>
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="healthCategory__content">
        chart
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';

@Component({})
export default class ReportChartModal extends Vue {
  @Prop()
  visible: boolean

  modalVisible = false;

  @Watch('visible')
  	onChange(val) {
  	this.modalVisible = val;
  	}

  onClose() {
  	this.$emit('closeCateModal');
  }

  async created() {

  	// 子標題所屬欄位需合併其他欄位
  	// this.getColSpan('name_ch');
  }
}
</script>

<style lang="scss" scoped>
  .healthCategory__block {
    border-bottom: 1px #D1D1D1 solid;
    padding-bottom: 20px;
    margin-bottom: 20px;
    &:last-child {
      border: 0;
    }
  }

  .healthCategory__opt {
    float: left;
    width: 50%;
    // padding: 0 20px;
  }

  .healthCategory__block__title {
    color: $COLOR-MAIN1;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .collapse-baseInfo {
	margin: 20px 0;
	.baseInfo-content {
		padding: 20px 90px;
		.infoBox-item {
			.box-label {
				font-weight: 600;
				color: $COLOR-BLACK;
			}
			h2 {
				font-size: 20px;
			}
		}
	}
}
.collapse-table {
	.collapse-panel:not(:first-of-type) {
		font-weight: 400;
	}
	.ant-collapse {
		border: none;
	}
	.table-forHeader {
		::v-deep {
			.ant-collapse-content {
				border: none;
			}
			.ant-table-placeholder {
				display: none;
			}
			.ant-table-footer {
				padding: 0;
			}
		}
	}

	.table-forBody {
		::v-deep {
			.ant-table-thead {
				display: none;
			}
		}
	}
}

  ::v-deep {
    .ant-collapse-header {
      background: $COLLAPSE-HEADER-BG;
      color: $COLOR-WHITE !important;
      font-weight: 600;
      i {
        color: $COLOR-WHITE !important;
      }
    }
    .cate__modal {
      .ant-modal-header, .ant-modal-body {
        padding: 24px 10%;
        border: 0;
      }
    }
  }
</style>
