<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="coInfo__table__wrap bg__blue">
      <div class="container">
        <img
          src="@/assets/image_table.svg"
          alt=""
        >
      </div>
    </div>
    <div
      v-if="policyNo!==null"
      class="container"
    >
      <div
        class="page__title"
      >
        {{ action === 'add'?'新增':'變更' }}承辦人基本資料
      </div>
      <div class="clearfix" />
      <div class="coInfo__edit__table bg__blue">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :layout="'vertical'"
          :rules="formRules"
        >
          <div class="row">
            <div class="col">
              <a-form-model-item prop="">
                <div class="form__line">
                  <label for="">保單號碼-序號</label>
                  <div>{{ policyNo }}-{{ policySeq }}</div>
                </div>
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item prop="">
                <div class="form__line">
                  <label for="">保險期間</label>
                  <div>{{ startDate }} - {{ endDate }}</div>
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="policy">
                <div class="form__line">
                  <label for="">作業狀態</label>
                  <div>{{ action === 'add'?'新增':'變更' }}</div>
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="userName">
                <div class="form__line">
                  <label for="">姓名
                  </label>
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
                  <a-input
                    v-model="form.userName"
                    vue="true"
                    alt="webfont"
                    block
                  />
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item prop="userId">
                <div class="form__line">
                  <label for="">身分證字號</label>
                  <a-input
                    v-model="form.userId"
                    placeholder="e.g. A123456789"
                    @input="form.userId = $event.target.value.toUpperCase()"
                  />
                </div>
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item prop="authId">
                <div class="form__line">
                  <label for="">權限等級</label>
                  <div>
                    <a-radio-group
                      v-model="form.authId"
                    >
                      <a-radio
                        v-for="(auth, index) in authList"
                        :key="index"
                        :value="auth.authId"
                      >
                        {{ auth.authName }}
                      </a-radio>
                    </a-radio-group>
                  </div>
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form__line">
                <label for="">聯絡電話(區碼/電話/分機)</label>
                <div class="position-relative d-inline-block">
                  <a-form-model-item
                    class="d-inline-block"
                    prop="utelAreaCode"
                  >
                    <a-input
                      v-model="form.utelAreaCode"
                      class="me-2"
                      style="width: 80px;"
                    />
                  </a-form-model-item>
                  <a-form-model-item
                    class="d-inline-block"
                    prop="utelNo"
                  >
                    <a-input
                      v-model="form.utelNo"
                      class="me-2"
                      style="width: 150px;"
                    />
                  </a-form-model-item>
                  <span class="notice__txt">
                    分機非必填
                  </span>
                  <a-input
                    v-model="form.utelExtensionNo"
                    style="width: 80px;"
                  />
                </div>
              </div>
            </div>
            <div class="col">
              <a-form-model-item prop="userEmail">
                <div class="form__line">
                  <label for="">電子信箱</label>
                  <a-input
                    v-model="form.userEmail"
                    placeholder="e.g. fubonlife@fubon.com"
                  />
                </div>
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
      </div>
      <div class="block__btns text-center">
        <router-link
          :to="'/coInfo/coInfoTable'"
        >
          <button class="btn__radius--primary--outline">
            上一步
          </button>
        </router-link>
        <button
          class="btn__radius--primary"
          @click="onSubmit"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { UserCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import notification from '@/plugins/info/infoNotification';
import Action from './model';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class CoInfoAdd extends Vue {
  @Prop()
  breadcrumb: {}

  policyId = null;

  policySeq = null;

  policyNo = null;

  startDate = null;

  endDate = null;

  form = {
  	userId: '',
  	userName: '',
  	userEmail: '',
  	utelAreaCode: '',
  	utelNo: '',
  	authId: '',
  	utelExtensionNo: '',
  	policyNo: '',
  	policySeq: '',
  	policyId: '',
  }

  initForm = null;

  action = Action.Add;

  authList = null

  formRules = {
  	userEmail: [{ required: true, message: '請填入有效email' }],
  	insId: [{ required: true, message: '請填入有效身分證字號' }],
  	utelAreaCode: [{ required: true, message: '請填入區碼' }, { max: 5, message: '區碼不符，請再次輸入' }],
  	utelNo: [{ required: true, message: '請填入有效電話' }, { pattern: /^[A-Za-z0-9]/, message: '電話不符，請再次輸入' }, { max: 20, message: '電話不符，請再次輸入' }],
  	authId: [{ required: true, message: '請選擇權限' }],
  	userName: [{ required: true, message: '請填入有效姓名' }],
  }

  async toConfirm() {
  	const query = {
  		form: this.form,
  		initForm: this.action === Action.Add ? null : this.initForm,
  		action: this.action,
  	};
  	const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
  	if (this.action === Action.Edit && JSON.stringify(this.form) === JSON.stringify(this.initForm)) {
  		notification.error({ Content: '請編輯欲修改欄位' });
  		return;
  	}
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'self',
  		query: encryptQuery,
  	});
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CoInfoConfirm',
  		query: encryptQuery,
  	});
  }

  async getInfo() {
  	const loginInfo = this.$user.getMe();
  	const policyDetail = this.$user.getPolicyDetail();
  	if (this.$global.getQuery() !== null) {
  	  const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	  const query = JSON.parse(decryptString);
  	  this.form = query.form;
  	  this.initForm = query.initForm;
  	  this.action = query.action;
  	}
  	console.log(this.form);
  	this.policySeq = loginInfo.policySeq;
  	this.policyNo = loginInfo.policyNo;
  	this.startDate = policyDetail.strDate;
  	this.endDate = policyDetail.endDate;
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.toConfirm();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  async created() {
  	await this.$userInfo.getAuthId().then((e) => {
  		this.authList = e;
  	});
  	this.getInfo();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.notice__txt {
  position: absolute;
  top: -24px;
  right: 0;
  font-size: 12px;
}
.coInfo__table__wrap {
  padding-bottom: 33px;
  padding-top: 27px;
}
.coInfo__edit__table {
  padding: 25px 90px;
  margin-top: 10px;
  border-radius: 4px;
}
.block__btns {
  margin: 40px 0;
  button {
    width: 150px;
    max-width: 100%;
    margin: 0 5px;
  }
}
</style>
