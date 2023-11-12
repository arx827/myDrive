<template>
  <InfoModal
    :title="title"
    :visible="visible"
    :centered="true"
    body-size="large"
    padding-size="small"
    :closable="type != 'upload'"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div>
        <div class="content__wrap mt-2">
          <a-form-model
            ref="formRef"
            class="form"
            :model="form"
            :rules="rules"
            :hide-required-mark="true"
          >
            <a-form-model-item
              prop="units"
              class="mb-3"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 7 }"
              :rules="{ required: type === 'upload', message: '請選擇受查單位', trigger: 'blur' }"
            >
              <span slot="label">受查單位</span>
              <a-select
                v-model="form.units"
                default-value="lucy"
                mode="multiple"
                class="w-10 ms-1"
                :options="unitsOptions"
                @blur="handleUnitsSelect"
              />
            </a-form-model-item>

            <a-form-model-item
              prop="upload"
            >
              <a-upload-dragger
                v-if="type=='upload'"
                accept=".doc,.docx"
                name="file"
                class="upload__dragger"
                :show-upload-list="false"
                :custom-request="uploadFlie"
                :file-list="form.fileList"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="container" />
                </p>
                <p class="ant-upload-text">
                  點選或將文件拖曳到這裡上傳
                </p>
                <p class="ant-upload-hint">
                  檔名限15個字, 大小限制為20MB, 支援PDF格式
                </p>
              </a-upload-dragger>
            </a-form-model-item>
          </a-form-model>
          <fbl-data-grid
            class="upload__table mt-3"
            :row-key="grid.rowKey"
            :columns="grid.columns"
            :data="grid.data"
            :pagination="false"
            :scroll="{ x: true }"
          >
            <template #fileName="data">
              <div class="upload__table-link">
                {{ data.data.fileName }}
              </div>
            </template>
            <template #delete="data">
              <div class="flex-center">
                <CustomPopConfirm
                  @confirm="remove(data.data)"
                >
                  <img
                    class="table__btn-delete"
                    alt=""
                    src="@/assets/images/icon/icon_delete.svg"
                  >
                </CustomPopConfirm>
              </div>
            </template>
          </fbl-data-grid>
        </div>
        <div
          v-if="type==='upload'"
          class="d-flex mt-4 justify-content-end"
        >
          <button
            class="btn--primary me-2"
            @click="submit"
          >
            確認
          </button>
          <button
            class="btn--dark ms-2"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import moment from 'moment';

const modalControl = namespace('modalControl');

@Component({
	components: { FblDataGrid, InfoModal, CustomPopConfirm },
})
export default class QuestionnaireList extends Vue {
  @modalControl.Action('setModalState') setModalState;

  // 控制談窗顯示
  @Prop()
  visible

  // 上傳/查看
  @Prop({ default: 'upload' })
  type: 'view' |'upload'

  title = '上傳問卷'

  // 表單
  form = {
  	units: [],
  	fileList: [],
  }

  // 表單檢核規則
  rules={
  	upload: [{
  		validator: this.checkFileList, trigger: 'change',
  	}],
  }

  // 受查單位選項
  unitsOptions = [
  	{
  		value: '101',
  		label: '職安管理部',
  	},
  ]

  file = null; // 暫存excel file

  // TEST:
  fakeUploadedData = [
  	{
  		id: 10,
  		fileName: '詳閱名稱.docs',
  		user: '王X每',
  	  time: new Date(),
  	},
  	{
  		id: 12,
  		fileName: '詳閱檔案名稱.docs',
  		user: '王X每每',
  	  time: new Date(),
  	},
  ]

  checkFileList(rule, value, callback) {
  	if (this.form.fileList.length == 0) {
  		this.setModalState({
  			resultModal: {
  				autoClose: null,
  				content: '請選擇檔案',
  				type: 'warning',
  				title: '上傳提示',
  				visible: true,
  			},
  		});
  		callback();
  	} else {
  		callback();
  	}
  }

