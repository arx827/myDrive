<template>
  <!-- 查核意見為無('N')或無此項('X')，呈現template資料 -->
  <div>
    <div
      v-if="opinion === 'N' || opinion === 'X'"
      class="row g-0 mt-3 mb-3"
    >
      <a-collapse
        :default-active-key="auditOpinionSync.auditOpinionId"
        :expand-icon-position="'left'"
      >
        <a-collapse-panel
          :key="auditOpinionSync.auditOpinionId"
          :header="'查核人員：' + getAuditorsListString(auditOpinionSync.auditors,'、')"
        >
          <div
            v-if="isShowMainModifyAuditorBtn"
            slot="extra"
            @click="(e)=>{e.stopPropagation();}"
          >
            <CustomPopConfirm
              :title="checkIfInAuditor(auditOpinionSync.auditors,currentUserDomainId)?'確認刪除人員？':'確認新增人員？'"
              @confirm="modifyAuditor(checkIfInAuditor(auditOpinionSync.auditors,currentUserDomainId),auditOpinionSync)"
            >
              <div
                class="collapse__btn"
                :class="checkIfInAuditor(auditOpinionSync.auditors,currentUserDomainId)?'btn__icon--subproject_close': 'btn__icon--subproject_add'"
              />
            </CustomPopConfirm>
          </div>
          <a-form-model
            ref="formRef"
            :model="auditOpinion"
            :hide-required-mark="true"
            :rules="formRules"
          >
            <div class="main-opinion">
              <div class="row g-0">
                <div class="col-1 text-end content__label ">
                  <span class="content__label__required">*</span>
                  主項：
                </div>
                <div class="col ps-2">
                  <a-form-model-item
                    prop="content"
                  >
                    <a-textarea
                      v-model="auditOpinionSync.content"
                      :disabled="!auditOpinionSync.canModifyFlag"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                      @change="mainFormItemChange(auditOpinionSync)"
                    />
                  </a-form-model-item>
                </div>
                <div
                  class="col-auto main-opinion__action"
                >
                  <div class="row g-0">
                    <div
                      class="col-6"
                    >
                      <a-tooltip
                        placement="top"
                        :overlay-class-name="'whiteTooltip'"
                      >
                        <template slot="title">
                          <span v-if="auditOpinionSync.redQaStatusFlag">待回覆</span>
                          <span v-else>回覆提問</span>
                        </template>
                        <button
                          class="textarea__control__btn btn__icon--question"
                          :class="auditOpinionSync.redQaStatusFlag ? 'btn__icon--question_red': 'btn__icon--question'"
                          @click="QAHandler(auditOpinionSync)"
                        />
                      </a-tooltip>
                    </div>
                    <div
                      v-if="auditOpinionSync.canModifyFlag && auditDraftContentStatus !== '01' && !(auditOpinionSync.auditOpinionId.includes('add'))"
                      class="col-6"
                    >
                      <a-tooltip
                        placement="top"
                        :overlay-class-name="'whiteTooltip'"
                      >
                        <template slot="title">
                          <span v-if="auditOpinionSync.redCheckStatusFlag">待確認</span>
                          <span v-else>確認修改</span>
                        </template>
                        <button
                          class="textarea__control__btn"
                          :class="auditOpinionSync.redCheckStatusFlag ? 'btn__icon--confirm' : 'btn__icon--enter1'"
                          @click="modifyAuditOpinion(auditOpinionSync)"
                        />
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-form-model>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <a-collapse
      v-else
      :default-active-key="auditOpinionSync.auditOpinionId"
      :expand-icon-position="'left'"
    >
      <a-collapse-panel
        :key="auditOpinionSync.auditOpinionId"
        :header="'查核人員：' + getAuditorsListString(auditOpinionSync.auditors,'、')"
      >
        <div
          v-if="isShowMainModifyAuditorBtn"
          slot="extra"
          @click="(e)=>{e.stopPropagation();}"
        >
          <CustomPopConfirm
            :title="checkIfInAuditor(auditOpinionSync.auditors,currentUserDomainId)?'確認刪除人員？':'確認新增人員？'"
            @confirm="modifyAuditor(checkIfInAuditor(auditOpinionSync.auditors,currentUserDomainId),auditOpinionSync)"
          >
            <div
              class="collapse__btn"
              :class="checkIfInAuditor(auditOpinionSync.auditors,currentUserDomainId)?'btn__icon--subproject_close': 'btn__icon--subproject_add'"
            />
          </CustomPopConfirm>
        </div>
        <a-form-model
          ref="formRef"
          :model="auditOpinion"
          :hide-required-mark="true"
          :rules="formRules"
        >
          <div class="main-opinion">
            <div class="row g-0">
              <div class="col-1 text-end content__label ">
                <span class="content__label__required">*</span>
                {{ `${index+1}.主項：` }}
              </div>
              <div class="col ps-2">
                <a-form-model-item
                  prop="content"
                >
                  <a-textarea
                    v-model="auditOpinionSync.content"
                    :disabled="!auditOpinionSync.canModifyFlag"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    @change="mainFormItemChange(auditOpinionSync)"
                  />
                </a-form-model-item>
              </div>
              <div
                class="col-auto main-opinion__action"
              >
                <div class="row g-0">
                  <div
                    class="col-6"
                  >
                    <a-tooltip
                      placement="top"
                      :overlay-class-name="'whiteTooltip'"
                    >
                      <template slot="title">
                        <span v-if="auditOpinionSync.redQaStatusFlag">待回覆</span>
                        <span v-else>回覆提問</span>
                      </template>
                      <button
                        class="textarea__control__btn btn__icon--question"
                        :class="auditOpinionSync.redQaStatusFlag ? 'btn__icon--question_red': 'btn__icon--question'"
                        @click="QAHandler(auditOpinionSync)"
                      />
                    </a-tooltip>
                  </div>
                  <div
                    v-if="auditOpinionSync.canModifyFlag && auditDraftContentStatus !== '01' && !(auditOpinionSync.auditOpinionId.includes('add'))"
                    class="col-6"
                  >
                    <a-tooltip
                      placement="top"
                      :overlay-class-name="'whiteTooltip'"
                    >
                      <template slot="title">
                        <span v-if="auditOpinionSync.redCheckStatusFlag">待確認</span>
                        <span v-else>確認修改</span>
                      </template>
                      <button
                        class="textarea__control__btn"
                        :class="auditOpinionSync.redCheckStatusFlag ? 'btn__icon--confirm' : 'btn__icon--enter1'"
                        @click="modifyAuditOpinion(auditOpinionSync)"
                      />
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-1 text-end content__label">
                負責部門：
              </div>
              <div class="col ps-2">
                <a-form-model-item
                  prop="auditOpinionUnits"
                >
                  <a-tree-select
                    v-model="auditOpinionSync.auditOpinionUnits"
                    class="treeselect"
                    :disabled="!auditOpinionSync.canModifyFlag"
                    :tree-data="auditOpinionUnitOptions"
                    tree-checkable
                    :tree-default-expand-all="true"
                    tree-node-filter-prop="title"
                    dropdown-class-name="treeselect"
                    :dropdown-style="{'maxHeight': '300px'}"
                    @change="mainFormItemChange(auditOpinionSync,hasValidatedOnce && validateForm)"
                  />
                </a-form-model-item>
              </div>
              <div class="col-auto main-opinion__action" />
            </div>
            <div class="row g-0">
              <div class="col-1 text-end content__label">
                建議事項：
              </div>
              <div class="col ps-2">
                <a-form-model-item
                  prop="suggestion"
                >
                  <a-textarea
                    v-model="auditOpinionSync.suggestion"
                    :disabled="!auditOpinionSync.canModifyFlag"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    @change="mainFormItemChange(auditOpinionSync,hasValidatedOnce && validateForm)"
                  />
                </a-form-model-item>
              </div>
              <div class="col-auto main-opinion__action" />
            </div>
            <div class="row g-0">
              <div class="col-1 text-end content__label">
                意見摘要：
              </div>
              <div class="col ps-2">
                <a-form-model-item
                  prop="opinionSummary"
                >
                  <a-textarea
                    v-model="auditOpinionSync.opinionSummary"
                    :disabled="!auditOpinionSync.canModifyFlag"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    @change="mainFormItemChange(auditOpinionSync,hasValidatedOnce && validateForm)"
                  />
                </a-form-model-item>
              </div>
              <div class="col-auto main-opinion__action" />
            </div>
            <div class="row g-0">
              <div class="col-1 text-end content__label">
                風險等級：
              </div>
              <div class="col ps-2 align-self-center">
                <a-form-model-item
                  prop="riskLevel"
                >
                  <a-radio-group
                    v-model="auditOpinionSync.riskLevel"
                    :disabled="!auditOpinionSync.canModifyFlag"
                    class="align-self-center"
                    @change="mainFormItemChange(auditOpinionSync,hasValidatedOnce && validateForm)"
                  >
                    <a-radio
                      v-for="riskLevelsOption in riskLevelOptions"
                      :key="riskLevelsOption.value"
                      :value="riskLevelsOption.value"
                    >
                      {{ riskLevelsOption.label }}
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </div>
              <div class="col-auto main-opinion__action" />
            </div>
            <div class="row g-0">
              <div class="col-1 text-end content__label">
                改善期限：
              </div>
              <div class="col ps-2 align-self-center">
                <a-form-model-item
                  ref="mainImporveOptionRef"
                  class="imporve-option"
                  prop="imporveOption"
                >
                  <a-radio-group
                    v-model="auditOpinionSync.imporveOption"
                    :disabled="!auditOpinionSync.canModifyFlag"
                    class="align-self-center"
                    @change="mainFormItemChange(auditOpinionSync,opinionImproveOptionChange($event,auditOpinionSync))"
                  >
                    <div class="radio-item--inline me-3">
                      <a-radio value="null">
                        不選擇
                      </a-radio>
                    </div>
                    <a-radio value="deadLine" />
                    <div class="radio-item--inline me-3">
                      <a-form-model-item
                        class="mb-0"
                        prop="improveDeadline"
                      >
                        <date-picker
                          v-model="auditOpinionSync.improveDeadline"
                          class="align-self-center w-100"
                          type="date"
                          :disabled-date="disableDate"
                          :disabled="!auditOpinionSync.canModifyFlag || auditOpinionSync.imporveOption !== 'deadLine'"
                          :formatter="dateFormatter"
                          :allow-clear="true"
                          @change="() => {mainFormItemChange(auditOpinionSync,$refs.mainImporveOptionRef.onFieldChange())}"
                        />
                      </a-form-model-item>
                    </div>
                    <a-radio value="imporved">
                      立即改善
                    </a-radio>
                    <!-- <div class="radio-item--inline">
                      <a-form-model-item
                        class="mb-0"
                        prop="improveDate"
                      >
                        <date-picker
                          v-model="auditOpinionSync.improveDate"
                          type="date"
                          class="w-100"
                          :disabled="!auditOpinionSync.canModifyFlag || auditOpinionSync.imporveOption !== 'imporved'"
                          :formatter="dateFormatter"
                          :allow-clear="true"
                          @change="() => {mainFormItemChange(auditOpinionSync,$refs.mainImporveOptionRef.onFieldChange())}"
                        />
                      </a-form-model-item>
                    </div> -->
                  </a-radio-group>
                </a-form-model-item>
              </div>
              <div class="col-auto main-opinion__action" />
            </div>
            <div
              v-if="auditOpinionSync.imporveOption === 'imporved'"
              class="row g-0"
            >
              <div class="col-1 text-end content__label">
                改善情形：
              </div>
              <div class="col ps-2">
                <a-form-model-item
                  prop="improveSituation"
                  :rules="{ required: auditOpinionSync.imporveOption === 'imporved', message: '此為必填欄位'}"
                >
                  <a-textarea
                    v-model="auditOpinionSync.improveSituation"
                    :disabled="!auditOpinionSync.canModifyFlag"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    @change="mainFormItemChange(auditOpinionSync,hasValidatedOnce && validateForm)"
                  />
                </a-form-model-item>
              </div>
              <div class="col-auto main-opinion__action" />
            </div>
          </div>
          <template v-if="auditOpinionSync.subAuditOpinions && auditOpinionSync.subAuditOpinions.length > 0">
            <div
              v-for="(subAuditOpinion,index) in auditOpinionSync.subAuditOpinions"
              :key="subAuditOpinion.auditOpinionId"
              class="sub-opinion mb-3"
            >
              <div class="row g-0">
                <div class="col-1 text-end fw-bold my-3 pt-1">
                  查核人員：
                </div>
                <div class="col ps-1 fw-bold my-3">
                  {{ getAuditorsListString(subAuditOpinion.auditors,'、') }}
                  <CustomPopConfirm
                    v-if="checkIsShowMainModifyAuditorBtn(subAuditOpinion)"
                    :title="checkIfInAuditor(subAuditOpinion.auditors,currentUserDomainId)?'確認刪除人員？':'確認新增人員？'"
                    @confirm="modifyAuditor(checkIfInAuditor(subAuditOpinion.auditors,currentUserDomainId),subAuditOpinion)"
                  >
                    <button
                      class="btn--title"
                      :class="checkIfInAuditor(subAuditOpinion.auditors,currentUserDomainId)?'btn__icon--subproject_close': 'btn__icon--subproject_add'"
                    />
                  </CustomPopConfirm>
                </div>
                <div class="col-auto sub-opinion__action" />
              </div>
              <div class="row g-0">
                <div class="col-1 text-end content__label">
                  <span class="content__label__required">*</span>
                  {{ `(${index+1})子項：` }}
                </div>
                <div class="col ps-2">
                  <a-form-model-item
                    :prop="'subAuditOpinions.'+index+'.content'"
                    :rules="{required: true, trigger: 'change', message: '此為必填欄位'}"
                  >
                    <a-textarea
                      v-model="subAuditOpinion.content"
                      :disabled="!subAuditOpinion.canModifyFlag"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                      @change="()=>{mainFormItemChange(subAuditOpinion,hasValidatedOnce && validateForm)}"
                    />
                  </a-form-model-item>
                </div>
                <div class="col-auto sub-opinion__action">
                  <div class="row g-0">
                    <div
                      class="col-6"
                    >
                      <a-tooltip
                        placement="top"
                        :overlay-class-name="'whiteTooltip'"
                      >
                        <template slot="title">
                          <span v-if="subAuditOpinion.redQaStatusFlag">待回覆</span>
                          <span v-else>回覆提問</span>
                        </template>
                        <button
                          class="textarea__control__btn btn__icon--question"
                          :class="subAuditOpinion.redQaStatusFlag ? 'btn__icon--question_red': 'btn__icon--question'"
                          @click="QAHandler(subAuditOpinion)"
                        />
                      </a-tooltip>
                    </div>
                    <div
                      v-if="subAuditOpinion.canModifyFlag && auditDraftContentStatus !== '01' && !(subAuditOpinion.auditOpinionId.includes('add'))"
                      class="col-6"
                    >
                      <a-tooltip
                        placement="top"
                        :overlay-class-name="'whiteTooltip'"
                      >
                        <template slot="title">
                          <span v-if="subAuditOpinion.redCheckStatusFlag">待確認</span>
                          <span v-else>確認修改</span>
                        </template>
                        <button
                          class="textarea__control__btn"
                          :class="subAuditOpinion.redCheckStatusFlag ? 'btn__icon--confirm' : 'btn__icon--enter1'"
                          @click="modifyAuditOpinion(subAuditOpinion)"
                        />
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row g-0">
                <div class="col-1 text-end content__label">
                  負責部門：
                </div>
                <div class="col ps-2">
                  <a-form-model-item
                    :prop="'subAuditOpinions.'+index+'.auditOpinionUnits'"
                    :rules="{validator:subAuditOpinionValidator}"
                  >
                    <a-tree-select
                      v-model="subAuditOpinion.auditOpinionUnits"
                      class="treeselect"
                      :tree-data="auditOpinionUnitOptions"
                      :disabled="!subAuditOpinion.canModifyFlag"
                      tree-checkable
                      :tree-default-expand-all="true"
                      tree-node-filter-prop="title"
                      dropdown-class-name="treeselect"
                      :dropdown-style="{'maxHeight': '300px'}"
                      @change="()=>{mainFormItemChange(subAuditOpinion,hasValidatedOnce && validateForm)}"
                    />
                  </a-form-model-item>
                </div>
                <div class="col-auto sub-opinion__action" />
              </div>
              <div class="row g-0">
                <div class="col-1 text-end content__label">
                  建議事項：
                </div>
                <div class="col ps-2">
                  <a-form-model-item
                    :prop="'subAuditOpinions.'+index+'.suggestion'"
                    :rules="{validator:subAuditOpinionValidator}"
                  >
                    <a-textarea
                      v-model="subAuditOpinion.suggestion"
                      :disabled="!subAuditOpinion.canModifyFlag"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                      @change="()=>{mainFormItemChange(subAuditOpinion,hasValidatedOnce && validateForm)}"
                    />
                  </a-form-model-item>
                </div>
                <div class="col-auto sub-opinion__action" />
              </div>
              <div class="row g-0">
                <div class="col-1 text-end content__label">
                  風險等級：
                </div>
                <div class="col ps-2 align-self-center">
                  <a-form-model-item
                    :prop="'subAuditOpinions.'+index+'.riskLevel'"
                    :rules="{validator:subAuditOpinionValidator}"
                  >
                    <a-radio-group
                      v-model="subAuditOpinion.riskLevel"
                      :disabled="!subAuditOpinion.canModifyFlag"
                      class="align-self-center"
                      @change="()=>{mainFormItemChange(subAuditOpinion,hasValidatedOnce && validateForm)}"
                    >
                      <a-radio
                        v-for="riskLevelsOption in riskLevelOptions"
                        :key="riskLevelsOption.value"
                        :value="riskLevelsOption.value"
                      >
                        {{ riskLevelsOption.label }}
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
                <div class="col-auto sub-opinion__action" />
              </div>
              <div class="row g-0">
                <div class="col-1 text-end content__label">
                  改善期限：
                </div>
                <div class="col ps-2 align-self-center">
                  <a-form-model-item
                    ref="subImporveOptionRef"
                    class="imporve-option"
                    :prop="'subAuditOpinions.'+index+'.imporveOption'"
                    :rules="{validator:subImporveOptionValidator}"
                  >
                    <a-radio-group
                      v-model="subAuditOpinion.imporveOption"
                      :disabled="!subAuditOpinion.canModifyFlag"
                      class="align-self-center"
                      @change="mainFormItemChange(subAuditOpinion,opinionImproveOptionChange($event,subAuditOpinion))"
                    >
                      <div class="radio-item--inline">
                        <a-radio value="null">
                          不選擇
                        </a-radio>
                      </div>
                      <a-radio value="deadLine" />
                      <div class="radio-item--inline me-3">
                        <a-form-model-item
                          class="mb-0"
                          :prop="'subAuditOpinions.'+index+'.improveDeadline'"
                          :rules="{validator:subImproveDeadLineValidator}"
                        >
                          <date-picker
                            v-model="subAuditOpinion.improveDeadline"
                            type="date"
                            class="w-100"
                            :disabled="!subAuditOpinion.canModifyFlag || subAuditOpinion.imporveOption !== 'deadLine'"
                            :formatter="dateFormatter"
                            :disabled-date="disableDate"
                            :allow-clear="true"
                            @change="mainFormItemChange(subAuditOpinion,$refs.subImporveOptionRef[index].onFieldChange())"
                          />
                        </a-form-model-item>
                      </div>
                      <a-radio value="imporved">
                        立即改善
                      </a-radio>
                      <!-- <div class="radio-item--inline">
                        <a-form-model-item
                          class="mb-0"
                          :prop="'subAuditOpinions.'+index+'.improveDate'"
                          :rules="{validator:subImproveDateValidator}"
                        >
                          <date-picker
                            v-model="subAuditOpinion.improveDate"
                            :disabled="!subAuditOpinion.canModifyFlag || subAuditOpinion.imporveOption !== 'imporved'"
                            :formatter="dateFormatter"
                            type="date"
                            :allow-clear="true"
                            class="w-100"
                            @change="mainFormItemChange(subAuditOpinion,$refs.subImporveOptionRef[index].onFieldChange())"
                          />
                        </a-form-model-item>
                      </div> -->
                    </a-radio-group>
                  </a-form-model-item>
                </div>
                <div class="col-auto sub-opinion__action" />
              </div>
              <div
                v-if="subAuditOpinion.imporveOption === 'imporved'"
                class="row g-0"
              >
                <div class="col-1 text-end content__label">
                  改善情形：
                </div>
                <div class="col ps-2">
                  <a-form-model-item
                    :prop="'subAuditOpinions.'+index+'.improveSituation'"
                    :rules="{ required: subAuditOpinion.imporveOption === 'imporved',message: '此為必填欄位'}"
                  >
                    <a-textarea
                      v-model="subAuditOpinion.improveSituation"
                      :disabled="!subAuditOpinion.canModifyFlag"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                      @change="mainFormItemChange(subAuditOpinion,hasValidatedOnce && validateForm)"
                    />
                  </a-form-model-item>
                </div>
                <div class="col-auto sub-opinion__action" />
              </div>
            </div>
          </template>
          <div
            v-if="currentRoleId === 'ROLE_Auditor' && auditDraftContentStatus !== '99' && auditDraftContentStatus !== '90'"
            class="text-center mb-2"
          >
            <button
              class="btn--addblock"
              @click="addSubAuditOpinion(auditOpinionSync.subAuditOpinions)"
            >
              <a-icon
                class="icon"
                type="plus"
              /><span>新增子項</span>
            </button>
          </div>
        </a-form-model>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, PropSync,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import AccordionArea from '@shared/AccordionArea.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import { Getter, Action, namespace } from 'vuex-class';
