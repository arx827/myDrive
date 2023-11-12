<template>
  <div class="event__wrap">
    <a-row :gutter="[16,16]">
      <a-col
        v-for="(event,index) in eventInfoList"
        :key="index"
        :md="cardGrid.md"
        :sm="cardGrid.sm"
      >
        <div class="event__col">
          <div>
            <div
              class="event__img img__mask"
              :style="`background-image:url('${event.picBase64}')`"
              @click="goAct(event)"
            >
              <a-icon
                type="right-circle"
                theme="filled"
              />
            </div>
            <div class="event__Info">
              <a-row>
                <a-col :span="24">
                  <div class="event__title">
                    {{ event.actName }}
                  </div>
                </a-col>
              </a-row>
              <a-row class="mt-3">
                <a-col :span="18">
                  <div class="event__content__title">
                    活動日期
                  </div>
                  <div>
                    {{ event.date }}
                  </div>
                </a-col>
                <a-col :span="6">
                  <div class="event__content__title">
                    活動狀態
                  </div>
                  <div>
                    {{ event.actStatus === 'Y'?'進行中':'已結束' }}
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
          <!-- 左側按鈕 -->
          <button
            v-if="currentPage==='healthPromote'"
            class="card__btn card__btn--edit rounded-0"
            :class="{'card__btn--disabled': event.isSignUp==='N' || event.actStatus === 'N'}"
            :disabled="event.isSignUp==='N' || event.actStatus === 'N'"
            @click="handleEditRegister(event)"
          >
            <div>
              {{ event.isSignUp === 'N' ? '尚無報名資料' : '編輯報名資料' }}
            </div>
          </button>
          <button
            v-if="currentPage==='myRegistration'"
            class="card__btn card__btn--edit rounded-0"
            :class="{'card__btn--disabled': event.isRegisterCourse==='N' || event.actStatus === 'N'}"
            :disabled="event.isRegisterCourse === 'N' || event.actStatus === 'N'"
            @click="handleEditRegister(event)"
          >
            <div>
              編輯報名資料
            </div>
          </button>
          <!-- 右側按鈕 -->
          <button
            v-if="currentPage==='healthPromote'"
            class="card__btn card__btn--default rounded-0"
            :class="registerButtonClass(event)"
            :disabled="event.isExpired==='Y' || event.actStatus === 'N'"
            @click="handleRegister(event)"
          >
            <div>
              {{ event.isSignUp === 'Y' ? '取消報名' : '我要報名' }}
            </div>
          </button>
          <button
            v-else-if="currentPage==='myRegistration'"
            class="card__btn card__btn--default rounded-0"
            :class="registerButtonClass(event)"
            :disabled="event.isExpired==='Y'"
            @click="cancelRegister(event)"
          >
            <div v-if="event.isExpired==='N' && event.isRegisterCourse === 'Y'">
              取消報名
            </div>
            <div v-else-if="event.actStatus==='Y' && event.isRegisterCourse === 'Y'">
              活動進行中
            </div>
            <div v-else-if="event.actStatus==='N' && event.isRegisterCourse === 'Y'">
              已完成課程
            </div>
            <div v-else-if="event.isRegisterCourse === 'N'">
              已取消課程
            </div>
            <div v-else>
              課程已結束
            </div>
          </button>
          <!-- 註： isExpired: 是否過報名截止日期(Y/N);
          isRegisterCourse: 是否有報名課程(Y/N);
          actStatus: 活動狀態(Y進行中,N已結束) -->

          <!-- 最下方滿意度填寫按鈕 -->
          <button
            v-if="currentPage==='myRegistration'"
            class="satisfy__Btn card__btn--edit"
            :class="satisfyButtonClass(event)"
            @click="goQuestPage(event)"
          >
            <div v-if="event.isCloseQuest === 'Y'">
              已填寫滿意度問卷
            </div>
            <div v-else-if="event.isWriteQuest === 'Y'">
              填寫滿意度問卷
            </div>
            <div v-else>
              尚未開放填寫滿意度問卷
            </div>
          </button>
        </div>
      </a-col>
    </a-row>

    <!-- 取消原因彈窗 -->
    <a-modal
      v-model="cancelModelOpen"
      class="ant-modal-confirm ant-modal-confirm-confirm modal__custom__confirm"
      :title="null"
      :closable="false"
      :footer="null"
      width="474px"
    >
      <div class="ant-modal-confirm-body-wrapper">
        <div class="ant-modal-confirm-body">
          <a-icon
            class="modal__icon modal__icon--error"
            type="exclamation-circle"
            theme="filled"
          />
          <span class="ant-modal-confirm-title">
            <div class="alert__modal__title">確定取消預約嗎？</div>
          </span>
          <div class="ant-modal-confirm-content">
            <p>系統即將取消您的預約，您確定要取消嗎？請選擇取消原因：</p>
            <a-form-model
              ref="ruleForm"
              :model="cancelModalForm"
              :rules="formRules"
              layout="vertical"
            >
              <a-radio-group
                v-model="cancelModalForm.cancelValue"
              >
                <a-radio
                  v-for="item in cancelOption"
                  :key="item.codeId"
                  :style="{display: 'block'}"
                  :value="item.codeDesc"
                >
                  {{ item.codeDesc }}
                </a-radio>
              </a-radio-group>
              <a-form-model-item prop="cancelOther">
                <a-textarea
                  v-if="cancelModalForm.cancelValue === '其他'"
                  v-model="cancelModalForm.cancelOther"
                  placeholder="請簡述取消原因"
                  class="mt-2"
                  :max-length="1000"
                  :auto-size="{ minRows: 1 }"
                  size="large"
                />
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
        <div class="ant-modal-confirm-btns">
          <a-button @click="closeCancelModal">
            取 消
          </a-button>
          <a-button
            class="ant-btn-error"
            :disabled="cancelModalForm.cancelValue.length === 0"
            @click="submitCancelModal"
          >
            確 定
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';
import InfoModal from '@/plugins/notification/infoModal';

