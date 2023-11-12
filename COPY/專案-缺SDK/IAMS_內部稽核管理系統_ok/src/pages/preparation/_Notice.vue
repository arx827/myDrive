<template>
  <div class="main-contain crawlerindex-container container">
    <div class="d-flex justify-content-end header">
      <!-- 送出覆核、...、上一頁 -->
      <ActionBar
        :current-role="currentRole"
        @click="onClick"
      />
    </div>
    <div class="form justify-content-center">
      <div class="title">
        查核通知書
      </div>
      <a-form-model
        ref="notice"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-model-item
          prop="checkedUnit"
          label="受查單位"
        >
          <a-select
            ref="checkedUnit"
            v-model="form.checkedUnit"
            :options="form.options"
            mode="multiple"
            placeholder="請選擇"
            :disabled="currentRole.id !== 'ROLE_Auditor'"
          />
          <!-- TODO: 這邊是判斷是不是查核人員-領隊這個身分 -->
        </a-form-model-item>
        <a-form-model-item
          prop="subject"
          label="主旨"
        >
          <a-textarea
            ref="subject"
            v-model="form.subject"
            :rows="4"
            class="text-area"
            :disabled="currentRole.id !== 'ROLE_Auditor'"
          />
        </a-form-model-item>
        <a-form-model-item
          prop="description"
          label="說明"
        >
          <a-textarea
            ref="description"
            v-model="form.description"
            :rows="8"
            class="text-area"
            :disabled="currentRole.id !== 'ROLE_Auditor'"
          />
        </a-form-model-item>
        <a-form-model-item
          prop="unit"
          label="單位"
        >
          <a-input
            ref="unit"
            v-model="form.unit"
            :disabled="true"
          />
        </a-form-model-item>
        <a-form-model-item
          prop="time"
          label="查核範圍時間"
          :wrapper-col="{ span: 19 }"
        >
          <date-picker
            ref="time"
            v-model="form.time"
            :formatter="formatter"
            :range="true"
            :allow-clear="true"
            :disabled="currentRole.id !== 'ROLE_Auditor'"
          />
        </a-form-model-item>
      </a-form-model>
    </div>

    <!-- 審核通過/退回 彈窗 -->
    <ReviewCommitModal
      :visible.sync="rejectConfig.visible"
      :type="rejectConfig.type"
      :title="rejectConfig.title"
      :label="rejectConfig.label"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ActionBar from '@/components/preparation/notice/ActionBar.vue';
import ReviewCommitModal from '@components/notice/ReviewCommitModal.vue';
import { Getter, Action, namespace } from 'vuex-class';
import { RoleDto } from '@fubonlife/iams-api-axios-sdk';

const modalControl = namespace('modalControl');

@Component({
	components: {
		ActionBar,
		ReviewCommitModal,
	},
})
export default class Notice extends Vue {
  currentRole: RoleDto = null;

  formatter = this.$twDateFormatter;

  @modalControl.Action('setModalState') setModalState;

  // 彈窗：審核退回
  rejectConfig = {
  	visible: false, // -> syncedVisible
  	type: 'return',
  	title: '審核退回',
  	label: '退回意見',
  };

  // wrapperColDate: { span: 5 },
  form = {
  	options: [
  		{
  			value: '保費帳務部',
  			label: '保費帳務部',
  		},
  		{
  			value: '後勤支援部',
  			label: '後勤支援部',
  		},
  		{
  			value: 'Test option',
  			label: 'test',
  		},
  	],
  	checkedUnit: ['保費帳務部', '後勤支援部'],
  	subject:
      '茲通知本室將於近日內由領隊人員彭Ｘ豐及查核人員楊Ｘ憲、曾Ｘ智(實習)、畢Ｘ興(實習)、呂Ｘ憲，至 貴單 位實施本年度 保費帳務作業之一般查核 ，敬請  惠予配合辦理。',
  	description:
      '一、依據年度稽核計劃辦理。\n二、請儘速提供本次查核所需之各項文件表單與相關資料，俾使貴部（室）之查核作業能於預定時程內順利 完成。',
  	unit: '稽核室',
  	time: '',
  }

  rules = {
  	checkedUnit: [
  		{ required: true, message: '請選擇受查單位', trigger: 'change' },
  	],
  	subject: [{ required: true, message: '請填入主旨', trigger: 'change' }],
  	description: [
  		{ required: true, message: '請填入說明', trigger: 'change' },
  	],
  	unit: [{ required: true, message: '請填入單位', trigger: 'change' }],
  	time: [
  		{ required: true, message: '請選擇查核範圍時間', trigger: 'change' },
  	],
  }

  onClick(type) {
  	console.log('type:', type);
  	switch (type) {
  	case 'submit': // 送出覆核
  		(this.$refs.notice as any).validate((valid, item) => {
  			if (valid) {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '送出覆核成功',
  						autoClose: 3,
  					},
  				});
  				console.log('Show ResultModal');
  			} else {
  				console.log('Validation failed.');
  				const itemFocus = Object.keys(item)[0];
  				(this.$refs[itemFocus] as any).focus();
  			}
  		});
  		break;
  	case 'pass': // 通過
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'success',
  				title: '通過成功',
  				autoClose: 3,
  			},
  		});
  		console.log('Show ResultModal');
  		break;
  	case 'reject': // 退回
  		this.rejectConfig.visible = true;
  		// this.rejectConfig.type = 'return';
  		console.log('RevModal.vis: ', this.rejectConfig.visible);
  		break;
  	case 'back': // 上一頁
  		this.$router.back();
  		break;
  	}
  }

  created() {
  	this.currentRole = this.$global.getCurrentRole();

  	console.log('currentRoleID: ', this.currentRole.id);
  	console.log('currentRoleName: ', this.currentRole.name);
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
}
.form {
  border: 2px solid $COLOR-MAIN1;
  border-radius: 10px;
  margin-bottom: 20px;
}
.title {
  padding-top: 30px;
  padding-bottom: 16px;
  font-size: 35px;
  font-weight: bold;
  color: $FONT-NORMAL;
  letter-spacing: 12px;
  text-align: center;
}
.header {
  padding: 0px 0px 10px;
}
.ant-form-item {
  margin-bottom: 10px;
  padding-right: 10px;
  font-size: 16px;
  .ant-input {
    padding: 3px 15px 0;
    font-size: 16px;
  }
  .text-area {
    padding-top: 10px;
  }
}

::v-deep {
  .ant-input, .ant-select-selection, .mx-input {
    background: $COLOR-MAIN7;
    color: $FONT-NORMAL;
    .ant-select-selection__choice__content {
      color: $FONT-NORMAL;
    }
  }
}
</style>
