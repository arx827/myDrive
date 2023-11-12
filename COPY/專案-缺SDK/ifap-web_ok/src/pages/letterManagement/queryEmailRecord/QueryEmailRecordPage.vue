<template>
  <div class="searchBlock__wrap">
    <AccordionArea class="mb-2">
      <a-form-model ref="formRef" :colon="false" :model="form" :rules="filterFormRule" :hide-required-mark="true">
        <a-form-model-item label="寄件人信箱" prop="senderArr">
          <a-select
            v-model="form.senderArr"
            mode="multiple"
            placeholder="格式:xxxxx@fubonlife.com.tw"
            :options="senderOptions"
            @search="handleSearch('sender', $event)"
          />
        </a-form-model-item>
        <div class="row">
          <div class="col-6">
            <a-form-model-item label="約定之標頭" prop="idCode">
              <a-input
                v-model="form.idCode"
                placeholder="格式:A000xxxxx_ffd40e0effa44aaea0120191xxxxxxxx"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <a-form-model-item label="寄送時間區間" prop="sentTime">
              <a-range-picker
                v-model="form.sentTime"
                class="w-100"
                :format="dateFormat"
                :disabled-date="disabledDate"
                :inputReadOnly="true"
                :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
                @change="changePicker"
                @openChange="openChange"
                @calendarChange="calendarChange"
              >
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="收件者信箱" prop="recipient">
              <a-input-group compact class="d-inline-flex">
                <a-input
                  v-model="form.recipient"
                  placeholder="格式:xxxxx@fubonlife.com.tw"
                />
              </a-input-group>
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="信件主旨" prop="subject">
              <a-input
                v-model="form.subject"
                placeholder="請輸入信件主旨"
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="系統別" prop="syscode">
              <a-select
                v-model="form.syscode"
                mode="multiple"
                placeholder="請選擇系統別"
                :options="typeOptions"
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="關鍵字" prop="keyword">
              <a-input
                v-model="form.keyword"
                placeholder="輸入內容可用『 ; 』區隔"
              />
            </a-form-model-item>
          </div>
        </div>
      </a-form-model>

      <div class="d-flex justify-content-center">
        <a-button class="linearButton" @click="searchSubmit">
          查詢
        </a-button>
        <a-button class="clearButton" @click="resetFrom()">
          清除
        </a-button>
      </div>
    </AccordionArea>
    <img class="searchBlock__bgImg bgImg__letterManagement" src="~@imgs/image_mailbg_2x.png" alt="">

    <!-- 查詢結果 控制項 -->
    <div class="searchResultWrap">
      <div class="searchResult__control d-flex justify-content-between align-items-center">
        <div class="showResultsNumber d-flex align-items-center">
          <a-icon type="search" />
          <span class="ms-1"> 查詢結果共有 {{ getDataNum }} 筆資料</span>
        </div>
        <div>
          <a-button class="linearButton tableHeader__button" @click="exportFile()">
            匯出
          </a-button>
        </div>
      </div>
      <FblDataGrid
        class=""
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :empty-data="grid.data.length <= 0"
        @tableChange="onMasterPageChange($event)"
      >
        <!-- 信件詳細 -->
        <template v-slot:detailControl="slotProps">
          <a-button class="tableControl__button mailButton" :disabled="!slotProps.data.idCode" @click="detailClick(slotProps.data)" />
        </template>
      </FblDataGrid>
    </div>

    <!-- 彈窗：郵件詳細 -->
    <a-modal
      v-model="detailData.visible"
      width="1000px"
      :dialogStyle="{'max-width': 'calc(100% - 30px)'}"
      :keyboard="false"
      :maskClosable="false"
      layout="vertical"
    >
      <template #title>
        {{ detailData.title }}
      </template>
      <div class="ifap__description">
        <a-descriptions :column="{sm: 1, lg: 2}" :colon="false" :bordered="false" title="郵件寄送紀錄">
          <a-descriptions-item v-for="(item, index) in detailData.dataInfo" :key="index" :label="item.label">
            {{ item.text }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <a-descriptions :column="{sm: 1, lg: 2}" :colon="false" :bordered="false" title="補充資訊">
          <a-descriptions-item v-for="(item, index) in detailData.extraInfoForMailDetailList" :key="index" :label="item.label" :span="item.span">
            {{ item.text }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <div class="w-100 overflow-auto">
          <div class="ant-descriptions-title">
            信件內文
          </div>
          <div v-if="detailData.content" v-html="detailData.content" />
          <a-empty v-else />
        </div>

        <a-divider />

        <div class="ant-descriptions-title">
          信件附件
        </div>
        <ul>
          <li v-for="(item, index) in detailData.fileInfoForMailDetailList" :key="index">
            <!-- 不提供下載 2023/07/07 -->
            <!-- <span class="file_download_icon">
              <a-icon class="ifap_download" type="download" :style="{ fontSize: '20px' }" @click="onClickDownloadWithFileId(item)" />
            </span> -->
            <span class="file_fileName">
              {{ item.fileName }}
            </span>
          </li>
        </ul>
      </div>
      <template #footer>
        <a-button @click="closeModal">
          關閉
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script src="./QueryEmailRecordPage.ts" lang="ts"></script>
<style lang="scss" scoped>

.ifap__description {
  ::v-deep{
    .ant-descriptions-row {
      display: flex;
    }
    .ant-descriptions-item {
      flex: 1;
      display: inline-flex;
    }
    .ant-descriptions-item-label {
      min-width: 120px;
    }
  }
}

.ant-tag {
  display: inline-flex;
  align-items: center;
}

// .downloadLink {
//   color: $COLOR-MAIN3;
//   &:hover {
//     color: $COLOR-MAIN4;
//   }
// }

.file_fileName{
  margin: 0px 0px 0px 10px;
}
.file_download_icon{
  margin: 0px 0px 0px 10px;
}
</style>
