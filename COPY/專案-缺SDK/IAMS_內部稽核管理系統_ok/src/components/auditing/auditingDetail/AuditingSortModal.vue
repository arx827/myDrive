<!-- 查核內容排序 彈窗 -->
<template>
  <InfoModal
    :title="'查核內容排序'"
    :visible="visible"
    :centered="true"
    :width="950"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div class="bgLight__wrap mt-4">
        <div class="precautions">
          <div class="d-flex precautions__title">
            <a-icon
              class="precautions__icon"
              type="exclamation-circle"
            />查核內容排序的方法
          </div>
          <ul class="precautions__listGroup">
            <li class="precautions__list">
              請於序號欄位，輸入欲移到的位置輸入序號介於之間的數字ex.1.5 ，點選「確定」存檔後會將此筆移到序號1後面。
            </li>
            <li class="precautions__list">
              可以多筆一起移動，請於序號欄位，輸入欲移到的位置輸入序號介於之間的數字ex.1.1~1.9，點選「確定」存檔後會將多筆資料移到序號1後面。
            </li>
          </ul>
        </div>
        <fbl-data-grid
          class="table--pale table--auditingSort"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :bordered="true"
          :pagination="false"
        >
          <template v-slot:seq="slotData">
            <a-form-model-item
              :validate-status="validateStatus(slotData.data)"
              class="d-flex justify-content-center mb-0"
            >
              <input
                v-model.number="slotData.data.seq"
                type="number"
                :min="1"
                class="precautions__seq__input"
                @change="seqValidate"
              >
            </a-form-model-item>
          </template>
        </fbl-data-grid>
        <p
          v-if="seqError.empty.length > 0 || seqError.type.length > 0 || seqError.repeat.length > 0"
          class="message--error"
        >
          <template v-if="seqError.empty.length > 0 || seqError.type.length > 0">
            請填寫有效序號！
          </template>
          <template v-if="seqError.repeat.length > 0">
            序號不得重複！
          </template>
        </p>
      </div>
      <div
        class="d-flex mt-4 justify-content-end"
      >
        <button
          class="btn--primary me-2"
          @click="submit"
        >
          確認
        </button>
        <button
          class="btn--dark ms-2"
          @click="closeModal"
        >
          取消
        </button>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
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
  @modalControl.Action('setModalState') setModalState;

	@Action('setLoading') setLoading;

  @PropSync('visible')
  syncedVisible: boolean;

  @Prop()
  slotData;

  grid = {
  	rowKey: 'auditDraftContentId',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'seq',
  			width: '80px',
  			title: '序號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'content',
  			title: '查核內容',
  		},
  	],
  };

  seqError: {[key: string]: string[]} = {
  	empty: [],
  	type: [],
  	repeat: [],
  };

  validateStatus({ auditDraftContentId }) {
  	return this.seqError.empty.includes(auditDraftContentId) || this.seqError.type.includes(auditDraftContentId) || this.seqError.repeat.includes(auditDraftContentId) ? 'error' : '';
  }

  // 取得查核內容
  get_auditingContent() {
  	this.grid.data = [];
  	this.grid.data = this.$global.deepCopyData(this.slotData).filter((i) => i.status.keyId !== '90');
  }

  /**
	* API
	*/
  // API: 調整查核內容序號
  getApi_setAuditDraftContentSeq() {
  	this.setLoading(true);
  	const submitData = this.grid.data.map((i) => ({
  		auditDraftContentId: i.auditDraftContentId,
  		seq: i.seq,
  	}));
  	this.$workPaperApi.setAuditDraftContentSeqUsingPOST(submitData)
  		.then((resp) => {
  			const getData = resp.data;
  			if (getData) {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '調整排序成功',
  						autoClose: 3,
  					},
  				});
  				this.closeModal();
  				this.$emit('updateData');
  			} else {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: '調整排序失敗',
  					},
  				});
  			}
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '調整排序失敗',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  /**
	* Event
	*/
  closeModal() {
  	this.syncedVisible = false;
  }

  // 錯誤歸零
  clearSeqError() {
  	this.seqError.empty = [];
  	this.seqError.type = [];
  	this.seqError.repeat = [];
  }

  seqValidate() {
  	// 處理 格式不符
  	this.seqError.type = this.grid.data.filter((i) => isNaN(Number(i.seq))).map((i) => i.auditDraftContentId);
  	this.seqError.empty = this.grid.data.filter((i) => !i.seq).map((i) => i.auditDraftContentId);
  	// 處理 重複序號
  	// 取得所有 seq
  	const seqArr = this.grid.data.map((i) => i.seq);
  	// 取得重複的 seq
  	const repeat = seqArr.filter((ele, idx, arr) => arr.indexOf(ele) !== idx);
  	this.seqError.repeat = this.grid.data.filter((i) => repeat.includes(i.seq)).map((i) => i.auditDraftContentId);

  	// 排序
  	// if (!(this.seqError.empty.length > 0 || this.seqError.type.length > 0 || this.seqError.repeat.length > 0)) {
  	// 	this.grid.data = this.grid.data.sort((a, b) => a.seq - b.seq);
  	// }
  }

  submit() {
  	this.clearSeqError();
  	this.seqValidate();
  	if (!(this.seqError.empty.length > 0 || this.seqError.type.length > 0 || this.seqError.repeat.length > 0)) {
  		this.getApi_setAuditDraftContentSeq();
  	}
  }

  /**
	* 監聽
	*/
  @Watch('syncedVisible')
  watchVisible(nV) {
  	if (nV) {
  		this.clearSeqError();
  		this.get_auditingContent();
  	}
  }
}
</script>

<style lang="scss" scoped>
  .bgLight__wrap {
    background-color: $BG-LIGHT;
    padding: 15px;
  }
  .precautions {
    background-color:$COLOR-MAIN10;
    border: 1px solid $COLOR-MAIN20;
    border-radius: 5px;
    padding: 18px;
  }
  .precautions__icon{
    color: $COLOR-MAIN21;
    margin-right: 16px;
    ::v-deep{
      svg {
        font-size: 24px;
      }
    }
  }
  .precautions__title {
    font-weight: 600;
  }
  .precautions__listGroup {
    margin-top: 7px;
    margin-left: 40px;
    margin-right: 30px;
    font-size: 14px;
    counter-reset: c;
    .precautions__list {
      padding-left: 1.5rem;
      &::before {
        counter-increment: c;
        content: '('counter(c)')';
        position: absolute;
        left: 0;
      }
    }
  }

  ::v-deep {
    .table--auditingSort {
      margin-top: 10px;
      .ant-table {
        .ant-table-tbody {
          > tr {
            > td {
              vertical-align: middle;
            }
          }
        }
      }
      .ant-table-tbody {
        .ant-table-row-level-0 {
          .ant-table-row-cell-break-word {
            &:first-child {
              padding: 5px;
            }
          }
        }
      }
    }
    .precautions__seq__input {
      border: 1px solid #D9D9D9;
      border-radius: 5px;
      width: 4em;
      text-align: center;
      line-height: 2;
    }
  }

  .message--error {
    color: $FORMERROR-TEXT;
    margin-top: 10px;
    margin-bottom: 0;
  }

  .has-error {
    .precautions__seq__input {
      border-color: $FORMERROR-BORDER;
    }
  }
</style>
