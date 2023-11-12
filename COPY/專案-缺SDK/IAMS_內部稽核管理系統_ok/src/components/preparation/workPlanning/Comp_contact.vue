<template>
  <!-- 查核窗口 -->
  <div class="row g-0">
    <div
      v-for="(item,index) in tabsData"
      :key="index"
      class="col-6 col-md-4"
    >
      <div class="contact-item">
        <img
          class="contact-item__img"
          src="@images/icon_window.svg"
          alt=""
        >
        {{ item.unit }}
        <div class="contact-item__name">
          {{ item.name }}
        </div>
        {{ item.phone }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Contact extends Vue {
	@Prop()
	tabsData;
}
</script>

<style lang="scss" scoped>
.contact-item {
	border: solid 1px $COLOR-MAIN15;
	padding: 16px 0px;
	text-align: center;
	display: flex;
	justify-content: center;
}
.contact-item__img {
	width: 20px;
	margin-right: 2px;
}
.contact-item__name {
	padding: 0px 10px 0px 24px;
}
</style>
