<template>
  <a-spin :spinning="loading">
    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
      :model="userChangeForm"
      ref="userChangeRules"
      :rules="userFormRules"
    >
      <!-- 使用者帳號 -->
      <a-form-model-item
        :label="$t('userMP_userAccount')"
        prop="userId"
        style="margin-bottom: 0px"
        :has-feedback="userValidateForm.account.feedback"
        :validateStatus="
          userValidateForm.account.feedback == true ? 'error' : 'success'
        "
        required
      >
        <a-popover
          placement="top"
          :destroyTooltipOnHide="true"
          :content="userValidateForm.account.msg"
          :trigger="userValidateForm.account.feedback == true ? 'hover' : ''"
          :visible="userValidateForm.account.hoverVisible"
          @visibleChange="
            userValidateForm.account.hoverVisible =
              !userValidateForm.account.hoverVisible
          "
        >
          <a-input
            type="text"
            v-model="userChangeForm.userId"
            :disabled="idEditing"
            @blur="autoFillIn"
            @change="
              userChangeForm.userId = userChangeForm.userId.substring(0, 10)
            "
          />
        </a-popover>
      </a-form-model-item>
      <!-- 使用者姓名 -->
      <a-form-model-item
        :label="$t('userMP_userHumanName')"
        prop="name"
        style="margin-bottom: 0px"
        :has-feedback="userValidateForm.name.feedback"
        :validateStatus="
          userValidateForm.name.feedback == true ? 'error' : 'success'
        "
        required
      >
        <a-popover
          placement="top"
          :destroyTooltipOnHide="true"
          :content="userValidateForm.name.msg"
          :trigger="userValidateForm.name.feedback == true ? 'hover' : ''"
          :visible="userValidateForm.name.hoverVisible"
          @visibleChange="
            userValidateForm.name.hoverVisible =
              !userValidateForm.name.hoverVisible
          "
        >
          <a-input
            type="text"
            v-model="userChangeForm.name"
            @change="
              userChangeForm.name = userChangeForm.name.substring(0, 100)
            "
          />
        </a-popover>
      </a-form-model-item>
      <!-- 員工編號 -->
      <a-form-model-item
        :label="$t('userMP_employeeSerialNumber')"
        prop="staffNo"
        style="margin-bottom: 0px"
        :has-feedback="userValidateForm.staffNo.feedback"
        :validateStatus="
          userValidateForm.staffNo.feedback == true ? 'error' : 'success'
        "
      >
        <a-popover
          placement="top"
          :destroyTooltipOnHide="true"
          :content="userValidateForm.staffNo.msg"
          :trigger="userValidateForm.staffNo.feedback == true ? 'hover' : ''"
          :visible="userValidateForm.staffNo.hoverVisible"
          @visibleChange="
            userValidateForm.staffNo.hoverVisible =
              !userValidateForm.staffNo.hoverVisible
          "
        >
          <a-input
            type="text"
            v-model="userChangeForm.staffNo"
            :disabled="true"
          />
        </a-popover>
      </a-form-model-item>
      <!-- 身分證字號 -->
      <a-form-model-item
        :label="$t('global_idNumber')"
        prop="idNo"
        style="margin-bottom: 0px"
        :has-feedback="userValidateForm.idNo.feedback"
        :validateStatus="
          userValidateForm.idNo.feedback == true ? 'error' : 'success'
        "
        required
      >
        <a-popover
          placement="top"
          :destroyTooltipOnHide="true"
          :content="userValidateForm.idNo.msg"
          :trigger="userValidateForm.idNo.feedback == true ? 'hover' : ''"
          :visible="userValidateForm.idNo.hoverVisible"
          @visibleChange="
            userValidateForm.idNo.hoverVisible =
              !userValidateForm.idNo.hoverVisible
          "
        >
          <a-input
            type="text"
            v-model="userChangeForm.idNo"
            @change="userChangeForm.idNo = userChangeForm.idNo.substring(0, 10)"
          />
        </a-popover>
      </a-form-model-item>
      <!-- 電子郵件 -->
      <a-form-model-item
        :label="$t('global_email')"
        prop="email"
        style="margin-bottom: 0px"
        :has-feedback="userValidateForm.email.feedback"
        :validateStatus="
          userValidateForm.email.feedback == true ? 'error' : 'success'
        "
        required
      >
        <a-popover
          placement="top"
          :destroyTooltipOnHide="true"
          :content="userValidateForm.email.msg"
          :trigger="userValidateForm.email.feedback == true ? 'hover' : ''"
          :visible="userValidateForm.email.hoverVisible"
          @visibleChange="
            userValidateForm.email.hoverVisible =
              !userValidateForm.email.hoverVisible
          "
        >
          <a-input
            type="text"
            v-model="userChangeForm.email"
            @change="
              userChangeForm.email = userChangeForm.email.substring(0, 80)
            "
          />
        </a-popover>
      </a-form-model-item>
      <!-- 分機號碼 -->
      <a-form-model-item
        :label="$t('userF_extensionNumber')"
        prop="extensionNo"
        style="margin-bottom: 0px"
        :has-feedback="userValidateForm.extensionNo.feedback"
        :validateStatus="
          userValidateForm.extensionNo.feedback == true ? 'error' : 'success'
        "
        required
      >
        <a-popover
          placement="top"
          :destroyTooltipOnHide="true"
          :content="userValidateForm.extensionNo.msg"
          :trigger="
            userValidateForm.extensionNo.feedback == true ? 'hover' : ''
          "
          :visible="userValidateForm.extensionNo.hoverVisible"
          @visibleChange="
            userValidateForm.extensionNo.hoverVisible =
              !userValidateForm.extensionNo.hoverVisible
          "
        >
          <a-input
            type="text"
            v-model="userChangeForm.extensionNo"
            @change="
              userChangeForm.extensionNo = userChangeForm.extensionNo.substring(
                0,
                10
              )
            "
          />
        </a-popover>
      </a-form-model-item>
      <!-- 單位代碼 -->
      <a-form-model-item
        :label="$t('userF_unitCode')"
        prop="unitId"
        style="margin-bottom: 0px"
        :has-feedback="userValidateForm.unitId.feedback"
        :validateStatus="
          userValidateForm.unitId.feedback == true ? 'error' : 'success'
        "
        required
      >
        <a-popover
          placement="top"
          :destroyTooltipOnHide="true"
          :content="userValidateForm.unitId.msg"
          :trigger="userValidateForm.unitId.feedback == true ? 'hover' : ''"
          :visible="userValidateForm.unitId.hoverVisible"
          @visibleChange="
            userValidateForm.unitId.hoverVisible =
              !userValidateForm.unitId.hoverVisible
          "
        >
          <a-input
            type="text"
            v-model="userChangeForm.unitId"
            @change="
              userChangeForm.unitId = userChangeForm.unitId.substring(0, 10)
            "
            :disabled="isEditMyself"
          />
          <!-- <a-select
            v-model="userChangeForm.unitId"
            :options="unitFormOption"
            :filter-option="filterOption"
            show-search
          >
          </a-select> -->
        </a-popover>
      </a-form-model-item>
      <!-- 部門 -->
      <a-form-model-item
        :label="$t('global_department')"
        style="margin-bottom: 0px"
      >
        <a-input disabled type="text" v-model="userChangeFormDepartmentPromt" />
      </a-form-model-item>
      <!-- 科別 -->
      <a-form-model-item
        :label="$t('global_division')"
        style="margin-bottom: 0px"
      >
        <a-input disabled type="text" v-model="userChangeFormDivisionPromt" />
      </a-form-model-item>
      <!-- 狀態 -->
      <a-form-model-item
        :label="$t('global_status')"
        style="margin-bottom: 0px"
        required
      >
        <a-select
          v-model="userChangeForm.status"
          :options="selectStatusOptions"
          @select="onStatusSelect"
          :disabled="!isEditing"
        >
        </a-select>
      </a-form-model-item>
      <!-- 員工類別 -->
      <a-form-model-item
        :label="$t('global_employee') + $t('global_class')"
        style="margin-bottom: 0px"
        required
      >
        <a-select
          v-model="userChangeForm.staffType"
          :options="selectStaffTypeOptions"
        >
        </a-select>
      </a-form-model-item>
      <!-- 到職日 -->
      <a-form-model-item
        :label="this.$t('loginPage_aetnaDate')"
        style="margin-bottom: 0px"
      >
        <date-picker
          v-model="defaultAetnaDate"
          type="date"
          :placeholder="$t('global_select')"
          :formatter="formatter"
          :range="false"
          style="width: 100%"
          :disabled="true"
        >
          <a-input
            slot="input"
            :value="defaultAetnaDate"
            :disabled="true"
          ></a-input>
        </date-picker>
      </a-form-model-item>
      <!-- 帳號停用日 -->
      <a-form-model-item
        :label="$t('loginPage_disableDate')"
        style="margin-bottom: 0px"
      >
        <date-picker
          v-model="userChangeForm.leavedDate"
          type="date"
          :formatter="formatter"
          :range="false"
          style="width: 100%"
          @change="onLeavedDateChange"
        >
          <a-input
            slot="input"
            :placeholder="$t('global_select')"
            v-model="defaultLeavedDate"
            read-only
          ></a-input>
        </date-picker>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>
<script src="./UserForm.ts" lang="ts"></script>
