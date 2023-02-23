<template>
  <div class="container main-container groupPermissionsAddAndEdit">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        新增/修改
      </h2>
    </div>
    <div class="formContent container-fluid">
      <a-form-model
        ref="groupPermissionsAddAndEditForm"
        class="gioFormGroup"
        :form="form"
        :layout="'vertical'"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        @validate="onValidate"
      >
        <a-row
          type="flex"
          justify="center"
          :gutter="[15, 0]"
        >
          <!-- 群組名稱 -->
          <a-col span="12">
            <a-form-model-item
              label="群組名稱"
              prop="authName"
            >
              <a-input
                v-model="form.authName"
                placeholder="e.g. 理賠行政人員"
                :auto-focus="validateFocus.includes('authName')"
              />
            </a-form-model-item>
          </a-col>
          <!-- 群組名稱 -->
          <a-col span="12">
            <a-form-model-item
              label="群組描述"
              prop="authDesc"
            >
              <a-input
                v-model="form.authDesc"
                placeholder="e.g. 處理理賠案件作業的人員"
                :auto-focus="validateFocus.includes('authDesc')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>

        <div class="groupAuthHeader">
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            使用功能 (功能名稱/主系統)
          </a-checkbox>
        </div>
        <a-checkbox-group
          v-model="form.menuId"
          class="w-100"
          @change="onCheckChange"
        >
          <a-row
            v-for="(item, index) in checkedList"
            :key="index"
            type="flex"
            align="middle"
            class="groupAuthList"
          >
            <a-checkbox
              class="d-flex align-items-center"
              :value="item.menuId"
            >
              <span class="title me-auto fw-bold">{{ item.menuName }}</span>
            </a-checkbox>
            <p class="title ms-auto">
              {{ item.parentId }}
            </p>
          </a-row>
        </a-checkbox-group>
      </a-form-model>

      <div class="confirm__button-group text-center">
        <button
          class="confirm__button confirm__button-cancel"
          @click="$router.go(-1)"
        >
          取消
        </button>
        <button
          class="confirm__button confirm__button-submit"
          @click="onSubmit()"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { MenuNameParentDto, AuthUpdate } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';

@Component({})
export default class GroupPermissionsAddAndEdit extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  checkedList: MenuNameParentDto[] = [];

  indeterminate = false;

  checkAll = false;

  isEdit = false;

  form: AuthUpdate = {
    authName: '',
    authDesc: '',
    menuId: [],
  };

  authId = '';

  rules: { [key: string]: ValidationRule[] } = {
    authName: [
      {
        required: true,
        message: '請輸入群組名稱',
        trigger: 'change',
      },
    ],
    authDesc: [
      {
        required: true,
        message: '請輸入群組描述',
        trigger: 'change',
      },
    ],
  };

  validateFocus: string[] = [];

  /**
 * Func
 */
  async getMenuList() {
    this.setLoading(true);
    await this.$menuApi.listFunctionsUsingPOST()
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // TEST:
          // console.log(getData);
          this.checkedList = getData;
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '錯誤訊息'),
            content: this.h('ul', {
              attrs: { class: 'list-with-border' },
            }, errorMsg.map((x) => this.h('li', x))),
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得權限資料
  async getAuthData(AuthId) {
    this.setLoading(true);
    await this.$maintenanceApi
      .oneAuthUsingPOST(AuthId)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          this.form.authName = getData.authName;
          this.form.authDesc = getData.authDesc;
          this.form.menuId = getData.menuList.filter((i) => i != null).map((i) => i.menuId);
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '錯誤訊息'),
            content: this.h('ul', {
              attrs: { class: 'list-with-border' },
            }, errorMsg.map((x) => this.h('li', x))),
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得 Query 並帶入資料
  async setEditParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      await this.getAuthData($query.authId);
      this.authId = $query.authId;
      this.isEdit = true;
      this.onCheckChange();
    }
  }

  /**
 * Event
 */
  // check Event
  onCheckChange() {
    this.indeterminate = !!this.form.menuId.length && this.form.menuId.length < this.checkedList.length;
    this.checkAll = this.form.menuId.length === this.checkedList.length;
  }

  // 全選按鈕 Event
  onCheckAllChange(e) {
    this.indeterminate = false;
    this.checkAll = e.target.checked;
    if (this.checkAll) {
      this.form.menuId = this.checkedList.map((i) => i.menuId);
    } else {
      this.form.menuId = [];
    }
  }

  // 驗證 callback
  onValidate(name, validate) {
    if (!validate) {
      this.validateFocus.push(name);
    }
  }

  // 確認新增 / 修改
  onSubmit() {
    this.validateFocus = [];
    (this as any).$validateForm('groupPermissionsAddAndEditForm')
      .then((res) => {
        if (this.form.menuId && this.form.menuId.length <= 0) {
          this.$infoNotification.error({
            Content: '無法完成新增項目。',
            apiError: ['至少要選擇一個功能'],
          });
        } else if (!this.isEdit) {
          // 新增群組權限
          this.setLoading(true);
          this.$maintenanceApi
            .newAuthUsingPUT(this.form)
            .then((resp) => {
              if (resp.data.status == 200) {
                // 成功訊息
                this.$router.push({ name: 'PersonnelGroupPermissions' }).then(() => {
                  this.$infoNotification.success({
                    Content: '已完成新增',
                  });
                });
              } else {
                this.$infoNotification.error({
                  Content: '無法完成新增項目，請再次嘗試。',
                  apiError: resp.data.apiError,
                });
              }
            })
            .catch((error) => {
              // API失敗
              // console.log(error.response);
              this.$infoNotification.error({
                Content: '無法完成新增項目，請再次嘗試。',
              });
            })
            .finally(() => {
              this.setLoading(false);
            });
        } else {
          // 修改群組權限
          this.setLoading(true);
          this.$maintenanceApi
            .updateAuthUsingPATCH(this.authId, this.form)
            .then((resp) => {
              if (resp.data.status == 200) {
                // 成功訊息
                this.$router.push({ name: 'PersonnelGroupPermissions' }).then(() => {
                  this.$infoNotification.success({
                    Content: '已完成修改',
                  });
                });
                // 清除 param
                this.$global.clearParam();
              } else {
                // 查找失敗訊息
                this.$infoNotification.error({
                  Content: '無法完成修改項目，請再次嘗試。',
                  apiError: resp.data.apiError,
                });
              }
            })
            .catch((error) => {
              // API失敗
              // console.log(error.response);
              this.$infoNotification.error({
                Content: '無法完成修改項目，請再次嘗試。',
              });
            })
            .finally(() => {
              this.setLoading(false);
            });
        }
      })
      .catch((err) => {
        // 驗證失敗 要捲到 輸入框
        const getErrorEle = this.$el.querySelector('.has-error');
        if (getErrorEle) {
          // 新語法試用 scrollIntoView
          getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
  }

  /**
 * Hooks
 */
  async created() {
    await this.getMenuList();
    await this.setEditParam();
  }
}
</script>

<style lang="scss" scoped>
.groupAuthHeader {
  background-color: $AllCHECKBOX-BG;
  // margin-top: 30px;
  padding: 8px 10px;
  color: $COLOR-BLACK;
}
.groupAuthList {
  padding: 10px;
}
</style>
