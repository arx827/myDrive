<!-- Tab 年度稽核計畫 -->
<template>
  <div class="audit__page">
    <h4>查核項目</h4>
    <div
      class="audit__container"
      :class="{ 'disabled': !isEdit }"
    >
      <div class="audit__sideWrap">
        <ul
          v-if="auditSideMenuArr.length > 0"
          class="audit__sideMenu"
        >
          <li
            v-for="item in auditSideMenuArr"
            :key="item.auditItem"
            class="audit__sideMenu__item d-flex align-items-center"
            :class="{
              'audit__sideMenu__item--selected': item.operate === 'add' || item.relId,
            }"
            @click="onAddSelectAudit(item.auditItem)"
          >
            <a-icon
              type="check"
              class="audit__sideMenu__icon"
            />{{
              item.auditItemName
            }}
          </li>
        </ul>
        <div
          v-if="isEdit"
          class="audit__sideAddControlWrap d-flex align-items-center mt-3"
        >
          <span class="audit__sideAddControl__title">新增查核項目</span>
          <a-form-item
            class="audit__sideAddControl__input"
            :validate-status="auditSideAddError ? 'error' : ''"
            :help="auditSideAddError ? '不得為空' : null"
          >
            <a-input
              v-model="addAuditInput"
              @change="auditSideAddError = false"
            />
          </a-form-item>
          <a-button
            class="audit__sideAddControl__btn btn--primary"
            @click="onSaveSideMenu"
          >
            儲存
          </a-button>
        </div>
      </div>
      <div class="audit__textareaGroup">
        <template v-for="(item, index) in changeAuditArr">
          <div
            :key="`textarea${index+1}`"
            class="audit__textarea__item"
          >
            <div class="audit__textarea__header">
              <span class="audit__textarea__title">{{
                auditSideMenuArr.find((i) => i.auditItem == item.auditItem)
                  .auditItemName
              }}</span>
              <!-- TODO: 此階段先隱藏 -->
              <!-- <a-form-model
              v-if="dataTypeStr == 'A'"
              class="audit__actGroup d-flex align-items-center ms-auto"
            >
              <a-form-model-item>
                <a-input
                  v-model="item.relContent.article"
                  :disabled="!isEdit"
                />
              </a-form-model-item>
              <p class="audit__actUnit">
                條
              </p>
              <a-form-model-item>
                <a-input
                  v-model="item.relContent.paragraph"
                  :disabled="!isEdit"
                />
              </a-form-model-item>
              <p class="audit__actUnit">
                項
              </p>
              <a-form-model-item>
                <a-input
                  v-model="item.relContent.subparagraph"
                  :disabled="!isEdit"
                />
              </a-form-model-item>
              <p class="audit__actUnit">
                款
              </p>
              <a-form-model-item>
                <a-input
                  v-model="item.relContent.item"
                  :disabled="!isEdit"
                />
              </a-form-model-item>
              <p class="audit__actUnit">
                目
              </p>
            </a-form-model> -->
              <template v-if="item.operate == 'delete'">
                <a-icon
                  v-if="isEdit"
                  class="audit__act__icon audit__act__action__icon"
                  type="delete"
                  @click="onRemoveSelectAudit(item.auditItem)"
                />
              </template>
              <template v-else>
                <CustomPopConfirm
                  title="確認刪除？"
                  @confirm="onRemoveSelectAudit(item.auditItem)"
                >
                  <a-icon
                    v-if="isEdit"
                    class="audit__act__icon"
                    type="delete"
                  />
                </CustomPopConfirm>
              </template>
            </div>
            <a-form-item
              class="audit__textarea__input w-100 m-0"
              :validate-status="getCheckValidation.view1.includes(item.auditItem) ? 'error' : ''"
            >
              <a-textarea
                v-model="item.relContent.content"
                class="audit__textarea"
                :disabled="!isEdit"
                :auto-size="{ minRows: 1 }"
                @change="clearCheckValidation({key: '1', auditItem: item.auditItem})"
              />
            </a-form-item>
          </div>
          <p
            v-if="getCheckValidation.view1.includes(item.auditItem)"
            :key="`contentError${index}`"
            class="text-end message--error"
          >
            不得為空
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { Action, namespace } from 'vuex-class';

const detailModule = namespace('crawlerDataDetailVuex');

@Component({
	components: {
		CustomPopConfirm,
	},
})
export default class ControlCurrentView_1 extends Vue {
  @Action('setLoading') setLoading;

  @detailModule.Action('setDetailData') setDetailData;

  @detailModule.Action('updated') updated;

  @detailModule.Action('delRelProcess') delRelProcess;

  @detailModule.Getter('getDetailData') getDetailData;

  @detailModule.Getter('getRelProcess_1') getRelProcess_1;

  @detailModule.Getter('getCheckValidation') getCheckValidation;

  @detailModule.Action('clearCheckValidation') clearCheckValidation;

  @detailModule.Getter('getAccountAgentList') getAccountAgentList;

  @Prop()
  dataTypeStr: string;

  @Prop()
  crawlerDataId: string;

  // 權限
  get roleId() {
  	return this.$global.getCurrentRole().id;
  }

  get auditSideMenuArr() {
  	return this.getRelProcess_1;
  }
  // auditSideMenuArr = [];

