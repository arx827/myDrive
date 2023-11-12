<template>
  <div
    class="table-responsive"
  >
    <a-form-model
      ref="formRef"
      :model="yapFrontEndArrSync"
      :hide-required-mark="true"
      :rules="formRules"
    >
      <table
        class="table custom__table"
        :class="{'custom__table--copy': yapFrontEndArrSync.yapId.includes('copy')}"
      >
        <thead>
          <tr>
            <th scope="col">
              月份
            </th>
            <th scope="col">
              查核性質
            </th>
            <th scope="col">
              查核項目
            </th>
            <th scope="col">
              計畫受檢單位
            </th>
            <th scope="col">
              主辦組
            </th>
            <th scope="col">
              協辦組
            </th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          <tr class="table__controlBar">
            <td>
              <a-form-model-item
                ref="startMonth"
                prop="startMonth"
              >
                <a-select
                  v-model="yapFrontEndArrSync.startMonth"
                  class="search__result__month search__result__month--left"
                  show-search
                  placeholder="起"
                  :options="$enum.monthOption"
                  :filter-option="$global.filterOption"
                  :dropdown-match-select-width="false"
                  :disabled="!isEditYapItem"
                  @change="startMonthChange"
                />
                <a-input
                  class="search__result__range"
                  placeholder="~"
                  disabled
                />
                <a-select
                  v-model="yapFrontEndArrSync.endMonth"
                  :filter-option="$global.filterOption"
                  show-search
                  placeholder="迄"
                  :options="$enum.monthOption"
                  class="search__result__month search__result__month--right"
                  :dropdown-match-select-width="false"
                  :disabled="!isEditYapItem"
                  @change="() => {$refs.startMonth.onFieldChange()}"
                />
              </a-form-model-item>
            </td>
            <td>
              <a-form-model-item
                prop="auditType"
              >
                <a-select
                  v-model="yapFrontEndArrSync.auditType"
                  class="search__result__select"
                  show-search
                  :filter-option="$global.filterOption"
                  :options="typeOption"
                  :dropdown-match-select-width="false"
                  :disabled="!isEditYapItem"
                />
              </a-form-model-item>
            </td>
            <td>
              <a-form-model-item
                prop="auditItem"
              >
                <a-select
                  v-model="yapFrontEndArrSync.auditItem"
                  class="search__result__select"
                  show-search
                  :filter-option="$global.filterOption"
                  :options="itemOption"
                  :dropdown-match-select-width="false"
                  :disabled="!isEditYapItem"
                />
              </a-form-model-item>
            </td>
            <td>
              <a-form-model-item
                prop="units"
                class="item__children--flex"
              >
                <a-tree-select
                  v-model="yapFrontEndArrSync.units"
                  class="treeselect"
                  :tree-data="unitOption"
                  tree-checkable
                  :tree-default-expand-all="true"
                  tree-node-filter-prop="title"
                  dropdown-class-name="treeselect"
                  :dropdown-style="{'maxHeight': '300px'}"
                  :disabled="!isEditYapItem"
                />
              </a-form-model-item>
              <div class="d-flex flex-wrap-reverse align-items-end mt-3">
                <div class="change__info__wrap">
                  <p
                    v-for="item in inValidUnitList"
                    :key="item.value"
                    class="change__info"
                  >
                    {{ `${item.label}(組織異動)` }}
                  </p>
                </div>
                <button
                  class="button__showAllUnit"
                  @click="onInspectedUnit(yapFrontEndArrSync.units)"
                >
                  顯示全部
                </button>
              </div>
            </td>
            <td>
              <a-form-model-item
                prop="mainAuditorTeam"
              >
                <a-select
                  v-model="yapFrontEndArrSync.mainAuditorTeam"
                  class="search__result__select"
                  show-search
                  :filter-option="$global.filterOption"
                  :options="teamOption"
                  :dropdown-match-select-width="false"
                  :disabled="!isEditYapItem"
                />
              </a-form-model-item>
            </td>
            <td>
              <a-form-model-item
                prop="coAuditorTeam"
                class="item__children--flex"
              >
                <a-select
                  v-model="yapFrontEndArrSync.coAuditorTeam"
                  mode="multiple"
                  class="search__result__select"
                  :filter-option="$global.filterOption"
                  :options="teamOption"
                  :dropdown-match-select-width="false"
                  :disabled="!isEditYapItem"
                />
              </a-form-model-item>
            </td>
            <td rowspan="2">
              <div class="sideMenu__wrap">
                <button
                  v-if="checkSideButton('edit')"
                  class="sideMenu__item button__copy"
                  @click="onHandleCopy"
                >
                  複製
                </button>
                <CustomPopConfirm
                  v-if="checkSideButton('edit')"
                  @confirm="onHandleDelete"
                >
                  <button class="sideMenu__item button__delete">
                    刪除
                  </button>
                </CustomPopConfirm>
                <button
                  v-if="checkSideButton('import')"
                  class="sideMenu__item button__import"
                  @click="onHandleImport"
                >
                  匯入舊資料
                </button>
                <button
                  v-if="checkSideButton('review')"
                  class="sideMenu__item button__copy"
                  :class="{'button__copy--unclickabled': yapFrontEndArrSync.isReviewDone !== 'toReview'}"
                  @click="onHandleReview"
                >
                  {{ yapFrontEndArrSync.isReviewDone === 'toReview'? '審畢': '已審畢' }}
                </button>
                <button
                  v-if="checkSideButton('review')"
                  class="sideMenu__item button__copy mt-auto"
                  :class="{'button__copy--unclickabled': yapFrontEndArrSync.isReviewDone !== 'toReview'}"
                  @click="onHandleReview"
                >
                  {{ yapFrontEndArrSync.isReviewDone === 'toReview'? '審畢': '已審畢' }}
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td
              colspan="6"
              class="p-0"
            >
              <div
                class="project__wrap"
              >
                <div class="project__header">
                  專案查核範圍
                </div>
                <div class="textarea__wrap">
                  <div class="textarea__main">
                    <a-form-model-item
                      prop="yapProjectScopeContent"
                    >
                      <a-textarea
                        v-model="yapFrontEndArrSync.yapProjectScopeContent"
                        class="audit__textarea"
                        :rows="4"
                        :disabled="!isEditProject"
                      />
                    </a-form-model-item>
                  </div>
                  <div class="textarea__control d-flex flex-wrap">
                    <div class="d-flex flex-wrap mx-2 w-100">
                      <div class="col-6">
                        <a-tooltip
                          placement="top"
                          :overlay-class-name="'whiteTooltip'"
                        >
                          <template slot="title">
                            <span>比對資料</span>
                          </template>
                          <button
                            class="textarea__control__btn btn__icon--comparison"
                            @click="onComparisonProjectTextarea"
                          />
                        </a-tooltip>
                      </div>
                      <div
                        v-if="isSupervisor || currentRoleId === 'ROLE_Audit_Team_Head'"
                        class="col-6"
                      >
                        <a-tooltip
                          placement="top"
                          :overlay-class-name="'whiteTooltip'"
                        >
                          <template slot="title">
                            <span v-if="haveToReplyQuestion(yapFrontEndArrSync.yapProjectScopeQaStatus)">待回覆</span>
                            <span v-else>回覆提問</span>
                          </template>
                          <button
                            class="textarea__control__btn"
                            :class="haveToReplyQuestion(yapFrontEndArrSync.yapProjectScopeQaStatus) ? 'btn__icon--question_red': 'btn__icon--question' "
                            @click="onQuestionItemProjectTextarea({
                              QAStatus: yapFrontEndArrSync.yapProjectScopeQaStatus,
                              yapStatus: yapFrontEndArrSync.yapStatus,
                              reviewLevel: yapFrontEndArrSync.reviewLevel,
                              rejectFlag: yapFrontEndArrSync.rejectFlag
                            })"
                          />
                        </a-tooltip>
                      </div>
                      <div
                        v-if="isCheckEditItem"
                        class="col-6"
                      >
                        <a-tooltip
                          placement="top"
                          :overlay-class-name="'whiteTooltip'"
                        >
                          <template slot="title">
                            <span v-if="yapFrontEndArrSync.redFlagOfYapProjectScopeCheckStatus">待確認</span>
                            <span v-else>確認修改</span>
                          </template>
                          <button
                            class="textarea__control__btn"
                            :class="yapFrontEndArrSync.redFlagOfYapProjectScopeCheckStatus ? 'btn__icon--confirm' : 'btn__icon--enter1'"
                            @click="onConfirmItemProjectTextarea"
                          />
                        </a-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="importantCheck__wrap">
                <div class="importantCheck__title__group">
                  <i class="importantCheck__title__required">＊</i>
                  <span class="importantCheck__title">重點查核項目</span>
                  <a-popover
                    placement="bottomLeft"
                    trigger="hover"
                    :overlay-class-name="'whitePopover'"
                  >
                    <template slot="title">
                      <span class="custom__popConfirm__title">註：重點查核項目包括：</span>
                    </template>
                    <template slot="content">
                      <ul class="numListStyle">
                        <li>{{ `主管機關公佈之${parseInt(currentYear)-1}年度檢查重點、近一年主要檢失。 ` }}</li>
                        <li>同業近一年常見裁罰案。</li>
                        <li>公司重要風險或內控事件。</li>
                        <li>母公司近一年辦理查核提列中風險以上之稽核議題。</li>
                        <li>
                          加強辦理查核事項：
                          <ul>
                            <li>-主管機關要求加強辦理查核事項</li>
                            <li>-經本室評估應加強查核事項</li>
                            <li>-主管機關裁罰案</li>
                          </ul>
                        </li>
                        <li>其他，如主管機關函示個別提案之重大缺失、其他函示等。</li>
                      </ul>
                    </template>
                    <button class="importantCheck__icon" />
                  </a-popover>
                  <div
                    v-if="isNeedPointAuditItem"
                    class="has-error ps-3"
                  >
                    請至少輸入一個重點查核項目
                  </div>
                </div>
                <AccordionArea>
                  <a-collapse
                    v-model="activeImportantCheckKey"
                  >
                    <a-collapse-panel
                      v-for="(item,index) in yapFrontEndArrSync.yapPointAuditItemMap"
                      :key="item.key"
                      :header="item.headerTitle"
                    >
                      <div
                        v-for="(yapPointAuditItem,yapPointAuditItemIndex) in item.yapPointAuditItems"
                        :key="yapPointAuditItem.yapPointAuditItemId"
                        class="textarea__wrap"
                      >
                        <div class="textarea__main mb-2">
                          <a-form-model-item
                            :rules="{ trigger:'blur',validator: yapPointAuditItemValidator}"
                            :prop="'yapPointAuditItemMap.'+index+'.yapPointAuditItems.'+yapPointAuditItemIndex+'.itemContent'"
                          >
                            <a-textarea
                              v-model="yapPointAuditItem.itemContent"
                              class="audit__textarea"
                              :rows="4"
                              :disabled="!checkEditYapPointAuditItem(yapPointAuditItem)"
                            />
                          </a-form-model-item>
                          <p
                            v-if="!yapPointAuditItem.hasEditableFlag && currentRoleId === 'ROLE_Auditor'"
                            class="info__message"
                          >
                            欲{{ yapPointAuditItem.hasDeletingFlag? '刪除': '變更' }}此項目，待組長覆核完成，此筆資料才會{{ yapPointAuditItem.hasDeletingFlag? '刪除': '變更' }}。
                          </p>
                          <p
                            v-if="yapPointAuditItem.hasReviewFlag && currentRoleId === 'ROLE_Audit_Team_Head'"
                            class="info__message"
                          >
                            查核人員欲{{ yapPointAuditItem.hasDeletingFlag? '刪除': '變更' }}此項目，請組長覆核。
                          </p>
                        </div>
                        <div class="textarea__control d-flex flex-wrap">
                          <div class="d-flex flex-wrap mx-2 w-100">
                            <div
                              v-if="checkDeleteYapPointAuditItem(yapPointAuditItem)"
                              class="col-6"
                            >
                              <CustomPopConfirm
                                :disabled="!checkDeleteYapPointAuditItem(yapPointAuditItem)"
                                @confirm="onDeleteYapPointAuditItem(item.key, yapPointAuditItem.yapPointAuditItemId)"
                              >
                                <button
                                  class="textarea__control__btn btn__icon--small_delete"
                                />
                              </CustomPopConfirm>
                            </div>
                            <div class="col-6">
                              <a-tooltip
                                placement="top"
                                :overlay-class-name="'whiteTooltip'"
                              >
                                <template slot="title">
                                  <span>比對資料</span>
                                </template>
                                <button
                                  class="textarea__control__btn btn__icon--comparison"
                                  @click="onComparisonItemTextarea({
                                    isEdit: checkEditYapPointAuditItem(yapPointAuditItem),
                                    item: item.yapPointAuditItems,
                                    yapPointAuditItemMapId: item.key,
                                    yapPointAuditItemId: yapPointAuditItem.yapPointAuditItemId
                                  })"
                                />
                              </a-tooltip>
                            </div>
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
                                  @click="onLinkItemTextarea({
                                    itemPointKey: item.key,
                                    yapPointAuditItemId: yapPointAuditItem.yapPointAuditItemId,
                                    copyYapPointAuditItemId: yapPointAuditItem.copyYapPointAuditItemId
                                  })"
                                />
                              </a-tooltip>
                            </div>
                            <div
                              v-if="isSupervisor || currentRoleId === 'ROLE_Audit_Team_Head'"
                              class="col-6"
                            >
                              <a-tooltip
                                placement="top"
                                :overlay-class-name="'whiteTooltip'"
                              >
                                <template slot="title">
                                  <span v-if="haveToReplyQuestion(yapPointAuditItem.itemQAStatus)">待回覆</span>
                                  <span v-else>回覆提問</span>
                                </template>
                                <button
                                  class="textarea__control__btn"
                                  :class="haveToReplyQuestion(yapPointAuditItem.itemQAStatus) ? 'btn__icon--question_red': 'btn__icon--question'"
                                  @click="onQuestionItemTextarea({
                                    yapPointAuditItemId: yapPointAuditItem.yapPointAuditItemId,
                                    yapPointAuditItemMapId: item.key,
                                    QAStatus: yapPointAuditItem.itemQAStatus,
                                    yapStatus: yapFrontEndArrSync.yapStatus,
                                    reviewLevel: yapFrontEndArrSync.reviewLevel,
                                    rejectFlag: yapFrontEndArrSync.rejectFlag
                                  })"
                                />
                              </a-tooltip>
                            </div>
                            <div
                              v-if="isCheckEditItem"
                              class="col-6"
                            >
                              <a-tooltip
                                placement="top"
                                :overlay-class-name="'whiteTooltip'"
                              >
                                <template slot="title">
                                  <span v-if="yapPointAuditItem.redFlagOfItemCheckStatus">待確認</span>
                                  <span v-else>確認修改</span>
                                </template>
                                <button
                                  class="textarea__control__btn"
                                  :class="yapPointAuditItem.redFlagOfItemCheckStatus ? 'btn__icon--confirm' : 'btn__icon--enter1'"
                                  @click="onConfirmItemTextarea(item.key, yapPointAuditItem)"
                                />
                              </a-tooltip>
                            </div>
                            <div
                              v-if="currentRoleId === 'ROLE_Audit_Team_Head' && yapPointAuditItem.hasReviewFlag"
                              class="w-100"
                            >
                              <div class="col-12">
                                <button
                                  class="textarea__control__text__btn"
                                  @click="onCheckItem(item.key,yapPointAuditItem.yapPointAuditItemId)"
                                >
                                  通過
                                </button>
                              </div>
                              <div class="col-12">
                                <button
                                  class="textarea__control__text__btn"
                                  @click="onWithdrawItem(item.key,yapPointAuditItem.yapPointAuditItemId)"
                                >
                                  退回
                                </button>
                              </div>
                            </div>
                          </div>
                          <!-- 組長退回意見 -->
                          <div
                            v-if="yapPointAuditItem.hasRejectCommentFlag"
                            class="col-12 withdrawComments__wrap"
                          >
                            <button
                              class="withdrawComments__btn"
                              @click="onLeaderOpinion(yapPointAuditItem.yapPointAuditItemId)"
                            >
                              退回意見
                            </button>
                          </div>
                        </div>
                      </div>
                      <!-- 組長在yapStatus = C 不得新增查核項目 -->
                      <div
                        v-if="isAddYapPointAuditItem"
                        class="footer__button__wrap"
                      >
                        <button
                          class="textarea__controlBtn__add"
                          @click="onAddYapPointAuditItem(item.key,item.headerTitle)"
                        >
                          <a-icon
                            class="textarea__controlBtn__icon"
                            type="plus"
                          /><span class="textarea__controlBtn__txt">新增</span>
                        </button>
                      </div>
                    </a-collapse-panel>
                  </a-collapse>
                </AccordionArea>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </a-form-model>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import AccordionArea from '@shared/AccordionArea.vue';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { RoleDto, SelectOptionDto, YapUnitVO } from '@fubonlife/iams-api-axios-sdk';
