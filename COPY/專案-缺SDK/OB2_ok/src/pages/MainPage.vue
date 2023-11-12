<template>
  <div @mousemove="idleCheck">
    <a-layout id="components-layout-demo-fixed-sider">
      <LayoutSider
        :avatarText="avatarText"
        :avatarActions="avatarActions"
        @onAvatarAction="onAvatarAction"
      >
        <template v-slot:side>
          <fbl-side-menu
            ref="sidemenu"
            @onItemNavigated="onItemNavigated"
            @renderThirdMenu="renderThirdMenu"
          />
        </template>
      </LayoutSider>

      <a-layout :style="{ marginLeft: '230px', overflow: 'hidden' }">
        <!-- 跑馬燈，需要時再引入 -->
        <!-- <Marquee-Message></Marquee-Message> -->
        <LayoutHeader
          v-if="isShowHeader"
          :title="prop_title"
          :subtitle="prop_subtitle"
        />
        <!-- :key 強制component reload，就算是相同component -->
        <LayoutContent
          :isThirdMenuListEmpty="isThirdMenuListEmpty"
          :thirdMenuList="prop_thirdMenuList"
          :thirdMenuId="prop_ThirdMenuId"
          :key="$route.path"
          @thirdMenuButtonClick="thirdMenuButtonClick"
        />
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
import FblLayout from "@/components/shared/layout/FblLayout.vue";
import FblSideMenu from "@/components/shared/side-menu/FblSideMenu.vue";
import { FblMenuItem } from "@/components/shared/side-menu/model";
import { FblAvatarAction } from "@/components/shared/layout/models";
import { Subject } from "rxjs";
import { MenuDto, MenuNode, CaseCountDto } from "@fubonlife/obd-api-axios-sdk";
import { LoginModule } from "@/plugins/store/LoginModule";
import MessageUtil from "@/assets/config/MessageUtil";
import WindowSizeModule, {
  WindowModule,
  WindowSizeModel,
} from "@/plugins/store/WindowSizeModule";
import { notification } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MappingUtil from "@/assets/config/MappingUtil";

import LayoutHeader from "@/components/shared/layout/FblLayoutHeader.vue";
import LayoutSider from "@/components/shared/layout/FblLayoutSider.vue";
import LayoutContent from "@/components/shared/layout/FblLayoutContent.vue";

import { MenuItemsModule } from "@/plugins/store/MenuItemsModule";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { ErrorMessageModule } from '@/plugins/store/ErrorMessageModule';
import { Modal } from "ant-design-vue";
import router from "@/router";
import jwt from "jsonwebtoken";

@Component({
  components: {
    FblLayout,
    FblSideMenu,
    LayoutHeader,
    LayoutSider,
    LayoutContent,
  },
})
export default class MainPage extends Vue {
  LOGIN_STATE = 'login_state';
  // 閒置登出相關參數
  counter;
  idleTime: number = 0;
  timeoutTime: number = 0;
  
  //目前顯示的第三層相關參數
  public prop_ThirdMenuId: string = "";
  public prop_thirdMenuList: MenuDto[] = [];

  public prop_title: string = "新電訪作業平台";
  public prop_subtitle: string = "";
  public thirdMenuName: string = "";      // 組裝subtitle 用

  // public menuItems: FblMenuItem[] = [];

  currentPageForThridMenu: String = "";
  // 登出提示modal
  visible: boolean = false;



  //某父選單下的所有第三層選單清單
  
  private unsubscribe$ = new Subject<void>();
  //定時更新的分鐘數預設為10
  casesCountInterval = 10;
  casesCountIntervalTimeoutID: number = -1;
  public avatarText: string = "";
  // windowFontSize:{ windowHeight:number, windowWidth:number }
  // windowHeight: number = 0;
  // windowWidth: number = 0;
  windowSize = {
    windowHeight: window.outerHeight,
    windowWidth: window.outerWidth,
  };
  isSamePage: boolean = false;
  oldPagePath: String = "";
  // tokenCheckTimeoutID: number = -1;

  // get vuexMenuitems() {
  //   return MenuItemsModule.getMenuItem;
  // }
  public avatarActions: FblAvatarAction[] = [
    {
      name: "logout",
      title: this.$t("mainP_logout").toString(),
    },
  ];
  
  // OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面
  public isShowHeader:boolean = false; // 是否顯示 header

  status = "工作";


  // =======================  複雜的選單 ======================= //
  /** 傳入母選單的所有子選單, 已選取子選單key */
  onItemNavigated(item: FblMenuItem, key?: string) {
    if (item.key != undefined) {
      MenuItemsModule.updateCurrentMenuItem(item);
      this.prop_ThirdMenuId = "";
      this.thirdMenuName = "";
      this.renderThirdMenu(item.key);
    }
  }
  //依父選單代碼，取得第三層選單清單
  renderThirdMenu(parentMenuId) {
    this.$menuApi.getTargetThirdUsingGET(parentMenuId).then((resp) => {
      this.prop_thirdMenuList = [];
      this.prop_thirdMenuList = resp.data;
      //若 切換第二層選單 或 有第三層選單且當前第三層選單代碼為空 則重新加載第三層選單列表
      if (resp.data[0] &&(resp.data[0].parentMenuId != this.currentPageForThridMenu) || (resp.data.length > 0 && !MenuItemsModule.thirdMenuID)) {
        this.currentPageForThridMenu = resp.data[0].parentMenuId;
        MenuItemsModule.updateThirdMenuId(resp.data[0].menuId);
        this.prop_ThirdMenuId = resp.data[0].menuId;
        this.thirdMenuName = resp.data[0].menuName;
        //子標題為 第二層選單名稱 - 第三層選單名稱
        this.prop_subtitle = MenuItemsModule.currentMenuItem.title + " - " + this.thirdMenuName;
      }
    });
  }
  // 初載入選單
  async createMenuTree(){
    await this.$authApi
      .getAuthorizedMenuTreeUsingGET()
      .then((resp) => {
        const nodes = resp.data;
        let menuItems = nodes.children.map((c) => this.toMenuItem(c));
        MenuItemsModule.setMenuItems(menuItems);
        // TEST:
        // console.log('createMenuItems', MenuItemsModule.menuItems$);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // menu 長結構 (未含 count)
  public toMenuItem(node: MenuNode): FblMenuItem {
    const item = node.item;
    // 若 subtitle 與當前選單不符合 則更新 subtitle 資訊
    if(item.uri == this.$route.path && !this.prop_subtitle.includes(item.menuName)){
      this.prop_subtitle = item.menuName;
    }
    return {
      key: item.menuId,
      title: item.menuName,
      route: item.uri,
      // uri:
      children: node.children.map((c) => this.toMenuItem(c)),
      disabled: item.isLeaf && !item.enable,
    };
  }

  /**
   *  created時取得子選單事件顯示數量更新以及定時更新的分鐘數
   *  和手動更新共用同一個方法
   * */
  async getMenuTreesWithCaseCounts(userId) {
    let menuKeyAndCaseCountsmap = new Map();
    let menuKeyAndEmergecyCasesMap = new Map();

    await this.$caseCountsApi
      .getMenuCasesCountUsingPOST("Y", {userId})
      .then((res) => {
        const object = res.data;
        for (let key in object) {
          menuKeyAndCaseCountsmap.set(key, (object[key] as CaseCountDto).caseCount);
          menuKeyAndEmergecyCasesMap.set(key, (object[key] as CaseCountDto).emergencyCase);
        }
        let menuItems = [...MenuItemsModule.menuItems$];
        menuItems.forEach((parentMenu) => {
          if (parentMenu.children != null) {
            parentMenu.children.forEach((e) => {
              e.casesCount = menuKeyAndCaseCountsmap.get(e.key);
              e.emergencyCase = menuKeyAndEmergecyCasesMap.get(e.key);
            });
          }
        });
        MenuItemsModule.setMenuItems(menuItems);
        // TEST:
        // console.log('addCount:', MenuItemsModule.menuItems$);
      })
      .catch((error) => {
        console.log(error);
      });
    Object.keys(menuKeyAndCaseCountsmap).map(key => {
      menuKeyAndCaseCountsmap.set(key, menuKeyAndCaseCountsmap[key]);
    });
  }
  // ============================================================ //


  /**
   * 檢查token時效，如果有效則更新，無效則清除
   * 搬進LoginModules
   */
  // validateToken() {
  //   // console.log("檢查token時效，如果有效則更新，無效則清除。");
  //   if (LoginModule.hasValidToken) {
  //     this.$authApi
  //       .renewValidTokenUsingPOST({ token: LoginModule.loginState.accessToken })
  //       .then(async (resp) => {
  //         if (resp.data) {
  //           await LoginModule.signIn(resp.data.token);
  //         } else {
  //           await LoginModule.signOut();
  //         }
  //       });
  //   } else {
  //     LoginModule.signOut();
  //   }
  // }

  //更新視窗大小
  onResize() {
    this.windowSize.windowHeight = window.outerHeight;
    this.windowSize.windowWidth = window.outerWidth;
  }
  
  onAvatarAction(action: FblAvatarAction) {
    switch (action.name) {
      case "logout":
        this.signOut();
        break;
    }
  }
  
  signOut() {
    // if (this.tokenCheckTimeoutID != -1) {
    //   window.clearInterval(this.tokenCheckTimeoutID);
    // }
    // if (this.casesCountIntervalTimeoutID != -1) {
    //   window.clearInterval(this.casesCountIntervalTimeoutID);
    // }
    clearInterval(this.casesCountIntervalTimeoutID);

    // 清除閒置時間timer
    clearInterval(this.counter);
  
  // 清空vuex裡menu的相關物件
    MenuItemsModule.clearMenuItems();
    LoginModule.signOut();
    
  }

  
  

  /**
   * Event
   */
  //第三層選單切換按鈕
  thirdMenuButtonClick(data) {
    MenuItemsModule.updateThirdMenuId(data.menuId);
    MenuItemsModule.updateReviewableSettingSearchDto(null);    
    this.prop_ThirdMenuId = MenuItemsModule.thirdMenuId$;
    this.prop_subtitle = MenuItemsModule.currentMenuItem.title + " - " + data.menuName;
  }


  /**
   * Getter
   */
  // 判斷第三層選單清單是否為空(用於判斷是否顯示第三層選單、變更子標題內容)
  get isThirdMenuListEmpty() {
    if (this.prop_thirdMenuList.length > 0) {
      return false;
    } else {
      if (!VlidationUtil.isEmpty(MenuItemsModule.currentMenuItem)) {
        this.prop_subtitle = MenuItemsModule.currentMenuItem.title;
      } else {
        this.prop_subtitle = "";
      }
      return true;
    }
  }


  /**
   * Hooks
   */
  async created() {
    // 一旦關閉視窗就會登出
    window.addEventListener("onubload", (event) => {
      if (localStorage.getItem(this.LOGIN_STATE)) {
        this.signOut();
      }
    });

    // 讀取token有效期限
    if (LoginModule.token) {
      const decoded = jwt.decode(LoginModule.token);
      if (decoded) {
        // token效期單位是秒
        this.timeoutTime = Math.floor((decoded.exp * 1000 - Date.now()) / 1000);
      }
    }
    this.counter = setInterval(() => {
      if (this.idleTime < this.timeoutTime) {
        // 一旦發現沒有"登入狀態"即馬上登出
        if (!localStorage.getItem(this.LOGIN_STATE)) {
          this.signOut();
        } else {
          this.idleTime = this.idleTime + 1;
        }
      } else {
        clearInterval(this.counter);
        clearInterval(this.casesCountIntervalTimeoutID);
        // 清空vuex裡menu的相關物件
        MenuItemsModule.clearMenuItems();
        LoginModule.signOutWithoutToLogin();
        // this.signOut();
          Modal.warning({
            content: this.$t('mainPage_idleWarning').toString(), // 您的作業已逾時,系統己登出。因連線在未進行任何操作30分鐘後逾時，請再重新登入。
            okText: this.$t("global_ok").toString(), // 確定
            centered: true,
            onOk: () => {
              router.push({ path: '/login' });
            },
          });
      }
    }, 1000);
    //初始化偵測瀏覽器的初始值
    // this.windowSize= {windowHeight: window.outerHeight,windowWidth: window.outerWidth};
    // 啟動前端偵測token
    // LoginModule.isTokenVerify();

    // 如果重新整理將不會有值，啟動倒數偵測token
    if(!LoginModule._loginState$.accessToken){
      LoginModule.isTokenVerify();
    }
    this.onResize();
    this.oldPagePath = this.$route.name;
    this.currentPageForThridMenu = this.oldPagePath;

    // console.log("JWTtoken: ",JSON.parse(atob(JSON.stringify(JSON.parse(localStorage.getItem("login_state")).accessToken).split(".")[1])));
    

    //初始化 sys_common_code 對照表
    MappingUtil.initSeletedList();

    //取得姓名和AD帳號
    let loginState = JSON.parse(localStorage.getItem(this.LOGIN_STATE));
    const state = LoginModule.loginState;
    if (state && state.me) {
      this.avatarText = loginState.me.employee.name + " " + loginState.me.id;
    } else {
      this.avatarText = "";
    }

    // MenuItemsModule.setMenuItems(this.menuItems);
    /**
     * 搬進LoginModule
     */
    // let tokenRefreshMinutes = Number(
    //   process.env.VUE_APP_API_TOKEN_REFRESH_MINUTES
    // );
    // if (tokenRefreshMinutes && tokenRefreshMinutes > 0) {
    //   this.validateToken();
    //   this.tokenCheckTimeoutID = window.setInterval(
    //     this.validateToken,
    //     1000 * 60 * tokenRefreshMinutes
    //   );
    // }
    
    //監聽window size
    window.addEventListener("resize", this.onResize);


    await this.createMenuTree();
    //取得電訪事件更新數量
    // TODO: 等UAT訂版後開放測試
    this.getMenuTreesWithCaseCounts(loginState.me.id);
    //呼叫後端caseCountsApi定時更新時間 設定更新頻率
    this.$caseCountsApi
      .getcasesCountsUpdateIntervalUsingGET()
      .then((resp) => {
        this.casesCountInterval = parseInt(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // 定時更新電訪項目顯示數量  // 目前每10分鐘刷新一次
    this.casesCountIntervalTimeoutID = window.setInterval(
      () => this.getMenuTreesWithCaseCounts(loginState.me.id),
      1000 * 60 * this.casesCountInterval
    );

  }

  /**
   * 重置閒置時間
   */
  idleCheck() {
    this.idleTime = 0;
  }


  beforeMount() {
    // VL903-347 關閉或重整顯示提示視窗
    window.onbeforeunload = () => {
        return "mesage"; // 需要 return 才能出現視窗
    };
  }
  mounted() {
    this.onResize();

    //監聽window size
    // window.addEventListener("resize", this.onResize);
  }

  //移除監聽事件
  beforeDestroy() {
    // window.removeEventListener("resize", this.onResize);
  }
  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * 監聽
   */
  @Watch("$route", { immediate: true, deep: true })
  watchRouteChange(val,old) {
    const { name } = val;
    if (this.oldPagePath != name) {
      this.oldPagePath = name;
      if(old) {
        this.oldPagePath = old.name;
      }
      this.isSamePage = false;
      this.watchFrontSize(this.windowSize);
      //OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面
      this.isShowHeader = (name !== "OnDuty"); // 如果是 執機畫面 不顯示 header
    }

    if(old){
      this.currentPageForThridMenu = old.name;
    }
  }

  //監聽視窗大小是否變更
  @Watch("windowSize", { deep: true })
  watchFrontSize(val) {
    //將存存在localStorage的windowInfo取出
    WindowModule.windowSize();
    //讀取windowInfo的值
    const windowFont = WindowModule.size;
    //非值機畫面的提示訊息key值
    const notOnDuty = "notOnDuty";
    //值機畫面提示訊息key值
    const onDuty = "onDuty";
    //判斷是否有變更瀏覽器大小
    if (
      windowFont != null &&
      (val.windowHeight != windowFont.height ||
        val.windowWidth != windowFont.width) &&
      this.$route.name != "Main"
    ) {
      WindowModule.setRouterStatus();
    }

    //值機畫面與非值機畫面判斷
    if (this.$route.name == "OnDuty") {
      if (
        val.windowHeight > 1050 ||
        val.windowHeight < 1030 ||
        ((val.windowWidth > 2570 || val.windowWidth < 2550) &&
          WindowModule.isShowAlter)
      ) {
        notification.warning({
          key: onDuty,
          message: this.$t("mainP_browserSizeSuggestion").toString(), // 瀏覽器尺寸建議
          description: this.$t("mainP_browserSizeDescription2560").toString(), // 您目前使用的瀏覽尺寸，並非使用時的最佳狀態，請考慮使用 2560*1080 建議尺寸。
          duration: 5,
        });
        WindowModule.setRouterStatus();
      }
      //如果不符合需要提示的螢幕大小，並且顯示狀態為true的情況將狀態改回false
      if (WindowModule.isShowAlter) {
        WindowModule.setRouterStatus();
      }
    } else {
      if (
        (val.windowHeight > 1050 ||
          val.windowHeight < 1030 ||
          val.windowWidth > 1930 ||
          val.windowWidth < 1910) &&
        WindowModule.isShowAlter
      ) {
        notification.warning({
          key: notOnDuty,
          message: this.$t("mainP_browserSizeSuggestion").toString(), // 瀏覽器尺寸建議
          description: this.$t("mainP_browserSizeDescription1920").toString(), // 您目前使用的瀏覽尺寸，並非使用時的最佳狀態，請考慮使用 1920*1080 建議尺寸。
          duration: 5,
        });
        WindowModule.setRouterStatus();
      }
      //如果不符合需要提示的螢幕大小，並且顯示狀態為true的情況將狀態改回false
      if (WindowModule.isShowAlter) {
        WindowModule.setRouterStatus();
      }
    }
    //設定新的瀏覽器長寬
    WindowModule.setWindowSize(val);
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

  // 取得當下errorMessage的資訊
  get errorMessageMention() {
    return ErrorMessageModule.errorMessage;
  }

  // 監聽錯誤訊息
  @Watch('errorMessageMention', { deep: true })
  wathchErrorMessageState(newVal: string, oldVal: string) {
    if(newVal == '500') {
      Modal.error({
        okText: this.$t('global_ok').toString(), // 確定
        title: this.$t('global_error').toString(),
        content: this.$t('mainP_500ErrorMessage').toString(),
        onOk: () => {
          // 清除當前錯誤資訊
          ErrorMessageModule.clearErrorSatae();
        }
      });
    }
  }
}
</script>

<style lang="less">
/* .logo {
  height: 52px;
  background: rgba(255, 255, 255, 0.2); 
  background-color: #5B5B5B;
  margin-bottom: 16px;
  color: white;
  font-size: 20px;
} */

/*submenu，調間距*/
.ant-menu-inline .ant-menu-submenu-title {
  margin-top: 0px;
  margin-bottom: -5px;
}

/*menu，調間距*/
.ant-menu-inline .ant-menu-item:not(:last-child) {
  margin-top: 0px;
  margin-bottom: -5px;
}

/*menu最後一行，調間距*/
.ant-menu-inline .ant-menu-item {
  margin-top: 0px;
}

/* .ant-menu-submenu-title {
    background-color: #BBDDE2;
    height: 40px;
    line-height: 40px;
} */

.btn {
  margin-left: 5px;
}

.ant-layout-sider {
  /* background-color: red; */
  background-image: url("~@/assets/imgs/MenuBackground.svg");
}

/* .ant-layout-sider-children {
  border-style:solid;
  border-color: #ADADAD;
  border-width: 1px;
} */

.ant-popover-inner {
  border-radius: 4px;
}

.ant-menu-inline {
  border-right: none;
}
.ant-menu-item span:not(.ant-scroll-number-only) {
  margin-left: 10px;
}
.ant-menu-submenu-title span {
  margin-left: 5px;
}
/* .ant-menu-sub span{
   margin-left: 20px;
 } */
.thirdMenuClass > .ant-space-item > .ant-btn:hover {
  border-color: #7ca7db;
  .text-white-format()
}

.thirdMenuClass > .ant-space-item > .ant-btn {
  border-color: #7ca7db;
  .text-white-format()
}
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
