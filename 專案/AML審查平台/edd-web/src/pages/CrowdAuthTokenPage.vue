<template>
  <div>
    <a-row type="flex" style="margin: 40px 0px 40px 20px;">
      <a-col flex="180px" style="text-align:center;">
        <div><img class="" src="@/assets/images/icon-main-maintain.svg" /></div>
        <div style="margin-top: 28px;"><h3>{{ this.msg}}</h3></div>
      </a-col>
    </a-row>

    <a-row type="flex" style="margin: 40px 0px 40px 80px;">
      <a-col :span="10">
        <h3>
          {{ this.encodingStr }}
        </h3>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class CrowdAuthTokenPage extends Vue {

  msg: string = "身分驗證中...";
  jwtToken: string = "";
  encodingStr: string = "";

  created() {
      this.$authApi
        .getJwtUsingPOST({withCredentials: true})
        .then((resp) => {
          this.jwtToken = resp.data.accessToken;
          this.$user.signIn(this.jwtToken);
        }).then(() => {
          this.$router.replace({ path: "/" });
        })
        .catch((error) => {
          console.log(error);
          this.msg = "身分驗證失敗...";
          this.encodingStr = this.jwtToken;
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
