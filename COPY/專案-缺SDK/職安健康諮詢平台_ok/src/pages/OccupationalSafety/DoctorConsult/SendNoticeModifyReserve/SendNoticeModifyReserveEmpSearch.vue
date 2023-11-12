<template>
  <div>
    <!-- Modal -->
    <div
      id="empSearchModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="empSearchModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <button
            type="button"
            class="modal-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="clearForm"
          >
            <a-icon type="close" />
          </button>
          <div class="modal-body">
            <div class="event__wrap">
              <div class="event__block">
                <div class="page__title mt-0">
                  員工查詢
                </div>
                <div class="block__content" />
              </div>
              <div class="event__block">
                <label class="a-form-label">員工姓名 or 身分證字號 or 員編</label>
                <div class="d-flex">
                  <a-input
                    v-model="userInfo"
                    placeholder="請輸入姓名 or 身分證字號 or 員編"
                    class="input__search"
                    type="text"
                    vue="true"
                    alt="webfont"
                  />
                  <button
                    class="btn__radius--primary btn__search"
                    @click="onSearch"
                  >
                    <a-icon type="search" />
                  </button>
                </div>
              </div>
              <hr>
              <div
                v-if="isSearching"
                class="event__block"
              >
                <div
                  v-if="resultDatas.length > 1"
                  class="mb-3"
                >
                  發現多位同姓名員工，請擇一進行預約。
                </div>
                <div v-if="resultDatas.length === 0">
                  查無此人
                </div>
                <div
                  v-if="resultDatas.length > 0"
                  class="userDataCard"
                >
                  <a-radio-group
                    v-model="chooseIndex"
                    class="w-100"
                  >
                    <div
                      v-for="(user, index) in resultDatas"
                      :key="user.insId"
                    >
                      <img
                        src="@/assets/images/image_face.svg"
                        alt=""
                        class="float-end"
                      >
                      <div class="card mb-3">
                        <div class="row">
                          <div class="col-2 col-lg-1 card__radio p-0 m-auto">
                            <a-radio :value="index" />
                          </div>
                          <div class="col-10 col-lg-11 p-0 ps-2">
                            <div class="card__name">
                              {{ user.userName }}
                            </div>
                            <div class="row card__content d-flex align-items-center ps-2">
                              <div class="col-lg-4 card__id p-0 pb-2">
                                <div class="card__label">
                                  身分證字號
                                </div>
                                <div class="card__val">
                                  {{ user.id }}
                                </div>
                              </div>
                              <div class="col-lg-3 card__num p-0 pb-2">
                                <div class="card__label">
                                  員工編號
                                </div>
                                <div class="card__val">
                                  {{ user.userId }}
                                </div>
                              </div>
                              <div class="col-lg-5 card__bossDep p-0 pb-2">
                                <div class="card__label">
                                  部門單位
                                </div>
                                <div class="card__val">
                                  {{ user.department }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-radio-group>
                </div>
              </div>
            </div>
            <div class="btn__wrap d-flex justify-content-center">
              <button
                class="btn__radius--primary--outline me-1"
                data-bs-dismiss="modal"
                @click="clearForm"
              >
                取消
              </button>
              <button
                class="btn__radius--primary ms-1"
                :disabled="resultDatas.length === 0"
                data-bs-dismiss="modal"
                @click="onNext"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import notification from '@/plugins/notification/infoNotification';
import { Action } from 'vuex-class';

@Component
export default class SendNoticeModifyReserveEmpSearch extends Vue {
  @Action('setLoading') setLoading;

  // 輸入內容
  userInfo = '';

  // 查詢結果(員工資料)
  resultDatas = [];

  // 正在查詢
  isSearching = false;

  // 選擇的員工index
  chooseIndex = 0;

  // 確定
  onNext() {
  	if (this.chooseIndex || (!this.chooseIndex && this.resultDatas.length > 0)) {
  		this.$emit('getEmpName', this.resultDatas[this.chooseIndex]);
  		this.clearForm();
  	}
  }

  // 清除查詢資料
  clearForm() {
  	this.resultDatas = [];
  	this.userInfo = '';
  	this.isSearching = false;
  }

  // 查詢
  onSearch() {
  	this.isSearching = true;
  	this.resultDatas = []; // 清空
  	this.setLoading(true);
  	// 員工資料查詢
  	this.$PCRRpnSendRemindAndModifyReservationApi.queryAccountInfoUsingPOST(this.userInfo)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  	      this.resultDatas = resp.data.data;
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  #empSearchModal {
    margin-top: 30px;
    padding: 20px;
  }
  .a-form-label, .card__val {
    color: #000;
  }
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include rwd-sm {
      padding: 20px 70px;
    }
  }
  .event__block {
    margin-bottom: 20px;
  }
  .btn__wrap {
    margin-bottom: 50px;
    button {
      max-width: 100%;
      width: 100px;
      @include rwd-lg {
        width: 200px;
      }
    }
  }

  // 虛線
  hr {
    border: 1px dashed #CECECE;
    margin-top: 40px;
    margin-bottom: 20px;
  }

  // 搜尋
  .btn__search {
    border-radius: 0px 4px 4px 0px;
    height: 40px;
    width: 50px;
    padding: 5px 6px;
  }
  .input__search {
    border-radius: 4px 0px 0px 4px;
    height: 40px;
  }

  // 員工資訊卡
  .card {
    background-color: #F5F8FC;
    border-radius: 4px;
    padding: 20px;
  }
  .card__name {
    font-size: 18px;
    color: #000;
    font-weight: 600;
    padding-bottom: 15px;
  }
  .card__label {
    font-size: 14px;
    color: #999999;
  }
</style>
