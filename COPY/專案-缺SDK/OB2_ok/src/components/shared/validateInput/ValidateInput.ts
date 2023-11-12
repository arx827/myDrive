import { Component, Prop, Vue } from "vue-property-decorator";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";

@Component
export default class ValidateInput extends Vue {
  @Prop()
  bodyStyle;

  @Prop({ default: "top" })
  itemPlacement;

  @Prop()
  validateForm: ValidateFormComponent;

  @Prop()
  value: string;

  @Prop()
  maxLength: number;

  get mergeBodyStyle() {
    return this.bodyStyle
      ? Object.assign(this.bodyStyle, { margin: 0 })
      : Object.assign({ margin: 0 });
  }

  // change visible
  callCommonUtilFeildVisibleChange(fv: ValidateFormComponent) {
    CommonUtil.getFeildValidateVisibleChange(fv);
  }

  // get trigger
  callCommonUtilFeildTrigger(fv: ValidateFormComponent){
    CommonUtil.getFeildVaildateTrigger(fv);
  }

  // get visible
  callCommonUtilFeildHoverVisible(fv: ValidateFormComponent){
    return CommonUtil.getFeildVaildateHoverVisible(fv);
  }

  callCommonUtilFeild(fv: ValidateFormComponent){
    return CommonUtil.getFeildValid(fv);
  }
}