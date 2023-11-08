<template>
  <div>
    <Header :is-login-page="true" />
    <FblLoading />
    <div id="login__content">
      <div class="login-banner__wrap">
        <div class="login-banner__bg" />
        <div class="login-banner__img-wrap container">
          <div class="login-banner__img">
            <img
              src="~@images/image_login.svg"
              alt=""
            >
          </div>
          <div class="login-banner__title-wrap">
            <h1
              class="login-banner__title"
              title="職安系統管理平台"
            >
              健康促進活動簽到
            </h1>
          </div>
        </div>
      </div>

      <div class="login-form__wrap">
        <a-form-model
          ref="ruleForm"
          :rules="formRules"
          :model="form"
        >
          <a-form-model-item
            class="login__card-row"
            prop="singinId"
          >
            <label
              for="singinId"
              class="a-form-label"
            >請輸入員編或身分證後五碼</label>
            <a-input
              id="singinId"
              v-model="form.singinId"
              class="a-form-control"
              type="text"
              autocomplete="off"
              size="large"
              @keyup.enter="singin"
            />
          </a-form-model-item>
        </a-form-model>
        <button
          class="form__btn btn__radius--primary"
          @click="singin"
        >
          簽到
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Vue, Component } from 'vue-property-decorator';

import Header from '@compononts/layout/Header.vue';
import FblLoading from '@compononts/layout/FblLoading.vue';
import InfoModal from '@/plugins/notification/infoModal';
import {
	HealthActSinginDto,
} from '@fubonlife/oss-api-axios-sdk';

@Component({
	components: {
		Header,
		FblLoading,
	},
})
export default class SinginPage extends Vue {
  @Action('setLoading') setLoading;

  isLoading = false;

  resultSuccess = false;

  actId;

  form = {
  	singinId: '',
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	singinId: [{ required: true, message: '請輸入員編或身分證後五碼', trigger: 'blur' }],
  };

  singin() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			console.log('singinId:', this.form.singinId);
  			console.log('actId:', this.actId);
  			const data: HealthActSinginDto = {
			    actId: this.actId,
  				singinId: this.form.singinId,
		    };
  			const query = this.$UtilityApi.singinUsingPOST(data)
  				.then((resp) => {
  					console.log('resp', resp.data.status);
  					if (resp.data.status == 200) {
  		        this.resultSuccess = true;
  						message.success('簽到成功');
  						this.form.singinId = '';
          	} else {
  		        this.resultSuccess = false;
  	        }
  				})
  				.catch((error) => {
  					console.log('error status = ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  /**
   * Hook
   */
  created() {
  	const querySearch = window.location.search.split('actId=');
  	console.log('querySearch:', querySearch);
  	this.actId = querySearch[1];
  }

	// destroyed(): void {
	// 	this.unsubscribe$.next();
	// 	this.unsubscribe$.complete();
	// }
}
</script>

<style lang="scss" scoped>
#login__content {
  min-height: calc(100vh - 76px);
  padding: 50px 0 0;
  @include rwd-xl {
		padding: 80px 0 0;
	}
}
// banner
.login-banner__wrap {
  position: relative;
  height: 115px;
}
.login-banner__bg {
  background: $LOGIN-BANNER-BG;
  height: 115.8px;
  border-bottom: 1px solid $COLOR-MAIN12;
}

// img
.login-banner__img-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.login-banner__img {
  position: absolute;
  width: 154px;
  left: 50%;
  bottom: -30px;
  transform: translateX(-50%);
  @include rwd-lg {
		width: 248px;
    left: 50px;
    bottom: -48px;
    transform: none;
	}
  @include rwd-xl {
    left: 0;
	}
}

// title
.login-banner__title-wrap {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  @include rwd-lg {
		top: 50%;
    transform: translate(-50%, -50%);
	}
}
.login-banner__title {
  font-size: 30px;
  color: $LOGIN-BANNER-TITLE-COLOR;
  margin: 0;
  word-break: keep-all;
  @include rwd-lg {
		font-size: 50px;
	}
}

// form
.login-form__wrap {
  max-width: 255px;
  margin: 53px auto 20px;
  @include rwd-lg {
		max-width: 280px;
	}
  @include rwd-xl {
		max-width: 350px;
	}
  ::v-deep .ant-form-item-control {
    line-height: 1.3;
  }
  .a-form-label {
    font-size: 15px;
    color: #000;
    line-height: 21px;
    font-weight: 600;
    margin-bottom: 10px;
    display: block;
  }
  .a-form-control {
    padding: 5px 15px;
    font-size: 16px;
    border-radius: 0.25rem;
    font-weight: 400;
    &[id^="password"] {
      padding-right: 35px;
    }
    &:focus {
      border-color: $INPUT-FOCUS-BORDER-COLOR;
      box-shadow: 0 0 0 0.25rem rgba($INPUT-FOCUS-BORDER-COLOR, 0.2);
    }
  }
  .password-icon {
    width: 30px;
    height: 30px;
    background-image: url("~@images/button_eye_on.svg");
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    &.off {
      background-image: url("~@images/button_eye_off.svg");
    }
  }
  .form__btn {
    width: 150px;
    margin: 40px auto 20px;
    display: block;
    @include rwd-lg {
      width: 200px;
    }
  }
}

</style>