import { YapFrontEndDto, YapPointAuditItemFrontEndDto } from '@/pages/auditPlan/models';
import { namespace } from 'vuex-class';

const modalModule = namespace('modalControl');

@Component({
	components: {
		AccordionArea,
		CustomPopConfirm,
	},
})
export default class YapComp extends Vue {
  @modalModule.Action('setModalState') setModalState;

  @Prop()
	yapId: string;

  @PropSync('yapFrontEndArr')
	yapFrontEndArrSync: YapFrontEndDto;

  @Prop()
  role: RoleDto;

  @Prop() // 查核項目 選單
  itemOption: SelectOptionDto[];

  @Prop() // 查核性質 選單
  typeOption: SelectOptionDto[];

  @Prop() // 組別 選單
  teamOption: SelectOptionDto[];

  @Prop() // 計畫受檢單位 選單 (包含有效、分有效選單)
  unitList: YapUnitVO;

  @Prop() // 重點查核項目所有選單(收合元件標題)
  yapPointAuditItemList;

  @Prop()
  isConfirmUser: boolean;

  @Prop() // 目前畫面上所有年度查核項目的總狀態(中文名稱）
  yapStatus: string;

  @Prop() // 當前查詢的年度
  currentYear: string;

  @Prop() // 預設各階主管是不是能夠審閱(true僅代表預設可以)
  reviewFlag: boolean

