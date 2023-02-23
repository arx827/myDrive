<template>
  <InfoModal
    :title="type==='edit'? '編輯調閱清單':'新增調閱清單'"
    :visible="visible"
    :centered="true"
    :width="650"
    padding-size="small"
    @closeModal="closeModal"
  >
    <template slot="content">
      <fragment>
        <div class="form mt-2">
          <a-form-model
            ref="formRef"
            :model="form"
            :rules="formRules"
            :wrapper-col="{ span: 18, offset: 6 }"
          >
            <a-form-model-item
              prop="data"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                調閱資料
              </span>
              <a-textarea
                v-model="form.data"
                placeholder="請輸入調閱資料內容"
                class="w-100"
                :auto-size="{minRows:3}"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="unit"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                提供部門
              </span>
              <a-select
                v-model="form.department"
                placeholder="請輸入提供部門"
                show-search
                mode="multiple"
                class="w-100"
              >
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              prop="version"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                版本
              </span>
              <a-input
                v-model="form.version"
                placeholder="請輸入版本"
                class="w-100"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="range"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                資料期間
              </span>
              <date-picker
                v-model="form.range"
                placeholder="請選擇資料期間"
                :formatter="formatter"
                :range="true"
                type="date"
                :allow-clear="true"
                class="w-100"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="remark"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                備註
              </span>
              <a-textarea
                v-model="form.remark"
                class="w-100"
                :auto-size="{minRows:5}"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="d-flex mt-4 justify-content-end">
          <button
            v-if="type==='edit'"
            class="btn--primary me-2"
            @click="submit"
          >
            確認
          </button>
          <button
            v-else
            class="btn--primary me-2"
            @click="submit"
          >
            新增
          </button>
          <button
            class="btn--dark ms-2"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </fragment>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/components/shared/modal/InfoModal.vue';

@Component({
	components: { InfoModal },
})
export default class EditAndAdd extends Vue {
  @Prop()
  visible: boolean;

  @Prop()
  initData

  @Prop()
  type

  @Watch('initData')
  watchData() {
  	console.log('init', this.initData);
  	if (this.type === 'edit') {
  		this.form = {
  			...this.initData,
  			range: [this.initData.startTime, this.initData.endTime],
  		};
  		console.log(this.form);
  	}
  }

  @Watch('type')
  watchType() {
  	if (this.type === 'add') { this.form = {}; }
  }

  // 時間format格式
  formatter = this.$twDateFormatter;

  form = {};

  dataType = '';

  formRules: { [key: string]: ValidationRule[] } = {
  	data: [{ required: true, message: '請輸入調閱資料', trigger: 'change' }],
  	unit: [{ required: true, message: '請選擇提供部門', trigger: 'change' }],
  	version: [{ required: true, message: '請輸入版本', trigger: 'change' }],
  	range: [{ required: true, message: '請選擇資料期間', trigger: 'change' }],
  };

  submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.$emit('confirmModal', this.form);
  		}
  	});
  }

  closeModal() {
  	this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>
.form{
  background-color: $BG-LIGHT;
  padding: 18px 50px;
  ::v-deep{
    .ant-form-item-label{
      span{
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
