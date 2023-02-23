<template>
  <InfoModal
    :title="editData? '編輯':'新增'"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    :centered="true"
    :footer="true"
    @closeModal="close"
    @confirmModal="onConfirm"
  >
    <template slot="content">
      <div class="wrap">
        <a-form-model
          ref="formRef"
          :model="form"
          :rules="formRules"
        >
          <a-form-model-item
            prop="title"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <span slot="label">
              主旨
            </span>
            <a-textarea
              v-model="form.title"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
          <a-form-model-item
            prop="content"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <span slot="label">
              公告內容
            </span>
            <a-textarea
              v-model="form.content"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
          <a-form-model-item
            prop="date"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
          >
            <span slot="label">
              日期
            </span>
            <date-picker
              v-model="form.date"
              :formatter="dateFormatter"
              type="date"
              range
              :allow-clear="true"
              class="w-100"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Prop, Watch, Component,
} from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import { AnnouncementDto, CreateAnnouncement, ModifyAnnouncement } from '@fubonlife/iams-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/components/shared/modal/InfoModal.vue';

const modalModule = namespace('modalControl');

@Component({
	components: { InfoModal },
})
export default class AnnouncementModal extends Vue {
  @Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

  @Prop()
  visible: boolean;

  @Prop()
  editData: AnnouncementDto;

  dateFormatter = this.$twDateFormatter;

  formRules: { [key: string]: ValidationRule[] } ={
  	title: [
  		{ required: true, message: '請填寫主旨', trigger: 'change' },
  		{ max: 80, message: '主旨字數上限為80字' },
  	],
  	content: [
  		{ required: true, message: '請填寫公告內容', trigger: 'change' },
  		{ max: 460, message: '公告內容字數上限為460字' },
  	],
  	date: [{ required: true, message: '請填寫時間', trigger: 'change' }],
  }

  form = {
  	title: null,
  	content: null,
  	date: null,
  };

  @Watch('editData')
  onEditDataChanged() {
  	if (this.editData) {
  		console.log(this.editData);
  		this.form.title = this.editData.title;
  		this.form.content = this.editData.content;
  		this.form.date = [new Date(`${this.editData.startTimestamp}`), new Date(`${this.editData.endTimestamp}`)];
  	}
  }

  created() {
  	//
  }

  onConfirm() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.editData ? this.editAnnouncement() : this.addAnnouncement();
  		}
  	});
  }

  addAnnouncement() {
  	this.setLoading(true);
  	const request: CreateAnnouncement = {
  		category: '1',
  		title: this.form.title,
  		content: this.form.content,
  		startDatetime: this.form.date[0],
  		endDatetime: this.form.date[1],
  		unitCodeList: [],
  	};
  	this.$announcementApi.createInAnnouncementUsingPOST(request)
  		.then(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '新增公告成功',
  					autoClose: 3,
  				},
  			});
  			this.reloadAnnouncement();
  			this.close();
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '新增公告失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  editAnnouncement() {
  	this.setLoading(true);
  	const request: ModifyAnnouncement = {
  		id: this.editData.announcementId,
  		title: this.form.title,
  		content: this.form.content,
  		startDatetime: this.form.date[0],
  		endDatetime: this.form.date[1],
  	};
  	this.$announcementApi.modifyInAnnouncementUsingPOST(request)
  		.then(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '編輯公告成功',
  					autoClose: 3,
  				},
  			});
  			this.reloadAnnouncement();
  			this.close();
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '編輯公告失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  close() {
  	this.$emit('closeModal');
  }

  reloadAnnouncement() {
  	this.$emit('reloadAnnouncement');
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  background: #fff;
  padding: 40px 30px;
  margin-top: 14px;
}
</style>
