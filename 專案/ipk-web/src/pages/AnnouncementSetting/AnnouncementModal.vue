<template>
  <a-modal
    ref="modal"
    v-model="showModal"
    :maskClosable="false"
    :keyboard="false"
    :width="'50%'"
    :body-style="{ maxHeight: '680px', overflow: 'hidden', overflowY: 'scroll'}"
    :after-close="closeAnnouncementModal"
    :destroyOnClose="true"
  >
    <div>
      <div class="modal__body">
        <table class="w-100 mt-2">
          <tr v-for="(item,key,index) in announcementData" :key="index">
            <td class="table_title">
              {{ item.label }}
            </td>
            <td v-if="key === 'content'" class="w-75 p-2">
              <div v-html="item.value" />
            </td>
            <td v-else-if="key === 'attachment'" class="w-75 p-2">
              <div v-for="(attachment, attachmentIndex) in item.value" :key="attachmentIndex" class="affix">
                <span @click="downloadAttachment(attachment)">
                  <a-icon type="paper-clip" class="me-1" />{{ attachment.attachmentName }}
                </span>
              </div>
            </td>
            <td v-else class="w-75 p-2">
              {{ item.value }}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <template slot="title">
      <a-tag class="tagStyle" :style="{ background: detail.tagColor }">
        {{ detail.tagTitle }}
      </a-tag>
      <span>公告事項</span>
    </template>
    <template slot="footer">
      <IpkButton
        buttonType="lightBlue"
        buttonText="關閉"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closeAnnouncementModal"
      />
    </template>
  </a-modal>
</template>
<script src="./AnnouncementModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
  .ant-modal .ant-modal-header {
    padding: 13px 12px 8px 12px;
  }
  .ant-modal .ant-modal-close-x {
    line-height: 50px;
  }
  .ant-modal-title {
    font-size: 18px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0 !important;
  }
}
.subTitle {
  font-size: 12px;
  color: $COLOR-GRAY10;
  margin: 10px 0;
}
.content__block {
  border: 1px solid #DBDBDB;
  border-radius: 10px;
  padding: 20px;
}
.affix {
  color: $COLOR-MAIN14;
  padding: 5px 0;
  cursor: pointer;
}
table, th, td {
  border: 1px solid #dee2e6;
  border-collapse: collapse;
  font-size: 14px;
  padding: 5px;
}
.table_title {
  background-color: $COLOR-GRAY14;
  font-weight: $TEXT-BOLD !important;
  color: #000;
  width: 14%;
  padding-left: 10px;
}
.tagStyle {
  color: $COLOR-WHITE;
  border: none;
  vertical-align: top;
  font-size: 14px;
}
</style>
