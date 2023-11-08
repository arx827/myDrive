<template>
  <div>
    <a-row>
      <a-col><img :src="base64" alt=""></a-col>
      <a-form-model-item prop="type" label="請輸入驗證碼:">
        <a-input v-model="type" placeholder="請輸入驗證碼" />
        <a-button @click="kaptchaValidate()">
          確定
        </a-button>
        <a-button @click="reload()">
          看不清楚，換一組數字
        </a-button>
      </a-form-model-item>
    </a-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ImgCreation, KaptchaDto } from "@fubonlife/ifap-api-axios-sdk";

@Component({
  components: {},
})
export default class KaptchaPage extends Vue {
  base64 = "";

  type = ""; // user輸入

  key = ""; // 裝後端來的key

  keyDto: KaptchaDto = {};

  created() {
    this.reload();
  }

  reload() {
    this.$smtpApi
      .generateCodeUsingPOST()
      .then((res) => {
        if (res) {
          this.base64 = `data:image/jpeg;base64, ${res.data.data.imgBase64}`;
          this.keyDto.key = res.data.data.hashId;
        }
      })
      .catch(console.error)
      .finally();
  }

  kaptchaValidate() {
    console.log(this.type); // 觀看輸入
    this.keyDto.type = this.type;
    this.$smtpApi
      .validateCodeUsingPOST(this.keyDto, this.type)
      .then((res) => {})
      .catch(console.error)
      .finally();
  }
}
</script>

<style scoped></style>
