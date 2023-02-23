import { CrowdCredentials } from '@fubonlife/ipk-api-axios-sdk';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  @Action('setLoading') setLoading;

  unsubscribe$ = new Subject<void>();

  title = '';

  isLoading = false;

  loginForm = {
    username: '',
    pswd: '',
  };

  formRules: { [key: string]: ValidationRule[] } = {
    username: [{ required: false, message: '請輸入帳號', trigger: 'blur' }],
    pswd: [{ required: false, message: '請輸入密碼', trigger: 'blur' }],
  };

  /**
  * hook
  */
  created() {
    this.title = `${process.env.VUE_APP_TITLE}`;

    this.$user.loginState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        if (state && state.me) {
          this.$router.replace({ path: '/' });
        }
      });
  }

  destroyed(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
  * methods
  */
  // 驗證登入
  handleSubmit(e) {
    e.preventDefault();

    (this.$refs.loginFormRef as any).validate((valid) => {
      if (valid) {
        this.login();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  // 登入
  login() {
    // 整理後端格式
    const body: CrowdCredentials = {
      username: this.loginForm.username,
      password: this.loginForm.pswd,
    };
    this.setLoading(true);
    this.$authApi.ipkLoginUsingPOST(body)
    .then((resp) => {
      this.$user.signIn(resp.data.jwtTokenPair.accessToken);
    })
    .catch(() => {
      this.$message.error('帳號密碼有誤');
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 將帳號英文小寫改為大寫
  toUpper() {
    this.loginForm.username = this.loginForm.username ? this.loginForm.username.toUpperCase() : this.loginForm.username;
  }
}
