<template>
  <a-dropdown :trigger="['click']">
    <a
      class="btn__radius--yellow--small me-2 d-inline-flex"
      @click="e => e.preventDefault()"
    >
      ｉ計畫提示
    </a>
    <a-menu
      slot="overlay"
      class="tip__list"
    >
      <a-menu-item class="tip__list__item--default">
        <div style="font-size: 14px;">
          貴公司有投保之保險如下
        </div>
        <div style="color: #7CACD3; font-size: 12px;">
          計劃代號/說明
        </div>
      </a-menu-item>
      <a-menu-item
        v-for="(item, index) in tipList"
        :key="index"
        style="font-size: 12px;"
      >
        {{ item.planCode }} {{ item.planDesc }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component
export default class ProjectTip extends Vue {
  tipList = null;

  async created() {
  	await this.$uploadApi.policyPlanListUsingPOST(
  		this.$userInfo.getPolicyModel(),
  	)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.tipList = resp.data.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// console.log();
  		});
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
 .tip__list__item--default:hover {
   background: white !important;
 }
}
</style>
