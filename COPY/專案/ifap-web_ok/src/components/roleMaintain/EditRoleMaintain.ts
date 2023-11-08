  import {
    Vue, Component, Watch, Prop,
  } from "vue-property-decorator";
  import AccordionArea from "@shared/AccordionArea.vue";
  import { Action } from 'vuex-class';
  import { keyVal } from 'src/plugins/global/enumData'
  import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

  @Component({
    components: { AccordionArea, FblDataGrid },
  })
  export default class EditRoleMaintain extends Vue {
    @Prop()
    public initData;

    @Action('setLoading') setLoading;

    statusArr: keyVal[] = this.$enum.userStatus;

    /* * * * * * * * * * * * *
      *       Ajax Start      *
      * * * * * * * * * * * * */

    // API: 新增角色
    async postApi_insertRoleMaintain() {
      this.setLoading(true);
      const roleEditInputDto = {
        roleId: this.initData.data.roleId,
        roleName: this.initData.data.roleName,
        status: this.initData.data.status,
      }
      return this.$roleApi.insertRoleMaintainUsingPOST(roleEditInputDto)
        .then(async (resp) => {
          // Success
          if (resp.data.apiStatus) {
            const getData = this.$global.deepCopyData(resp.data.data);
            this.$message.success(getData.message);
          } else {
            this.$message.error(resp.data.apiErrorMessage);
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.setLoading(false);
        })
    }

    // API: 更新角色
    postApi_updateRoleMaintain() {
      this.setLoading(true);
      const roleEditInputDto = {
        roleId: this.initData.data.roleId,
        roleName: this.initData.data.roleName,
        status: this.initData.data.status,
      }
      return this.$roleApi.updateRoleMaintainUsingPOST(roleEditInputDto)
        .then(async (resp) => {
          // Success
          if (resp.data.apiStatus) {
            const getData = this.$global.deepCopyData(resp.data.data);
            this.$message.success(getData.message);
          } else {
            this.$message.error(resp.data.apiErrorMessage);
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.setLoading(false);
        })
    }

    /**
      * Event
      */

    // 新增 / 編輯角色 送出
    async submitEditModal(): Promise<void> {
      return new Promise((resolve) => {
        // 檢核欄位
        (this.$refs.formRefEditModal as any).validate(async (valid) => {
          if (valid) {
            // 檢核通過
            console.log('送出 新增角色 表單', this.initData.data)
            if (this.initData.type == 'add') {
              await this.postApi_insertRoleMaintain();
            } else if (this.initData.type == 'edit') {
              await this.postApi_updateRoleMaintain();
            }
            resolve();
          }
        });
      })
    }

      /**
        * 監聽initData資料變動
        * @returns
        */
        @Watch("initData")
        onInitDataChanged(): void {
        }
  }
