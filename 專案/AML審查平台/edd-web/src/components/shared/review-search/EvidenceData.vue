<template>
  <div>
    <section>
      <p class="list-title">
        <a-row type="flex">
          <h4 class="section__title list__count">系統調檔影像檔案</h4>
        </a-row>
        <fbl-data-grid
          class="fbl-table file__table"
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          style="margin-top: 16px"
        >
          <template v-slot:download="slotProps">
            <a @click="downloadFMSFile(slotProps.data)" v-if="slotProps.data.imgIdxId">
              <a-icon type="download" :style="{ fontSize: '22px' }"/>
            </a>
          </template>
        </fbl-data-grid>
      </p>
    </section>
    <section>
      <a-row type="flex">
        <h4 class="section__title list__count">自行提供檔案上傳</h4>
      </a-row>
      <a-row type="flex" class="uploadRow" :class="{'confirmMode':isConfirm}" :gutter="[30, 0]">
        <a-col :xs="8" :md="8" :lg="8" :xxl="8" flex="5" class="upload__list">
          <a-row class="upload-title" type="flex">
            <a-col class="upload-title-file">上傳檔案</a-col>
            <a-col class="upload-title-time">上傳時間</a-col>
          </a-row>
          <a-list
            class="upload-list"
            v-if="uploadfileList.length"
            :data-source="uploadfileList"
            item-layout="horizontal"
            size="large"
          >
            <a-list-item slot="renderItem" slot-scope="item" class="file__list">
              <a class="file__list__name" @click="downloadFile(item)">{{ item.name }}</a>
              <div class="file__list__time">{{ item.time }}</div>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import {
  Getter,
  Action,
  namespace } from 'vuex-class';
import { message, Modal } from "ant-design-vue";
import moment from "moment";
import { ImageDataVO } from "@fubonlife/edd-api-axios-sdk";
import Global from "@/plugins/global";
export interface fileModal {
  name: string,
  uid: string,
  time: string,
  file: {
    lastModified: number
    lastModifiedDate: any
    name: string
    size: number
    type: string
    uid: string
    webkitRelativePath: string
  }
}

@Component({ components: { FblDataGrid } })
export default class EvidenceData extends Vue {
  @Getter public isConfirm!: boolean;
  @Action public setLoading: (payload: boolean) => void;
  @Action public reflashPage: (payload: {page: string, val: boolean}) => void;
  @Getter public getReflash;

  h = this.$createElement;
  uploadfileList: any[] = [];
  type: boolean = true;

  // data grid
  public grid: FblPDataGridHolder<ImageDataVO> = {
    rowKey: "rowkey",
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "sysType",
        title: "系統別",
      },
      {
        type: FblColumnType.PLAIN,
        property: "policyNo",
        title: "保單號碼",
        formatter: (data) => {
          return `${data.policyNo}-${Global.padLeftZero(data.policySeq, 2)}${(data.idDup) ? ' ' + data.idDup : ''}`;
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "applName",
        title: "要保人姓名",
      },
      {
        type: FblColumnType.PLAIN,
        property: "fileName",
        title: "檔案",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "imgIdxId", // 待確認對應key值
        title: "下載",
        align: "center",
        template: "download",
      },
    ],
  };


/**
 * Func
 */

  


