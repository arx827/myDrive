<!-- 副總稽核 彈窗 -->
<template>
  <InfoModal
    title="資料覆核"
    :visible="visible"
    :centered="true"
    :width="500"
    :closable="true"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div>
        <p class="notes">
          是否給副總稽核確認
        </p>
        <div class="sobv__buttonBarWrap d-flex justify-content-center">
          <div class="col sobv__buttonWrap">
            <button
              class="sobv__button d-flex justify-content-center align-items-center"
              @click="submit(true)"
            >
              <i class="sobv__icon sobv__confirm" />
              <span class="sobv__text">是</span>
            </button>
            <span class="caption">提供副總稽核確認！</span>
          </div>
          <div class="col sobv__buttonWrap">
            <button
              class="sobv__button d-flex justify-content-center align-items-center"
              @click="submit(false)"
            >
              <i class="sobv__icon sobv__close" />
              <span class="sobv__text">否</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import { Getter, Action, namespace } from 'vuex-class';
import { DataConfirmRequestDto } from '@fubonlife/iams-api-axios-sdk';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import ResponseMessage from '@/components/shared/ResponseMessage.vue';

const modalControl = namespace('modalControl');

@Component({
	components: { InfoModal, ResponseMessage, FblDataGrid },
})
export default class ReviewCommitModal extends Vue {
	@Action('setLoading') setLoading;

  @PropSync('visible')
  syncedVisible: boolean;

  form = {
  	auditContent: '',
  }

  formRules: { [key: string]: ValidationRule[] } = {
  	auditContent: [{ required: true, message: '請選擇查核內容', trigger: 'change' }],
  };

  // // API: TODO: 取得查核內容
  // getApi_saveSendType() {
  // 	console.log('儲存API');
  // }

  /**
	* Event
	*/
  closeModal() {
  	this.syncedVisible = false;
  }

  async submit(boolean) {
  	this.$emit('updateData', boolean);
  	this.syncedVisible = false;
  }

  /**
	* 監聽
	*/
  @Watch('syncedVisible')
  watchVisible(nV) {
  	if (nV) {
  		// this.getApi_auditing();
  	}
  }
}
</script>

<style lang="scss" scoped>
  .notes {
    color: #FFF;
    margin: 10px 0 0;
  }
  .sobv__buttonBarWrap {
    margin: 0 20px;
  }
  .caption {
    display: block;
    font-size: 14px;
    color: $COLOR-LIGHT;
    margin-top: 10px;
  }
  .sobv__buttonWrap {
    margin: 15px;
  }
  .sobv__button {
    width: 100%;
    padding: 22px 50px;
    border: 0px;
    background: $COLOR-LIGHT;
    cursor: pointer;
    &:hover {
      background: $COLOR-MAIN18;
    }
  }
  .sobv__icon {
    display: inline-block;
    width: 34px;
    height: 34px;
    background-repeat: no-repeat;
    margin-right: 10px;
  }
  .sobv__confirm {
    background-image: url('~@images/icon/icon_confirm_sobv.svg');
  }
  .sobv__close {
    background-image: url('~@images/icon/icon_close_sobv.svg');
  }
  .sobv__text {
    font-size: 21px;
    color: $COLOR-MAIN19;
  }
</style>
