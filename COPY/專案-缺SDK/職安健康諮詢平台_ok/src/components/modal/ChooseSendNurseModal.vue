<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'67%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="modal-container">
        <div class="modal-container__title">
          選擇派件護理人員
        </div>
        <a-radio-group
          v-model="uid"
          class="row"
        >
          <div
            v-for="item in nurseInfo"
            :key="item.uid"
            class="col-sm-6 col-12"
          >
            <a-radio
              :value="item.uid"
              class="radio__block"
            >
              {{ item.name }}
            </a-radio>
          </div>
        </a-radio-group>
        <div class="col-6">
          <a-checkbox
            v-model="isCheck"
            class="checkbox__block"
            name="type"
          >
            確定執行派件
          </a-checkbox>
        </div>
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary--outline mb-2"
            :class="{'uncheck__cancel__btn': !isCheck}"
            @click="onClose"
          >
            取消
          </button>
          <button
            class="btn__radius--primary mb-2"
            :disabled="!isCheck"
            :class="{'uncheck__check__btn': !isCheck}"
            @click="submit"
          >
            確定
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({ components: { FblDataGrid } })
export default class ViewNurseRecordModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.setData();
  	}
  }

  // 派件護理人員
  nurseInfo = {}

  // 護理師ID
  uid = null;

  // 確定執行派件
  isCheck = false;

  // created() {
  // 	this.setData();
  // }

  setData() {
  	this.setLoading(true);
  	// 2.1.1	取得派件護理人員API
  	this.$UtilityApi.dispatchListUsingPOST()
  		.then((resp) => {
  			this.nurseInfo = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			console.log('yes');
  			this.setLoading(false);
  		});
  }

  onClose() {
  	this.$emit('closeSendModal');
  }

  submit() {
  	this.$emit('toSendModalResult', this.uid);
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
		margin-bottom: 16px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    padding-top: 6px;
    .modal-container__title {
      margin-bottom: 33px;
      font-size: 30px;
      font-weight: $TEXT-BOLD;
    }
    .radio__block {
      width: 100%;
      background-color: #F4F8FC;
      border-radius: 4px;
      margin-bottom: 10px;
      padding: 9px 12px;
    }
    .check__block {
      margin-top: 30px;
      width: 100%;
    }
    .uncheck__cancel__btn {
      border-color: #D1D1D1;
      color: #9A9A99;
    }
    .uncheck__check__btn {
      border: 0px;
      color: #9A9A99;
    }
  }
  ::v-deep {
    .ant-form-item {
      margin: 0px;
    }
  }
</style>
