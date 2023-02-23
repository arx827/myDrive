<template>
  <header>
    <div class="gradiant__bar" />
    <div
      class="header__main"
    >
      <div class="container">
        <div class="float-start">
          <router-link to="/">
            <img
              src="@/assets/image_logo.svg"
              alt="fubon"
            >
          </router-link>
        </div>
        <div
          v-if="this.$user.hasValidToken()"
          class="header__menu float-end"
        >
          <ul class="header__menu-list">
            <li
              v-for="(main, index) in menu"
              :key="index"
            >
              <router-link
                v-if="main.item.menuName === '首頁'"
                to="/"
              >
                {{ main.item.menuName }}
              </router-link>
              <a-dropdown v-if="main.children.length > 0 && main.item.menuName !== '首頁'">
                <a
                  v-if="main.children.length > 0"
                  class="ant-dropdown-link"
                  @click="e => e.preventDefault()"
                >
                  {{ main.item.menuName.trim() }}
                </a>
                <a-menu
                  v-if="main.children.length > 0"
                  slot="overlay"
                >
                  <a-menu-item
                    v-for="(sub, idx) in main.children"
                    :key="idx"
                    class="sub__menu"
                    @click="toPage(sub.item.route)"
                  >
                    <a href="javascript:void(0)">
                      {{ sub.item.menuName.length > 10 ? sub.item.menuName.substring(0, 9) + '\n' + sub.item.menuName.substring(9, sub.item.menuName.length) : sub.item.menuName.trim() }}
                    </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </li>
            <li class="position-relative">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>操作手冊下載</span>
                </template>
                <a
                  href="#"
                  class="align-text-top"
                  @click="downManual"
                >
                  <img
                    src="@/assets/button_manual.svg"
                    alt=""
                  >
                </a>
              </a-tooltip>
            </li>
          </ul>
          <ul class="header__menu-list">
            <!-- <li>
              <a href="#">
                <img
                  src="@/assets/button_search.svg"
                  alt=""
                >
              </a>
            </li> -->
            <li class="position-relative">
              <div
                @mouseenter="showMemberCard = true"
                @mouseleave="showMemberCard = false"
              >
                <a
                  href="#"
                >
                  <img
                    src="@/assets/button_ID.svg"
                    alt=""
                  >
                </a>
                <div
                  class="member"
                >
                  <div
                    v-show="showMemberCard"
                    class="member__card"
                  >
                    <div class="member__card-topBg">
                      <img
                        class="member__card-icon mx-auto"
                        src="@/assets/image_IDface.svg"
                        alt=""
                      >
                    </div>
                    <div class="member__card-data">
                      <p
                        class="member__card-name"
                      >
                        {{ username }}
                      </p>
                      <p
                        class="member__card-email"
                      >
                        {{ usermail }}
                      </p>
                      <p class="member__card-subtitle">
                        保單證號-序號
                      </p>
                      <p class="member__card-text">
                        {{ policyId }}-{{ policySeq }}
                      </p>
                      <p class="member__card-subtitle">
                        要保單位名稱
                      </p>
                      <p class="member__card-text">
                        {{ fullName }}
                      </p>
                    </div>
                    <div class="member__card-bottom">
                      <button
                        class="btn__radius--primary w-100"
                        @click="signOut"
                      >
                        登出
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Subject, range } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Action } from 'vuex-class';
import axios from 'axios';
import infoNotification from '@/plugins/info/infoNotification';

@Component
export default class Header extends Vue {
  @Action('setLoading') setLoading;

  unsubscribe$ = new Subject<void>();

  showMemberCard = false;

  mouseposX = 0 ;

  username = '';

  usermail = '';

  currentRouter = null;

  policyId: number;

  policySeq = '';

  fullName = '';

  menu = [];

  @Watch('$route.path')
  onRouterChanged(val) {
  	this.currentRouter = val;
  	console.log('watch this.$router', this.$route.path);
  }

