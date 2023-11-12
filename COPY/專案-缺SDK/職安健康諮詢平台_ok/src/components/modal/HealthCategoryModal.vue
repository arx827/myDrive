<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="onClose"
      :width="'90%'"
      on-ok="handleOk"
    >
      <template slot="footer">
        <div class="btn__wrap text-center mt-0 mb-4">
          <button
            class="btn__radius--primary"
            @click="enterSelected"
          >
            確定帶入查詢項
          </button>
        </div>
      </template>
      <template slot="title">
        <div class="page__title m-0">
          {{ modalTitle||'衛教類別' }}
        </div>
      </template>
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="healthCategory__content">
        <!-- <div class="healthCategory__block__title">
            {{ data.cateName }}
          </div> -->
        <div class="healthCategory__block__opts clearfix">
          <div
            v-for="(opt,idx) in modalSelectedCate"
            :key="idx"
            class="healthCategory__opt"
          >
            <a-checkbox
              :checked="opt.isChecked"
              @change="changeChecked(opt)"
            >
              {{ opt.name }}
            </a-checkbox>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';

@Component({})
export default class HealthCategoryModal extends Vue {
  @Prop()
  selectedCate: {}[]

  @Prop()
  visible: boolean

  @Prop()
  modalTitle: boolean

  modalVisible = false;

  modalSelectedCate = [
  ]

  @Watch('visible')
  onChange(val) {
  	if (val) this.getSelected();
  	this.modalVisible = val;
  }

  enterSelected() {
  	this.$emit('changeSelected', this.modalSelectedCate);
  	this.onClose();
  }

  changeChecked(self) {
  	self.isChecked = !self.isChecked;
  }

  onClose() {
  	this.$emit('closeCateModal');
  }

  getSelected() {
  	const arr = JSON.stringify(this.selectedCate);
  	this.modalSelectedCate = JSON.parse(arr);
  }

  created() {
  	this.getSelected();
  }
}
</script>

<style lang="scss" scoped>
  .healthCategory__block {
    border-bottom: 1px #D1D1D1 solid;
    padding-bottom: 20px;
    margin-bottom: 20px;
    &:last-child {
      border: 0;
    }
  }

  .healthCategory__opt {
    float: left;
    width: 50%;
    // padding: 0 20px;
  }

  .healthCategory__block__title {
    color: $COLOR-MAIN1;
    font-weight: 600;
    margin-bottom: 15px;
  }

  ::v-deep {
    .cate__modal {
      .ant-modal-header, .ant-modal-body {
        padding: 24px 10%;
      }
    }
  }
</style>
