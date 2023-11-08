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
                prop="buildingName"
                label="職場大樓名稱"
              >
                <a-input
                  v-model="form.buildingName"
                  placeholder="e.g. 松山大樓"
                />
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item
                prop="address"
                label="地址"
              >
                <a-input
                  v-model="form.address"
                  placeholder="e.g. 台北縣台北市內湖區瑞湖街62號"
                />
              </a-form-model-item>
            </div>
          </div>
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
import { WorkBuildingInfoDto } from '@fubonlife/oss-api-axios-sdk';

@Component
export default class MedicalStaffDataSiteAddAndEdit extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

  pagetitle = '編輯職場大樓資訊';

  buildInfo: WorkBuildingInfoDto = {}

  form = {
  	buildingName: '',
  	address: '',
  }

  formRules = {
  	buildingName: [{ required: true, trigger: 'blur', message: '請填寫職場大樓名稱' }],
  }

  postRequest = {}

  queryId: number

  created() {
  	if (this.$route.params.type === 'edit') {
  		this.pagetitle = '編輯職場大樓資訊';
  		this.setData();
  	} else {
  		this.pagetitle = '新增職場大樓資訊';
  	}
  }

  setData() {
  	this.buildInfo = this.$global.getQuery();
  	this.form.buildingName = this.buildInfo.buildingName;
  	this.form.address = this.buildInfo.address;
  }

  onCancel() {
  	this.$router.push({ name: 'MedicalStaffDataIndex' });
  }

  onSubmit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			const type = this.$route.params.type;
  			if (type === 'edit') {
  				this.postRequest = {
  					...this.form,
  					wbInfoId: this.buildInfo.wbInfoId,
  				};
  			} else {
  				this.postRequest = {
  					...this.form,
  				};
  			}
  			// console.log(this.postRequest);
  			this.setLoading(true);
  			this.$PCRRpnMedStaffInfoManagementApi.saveWorkBuildingRUsingPOST(this.postRequest).then((resp) => {
  				if (resp.status === 200) {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MedicalStaffDataSiteResult',
  					  params: {
  							type,
  						},
  						query: {
  							result: 'success',
  						},
  					});
  				} else {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MedicalStaffDataSiteResult',
  					  params: {
  							type,
  						},
  						query: {
  							result: 'fail',
  						},
  					});
  				}
  			}).catch((err) => {
  				console.log(err);
  			}).finally(() => {
  				this.setLoading(false);
  			});
  		} else {
  			console.log('error search!!');
  			return false;
  		}
  	});
  }
}
</script>

<style lang="scss" scoped>
.main__bg{
  border-radius: 10px;
  background-color: #F5F8FC;
  padding: 20px 92px;
}
::v-deep input.ant-input{
  height: 40px;
}
::v-deep .ant-form-item-label{
  line-height: 17px;
  font-weight: bold;
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
