<template>
  <a-form-model
    ref="formRef"
    :form="form"
    :layout="'vertical'"
    :model="form"
    :rules="rules"
    :hideRequiredMark="true"
  >
    <a-row type="flex" align="middle">
      <a-icon type='info-circle' theme='filled' class="wrap__icon-warning"/>
      <p class='wrap__text'>{{title}}</p>
    </a-row>
    <a-form-model-item v-if="isReject" prop="reason" class="wrap__text">
      <span slot="label">
        <span class="mark-required">*</span>
        請輸入駁回原因
      </span>
      <a-textarea v-model="form.reason" :rows="4" />
    </a-form-model-item>
    <a-form-model-item>
      <div class="wrap modal-btns">
        <a-button type="default" @click="handleReset" class="button"> 取消 </a-button>
        <a-button type="primary" @click="submit" class="btn__layout--green button"> 確定</a-button>
      </div>
    </a-form-model-item>
  </a-form-model>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Prop, Watch } from "vue-property-decorator";
@Component
export default class RejectFormModal extends Vue {
  @Prop()
  index!: number;

  @Prop()
  title!: string;

  @Prop()
  isReject!: boolean;

  // @Watch('index')
  // onIndexChanged(){
  //   this.rowId = JSON.stringify(this.index + 1);

    
  // }

  // public rowId: string = '';

  locale: locale = locale;
  form = {
    reason: "",
  };

  rules: { [key: string]: ValidationRule[] } = {
    reason: [
      {
        required: true,
        message: "駁回意見不能空白",
        trigger: "change",
      },
    ],
  };

  public submit() {
    (this.$refs.formRef as any).validate((valid) => {
      if (valid) {
        this.$emit("formSubmit", {
          isReject: this.isReject,
          index: this.index,
          reason: this.form.reason,
        });
      } else {
        console.log("error submit");
        return false;
      }
    });
  }

  handleReset() {
    (this.$refs.formRef as any).resetFields();
    this.$emit("formCancel");
  }
}
</script>

<style scoped lang="scss">
.select {
  width: 264px;
}
.ant-input-affix-wrapper .ant-input:focus {
  border: none;
  border-bottom: 1px solid white !important;
  box-shadow: none;
}
.title {
  font-size: 16px;
  color: #000000d9;
}
.input {
  width: 264px;
}
.modal-btns {
  justify-content: space-between;
  margin: 0 10px;
  .button {
    width: 150px;
    flex: 1 1 auto;
    height: auto;
    font-size: 16px;
    padding: 7.5px;
    border-radius: 5px;
    border: 1px solid #12c2c2;
    &:not(.btn__layout--green) {
      color: #12c2c2;
      &:hover {
        color: #11ADAD;
        border: 1px solid #11ADAD;
      }
    }
    &.btn__layout--green {
      color: #FFF;
      border: 1px solid #11ADAD;
    }
  }
  .button + .button {
    margin-left: 20px;
  }
}

.ant-select-selection {
  border: 1px solid #C7C7C7;
}

.ant-form-item {
  margin-bottom: 0px;
}
[class*=ant-row] {
  + .ant-form-item {
    margin-top: 30px;
  }
}

.ant-modal {
  width: 416px;
}

::v-deep {
  label {
    font-weight: normal;
  }
  .mark-required {
    vertical-align: middle;
    line-height: 1.2;
  }
}
</style>