  // 監控公司所有單位資料，並組合成元件需要的格式:tree select
  @Watch('unitList', { immediate: true })
  onUnitListChanged(val: YapUnitVO) {
  	if (val) {
  		this.unitOption = [
  			{
  				title: '全部',
  				value: 'all',
  				key: 'all',
  				children: val.validYapUnits.map((e) => ({
  					title: e.value + e.label,
  					value: e.value,
  					key: e.value,
  				})),
  			},
  			{
  				title: '無效單位',
  				value: 'invalid',
  				key: 'invalid',
  				children: val.inValidYapUnits.map((e) => ({
  					title: e.value + e.label,
  					value: e.value,
  					key: e.value,
  				})),
  			},
  		];
  	}
  }

  @Watch('yapPointAuditItemList', { immediate: true })
  onYapPointAuditItemListChanged(val) {
  	this.activeImportantCheckKey = val && val.map((e) => e.key);
  }

  @Watch('yapFrontEndArrSync', { deep: true })
  onYapFrontEndArrSyncChanged(val: YapFrontEndDto) {
  	console.log('onYapFrontEndArrSyncChanged', val.isReviewDone);
  	if (val.isReviewDone === 'done') { this.$forceUpdate(); }
  }

  // 重點查核項目-目前展開的項目(for元件使用)
  activeImportantCheckKey = [];