  // 判斷是否為可編輯，不可編輯時全show，可編輯時只顯示勾選項目
  // 不可編輯時 改為 只顯示勾選項目 (2022/06/16)
  get changeAuditArr() {
  	return this.auditSideMenuArr.filter((i) => i.operate === 'add' || i.relId);
  }

  addAuditInput = '';

  // 新增查核項目 檢核顯示/隱藏
  auditSideAddError = false;

  get isEdit() {
  	const confirmStatus = this.getDetailData.groupStatus;
  	const confirmIsMe = [this.$user.getMe().employee.domainId, ...this.getAccountAgentList].includes(this.getDetailData.confrimUser);
  	// 權限為組長 或 查核人員，而且 資料確認人員 為自己
  	if (['ROLE_Audit_Team_Head', 'ROLE_Auditor'].includes(this.roleId) && confirmIsMe && confirmStatus === 'A') {
  		// 權限為組長 而且 資料確認人員 為自己
  		return true;
  	}
  	return false;
  }

  // 勾選 左邊選單
  onAddSelectAudit(auditItem) {
  	if (this.isEdit) {
  		const thatAuditSideMenu = this.auditSideMenuArr.find((i) => i.auditItem === auditItem);
  		thatAuditSideMenu.operate = thatAuditSideMenu.operate === 'add' ? 'modify' : 'add';
  		if (thatAuditSideMenu.operate == 'modify') {
  			this.delRelProcess({ relprocessId: 'relProcess_1', auditItem });
  		}
  	} else {
  		return false;
  	}
  }

  // 移除 右側區塊
  onRemoveSelectAudit(auditItem) {
  	const thatAuditSideMenu = this.auditSideMenuArr.find(
  		(i) => i.auditItem === auditItem,
  	);
  	thatAuditSideMenu.operate = 'modify';

  	this.delRelProcess({ relprocessId: 'relProcess_1', auditItem });
  }

  /**
   * API
   */
  // API: 儲存左邊新增項目
  onSaveSideMenu() {
  	const inputText = this.addAuditInput.trim();
  	if (!inputText) {
  		this.auditSideAddError = true;
  		return false;
  	}
  	this.setLoading(true);
  	this.$dataCollectApi
  		.creatAuditorItemInDataCollectUsingGET(inputText)
  		.then((resp) => {
  			// 清空輸入框
  			this.addAuditInput = '';
  			// 刷新 查核項目
  			this.updated({
  				relProcess: true,
  			});
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
.audit__container {
  display: flex;
  flex-wrap: wrap;
}
.audit__sideWrap {
  width: 100%;
  margin-bottom: 20px;
  @include rwd-lg {
    margin-bottom: 0;
    max-width: 460px;
  }
}
.audit__sideMenu {
  border: 1px solid $COLOR-GRAY1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
  .audit__act__icon {
    color: $BUTTON-DARK;
  }
}
.audit__sideAddControlWrap {
  // .btn__icon--add_project {
  // 	border: 0;
  // 	cursor: pointer;
  // 	display: block;
  // 	width: 27px;
  // 	height: 22px;
  // 	background-repeat: no-repeat;
  // 	background-size: contain;
  // 	background-image: url('~@images/icon/icon_add_project.svg');
  // 	background-color: #FFF;
  // }
  .audit__sideAddControl__title {
    white-space: nowrap;
    margin: 4px 0;
    line-height: 32px;
  }
  .audit__sideAddControl__input {
    margin-right: 10px;
    margin-left: 10px;
    flex: 1;
  }
  .audit__sideAddControl__btn {
    margin: 4px 0;
  }
}
.audit__sideMenu__item {
  font-size: 14px;
  padding: 10px;
  border: 1px solid $COLOR-LIGHT;
  cursor: pointer;
  word-break: break-word;
  ::v-deep .btn__delete {
    padding: 0 10px;
  }
  &.audit__sideMenu__item--selected {
    background: $COLOR-MAIN4;
    .audit__sideMenu__icon {
      visibility: visible;
    }
  }
}
.audit__sideMenu__icon {
  color: $COLOR-MAIN1;
  visibility: hidden;
}
.audit__textareaGroup {
  flex: 1;
  @include rwd-lg {
    margin-left: 20px;
  }
}
.audit__textarea__item {
  border: 1px solid $COLOR-MAIN5;
  .audit__textarea__header {
    border-bottom: 1px solid $COLOR-MAIN15;
    color: $COLOR-MAIN1;
    padding: 8px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    ::v-deep {
      .audit__act__icon {
        margin-left: auto;
        cursor: pointer;
        &.audit__act__action__icon {
          color: #dd8374;
        }
        svg {
          font-size: 25px;
        }
      }
    }
  }
  .audit__textarea {
    border: 0;
    padding: 18px 20px;
    font-size: 16px;
  }
  + .audit__textarea__item {
    margin-top: 20px;
  }
}

.audit__actGroup {
  ::v-deep {
    .ant-form-item-control {
      width: 4em;
    }
    .audit__actUnit {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 0;
    }
  }
}

// disabled 樣式
.audit__container {
  &.disabled {
    .audit__sideMenu {
      background: $BG-GRAY;
    }
    .audit__sideMenu__item {
      border: 1px solid $BG-GRAY;
      cursor: auto;
    }
    .ant-input {
      &:not(.audit__textarea) {
        border-radius: 4px;
      }
      &[disabled] {
        background: $COLOR-GRAY2;
      }
    }
    .audit__textarea__header {
      background: $BG-GRAY;
    }
  }
}
</style>
