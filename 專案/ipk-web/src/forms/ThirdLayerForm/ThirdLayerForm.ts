import {
 Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component
export default class ThirdLayerForm extends Vue {
  form: any = {
    paramGroup1: 'BATCH',
    paramGroup2: 'INTRA_AP',
  }

  created(): void {
    // this.reset();
  }

  public submit(paramGroup: string) {
    this.$emit('submit', paramGroup);
  }

  public cancel() {
    this.$emit('formCancel');
  }
}
