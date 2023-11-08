<template>
  <div>
    <a-modal
      v-model="modalVisible"
      :mask-closable="false"
      :footer="null"
      :width="'50%'"
      class="common__modal"
      :after-close="onClose"
    >
      <div class="event__block">
        <div class="page__title mt-0">
          員工查詢
        </div>
        <div class="block__content" />
      </div>
      <div
        class="event__block"
      >
        <div class="mb-3">
          發現多位同姓名員工，請擇一進行個案維護。
        </div>
        <div
          class="userDataCard"
        >
          <a-radio-group
            v-model="chooseIndex"
            class="w-100"
          >
            <div
              v-for="(user, index) in resultDatas"
              :key="user.userId"
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
                          {{ user.id ? user.id : '--' }}
                        </div>
                      </div>
                      <div class="col-lg-3 card__num p-0 pb-2">
                        <div class="card__label">
                          員工編號
                        </div>
                        <div class="card__val">
                          {{ user.userId ? user.userId : '--' }}
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
      <div class="btn__wrap d-flex justify-content-center">
        <button
          class="btn__radius--primary--outline me-1"
          @click="onClose"
        >
          取消
        </button>
        <button
          class="btn__radius--primary ms-1"
          @click="onNext"
        >
          確定
        </button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component
export default class CaseMaintainEmpSearch extends Vue {
  // 查詢結果(員工資料)
  @Prop()
  resultDatas: string[]

  @Prop()
  visible!: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  // 選擇的員工index
  chooseIndex = 0;

  // 確定
  onNext() {
  	console.log(this.resultDatas[this.chooseIndex]);
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CaseMaintainList',
  		query: {
  			data: this.resultDatas[this.chooseIndex],
  		},
  	});
  }

  // 取消
  onClose() {
  	this.$emit('closeSearchModal');
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .event__block {
    margin-bottom: 20px;
  }
  .btn__wrap {
    margin-top: 0;
    margin-bottom: 50px;
    button {
      max-width: 100%;
      width: 100px;
      @include rwd-lg {
        width: 200px;
      }
    }
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