@Component({
})
export default class EventCard extends Vue {
@Action('setLoading') setLoading;

@Prop()
eventInfoList: []

@Prop()
cardGrid: { [key: string]: number }

@Prop()
currentPage: string

@Prop()
actDetailPage: string

cancelModelOpen = false;

cancelOption: any = [
];

cancelModalForm = {
	cancelInfo: {},
	cancelValue: '',
	cancelOther: '',
}

formRules = {
	cancelOther: [{ required: true, message: '請填入取消原因' }],
}

selected = null;

myReserv = null;

publicMail = null;

// 查詢取消原因
getReason() {
	this.$PCREmpPhysicianConsultControllerApi.cancelReasonQueryListUsingPOST()
		.then((resp) => {
  			console.log(resp);
			  this.cancelOption = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
}

registerButtonClass(event) {
	const registerStr = (event.isSignUp) === 'Y' ? 'card__btn--cancel' : 'card__btn--add';
	const disabled = (event.isExpired === 'Y' || event.actStatus === 'N') ? 'card__btn--disabled' : '';
	return [registerStr, disabled];
}

satisfyButtonClass(event) {
	const satisfyStr = (event.isWriteQuest === 'Y') ? 'card__btn--edit' : 'card__btn--disabled';
	return [satisfyStr];
}

// 點擊按鈕，健康促進『我要報名/取消報名』
handleRegister(event) {
	console.log(event);
	if (event.isSignUp === 'Y') {
		// 取消報名
		this.cancelRegister(event);
		return;
	}
	// 我要報名
	this.goAct(event);
}

// 點擊按鈕，『取消報名』
cancelRegister(event) {
	this.cancelModelOpen = true;
	this.selected = event;
}

// 取消送出
submitCancelModal() {
	if (this.cancelModalForm.cancelValue === '其他') {
		(this.$refs.ruleForm as any).validate((valid) => {
			if (valid) {
				this.callCancelAPI();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
		});
	} else {
		this.callCancelAPI();
	}
}

// API:取消報名
callCancelAPI() {
	this.setLoading(true);
	const reason = this.cancelModalForm.cancelValue === '其他' ? this.cancelModalForm.cancelOther : this.cancelModalForm.cancelValue;
	this.$PHPEmpHealthActSignupApi.cancelSingupInfoUsingPOST({ actId: this.selected.actId, cancelReason: reason })
		.then((resp: any) => {
			console.log(resp);
			if (resp.data.status === 200) {
				this.cancelModelOpen = false;
				notification.success({ content: '取消成功!' });
				// this.refreshCard();
				setTimeout(() => {
					location.reload();
				}, 500);
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

// refresh 報名卡片
refreshCard() {
	this.$emit('refreshCard');
}

// 關閉取消彈窗
closeCancelModal() {
	this.cancelModelOpen = false;
	this.cancelModalForm = {
		cancelInfo: {},
		cancelValue: '',
		cancelOther: '',
	};
}

// 到活動說明頁or報名資訊頁
goAct(event) {
	this.$global.changeRouterAndaddParam({
		toRouter: this.actDetailPage,
		query: {
			actId: event.actId,
			singupInfoId: this.currentPage === 'myRegistration' ? event.singupInfoId : null,
			// data: this.currentPage === 'myRegistration' ? event : null,
			data: event,
		},
	});
}

async getMyReserv() {
	await this.$PHPEmpHealthActSignupApi.querySingupInfoPageUsingPOST({
		pageNo: 0,
		pageSize: 999,
	})
		.then((resp) => {
  		console.log(resp);
			this.myReserv = resp.data.data.content;
		})
		.catch((error) => {
			console.log('error status = ', error);
		})
		.finally(() => {
			// this.setLoading(false);
		});
}

// 到問卷填寫頁面
goQuestPage(event) {
	if (event.isWriteQuest === 'N') return;
	// this.$router.push({ name: 'MyRegistrationQuest' });
	this.$global.changeRouterAndaddParam({
		toRouter: 'MyRegistrationQuest',
		query: {
			actID: event.actId,
		},
	});
}

// 點擊按鈕，『編輯報名資料』
async handleEditRegister(event) {
	if (this.currentPage === 'myRegistration' && event.isRegisterCourse === 'N') return;
	if (this.currentPage === 'healthPromote' && event.isSignUp === 'N') return;
	console.log(event);
	if (event.isExpired === 'Y') {
		InfoModal.alertError({
  			title: '已過編輯截止日時間',
  			confirm: true,
  			content: '很抱歉，此活動的資料編輯時間已截止，如尚須編輯資料，請寄件至「健康促進公務信箱」。護理人員將儘速協助您做報名資料的修改，謝謝！',
  			customContent: () => this.$createElement('div', {
  				attrs: {
  					// class: 'btn__radius--primary--bg--small modal__btn--dowload',
  					// style: 'font-weight: normal; margin-top: 20px; width: 100%;',
  				},
  			}, [
				this.$createElement('span', {
  					// on: {
  					// 	click: () => this.downloadBeforeDelete(actId),
  					// },
  				}, '健康促進公務信箱 '),
  				this.$createElement('u', {
  					// on: {
  					// 	click: () => this.downloadBeforeDelete(actId),
  					// },
					attrs: {
						style: 'color: #4D86FF; ',
					},
  				}, this.publicMail),
  			]),
  			// onCallback: () => this.isAllowDelete && this.deleteHealthAct(actId),
  		});
		return;
	}
	await this.getMyReserv();
	console.log(this.myReserv);
	const singupInfoId = this.myReserv.find((e) => e.actId === event.actId && e.isRegisterCourse === 'Y').singupInfoId;
	console.log(singupInfoId);
	this.$global.changeRouterAndaddParam({
		toRouter: 'HealthPromoteRegister',
		query: {
			actId: event.actId,
			singupInfoId,
			data: event,
			action: 'edit',
		},
	});
}

async created() {
	this.getReason();
	this.publicMail = await this.$global.getPublicEmail();
}
}

</script>

<style lang="scss" scoped>
.event__wrap {
  padding: 20px 0;
}
.event__img {
  height: 110px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.event__col {
  overflow: hidden;
  border-radius: 15px;
  border: $COLOR-GRAY2 solid 1px;
}
.event__title {
  font-weight: 600;
  font-size: 20px;
}
.event__content__title {
  color: #999999;
  font-size: 16px;
}
.event__Info {
  padding: 20px;
  color: #2C2738;
  border-bottom: $COLOR-GRAY2 solid 1px;
}
.card__btn {
  width: 50%;
  height: 50px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border: 0px;
  cursor: pointer;
}
.card__btn--disabled {
    color: #999999 !important;
    background-color: $COLOR-GRAY6 !important;
    cursor: no-drop !important;
}
.card__btn--edit {
  color: $COLOR-MAIN12;
  background-color: $COLOR-WHITE;
}
// 右邊按鈕區塊預設
.card__btn--default {
  color: $COLOR-WHITE;
}
// 右邊按鈕區塊
.card__btn--add {
  background-color: $COLOR-MAIN12;
}
.card__btn--cancel {
  background-color: $COLOR-MAIN19;
}
// 圖片遮罩
.img__mask {
  position: relative;
  i {
    display:none;
  }
  &:hover {
    cursor: pointer;
    i {
      position: absolute;
      display: initial;
      z-index: 999;
      color: $COLOR-WHITE;
      top: 35px;
      right: 25px;
      &.anticon {
        ::v-deep svg {
          font-size: 42px;
        }
      }
    }
    &::after {
      content: '';
      background-color: $COLOR-GRAY1;
      border-radius: 15px 15px 0 0;
      opacity: 0.4;
      position: absolute;
      left: 0;
      height: 100%;
      top: 0px;
      width: 100%;
      z-index: 99;
    }
  }
}
// 最下方滿意度填寫按鈕
.satisfy__Btn{
  width: 100%;
  height: 50px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border: 0px;
  cursor: pointer;
}
</style>
