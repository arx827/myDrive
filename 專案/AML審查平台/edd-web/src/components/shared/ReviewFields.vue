<template>
  <a-form-model
    ref="ruleForm"
    :form="form"
    :layout="'vertical'"
    :model="form"
    :rules="rules"
    :hideRequiredMark="true"
  >
  <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
    <a-col :xs="xsSpan" :md="mdSpan" :lg="lgSpan" :xxl="xxlSpan">
      <a-form-model-item prop="contDp">
        <span slot="label">
          審查部門
          <span v-if="isRequired[0] & !isDisabled[0]" class="mark-required">*</span>
        </span>
        <a-select
          class="input"
          size="large"
          v-model="form.contDp"
          @change="handleDepChange"
          allow-clear
          :disabled="isDisabled[0]"
          :showArrow="!isDisabled[0]"
          placeholder="請選擇"
        >
          <a-select-option v-for="item in selectOpts.contDp" :key="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
    <a-col :xs="xsSpan" :md="mdSpan" :lg="lgSpan" :xxl="xxlSpan">
      <a-form-model-item prop="contUt">
        <span slot="label">
          審查科別
          <span v-if="isRequired[1] & !isDisabled[1]" class="mark-required">*</span>
        </span>
        <a-select
          class="input"
          size="large"
          v-model="form.contUt"
          @change="handleDivChange"
          allow-clear
          :disabled="isDisabled[1]"
          :showArrow="!isDisabled[1]"
          placeholder="請選擇"
        >
          <a-select-option v-for="item in selectOpts.contUt" :key="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
    <a-col :xs="xsSpan" :md="mdSpan" :lg="lgSpan" :xxl="xxlSpan">
      <a-form-model-item prop="contId">
        <span slot="label">
          審查人員
          <span v-if="isRequired[2] & !isDisabled[2]" class="mark-required">*</span>
        </span>
        <a-select
          class="input"
          size="large"
          v-model="form.contId"
          allow-clear
          :disabled="isDisabled[2]"
          :showArrow="!isDisabled[2]"
          placeholder="請選擇"
        >
          <a-select-option v-for="item in selectOpts.contId" :key="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-col>
  </a-row>
  </a-form-model>
</template>

<script lang="ts">
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Prop } from "vue-property-decorator";
import { Vue, Component, Watch } from "vue-property-decorator";

export interface IdefaultValue{
  [key:string]: {
    key: string;
    value: string
  }
}

@Component
export default class ReviewFields extends Vue {
  // 必填選項 [(部門),(科別),(人員)]
  @Prop()
  isRequired!: Array<boolean>;

  // disabled [(部門),(科別),(人員)]
  @Prop()
  isDisabled!: Array<boolean>;

  @Prop()
  defaultValue!: Array<IdefaultValue>;

  @Prop()
  xsSpan!: number;

  @Prop()
  mdSpan!: number;

  @Prop()
  lgSpan!: number;

  @Prop()
  xxlSpan!: number;

  selectOpts = {
    contDp : [],
    contUt : [],
    contId : [],
  }
  form:{[key:string]:string} = {
    contDp : undefined,
    contUt : undefined,
    contId : undefined,
  };

  me:any = this.$user.getMe().employee;
  // TEST: 測試客利資料
  // me:any = {
  //   name: "李X真",
  //   domainId: "B1455",
  //   fullTime: "Y",
  //   depId: "VPK01",
  //   depName: "客戶利益一科",
  //   jobTitle: "專員",
  //   bossDepId: "VPK00",
  //   bossDepName: '客戶利益部'
  // };


/**
 * Func
 */
  // 下拉選項初始化
  initSelectOpts() {
    this.selectOpts = {
      contDp : [],
      contUt : [],
      contId : [],
    }
    this.form = {
      contDp : undefined,
      contUt : undefined,
      contId : undefined,
    };
  }
  // 取得初始所有下拉選項
  async getSelectOpts({bossDepId, depId}) {
    let getData;
    switch(this.$router.currentRoute.name){
      // 待審查
      case 'ReviewAssignmentPage':
        await this.$reviewApi
          .getSelectOptsInReviewUsingPOST({bossDepId, depId})
          .then(resp => {
            if(resp.data.success === true) {
              getData = resp.data.data;
            }
        });
        break;
      // 待覆核
      case 'ReviewConfirmPage':
        await this.$confirmApi
          .getSelectOptsInConfirmUsingPOST({bossDepId, depId})
          .then(resp => {
            if(resp.data.success === true) {
              getData = resp.data.data;
            }
        });
        break;
      default:
        // getData.dpOpts = this.me.bossDepId
        await this.$reviewApi
          .getSelectOptsInReviewUsingPOST({bossDepId, depId})
          .then(resp => {
            if(resp.data.success === true) {
              getData = resp.data.data;
            }
        });
    }
    this.initSelectOpts();
    if(getData){
      this.selectOpts.contDp = [...getData.dpOpts];
      this.selectOpts.contUt = [...getData.utOpts];
      this.selectOpts.contId = [...getData.domainIdOpts];
    }else{
      this.selectOpts.contDp = [{ key: this.me.bossDepId, value: this.me.bossDepName }]
      this.selectOpts.contUt = [{ key: this.me.depId, value: this.me.depName }]
      this.selectOpts.contId = [{ key: this.me.domainId, value: this.me.name }]
    }
    // 選取預設
    this.setSelectDefault();
  }
  
