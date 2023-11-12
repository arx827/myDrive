<template>
  <div>
    <div
      v-if="propData.caseType"
      class="dataType__form__card"
    >
      <KeepAlive>
        <component
          :is="currentView"
          :prop-data="propData"
          :show-crawler-data-id="true"
        >
          <template
            v-if="isClaimGroupShow"
            slot="claimGroup"
          >
            <!-- 認列組別 -->
            <a-row class="d-flex w-100">
              <a-col class="col">
                <a-form-model-item
                  class="w-100"
                  label="認列組別"
                >
                  <a-input
                    v-model="getClaimGroup"
                    :rows="1"
                    disabled
                  />
                </a-form-model-item>
              </a-col>
              <IconTextButton
                class="ms-2"
                text="設定認列組別"
                type="group"
                @click="setDetailModalState({
                  confirmGroupModal: {
                    visible: true,
                  }
                })"
              />
            </a-row>
          </template>
        </component>
      </KeepAlive>
    </div>
    <!-- 部主管 才顯示 不認列組別確認，無資料不顯示 -->
    <template v-if="isNoClaimGroupShow && notRecognizedForm.length > 0">
      <h5 class="notRecognized__title">
        不認列組別確認
      </h5>
      <div class="dataType__form__card notRecognized__form__card">
        <a-form-model>
          <a-row
            v-for="(item, index) in notRecognizedForm"
            :key="index"
            class="d-flex w-100 notRecognized__wrap"
          >
            <a-col class="col">
              <!-- 資料型態 -->
              <a-form-model-item
                :label="item.auditorTeamName"
                class="w-100"
              >
                <a-input
                  v-model="item.applyRemark"
                  type="text"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <div class="button__wrap">
              <button
                class="btn--dark"
                @click="onReviewNotClaimGroup(item, true)"
              >
                通過
              </button>
              <button
                class="btn--primary"
                @click="onReviewNotClaimGroup(item, false)"
              >
                退回
              </button>
            </div>
          </a-row>
        </a-form-model>
      </div>
      <NotClaimModal
        ref="notClaimModalRef"
        :visible="isNotClaimModal"
        @submit="onNotClaimModalEmit"
        @closeModal="isNotClaimModal = false"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Emit, Watch,
} from 'vue-property-decorator';

import DataType__comp1 from '@shared/form/formDataType/FormDataType_1.vue'; // 法令函釋
import DataType__comp2 from '@shared/form/formDataType/FormDataType_2.vue'; // 主要檢查缺失
import DataType__comp3 from '@shared/form/formDataType/FormDataType_3.vue'; // 裁罰案件、年度檢查重點
import DataType__comp4 from '@shared/form/formDataType/FormDataType_4.vue'; // 事件清單、委外作業清單
import NotClaimModal from '@/components/crawlerData/crawlerDetail/NotClaimModal.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import { NotClaimGroupResponseDto, ReviewNotClaimGroupRequest } from '@fubonlife/iams-api-axios-sdk';
import { Action, Getter, namespace } from 'vuex-class';

const detailModule = namespace('crawlerDataDetailVuex');
const modalModule = namespace('modalControl');

