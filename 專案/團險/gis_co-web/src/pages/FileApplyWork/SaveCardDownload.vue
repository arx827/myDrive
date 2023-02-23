<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap">
        <h2 class="query__title">
          您想查詢的保險證資料？
        </h2>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :layout="'vertical'"
          :rules="formRules"
        >
          <p class="info__txt primary__txt text-center">
            請擇一填寫
          </p>
          <div
            class="query__content"
          >
            <a-radio-group
              v-model="radioOpt"
              default-value="'crtNo'"
              class="query__list"
            >
              <a-radio
                class="query__item"
                :value="'crtNo'"
              >
                保險證號
                <div
                  v-if="radioOpt === 'crtNo'"
                  class="query__item-content d-flex"
                >
                  <a-form-model-item prop="crtNoStart">
                    <a-input
                      v-model="form.crtNoStart"
                      style="width: 150px; text-align: center; border-right: 0; border-radius: 4px 0 0 4px;"
                    />
                  </a-form-model-item>
                  <a-input
                    style="width: 30px; border-right: 0; border-left: 0; pointer-events: none; backgroundColor: #fff; border-radius: 0;"
                    placeholder="~"
                    disabled
                  />
                  <a-form-model-item prop="crtNoEnd">
                    <a-input
                      v-model="form.crtNoEnd"
                      style="width: 150px; text-align: center; border-left: 0; border-radius: 0 4px 4px 0;"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'insName'"
              >
                被保人姓名
                <a-popover
                  trigger="click"
                  placement="top"
                >
                  <template slot="content">
                    <div>原住民特殊字元可以複製以下字元使用</div>
                    <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
                  </template>
                  <a-icon
                    type="info-circle"
                    :style="{ color: '#4CAAF5' }"
                    @click="isreplyTypeModal = true"
                  />
                </a-popover>
                <div
                  v-if="radioOpt === 'insName'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="insName">
                    <a-input
                      v-model="form.insName"
                      block
                      vue="true"
                      alt="webfont"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'insId'"
              >
                身分證字號/居留證號碼
                <div
                  v-if="radioOpt === 'insId'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="insId">
                    <a-input
                      v-model="form.insId"
                      block
                      @input="form.insId = $event.target.value.toUpperCase()"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'jnDate'"
              >
                加保日期
                <div
                  v-if="radioOpt === 'jnDate'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="jnDate">
                    <date-picker
                      v-model="form.jnDate"
                      type="date"
                      :range="true"
                      :formatter="formatter"
                      :allow-clear="true"
                      :disabled-date="disabledDate"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
            </a-radio-group>
          </div>
          <div class="block__btns text-center">
            <button
              class="btn__radius--primary w-50"
              @click="onSubmit"
            >
              查詢
            </button>
          </div>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { InsuredDownloadQueryDto } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb } })
export default class SaveCardDownload extends Vue {
  @Prop()
  breadcrumb: {}

  // 表單
  form = {
  	crtNoStart: '',
  	crtNoEnd: '',
  	insName: '',
  	insId: '',
  	jnDate: '',
  }

  formatter = this.$twDateFormatter;

  radioOpt = 'crtNo';

  // 表單檢核規則
  formRules = {
  	insId: [{ required: true, message: '請填入有效身分證字號' }, { pattern: /[a-zA-Z0-9]/, message: '身分證字號輸入格式錯誤' }],
  	insName: [{ required: true, message: '請填入有效姓名' }, { max: 100, message: '姓名輸入格式錯誤' }],
  	crtNoStart: [{ required: true, message: '請填入有效保險證號' }, { pattern: /^[A-Za-z0-9~\!@#\$%\^&\*\(\)_\+\{\}\|\:"<>\?`\-\=\[\]\\;',\.\/]+$/, message: '保險證號格式錯誤' }],
  	crtNoEnd: [{ pattern: /^[A-Za-z0-9~\!@#\$%\^&\*\(\)_\+\{\}\|\:"<>\?`\-\=\[\]\\;',\.\/]+$/, message: '保險證號格式錯誤' }],
  	jnDate: [{ required: true, message: '請填入有效加保日期區間' }],
  }

  disabledDate(current) {
  	return current && current > moment().endOf('day');
  }

  formatDate(date) {
  	return DateTimeFormmat.filterRangeDate(date);
  }

  updated() {
  	window.parseWord();
  }

  async setQuery() {
  	const data: InsuredDownloadQueryDto = {
  		policyModel: this.$userInfo.getPolicyModel(),
  	};

  	let key = this.radioOpt;
  	const value = this.form[key];

  	switch (key) {
  	case 'crtNo':
  		key = 'crtNoStart';
  		data[key] = this.form.crtNoStart;
  		if (this.form.crtNoEnd) {
  			key = 'crtNoEnd';
  			data[key] = this.form.crtNoEnd;
  		}
  		break;
  	case 'jnDate':
  		key = 'jnDateStartTime';
  		data[key] = this.formatDate(value)[0];
  		key = 'jnDateEndTime';
  		data[key] = this.formatDate(value)[1];
  		break;
  	default:
  		data[key] = value;
  		break;
  	}

  	const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(data));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'SaveCardDownloadResult',
  		query: encryptQuery,
  	});
  }

  // 查詢
  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.setQuery();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }
}
</script>

<style lang="scss" scoped>
  .info__txt {
    margin: 10px 0;
  }
  .query__content {
    padding-bottom: 80px;
  }
  ::v-deep {
    .ant-radio {
      top: -2px;
    }
    .ant-form-vertical .ant-form-item {
      margin: 0;
    }
    .query__tab {
      width: 100%;
      .ant-radio-button-wrapper {
        width: 50%;
        text-align: center;
      }
    }
  }
</style>