  // 查看問卷
  setData() {
  	switch (this.type) {
  	case 'upload':
  		// API問卷上傳API初始，讀入受查單位
  		this.grid.data = [];
  		break;
  	case 'view':
  		// API:問卷查看檔案 API，讀入受查單位
  		this.grid.data = this.fakeUploadedData;
  		break;
  	}
  }

  // 依據彈窗類調整表格欄位
  @Watch('type')
  watchCanUpload(value: string, oldValue: string) {
  	console.log(this.type);
  	if (value === 'upload') {
  		this.title = '上傳問卷';
  		this.grid.columns = this.columnsUpload;
  	} else {
  		this.title = '查看問卷';
  		this.grid.columns = this.columnsView;
  	}
  	this.setData();
  }

  // 上傳問卷 表格欄位
  columnsUpload= [
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'fileName',
  			title: '檔案上傳',
  			template: 'fileName',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'user',
  			title: '上傳人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'time',
  			title: '上傳時間',
  			formatter: (data) => this.$twDateTimeFormatter.stringify(data.time),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			title: '刪除',
  			template: 'delete',
  			width: 100,
  		},
  ]

  // 查看問卷 表格欄位
   columnsView= [
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'fileName',
  			title: '檔案上傳',
  			template: 'fileName',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'user',
  			title: '上傳人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'time',
  			title: '上傳時間',
  			formatter: (data) => this.$twDateTimeFormatter.stringify(data.time),
  		},
   ]

  public grid = {
  	rowKey: 'id',
  	data: [],
  	columns: [],
  }

  created() {
  	this.title = '上傳問卷';
  	this.grid.columns = this.columnsUpload;
  	this.setData();
  }

  // 刪除檔案
  remove(data) {
  	// 僅畫面上的刪除
  	this.form.fileList = this.form.fileList.filter((item) => item.uid !== data.id);
  	this.grid.data = this.grid.data.filter((item) => item.id !== data.id);
  }

  closeModal() {
  	// 取消按鈕
  	this.$emit('closeModal');
  }

  submit() {
  	// API:問卷上傳儲存API
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  	    // API:問卷上傳儲存API
  		}
  	});
  }

  uploadFlie(option) {
  	this.file = option;
  }

  // 選擇檔案
  handleChange(e) {
  	this.form.fileList = this.form.fileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		console.log('新增');
  		this.form.fileList = e.fileList;
  		this.form.fileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			val.lastModifiedDate = moment(val.lastModifiedDate).format('YYYY/MM/DD');
  			return val;
  		});
  		const user = this.$user.getMe();
  		const newFile = {
  			id: this.grid.data.length + 1,
  			fileName: e.file.name,
  			time: new Date(),
  			user: user.employee.name,
  		};
  		this.grid.data.push(newFile);
  	}
  }

  handleUnitsSelect() {
  	// API: CALL 問卷上傳受查單位
  }

  // 選擇檔案檢核
  beforeUpload(file) {
  	console.log(file.type);
  	const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword';
  	return isWord;
  }
}
</script>

<style lang="scss" scoped>
.content__wrap{
  padding: 20px 103px;
  background: $COLOR_LIGHT;
}
::v-deep .upload__dragger{
  .ant-upload.ant-upload-drag{
    margin: 0 auto;
    background-color: $COLOR-MAIN10;
    .ant-upload-text{
      color: $COLOR-MAIN1;
    }
    .ant-upload-hint{
      color: #00000073;
    }
    .anticon svg{
      font-size: 54px;
      color: $COLOR-MAIN1;
    }
  }
}
.table__btn-delete{
  cursor: pointer;
  width: 24px;
  height: 24px;
}

::v-deep .upload__table{
  margin: 0 auto;
  width: 76%;
  .ant-table-thead > tr:first-child > th:last-child{
    display: flex;
    justify-content: center;
  }
}

.upload__table-link{
  color: #0090FF;
  cursor: pointer;
}

::v-deep .form{
  .ant-form-item-label{
    text-align: left;
  }
  .ant-form-item-label > label::after{
    content: '';
  }
}
</style>
