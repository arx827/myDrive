<template>
  <div>
    <a-row type="flex" style="margin: 40px 0px 40px 20px;">
      <a-col flex="180px" style="text-align:center;">
        <div><img class="" src="@/assets/images/icon-main-maintain.svg" /></div>
        <div style="margin-top: 28px;"><h3>密碼編譯</h3></div>
      </a-col>
    </a-row>

    <a-row type="flex" style="margin: 40px 0px 40px 20px;">
      <a-col :span="3" style="text-align:right;"><h3>密碼：</h3></a-col>
      <a-col :span="8">
        <a-input
          v-model="text"
          type="password"
          size="large"
          :allowClear="true"
          placeholder="請輸入密碼"
        />
      </a-col>
      <a-col :span="5">
        <a-button
          class="button btn__layout--green submitButton"
          @click="callApiForQuery()"
          >編譯</a-button
        >
      </a-col>
    </a-row>

    <a-row type="flex" style="margin: 40px 0px 40px 80px;">
      <a-col :span="10">
        <h3>
          編譯後：{{ this.encodingStr }}
        </h3>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { EncodeRequestDto } from "@fubonlife/edd-api-axios-sdk";

@Component({})
export default class PwdEncode extends Vue {
  text: string = "";

  encodingStr: string = "";

  //查詢
  callApiForQuery() {
    const form: EncodeRequestDto = {
      encodeValue: this.text,
    };
    // console.log(form);
    this.$pwdEncodeApi
      .getEncryptOraclePwdUsingPOST(form)
      .then((resp) => {
        this.encodingStr = resp.data.message;
      })
      .catch((err) => {
        let xhrResponse = err.response,
          apiError = xhrResponse.data;
      });
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 16px;
  margin-bottom: 0px;
}
h3 {
  font-size: 18px;
  margin-bottom: 0px;
  margin-top: 0px;
}
.ant-form-item {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
