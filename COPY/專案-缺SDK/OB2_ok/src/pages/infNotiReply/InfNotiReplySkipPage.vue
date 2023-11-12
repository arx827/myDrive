<template>
    <div>
        <!-- <h1>hello skip page</h1> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

/**
 * 跳板 queryString enum
 */
export enum QueryStringFrom {
  INF_REPLY_EMAIL="infReplyEmail",
  NOTI_REPLY_EMAIL="notiReplyEmail",
  NOTI_SSO="notiSso",
}

@Component
export default class InfNotiReplySkipPage extends Vue {

    created() {
    // 取得 url
    var loc:Location = window.location;

    /**
    * 將 url 後面的 queryString 轉成物件 
    * queryString : http://xxxx.xx?a=1&b=2 => {"a":"1", "b":"2"}
    **/
    const urlQueryStringParam = Object.fromEntries(new URLSearchParams(loc.search));
    //console.log(urlQueryStringParam);

    // 透過 queryString obj 判斷要跳到哪個登入頁
    if(urlQueryStringParam.from == QueryStringFrom.INF_REPLY_EMAIL){
        this.$router.push({path:"/infNotiReplyLogin"});
    }
    
  }

}
</script>
