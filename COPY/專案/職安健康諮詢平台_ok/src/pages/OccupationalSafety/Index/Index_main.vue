<template>
  <div>
    <!-- <component :is="scenesView" /> -->
    <staff v-if="showStaff" />
    <medicalStaff v-if="!showStaff" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import medicalStaff from '@/pages/OccupationalSafety/Index/Index_medicalStaff.vue';
import staff from '@/pages/OccupationalSafety/Index/Index_staff.vue';
import store from '@/store';

@Component({ components: { medicalStaff, staff } })
export default class OccupationalSafety extends Vue {
  scenesView = undefined;

	showStaff = true;

	// @Watch('$store.state.role')
	// onChangeRole(val) {
	// 	console.log('$store.state.rolev', val);
	// 	// if (val) location.reload();
	// }

	@Watch('$store.state.role')
	onChangeRole(val) {
  	console.log('scenesView', val);
  	if (val) {
  		this.showStaff = val == '1';
  	}
  	// if (val) location.reload();
	}

	created() {
  	const authId = this.$user.getSelectedRole();
		this.showStaff = authId == '1';
  	// this.scenesView = authId == '1' ? 'staff' : 'medicalStaff';
	}
}
</script>

<style>

</style>