/**
 * Event
 */
  updateFileList() {
    this.setLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    // TEST:
    // const amlID = 'VP110073000001';
    this.$reviewApi.getImageDataInReviewUsingGET(amlID)
      .then( resp => {
        const data = resp.data.data;
        
        // 系統調檔影像檔案 加序號
        data.systemFetchData.map((item,index) => {
          return Object.assign(item, {rowkey: index + 1})
        })
        this.grid.data = data.systemFetchData;
        this.uploadfileList = data.manualUploadData.map(item => {
          return {
            name: item.fileName,
            uid: item.imgIdxId,
            time: item.scanDate, // 待確認欄位
            file: item.docName, // 待確認欄位
          }
        })
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // 系統調檔影像檔案 下載
  downloadFMSFile({ imgIdxId, fileName }) {
    this.setLoading(true);
    if(!this.isConfirm) {
      this.$reviewApi.fmsDownloadInReviewUsingGET(sessionStorage["review_assignment_page"], imgIdxId, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = fileName;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch(err => {
          // console.log(err);
          Modal.error({
            title: '下載失敗，請重新操作',
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
            onOk: () => {},
          });
        })
        .finally(() => {
          this.setLoading(false);
        })
    }else{
      this.$confirmApi.fmsDownloadInConfirmUsingGET(sessionStorage["review_assignment_page"], imgIdxId, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = fileName;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch(err => {
          // console.log(err);
          Modal.error({
            title: '下載失敗，請重新操作',
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
            onOk: () => {},
          });
        })
        .finally(() => {
          this.setLoading(false);
        })
    }
  }
  // 自行提供檔案上傳 下載
  downloadFile(file) {
    this.setLoading(true);
    if(!this.isConfirm) {
      this.$reviewApi.fmsDownloadInReviewUsingGET(sessionStorage["review_assignment_page"], file.uid, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = file.name;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch(err => {
          // console.log(err);
          Modal.error({
            title: '下載失敗，請重新操作',
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
            onOk: () => {},
          });
        })
        .finally(() => {
          this.setLoading(false);
        })
    }else{
      this.$confirmApi.fmsDownloadInConfirmUsingGET(sessionStorage["review_assignment_page"], file.uid, {responseType: "blob"})
        .then(resp => {
          const downloadlink: HTMLAnchorElement = document.createElement("a");
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(resp.data as unknown as Blob);
          const downloadName = file.name;
          downloadlink.setAttribute("href", url);
          downloadlink.setAttribute("download", `${downloadName}`);
          downloadlink.click();
          downloadlink.remove();
        })
        .catch(err => {
          // console.log(err);
          Modal.error({
            title: '下載失敗，請重新操作',
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
            onOk: () => {},
          });
        })
        .finally(() => {
          this.setLoading(false);
        })
    }
  }


/**
 * Hook
 */
  created(){
    this.updateFileList();
  }


/**
 * 監聽
 */
  @Watch('getReflash')
  watchGetReflash(val) {
    if(Object.keys(val).includes('ReviewEvidenceData')) {
      this.updateFileList();
      this.reflashPage({page: 'ReviewEvidenceData', val: false});
    }
  }



}
</script>

<style lang="scss" scoped>
section {
  margin-bottom: 20px;
}
.list-title {
  font-size: 16px;
  > span {
    font-size: 14px;
  }
}

.uploadRow {
  height: 190px;
}
.fbl-upload-dragger ::v-deep .ant-upload.ant-upload-drag {
  background: #e6f7ff;
  border: 1px solid rgb(145, 213, 255, 15%);
  height: 190px;
  &:hover {
    border: 1px solid #40a9ff;
  }

  p.ant-upload-text {
    color: #499ee5;
  }
}



// .ant-list-item {
//   &:hover {
//     background: #e6f7ff;
//   }
// }
::v-deep {
  // 系統調檔影像檔案 下載區塊 增加分隔線
  .file__table {
    .ant-table-row {
      .ant-table-row-cell-break-word {
        &:nth-last-child(1) {
          div {
            border-left: 1px solid #e8e8e8;
            padding-left: 10px;
            margin-left: -8px;
          }
        }
      }
    }
  }
  .confirmMode{
    .upload__btn{
      display: none;
    }
    .upload__list{

    }
    .upload-title{
      background-color: #13C2C2;
    }
    .upload-title-time{
      margin-right:355px;
    }
    .file__list__time{
      margin-right: 355px;
    }
    .file__list__delete,
    .upload-title-delete {
      display: none;
    }
  }
}




.upload-title,
.upload-list {
  padding: 0 15px;
}

.upload-title-file,
.file__list__name {
  flex: 1;
      margin-left: 15px;
}

.upload-title-time,
.file__list__time {
  margin: 0 30px;
  width: 90px;
  align-self: center;
}

.upload-title-delete,
.file__list__delete {
  width: 80px;
  text-align: center;
  padding-left: 20px;
}


.upload-title {
  background: #8ebbe6;
  color: white;
  width: 100%;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.file__list {
  align-items: stretch;
  .list__delete__icon {
    font-size: 22px;
  }
}

.file__list__name,
.file__list__time,
.file__list__delete {
  align-self: center;
}

.file__list__name {
  word-break: break-all;
}
.file__list__time {
  align-self: center;
}
.file__list__delete {
  border-left: 1px solid #e8e8e8;
}


</style>
