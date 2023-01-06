<template>
  <div style="background: #f0f2f5">
    <div class="card--title">
      <div class="card__form--title">
        <a-form-model
          ref="ruleForm"
          :form="form"
          :layout="'vertical'"
          :model="form"
          :rules="rules"
          :hideRequiredMark="true"
        >
          <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
            <!-- 作業別 -->
            <a-col :md="12" :lg="8" :xxl="6">
              <a-form-model-item prop="operType">
                <span slot="label">
                  作業別
                  <span class="mark-required">*</span>
                </span>
                <a-select
                  class="select"
                  size="large"
                  v-model="form.operType"
                  allow-clear
                  placeholder="請選擇"
                >
                  <a-select-option
                    v-for="item in operTypeOpts"
                    :key="item.key"
                  >
                    {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 來源 -->
            <a-col :md="12" :lg="8" :xxl="6">
              <a-form-model-item prop="renew" label="來源">
                <a-select
                  size="large"
                  v-model="form.renew"
                  allow-clear
                  placeholder="請選擇"
                >
                  <a-select-option v-for="item in renewOpts" :key="item.key">
                    {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 案件類型 -->
            <a-col :md="12" :lg="8" :xxl="6">
              <a-form-model-item prop="custType" label="案件類型">
                <a-select
                  class="select"
                  size="large"
                  v-model="form.custType"
                  allow-clear
                  placeholder="請選擇"
                >
                  <a-select-option v-for="item in custTypeOpts" :key="item.key">
                    {{ (item.key == '*')? `${item.value}` : `${item.key} ${item.value}` }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
            <a-col :xs="24" :md="24" lg="24" :xxl="18">
              <review-fields
                ref="reviewFields"
                :isRequired="[true, false, false]"
                :isDisabled="[true, false, false]"
                @submitData="getReviewData"
                :xsSpan="24"
                :mdSpan="12"
                :lgSpan="8"
                :xxlSpan="8"
              >
            </review-fields>
            </a-col>
          </a-row>
        </a-form-model>
        <div align="center">
          <a-button
            class="button btn--primary btn__layout--green searchButton" @click="onSearch()"
            >查詢</a-button
          >
        </div>
      </div>
    </div>

    <!--查詢列表區-->
    <div class="card--title" style="margin-top: 10.5px" v-if="isResultShow">
      <div class="title">查詢結果</div>
      <!-- <a-divider type="horizontal" /> -->
      <div class="fbl-table">
        <FblDataGrid
          v-if="isResultShow"
          ref="dataGridRef"
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :emptyData="isEmptyData"
          :scroll="{ x: 'max-content' }"
          @tableChange="onMasterPageChange($event)"
        >
          <!-- AML審查原因欄位 -->
          <template v-slot:amlReason="slotProps">
            <a-tooltip placement="top" class="amlReason" overlayClassName="amlReasonTooltip" :arrowPointAtCenter="true" v-if="slotProps.data.amlreviewComment[0]">
              <template slot="title">
                <span>{{slotProps.data.amlreviewComment[0].memoDesc}}</span>
              </template>
              <div>{{ellipsis(slotProps.data.amlreviewComment[0].memoDesc)}}</div>
            </a-tooltip>
          </template>
          <!-- 覆核 -->
          <template v-slot:verify="slotProps">
            <div v-if="!slotProps.data.verify" @click.prevent>
              <a-select
                :placeholder="'請選擇'"
                style="width: 100%"
                mode="default"
                :dropdownMatchSelectWidth="false"
                :allowClear="true"
                :getPopupContainer="trigger => trigger.parentNode"
                v-model="slotProps.data.verify"
                @change="optionSelect(slotProps.data.rowkey, $event)"
              >
                <a-select-option
                  v-for="option in options"
                  :key="option.key"
                  :value="option.key"
                >
                  {{ option.value }}
                </a-select-option>
              </a-select>
            </div>
            <div v-else>
              <span>
                {{ options.filter((item) => item.key == slotProps.data.verify)[0].value }}
              </span>
            </div>
          </template>
        </FblDataGrid>
      </div>
    </div>

    <a-modal v-model="modalVisible" :footer="null" :closable="false" :centered="true" :maskClosable="false" class="reject-modal"> 
      <reject-form
        :loading="getLoading"
        :index="index"
        :title="confirmTitle"
        :isReject="isReject"
        @formCancel="onFormCancel"
        @formSubmit="onFormSubmit"
      >
      </reject-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import RejectForm from "@/forms/RejectForm.vue";
import {
  FblColumnType,
  FblOptionEvent,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import CollapseArea from "@/components/shared/CollapseArea.vue";
import ReviewFields from "@/components/shared/ReviewFields.vue";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { filter } from "vue/types/umd";
import Global from "@/plugins/global";

import { QryOptionsDto, AddAmlReviewResultVO } from "@fubonlife/edd-api-axios-sdk";

@Component({
  components: { CollapseArea, ReviewFields, FblDataGrid, RejectForm }
})
export default class Monitor extends Vue {
  locale: locale = locale;
  public isResultShow: boolean = false;
  public isEmptyData: boolean = false;
  public isReviewValidate: boolean = false;
  public isFormValidate: boolean = false;
  public modalVisible: boolean = false;
  public index: number = 0;

  public collapseAreaOption: boolean = true;

  h = this.$createElement;
  @Getter getLoading;
  @Action public setLoading: (payload: boolean) => void;


/**
 * 下拉選項
 */
  private operTypeOpts: Array<QryOptionsDto> = [];          // 作業別
  private renewOpts: Array<QryOptionsDto> = [];             // 來源
  private custTypeOpts: Array<QryOptionsDto> = [];          // 案件類型
  // 覆核選項list
  options:{ key: string; value: string }[] = [
    { key: "confirm", value: '確認' },
    { key: "reject", value: '駁回' },
  ];

  // 覆核確認彈窗的標題
  public confirmTitle: string = '';
  // 是否為駁回確認
  public isReject: boolean = false;

  // 覆核選項list
  public verifyOptionList: {[key: string]: string} = {}

  public grid: FblPDataGridHolder<AddAmlReviewResultVO & { verify?: string, rowkey?: number}> = {
    rowKey: "rowkey",
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 1,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30", "40"],
      showQuickJumper: true,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "operType",
        title: '作業別',
        fixed: "left",
        customRender: (data) => {
          return data.operType.description;
        },
        sorter: (a, b) => a.operType.description.localeCompare(b.operType.description),
      },
      {
        type: FblColumnType.PLAIN,
        property: "renew",
        title: '來源',
        fixed: "left",
        sorter: (a, b) => a.renew.localeCompare(b.renew),
      },
      {
        type: FblColumnType.PLAIN,
        property: "custType",
        title: '案件類型',
        fixed: "left",
        customRender: (data) => {
          if(data.custType) {
            return data.custType.map(x => this.$createElement('div', `${x.description}`));
          }else{
            return '';
          }
        },
        sorter: (a, b) => a.custType[0].description.localeCompare(b.custType[0].description),
      },
      {
        type: FblColumnType.TEMPLATE,
        template: "amlReason",
        property: "amlreviewComment",
        title: 'AML審查原因',
        fixed: "left",
        sorter: (a, b) => {
          let amlCommentA = (a.amlreviewComment[0]) ? a.amlreviewComment[0].memoDesc : '';
          let amlCommentB = (b.amlreviewComment[0]) ? b.amlreviewComment[0].memoDesc : '';
          return amlCommentA.localeCompare(amlCommentB);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: '系統別',
        sorter: (a, b) => a.sysType.localeCompare(b.sysType),
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: '保單號碼',
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}`;
        },
        sorter: (a, b) => a.policyNo - b.policyNo,
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseNo",
        title: '交易案號',
        sorter: (a, b) => a.caseNo - b.caseNo,
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: '保單角色',
        customRender: (data) => {
          if(data.clients.length > 0 && data.clients[0].applType) {
            return data.clients[0].applType.map(x => this.$createElement('div', `${x.description}`));
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          let amlCommentA = (a.clients.length > 0) ? a.clients[0].applType[0].description : '';
          let amlCommentB = (b.clients.length > 0) ? b.clients[0].applType[0].description : '';
          return amlCommentA.localeCompare(amlCommentB);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: '客戶ID',
        customRender: (data) => {
          return data.clients.length > 1 ? data.clients[0].custId + '等' : data.clients[0].custId;
        },
        sorter: (a, b) => {
          let amlCommentA = (a.clients.length > 0) ? a.clients[0].custId : '';
          let amlCommentB = (b.clients.length > 0) ? b.clients[0].custId : '';
          return amlCommentA.localeCompare(amlCommentB);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "clients",
        title: '客戶姓名',
        customRender: (data) => {
          if(data.clients.length > 0 && data.clients[0].custName) {
            return data.clients[0].custName;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          let amlCommentA = (a.clients.length > 0) ? a.clients[0].custName : '';
          let amlCommentB = (b.clients.length > 0) ? b.clients[0].custName : '';
          return amlCommentA.localeCompare(amlCommentB);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: '審查部門',
        customRender: (data) => {
          if(data.cont && data.cont.bossDepName){
            return data.cont.bossDepName;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          if(a.cont && a.cont.bossDepName){
            return a.cont.bossDepName.localeCompare(b.cont.bossDepName);
          }else{
            return false;
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: '審查科別',
        formatter: (data) => {
          if(data.cont && data.cont.depName){
            return data.cont.depName;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          if(a.cont && a.cont.depName){
            return a.cont.depName.localeCompare(b.cont.depName);
          }else{
            return false;
          }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "cont",
        title: '審查人員',
        formatter: (data) => {
          if(data.cont && data.cont.name){
            return data.cont.name;
          }else{
            return '';
          }
        },
        sorter: (a, b) => {
          if(a.cont && a.cont.name){
            return a.cont.name.localeCompare(b.cont.name);
          }else{
            return false;
          }
        }
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "verify",
        template: "verify",
        title: '覆核',
        align: "center",
        width: 110,
        fixed: "right",
        // sorter: (a, b) => a.verify.localeCompare(b.verify),
      },
    ],
  };

  form = {
    operType: undefined,
    custType: undefined,
    renew: undefined,
    contDp: undefined,
    contUt: undefined,
    contId: undefined,
  };
  
  rules: { [key: string]: ValidationRule[] } = {
    operType: [
      { required: true, message: "請選擇作業別", trigger: "change" },
    ],
  };

  // 驗證審查元件
  validateReviewFields() {
    (this.$refs.reviewFields as any)
      .validateForm()
      .then((valid) => {
        this.isReviewValidate = valid;
      })
      .catch((valid) => {
        this.isReviewValidate = valid;
      });
  }
  // 覆核下拉式選單觸發覆核確認OR覆核駁回之對話視窗顯示
  optionSelect(rowId: number, option: string) {
    const me = this.$user.getMe().employee;

    // 該筆資料內容
    const amlData = this.grid.data.filter((item,index) => {
      return item.rowkey == rowId;
    })[0];

    // 比對登入者與審查人員 不得為同一人
    if (me.domainId != amlData.cont.domainId) {
      
      this.modalVisible = true;
      this.index = rowId;

      switch (option){
        case 'confirm':
          this.confirmTitle = '覆核確認';
          this.isReject = false;
          break
        case 'reject':
          this.confirmTitle = '覆核駁回';
          this.isReject = true;
          break
      }
    } else {
      Modal.error({
        title: `提醒`,
        content: `新增AML案件人員不能跟覆核人員同一人。`,
        okType: 'green',
        okText: '確定',
        icon: () => 
          this.h("a-icon", {
            props: {
              type: "close-circle",
              theme: "filled",
            },
          }),
        onOk: () => {
          this.grid.data.map((item,index) => {
            if(item.rowkey == rowId) {
              item.verify = undefined;
            }
          });
        }
      });
    }
  }

/**
 * Func
 */
  // 取得下拉
  getSelectOpts() {
    this.setLoading(true);
    // const $me:any = this.$user.getMe().employee;
    this.$addAmlPendingApi.getSelectOptsInAddAMLPendingReviewUsingPOST()
    .then(resp => {
      if(resp.data.success === true) {
        let getData = resp.data.data;
        // 代入下拉資料
        this.operTypeOpts = getData.operTypeOpts;
        this.renewOpts = getData.renewOpts;
        this.custTypeOpts = getData.custTypeOpts;

        this.init();
      }
    })
    .finally(() => {
      this.setLoading(false);
    });
  }
  // 選項預設值初始化
  init () {
    this.form = {
      operType: undefined,
      custType: undefined,
      renew: undefined,
      contDp: undefined,
      contUt: undefined,
      contId: undefined,
    }

    //------------ 預設 ---------------
    this.form.renew = 'N';
    this.form.custType = '1';
  }
  // 轉換submit
  getSubmitData(data) {
    let submit = JSON.parse(JSON.stringify(data));
    // 案件類型 處理
    if(submit.custType){
      let string = submit.custType;
      submit.custType = [];
      submit.custType[0] = string;
    }
    // 空值的資料 不需要送參
    Object.keys(submit).map((item) => {
      switch(true){
        case submit[item] == '':
        case submit[item] == null:
        case submit[item].length <= 0:
          delete submit[item];
        break;
      }
    });
    return submit;
  }
  // 查詢結果
  filterResult() {
    if (this.isReviewValidate && this.isFormValidate) {
      this.isEmptyData = false;
      this.setLoading(true);
      let submit = this.getSubmitData(this.form);
      this.$addAmlPendingApi.queryConditionInAddAMLPendingReviewUsingPOST({
        "filter": submit,
        "pageIndex": this.grid.pagination.current - 1,
        "pageSize": this.grid.pagination.pageSize
      })
      .then(resp => {
        if(resp.data.success === true) {
          let getData = resp.data.data;
          if((getData.content as any).length > 0){
            const data = getData.content;
            // 加序號、覆核控制項
            data.map((item,index) => {
              if(item.verify !== 'confirm' && item.verify !== 'reject') {
                item.verify = undefined;
              }
              return Object.assign(item, {rowkey: index + 1})
            })
            this.grid.data = data;
            this.grid.pagination.total = parseInt(getData.totalElements);
          }else{
            this.isEmptyData = true;
          }
        }
      })
      .finally(() => {
        this.setLoading(false);
        this.isResultShow = true;
      })
    }
  }
  // AML審查原因 省略號
  ellipsis(str) {
    return ((str as string).length > 6) ? str.slice(0, 6) + '...' : str;
  }



/**
 * Event
 */
  // 審查部門、科別、人員 (接收子層emit)
  getReviewData(value) {
    this.form.contDp = value.form.contDp;
    this.form.contUt = value.form.contUt;
    this.form.contId = value.form.contId;
  }
  onSearch() {
    this.validateReviewFields();
    // 驗證此page的欄位
    (this.$refs.ruleForm as any)
      .validate()
      .then((valid) => {
        this.isFormValidate = valid;
        this.isResultShow = false;
        this.grid.pagination.current = 1;
        this.filterResult();
      })
      .catch((valid) => {
        this.isFormValidate = valid;
      });
  }
  // table 事件
  onMasterPageChange(e){
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if(p.current !== e.current || p.pageSize !== e.pageSize) {
      p.current = e.current;
      // 切換顯示筆數時，跳回第一頁
      if(p.pageSize !== e.pageSize) {
        p.current = 1;
      }
      p.pageSize = e.pageSize;
      this.grid.pagination = p;
      this.filterResult();
    }
  }
  // 覆核確定
  onFormSubmit(val) {
    const rowId = this.index;

    // 該筆資料內容
    const amlData = this.grid.data.filter((item,index) => {
      return item.rowkey == rowId;
    })[0];

    if(val.isReject) {
      // 駁回覆核
      this.setLoading(true);
      this.$addAmlPendingApi.updateResultStatInAddAMLPendingRevieweUsingPOST({
        "efileNo": amlData.efileNo,
        "memoDesc": val.reason,
        "state": "N"
      })
      .then(resp => {
        Modal.success({
          title: `${amlData.efileNo}：駁回成功`,
          okType: 'green',
          okText: '確定',
          icon: () =>
            this.h("a-icon", {
              props: {
                type: "check-circle",
                theme: "filled",
              },
            }),
          onOk: () => {}
        });
      })
      .catch(err => {
        Modal.error({
          title: `執行失敗`,
          content: `${err.response.data.message},${err.response.data.status}`,
          okType: 'green',
          okText: '確定',
          icon: () => 
            this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
            }),
          onOk: () => {
            this.onFormCancel();
          }
        });
        return;
      })
      .finally(() => {
        this.setLoading(false);
      })
    } else {
      // 確定覆核
      this.setLoading(true);
      this.$addAmlPendingApi.updateResultStatInAddAMLPendingRevieweUsingPOST({
        "efileNo": amlData.efileNo,
        "state": "Y"
      })
      .then(resp => {
        Modal.success({
          title: `${amlData.efileNo}：覆核確認成功`,
          okType: 'green',
          okText: '確定',
          icon: () =>
            this.h("a-icon", {
              props: {
                type: "check-circle",
                theme: "filled",
              },
            }),
          onOk: () => {}
        });
      })
      .catch(err => {
        Modal.error({
          title: `執行失敗`,
          content: `${err.response.data.message},${err.response.data.status}`,
          okType: 'green',
          okText: '確定',
          icon: () => 
            this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
            }),
          onOk: () => {
            this.onFormCancel();
          }
        });
        return;
      })
      .finally(() => {
        this.setLoading(false);
      })
    }
    this.modalVisible = false;
  }

  // 覆核取消
  onFormCancel() {
    const rowId = this.index;
    this.grid.data.map((item,index) => {
      if(item.rowkey == rowId) {
        item.verify = undefined;
      }
    });
    this.modalVisible = false;
  }



/**
 * Hook
 */
  mounted() {
    this.getSelectOpts();
  }

}
</script>

<style lang="scss" scoped>
$spinColor: #fff;
$spinFontSize: 20px;
.ant-input-affix-wrapper .ant-input:focus {
  border: none;
  border-bottom: 1px solid white !important;
  box-shadow: none;
}

.container {
  background-color: transparent;
}

.amlReason {
  color: #227fa8;
  &:hover {
    cursor: pointer;
  }
}


::v-deep {
  .ant-modal {
    width: 416px !important;
  }
}
</style>