import {
	RoleDto, AccountDto, AuditOpinionDto, KillAuditOpinionAuditorRequest, CreateAuditOpinionAuditorRequestVO,
	SetSureAuditOpinionRequest,
	UpdateAuditOpinionQuestionStatus,
} from '@fubonlife/iams-api-axios-sdk';
import { uuid } from 'vue-uuid';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { AuditOpinionFrontEndDto, AuditOpinionQAModel, UpdateAuditOpinion } from '@/pages/auditing/models';
import AuditOpinionQAModal from '@/components/auditing/auditingContent/AuditOpinionQAModal.vue';
import { auditOpinionDto } from './CompareFeedModal.vue';

const modalModule = namespace('modalControl');

@Component({
	components: {
		IconTextButton,
		FblDataGrid,
		CustomPopConfirm,
		AccordionArea,
		AuditOpinionQAModal,
	},
})
export default class AuditOpinion extends Vue {
	@modalModule.Action('setModalState') setModalState;

	@Action('setLoading') setLoading;

  @PropSync('auditOpinion')
	auditOpinionSync: AuditOpinionFrontEndDto;

  @Prop()
  riskLevelOptions;

  @Prop()
  auditDraftContentStatus: string;

  @Prop() // 負責部門下拉選單
  auditOpinionUnitOptions;

