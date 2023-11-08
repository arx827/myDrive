<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <h2 class="page__title">
        簡易人因工程檢核表
      </h2>
      <div class="page__subTitle">
        原始級別 : {{ level }}
      </div>
      <div
        v-if="content"
        class="form"
      >
        <a-form-model
          ref="formRef"
          class="form__wrap"
          :model="form"
          layout="vertical"
          :hide-required-mark="false"
        >
          <a-form-model-item
            v-for="(data, idx) in content"
            :key="idx"
          >
            <div
              class="form__label d-flex"
              for=""
            >
              <span>{{ data.topicDesc }}</span>

              <span
                v-if="data.isRequire === 'Y'"
                class="mark__red"
              >＊</span>
            </div>
            <a-radio-group
              v-if="data.ansType === 2 || data.ansType === 1"
              v-model="form[data.topicId]"
              class="row w-100 g-3"
              disabled
            >
              <div
                v-for="(item,index) in data.options"
                :key="index"
                class="col-12 col-md-6"
              >
                <div class="col-12 form__radio">
                  <a-radio
                    :value="item.optValue"
                    style="col-12"
                  >
                    {{ item.optDesc }}
                  </a-radio>
                </div>
              </div>
            </a-radio-group>
            <a-textarea
              v-if="data.ansType === 4"
              v-model="form[data.topicId]"
              placeholder="字數上限2000字"
              disabled
              :max-length="2000"
            />
          </a-form-model-item>

          <!-- <a-form-model-item
            prop="remark"
          >
            <div
              slot="label"
              class="form__label d-flex"
            >
              <span>上傳附件<span style="font-weight: 300;">(上傳格式為PDF/WORD/EXCEL/TIF、檔案上限為3MB)</span></span>

              <span
                class="mark__red"
              >＊</span>
            </div>
            <a-upload
              class="form__upload"
              name="file"
            >
              <a-button
                class="btn__radius--primary btn__upload"
                disabled
              >
                <a-icon type="upload" /> 上傳
              </a-button>
            </a-upload>
          </a-form-model-item> -->
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { Action } from 'vuex-class';
import { EmpFormFillOutRecordQueryDto } from '@fubonlife/oss-api-axios-sdk';
import ErgonomicHazardForm from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/ErgonomicHazardForm.vue';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: { FblDataGrid, ErgonomicHazardForm } })
export default class ViewNurseRecordModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  @Prop()
  caseId: boolean

  @Prop()
  level: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.getData();
  		// console.log(this.recordId);
  	}
  }

  @Prop()
  recordId: number

  onClose() {
  	this.$emit('closeHazardFormModal');
  }

  // 表單欄位資料
  form = {
  	workName: 1,
  	hand: 1,
  	pastYear: 1,
  	doubleCheck: 1,
  	relation: 1,
  }

  // 表單內容
  content = null;

  getData() {
  	this.setLoading(true);
  	console.log(this.recordId);
  	const queryData: EmpFormFillOutRecordQueryDto = {
  		recordId: this.recordId,
  		formName: 'F0205',
  	};
  	this.$EhEmpFormRecordControllerApi.queryFormFillOutRecordUsingPOST(queryData)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.content = resp.data.data[0].topicAndOptsDtoList;
  				resp.data.data[0].topicAndOptsDtoList.forEach((item) => {
  					this.$set(this.form, item.topicId, item.ans);
  				});
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}

  			console.log('this.content=>', this.content);
  		})
  		.catch((error) => {
  			console.log('errror status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
.form__label {
  color: #000000;
  font-weight: 600;
  margin-bottom: 10px;
  >*{
    font-size: 16px;
  }
  .mark__red {
    color: #FC001A;
    font-size: 22px;
  }
}
.page__subTitle{
  background: $COLOR-MAIN1;
  color:#fff;
  padding: 6px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
.form{
  background:$COLOR-MAIN10;
  padding-top: 20px;
  padding-bottom: 30px;
}
::v-deep .form__wrap{
  width: 50%;
  margin: 0 auto;
  .ant-form-item-label > label span span{
    font-weight: 400;
    color:#363636
  }
}
.form__radio{
  background: #fff;
  box-sizing: border-box;
  padding: 12px;
}
::v-deep .form__upload{
  .ant-upload-list-item-name{
    width: auto;
  }
  .ant-upload-list-item-card-actions{
    right: auto;
  }
}
.btn__upload {
    border-radius: 4px;
    background: $COLOR-MAIN15;
    border:none;
  }
</style>