  created() {
  	this.currentRouter = this.$route.path;
  	this.$user.loginState$
  		.pipe(takeUntil(this.unsubscribe$))
  		.subscribe((state) => {
  			if (state && state.me) {
  				const user = state.me;
  				this.username = user.userName;
  				this.usermail = user.userEmail;
  				const policyDetail = state.policyDetail;
  				this.fullName = policyDetail.fullName;
  				this.policySeq = policyDetail.poliSeq;
  				this.policyId = policyDetail.poliId;
  				this.menu = user.menu.children[0].children;
  		    // this.renderMenu();
  			}
  		});
  }

  renderMenu() {
  	this.$menuApi.getMenuTreeByCurrentUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				console.log(resp.data.data.children[0].children);
  				this.menu = resp.data.data.children[0].children;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
  }

  toPage(name) {
  	this.$global.clearParam();
  	if (name == this.$route.name) {
  		this.$router.replace('/refresh');
  	} else {
  		this.$router.push({ name });
  	}
  }

  destroyed() {
  	this.unsubscribe$.next();
  	this.unsubscribe$.complete();
  }

  async signOut() {
  	await this.$user.signOut(true);
  	this.$router.replace({ path: '/login' });
  }

  downManual() {
  	this.setLoading(true);
  	const request = this.$userInfo.getProject() === 'RC' ? 'RC_USER_MANUAL' : 'CB_USER_MANUAL';
  	this.$homeNoticeApi.downloadUserManualUsingPOST(request, { responseType: 'blob' })
  		.then((resp) => {
  			console.log(resp);
  			let filename = '';
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
          resp.data as Blob,
          filename,
          resp.headers['content-type'],
  				);
  				this.setLoading(false);
  			} else {
  				this.$homeNoticeApi.downloadUserManualUsingPOST(request)
  		    .then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						infoNotification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally(() => {
  			        this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log(error);
  		});
  }
}
</script>

<style lang="scss" scoped>
  /**
   *  header 區塊
   * ----------------------------------
   */
  header {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    right: 0;
    z-index: 100;
  }
  .header__top {
    background: #363636;
    width: 100%;
    height: 110px;
  }
  .header__main {
    background: #ffffff;
    width: 100%;
    height: 72px;
    box-shadow: 0 3px 6px #00000029;
    display: flex;
    align-items: center;
  }
  .header__menu-list {
    // display: inline-flex;
    // align-items: center;
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    font-size: 15px;
    li {
      display: inline-block;
      a {
        display: inline-block;
        color: black;
        margin-right: 6px;
        @include rwd-lg(){
          margin-right: 25px;
        }
        &:hover {
          font-weight: bold;
        }
      }
    }
  }
  .sub__menu {
    white-space: pre-wrap;
  }
  .member{
    background-color: rgba(0, 0, 0, 0);
    position: absolute;
    min-width: 179px;
    right: 50%;
    transform: translateX(50%);
    top: 30px;
  }

  .member__card {
    margin-top: 35px;
    background: #ffffff;
    border-radius: 3px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    padding-bottom: 18px;
    overflow: hidden;
  }
  .member__card-topBg {
    background: rgb(30,177,218);
    background: linear-gradient(95deg, rgba(30,177,218,1) 0%, rgba(0,134,170,1) 100%);
    height: 51px;
    text-align: center;
    margin-bottom: 25px;
  }
  .member__card-icon {
    position: relative;
    bottom: -25px;
  }
  .member__card-data {
    text-align: center;
    margin-bottom: 15px;
    padding: 0 12px;
  }
  .member__card-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 0;
  }
  .member__card-email {
    font-size: 10px;
    margin-bottom: 0;
  }
  .member__card-subtitle{
    font-size: 10px;
    font-weight: bold;
    margin-bottom: 0;
    margin-top: 10px;
  }
  .member__card-text{
    font-size: 10px;
    margin-bottom: 0;
  }
  .member__card-bottom {
    padding: 0 18px;
  }

  ::v-deep {
    .login__submenu {
      min-height: 140px;
      .fubon__gradiant {
        height: 50px;
      }
    }
  }

</style>