  @Prop() // 第幾個主項
  index;

  @Prop()
  originalAuditOpinionsFrontEnd: AuditOpinionFrontEndDto;

  @Prop() // 查核內容查核意見選項
  opinion: string;

  @Prop() // 改善期限不能選擇查核期間以前的日期
  improveDisabledDate: Date;

  @Prop() // 查核內容的查核人員清單
  draftAuditor: {[key: string]: string}[];

  // 是否驗證過一次
  hasValidatedOnce: boolean = false;

  currentRoleId: string;

  currentUser: AccountDto;

  currentUserDomainId: string;

  dateFormatter = this.$twDateFormatter;

  isLoading: boolean = false;

  activecollapseKey: string = null;

  subAuditOpinionHavingValue: boolean = false;

  mainAuditOpinionHavingValue: boolean = false;

  // @Watch('auditOpinionSync', { deep: true })
  // onAuditOpinionSyncChanged(value) {
  // 	this.activecollapseKey = value.auditOpinionId;
  // }

	// 查核欄位檢核
	formRules = {
  	content: [{ required: true, message: '此為必填欄位', trigger: 'change' }],
  	auditOpinionUnits: [{ validator: this.mainAuditOpinionValidator }],
  	suggestion: [{ validator: this.mainAuditOpinionValidator }],
  	// opinionSummary: [{ validator: this.mainAuditOpinionValidator }],
  	opinionSummary: [{ required: true, message: '此為必填欄位', trigger: 'change' }],
  	riskLevel: [{ validator: this.mainAuditOpinionValidator }],
  	imporveOption: [{ validator: this.mainImporveOptionValidator }],
		improveDeadline: [{ validator: this.mainImproveDeadLineValidator }],
		improveDate: [{ validator: this.mainImproveDateValidator }],
	}

