<template>
  <a-card class="noticeCard">
    <template #title>
      <a-row>
        <a-col class="text-center noticeCard__title">
          {{ noticeData.noticeSubject }}
        </a-col>
      </a-row>
    </template>
    <a-row>
      <a-col class="noticeCard__content">
        <div v-html="noticeData.noticeContent" />
      </a-col>
    </a-row>
  </a-card>
</template>
<script src="./NoticeCard.ts" />
<style lang='scss' scoped>
.noticeCard {
  flex: 0 0 100%;
  height: 95%;
}

.noticeCard__title {
  font-weight: bold;
  font-size: 20px;
  color: #0093C1;
  white-space: normal;
  word-break: break-word;
}

.noticeCard__content {
  height: 684px;
  overflow-y: scroll;
}
</style>
