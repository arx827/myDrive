import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import 'tinymce/tinymce.js';
import 'tinymce/models/dom';
// 外觀
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/themes/silver';
// Icon
import 'tinymce/icons/default';
// 用到的外掛
import 'tinymce/plugins/table';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/lists';

// TinyMCE-Vue
import Editor from '@tinymce/tinymce-vue';

@Component({
  components: {
    Editor,
  },
})
export default class BasicTinyEditor extends Vue {
  /**
   * prop
   */
  @Prop()
  value: string

  /**
   * data
   */

  // 編輯器插件
  //     table: 表格
  //     quickbars: 選取字串或點選圖片時的快速功能條
  //     link: 連結
  //     code: HTML原始碼
  //     lists: 清單
  plugins = ['table', 'quickbars', 'link', 'code', 'lists']

  // 編輯器功能列
  // 功能列的各項功能用文字設定，空白隔開，用 | 來做功能按鈕的分類(分類可自行決定，下方註解根據分類撰寫)
  //     bold italic underline strikethrough: 粗體、斜體、底線、一槓劃掉
  //     fontsize: 文字大小
  //     forecolor backcolor: 字體顏色、選取字體的背景底色
  //     alignleft aligncenter alignright alignjustify: 靠左、置中、靠右、左右對齊
  //     bullist numlist: 點式項目清單、數字項目清單
  //     outdent indent blockquote: 向左縮排、向又縮排、引用
  //     undo redo: 回復上一步、還原動作
  //     removeformat: 清除格式
  //     table: 表格相關設定
  //     link code: 插入連結、HTML原始碼檢視和編輯
  toolbar = 'bold italic underline strikethrough |'
          + 'fontsize |'
          + 'forecolor backcolor |'
          + 'alignleft aligncenter alignright alignjustify |'
          + 'bullist numlist |'
          + 'outdent indent blockquote |'
          + 'undo redo |'
          + 'removeformat |'
          + 'table |'
          + 'link code'

  // fontsize(文字大小)使用的下拉選單設定
  fontsizeFormats = '8px 10px 12px 14px 16px 18px 24px 36px 48px'

  // 初始化
  // height:	編輯器高度
  // menubar:	"表單"功能列顯示(非一般功能列)
  // skin:	  編輯器樣式組
  // plugins:	插件
  // toolbar:	功能列
  // toolbar_mode:	功能列顯示模式
  // fontsize_formats:	功能列中的"字型大小"下拉選單
  // forced_root_block:	輸入內容時預設用來包裝的html tag(預設為p)
  // paste_data_images:	是否允許複製圖片貼上
  // paste_block_drop:	是否阻擋拖曳檔案至編輯器的操作
  // branding:	是否顯示TinyMCE的Logo
  // content_style: 內容框框的預設樣式
  // resize: 編輯器是否允許變更大小
  init = {
    height: 400,
    menubar: false,
    skin: false,
    plugins: this.plugins,
    toolbar: this.toolbar,
    toolbar_mode: 'wrap',
    quickbars_insert_toolbar: false,
    font_size_formats: this.fontsizeFormats,
    forced_root_block: 'div',
    paste_data_images: false,
    paste_block_drop: true,
    branding: false,
    content_style: 'body {font-size: 14px;}',
    resize: false,
  }

  editValue = ''

  /**
   * watch
   */
  @Watch('value', { immediate: true })
  onValueChange(val: string) {
    this.editValue = val;
  }

  /**
   * methods
   */
  // 輸入時回傳編輯器的內容
  handleInput() {
    this.$emit('input', this.editValue);
  }

  // focus事件發送
  handleFocus(e) {
    this.$emit('focus', e);
  }
}