@Component({
	components: {
		DataType__comp1,
		DataType__comp2,
		DataType__comp3,
		DataType__comp4,
		IconTextButton,
		NotClaimModal,
	},
})
export default class CrawlerDataTypeChange extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

  @detailModule.Action('setDetailModalState') setDetailModalState;

  @detailModule.State('detailData') vuexDetailData;

  @Prop()
  propData;

  @Prop()
  crawlerDataId;

  roleId: string = '';

  dataTypeCom = {}

  // 部主管-非認列組別退回彈窗
  isNotClaimModal: boolean = false;

  reviewRequset: ReviewNotClaimGroupRequest = null;

  get currentView() {
  	if (Object.keys(this.propData.caseType).length > 0) {
  		return `DataType__${this.$enum.getDataTypeComp(Object.keys(this.propData.caseType)[0])}`;
  	}
  	return 'DataType__comp1';
  }

  notRecognizedForm: NotClaimGroupResponseDto[] = [];

  // 認列組別Array
  claimGroupObj = [];

  get getClaimGroup() {
  	return Object.values(this.claimGroupObj.map((i) => i.auditorTeamName)).join('、');
  }

  // 顯示/隱藏 認列組別選單
  get isClaimGroupShow() {
  	// 會顯示的權限：部主管
  	const roleInclude = ['ROLE_Audit_Department_Head'];
  	if (this.roleId && roleInclude.includes(this.roleId)) {
  		return true;
  	}
  	return false;
  }

  // 顯示/隱藏 不認列組別選單
  get isNoClaimGroupShow() {
  	// 會顯示的權限：部主管
  	const roleInclude = ['ROLE_Audit_Department_Head'];
  	if (this.roleId && roleInclude.includes(this.roleId)) {
  		return true;
  	}
  	return false;
  }

  /**
   * API
   */
  // API: 不認列組別待確認查詢API
  getApi_NotClaimGroup() {
  	this.setLoading(true);
  	this.$dataCollectApi.getNotClaimGroupUsingGET(this.crawlerDataId)
  		.then((resp) => {
  			this.notRecognizedForm = resp.data.result;
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 覆核不認列組別API
  getApi_reviewNotClaimGroup(agree) {
  	this.setLoading(true);
  	this.$dataCollectApi.reviewNotClaimGroupInDataCollectUsingPOST(this.reviewRequset)
  		.then((resp) => {
  			(this.$refs.notClaimModalRef as any).clear();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: `審核${(agree) ? '通過' : '退回'}成功`,
  					autoClose: 3,
  				},
  			});
  		  // this.isNotClaimModal = false;
  			this.getApi_NotClaimGroup();
  			this.$nextTick(() => {
  				this.getApi_getClaimGroup();
  			});
  		})
  		.catch((err) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: `審核${(agree) ? '通過' : '退回'}失敗`,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢認列組別
  getApi_getClaimGroup() {
  	this.setLoading(true);
  	this.$dataCollectApi.getClaimGroupInDataCollectUsingGET(this.crawlerDataId)
  		.then((resp) => {
  			const getData = resp.data;
  			this.claimGroupObj = getData.result;
  			// console.log('查詢認列組別API:', getData);
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * Event
   */
  // 通過/退回 不認列組別待確認
  onReviewNotClaimGroup(obj: NotClaimGroupResponseDto, agree) {
  	this.reviewRequset = {
  		crawlerDataIds: this.crawlerDataId,
  	  dataGroupId: obj.dataGroupId,
  	  dataGroupLogId: obj.dataGroupLogId,
  	  isAgree: agree ? 'Y' : 'N',
  	};
  	// 退回 跳彈窗 改走另一流程
  	if (!agree) {
  		this.isNotClaimModal = true;
  		return false;
  	}

  	// 通過
  	this.getApi_reviewNotClaimGroup(true);
  }

  // 退回彈窗emit
  onNotClaimModalEmit(remark) {
  	this.reviewRequset.remark = remark;
  	this.getApi_reviewNotClaimGroup(false);
  }

  /**
   * Hook
   */
  async created() {
  	this.roleId = this.$global.getCurrentRoleId();
  	// 部主管 才取得 不認列組別API
  	if (this.roleId === 'ROLE_Audit_Department_Head') {
  		this.getApi_NotClaimGroup(); // 取得 不認列組別API
  	}
  }

  /**
   * 監聽
   */
  // 只要 detail 認列組別 有更新 就刷新 認列組別列表
	@Watch('vuexDetailData.claimGroup', { immediate: true, deep: true })
  watchClaimGroup(newVal) {
  	this.$nextTick(() => {
  		this.getApi_getClaimGroup();
  	});
  }
}
</script>

<style lang="scss" scoped>
	.dataType__form__card {
		background: $BG-YELLOW;
	}
  ::v-deep {
    .dataType__page {
      padding: 16px 55px;
    }
    .ant-form-item {
      display: flex;
      align-items: flex-start;
      width: 20%;   // 預設 5等份
      margin-top: 4px;
      margin-bottom: 4px;
      .ant-form-item-label {
				line-height: 1.7;
				width: 5em;
        font-weight: 600;
			}
			.ant-form-item-control-wrapper {
				flex: 1 0 5em;
			}
			.ant-form-item-control {
				line-height: initial;
			}
    }
    .ant-input {
			height: auto;
			&[disabled] {
				border: 0;
				border-radius: 0;
				color: $COLOR-DARK;
				background: $COLOR-MAIN7;
			}
		}
    .detail__link__wrap {
      line-height: 1.5;
      .detail__link__label {
        text-align: right;
        font-size: 14px;
        width: 5rem;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        &::after {
          content: ':';
          position: relative;
          top: -0.5px;
          margin: 0 8px 0 2px;
        }
      }
      .detail__link {
        word-break: break-all;
      }
    }
  }
  .notRecognized__form__card {
    padding-top: 10px;
    padding-bottom: 10px;
    .button__wrap {
      margin-left: 10px;
      button {
        padding: 10px 20px;
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
  }
  .notRecognized__title {
    margin-top: 16px;
    font-size: 18px;
    font-weight: 600;
  }
  .notRecognized__wrap {
    padding: 5px 55px 5px 45px;
    > .ant-form-item {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        width: 100%;
      }
    }
    ::v-deep {
      .ant-form-item {
        .ant-form-item-label {
          width: 6em;
        }
      }
    }
  }
</style>
