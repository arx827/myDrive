<template>
  <div>
    <a-modal
      v-model="queryModalVisible"
      :centered="true"
      :closable="true"
      :footer="null"
      width="52%"
      @cancel="closeAddQuery(false)"
    >
      <h2 class="modal__title">
        員工查詢
      </h2>
      <div>
        <!-- <p class="input__title">
          員工姓名 or 身分證字號 or 員編
        </p>
        <a-input-search
          v-model="userInfo"
          placeholder="請輸入姓名or身分證字號or員編"
          @search="onSearch"
        /> -->
        <div class="a-form-label input__title">
          員工姓名 or 身分證字號 or 員編
        </div>
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
      <a-divider dashed />
      <p
        v-if="queryData.length>1"
        class="query__hint"
      >
        發現多位同姓名員工，請擇一進行預約。
      </p>
      <a-radio-group
        v-model="staff"
      >
        <a-radio
          v-for="(item,index) in queryData"
          :key="index"
          :value="item"
        >
          <div class="staff__face">
            <img
              src="@/assets/images/image_face.svg"
              alt=""
            >
          </div>
          <div class="staff">
            <h3 class="staff__name">
              {{ item.userName }}
            </h3>
            <div class="staff__info">
              <div class="staff__info__item">
                <p class="staff__info__item__title">
                  身分證字號
                </p>
                <p class="staff__info__item__text">
                  {{ item.id }}
                </p>
              </div>
              <div class="staff__info__item">
                <p class="staff__info__item__title">
                  員工編號
                </p>
                <p class="staff__info__item__text">
                  {{ item.userId }}
                </p>
              </div>
              <div class="staff__info__item">
                <p class="staff__info__item__title">
                  部門單位
                </p>
                <p class="staff__info__item__text">
                  {{ item.department }}
                </p>
              </div>
            </div>
          </div>
        </a-radio>
      </a-radio-group>
      <div class="modal__btn__wrap btn__wrap">
        <a-button
          key="back"
          class="btn__radius--primary--outline"
          @click="closeAddQuery(false)"
        >
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          class="btn__radius--primary"
          :disabled="!staff"
          @click="closeAddQuery(true)"
        >
          確認
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<!--a-form-model-item a-select-option a-form-model-->
<script lang="ts">
import {
	Vue, Component, Prop, Watch, Emit,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component({})
export default class StaffQueryModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible!: boolean

  @Watch('visible')
  visibleChange() {
  	this.queryModalVisible = this.visible;
  }

  @Emit('close-modal')
  closeAddQuery(radio) {
  	this.queryData = [];
  	this.userInfo = '';
  	this.queryModalVisible = false;
  	if (radio) {
  		return this.staff;
  	}
  	this.staff = null;
  	return null;
  }

	queryModalVisible = false

  queryData = []

  staff = null

  // 輸入內容
  userInfo = '';

	// 假資料
	fakaData = [
		{
			name: '鄭陽光(預留空間)',
			idNo: 'G123456789',
			crtNo: '901234',
			department: '系統整合部',
			branch: '使用者介面系統科',
		},
		{
			name: '鄭陽光',
			idNo: 'G123456780',
			crtNo: '901234',
			department: '系統整合部',
			branch: '系統支援二科',
		},
	]

	created() {
		this.queryModalVisible = this.visible;
	}

	// 查詢
	onSearch() {
  	this.queryData = []; // 清空
  	this.setLoading(true);
  	// 員工資料查詢
  	this.$PCRRpnSendRemindAndModifyReservationApi.queryAccountInfoUsingPOST(this.userInfo)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  	      this.queryData = resp.data.data;
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
.header__btn__wrap{
	display: flex;
	button{
		margin-left: 10px;
	}
}

::v-deep {
  .ant-modal{
    margin-top: 80px;
  }
	 button.ant-modal-close{
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, -50%);
		background-color: #23C4A8;
		width: 44px;
		height: 44px;
		border-radius: 50vh;
		display: flex;
		justify-content: center;
		align-items: center;
		svg {
			font-size: 18px;
    	color: #ffffff;
			font-weight: bold;
		}
	}

	.ant-modal-body{
    padding: 20px 45px;
		@include rwd-lg{
      padding: 40px 92px;
    }
	}

  .modal__title{
		color: #000000;
		font-size: 30px;
		font-weight: bold;
	}

	.modal__btn__wrap{
		display: flex;
		justify-content: center;
    margin: 20px 0;
    @include rwd-lg{
      margin:40px 0;
    }

	}
	.btn__wrap{
		margin-bottom: 0px;
	}
	.ant-modal .ant-btn{
		border-radius: 100vh;
		margin:0 5px;
	}
  .ant-input{
    height: 40px;
  }
  .ant-input::placeholder{
    padding-left:15px ;
  }
  .ant-input-affix-wrapper .ant-input-suffix{
    color: #fff;
    background: #23C4A8;
    height: 100%;
    width: 40px;
    right: 0px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    .anticon{
      margin: 0px auto;
    }
  }
  .ant-divider{
    margin-top: 40px;
  }
  .ant-radio-group{
    width: 100%;
  }
  .ant-radio-wrapper{
    width: 100%;
    display: flex;
    background: $COLOR-MAIN10;
    align-items: center;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 10px;
  }

}
.input__title{
  margin-bottom: 6px;
}
.staff__info{
  display: flex;
  position: relative;
  flex-wrap: wrap;
}
.staff__face{
  position: absolute;
  right: 0px;
  top: 0pc;
}
.staff__name{
  font-weight: 600;
  font-size: 16px;
  @include rwd-md{
    font-size: 18px;
  }
}
.staff__info__item{
  margin-right: 27px;
  min-width: 80px;
  p{
    margin-bottom: 0;
  }
  p:nth-child(1){
    color:#999999;
    font-size: 14px;
  }
}
.staff__info__item__text{
  display: flex;
  flex-wrap: wrap;
}

.query__hint{
  color: #363636;
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

</style>
