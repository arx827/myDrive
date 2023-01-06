<template>
  <div>
    <a-row type="flex" style="margin: 40px 0px 40px 20px;">
      <a-col flex="180px" style="text-align:center;">
        <div>
          <img class="" src="@/assets/images/icon-main-maintain-p1.svg" />
        </div>
        <div style="margin-top: 28px;"><h3>權限覆核</h3></div>
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
                <p>{{ employee.fullTime === "Y" ? "正職" : "約聘" }}</p>
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
                <a-checkbox-group
                  :default-value="rolesSelected"
                  :disabled="true"
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
                <a-button class="button btn__layout--white submitButton" @click="onReject()">退件</a-button>
                <a-button class="button btn__layout--green submitButton" @click="onApprove()"
                  >覆核確認</a-button
                >
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
import { EmployeeDto, QryCheckboxsDto } from "@fubonlife/edd-api-axios-sdk";

@Component({})
export default class PermissionApprovalPage extends Vue {
  employee: EmployeeDto;
  allRoles: Array<QryCheckboxsDto>;
  rolesSelected: Array<string>;
  accountStatus: string;
  accountStatusDescription: string;
  menuTitles: Array<string>;

  showForm: string = "form1";

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

  // 5.1.4 帳號查詢
  callApiForQuery() {
    this.$permissionApprovalApi
      .queryInPermissionApprovalUsingGET(this.form1.id)
      .then((resp) => {
        let dto = resp.data;
        let vo = dto.data;

        this.form1.accountId = vo.id;
        this.employee = vo.employee;
        this.allRoles = vo.allRoles;
        this.rolesSelected = [];
        this.accountStatusDescription = vo.statusDescription;
        this.menuTitles = vo.menuTitles;

        for (let role of this.allRoles) {
          if (role.checked) {
            this.rolesSelected.push(role.value);
          }
        }

        this.showForm = "form2";
      })
      .catch((err) => this.showErrorMessage(err));
  }

  /* ------------------------------------ form2 --------------------------------------- */

  // 5.1.5 覆核確認
  onApprove() {
    this.$permissionApprovalApi
      .approveInPermissionApprovalUsingPOST(this.form1.accountId)
      .then((resp) => {
        const h = this.$createElement;
        Modal.success({
          title: h(
            "p",
            {
              attrs: { style: "font-size: 20px" },
            },
            "權限覆核"
          ),
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

  // 5.1.6 退件
  onReject() {
    const h = this.$createElement;
    Modal.confirm({
      title: h(
        "p",
        {
          attrs: { style: "font-size: 20px" },
        },
        "權限覆核"
      ),
      content: h(
        "ul",
        {
          attrs: { class: "list-with-border" },
        },
        "是否要執行退件？"
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
      onOk: () => {
        this.callApiForReject();
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
  }

  callApiForReject() {
    this.$permissionApprovalApi
      .rejectInPermissionApprovalUsingPOST(this.form1.accountId)
      .then((resp) => {
        const h = this.$createElement;
        Modal.success({
          title: h(
            "p",
            {
              attrs: { style: "font-size: 20px" },
            },
            "權限覆核"
          ),
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
          "權限覆核"
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
      Modal.error({
        title: h(
          "p",
          {
            attrs: { style: "font-size: 20px" },
          },
          "權限覆核"
        ),
        content: h(
          "ul",
          {
            attrs: { class: "list-with-border" },
          },
          apiError.errors
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
.center {
  text-align: center;
}
</style>