	// 查核意見選項
	opinionOptions = [
		{
			label: '有',
			value: 'y',
		},
		{
			label: '無',
			value: 'n',
		},
		{
			label: '無此項',
			value: 'null',
		},
	]

	// ------- get -------
	// 是否顯示新增／刪除查核人員按鈕
	get isShowMainModifyAuditorBtn(): boolean {
		return this.checkIsShowMainModifyAuditorBtn(this.auditOpinionSync);
	}

	/**
	 * Hook
	 */
	created() {
  	this.currentRoleId = this.$global.getCurrentRoleId();
  	this.currentUser = this.$user.getMe();
  	this.currentUserDomainId = this.currentUser.employee.domainId;
	}

	mounted() {
		this.getSubAuditOpinionHavingValue();
		this.getMainAuditOpinionHavingValue();
		if (this.auditOpinionSync.subAuditOpinions && this.auditOpinionSync.subAuditOpinions.length > 0) this.hasValidatedOnce = true;
	}

	/**
	 * API
	 */

	// API: 確認修改查核意見
	modifyAuditOpinion(opinion: AuditOpinionFrontEndDto) {
  	// console.log('確認修改查核意見');
  	this.setLoading(true);
  	// 確認修改主項
  	const originalDate = this.$global.deepCopyData(opinion);
   	delete originalDate.subAuditOpinions;
  	const request: SetSureAuditOpinionRequest = originalDate;
  	this.$workPaperApi.setSureAuditOpinionUsingPOST(request)
  		.then((resp) => {
    		// console.log('確認修改查核意見成功', resp);
  			if (resp.data) {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '確認修改查核意見成功',
  						autoClose: 3,
  					},
  				});
					this.$emit('updateAuditOpinion', {
						auditOpinionId: opinion.auditOpinionId,
						subRelMainId: opinion.subRelMainId,
					});
  			} else {
  				this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: '確認修改查核意見失敗',
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
    				title: '確認修改查核意見失敗',
    			},
    		});
    	})
    	.finally(() => {
    		this.setLoading(false);
    	});
	}

	// API: 刪除查核意見查核人員
	deleteAuditorFormServer(opinion: AuditOpinionFrontEndDto, employeeDomainId: string) {
  	const request: KillAuditOpinionAuditorRequest = {
  		auditOpinionId: opinion.auditOpinionId,
  		auditor: employeeDomainId,
  	};
  	this.$workPaperApi.killAuditOpinionAuditorUsingPOST(request)
    	.then((resp) => {
    		// console.log('刪除查核人員 成功', resp);
    		this.setModalState({
    			resultModal: {
    				visible: true,
    				type: 'success',
    				title: '刪除查核人員成功',
    				autoClose: 3,
    			},
    		});
  			this.deleteAuditor(opinion, employeeDomainId);
    	})
    	.catch(() => {
    		console.error();
    		this.setModalState({
    			resultModal: {
    				visible: true,
    				type: 'error',
    				title: '刪除查核人員失敗',
    			},
    		});
    	})
    	.finally(() => {
    		this.setLoading(false);
    	});
	}

	// API: 新增查核人員
	addAuditorFormServer(opinion: AuditOpinionFrontEndDto, name: string, employeeDomainId: string) {
  	// console.log('API: 新增查核人員');
  	const request: CreateAuditOpinionAuditorRequestVO = {
  		auditOpinionId: opinion.auditOpinionId,
  		auditor: employeeDomainId,
  	};
  	this.$workPaperApi.createAuditOpinionAuditorUsingPOST(request)
    	.then((resp) => {
    		// console.log('新增查核人員 成功', resp);
    		this.setModalState({
    			resultModal: {
    				visible: true,
    				type: 'success',
    				title: '新增查核人員成功',
    				autoClose: 3,
    			},
    		});
  			// 更新前端畫面
  			this.addAuditor(opinion, name, employeeDomainId);
    	})
    	.catch(() => {
    		console.error();
    		this.setModalState({
    			resultModal: {
    				visible: true,
    				type: 'error',
    				title: '新增查核人員失敗',
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

	// ------- custom validate event -------
	// 主項欄位必填驗證
	mainAuditOpinionValidator(rule, value, callback) {
		if (!this.hasValidatedOnce) callback();
  	// 如果子項不存在，就為必填項目
  	if ((!this.auditOpinionSync.subAuditOpinions || this.auditOpinionSync.subAuditOpinions.length === 0) && (!value || value.length === 0 || value === 'null')) return callback('此為必填欄位');
  	// 如果子項有存在，且值都沒有被填寫，就為必填項目
  	if (!this.subAuditOpinionHavingValue && (!value || value.length === 0 || value === 'null')) return callback('此為必填欄位');
		// 如果主項的負責部門, 建議事項, 風險等級, 改善期限其中一項有填寫，負責部門, 建議事項, 風險等級, 改善期限皆為必填
  	// if (this.mainAuditOpinionHavingValue && (!value || value.length === 0 || value === 'null')) return callback('此為必填欄位');
  	callback();
	}

	// 子項欄位必填驗證
	subAuditOpinionValidator(rule, value, callback) {
  	// 如果一個子項有值，就為必填項目
  	if (this.subAuditOpinionHavingValue) {
  		if (!value || value.length === 0 || value === 'null') {
  			callback('此為必填欄位');
  		}
  		callback();
  	}
  	callback();
	}

	// 主項改善期限驗證
	mainImporveOptionValidator(rule, value, callback) {
		if (!this.hasValidatedOnce) callback();
  	(this.$refs.formRef as any).validateField(['improveDeadline', 'improveDate']);
  	// 如果子項不存在，就為必填項目
  	if ((!this.auditOpinionSync.subAuditOpinions || this.auditOpinionSync.subAuditOpinions.length === 0)
        && (!value || value.length === 0 || value === 'null')) return callback('此為必填欄位');

  	// 如果子項有存在，且值都沒有被填寫，就為必填項目
  	if (!this.subAuditOpinionHavingValue && (!value || value.length === 0 || value === 'null')) return callback('此為必填欄位');

  	// 如果主項的負責部門, 建議事項, 風險等級, 改善期限其中一項有填寫，負責部門, 建議事項, 風險等級, 改善期限皆為必填
  	// if (this.mainAuditOpinionHavingValue && (!value || value.length === 0 || value === 'null')) return callback('此為必填欄位');
  	// getMainAuditOpinionHavingValue;
  	callback();
	}

	// 主項改善期限日期驗證
	mainImproveDeadLineValidator(rule, value, callback) {
  	if (this.auditOpinionSync.imporveOption === 'deadLine' && (!this.auditOpinionSync.improveDeadline || this.auditOpinionSync.improveDeadline === null || this.auditOpinionSync.improveDeadline.length === 0)) return callback('請填寫改善期限');
  	callback();
	}

	// 主項已改善期限驗證
	mainImproveDateValidator(rule, value, callback) {
  	if (this.auditOpinionSync.imporveOption === 'imporved' && (!this.auditOpinionSync.improveDate || this.auditOpinionSync.improveDate === null || this.auditOpinionSync.improveDate.length === 0)) return callback('請填寫已改善期限');
  	callback();
	}

  	// 子項改善期限驗證
	subImporveOptionValidator(rule, value, callback) {
  	const filedArr = rule.field.split('.');
  	const subOpinionIndex = parseInt(filedArr[1]);
  	(this.$refs.formRef as any).validateField([`subAuditOpinions.${subOpinionIndex}.improveDeadline`, `subAuditOpinions.${subOpinionIndex}.improveDate`]);
  	// 如果子項不存在，就為必填項目
  	if (this.subAuditOpinionHavingValue) {
  		if (!value || value.length === 0 || value === 'null') {
  			callback('此為必填欄位');
  		}
  		callback();
  	}
  	callback();
  	// 如果子項有存在，且值都沒有被填寫，就為必填項目
  	if (!this.subAuditOpinionHavingValue && (!value || value.length === 0 || value === 'null')) return callback('此為必填欄位');
  	callback();
	}

	// 子項改善期限日期驗證
	subImproveDeadLineValidator(rule, value, callback) {
  	const filedArr = rule.field.split('.');
  	const subOpinionIndex = parseInt(filedArr[1]);
  	const subAuditOpinion = this.auditOpinionSync.subAuditOpinions[subOpinionIndex];
  	if (subAuditOpinion.imporveOption === 'deadLine' && (!subAuditOpinion.improveDeadline || subAuditOpinion.improveDeadline === null || subAuditOpinion.improveDeadline.length === 0)) return callback('請填寫改善期限');
  	callback();
	}

	// 子項已改善期限驗證
	subImproveDateValidator(rule, value, callback) {
  	const filedArr = rule.field.split('.');
  	const subOpinionIndex = parseInt(filedArr[1]);
  	const subAuditOpinion = this.auditOpinionSync.subAuditOpinions[subOpinionIndex];
  	if (subAuditOpinion.imporveOption === 'imporved' && (!subAuditOpinion.improveDate || subAuditOpinion.improveDate === null || subAuditOpinion.improveDate.length === 0)) return callback('請填寫已改善期限');
  	callback();
	}

	// 判斷主項是不是有填值
	checkMainAuditOpinionHavingValue(mainAuditOpinion): boolean {
  	// 檢查「負責部門」是否有填寫
  	if (mainAuditOpinion.auditOpinionUnits && mainAuditOpinion.auditOpinionUnits.length > 0) return true;
  	// 檢查「建議事項」是否有填寫
  	if (mainAuditOpinion.suggestion && mainAuditOpinion.suggestion.length > 0) return true;
  	// 檢查「風險等級」是否有填寫
  	if (mainAuditOpinion.riskLevel && mainAuditOpinion.riskLevel.length > 0 && mainAuditOpinion.riskLevel !== 'null') return true;
  	// 檢查「改善期限」是否有填寫
  	if (mainAuditOpinion.imporveOption && mainAuditOpinion.imporveOption.length > 0 && mainAuditOpinion.imporveOption !== 'null') return true;
  	return false;
	}

	// 判斷子項是不是有填值
	checkSubAuditOpinionHavingValue(subAuditOpinionArr): boolean {
  	for (let i = 0; i < subAuditOpinionArr.length; i++) {
  		// 檢查「負責部門」是否有填寫
  		if (subAuditOpinionArr[i].auditOpinionUnits && subAuditOpinionArr[i].auditOpinionUnits.length > 0) return true;
  		// 檢查「建議事項」是否有填寫
  		if (subAuditOpinionArr[i].suggestion && subAuditOpinionArr[i].suggestion.length > 0) return true;
  		// 檢查「風險等級」是否有填寫
  		if (subAuditOpinionArr[i].riskLevel && subAuditOpinionArr[i].riskLevel.length > 0 && subAuditOpinionArr[i].riskLevel !== 'null') return true;
  		// 檢查「改善期限」是否有填寫
  		if (subAuditOpinionArr[i].imporveOption && subAuditOpinionArr[i].imporveOption.length > 0 && subAuditOpinionArr[i].imporveOption !== 'null') return true;
  	}
  	return false;
	}

	// 全表單驗證
	validateForm() {
  	// console.log('validateForm');
  	if (this.opinion === 'Y') {
  		this.hasValidatedOnce = true;
  		this.getSubAuditOpinionHavingValue();
  		this.getMainAuditOpinionHavingValue();
  		// console.log('this.mainAuditOpinionHavingValue', this.mainAuditOpinionHavingValue);
  	}
  	// const formRef = (this.opinion === 'Y') ? (this.$refs.formRef as any) : (this.$refs.templateFormRef as any);
  	const formRef = (this.$refs.formRef as any);
		// console.log('formRef', formRef);
  	return formRef.validate()
  		.then(() => true)
  		.catch(() =>	false);
	}

	// ------- form option event -------
	// 改善期限 radio change
	opinionImproveOptionChange($event, opinion) {
  	// console.log('$event', $event);
  	// console.log('opinion', opinion);
  	const chosendValue = $event.target.value;
  	if (chosendValue === 'null') { // 選擇'不選擇'
  		opinion.improveDeadline = null;
  		opinion.improveDate = null;
  		opinion.improve = false;
  		opinion.improveSituation = null;
  	}
  	if (chosendValue === 'deadLine') { // 選擇'日期'
  		const today = new Date();
  		// 帶入目前年月+3個月的25日
  		opinion.improveDeadline = new Date(today.setMonth(today.getMonth() + 3));
  		opinion.improveDeadline.setDate(25);
  		opinion.improve = false;
  		opinion.improveDate = null;
  	}
  	if (chosendValue === 'imporved') { // 選擇'已改善'
  		opinion.improveDeadline = null;
  		opinion.improve = true;
  	}
  	this.mainFormItemChange(opinion);
  	if (this.hasValidatedOnce) this.validateForm();
	}

	// 是否顯示新增／刪除查核人員按鈕
	checkIsShowMainModifyAuditorBtn(auditOpinion: AuditOpinionFrontEndDto): boolean {
		// console.log('auditOpinion', auditOpinion);
		// console.log('auditOpinion', auditOpinion.content);
		// console.log('是否顯示新增／刪除查核人員按鈕');
		if (this.currentRoleId !== 'ROLE_Auditor') return false; // 必須是查核人員
		// console.log('', this.checkIfInAuditor(this.draftAuditor, this.currentUserDomainId));
		if (!this.checkIfInAuditor(this.draftAuditor, this.currentUserDomainId)) return false; // 必需是查核內容裡的查核人員
		// 是查核意見裡的查核人員，且不能編輯的話，就不顯示
		if (!auditOpinion.canModifyFlag && this.checkIfInAuditor(auditOpinion.auditors, this.currentUserDomainId)) return false; // 必須可以編輯查核意見
		if (this.auditDraftContentStatus === '99' || this.auditDraftContentStatus == '90') return false; // 必需不為狀態99、90
		// 是否可以刪除主項的最後一個查核人員且為目前的登入者：判斷沒有任何子項
		if (this.checkIfInAuditor(auditOpinion.auditors, this.currentUserDomainId)
        && auditOpinion.auditors.length === 1
        && auditOpinion?.subAuditOpinions
        && auditOpinion?.subAuditOpinions.length > 0) {
  		return false;
  	}
  	return true;
	}

	// 修改isModify AuditOpinionFrontEndDto
	setIsModify(opinion, isModify: boolean) {
  	opinion.modify = isModify;
	}

	// 主項項目變更，isModify = true
	mainFormItemChange(opinion, callback?) {
  	// console.log('mainFormItemChange');
  	if (!opinion.modify) {
  		this.setIsModify(opinion, true);
  	}
  	if (callback) {
  		callback();
  	}
	}

	// 改善期限: 改善期限 > 查核期間的終了日
	disableDate(current) {
  	return current < this.improveDisabledDate;
	}

	// ------- get value -------
	// 取得子項必填選項是否有值
	getSubAuditOpinionHavingValue() {
  	this.subAuditOpinionHavingValue = this.checkSubAuditOpinionHavingValue(this.auditOpinionSync.subAuditOpinions);
	}

	// 取得主項必填選項是否有值
	getMainAuditOpinionHavingValue() {
  	this.mainAuditOpinionHavingValue = this.checkMainAuditOpinionHavingValue(this.auditOpinionSync);
	}

	// 將查核人員組成字串
	getAuditorsListString(auditorList, character?: string): string {
  	let title = '';
  	auditorList.forEach((auditor, index) => {
  		index === 0 ? title += auditor.value : title += `${character}${auditor.value}`;
  	});
  	return `${title}`;
	}

	// 判斷自己是否有在查核人員中
	checkIfInAuditor(auditorList, employeeDomainId): boolean {
  	return auditorList.find((e) => e.key === employeeDomainId) !== undefined;
	}

	// 調整主項查核人員
	modifyAuditor(isDelete: boolean, opinion: AuditOpinionFrontEndDto) {
  	// console.log('調整主項查核人員', `isDelete:${isDelete}`);
  	// 刪除並判斷是否為前端新增（直接刪除）
  	if (isDelete) {
  		(opinion.auditOpinionId.includes('add')) ? this.deleteAuditor(opinion, this.currentUserDomainId) : this.deleteAuditorFormServer(opinion, this.currentUserDomainId);
  	} else {
  		this.addAuditorFormServer(opinion, this.currentUser.employee.name, this.currentUserDomainId);
  	}
	}

	// 前端畫面新增查核人員
	addAuditor(opinion: AuditOpinionFrontEndDto, name: string, employeeDomainId: string) {
  	// console.log('新增');
  	opinion.auditors.push({
  		value: name,
  		key: employeeDomainId,
  	});
  	// opinion.canModifyFlag = true;
		this.$emit('updateAuditOpinion', {
			auditOpinionId: opinion.auditOpinionId,
			subRelMainId: opinion.subRelMainId,
		});
	}

	// 前端畫面刪除查核人員
	deleteAuditor(opinion: AuditOpinionFrontEndDto, employeeDomainId: string) {
  	const index = opinion.auditors.findIndex((auditor) => auditor.key === employeeDomainId);
  	opinion.auditors.splice(index, 1);
  	if (opinion.auditors.length === 0) {
  		this.removeOpinion({
  			opinion,
  			itemType: opinion.itemType,
  		});
  	} else {
			this.$emit('updateAuditOpinion', {
				auditOpinionId: opinion.auditOpinionId,
				subRelMainId: opinion.subRelMainId,
			});
		}
		// // 移除後不可再編輯
  	// opinion.canModifyFlag = false;
		// // 移除後不會有可以回覆問題或確認修改
		// opinion.redCheckStatusFlag = false;
		// opinion.redQaStatusFlag = false;
	}

	// 刪除查核意見
	removeOpinion({ opinion, itemType }: {opinion: AuditOpinionFrontEndDto; itemType: string}) {
  	const mainIndex = null;
  	let subIndex = null;
  	if (itemType === 'MAIN') {
  		// 刪除主項查核意見（由父層）
  		this.$emit('removeMainAuditOpinion', opinion.auditOpinionId);
  	}
  	if (itemType === 'SUB') {
  		// 刪除子項查核意見
  		subIndex = this.auditOpinionSync.subAuditOpinions.findIndex((subOpinion) => subOpinion.auditOpinionId === opinion.auditOpinionId);
  		this.auditOpinionSync.subAuditOpinions.splice(subIndex, 1);
  	}
	}

	// ------- button handler -------

	QAHandler(auditOpinion: AuditOpinionFrontEndDto) {
  	this.$emit('openOpinionQAModal', {
  		auditOpinion,
  	});
	}

	// 新增子項
	addSubAuditOpinion(auditSubOpinionArr: AuditOpinionFrontEndDto[]) {
  	const auditSubOpinion: AuditOpinionFrontEndDto = {
  		auditOpinionId: `add${uuid.v4()}`,
  		canModifyFlag: true,
  		canQaFlag: null,
  		redCheckStatusFlag: null,
  		redQaStatusFlag: null,
  		auditors: [{ key: this.currentUser.employee.domainId, value: this.currentUser.employee.name }], // 加上當前查核人員
  		itemType: 'SUB',
  		subRelMainId: this.auditOpinionSync.auditOpinionId,
  		seq: auditSubOpinionArr.length + 1,
  		content: null,
  		auditOpinionUnits: [],
  		suggestion: null,
  		opinionSummary: null,
  		riskLevel: 'null',
  		improveDeadline: null,
  		improve: null,
  		improveDate: null,
  		improveSituation: null,
  		subAuditOpinions: [],
  		modify: true,
  		imporveOption: 'null',
  	};
  	auditSubOpinionArr.push(auditSubOpinion);
	}

	/**
	 * 監聽
	 */
}
</script>

<style lang="scss" scoped>
	.label--large{
		font-size: 18px;
	}
  .content__label{
    font-size: 14px;
    line-height: 24px;
  }
  .content__label__required{
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    line-height: 1;
    font-family: SimSun,sans-serif;
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
  .btn--title{
    display: inline;
    vertical-align: middle;
    width: 33px;
    height: 33px;
		background-color: transparent;
    border: 0;
		padding: 0;
  }
	.block{
		border: 1px solid #d9d9d9;
    border-radius: 4px;
		padding: 4px 11px;
	}
	.block--scroll{
		max-height: 120px;
		overflow-y: auto;
	}

  .radio-item--inline{
    display: flex;
    // align-items: center;
  }

  .collapse__btn{
    width: 33px;
    height: 33px;
  }

  .main-opinion__action{
    width: 90px;
  }

  .sub-opinion{
    border: solid 1px #C7C7C7;
    // padding-top: 24px;

    .sub-opinion__action{
      width: 90px;
      border-left: solid 1px #C7C7C7;
      margin-left: 4px;
      margin-right: -5px;
      padding-right: 5px;
    }
  }

  .treeselect{
    ::v-deep .ant-select-selection{
      overflow-y: auto;
      max-height: 150px;
    }
  }

  ::v-deep{
    .ant-collapse-content > .ant-collapse-content-box{
      padding: 16px 10px;
    }
    .ant-collapse-item > .ant-collapse-header{
      line-height: 34px;
      font-weight: bold;
    }
    // .ant-input[disabled] {
    //   color: #000000;
    //   background-color: #EEEEEE;
    // }
  }
  .imporve-option{
    ::v-deep{
      .ant-radio-group{
        align-items: flex-start;
      }
    }
  }
</style>
