<template>
  <div tabindex="-1" @keyup.enter="agentSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="agentSearchForm"
          style="background-color: #eef6f8"
        >
          <a-row>
            <!-- 使用者部門 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('agentSP_userDepartment')"
                prop="dept"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="agentSearchForm.userDeptId"
                  :options="selectUserDeptOptions"
                  @change="onUserSeletUnit"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <!-- 使用者科別 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('agentSP_userDivision')"
                prop="divi"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="agentSearchForm.userDiviId"
                  :options="selectUserDiviOptionsOnSelect"
                  @change="onUserSeletUnit"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <!-- 使用者 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('global_user')"
                style="margin-bottom: 0px"
                prop="userAccount"
              >
                <a-select
                  mode="multiple"
                  v-model="agentSearchForm.userAccount"
                  :options="selectUserOptionsOnSelect"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="status" style="margin-bottom: 0px">
                <!-- <a-checkbox
                  :checked="agentSearchForm.isStaffNoAgentOnly"
                  @change="
                    agentSearchForm.isStaffNoAgentOnly =
                      !agentSearchForm.isStaffNoAgentOnly
                  "
                  style="margin-left: 90px"
                >
                  {{ $t("agentSP_listNoAgentStaff") }}
                </a-checkbox> -->
                <a style="margin-left: 90px" @click="staffNoAgentOnlySearch">
                  {{ $t("agentSP_listNoAgentStaff") }}
                </a>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <!-- 代理人部門 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('agentSP_agentDepartment')"
                prop="dept"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="agentSearchForm.agentDeptId"
                  :options="selectAgentDeptOptions"
                  @change="onAgentSeletUnit"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <!-- 代理人科別 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('agentF_agentDivision')"
                prop="divi"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="agentSearchForm.agentDiviId"
                  :options="selectAgentDiviOptionsOnSelect"
                  @change="onAgentSeletUnit"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <!-- 代理人 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('global_agent')"
                style="margin-bottom: 0px"
                prop="agentAccount"
              >
                <a-select
                  mode="multiple"
                  v-model="agentSearchForm.agentAccount"
                  :options="selectAgentOptionsOnSelect"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="status" style="margin-bottom: 0px">
                <!-- <a-checkbox
                  :checked="agentSearchForm.isAgentActivate"
                  @change="
                    agentSearchForm.isAgentActivate =
                      !agentSearchForm.isAgentActivate
                  "
                  style="margin-left: 90px"
                >
                  {{ $t("agentSP_listAgentActivated") }}
                </a-checkbox> -->
                <a style="margin-left: 90px" @click="isAgentActivateSearch">
                  {{ $t("agentSP_listAgentActivated") }}
                </a>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="agentSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetUserSearchForm">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportSearchResult">
                  {{ $t("global_export") }}
                </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <fbl-data-grid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          size="middle"
          @actionClick="onUserTableActionClick($event)"
          @tableChange="onPageChange($event)"
          style="padding-left: 24px; padding-right: 12px"
        >
          <template v-slot:activateAgentTemplate="slotProps">
            <a-checkbox
              :checked="slotProps.data.isAgentActivated == 'T'"
              @click="activateAgent(slotProps.data)"
            ></a-checkbox>
          </template>
        </fbl-data-grid>
      </a-col>
    </a-row>

    <a-modal
      v-model="formVisible"
      :title="$t('agentSP_agentMaintain')"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      :maskClosable="false"
      @ok="userModalSubmit"
      @cancel="userModalCancel"
    >
      <agent-form
        :initData="editingData"
        :selectAgentDeptOptions="selectUserDeptOptions"
        :selectAgentDiviOptions="selectUserDiviOptions"
        :deptToDiviMap="deptToDiviMap"
        :diviToDeptMap="diviToDeptMap"
        ref="agentForm"
        @reloadData="reload"
      >
      </agent-form>
    </a-modal>
  </div>
</template>

<script src="./AgentSettingPage.ts" lang="ts"></script>

