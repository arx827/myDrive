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
        <template v-if="history.length > 0">
          <div class="row modal__header">
            <div class="col-9 modal__header__item">
              查核意見/風險等級/改善期限/負責部門
            </div>
            <div class="col-3 modal__header__item">
              建議事項
            </div>
          </div>

          <!-- auditOpinionVersions -->
          <div
            v-for="(auditOpinionVersion, index) in diffList"
            :key="index"
            class="modal__list__item"
          >
            <div
              class="row"
              type="flex"
            >
              <div class="col-9 cell version_info">
                <div class="modal__list__item__title">
                  <span>{{ history[index].updateDatetime }}</span>
                  <span>{{ history[index].updateRole }}/{{ history[index].updateUser }}</span>
                </div>
              </div>
              <div class="col-3 cell suggestion" />
            </div>
            <!-- auditOpinions -->
            <div
              v-for="auditOpinion in auditOpinionVersion.auditOpinions"
              :key="auditOpinion.auditOpinionId"
              class="row"
              type="flex"
            >
              <div class="col-9 cell">
                <div class="modal__list__item__subtitle">
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span
                        class="highlight"
                        v-html="auditOpinion.seq"
                      /><span class="highlight">. 主項：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="auditOpinion.content"
                    />
                  </div>
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span class="highlight">負責部門：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="auditOpinion.auditOpinionUnits"
                    />
                  </div>
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span class="highlight">意見摘要：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="auditOpinion.suggestion"
                    />
                  </div>
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span class="highlight">風險等級：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="auditOpinion.riskLevel"
                    />
                  </div>
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span class="highlight">改善期限：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="auditOpinion.improveDeadLine"
                    />
                  </div>
                  <!-- <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span>風險等級：</span>
                    </div>
                    <div class="col-10 row g-0">
                      <span
                        class="col-4"
                        v-html="auditOpinion.riskLevel"
                      />
                      <div class="col">
                        <span class="highlight">改善期限：</span><span
                          v-html="auditOpinion.improveDeadLine"
                        />
                      </div>
                    </div>
                  </div> -->
                </div>
              </div>
              <div class="col-3 cell suggestion">
                <span
                  class="content"
                  v-html="auditOpinion.seq"
                />.<br>
                <p
                  class="content"
                  v-html="auditOpinion.suggestion"
                />
              </div>

              <!-- subAuditOpinions -->
              <div
                v-for="subAuditOpinion in auditOpinion.subAuditOpinions"
                :key="subAuditOpinion.auditOpinionId"
                class="row row_sub"
                type="flex"
              >
                <div class="offset-1 col-8 cell__sub cell modal__list__item__subtitle">
                  <div class="row g-0">
                    <div class="col-auto text-end">
                      <span class="highlight">(<span v-html="subAuditOpinion.seq" />). 子項：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="subAuditOpinion.content"
                    />
                  </div>
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span class="highlight">負責部門：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="subAuditOpinion.auditOpinionUnits"
                    />
                  </div>
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span class="highlight">風險等級：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="subAuditOpinion.riskLevel"
                    />
                  </div>
                  <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span class="highlight">改善期限：</span>
                    </div>
                    <span
                      class="col-10"
                      v-html="subAuditOpinion.improveDeadLine"
                    />
                  </div>
                  <!-- <div class="row g-0">
                    <div class="highlight col-auto text-end">
                      <span>風險等級：</span>
                    </div>
                    <div class="col-8 row g-0">
                      <span
                        class="col-4"
                        v-html="subAuditOpinion.riskLevel"
                      />
                      <div class="col">
                        <span class="highlight">改善期限：</span><span
                          v-html="subAuditOpinion.improveDeadLine"
                        />
                      </div>
                    </div>
                  </div> -->
                </div>
                <div class="col-3 cell__sub cell suggestion">
                  <span class="content">
                    <span v-html="auditOpinion.seq" />(<span v-html="subAuditOpinion.seq" />).
                  </span><br>
                  <p
                    class="content"
                    v-html="subAuditOpinion.suggestion"
                  />
                </div>
              </div>
            </div>
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
import { Getter, Action } from 'vuex-class';
import htmlDiff from 'htmldiff-js';

