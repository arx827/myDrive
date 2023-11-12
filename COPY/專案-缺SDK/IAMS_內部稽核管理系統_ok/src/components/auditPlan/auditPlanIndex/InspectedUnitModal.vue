<template>
  <InfoModal
    title="計劃受檢單位"
    :visible="visible"
    :closable="true"
    :centered="true"
    @closeModal="close"
  >
    <template slot="content">
      <div class="modal__content-opinion d-flex flex-wrap">
        <table
          class="table table-bordered table-hover customTable"
        >
          <tbody>
            <template
              v-for="(item,index) in inspectedUnit"
            >
              <tr
                :key="index"
                class="customTable__tr"
              >
                <td
                  v-if="item[0]"
                  class="customTable__td customTable__td__left"
                  :class="{ 'changeStyle' : item[0].isValid === false }"
                >
                  <span>{{ `${item[0].value} ${item[0].label}` }}{{ item[0].isValid === false? '(組織異動)' : '' }}</span>
                </td>
                <td
                  v-if="item[1]"
                  class="customTable__td customTable__td__right"
                  :class="{ 'changeStyle' : item[1].isValid === false }"
                >
                  <span>{{ `${item[1].value} ${item[1].label}` }}{{ item[1].isValid === false? '(組織異動)' : '' }}</span>
                </td>
                <td v-else />
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import InfoModal from '@/components/shared/modal/InfoModal.vue';

@Component({
	components: {
		InfoModal,
	},
})
export default class InspectedUnitModal extends Vue {
  @Prop()
  visible: boolean

	@Prop()
	validYapUnits;

	@Prop()
	unitsList;

  inspectedUnit = [];

	@Watch('unitsList', { immediate: true })
  onUnitsListChanged(val) {
  	if (val && val.length > 0) {
  		this.inspectedUnit = [];
  		const oriArr = [...val];
  		const len = val.length;
  		for (let i = 0, j = 0; i < len; i += 2, j++) {
  			this.inspectedUnit[j] = oriArr.splice(0, 2);
  		}
  	} else {
  		this.inspectedUnit = [];
  	}
  }

	/**
   * Event
   */
	close() {
  	this.$emit('closeModal');
	}
}
</script>

<style lang="scss" scoped>
.modal__content-opinion{
  background-color: $COLOR-LIGHT;
  margin-top: 14px;
  padding: 8px 13px;
  max-height: 560px;
  overflow-y: auto;
}
.customTable {
  margin-bottom: 0;
  .customTable__td {
    width: 50%;
  }
  .changeStyle {
    color: $COLOR-MAIN16;
  }
}
</style>