  // 取得同科別人員, 引數未給時預設帶入登入者資料
  getSelectIdOpts(depId = this.me.depId) {
    switch(this.$router.currentRoute.name){
      // 待審查
      case 'ReviewAssignmentPage':
        this.$reviewApi
          .getSelectDomainIdOptsInReviewUsingPOST({ bossDepId: this.me.bossDepId, depId: depId})
          .then(resp => {
            if(resp.data.success === true) {
              let getData = resp.data.data;
              this.selectOpts.contId = [...getData]
            }
        });
        break;
      // 待覆核
      case 'ReviewConfirmPage':
        this.$confirmApi
          .getSelectDomainIdOptsInConfirmUsingPOST({ bossDepId: this.me.bossDepId, depId: depId})
          .then(resp => {
            if(resp.data.success === true) {
              let getData = resp.data.data;
              this.selectOpts.contId = [...getData]
            }
        });
        break;
      default:
        this.$reviewApi
          .getSelectDomainIdOptsInReviewUsingPOST({ bossDepId: this.me.bossDepId, depId: depId})
          .then(resp => {
            if(resp.data.success === true) {
              let getData = resp.data.data;
              this.selectOpts.contId = [...getData]
            }
        });
    }
  }
  // 帶入下拉預設值
  setSelectDefault() {
    const dpArray = this.selectOpts.contDp.map(item => item.key);
    const utArray = this.selectOpts.contUt.map(item => item.key);
    const idArray = this.selectOpts.contId.map(item => item.key);

    // 登入者資料包含在下拉中，則選此選項，
    // 若無，則預設選擇第一個選項
    if(dpArray.includes(this.me.bossDepId)){
      this.form.contDp = this.me.bossDepId;
    }else{
      this.form.contDp = this.selectOpts.contDp[1].key;
    }
    if(utArray.includes(this.me.depId)){
      this.form.contUt = this.me.depId;
    }else{
      this.form.contUt = this.selectOpts.contUt[1].key;
    }

    switch(this.$router.currentRoute.name){
      // 待審查
      case 'ReviewAssignmentPage':
        if(idArray.includes(this.me.domainId)){
          this.form.contId = this.me.domainId;
        }else{
          this.form.contId = this.selectOpts.contId[1].key;
        }
        break;
      // 待覆核 (人員不選擇)
      case 'ReviewConfirmPage':
      case 'AddVerificationPage':
        break;
      // AML審查查詢
      case 'ReviewSearch':
        if(idArray.includes(this.me.domainId)){
          this.form.contId = undefined;
        }else{
          this.form.contId = this.selectOpts.contId[1].key;
        }
        break;
      default:
        if(idArray.includes(this.me.domainId)){
          this.form.contId = this.me.domainId;
        }else{
          this.form.contId = this.selectOpts.contId[1].key;
        }
    }
    
    // TEST:
    // this.form.contDp = 'VPK00';
    // this.form.contUt = undefined;
    // this.form.contId = undefined;
  }


/**
 * 驗證
 */
  rules: { [key: string]: ValidationRule[] } = {
    contDp: [
      {
        required: this.isRequired[0],
        message: "請選擇審查部門",
        trigger: "change",
      },
    ],
    contUt: [
      {
        required: this.isRequired[1],
        message: "請選擇審查科別",
        trigger: "change",
      },
    ],
    contId: [
      {
        required: this.isRequired[2],
        message: "請選擇審查人員",
        trigger: "change",
      },
    ],
  };
  validateForm() {
    this.$emit("submitData", {
      form: this.form,
    });
    return (this.$refs.ruleForm as any).validate();
  }


/**
 * Event
 */
  // 部門下拉 Event
  handleDepChange(value) {}
  
  // 科別下拉 Event
  async handleDivChange(value) {
    if(value){
      await this.getSelectIdOpts(value);
      // if(value === this.me.depId){
      //   this.form.contId = this.me.domainId;
      // }else if(value !== '*'){
      //   this.form.contId = this.selectOpts.contId[1].key;
      // }else{
      //   this.form.contId = undefined;
      // }
      this.form.contId = undefined; //科別變更時，人員不帶預設值
    }else{
      await this.getSelectIdOpts('*');
      this.form.contId = undefined;
    }
  }


/**
 * Hook
 */
  created(){
    // 取得下拉選項
    this.getSelectOpts(this.me);
  }


/**
 * 監聽
 */
  @Watch('$route', { deep: true, immediate: true })
  watchRouter(newVal, oldVal){
    if(oldVal && newVal.path !== oldVal.path){
      // 取得下拉選項
      this.getSelectOpts(this.me);
    }
  }

  @Watch('form', { deep: true })
  watchForm(newVal) {
    this.$emit("submitData", {
      form: this.form,
    });
  }
}
</script>

<style scoped lang="less">
.ant-input-affix-wrapper .ant-input:focus {
  border: none;
  border-bottom: 1px solid white !important;
  box-shadow: none;
}
.title {
  font-size: 16px;
  color: #000000d9;
}
</style>