export interface subAuditOpinionDto {
  auditOpinionId: string;
  seq: string;
  auditOpinionUnits: string;
  riskLevel: string;
  improveDeadLine: string;
  content: string;
  suggestion: string;
}
export interface auditOpinionDto {
  auditOpinionId: string;
  seq: string;
  auditOpinionUnits: string;
  riskLevel: string;
  improveDeadLine: string;
  content: string;
  suggestion: string;
  subAuditOpinions: subAuditOpinionDto[];
}
@Component({
	components: {
		InfoModal,
	},
})
export default class CompareDataModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  @Prop()
  auditDraftContentId: string;

  history = [];

  diffList: {
    version: number;
    auditOpinions: auditOpinionDto[];
  }[] = [];

  /* Watcher */
  @Watch('visible')
  onVisible(newValue) {
  	if (newValue) {
		  this.getHistory(this.auditDraftContentId);
  	}
  }

  /* Event */
  addEarliestDiff() {
  	// 初版不比對
  	const idEarliest = this.history.length - 1;
  	const diff = {
  		version: this.history[idEarliest].version,
  		auditOpinions: this.history[idEarliest].auditOpinions,
  	};
  	this.diffList.push(diff);
  	console.log('version done', this.history[idEarliest].version);
  }

  generateDiff(version, opinionList, newOpinionList) {
  	const diff = {
  		version, // 版本新的
  		auditOpinions: [],
  	};
  	if (opinionList.length !== newOpinionList.length) {
  		console.log('generateDiff Error: length of lists do not match');
  		console.log(opinionList.length, newOpinionList.length);
  		return;
  	}

  	const auditOpinionLen = opinionList.length;
  	// console.log('auditOpinionLen', auditOpinionLen);
  	for (let k = 0; k < auditOpinionLen; k++) {
  		const subOpinionList = opinionList[k].subAuditOpinions;
  		const newSubOpinionList = newOpinionList[k].subAuditOpinions;
  		const subAuditOpinionLen = subOpinionList.length;
  		const subAuditOpinions = []; // Diff
  		// console.log('subAuditOpinionLen', subAuditOpinionLen);
  		for (let j = 0; j < subAuditOpinionLen; j++) {
  			subAuditOpinions.push({
  				auditOpinionId: subOpinionList[j].auditOpinionId,
  				seq: htmlDiff.execute(subOpinionList[j].seq || '', newSubOpinionList[j].seq || ''),
  				auditOpinionUnits: htmlDiff.execute(subOpinionList[j].auditOpinionUnits || '', newSubOpinionList[j].auditOpinionUnits || ''),
  				riskLevel: htmlDiff.execute(subOpinionList[j].riskLevel || '', newSubOpinionList[j].riskLevel || ''),
  				improveDeadLine: htmlDiff.execute(subOpinionList[j].improveDeadLine || '', newSubOpinionList[j].improveDeadLine || ''),
  				content: htmlDiff.execute(subOpinionList[j].content || '', newSubOpinionList[j].content || ''),
  				suggestion: htmlDiff.execute(subOpinionList[j].suggestion || '', newSubOpinionList[j].suggestion || ''),
  			opinionSummary: htmlDiff.execute(subOpinionList[j].opinionSummary || '', newSubOpinionList[j].opinionSummary || ''),
  			});
  			// console.log('subAudit done,', newOpinionList[k].seq, '-', newSubOpinionList[j].seq, newSubOpinionList[j].auditOpinionId);
  		}
  		diff.auditOpinions.push({
  			auditOpinionId: opinionList[k].auditOpinionId,
  			seq: htmlDiff.execute(opinionList[k].seq || '', newOpinionList[k].seq || ''),
  			auditOpinionUnits: htmlDiff.execute(opinionList[k].auditOpinionUnits || '', newOpinionList[k].auditOpinionUnits || ''),
  			riskLevel: htmlDiff.execute(opinionList[k].riskLevel || '', newOpinionList[k].riskLevel || ''),
  			improveDeadLine: htmlDiff.execute(opinionList[k].improveDeadLine || '', newOpinionList[k].improveDeadLine || ''),
  			content: htmlDiff.execute(opinionList[k].content || '', newOpinionList[k].content || ''),
  			suggestion: htmlDiff.execute(opinionList[k].suggestion || '', newOpinionList[k].suggestion || ''),
  			opinionSummary: htmlDiff.execute(opinionList[k].opinionSummary || '', newOpinionList[k].opinionSummary || ''),
  			subAuditOpinions,
  		});
  		// console.log('audit done,', newOpinionList[k].seq, newOpinionList[k].auditOpinionId);
  	}
  	// console.log('version done', version); // 'version done, 3' -> 3(新) 和 2(舊) 完成比對
  	return diff;
  }

  // 複製空的 auditOpinion
  createEmptyOpinion(id) {
  	return {
  		auditOpinionId: id,
  		seq: '',
  		auditOpinionUnits: '',
  		riskLevel: '',
  		improveDeadLine: '',
  		content: '',
  		suggestion: '',
  		subAuditOpinions: [],
  	};
  }

  // 複製空的 subAuditOpinion
  createEmptySubOpinion(id) {
  	return {
  		auditOpinionId: id,
  		seq: '',
  		auditOpinionUnits: '',
  		riskLevel: '',
  		improveDeadLine: '',
  		content: '',
  		suggestion: '',
  	};
  }

  format() {
  	// 清理 raw data
  	for (const version of this.history) {
  		for (const opinion of version.auditOpinions) {
  			opinion.seq = String(opinion.seq);
  			opinion.auditOpinionUnits = opinion.auditOpinionUnits.join('、'); // 將部門列表調整為字串
  			for (const subOpinion of opinion.subAuditOpinions) {
  				subOpinion.seq = String(subOpinion.seq);
  				subOpinion.auditOpinionUnits = subOpinion.auditOpinionUnits.join('、');
  			}
  		}
  	}

  	// Note: 越接近現在時間的 version, index 越小
  	const versionCount = this.history.length;
  	for (let i = 0; i < versionCount - 1; i++) {
  		// 1. 補新增和刪除的 opinion ------------------------------
  		// Deep copy opinion list
  		const opinionList = this.$global.deepCopyData(this.history[i + 1].auditOpinions);
  		const newOpinionList = this.$global.deepCopyData(this.history[i].auditOpinions);

  		const opinionIdList = opinionList.map((opinion) => (opinion.auditOpinionId));
  		const newOpinionIdList = newOpinionList.map((opinion) => (opinion.auditOpinionId));
  		// 前後版本 opinionId 的聯集, unsorted
  		const completeIdList = [...new Set([...opinionIdList, ...newOpinionIdList])];

  		// newOpinionIdList 沒有的 (刪除的)
  		const newOpinionIdDiff = completeIdList.filter((id) => !newOpinionIdList.includes(id));
  		if (newOpinionIdDiff.length !== 0) {
  			for (const elem of newOpinionIdDiff) {
  				// 生成空主項
  				const copiedOpinion = this.createEmptyOpinion(elem);
  				newOpinionList.push(copiedOpinion);
  			}
  		}
  		// opinionIdList 沒有的 (新增的)
  		const opinionDiff = completeIdList.filter((id) => !opinionIdList.includes(id));
  		if (opinionDiff.length !== 0) {
  			for (const elem of opinionDiff) {
  				// 生成空主項
  				const copiedOpinion = this.createEmptyOpinion(elem);
  				opinionList.push(copiedOpinion);
  			}
  		}

  		// 排序新增的物件
  		opinionList.sort((opinionA, opinionB) =>
  			(completeIdList.indexOf(opinionA.auditOpinionId) - completeIdList.indexOf(opinionB.auditOpinionId)));
  		newOpinionList.sort((opinionA, opinionB) =>
  			(completeIdList.indexOf(opinionA.auditOpinionId) - completeIdList.indexOf(opinionB.auditOpinionId)));

  		// 2. 補新增和刪除的 subOpinion ------------------------------
  		for (let j = 0; j < completeIdList.length; j++) {
  			const subOpinionList = opinionList[j].subAuditOpinions;
  			const newSubOpinionList = newOpinionList[j].subAuditOpinions;

  			const subOpinionIdList = subOpinionList.map((subOpinion) => (subOpinion.auditOpinionId));
  			const newSubOpinionIdList = newSubOpinionList.map((subOpinion) => (subOpinion.auditOpinionId));
  			const subCompleteIdList = [...new Set([...subOpinionIdList, ...newSubOpinionIdList])];

  			// newSubOpinionIdList 沒有的 (刪除的)
  			const newSubOpinionIdDiff = subCompleteIdList.filter((id) => !newSubOpinionIdList.includes(id));
  			if (newSubOpinionIdDiff.length !== 0) {
  				for (const subElem of newSubOpinionIdDiff) {
  					const copiedSubOpinion = this.createEmptySubOpinion(subElem);
  					newSubOpinionList.push(copiedSubOpinion);
  				}
  			}
  			// subOpinionIdList 沒有的 (新增的)
  			const subOpinionIdDiff = subCompleteIdList.filter((id) => !subOpinionIdList.includes(id));
  			if (subOpinionIdDiff.length !== 0) {
  				for (const subElem of subOpinionIdDiff) {
  					const copiedSubOpinion = this.createEmptySubOpinion(subElem);
  					subOpinionList.push(copiedSubOpinion);
  				}
  			}

  			// 排序新增的物件
  			subOpinionList.sort((subOpinionA, subOpinionB) =>
  				(subCompleteIdList.indexOf(subOpinionA.auditOpinionId) - subCompleteIdList.indexOf(subOpinionB.auditOpinionId)));
  			newSubOpinionList.sort((subOpinionA, subOpinionB) =>
  				(subCompleteIdList.indexOf(subOpinionA.auditOpinionId) - subCompleteIdList.indexOf(subOpinionB.auditOpinionId)));
  		}

  		// 3. 生成 diff 物件，推進 diffList ------------------------------
  		const diff = this.generateDiff(this.history[i].version, opinionList, newOpinionList);
  		this.diffList.push(diff);
  	}
  	this.addEarliestDiff();
  }

  close() {
  	this.$emit('closeModal');
  	this.history = [];
  	this.diffList = [];
  }

  /* API */
  getHistory(auditDraftContentId: string) {
  	this.setLoading(true);
  	this.$workPaperApi.compareAuditOpinionUsingGET(auditDraftContentId)
  		.then((resp) => {
  			this.history = resp.data;
  			this.format();
  		})
  		.catch((error) => {
  			console.error;
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /* Hook */
  created() {
  	console.log('compareFeed created');
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin-right: 0;
  margin-left: 0;
}
.row_sub {
  padding: 0;
}
.modal__list {
  padding: 15px;
  margin-top: 10px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  background-color: $BG-LIGHT;
  .modal__header {
    background-color: $COLOR-MAIN2;
    color: $FONT-LIGHT;
    text-align: center;
    .modal__header__item {
      border: solid 1px $FONT-LIGHT;
      padding: 8px 0;
    }
  }
  .modal__list__item {
    // min-height: 176px;
    background-color: $COLOR-LIGHT;
    border: solid 1px $COLOR-MAIN5;
    // padding: 20px;
    margin-top: 25px;
    &:nth-child(2) {
      margin-top: 8px;
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
  span{
    margin-left: 30px;
  }
  span > span, span:first-child{
    margin-left: 0;
  }
}
.highlight{
  width: 70px;
  color: $COLOR-MAIN1;
}
.modal__list__item__subtitle {
  span {
    font-size: 14px;
    vertical-align: top;
  }
}
.cell {
  padding: 0 16px 16px 16px;
}
.version_info {
  padding-top: 16px;
  padding-bottom: 0;
}
.suggestion {
  background-color: $BG-GRAY;
}
.cell__sub {
  // &:first-child {
  //   text-align: right;
  //   padding-right: 0;
  // }
}
.content{
  white-space: pre-line;
  margin-bottom: 6px;
  font-size: 14px;
	* {
		font-size: 14px;
	}
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
::v-deep{
	del.diffdel, del.diffmod, ins.diffins, ins.diffmod {
		font-size: 14px;
	}
}
</style>
