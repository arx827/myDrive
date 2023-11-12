<template>
  <!-- 應注意事項 -->
  <div class="table-responsive">
    <table class="table custom__table">
      <tbody>
        <tr>
          <td class="w-100 p-0">
            <div class="importantCheck__wrap">
              <div class="importantCheck__title__group">
                <i class="importantCheck__title__required">＊</i>
                <span class="importantCheck__title">應注意事項</span>
              </div>
              <a-collapse
                v-model="activeImportantCheckKey"
                :destroy-inactive-panel="false"
              >
                <a-collapse-panel
                  v-for="item in tabsDataSync"
                  :key="item.groupId"
                  :header="item.groupName"
                >
                  <div
                    v-for="textareaItem in item.noticeChildrenDescs"
                    :key="textareaItem.quarterWorkDId"
                    class="textarea__wrap"
                  >
                    <div class="textarea__main">
                      <a-textarea
                        v-model="textareaItem.workDesc"
                        class="notice__textarea"
                        :rows="4"
                        :disabled="!isLeader"
                        @change="editTextareaItem(textareaItem)"
                      />
                    </div>
                    <div class="textarea__control d-flex flex-wrap">
                      <div class="d-flex flex-wrap mx-2 w-100">
                        <!-- 刪除 -->
                        <div
                          v-if="isLeader"
                          class="col-6"
                        >
                          <!-- textState == disabled 不可刪除 -->
                          <CustomPopConfirm
                            :disabled="!isLeader"
                            @confirm="onDeleteItemTextarea(item.groupId, textareaItem.quarterWorkDId)"
                          >
                            <i
                              class="textarea__control__btn btn__icon--small_delete"
                              :class="{'btn__icon--small_delete--disabled':!isLeader}"
                            />
                          </CustomPopConfirm>
                        </div>
                        <!-- 比對 -->
                        <!-- <div class="col-6">
                          <a-tooltip
                            placement="top"
                            :overlay-class-name="'whiteTooltip'"
                          >
                            <template slot="title">
                              <span>比對資料</span>
                            </template>
                            <button
                              class="textarea__control__btn btn__icon--comparison"
                              @click="onComparisonItemTextarea(item.key, textareaItem.textId)"
                            />
                          </a-tooltip>
                        </div> -->
                        <!-- 連結 -->
                        <div class="col-6">
                          <a-tooltip
                            placement="top"
                            :overlay-class-name="'whiteTooltip'"
                          >
                            <template slot="title">
                              <span>連結資料</span>
                            </template>
                            <button
                              class="textarea__control__btn btn__icon--small_link"
                              @click="onLinkItemTextarea(item.groupId, textareaItem.quarterWorkDId)"
                            />
                          </a-tooltip>
                        </div>
                        <!-- 回覆 -->
                        <!-- <div class="col-6">
                          <a-tooltip
                            placement="top"
                            :overlay-class-name="'whiteTooltip'"
                          >
                            <template slot="title">
                              <span>回覆提問</span>
                            </template>
                            <button
                              class="textarea__control__btn btn__icon--question"
                              @click="onQuestionItemTextarea(item.key, textareaItem.textId)"
                            />
                          </a-tooltip>
                        </div> -->
                      </div>
                    </div>
                  </div>
                  <!-- <div
                      v-if="item.noticeChildrenDescs.every(i => i.textState !== 'disabled')"
                      class="footer__button__wrap"
                    > -->
                  <div class="footer__button__wrap">
                    <button
                      v-if="isLeader"
                      class="textarea__controlBtn__add"
                      @click="onAddItemTextarea(item.groupId)"
                    >
                      <a-icon
                        class="textarea__controlBtn__icon"
                        type="plus"
                      /><span class="textarea__controlBtn__txt">新增</span>
                    </button>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </td>
          <!-- <td>
            <div class="sideMenu__wrap">
              <button
                class="sideMenu__item button__blue"
                @click="onComparisonAll"
              >
                比對資料
              </button>
            </div>
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { uuid } from 'vue-uuid';

import { namespace } from 'vuex-class';

const modalModule = namespace('modalControl');

@Component({
	components: {
		CustomPopConfirm,
	},
})
export default class Notice extends Vue {
  @modalModule.Action('setModalState') setModalState;

  @Prop()
  role: string;

  @PropSync('tabsData')
  tabsDataSync;

  // 只有領隊才可以編輯
  @Prop()
  isLeader: boolean;

  activeImportantCheckKey = ['A'];

  /**
   * Event
   */
  // 比對資料 (全部項目)
  onComparisonAll() {
  	this.$emit('click', {
  		type: 'comparisonAll',
  	});
  }