  // 受查單位下拉選單
  unitOption = [];

  // 當前角色id
  currentRoleId: string = this.$global.getCurrentRoleId();

  currentRole: RoleDto = this.$global.getCurrentRole();

  // 主管清單(部主管、總稽核、副總稽核)
  supervisorList: string[] = [
  	'ROLE_Audit_Department_Head',
  	'ROLE_Audit_Office_Boss_Vice',
  	'ROLE_Audit_Office_Boss',
  ]

  isNeedPointAuditItem: boolean = false;

  // 是否是主管(部主管、總稽核、副總稽核)
  isSupervisor: boolean = this.supervisorList.find((e) => e === this.currentRoleId) !== undefined;

  // 是否為 暫存 或是 送出覆核
  isSave: boolean = false;

  formRules: { [key: string]: ValidationRule[] } = {
  	startMonth: [{ trigger: 'change', validator: this.monthVaildtor }],
  	auditType: [{ trigger: 'change', validator: this.auditTypeValidator }],
  	units: [{ trigger: 'change', validator: this.unitsValidator }],
  	coAuditorTeam: [{ trigger: 'change', validator: this.coAuditorTeamValidator }],
  	mainAuditorTeam: [{ trigger: 'change', validator: this.mainAuditorTeamValidator }],
  	yapProjectScopeContent: [{ trigger: 'change', validator: this.yapProjectScopeContentValidator }],
  }

  /**
   * get
   */
  // 無效單位清單
  get inValidUnitList() {
  	if (this.unitList) {
  		return this.unitList.inValidYapUnits.filter((e) => this.yapFrontEndArrSync.units.find((i) => i === e.value) !== undefined);
  	}
  	return null;
  }

  // 是否可以編輯年度查核項目：月份、查核性質...畫面上第一列項目
  get isEditYapItem(): boolean {
  	if ((this.yapFrontEndArrSync.yapStatus === 'A' || this.yapFrontEndArrSync.yapStatus === 'B' || (this.yapFrontEndArrSync.yapStatus === 'C' && this.yapFrontEndArrSync.rejectFlag))
        && this.currentRoleId === 'ROLE_Audit_Team_Head' // 主辦組組長才可以編輯
        && this.role.roleUnits[0].auditorTeamCode === this.yapFrontEndArrSync.originalMainAuditorTeam) return true;

  	return false;
  }

  // 是否顯示 專案查核範圍 與 重點查核項目 待確認(紅底)、確認修改(白底)按鈕
  get isCheckEditItem(): boolean {
  	// 主管在自己的覆核且未審畢狀態時才可以編輯
  	if (this.isSupervisor) return this.isOnReviewLevel() && this.yapFrontEndArrSync.isReviewDone !== 'done';
  	// 為組長
  	if (this.currentRoleId === 'ROLE_Audit_Team_Head') {
  		if (this.yapStatus === 'C' && (this.yapFrontEndArrSync.yapStatus === 'C' && !this.yapFrontEndArrSync.rejectFlag)) {
  			return true;
  		}
  	}
  	return false;
  }

  // 身份 是否為主辦組
  get isOriginalMainAuditorTeam(): boolean {
  	const roleTeam = this.currentRole.roleUnits[0]?.auditorTeamCode;
  	return roleTeam === this.yapFrontEndArrSync.originalMainAuditorTeam;
  }

  // 是否可以編輯 專案查核範圍
  get isEditProject(): boolean {
  	switch (this.currentRoleId) {
  	case 'ROLE_Audit_Team_Head':
  		// 在總狀態為 B 時，yap狀態為 C 不得編輯
  		if (this.yapStatus === 'B' && this.yapFrontEndArrSync.yapStatus === 'C') return false;
  		if ((this.yapFrontEndArrSync.yapStatus === 'A'
        || this.yapFrontEndArrSync.yapStatus === 'B'
        || this.yapFrontEndArrSync.yapStatus === 'C')
        && (this.role.roleUnits[0].auditorTeamCode === this.yapFrontEndArrSync.originalMainAuditorTeam)
  		) {
  			return true;
  		}
  		return false;
  	case 'ROLE_Audit_Department_Head':
  		if (this.yapFrontEndArrSync.reviewLevel === '1' && this.yapFrontEndArrSync.yapStatus === 'C' && !this.yapFrontEndArrSync.rejectFlag && this.yapFrontEndArrSync.isReviewDone !== 'done') {
  			return true;
  		}
  		return false;
  	case 'ROLE_Audit_Office_Boss_Vice':
  		if (this.yapFrontEndArrSync.reviewLevel === '2' && this.yapFrontEndArrSync.yapStatus === 'C' && !this.yapFrontEndArrSync.rejectFlag && this.yapFrontEndArrSync.isReviewDone !== 'done') {
  			return true;
  		}
  		return false;
  	case 'ROLE_Audit_Office_Boss':
  		if (this.yapFrontEndArrSync.reviewLevel === '3' && this.yapFrontEndArrSync.yapStatus === 'C' && !this.yapFrontEndArrSync.rejectFlag && this.yapFrontEndArrSync.isReviewDone !== 'done') {
  			return true;
  		}
  		return false;
  	}
  	return false;
  }

  // 是否可以新增 重點查核項目
  get isAddYapPointAuditItem(): boolean {
  	const roleTeam = this.role.roleUnits[0]?.auditorTeamCode;
  	// console.log('是否可以新增 重點查核項目');
  	if (this.currentRoleId === 'ROLE_Auditor' && !this.isConfirmUser) return false;
  	if (roleTeam !== this.yapFrontEndArrSync.originalMainAuditorTeam && (this.yapFrontEndArrSync.coAuditorTeam.find((e) => e === roleTeam) === undefined)) return false;
  	if (!this.isSupervisor
        && (this.yapFrontEndArrSync.yapStatus === 'A'
            || this.yapFrontEndArrSync.yapStatus === 'B'
            || (this.yapFrontEndArrSync.yapStatus === 'C' && this.yapFrontEndArrSync.rejectFlag))
  	) return true;

  	return false;
  }

