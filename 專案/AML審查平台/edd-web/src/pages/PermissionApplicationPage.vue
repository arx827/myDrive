<template>
  <div>
    <a-row type="flex" style="margin: 40px 0px 40px 20px;">
      <a-col flex="180px" style="text-align:center;">
        <div><img class="" src="@/assets/images/icon-main-maintain.svg" /></div>
        <div style="margin-top: 28px;"><h3>權限維護</h3></div>
      </a-col>
      <a-col flex="auto">
        <a-form-model
          ref="form1"
          :layout="'vertical'"
          :model="form1"
          :rules="form1Rules"
          v-if="showForm == 'form1'"
        >
          <div style="margin-top: 32px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>帳號：</h3></a-col>
              <a-col :span="8">
                <a-form-model-item prop="id">
                  <a-input
                    type="text"
                    size="large"
                    :maxLength="10"
                    v-model="form1.id"
                    :allowClear="true"
                    placeholder="請輸入五碼帳號"
                    @keyup="onCaseChange(form1)"
                    @keyup.enter="onQuery"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="3">
                <a-button class="button btn__layout--green submitButton" @click="onQuery()">查詢</a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-model>
        <!-- form2 -------------------------------------------- -->
        <a-form-model
          ref="form2"
          :layout="'vertical'"
          v-if="showForm == 'form2'"
        >
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>帳號：</h3></a-col>
              <a-col :span="8">
                <p>{{ employee.domainId }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>姓名：</h3></a-col>
              <a-col :span="8">
                <p>{{ employee.name }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>身份：</h3></a-col>
              <a-col :span="8">
                <p>{{ employee.fullTimeDescription }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>職稱：</h3></a-col>
              <a-col :span="12">
                <p>{{ employee.jobTitle }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>部別：</h3></a-col>
              <a-col :span="8">
                <p>{{ employee.bossDepId + " " + employee.bossDepName }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>科別：</h3></a-col>
              <a-col :span="8">
                <p>{{ employee.depId + " " + employee.depName }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row type="flex" justify="start" :gutter="[24, 16]">
              <a-col :span="3" style="text-align:right;"><h3>角色：</h3></a-col>
              <a-col :span="15">
                <a-checkbox-group v-model="rolesSelected" :disabled="true">
                  <a-row type="flex" :gutter="[16, 8]">
                    <div v-for="role in allRoles" :key="role.value">
                      <a-col>
                        <a-checkbox :value="role.value">{{
                          role.label
                        }}</a-checkbox>
                      </a-col>
                    </div>
                  </a-row>
                </a-checkbox-group>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;">
                <h3>帳號狀態：</h3>
              </a-col>
              <a-col :span="8">
                <p>{{ accountStatusDescription }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row type="flex" justify="start" :gutter="[24, 16]">
              <a-col :span="3" style="text-align:right;"><h3>功能：</h3></a-col>
              <a-col :span="8">
                <div v-for="title in menuTitles" :key="title">
                  <p>{{ title }}</p>
                </div>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 40px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3"> </a-col>
              <a-col :span="21">
                <a-button class="button btn__layout--white submitButton" @click="onExit()">離開</a-button>
                <a-button class="button btn__layout--green submitButton" v-if="isModifyBtn" @click="onUpdate()">修改</a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-model>
        <!-- form3 -------------------------------------------- -->
        <a-form-model
          ref="form3"
          :layout="'vertical'"
          :model="form3"
          :rules="form3Rules"
          v-if="showForm == 'form3'"
        >
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>帳號：</h3></a-col>
              <a-col :span="8">
                <p>{{ form3.domainId }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>姓名：</h3></a-col>
              <a-col :span="12">
                <p v-if="!isModify">{{ form3.name }}</p>
                <a-form-model-item v-else prop="name">
                  <a-input
                    v-model="form3.name"
                    size="large"
                    :maxLength="10"
                    :allowClear="true"
                    @change="onChangeInputField"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>身份：</h3></a-col>
              <a-col :span="12">
                <p>{{ fullTimeDescription }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>職稱：</h3></a-col>
              <a-col :span="12">
                <p>{{ jobTitle }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>部別：</h3></a-col>
              <a-col :span="12">
                <p>{{ bossDepName }}</p>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"><h3>科別：</h3></a-col>
              <a-col :span="12">
                <p v-if="!isModify">{{ depName }}</p>
                <a-select
                  v-else
                  size="large"
                  :defaultValue="form3.depId"
                  :showSearch="true"
                  optionFilterProp="children"
                  @change="onChangeDepId"
                >
                  <a-select-option
                    v-for="qryOption in departmentList"
                    :key="qryOption.key"
                    :value="qryOption.key"
                    :disabled="qryOption.disabled"
                  >
                    {{ qryOption.value }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row type="flex" justify="start" :gutter="[24, 16]">
              <a-col :span="3" style="text-align:right;"><h3>角色：</h3></a-col>
              <a-col :span="15">
                <a-form-model-item>
                  <a-checkbox-group
                    v-model="rolesSelected"
                    @change="onChangeRole"
                    :disabled="isDisabled"
                  >
                    <a-row type="flex" :gutter="[16, 8]">
                      <div v-for="role in allRoles" :key="role.value">
                        <a-col>
                          <a-checkbox :value="role.value">{{
                            role.label
                          }}</a-checkbox>
                        </a-col>
                      </div>
                    </a-row>
                  </a-checkbox-group>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3" style="text-align:right;"
                ><h3>帳號狀態：</h3></a-col
              >
              <a-col :span="12">
                <a-form-model-item>
                  <a-select
                    size="large"
                    :defaultValue="form3.status"
                    @change="onChangeAccountStatus"
                  >
                    <a-select-option
                      v-for="qryOption in accountStateList"
                      :key="qryOption.key"
                      :value="qryOption.key"
                      :disabled="qryOption.disabled"
                    >
                      {{ qryOption.value }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 16px;">
            <a-row type="flex" justify="start" :gutter="[24, 16]">
              <a-col :span="3" style="text-align:right;"><h3>功能：</h3></a-col>
              <a-col :span="8">
                <p v-if="isDisabled"></p>
                <div v-for="title in menuTitles" :key="title" v-else>
                  <p>{{ title }}</p>
                </div>
              </a-col>
            </a-row>
          </div>
          <div style="margin-top: 40px;">
            <a-row
              type="flex"
              justify="start"
              align="middle"
              :gutter="[24, 16]"
            >
              <a-col :span="3"></a-col>
              <a-col :span="21">
                <a-button class="button btn__layout--white submitButton" @click="onExit()">離開</a-button>
                <a-button class="button btn__layout--green submitButton" @click="onApply()">送覆核</a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-model>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import {
  EmployeeDto,
  QryCheckboxsDto,
  PermissionPageDto,
  QryOptionsDto,
} from "@fubonlife/edd-api-axios-sdk";

@Component({})
export default class PermissionApplication extends Vue {
  employee: EmployeeDto;
  allRoles: Array<QryCheckboxsDto> = [];
  rolesSelected: Array<string> = [];
  initRolesSelected: Array<string> = [];
  accountStatus: string;
  accountStatusDescription: string;
  menuTitles: Array<string> = [];
  initMenuTitles: Array<string> = [];

  showForm: string = "form1";
  isModify: boolean = false; // 顯示forms時，能否修改姓名&科別的欄位
  isDisabled: boolean = false; // 帳號狀態修改後，是否清空角色&功能選單
  isModifyBtn: boolean = true; //帳號狀態如果在覆核中，則不顯示修改按鈕

  /* ------------------------------------ form1 --------------------------------------- */

  form1 = {
    id: "",
    accountId: "",
  };

  form1Rules: { [key: string]: ValidationRule[] } = {
    id: [
      { required: true, message: "請輸入帳號", trigger: "change" },
      { min: 5, message: "帳號至少要五碼", trigger: "blur" },
      { pattern: /^[A-Za-z0-9]*$/, message: "請輸入半形英文或數字", trigger: "change" },
    ],
  };

  created() {
    // 科別清單(form3)
    this.$permissionApplicationApi
      .getDepartmentsInPermissionApplicationUsingGET()
      .then((resp) => {
        let dto = resp.data;
        this.departmentList = dto.data;
      })
      .catch((err) => this.showErrorMessage(err));

    // 帳號狀態(form3)
    this.$permissionApplicationApi
      .getAccountStatusInPermissionApplicationUsingGET()
      .then((resp) => {
        let dto = resp.data;
        this.accountStateList = dto.data;
      })
      .catch((err) => this.showErrorMessage(err));
  }

  onQuery() {
    (this.$refs.form1 as any).validate((valid) => {
      if (valid) {
        this.callApiForQuery();
      } else {
        return false;
      }
    });
  }

  onCaseChange(form1) {
    form1.id = form1.id.toUpperCase();
  }

  // 5.1.1 帳號查詢
  callApiForQuery() {
    this.$permissionApplicationApi
      .queryInPermissionApplicationUsingGET(this.form1.id)
      .then((resp) => {
        let dto = resp.data,
          vo = dto.data;

        this.form1.accountId = vo.id;

        this.employee = vo.employee;

        this.initRolesSelected = [];
        this.allRoles = vo.allRoles ? vo.allRoles : [];

        for (let role of this.allRoles) {
          if (role.checked) {
            this.initRolesSelected.push(role.value);
          }
        }
        this.rolesSelected = this.initRolesSelected;

        vo.status === "X" ? this.isModifyBtn = false : this.isModifyBtn = true ;
        this.accountStatusDescription = vo.statusDescription;

        this.initMenuTitles = vo.menuTitles;
        this.menuTitles = this.initMenuTitles;

        this.showForm = "form2";
      })
      .catch((err) => {
        let xhrResponse = err.response,
          apiError = xhrResponse.data;
        const h = this.$createElement;
        if (apiError.apiErrorCode) {
          Modal.confirm({
            title: h("p", { attrs: { style: "font-size: 20px" } }, "權限設定"),
            content: h(
              "ul",
              {
                attrs: { class: "list-with-border" },
              },
              "確認新增約聘人員？"
            ),
            okButtonProps: {
              style:
                "background: #13C2C2; color: white; font-size: 16px; width: 150px; height: 40px;",
            },
            okText: "是",
            cancelButtonProps: {
              style:
                "background: white; color: #13C2C2; border-color: #13C2C2 ; font-size: 16px; width: 150px; height: 40px;",
            },
            cancelText: "不是",
            onCancel: () => this.showErrorMessage(err),
            onOk: () => {
              // === form1
              this.form1.accountId = this.form1.id;

              // === form3
              this.form3.domainId = this.form1.id;

              this.employee = {} ;

              this.form3.name = "";

              this.form3.fullTime = "N";
              this.fullTimeDescription = "約聘人員";

              this.jobTitle = "一般職員";

              this.bossDepName = "";

              this.form3.depId = "";

              this.rolesSelected = [];
              this.allRoles = [];

              this.form3.status = "1"; // 帳號狀態: 啟用

              this.menuTitles = [];

              this.showForm = "form3";
              this.isModify = true;
              this.isDisabled = false;
            },
            icon: () =>
              h("a-icon", {
                props: {
                  type: "question-circle",
                  theme: "filled",
                },
                style: { fontSize: "30px" },
              }),
          });
        } else {
          this.showErrorMessage(err);
        }
      });
  }

  /* ------------------------------------ form2 --------------------------------------- */

  // 5.1.2 修改
  onUpdate() {
    this.$permissionApplicationApi
      .updateInPermissionApplicationUsingGET(this.form1.accountId)
      .then((resp) => {
        let dto = resp.data,
          vo = dto.data;

        this.form3.domainId = this.employee.domainId;
        this.form3.name = this.employee.name;

        this.form3.fullTime = this.employee.fullTime;
        this.fullTimeDescription = this.employee.fullTimeDescription;

        this.jobTitle = this.employee.jobTitle;

        this.bossDepName =
          this.employee.bossDepId + " " + this.employee.bossDepName;

        this.form3.depId = this.employee.depId;
        this.depName = this.employee.depId + " " + this.employee.depName;

        this.form3.status = vo.status;
        this.onChangeAccountStatus(vo.status); // 帳號狀態修改後，變更角色、功能的欄位內容

        this.showForm = "form3";
        this.isModify = this.employee.fullTime === "N";
      })
      .catch((err) => this.showErrorMessage(err));
  }

  /* ------------------------------------ form3 --------------------------------------- */

  form3: PermissionPageDto = {};
  departmentList: Array<QryOptionsDto> = [];
  accountStateList: Array<QryOptionsDto> = [];
  rolesByMyBossDepartment: Array<QryCheckboxsDto> = [];

  fullTimeDescription: string;
  jobTitle: string;
  bossDepName: string;
  depName: string;

  form3Rules: { [key: string]: ValidationRule[] } = {
    domainId: [
      { required: true, message: "請輸入帳號", trigger: "change" },
      { pattern: /^[A-Za-z0-9]*$/, message: "請輸入半形英文或數字", trigger: "change" }
      ],
    name: [
      { required: true, message: "請輸入姓名", trigger: "change" },
      { validator: this.NameRule, trigger: "change" }
    ],
    depId: [{ required: true, message: "請輸入科別", trigger: "change" }],
    status: [{ required: true, message: "請輸入帳號狀態", trigger: "change" }],
  };

  NameRule(rule, value, callback) {
    if (this.fullWidthAcd(value)) {
      callback(new Error("請輸入半形文字"));
    } else {
      callback();
    }
  }
  // 全形偵測
  fullWidthAcd(str) {
    let checkVal = false;
    for (let i = 0, len = str.length; i < len; i++) {
      let strCode = str.charCodeAt(i);
      if (strCode > 65248 || strCode == 12288) {
        checkVal = true; // str 有全形回報
        break;
      }
    }
    return checkVal;
  }

  // 表格欄位修改
  onChangeInputField(changedField) {
    this.form3 = { ...this.form3, ...changedField };
  }

  // 科別修改後，取得部別名稱及其所屬角色清單
  onChangeDepId(depId) {
    this.form3.depId = depId;

    this.$permissionApplicationApi
      .queryBossDepNameInPermissionApplicationUsingGET(depId)
      .then((resp) => {
        let dto = resp.data;
        let vo = dto.data;

        this.bossDepName =
          vo.employee.bossDepId + " " + vo.employee.bossDepName;
        this.allRoles = vo.allRoles;

        // 修改科別後，若是對應新的部門，則要清空已勾選的角色及功能清單
        if (vo.employee.bossDepId !== this.employee.bossDepId) {
          this.rolesSelected = [];
          this.menuTitles = [];
        } else {
          this.rolesSelected = this.initRolesSelected;
          this.menuTitles = this.initMenuTitles;
        }
      })
      .catch((err) => this.showErrorMessage(err));
  }

  // 角色修改後，變更功能選單列表的內容
  onChangeRole(rolesSelected) {
    this.form3.roleId = rolesSelected;

    if (rolesSelected.length == 0) {
      this.menuTitles = [];
    } else {
      this.$permissionApplicationApi
        .queryRoleMenusInPermissionApplicationUsingPOST(this.form3)
        .then((resp) => {
          let dto = resp.data;
          this.menuTitles = dto.data;
        })
        .catch((err) => {
          this.rolesSelected = [];
          this.menuTitles = [];
          this.form3.roleId = [];
          this.showErrorMessage(err);
        });
    }
  }

  // 帳號狀態修改後，是否清空角色&功能選單
  onChangeAccountStatus(status) {
    this.form3.status = status;
    this.isDisabled = status === "0";
  }

  // 5.1.3 送覆核
  onApply() {
    (this.$refs.form3 as any).validate((valid) => {
      if (valid) {
        if (this.form3.status === "0") {
          const h = this.$createElement;
          Modal.confirm({
            title: `提醒`,
            content: "確認停用人員權限？",
            icon: () => h("a-icon", {
              props: {
                type: "exclamation-circle",
                theme: "filled",
              },
            }),
            class: "modal__confirm",
            okText: "確定",
            okType: "okButton",
            cancelText: "取消",
            onOk: () => {
              this.callApiForApply();
            },
            onCancel: () => {},
          });
        } else {
          this.callApiForApply();
        }
      } else {
        return false;
      }
    });
  }

  callApiForApply() {
    this.$permissionApplicationApi
      .applyInPermissionApplicationUsingPOST(this.form1.accountId, this.form3)
      .then((resp) => {
        const h = this.$createElement;
        Modal.success({
          title: h("p", { attrs: { style: "font-size: 20px" } }, "權限設定"),
          content: h(
            "ul",
            {
              attrs: { class: "list-with-border" },
            },
            resp.data.message
          ),
          okType: "green",
          okText: "確定",
          onOk: () => {
            this.onExit();
          },
          icon: () =>
            h("a-icon", {
              props: {
                type: "check-circle",
                theme: "filled",
              },
              style: { fontSize: "30px" },
            }),
        });
      })
      .catch((err) => this.showErrorMessage(err));
  }

  /* ---------------------------------- 離開 ------------------------------------ */

  onExit() {
    this.form1.id = "";
    this.form1.accountId = "";
    this.showForm = "form1";
  }

  showErrorMessage(err) {
    let xhrResponse = err.response;
    let apiError = xhrResponse === undefined ? err.data : xhrResponse.data;
    const h = this.$createElement;

    if (apiError.message.length < 20) {
      Modal.error({
        title: h(
          "p",
          {
            attrs: { style: "font-size: 20px" },
          },
          "權限設定"
        ),
        content: h(
          "ul",
          {
            attrs: { class: "list-with-border" },
          },
          apiError.message
        ),
        okType: "green",
        okText: "確定",
        icon: () =>
          h("a-icon", {
            props: {
              type: "close-circle",
              theme: "filled",
            },
            style: { fontSize: "30px" },
          }),
      });
    } else {

      let errorMsgs: string[] = [];

      apiError.errors.forEach( e => {
        if (e.includes(": ")) {
          errorMsgs.push(e.split(": ")[1]);
        } else {
          errorMsgs.push(e);
        }
      });
      
      Modal.error({
        title: h(
          "p",
          {
            attrs: { style: "font-size: 20px" },
          },
          "權限設定"
        ),
        content: h(
          "ul",
          {
            attrs: { class: "list-with-border" },
          },
          errorMsgs
        ),
        okType: "green",
        okText: "確定",
        icon: () =>
          h("a-icon", {
            props: {
              type: "close-circle",
              theme: "filled",
            },
            style: { fontSize: "30px" },
          }),
      });
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 16px;
  margin-bottom: 0px;
}
h3 {
  font-size: 18px;
  margin-bottom: 0px;
  margin-top: 0px;
}
.ant-form-item {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
