<template>
  <div class="SearchChangeDataDetails">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header formW1088">
      <h2
        class="main-title"
      >
        詳細投保內容
      </h2>
    </div>
    <div class="page__card body-info formW1088">
      <div class="info-header d-flex">
        <img
          v-if="userData.insSex === '男'"
          src="~@images/image_boy_small.svg"
          alt=""
        >
        <img
          v-else
          src="~@images/image_girl_small.svg"
          alt=""
        >
        <div class="header-text">
          <p class="title">
            被保險人資訊
          </p>
          <p class="fw-bold subtitle">
            {{ userData.insName }}
          </p>
          <p class="subtitle">
            {{ userData.engInsName }}
          </p>
        </div>
      </div>
      <a-row type="flex" justify="center" :gutter="[15, 0]">
        <a-col v-for="(group_item, group_index) in categroryList" :key="group_index" span="6">
          <div class="infoBox">
            <div>{{ group_item.value }}</div>
            <template v-for="(content_item, content_index) in userDataList.filter((i)=>i.categrory == group_item.key)">
              <div v-if="content_item.isShow" :key="content_index" class="item">
                <div class="fw-bold">
                  {{ content_item.title }}
                </div>
                <div class="item">
                  {{ content_item.value }}
                </div>
              </div>
            </template>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-if="isInsPlan && ((userData.appType == '保險計劃加保') || (userData.appType == '險種計劃加保') || (userData.appType == '保險計劃變更') || (userData.appType == '險種計劃變更'))" class="page__card formW1088">
      <div class="plan-header">
        <div>保險計劃/專案</div>
        <div v-if="userData.policyPlan">
          {{ userData.policyPlan }} {{ userData.policyPlanName }}
        </div>
      </div>
      <div class="plan-content">
        <div class="listGroup">
          <div class="title">
            <p>投保內容（險種/計劃/保額）</p>
            <p>金額單位 / 新台幣TWD</p>
          </div>
          <div v-for="(item, index) in userData.giissInschgSpecs" :key="index" class="groupItem">
            <div class="d-flex justify-content-between align-items-center w-100">
              <div>
                <div>
                  ＊{{ item.itemName }}({{ item.item }})
                </div>
                <div
                  v-if="policyType === 'RC'"
                  class="item__title--primary"
                >
                  {{ item.plan }} {{ item.descriptionOfInsurancePlan }}
                </div>
              </div>
              <div
                v-if="policyType === 'RC' && item.sa == 0"
                class="item__cost"
              >
                是
              </div>
              <div
                v-else-if="policyType === 'CB' && item.sa == 0"
                class="item__cost"
              >
                {{ item.plan }} {{ item.descriptionOfInsurancePlan }}
              </div>
              <div
                v-else
                class="item__cost ml-auto"
              >
                {{ item.saumitName.indexOf('元') !== -1 ? '$': '' }} {{ item.sa.toLocaleString('en-IN') }} {{ item.saumitName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="updateListData && userData.appType == '基本資料變更'" class="page__card formW1088">
      <div class="plan-header">
        已上傳檔案
      </div>
      <div class="listGroup">
        <div v-for="(item,index) in updateListData" :key="index" class="fileItem">
          <button
            class="icon-button"
            @click="handleExport(item)"
          >
            <img
              class="icon-button__img"
              src="~@images/button_download.svg"
              alt=""
            >
          </button>
          <img
            class="icon-button__img icon-paperclip"
            src="~@images/image_paperclip.svg"
            alt=""
          >
          <p>{{ item.fileName }}</p>
        </div>
        <!-- <div v-for="(item, index) in "></div> -->
      </div>
    </div>

    <div class="form-footer text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="$router.go(-1)"
      >
        返回
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { GiissInschgMasterContentDto, TransactionContentModel } from '@fubonlife/co-giiss-api-axios-sdk';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

@Component({
  components: { LayoutLoading },
})
export default class SearchChangeDataDetails extends Vue {
  h = this.$createElement;

  pageLoading = false;

  // 【受理號碼】
  appNo = '';

  // API接收回來user資訊
  userData: GiissInschgMasterContentDto = {}

  // user資訊列表清單
  userDataList = [];

  // API接收回來的客戶上傳之檔案清單
  updateListData = null;

  // 是否顯示【保險計劃/專案】
  isInsPlan = false;

  // 被保險人資訊標題
  categroryList = [
    {
      key: 'personInfo',
      value: '個人資料',
    },
    {
      key: 'policy',
      value: '投保資料',
    },
    {
      key: 'career',
      value: '任職資料',
    },
    {
      key: 'remark',
      value: '備註',
    },
  ]

  /**
   * Func
   */
  setResultParam() {
    const $query = this.$global.getQuery();
    const { appNo } = $query;
    if ($query) {
      this.appNo = appNo;
      this.getInfo();
    }
  }

  // 查詢異動資料投保內容
  getInfo() {
    this.pageLoading = true;
    const $search: TransactionContentModel = { appNo: this.appNo, funtionType: '1' };
    this.$gioDataProcessApi.getGiissInschgMasterContentUsingPOST($search)
      .then((resp) => {
        // TEST:
        // console.log(resp);
        if (resp.data.status == 200) {
          const respData = JSON.parse(JSON.stringify(resp.data.data));
          this.userData = respData;
  				this.userDataList = [
  					{
  						categrory: 'personInfo',
  						title: '員工姓名',
  						key: 'empName',
  						value: respData.empName,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '屬性',
  						key: 'insAttr',
  						value: respData.insAttr,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '出生日期',
  						key: 'insBirthDate',
  						value: respData.insBirthDate,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '國籍',
  						key: 'nationAlity',
  						value: respData.nationAlity,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '身分證字號/居留證號碼',
  						key: 'idNo',
  						value: respData.idNo,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '電話',
  						key: 'mobile',
  						value: respData.mobile,
  						isShow: true,
  					},
  					{
  						categrory: 'personInfo',
  						title: '電子信箱',
  						key: 'email',
  						value: respData.email,
  						isShow: true,
  					},
  					{
  						categrory: 'policy',
  						title: '保險證號',
  						key: 'crtNo',
  						value: respData.crtNo,
  						isShow: true,
  					},
  					{
  						categrory: 'policy',
  						title: '加保日期',
  						key: 'appocDate',
  						value: respData.appocDate,
  						isShow: !!(respData.appType == '保險計劃加保' || respData.appType == '險種計劃加保'),
  					},
  					{
  						categrory: 'policy',
  						title: '退保日期',
  						key: 'appocDate',
  						value: respData.appocDate,
  						isShow: respData.appType == '退保',
  					},
  					{
  						categrory: 'policy',
  						title: '變更日期',
  						key: 'appocDate',
  						value: respData.appocDate,
  						isShow: !!(respData.appType == '保險計劃變更' || respData.appType == '險種計劃變更' || respData.appType == '基本資料變更'),
  					},
  					{
  						categrory: 'policy',
  						title: '受理日期',
  						key: 'appTime',
  						value: respData.appTime,
  						isShow: true,
  					},
  					{
  						categrory: 'policy',
  						title: '受益人',
  						key: 'benType',
  						value: respData.benType,
  						isShow: !!(respData.appType == '保險計劃加保' || respData.appType == '險種計劃加保'),
  					},
  					{
  						categrory: 'career',
  						title: '部門',
  						key: 'depNo',
  						value: respData.depNo,
  						isShow: !!(((respData.insAttr == '員工' && respData.appType == '保險計劃加保') || (respData.insAttr == '員工' && respData.appType == '險種計劃加保')) || ((respData.insAttr == '員工' && respData.appType == '基本資料變更')) || (respData.insAttr == '員工' && respData.appType == '險種計劃變更')),
  					},
  					{
  						categrory: 'career',
  						title: '工作內容',
  						key: 'rankNo',
  						value: respData.rankNo,
  						isShow: !!(((respData.insAttr == '員工' && respData.appType == '保險計劃加保') || (respData.insAttr == '員工' && respData.appType == '險種計劃加保'))),
  					},
  					{
  						categrory: 'career',
  						title: '提報工資(TWD)',
  						key: 'salary',
  						value: (respData.salary) ? respData.salary.toLocaleString() : '',
  						isShow: !!((respData.appType == '保險計劃加保') || (respData.appType == '險種計劃加保') || (respData.appType == '薪資變更')),
  					},
  					{
  						categrory: 'career',
  						title: '職保薪資(TWD)',
  						key: 'scinsamt',
  						value: (respData.scinsamt) ? respData.scinsamt.toLocaleString() : '',
  						isShow: !!((respData.appType == '保險計劃加保') || (respData.appType == '險種計劃加保') || (respData.appType == '薪資變更')),
  					},
  					{
  						categrory: 'career',
  						title: '津貼(TWD)',
  						key: 'allowance',
  						value: (respData.allowance) ? respData.allowance.toLocaleString() : '',
  						isShow: !!((respData.appType == '保險計劃加保') || (respData.appType == '險種計劃加保') || (respData.appType == '薪資變更')),
  					},
  					{
  						categrory: 'remark',
  						title: null,
  						key: 'remark',
  						value: respData.note,
  						isShow: !!((respData.appType == '保險計劃加保') || (respData.appType == '險種計劃加保')),
  					},
          ];

          this.isInsPlan = !!(respData.giissInschgSpecs);
          if (respData.appType == '基本資料變更') {
            this.pageLoading = true;
            this.$gioDataProcessApi.getChangeDataFileListUsingPOST(this.appNo)
            .then((resp) => {
              if (resp.data.status == 200) {
                this.updateListData = (resp.data.data.length > 0) ? JSON.parse(JSON.stringify(resp.data.data)) : null;
              }
            })
            .catch((error) => {
              // TEST:
              // console.log(error);
            })
            .finally(() => {
              this.pageLoading = false;
            });
          }
        } else {
          this.$router.push({ name: 'SearchChangeDataResult' }).then(() => {
            const getError = resp.data;
            this.$infoNotification.error({
              Content: '無法完成查詢項目，請再次嘗試。',
              apiError: getError.apiError,
            });
          });
        }
      })
      .catch((error) => {
        this.$router.push({ name: 'SearchChangeDataResult' }).then(() => {
          this.$infoNotification.error({
            Content: '無法完成查詢項目，請再次嘗試。',
          });
        });
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 依保單號碼 判斷 CB / RC
  get policyType() {
    return this.$global.getPolicyType(this.appNo);
  }

  handleExport(fileData) {
    this.$gioDataProcessApi.changeDataDownloadFileUsingPOST(fileData, { responseType: 'blob' })
    .then((resp) => {
      if (resp.headers['content-disposition']) {
        // TEST:
        // console.log('export:', resp);
        this.$blobUtils.download((resp.data as unknown as Blob), this.$blobUtils.decodeFileName(resp));
      } else {
        this.$gioDataProcessApi.changeDataDownloadFileUsingPOST(fileData)
        .then((resp) => {
          const errorData = JSON.parse(JSON.stringify(resp));
          if (errorData.data.status != 200) {
            const getError = errorData.data;
            this.$infoNotification.error({
              Content: '無法完成下載項目，請再次嘗試。',
              apiError: getError.apiError,
            });
          }
        });
      }
    })
    .catch((error) => {
      // TEST:
      // console.log(error);
      this.$infoNotification.error({
        Content: '無法完成下載項目，請再次嘗試。',
      });
    })
    .finally(() => {
      this.pageLoading = false;
    });
  }

  /**
   * Hooks
   */
  created() {
    this.setResultParam();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>

.main-header {
  margin-bottom: 15px;
}

.body-info {
  margin-bottom: 10px;
  padding: 20px 90px;
  .info-header {
    margin-bottom: 10px;
    .header-text {
      margin-left: 16px;
      .title {
        color: $TITLE-COLOR-BLUE;
        font-size: 14px;
        font-weight: 600;
      }
      .subtitle {
        font-size: 18px;
        &:not(:first-child) {
          padding-top: 10px;
        }
      }
    }
  }
}

.infoBox {
  & > div:first-of-type {
    background-color: $BG-COLOR-TITLE;
    color: $COLOR-WHITE;
    padding: 0 12px;
    margin-bottom: 10px;
    line-height: 20px;
  }
  .item {
    &:not(:nth-last-child(1)) {
      padding-bottom: 10px;
    }
    div + div {
      min-height: 20px;
    }
  }
}

.plan-header {
  background-color: $BG-COLOR-TITLE;
  color: $COLOR-WHITE;
  padding: 10px 75px;
  font-size: 16px;
  & > p {
    max-width: 900px;
    line-height: 42px;
  }
}

.page__card {
  min-height: auto;
}

.listGroup {
  .title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $TITLE-BORDER-BLUE;
    padding-bottom: 10px;
    color: $TITLE-BORDER-BLUE;
    font-weight: 600;
  }
  .item__title--primary {
    color: $TEXT-COLOR-BLUE;
  }
  padding: 10px 75px;
  .groupItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 16px;
    &:not(:nth-last-child(1)) {
      border-bottom: 1px dashed $LIST-BORDER-GRAY;
    }
  }
  .fileItem {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 10px;
    &:last-of-type {
      margin-bottom: 10px;
    }
  }
}

.icon-paperclip {
  margin-right: 10px;
  margin-left: 24px;
}

.form-footer {
  padding: 40px 0 30px 0;
}

</style>
