<template>
  <div>
    <div class="container">
      <h2 class="page__title">
        {{ pagetitle }}
      </h2>
      <div class="main__bg">
        <a-form-model
          ref="formRef"
          :model="form"
          layout="vertical"
          :colon="false"
          :rules="formRules"
        >
          <div class="row">
            <div class="col">
              <a-form-model-item
                prop="physicianName"
                label="醫師姓名"
              >
                <a-input
                  v-model="form.physicianName"
                  vue="true"
                  alt="webfont"
                  placeholder="e.g. 周小雨"
                />
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item
                prop="division"
                label="科別"
              >
                <a-input
                  v-model="form.division"
                  placeholder="e.g. 家庭醫學科"
                />
              </a-form-model-item>
            </div>
          </div>
          <a-form-model-item
            prop="remark"
            label="備註(字數上限500字)"
          >
            <a-textarea
              v-model="form.remark"
              placeholder="字數上限500字"
              :auto-size="{ minRows: 4 }"
            />
          </a-form-model-item>
          <a-form-model-item
            prop="status"
            label="狀態"
          >
            <a-radio-group
              v-model="form.status"
              name="radioGroup"
              :default-value="form.status"
            >
              <a-radio :value="1">
                有效
              </a-radio>
              <a-radio :value="0">
                停用
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="form__check-block">
        <button
          class="btn__main btn__main--light"
          @click="onCancel"
        >
          取消
        </button>
        <button
          class="btn__main btn__main--primary"
          @click="onSubmit"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</template>
<!--a-form-model-item a-select-option a-form-model-->
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { PhysicianInfoDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component
export default class MedicalStaffDataDoctorAddAndEdit extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

  pagetitle = '編輯醫師資訊';

  form = {
  	physicianName: '',
  	division: '',
  	status: 0,
  	remark: '',
  }

  formRules= {
  	physicianName: [{ required: true, message: '醫師姓名為必填', trigger: 'change' }],
  	status: [{ required: true, trigger: 'change', message: '狀態為必填' }],
  }

  postRequest: PhysicianInfoDto

  physicianInfo: PhysicianInfoDto

  queryId: number

  created() {
  	if (this.$route.params.type === 'edit') {
  		this.pagetitle = '編輯醫師資訊';
  		this.setData();
  	} else {
  		this.pagetitle = '新增醫師資訊';
  	}
  }

  onCancel() {
  	this.$router.push({ name: 'MedicalStaffDataIndex' });
  }

  setData() {
  	this.physicianInfo = this.$global.getQuery();
  	this.form.division = this.physicianInfo.division;
  	this.form.physicianName = this.physicianInfo.physicianName;
  	this.form.remark = this.physicianInfo.remark;
  	this.form.status = this.physicianInfo.status;
  }

  postData() {
  	const type = this.$route.params.type;
  	this.$PCRRpnMedStaffInfoManagementApi.savePhysicianInfoRUsingPOST(this.postRequest).then((resp) => {
  		if (resp.status === 200) {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'MedicalStaffDataDoctorResult',
  				params: {
  					type,
  				},
  				query: {
  					result: 'success',
  				},
  			});
  		} else {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'MedicalStaffDataDoctorResult',
  				params: {
  					type,
  				},
  				query: {
  					result: 'fail',
  					msg: this.$global.getApiErrorMsg(resp.data.apiError).join('、'),
  				},
  			});
  		}
  	}).catch((err) => {
  		console.log(err);
  	});
  }

  onSubmit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.postRequest = {
  				...this.form,
  				updDt: new Date().toISOString(),
  			};
  			if (this.$route.params.type === 'edit') {
  				// edit 需醫生Id
  				this.postRequest.physicianInfoId = this.physicianInfo.physicianInfoId;
  			}
  			this.postData();
  		} else {
  			console.log('error validate!!');
  			return false;
  		}
  	});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.main__bg{
  border-radius: 10px;
  background-color: #F5F8FC;
  padding: 20px 92px;
}
::v-deep .ant-form-item-label{
  line-height: 17px;
  font-weight: bold;
}
::v-deep .ant-input{
  height: 40px;
}
::v-deep textarea.ant-input{
  padding: 14px 18px;
}

.note__input{
  min-height: 150px;
}
.form__check-block{
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 80px;
  button{
    margin: 0px 5px;
  }
  .btn__main{
    padding: 9px 84px;
  }
}
</style>
