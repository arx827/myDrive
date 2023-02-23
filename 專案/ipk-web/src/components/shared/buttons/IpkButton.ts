import { Vue, Component, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';

@Component({})
export default class IpkButton extends Vue {
	@Getter getMenuItem!: Array<any>;

	/**
   * props
   */
  @Prop({ default: true })
  isAuthorize: boolean; // 是否進行權限驗證

	@Prop()
	childrenTab: string; // 目前所在頁籤

	@Prop()
	buttonKey: string; // 按鈕權限

	@Prop({ default: 'primary' })
	buttonType: string; // 按鈕類型：目前只有 primary、lightRed、lightBlue。

	@Prop()
	buttonText: string; // 按鈕文字

  @Prop({ default: false })
	buttonDisabled: boolean; // 按鈕鎖定

	@Prop()
	iconType: string; // icon樣式。例如：plus、search、stop、delete...等

	@Prop()
  /*
   * 圖片icon樣式：目前只有 icon__clear、icon__comparison。
   * icon__clear [ 搭配 buttonType = lightBlue ]
   * icon__comparison [ 搭配 buttonType = primary ]
   *
   * */
	iconImg: string;

	/**
   * methods
   */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 按鈕樣式
  buttonClass() {
    const btnType = `btn__main--${this.buttonType}`;
    const iconImg = this.iconImg;

    return [btnType, iconImg];
  }

  // 按鈕權限驗證
  handleValidateButtonAuth() {
		// 驗證權限
    if (this.isAuthorize) {
      let validate = this.$authService.getButtonsAuthInfo(this.$route.name, this.childrenTab, this.buttonKey);
      if (!validate.byPass) {
        InfoModal.alertError({ confirm: false, content: validate.message });
        return;
      }
    }
		// 與父元件溝通
		this.$emit('handleBtnEmit');
	}
}
