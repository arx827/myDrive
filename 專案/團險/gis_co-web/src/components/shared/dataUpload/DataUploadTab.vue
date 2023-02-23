<template>
  <a-radio-group
    v-model="tab"
    class="text-center w-100"
    default-value="1"
    button-style="solid"
  >
    <a-radio-button
      class="w-20"
      :value="1"
    >
      加保
    </a-radio-button>
    <a-radio-button
      class="w-20"
      :value="2"
    >
      退保
    </a-radio-button>
    <a-radio-button
      class="w-20"
      :value="3"
    >
      薪資變更
    </a-radio-button>
    <a-radio-button
      class="w-20"
      :value="4"
    >
      投保內容變更
    </a-radio-button>
    <a-radio-button
      class="w-20"
      :value="5"
    >
      上傳結果
    </a-radio-button>
  </a-radio-group>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component
export default class DatasUploadTab extends Vue {
 @Prop()
 tabValue

 tab: number = null;

 router = ['CO_DatasUploadEnrollment', 'DatasUploadSurrender', 'DatasUploadSalary', 'DatasUploadContent', 'DatasUploadResult']

 @Watch('tab')
 onChange(val) {
 	if (this.$route.name === this.router[val - 1]) return;
 	this.$router.push({ name: this.router[val - 1] });
 }

 created() {
 	this.tab = this.tabValue;
 }
}
</script>

<style lang="scss" scoped>
</style>
