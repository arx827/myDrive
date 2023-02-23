<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <DatasUpload
      :tab-value="2"
      :upload-tip="'提醒：一次上傳筆數最多1,000筆。檔案名稱請使用英文、數字編排，以避免上傳出現亂碼。'"
      :upload-msg="'支持上傳格式：僅支援「職保三合一退保」、「富邦人壽團保」格式'"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DataUploadTab from '@/components/shared/dataUpload/DataUploadTab.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import DatasUpload from '@/pages/DatasUpload/DatasUpload.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';

@Component({
	components: {
		Breadcrumb, FblDataGrid, DataUploadTab, DatasUpload,
	},
})
export default class DataUploadSurrender extends Vue {
  @Prop()
  breadcrumb: {}

  created() {
  	// this.modalVisible = true;
  }

  handleChange() {
  	console.log('');
  }
}
</script>

<style lang="scss" scoped>

.upload__wrap {
  // padding-bottom: 40px;
  border-bottom: 1px #CECECE dashed;
  // margin-bottom: 70px;
}
.uploader__wrap {
  margin-top: 30px;
}
.img__people {
  margin-left: -40%;
  padding-top: 20%;
}
.upload__result__wrap {
  padding-top: 30px;
  padding-bottom: 40px;
}
.upload__result-title {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 30px;
}
.total__num {
  font-size: 18px;
}
.upload__result-table {
  margin-top: 38px;
}
.info__txt {
  margin-top: 30px;
}
::v-deep {
  .confirm__modal {
    .ant-modal-title {
      font-size: 16px;
      padding-top: 3px;
      color: #000000;
    }
    .ant-modal-header {
      border: 0;
    }
    .ant-modal-body {
      padding: 5px 24px;
      color: #000000A6;
    }
  }
  .upload__table-span {
    th {
      border: 1px #ffffff solid;
    }
  }
  .ant-upload-text {
    font-size: 16px;
  }
  .ant-upload-hint {
    font-size: 14px;
    color: #0000006E;
  }
  .ant-upload-drag-icon {
    svg {
      width: 48px;
      height: 48px;
    }
  }
	.ant-radio-button-wrapper {
		padding: 0 22px;
	}
}
</style>
