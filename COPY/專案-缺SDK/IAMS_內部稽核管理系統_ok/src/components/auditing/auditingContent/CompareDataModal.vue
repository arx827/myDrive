<template>
  <InfoModal
    title="比對資料"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    :height-full-screen="true"
    :centered="false"
    @closeModal="close"
  >
    <template slot="content">
      <div class="modal__list">
        <template v-if="compareData && compareData.length > 0">
          <div
            v-for="(item,index) in compareData"
            :key="index"
            class="modal__list__item"
          >
            <div class="modal__list__item__title">
              <span>{{ item.updateDatetime }}</span>
              <span>{{ item.updateRole.name }}/{{ item.updateUser.name }}</span>
            </div>
            <p
              class="content"
              v-html="item.content"
            />
          </div>
        </template>
        <!-- 無比對資料時，顯示空框 -->
        <div
          v-else
          class="d-flex flex-column justify-content-center align-items-center comp__empty"
        >
          <img
            src="@/assets/images/icon/icon-no-found.svg"
            alt=""
          >
          <div class="comp__empty--text">
            無比對資料
          </div>
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import {
	Getter, Action, namespace,
} from 'vuex-class';
import htmlDiff from 'htmldiff-js';

import { AuditDraftContentLogDto } from '@fubonlife/iams-api-axios-sdk';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';

const modalModule = namespace('modalControl');

@Component({
	components: {
		InfoModal,
	},
})
export default class CompareDataModal extends Vue {
  @modalModule.Action('setModalState') setModalState;

	@Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  @Prop()
  auditDraftContentId: string;

  @Prop()
  currentData: AuditDraftContentLogDto;

  compareData: AuditDraftContentLogDto[] = null;

  diffCompareData(rawCompareData: AuditDraftContentLogDto[]) {
  	rawCompareData = rawCompareData.map((item, index) => {
  		const next = index + 1;
  		if (next == rawCompareData.length) return { ...item };
  		const diffText = htmlDiff.execute(rawCompareData[next].content, item.content);
  		return { ...item, content: diffText };
  	});
  	return rawCompareData;
  }

  formatRawData(rawCompareData: AuditDraftContentLogDto[]) {
  	rawCompareData = rawCompareData.map((item) => ({
  		...item,
  		updateDatetime: DateTimeFormmat.transformRocDate(item.updateDatetime),
  	}));
  	rawCompareData.unshift(this.currentData);
  	return rawCompareData;
  }

  close() {
  	this.compareData = null;
  	this.$emit('closeModal');
  }

  // API: 取得查核內容比對資料
  getDraftCompareDate(auditDraftContentId: string) {
  	this.setLoading(true);
  	this.$workPaperApi.getDraftContentLogUsingGET(auditDraftContentId)
  		.then((resp) => {
  		 	this.compareData = this.diffCompareData(this.formatRawData(resp.data.result));
  			console.log('this.compareData', this.compareData);
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '取得比對資料失敗',
  				},
    		  });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

	/**
   * 監聽
   */
	@Watch('visible', { deep: true })
  onVisibleChanged(nV) {
  	if (this.visible) this.getDraftCompareDate(this.auditDraftContentId);
  }
}
</script>

<style lang="scss" scoped>
.modal__list {
  margin-top: 10px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  .modal__list__item {
    // min-height: 176px;
    background-color: $COLOR-LIGHT;
    padding: 20px;
    margin-top: 15px;
    &:first-child {
      margin-top: 0;
    }
  }
  ::v-deep{
    ins.diffmod,
    ins.diffins {
      background-color: #FFE58F;
    }

    del.diffdel,
    del.diffmod {
      background-color: #E5F2F5;
    }
    figure del.diffmod,
    figure del.diffins,
    figure ins.diffmod,
    figure ins.diffins {
      display: block;
      padding: 10px;
    }
  }
}
.modal__list__item__title{
  margin-bottom: 7px;
  color: $COLOR-MAIN1;
  span:nth-child(2){
    margin-left: 30px;
  }
}
.content{
  white-space: pre-line;
}
.comp__empty{
  background-color: $BG_LIGHT;
  padding: 2.5em 0em;
	.comp__empty--text{
		margin-left: -17px;
		color: #000000A6;
		margin-top: 5px;
	}
}
</style>
