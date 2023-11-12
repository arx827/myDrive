import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";
import { MailInforMationDto } from "@fubonlife/obd-api-axios-sdk";
import message from "@/assets/config/MessageUtil";
import { AxiosResponse } from "axios";
import LoadingUtil from "@/assets/config/LoadingUtil";
import moment from "moment";
import MomentUtil from "@/assets/config/MomentUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import { Modal } from "ant-design-vue";
import { LoginModule } from "@/plugins/store/LoginModule";
@Component
export default class MailInformationForm extends Vue {
  
  // 郵寄資訊點擊傳入
  @Prop()
  public initData: MailInforMationDto;

  mailInformationForm;

  @Watch("initData")
  onInitDataChange(){

    this.mailInformationForm=JSON.parse(JSON.stringify(this.initData));
  }
  created(){
    this.mailInformationForm=JSON.parse(JSON.stringify(this.initData));

  }
  
}