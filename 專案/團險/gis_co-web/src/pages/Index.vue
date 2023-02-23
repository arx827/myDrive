<template>
  <div>
    <div
      class="banner"
      :style="{'background-image': `url(${bannerImageUrl})`}"
    >
      <!-- 四級權限人員無代辦功能查詢 -->
      <div
        v-if="!this.$user.getMe().authNameList.includes('四級權限')"
        class="notification d-flex"
      >
        <div class="notification__item d-flex flex-row justify-content-center">
          <div class="notification__item__circle flex-center">
            <div class="notification__item__num">
              {{ todolistAmount }}
            </div>
          </div>
          <div class="notification__item__text">
            待辦提醒
          </div>
        </div>
        <div class="notification__item  d-flex flex-row justify-content-center">
          <div class="notification__item__circle flex-center">
            <div class="notification__item__num">
              {{ noticeAmount }}
            </div>
          </div>
          <div class="notification__item__text">
            通知單
          </div>
        </div>
        <div class="notification__item d-flex flex-row justify-content-center notification__item--more">
          <router-link to="/todoCaseSearch/todoAllTable">
            <div class="notification__more flex-center">
              <div class="notification__more__text">
                詳細查詢
              </div>
              <div class="notification__more__img">
                <img
                  src="@/assets/index/button_next.svg"
                  alt=""
                >
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div
      class="announcement"
    >
      <div
        id="swiper"
        class="swiper-container"
      >
        <div class="swiper-wrapper">
          <template v-for="(item,index) in marketingData">
            <div
              :key="index"
              class="swiper-slide"
            >
              <div
                class="announcement__item"
                :class="{'announcement__item--pointer': item.urlStatus === '2' ? true : false}"
                :data-link="item.urlStatus === '2' ? item.urlLink : null"
              >
                <img
                  class="announcement__img"
                  :src="item.picBase64"
                >
                <template v-if="item.urlStatus === '1'">
                  <div
                    class="announcement__download flex-center"
                    :data-file="item.fileUuid"
                  >
                    <img
                      src="@/assets/button_download.svg"
                      alt=""
                    >
                  </div>
                </template>
                <div class="announcement__block">
                  <div class="announcement__info d-flex">
                    <div class="flex-column d-flex align-items-center">
                      <div class="announcement__info__title">
                        {{ item.productName }}
                      </div>
                      <div class="announcement__info__text">
                        {{ item.productDesc }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-for="(item,index) in emptyMarketing">
            <div
              :key="index"
              class="swiper-slide"
            >
              <div class="announcement__item announcement__item--empty">
                <img
                  class="announcement__img announcement__img--empty"
                  src="@/assets/index/image_empty.png"
                >
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="swiper-pagination" />
      <div class="swiper-prev">
        <img
          src="@/assets/index/button_next_left.svg"
          alt=""
        >
      </div>
      <div class="swiper-next">
        <img
          src="@/assets/index/button_next_right.svg"
          alt=""
        >
      </div>
    </div>
    <div class="billboard">
      <div class="billboard__header">
        <div class="container">
          <div class="row">
            <div class="col position-relative">
              <div class="billboard__main">
                公告訊息
              </div>
              <div class="billboard__sort flex-center">
                <div class="billboard__sort__text">
                  發布時間
                </div>
                <img
                  class="billboard__sort__img"
                  :src="announcementSort == 'desc' ? require(`@/assets/index/button_sort_2.svg`) : require(`@/assets/index/button_sort.svg`)"
                  alt=""
                  @click="announcementSort == 'desc'? announcementSort = 'asc' : announcementSort = 'desc'"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="announcementData !== []"
        class="billboard__content"
      >
        <div class="container">
          <div
            v-for="(item,index) in announcementData"
            :key="index"
            class="row"
          >
            <div class="col-2 d-flex">
              <div class="billboard__date">
                {{ item.startDate }}
              </div>
            </div>
            <div class="col-9">
              <div>
                <a-collapse
                  :bordered="false"
                  :active-key="item.activekey"
                >
                  <template v-for="(childitem,childindex) in item.content">
                    <a-collapse-panel
                      :key="`child${childindex}`"
                      :header="childitem.subject"
                      class="billboard__item"
                    >
                      <div class="billboard__text">
                        {{ childitem.content }}
                      </div>
                    </a-collapse-panel>
                  </template>
                </a-collapse>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import {
	GiMessageTypeQueryDto,
	HomePicInfo,
	GiMessageTypeDto,
	PolicyModel,
} from '@fubonlife/co-giiss-api-axios-sdk';
// eslint-disable-next-line import/no-cycle
import { UserService } from '@/plugins/user';
import infoModal from '@/plugins/info/infoModal';
import notification from '@/plugins/info/infoNotification';

Swiper.use([Navigation, Pagination]);

@Component({ components: {} })

export default class Index extends Vue {
  @Action('setLoading') setLoading;

	bannerImageUrl = '';

  swiper = null;

  isShowSwiper = false;

  // 不滿三個要補的空白行銷圖
  emptyMarketing: number = 0;

  // 行銷資料
  marketingData: HomePicInfo[] = null;

  // 公告資料
  announcementData = [];

  // 公告sort
  announcementSort: 'desc' | 'asc' = 'desc';

  // 公告API request
  announcementRequest: GiMessageTypeQueryDto = {
  	 // 0：全部 1：登入前 2：登入後
  	customer: '0', // 0：全部 1：RC 8：CB
  	sortOrder: this.announcementSort, // desc、asc
  	pageNo: 0,
  	pageSize: 99999,
  }

  // 待辦提醒與通知單數量API的request
  policyModel: PolicyModel;

  // 待辦提醒數量
  todolistAmount = 0;

  // 通知單數量
  noticeAmount = 0;

  // 是否關閉彈窗
  isClosingLoading: boolean = false;

  // watch
  @Watch('announcementSort')
  onAnnouncementSortChange(val) {
  	this.announcementRequest.sortOrder = val;
  	console.log('change', val, this.announcementRequest);
  	this.getAnnouncement();
  	this.isClosingLoading = true;
  }

  // Hook

  created() {
  	this.policyModel = this.$userInfo.getPolicyModel();
  	this.creatLoad();
  }

  mounted() {
  	document.addEventListener('click', (e) => {
  		const targetClass = (e.target as HTMLButtonElement).className;
  		const url = (e.target as HTMLButtonElement).getAttribute('data-link');
  		if (targetClass === 'announcement__item') {
  			console.log('swiper-slide link', url);
  			if (url) {
  				window.open(url, '_blank');
  			}
  		}
  	}, false);
  }

  // 載入獲取
  async creatLoad() {
  	const vm = this;
  	this.setLoading(true);
  	this.$user.changeisChangingToken(true);
  	await this.$globalAuthApi.getJwtByAccountUsingPOST({
  		headers: {
  				Authorization: `Bearer ${this.$user.loginState.accessToken}`,
  			},
  	})
  		.then(async (resp) => {
  			this.$user.changeisChangingToken(false);
  			if (resp.data.status === 200) {
  				const getData = resp.data.data as any;
  				const loginStateObj = JSON.parse(sessionStorage.getItem('login_state'));
  				this.$user.changeLoginStateAccessToken(getData.accessToken);
  				loginStateObj.accessToken = getData.accessToken;
  				await sessionStorage.setItem('login_state', JSON.stringify(loginStateObj));
  				this.getTodolistAndNoticesAmount(true);
  				this.getTodolistAndNoticesAmount(false);
  				await Promise.all([this.getAnnouncement(), this.getBanner(), this.getMarketing(), this.getAnnouncement()])
  					.then((resp) => {
  						console.log(resp);
  					})
  					.catch(console.error)
  					.finally(() => {
  						this.setLoading(false);
  					});
  			} else {
  				infoModal.alertForSingleError({
  					title: '錯誤訊息',
  					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					onCallback() {
  						vm.$user.signOut(false);
  	          vm.$router.replace({ path: '/login' });
  					},
  				});
  				this.setLoading(false);
  			}
  		})
  		.catch((resp) => {
  			this.$user.changeisChangingToken(false);
  			notification.error({
  				Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  			});
  			this.setLoading(false);
  		})
  		.finally(() => {
  			this.$user.changeisChangingToken(false);
  		});
  }

  // 撈取首頁banner
  getBanner() {
  	this.setLoading(true);
  	 return this.$homeNoticeApi
  		.oneBannerPictureUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.bannerImageUrl = resp.data.data.picBase64;
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log(error);
  		})
  		.finally();
  }

  // 撈取行銷資料
  getMarketing() {
  	this.setLoading(true);
  	const vm = this;
  	return this.$homeNoticeApi
  		.listMarketingInfoUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				console.log('撈取行銷資料', resp);
  				this.marketingData = resp.data.data;
  				// 計算是否不滿三則行銷資料
  				if ((this.marketingData.length - 3) >= 0) {
  					this.emptyMarketing = 0;
  				} else {
  					this.emptyMarketing = 3 - this.marketingData.length;
  				}
  				this.$nextTick(() => {
  					this.swiper = new Swiper('#swiper', {
  						initialSlide: 0,
  						slidesPerView: 3,
  						loop: true,
  						speed: 1000,
  						spaceBetween: 8,
  						autoplay: false,
  						pagination: {
  							el: '.swiper-pagination',
  							clickable: true,
  						},
  						navigation: {
  							nextEl: '.swiper-next',
  							prevEl: '.swiper-prev',
  						},
  					});
  					this.$nextTick(() => {
  						document.querySelectorAll('.announcement__item').forEach((ele) => {
  							ele.addEventListener('click', (e) => {
  								e.stopPropagation();
  								console.log(ele);
  								const link = (ele as HTMLButtonElement).getAttribute('data-link');
  								if (link !== null) { window.open(link, '_blank'); }
  							});
  						});
  						document.querySelectorAll('.announcement__download').forEach((ele) => {
  							ele.addEventListener('click', (e) => {
  								e.stopPropagation();
  								const file = (ele as HTMLButtonElement).getAttribute('data-file');
  								if (file !== null) { vm.downloadFile(file); }
  							});
  						});
  					});
  				});
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log(error);
  		})
  		.finally();
  }

  // 撈取公告資料
  getAnnouncement() {
  	this.setLoading(true);
  	const vm = this;
  	// 確認是否有登入
  	let returnApi = null;

  	const loginData = JSON.parse(sessionStorage.getItem('login_state'));
  	this.announcementRequest.customer = loginData.me.policyNo.substring(0, 1);
  	returnApi = this.$homeNoticeApi
  		.listAnnouncementUsingPOST(this.announcementRequest)
  		.then((resp) => {
  			console.log('登入後', resp);
  			if (resp.data.status === 200) {
  				if (resp.data.data.content.length > 0) {
  					let topItem = null;
  					const input = resp.data.data.content.map(({ startDate, top, ...rest }) => ({
  						startDate,
  						content: [{ ...rest }],
  						top,
  					}));
  					const output = [];
  					input.forEach((item) => {
  						if (item.top == 'N') {
  							const existing = output.filter((v, i) => v.startDate == item.startDate);
  							if (existing.length) {
  								const existingIndex = output.indexOf(existing[0]);
  								output[existingIndex].content = output[existingIndex].content.concat(item.content);
  							} else {
  								if (typeof item.content == 'string') item.content = [item.content];
  								output.push(item);
  							}
  						} else {
  							topItem = {
  								startDate: item.startDate,
  								content: item.content,
  								top: item.top,
  							};
  						}
  					});
  					if (topItem) {
  						output.unshift(topItem);
  					}
  					this.announcementData = output.map((e) => {
  						e.activekey = e.content.map((e, index) => `child${index}`);
  						return e;
  					});
  					console.log('this.announcementData', this.announcementData);
  					console.dir(output);
  				}
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log(error);
  		})
  		.finally(() => {
  			this.isClosingLoading && this.setLoading(false);
  			this.isClosingLoading = false;
  		});
  	return returnApi;
  }

  // 撈取待辦提醒或通知單總數
  getTodolistAndNoticesAmount(isTodoList) {
  	// isTodoList true 待辦事項、false 通知單
  	this.setLoading(true);
  	return this.$toDoListAndNoticeApi.toDoListAndNoticeAmountUsingPOST(isTodoList, this.policyModel)
  		.then((resp) => {
  			if (resp.status === 200) {
  				if (isTodoList) {
  					this.todolistAmount = resp.data.data;
  				} else {
  					this.noticeAmount = resp.data.data;
  				}
  			}
  		}).catch((err) => {
  			console.log(err);
  		}).finally();
  }

  // 行銷檔案下載
  downloadFile(uid) {
  	this.setLoading(true);
  	this.$homeNoticeApi
  		.oneDownloadFileUsingPOST(uid, { responseType: 'blob' })
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
  			} else {
  				this.$homeNoticeApi.oneDownloadFileUsingPOST(uid)
  		    .then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally();
  			}
  		})
  		.catch((error) => {
  			console.log(error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
.banner{
  width: 100%;
  height: 250px;
  background: no-repeat center center;
  background-size: cover;
  position: relative;
}
.notification{
  background-color: #fff;
  position: absolute;
  right: 50%;
  bottom: 0px;
  transform: translate(50%, 50%);
  padding: 24px 20px;
  width: 100%;
  max-width: 536px;
  border-radius: 50vh;
  box-shadow: 0px 8px $COLOR-MAIN2;
  border: solid 1px $COLOR-MAIN2;
  .notification__item--more{
    margin-left: auto;
  }
  .notification__item__circle{
    width: 25px;
    height: 25px;
    background-color: $COLOR-MAIN1;
    border-radius: 100%;

  }
  .notification__item__num{
    font-size: 14px;
    color: #fff;
    line-height: 14px;
    padding-bottom: 1px;
  }
  .notification__item__text{
    font-size: 18px;
    margin-left: 5px;
    margin-right: 20px;
  }
}
.notification__more{
  cursor: pointer;
  .notification__more__text{
    font-size: 14px;
    font-weight: bold;
    color: $COLOR-MAIN3;
  }
  .notification__more__img{
    width: 6px;
    height: auto;
    margin-left: 15px;
  }
}
.announcement{
  margin-top: 96px;
  width: 100%;
  max-width: 1204px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 58px;
  padding: 0px 58px;
  padding-bottom: 40px;
  position: relative;
  .announcement__item{
    position: relative;
    width: 100%;
    padding-bottom: 98.5%;
  }
  .announcement__item--pointer{
    cursor: pointer;
  }
  .announcement__item--empty{
   background-color: #f5f5f5;
   border-radius: 2px;
  }
  .announcement__img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .announcement__img--empty{
    max-width: 110px;
    object-fit: none;
  }
  .announcement__block{
    width: 100%;
    position: absolute;
    bottom: 0;
  }
  .announcement__info{
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 20px 40px;
    min-height: 150px;
    justify-content: center;
  }
  .announcement__info__title{
    color: #fff;
    font-size: 22px;
    margin-bottom: 14px;
    font-weight: bold;
  }
  .announcement__info__text{
    color: #fff;
  }
  .announcement__download{
    cursor: pointer;
    position: absolute;
    top: 19px;
    right: 29px;
    width: 33px;
    height: 33px;
    background-color: rgba(0,0,0,0.65);
    border-radius: 4px;
    img{
      width: 18px;
      height: 18px;
    }
  }
}
#swiper{
  position: relative;
}
.swiper-prev{
  position: absolute;
  left: 0px;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  cursor: pointer;
}
.swiper-next{
  position: absolute;
  right: 0px;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  cursor: pointer;
}
.swiper-pagination{
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
}
::v-deep .swiper-pagination-bullet{
  width: 28px;
  height: 7px;
  border-radius: 0px;
  margin: 0px 4px;
  background-color: #E9ECEF;
  opacity: 1;
}
::v-deep .swiper-pagination-bullet-active{
  background-color: #485057;
  opacity: 1;
}
.billboard{
  position: relative;
  .billboard__sort{
    position: absolute;
    bottom: 10px;
    left: 8px;
    color: #fff;
    .billboard__sort__text{
      font-weight: bold;
    }
    .billboard__sort__img{
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .billboard__header{
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    background-color: $COLOR-MAIN2;
    z-index: 1;
    position: relative;
    padding: 15px 0px;
  }
  .billboard__line{
    width: 100%;
    height: 9px;
    background-color: $COLOR-MAIN2;
  }
  .billboard__main{
    text-align: center;
    color: #fff;
    font-size: 36px;
    font-weight: bold;
  }
  .billboard__content{
    background-color: #fff;
    .container{
      max-height: 550px;
      padding-top: 10px;
      overflow-y: scroll;
    }
  }
  .billboard__date{
    padding: 5px;
    font-weight: 300;
    font-size: 16px;
    word-break: break-word;
     @include rwd-xl(){
      padding-right: -47px;
    }
  }
  .billboard__item{
    padding: 10px 14px;
    background-color: #F2F8FF;
    margin-bottom: 10px;
    margin-left: 0px;
    font-size: 16px;
    border-radius: 4px;
    border: solid 1px transparent;
    &:hover{
      border: solid 1px $COLOR-MAIN6;
    }
    @include rwd-xl(){
      margin-left: -47px;
    }
  }
  .billboard__title{
    color: $COLOR-MAIN6;
    margin-bottom: 5px;
    font-size: 16px;

  }
  .billboard__text{
    font-size: 16px;
    line-height: 22px;
    padding-top: 5px;
  }
}
::v-deep .ant-collapse > .ant-collapse-item > .ant-collapse-header{
  color: $COLOR-MAIN6;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 5px;
}
::v-deep .ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box{
  padding-top: 0px;
  padding-bottom: 0px;
}
::v-deep .ant-collapse > .ant-collapse-item > .ant-collapse-header{
  padding-left: 43px;
  margin-bottom: 0px !important;
}
</style>
