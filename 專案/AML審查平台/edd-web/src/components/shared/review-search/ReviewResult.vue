<template>
  <div>
    <div style="background: #E6FFFB; padding: 24px;">
      <b style="font-size: 16px;">{{ $t("review_result") }}</b>
      <br />
      <a-textarea read-only v-model="text" style="margin-top: 12px;" />
      <a-row
        type="flex"
        justify="center"
        align="middle"
        style="margin-top: 16px;"
      >
        <a-col>
          <a-checkbox-group :options="notifyOpts" :value="[notifyRequired]">
          </a-checkbox-group>
        </a-col>
      </a-row>
    </div>
    <p class="copy-right">© Fubon Financial. All Rights Reserved 瀏覽器建議版本</p>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";

@Component
export default class ReviewResult extends Vue {
  notifyRequired: string = "N";
  text: string = this.$t("review_desc") as string;
  notifyOpts: any = [
    { label: this.$t("notification_required"), value: "Y" },
    { label: this.$t("no_notification_required"), value: "N" },
  ];
}
</script>

<style lang="less" scoped>
textarea {
  resize: none;
  width: 100%;
  height: 220px;
  padding: 20px;
  font-size: 16px;
  border: "1px solid";
  border-color: #c7c7c7;
  border-radius: 2px;
}
.btn {
  width: 140px;
  height: 32px;
  font-size: 16px;
  border-radius: 2px;
}
.copy-right {
  text-align: center;
  padding: 10px 0;
  color: rgba(0, 0, 0, 0.45);
}
</style>