  /**
   * Custome validator
   */
  coAuditorTeamValidator(rule, value, callback) {
  	// console.log('檢核協辦組');
  	if (this.isSave) return callback();
  	if (this.isOriginalMainAuditorTeam && this.currentRoleId === 'ROLE_Audit_Team_Head') {
  		// if (!value || value.length === 0) return callback('請至少選擇一組協辦組');
  		const result = value.find((e) => e === this.yapFrontEndArrSync.mainAuditorTeam);
  		result !== undefined ? callback('協辦組不可包含主辦組') : callback();
  	} else { callback(); }
  }

  mainAuditorTeamValidator(rule, value, callback) {
  	// console.log('檢核主辦組');
  	if (this.isSave) return callback();
  	(this.$refs.formRef as any).validateField('coAuditorTeam');
  	callback();
  }

  auditTypeValidator(rule, value, callback) {
  	// console.log('檢核查核性質');
  	if (this.isSave) return callback();
  	(this.$refs.formRef as any).validateField('yapProjectScopeContent');
  	callback();
  }

  unitsValidator(rule, value, callback) {
  	// console.log('檢核受查單位');
  	if (this.isSave) return callback();
  	if (this.isOriginalMainAuditorTeam && this.currentRoleId === 'ROLE_Audit_Team_Head') {
  		if (this.yapFrontEndArrSync.yapStatus === 'D' || this.yapFrontEndArrSync.yapStatus === 'E') return callback();
  		if (value === '' || value === undefined || value === null || value.length === 0) return callback('請選擇計畫受檢單位');
  		callback();
  	} else { callback(); }
  }

  monthVaildtor(rule, value, callback) {
  	// console.log('檢核月份');
  	if (this.isSave) return callback();
  	if (this.isOriginalMainAuditorTeam && this.currentRoleId === 'ROLE_Audit_Team_Head') {
  		if (!this.yapFrontEndArrSync.startMonth
      || !this.yapFrontEndArrSync.endMonth
      || this.yapFrontEndArrSync.startMonth === undefined
      || this.yapFrontEndArrSync.endMonth === undefined) return callback('請填入月份');
  		if (parseInt(this.yapFrontEndArrSync.startMonth, 10) > parseInt(this.yapFrontEndArrSync.endMonth, 10)) return callback('結束月份不得小於開始月份');
  		if (this.yapFrontEndArrSync.startMonth == '0' || this.yapFrontEndArrSync.endMonth == '0') return callback('請選擇1~12月');
  		callback();
  	} else { callback(); }
  }

  yapProjectScopeContentValidator(rule, value, callback) {
  	// console.log('檢核專案查核範圍');
  	if (this.isSave) return callback();
  	if (this.isOriginalMainAuditorTeam && this.currentRoleId === 'ROLE_Audit_Team_Head') {
  		if (this.yapFrontEndArrSync.auditType === 'project') {
  			if (this.yapFrontEndArrSync.yapProjectScopeContent) {
  				callback();
  			} else {
  				callback('請輸入專案查核範圍');
  			}
  		} else {
  			callback();
  		}
  	} else { callback(); }
  }

  yapPointAuditItemValidator(rule, value, callback) {
  	// this.hasYapPointAuditItemValidator();
  	if (!value || value.length <= 0) callback('請填寫重點查核項目');
  	callback();
  }

  hasYapPointAuditItemValidator() {
  	if (this.currentRoleId === 'ROLE_Audit_Team_Head' && !this.isSave) {
  		const yapPointAuditItemCount = this.yapFrontEndArrSync.yapPointAuditItemMap.reduce((accumulator,
  			currentValue) => accumulator + currentValue.yapPointAuditItems.length, 0);
  		console.log('yapPointAuditItemCount', yapPointAuditItemCount);
  		if (yapPointAuditItemCount === 0) {
  			this.isNeedPointAuditItem = true;
  		} else {
  			this.isNeedPointAuditItem = false;
  		}
  	} else {
  			this.isNeedPointAuditItem = false;
  	}
  }

  // 表單驗證
  validate(isSave?: boolean) {
  	this.isSave = isSave;
  	// this.hasYapPointAuditItemValidator();
  	return (this.$refs.formRef as any).validate()
  		.then(() => true)
  		.catch(() =>	false);
  }

  /**
   * Event
   */

  // 起始用份改變
  startMonthChange() {
  	this.yapFrontEndArrSync.endMonth = this.yapFrontEndArrSync.startMonth;
  }

  // 是不是在各主管的審閱 level
  isOnReviewLevel(): boolean {
  	if (!this.reviewFlag) return false;
  	if (this.currentRoleId === 'ROLE_Audit_Department_Head' && this.yapFrontEndArrSync.reviewLevel === '1') return true;
  	if (this.currentRoleId === 'ROLE_Audit_Office_Boss_Vice' && this.yapFrontEndArrSync.reviewLevel === '2') return true;
  	if (this.currentRoleId === 'ROLE_Audit_Office_Boss' && this.yapFrontEndArrSync.reviewLevel === '3') return true;
  	return false;
  }

  // 是否需要回覆問題
  haveToReplyQuestion(QAStatus) {
  	if (this.isSupervisor && this.isOnReviewLevel && QAStatus === 'A') return true;
  	if (this.currentRoleId === 'ROLE_Audit_Team_Head' && QAStatus === 'Q') return true;
  	return false;
  }

  // 計畫受檢單位 顯示全部
  onInspectedUnit(selectedUnits) {
  	let validUnits = null;
  	let inValidUnits = null;
  	if (this.unitList) {
  		validUnits = this.unitList.validYapUnits.filter((e) => this.yapFrontEndArrSync.units.find((i) => i === e.value) !== undefined);
  		inValidUnits = this.unitList.inValidYapUnits.filter((e) => this.yapFrontEndArrSync.units.find((i) => i === e.value) !== undefined);
  	}

  	this.$emit('slideclick', { type: 'inspectedUnit', payload: { validUnits, inValidUnits } });
  }

