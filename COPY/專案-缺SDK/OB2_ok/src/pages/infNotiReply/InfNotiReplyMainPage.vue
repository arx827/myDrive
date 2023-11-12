<template>
  <div>
    <a-layout id="components-layout-demo-fixed-sider">
      <LayoutSider
        :avatarText="avatarText"
        :avatarActions="avatarActions"
        @onAvatarAction="onAvatarAction"
      >
        <!-- TEST: 先註解 -->
        <!-- <template v-slot:side>
          <fbl-side-menu
            ref="sidemenu"
            @onItemNavigated="onItemNavigated"
            @renderThirdMenu="renderThirdMenu"
          />
        </template> -->
      </LayoutSider>

      <a-layout :style="{ marginLeft: '230px', overflow: 'hidden' }">
        <!-- 跑馬燈，需要時再引入 -->
        <!-- <Marquee-Message></Marquee-Message> -->
        <LayoutHeader
          :title="prop_title"
          :subtitle="prop_subtitle"
        />
        <!-- :key 強制component reload，就算是相同component -->
        <LayoutContent/>
      </a-layout>
    </a-layout>
    <a-modal
     :closable="false"
     :visible="visible"
     :bodyStyle="{ fontSize : '24px'}"
     class="timedOut__modal"
    >
    <div class="timedOut__modal__contain">
      <a-icon type="exclamation-circle" theme="filled" class="timedOut__modal__icon"/>
      <!-- 登入逾時，將會回到登入頁! -->
      <span class="timedOut__modal__title">{{ $t("global_mention") }}</span>
    </div>
    
    <template slot="footer">
      <!-- 確定 -->
      <a-button type="primary" @click="signOut">{{ $t("global_ok") }}</a-button>
    </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";

import jwt from 'jsonwebtoken';
import { LoginModule, HeaderObdLoginFromEnum} from "@/plugins/store/LoginModule";

import { FblAvatarAction } from "@/components/shared/layout/models";

import FblLayout from "@/components/shared/layout/FblLayout.vue";
import FblSideMenu from "@/components/shared/side-menu/FblSideMenu.vue";
import LayoutHeader from "@/components/shared/layout/FblLayoutHeader.vue";
import LayoutSider from "@/components/shared/layout/FblLayoutSider.vue";
import LayoutContent from "@/components/shared/layout/FblLayoutContent.vue";



@Component({
  components: {
    FblLayout,
    FblSideMenu,
    LayoutHeader,
    LayoutSider,
    LayoutContent,
  },
})
export default class InfNotiReplyMainPage extends Vue {

  
  public avatarText: string = ""; //登入者資訊
  // 左上角 登入者資訊 相關 action
  public avatarActions: FblAvatarAction[] = [
    {
      name: "logout",
      title: this.$t("mainP_logout").toString(),
    },
  ];

  // header title
  public prop_title: string = "新電訪作業平台";
  public prop_subtitle: string = "";

  infNotiTokenCheckTimeoutID: number = -1;
  // 登出提示modal
  visible: boolean = false;

  
  created() {
    // 如果重新整理將不會有值，啟動倒數偵測token
    if(!LoginModule._loginState$.accessToken){
      LoginModule.isTokenVerify();
    }
    let loginState = JSON.parse(localStorage.getItem("login_state"));
    var jwtObj:any = jwt.decode(loginState.accessToken);
    // console.log(JSON.stringify(jwtObj));
    if(jwtObj){
      this.avatarText = jwtObj.sub + " " + jwtObj.name;
      if(jwtObj.aud == "aud_infReply"){
        this.prop_subtitle = "電訪會辦回覆作業";
      }else{
        this.prop_subtitle = "";
      }
    }else{
      this.avatarText = "";
    }
    
    let infNotiRefreshMinutes = Number(
      process.env.VUE_APP_API_TOKEN_REFRESH_MINUTES
    );

    // if(infNotiRefreshMinutes && infNotiRefreshMinutes > 0){
    //   this.validateToken();
    //   this.infNotiTokenCheckTimeoutID = window.setInterval(
    //     this.validateToken, 1000 * 60 * infNotiRefreshMinutes
    //   )
    // }

  }

  // validateToken(){
  //   console.log("validationToken execute....");

  //   if (LoginModule.hasValidToken) {
  //     this.$authApi
  //       .renewValidTokenUsingPOST({ token: LoginModule.loginState.accessToken })
  //       .then(async (resp) => {
  //         if (resp.data) {
  //           await LoginModule.signIn(resp.data.token);
  //         } else {
  //           await this.signOut();
  //         }
  //       })
  //       .catch((error)=>{
  //         this.signOut();
  //       });
  //   } else {
  //     this.signOut();
  //   }
  // }

  onAvatarAction(action: FblAvatarAction) {
    switch (action.name) {
      case "logout":
        this.signOut();
        break;
    }
  }

  signOut() {
    // if(this.infNotiTokenCheckTimeoutID != -1){
    //   window.clearInterval(this.infNotiTokenCheckTimeoutID);
    // }
    //  LoginModule.signOut 進行判斷轉導
    LoginModule.signOut(HeaderObdLoginFromEnum.INFROM_LOGIN);
  }

  get isShowLogoutMention() {
    return LoginModule.tokenVerify;
  }

  @Watch('isShowLogoutMention')
  getTokenVerify(newVal) {
    if(newVal){
      this.visible = newVal;
    }
  }
  

}
</script>

<style lang="less" scoped>
.timedOut__modal {
  .ant-modal-body {
    padding: 50px 0;
  }
  .timedOut__modal__contain {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timedOut__modal__icon {
    color:@COLOR-MAIN8;
  }
  .timedOut__modal__title {
    margin-left: 15px;
    margin-right: 15px;
  }
  .ant-modal-footer {
    text-align: center;
    .ant-btn {
      padding: 5px 35px;
      height: auto;
    }
  }
}
</style>
