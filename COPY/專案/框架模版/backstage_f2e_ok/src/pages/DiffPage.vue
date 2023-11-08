<template>
  <div class="card">
    <h1>原文</h1>
    <div>
      <span
        v-if="diffText.length==0"
        v-html="defaultText"
      />
    </div>
    <div>
      <span
        v-if="diffText.length > 0"
        v-html="diffText"
      />
    </div>
    <br>
    <h1>編輯區</h1>
    <a-input
      v-model="textAreaText"
      type="textarea"
      size="large"
      placeholder="請輸入"
      :auto-size="{ maxRows: 10}"
      @keyup="doTextDiff()"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FblDataGrid from '@shared/data-grid/FblDataGrid.vue';

@Component({ components: { FblDataGrid } })
export default class DiffPage extends Vue {
    defaultText = '金融監督管理委員會　公告<br>'
                  + '發文日期：中華民國111年2月14日<br>'
                  + '發文字號：金管銀法字第11102703251號<br>'
                  + '主旨：預告修正「金融控股公司之子公司減資辦法」第三條及第六條附表一、「金融控股公司投資管理辦法」第二條及第四條附表一、附表四、第五條附表七、「銀行辦理高資產客戶適用之金融商品及服務管理辦法」第七條、「金融機構設立外國特殊目的公司核准辦法」第二條及「特殊目的公司設立及許可準則」第三條草案。<br>'
                  + '依據：行政程序法第一百五十一條第二項準用第一百五十四條第一項。<br>'
                  + '公告事項：<br>'
                  + '一、修正機關：金融監督管理委員會。<br>'
                  + '二、修正依據：金融控股公司法第三十六條第八項、第三十七條第九項、銀行法第三條第二十二款、第二十八條第一項、第四十五條之一第四項及第七十二條之一、信託業法第十八條之一第二項、國際金融業務條例第四條第一項第六款及第十一款及金融資產證券化條例 第五十四條第三項、第五十六條第二項。<br>'
                  + '三、旨揭法規修正草案總說明、條文對照表及附表對照表如附件，本案另載於金融監督管理委員會「主管法規查詢系統」網站之「草案預告」網頁（網址：https://law.fsc.gov.tw/DraftForum.aspx）。<br>'
                  + '四、對於本公告內容有任何意見或建議者，請於本公告刊登公報翌日起60日內於前開「草案預告」網頁陳述意見或洽詢：<br>'
                  + '(一)承辦單位：金融監督管理委員會銀行局<br>'
                  + '(二)地址：新北市板橋區縣民大道2段7號7樓<br>'
                  + '(三)電話：02-89689632、02-89689637<br>'
                  + '(四)傳真：02-89691352<br>'
                  + '(五)電子郵件：ppyang@banking.gov.tw';

    textAreaText = this.defaultText.replaceAll('<br>', '\n');

    diffText = '';

	// doTextDiff() {
	// 	this.diffText = htmlDiff.execute(this.defaultText, this.textAreaText.replaceAll('\n', '<br>'));
	// 	console.log(this.diffText);
	// }
}

</script>

<style>
    /* ins.diffmod {
        background-color: limegreen;
    }
    ins.diffins {
        background-color: limegreen;
    }

    del.diffdel {
        background-color: lightpink;
    }
    del.diffmod {
        background-color: lightpink;
    }

    figure del.diffmod,
    figure del.diffins,
    figure ins.diffmod,
    figure ins.diffins {
        display: block;
        padding: 10px;
    } */
</style>