  // 右側按鈕是否顯示判斷
  checkSideButton(type): boolean {
  	const roleTeam = this.role.roleUnits[0]?.auditorTeamCode;
  	switch (type) {
  	case 'edit': // 刪除、複製按鈕
  		if ((this.yapFrontEndArrSync.yapStatus === 'A'
          || this.yapFrontEndArrSync.yapStatus === 'B'
          || (this.yapFrontEndArrSync.yapStatus === 'C' && this.yapFrontEndArrSync.rejectFlag))
          && (this.role.id === 'ROLE_Audit_Team_Head' && roleTeam === this.yapFrontEndArrSync.originalMainAuditorTeam)) {
  			return true;
  		}
  		return false;
  	case 'import': // 匯入舊資料按鈕
  		if ((this.yapFrontEndArrSync.yapStatus === 'A'
          || this.yapFrontEndArrSync.yapStatus === 'B'
          || (this.yapFrontEndArrSync.yapStatus === 'C' && this.yapFrontEndArrSync.rejectFlag))
          && (roleTeam === this.yapFrontEndArrSync.originalMainAuditorTeam || (this.yapFrontEndArrSync.coAuditorTeam.find((e) => e === roleTeam) !== undefined))) {
  			if (this.role.id === 'ROLE_Audit_Team_Head') {
  				return true;
  			} if (this.role.id === 'ROLE_Auditor' && this.isConfirmUser) {
  				return true;
  			}
  			return false;
  		}
  		return false;

  	case 'review': // 審畢按鈕
  		if (this.yapFrontEndArrSync.isReviewDone === 'toReview' || this.yapFrontEndArrSync.isReviewDone === 'done') return true;
  		return false;

  	case 'default':
  		return false;
  	}
  }

  // 複製 (整份查核資料)
  onHandleCopy() {
  	const $copyItem = this.$global.deepCopyData(this.yapFrontEndArrSync); // 深拷貝
  	this.$emit('slideclick', {
  		type: 'copy',
  		payload: {
  			yapId: this.yapId,
  			copyContent: $copyItem,
  		},
  	});
  }

  // 刪除 (整份查核資料)
  onHandleDelete() {
  	console.log('this.yapId', this.yapId);
  	this.$emit('slideclick', { type: 'delete', payload: { yapId: this.yapId } });
  }

  // 匯入舊資料 (整份查核資料)
  onHandleImport() {
  	this.$emit('slideclick', { type: 'import', payload: { yapId: this.yapFrontEndArrSync.yapId, yap: this.yapFrontEndArrSync } });
  }

  // 主管級 － 審畢
  onHandleReview() {
  	if (this.yapFrontEndArrSync.isReviewDone === 'toReview') {
  		this.$emit('slideclick', { type: 'review', payload: { yapId: this.yapFrontEndArrSync.yapId } });
  	}
  }

  // ----- 專案查核範圍 事件 -----//

  // 比對 專案查核範圍
  onComparisonProjectTextarea() {
  	// console.log('比對 專案查核範圍 =>', this.yapId);
  	this.$emit('click', { type: 'project-comparison', payload: { yapId: this.yapId, isEdit: this.isEditProject } });
  }

  // 回覆提問 專案查核範圍
  onQuestionItemProjectTextarea({
  	QAStatus, yapStatus, reviewLevel, rejectFlag,
  }) {
  	this.$emit('click', {
  		type: 'project-questionItem',
  		payload: {
  			yapId: this.yapId,
  			QAStatus,
  			yapStatus,
  			reviewLevel,
  			rejectFlag,
  			isSupervisorReaded: this.isSupervisor && this.isOnReviewLevel && QAStatus === 'A',
  		},
  	});
  }

  // 確認修改 專案查核範圍
  onConfirmItemProjectTextarea() {
  	// console.log('確認修改', this.yapId);
  	this.$emit('click', {
  		type: 'project-confirmItem',
  		payload: {
  			request: {
  				yapId: this.yapId,
  				yapProjectScopeContent: this.yapFrontEndArrSync.yapProjectScopeContent,
  				modify: this.yapFrontEndArrSync.yapProjectScopeContent !== this.yapFrontEndArrSync.originalYapProjectScopeContent,
  			},
  		},
  	});
  }

  // -----  重點查核項目 事件 ----- //

  // 判斷是否可以編輯查核重點項目
  checkEditYapPointAuditItem(yapPointAuditItem: YapPointAuditItemFrontEndDto): boolean {
  	const roleTeam = this.role.roleUnits[0]?.auditorTeamCode;

  	// 主管只能在 自己審閱的階段 編輯重點查核項目
  	if (this.yapFrontEndArrSync.yapStatus === 'C' && this.isSupervisor && !this.yapFrontEndArrSync.rejectFlag) return this.isOnReviewLevel() && this.yapFrontEndArrSync.isReviewDone !== 'done';

  	// 組長 在狀態 A、B、C 都可以編輯重點查核項目，但總狀態為B但是單項yapStatus = C 不得編輯或使用確認修改
  	if (this.currentRoleId === 'ROLE_Audit_Team_Head') {
  		// 總狀態為B但是單項yapStatus = C 不得編輯或使用確認修改
  		if (this.yapStatus === 'B' && this.yapFrontEndArrSync.yapStatus === 'C') return false;
  		if ((this.yapFrontEndArrSync.yapStatus == 'D' || this.yapFrontEndArrSync.yapStatus === 'E')) return false;
  		if (yapPointAuditItem?.hasReviewFlag) return false;
  		if (roleTeam !== this.yapFrontEndArrSync.originalMainAuditorTeam && (this.yapFrontEndArrSync.coAuditorTeam.find((e) => e === roleTeam) === undefined)) return false;
  		return true;
  	}

  	if (this.currentRoleId === 'ROLE_Auditor') {
  		if ((this.yapFrontEndArrSync.yapStatus === 'A' || this.yapFrontEndArrSync.yapStatus === 'B' || (this.yapFrontEndArrSync.yapStatus === 'C' && this.yapFrontEndArrSync.rejectFlag))
          && this.isConfirmUser
          && (roleTeam === this.yapFrontEndArrSync.originalMainAuditorTeam || (this.yapFrontEndArrSync.coAuditorTeam.find((e) => e === roleTeam) !== undefined))
          && yapPointAuditItem?.hasEditableFlag
  		) return true;
  	}

  	return false;
  }

