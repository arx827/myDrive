import FileUpload from '@/components/shared/file-upload/FileUpload.vue';
import { Vue, Component } from 'vue-property-decorator';
import { message } from 'ant-design-vue';

@Component({
  components: {
    FileUpload,
  },
})
export default class CodeTableForm extends Vue {
  accept = '.xlsx';

  options: any[] = [
    { label: '匯率檔', value: 'EXCHANGE_RATE_FILE' },
    { label: '發行機構基本資料檔', value: 'ISSUER_INFO_FILE' },
  ];

  selected: string = this.options[0].value;

  created(): void {
    this.selected = this.options[0].value;
  }

  public onUpload(e: File) {
    if (!this.selected) {
      message.warning('請選擇表單');
      return;
    }
    this.$emit('upload', {
      fileName: this.selected,
      file: e,
    });
  }

  public cancel() {
    this.$emit('formCancel');
  }

  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  }

  handleChange(value) {
    this.selected = value;
  }
}