  // 刪除 (子項目控制項)
  onDeleteItemTextarea(groupId, itemId) {
  	// console.log('刪除 =>', groupId, itemId);
  	const thatGroup = this.tabsDataSync.find((i) => i.groupId === groupId);
  	const thatItem = thatGroup.noticeChildrenDescs.find((i) => i.quarterWorkDId === itemId);
  	// console.log(thatItem);
  	// console.log((/^workd\d+/).test(thatItem.quarterWorkDId));
  	// console.log(thatGroup.noticeChildrenDescs.indexOf(thatItem));
  	if (!(/workNew/).test(thatItem.quarterWorkDId)) {
  	  // 判斷 為系統帶出的資料
  		this.$emit('click', {
  			type: 'deleteNoticeItem',
  			params: {
  				quarterWorkDId: thatItem.quarterWorkDId,
  			},
  		});
  	} else {
  	  // 不是系統帶出的，自己手動暫存的資料，直接刪除
  	  thatGroup.noticeChildrenDescs.splice(thatGroup.noticeChildrenDescs.indexOf(thatItem), 1);

  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'success',
  				title: '刪除成功',
  				autoClose: 3,
  			},
  		});
  	}
  	// if(thatItem.operate === 'delete')
  }

  // 比對資料 (子項目控制項)
  onComparisonItemTextarea(yapPointAuditItemMapId, yapPointAuditItemId) {
  	console.log('比對', yapPointAuditItemMapId, yapPointAuditItemId);
  }

  // 連結資料 (子項目控制項)
  onLinkItemTextarea(groupId, quarterWorkDId) {
  	// console.log('連結資料', groupId, quarterWorkDId);
  	this.$emit('click', {
  		type: 'linkItem',
  		params: {
  			groupId,
  			quarterWorkDId,
  		},
  	});
  }

  // 回覆提問 (子項目控制項)
  onQuestionItemTextarea(yapPointAuditItemMapId, yapPointAuditItemId) {
  	console.log('回覆提問', yapPointAuditItemMapId, yapPointAuditItemId);
  }

  // 新增
  onAddItemTextarea(itemCode) {
  	// console.log('新增', itemCode);
  	const $item = this.tabsDataSync.find((i) => i.groupId === itemCode);
  	$item.noticeChildrenDescs.push({
  		delete: false,
  		operate: 'add',
  		quarterWorkDId: `workNew${uuid.v4()}`,
  		sysCodeGroupId: $item.groupId,
  		workClass: $item.workClasses[1],
  		workDesc: '',
  	});
  }

  editTextareaItem(textareaItem) {
  	if (!(/workNew/).test(textareaItem.quarterWorkDId)) {
  		if (textareaItem.operate !== 'modify') {
  			textareaItem.operate = 'modify';
  		}
  	}
  }

	/**
	 * Hook
	 */
	// created() {
	// 	console.log('notice =>', this.tabsDataSync);
	// }

	/**
	 * 監聽
	 */
	// @Watch('activeImportantCheckKey')
	// watchActiveImportantCheckKey(nV) {
	// 	console.log(nV);
	// }
}
</script>

<style lang="scss" scoped>
.custom__table {
  tbody {
    border: 1px solid $COLOR-MAIN15;
    tr {
      &:first-of-type {
        td {
          &:last-of-type {
            border-left: 1px solid $COLOR-MAIN15;
          }
        }
      }
    }
  }
}

.sideMenu__wrap {
  display: flex;
  flex-direction: column;
  .button__blue {
    @include button_base($LIST-BG-DARK, #CCE3E8, $FONT-PRIMARY, $FONT-PRIMARY, $BUTTON-DARK, $BUTTON-DARK, 4px, 16px);
  }
  // .button__delete {
  //   @include button_base(#F5DCD7, #F2D2CB, #EA8270, #EA8270, #EA8270, #EA8270, 4px, 16px);
  // }
  // .button__import {
  //   @include button_base($COLOR-MAIN10, #F8EBBF, #F48649, #F48649, #FFC94F, #FFC94F, 4px, 16px);
  // }
  .sideMenu__item {
    width: 103px;
    padding: 10px 0;
    + .sideMenu__item {
      margin-top: 20px;
    }
  }
}

// 應注意事項
::v-deep {
  .ant-collapse-content {
    > .ant-collapse-content-box {
      padding: 7px 0;
    }
  }
}

.importantCheck__wrap {
  border-top: 1px solid $COLOR-MAIN15;
  padding: 10px 13px 13px;
  position: relative;
}
.importantCheck__title__group {
  display: inline-flex;
  align-items: center;
  margin-bottom: 10px;
  .importantCheck__title__required {
    color: $COLOR-MAIN17;
    font-size: 18px;
  }
  .importantCheck__title {
    font-size: 18px;
    font-weight: 600;
    margin-left: 8px;
    margin-right: 13px;
  }
}
.textarea__wrap {
  display: flex;
  align-items: flex-start;
  .textarea__main {
    flex: 1;
    margin-left: 40px;
  }
}

// 重點查核項目 按鈕群
.textarea__control {
  width: 100px;
  justify-content: flex-start;
  margin: 10px 5px;
  // 退回意見 按鈕 特立獨行
  .withdrawComments__wrap {
    margin: 5px 0;
    .withdrawComments__btn {
      width: 100%;
      padding: 5px 8px;
      font-size: 14px;
      color: $COLOR-MAIN16;
      background: $COLOR-MAIN18;
      border: 1px solid $COLOR-MAIN16;
      border-radius: 3px;
      cursor: pointer;
    }
  }
}
.textarea__control__btn {
  border: 0;
  padding: 0;
  width: 27px;
  height: 27px;
  display: block;
  margin: 3px auto;
  background-color: transparent;
}
.info__message {
  font-size: 14px;
  color: $COLOR-MAIN16;
  margin: 5px;
}

// 應注意事項 子項目 footer
.footer__button__wrap {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.textarea__controlBtn__add {
  color: $COLOR-MAIN15;
  font-size: 14px;
  padding: 0 50px;
  border: 1px solid $COLOR-MAIN15;
  background: $COLOR-LIGHT;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    color: $COLOR-MAIN1;
    border-color: $COLOR-MAIN1;
    background: $COLOR-MAIN4;
  }
  .textarea__controlBtn__icon {
    margin-right: 10px;
  }
}
.textarea__wrap {
  & + & {
    margin-top: 20px;
  }
}
</style>