  // 判斷是否出現刪除重點查核項目按鈕
  checkDeleteYapPointAuditItem(yapPointAuditItem: YapPointAuditItemFrontEndDto): boolean {
  	// 只有查核人員／組長 在狀態Ａ、Ｂ、Ｃ＋退回 可刪除
  	if (this.currentRoleId === 'ROLE_Audit_Team_Head' && this.checkEditYapPointAuditItem(yapPointAuditItem) && this.yapFrontEndArrSync.yapStatus !== 'C') return true;
  	if (this.currentRoleId === 'ROLE_Auditor' && this.checkEditYapPointAuditItem(yapPointAuditItem)) return true;

  	return false;
  }

  // 新增 重點查核項目
  onAddYapPointAuditItem(itemCode, itemName) {
  	// 找到該筆項目
  	const yapPointAuditItems = this.yapFrontEndArrSync.yapPointAuditItemMap.find((i) => i.key === itemCode).yapPointAuditItems;
  	yapPointAuditItems.push({
  		// 更改 yapID 前端固定格式:  add+uuid
  		yapPointAuditItemId: `add${uuid.v4()}`,
  		itemContent: null,
  		checkAuditor: null,
  		dataRelId: null,
  		itemCheckStatus: null,
  		itemCode,
  		itemName,
  		itemQAStatus: 'N',
  		modify: true,
  		hasDeletingFlag: false,
  		hasEditableFlag: true,
  		hasRejectCommentFlag: false,
  		hasReviewFlag: false,
  		originalItemContent: '',
  	});
  }

  // 刪除 重點查核項目
  onDeleteYapPointAuditItem(yapPointAuditItemMapId, yapPointAuditItemId) {
  	console.log('重點查核項目', yapPointAuditItemMapId, yapPointAuditItemId);
  	// add 為前端自己新增、複製、匯入舊資料產生 => 尚未寫進資料庫，可自行在前端畫面刪除
  	if (yapPointAuditItemId.includes('add') || yapPointAuditItemId.includes('copy')) {
  		const yapPointAuditItems = this.yapFrontEndArrSync.yapPointAuditItemMap.find((i) => i.key === yapPointAuditItemMapId).yapPointAuditItems;
  		const textareaData = yapPointAuditItems.find((i) => i.yapPointAuditItemId === yapPointAuditItemId);
  		yapPointAuditItems.splice(yapPointAuditItems.indexOf(textareaData), 1);
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'success',
  				title: '刪除重點查核項目 成功',
  				autoClose: 3,
  			},
  		});
  	} else {
  		// 呼叫 API 刪除資料
  		this.$emit('click', { type: 'deletePointAuditItem', payload: { yapId: this.yapId, yapPointAuditItemMapId, yapPointAuditItemId } });
  	}
  }

  // 比對 重點查核項目
  onComparisonItemTextarea(obj) {
  	// console.log('比對', itemId, yapPointAuditItemId);
  	this.$emit('click', { type: 'comparison', payload: { yapId: this.yapId, ...obj } });
  }

  // 連結 重點查核項目
  onLinkItemTextarea(obj) {
  	// console.log('連結', obj);
  	this.$emit('click', { type: 'linkItem', payload: { yapId: this.yapId, ...obj } });
  }

  // 回覆提問 重點查核項目
  onQuestionItemTextarea({
  	yapPointAuditItemId, yapPointAuditItemMapId, QAStatus, yapStatus, reviewLevel, rejectFlag,
  }) {
  	// 如果狀態為組長＋QAstatus !== Q，彈窗則無法提問問題
  	this.$emit('click', {
  		type: 'questionItem',
  		payload: {
  		  yapId: this.yapId,
  			yapPointAuditItemId,
  			yapPointAuditItemMapId,
  			QAStatus,
  			yapStatus,
  			reviewLevel,
  			rejectFlag,
  			isSupervisorReaded: this.isSupervisor && this.isOnReviewLevel && QAStatus === 'A',
  	},
  	});
  }

  // 確認修改 重點查核項目
  onConfirmItemTextarea(itemId: string, yapPointAuditItem: YapPointAuditItemFrontEndDto) {
  	console.log('確認修改', itemId, yapPointAuditItem);
  	this.$emit('click', {
  		type: 'confirmItem',
  		payload: {
  			yapId: this.yapFrontEndArrSync.yapId,
  			request: {
  				itemContent: yapPointAuditItem.itemContent,
  				modify: yapPointAuditItem.itemContent !== yapPointAuditItem.originalItemContent,
  				yapPointAuditItemId: yapPointAuditItem.yapPointAuditItemId,
  			},
  		},
  	});
  }

  // 組長 通過 重點查核項目 (子項目控制項)
  onCheckItem(yapPointAuditItemMapId, yapPointAuditItemId) {
  	console.log('通過', yapPointAuditItemMapId, yapPointAuditItemId);
  	this.$emit('click', {
  		type: 'reviewItem',
  		payload: {
  			yapId: this.yapId,
  			yapPointAuditItemMapId,
  			yapPointAuditItemId,
  			type: 'leaderApproval',
  			title: '審核通過',
  			label: '通過意見',
  		},
  	});
  }

  // 組長 退回 重點查核項目 (子項目控制項)
  onWithdrawItem(yapPointAuditItemMapId, yapPointAuditItemId) {
  	console.log('審核退回', yapPointAuditItemMapId, yapPointAuditItemId);
  	this.$emit('click', {
  		type: 'reviewItem',
  		payload: {
  			yapId: this.yapId,
  			yapPointAuditItemMapId,
  			yapPointAuditItemId,
  			type: 'leaderReturn',
  			title: '審核退回',
  			label: '退回意見',
  		},
  	});
  }

  // 組長退回意見
  onLeaderOpinion(yapPointAuditItemId) {
  	this.$emit('click', { type: 'LeaderOpinion', payload: { yapId: this.yapId, yapPointAuditItemId } });
  }

  /**
   * Hook
   */
  created() {
  	// console.log('this.activeImportantCheckKey', this.activeImportantCheckKey);
  	// this.activeImportantCheckKey = this.yapPointAuditItemList && this.yapPointAuditItemList.map((e) => e.key);
  	//
  }

  mounted() {
  	// console.log('mounted', this.yapFrontEndArrSync);
  	// this.isEditProject = this.checkEditProject();
  	// this.isEditYapPointAuditItem = this.checkEditYapPointAuditItem();
  	// console.log('isEditProject =>', this.isEditProject);
  }
}
</script>

