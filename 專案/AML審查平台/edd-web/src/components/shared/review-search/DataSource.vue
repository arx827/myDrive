<template>
  <div>
    <section>
        <div class="dataSource-sec">
            <a-row v-for="(data, index) in datas" :key="index" type="flex">
                <a-col :span="2" style="max-width: 80px;">
                    {{data.name}}：
                </a-col>
                <a-col :span="22" style="white-space: pre-line;">
                    {{data.content}}
                </a-col>
            </a-row>
        </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

class DataSourceDto {
    name: string;
    content: string;
    constructor(name: string, content:string){
        this.name = name;
        this.content = content;
    }
}
@Component
export default class DataSource extends Vue {

  datas = [
      new DataSourceDto("吳○○", "AML大額繳費審查暨電訪單清單之突有大額繳費"),
      new DataSourceDto("陳○○", "AML保全補費照會單-客戶國籍檢核"),
      new DataSourceDto("莊○○", "檢核訊息：辦理要保人換人後，於３０天內（含同一天）再辦理受益人變更，且受益人與被保險人之關係非配偶、直系親屬或法定繼承人者，需說明指定原因，若原因不合理或是不配合說明時，請進行ＡＭＬ疑似洗錢／異常交易通報。")
  ];
 
  
}
</script>

<style lang="less" scoped>
.dataSource-sec {
  font-size: 16px;
}
</style>