<style lang="scss" scoped>
/* ------------- table ------------- */
.custom__table {
  margin-top: 10px;
  width: calc(100% - 1px);
  thead {
    tr {
      background: $COLOR-MAIN2;
      th {
        color: $COLOR-LIGHT;
        font-size: 14px;
        font-weight: 400;
        &:first-of-type {
          border-top-left-radius: 5px;
        }
        &:last-of-type {
          border-top-right-radius: 5px;
          width: 120px;
        }
      }
    }
  }
  tbody {
    border: 1px solid $COLOR-MAIN15;
    tr {
      &:first-of-type {
        td {
          &:last-of-type {
            border-left: 1px solid $COLOR-MAIN15;
            height: 0px;
          }
        }
      }
    }
  }
}
.custom__table--copy {
  tbody {
    background: #F7FCFD;
  }
}
.table__controlBar {
  @mixin stringToWidth($strWidth){
    min-width: calc(#{$strWidth} + 60px);
  }
  td {

    &:nth-child(1) {
      @include stringToWidth(2em);
      max-width: 1em;
      @include rwd-xll{
        max-width: none;
        min-width: 100%;
      }
    }
    &:nth-child(2) {
      @include stringToWidth(0em);
      max-width: 5em;
      @include rwd-xll{
        max-width: none;
        min-width: 100%;
      }
    }
    &:nth-child(3) {
      @include stringToWidth(6em);
      max-width: 20em;
      @include rwd-xll{
        min-width: 100%;
        max-width: none;
      }
    }
    &:nth-child(4) {
      @include stringToWidth(5em);
      max-width: 11em;
    }
    &:nth-child(5),
    &:nth-child(6) {
      @include stringToWidth(4em);
      max-width: 7em;
    }

    @include rwd-xll{
      max-width: none;
      min-width: 100%;
    }
    .search__result__select {
      width: 100%;
      ::v-deep {
        .ant-select-selection--multiple {
          max-height: 5em;
          overflow: auto;
        }
      }
    }
    .search__result__month{
      width: 80px;
    }
    .search__result__month--left{
      ::v-deep{
        .ant-select-selection{
          border-right: 0;
          border-radius: 4px 0px 0px 4px;
        }
      }
    }
    .search__result__month--right{
      ::v-deep{
        .ant-select-selection{
          border-left: 0;
          border-radius: 0px 4px 4px 0px;
        }
      }
    }
    .search__result__range{
      padding-right: 0px;
      padding-left: 0px;
      width: 10px;
      border-left: 0;
      border-right: 0;
      pointer-events: none;
      background-color: #fff;
      border-radius: 0px;
    }
    ::v-deep{
      .ant-form-item-control{
        line-height: 1em;
      }
    }
  }
}
.change__info__wrap {
  .change__info {
    font-size: 14px;
    color: $COLOR-MAIN16;
    margin-bottom: 0;
  }
}
.button__showAllUnit {
  border: 1px solid $COLOR-MAIN1;
  border-radius: 3px;
  background: $COLOR-LIGHT;
  font-size: 13px;
  color: $COLOR-MAIN1;
  padding: 0 8px;
  margin-left: auto;
  cursor: pointer;
}

.sideMenu__wrap {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  height: 100%;

  .button__copy {
    @include button_base($LIST-BG-DARK, #CCE3E8, $FONT-PRIMARY, $FONT-PRIMARY, $BUTTON-DARK, $BUTTON-DARK, 4px, 16px);
  }
  .button__delete {
    @include button_base(#F5DCD7, #F2D2CB, #EA8270, #EA8270, #EA8270, #EA8270, 4px, 16px);
  }
  .button__import {
    @include button_base($COLOR-MAIN10, #F8EBBF, #F48649, #F48649, #FFC94F, #FFC94F, 4px, 16px);
  }
  .sideMenu__item {
    width: 103px;
    padding: 10px 0;
    + .sideMenu__item {
      margin-top: 20px;
    }
  }
  .button__copy--unclickabled{
    cursor: not-allowed;
  }
}

// 專案查核範圍
.project__wrap {
  .project__header {
    background: $COLOR-MAIN2;
    color: $COLOR-LIGHT;
    font-size: 14px;
    padding: 0.5rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .textarea__wrap {
    padding: 13px 0;
    .textarea__main {
      margin-left: 53px;
      .ant-input {
        font-size: 16px;
      }
    }
  }
  .textarea__control {
    margin-right: 18px;
  }
}

// 重點查核項目 展開收合
::v-deep {
  .ant-collapse-content {
    > .ant-collapse-content-box {
      padding: 7px 0;
    }
  }
  .ant-input[disabled]{
    color: $FONT-DARK;
    background-color: #EEEEEE;
  }
  .ant-form-item{
    margin-bottom: 0;
  }

  .treeselect{
    .ant-select-selection{
      overflow-y: auto;
      max-height: 82px;
    }
  }
  .item__children--flex{
    .ant-form-item-children{
      display: flex;
    }
  }

}

  // .ant-form-explain{
  //   margin-top: -10px;
  // }

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
.controlBtn__check {
  background: url('~@assets/images/icon/icon_enter.svg');
}

// 重點查核項目
.importantCheck__wrap {
  border-top: 1px solid $COLOR-MAIN15;
  padding: 30px 13px 13px;
  position: relative;
}
.importantCheck__title__group {
  display: inline-flex;
  align-items: center;
  position: absolute;
  top: 20px;
  z-index: 30;
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
  .importantCheck__icon {
    background: url('~@assets/images/icon/icon_news.svg');
    border: 0;
    padding: 0;
    width: 22px;
    height: 22px;
  }
}

.info__message {
  font-size: 14px;
  color: $COLOR-MAIN16;
  margin: 5px;
}

.textarea__control__text__btn {
  border: 1px solid $COLOR-MAIN1;
  background: $COLOR-LIGHT;
  font-size: 13px;
  color: $COLOR-MAIN1;
  border-radius: 3px;
  padding: 0 5px;
  width: 100%;
  margin-top: 5px 0;
  cursor: pointer;
}
.footer__button__wrap {
  display: flex;
  justify-content: center;
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

.numListStyle {
  margin-left: 30px;
  counter-reset: c;
  > li {
    padding-left: 1.5rem;
    &::before {
      counter-increment: c;
      content: '('counter(c)')';
      position: absolute;
      left: 0;
    }
  }
}

.has-error {
  color: #f5222d;
}
</style>
