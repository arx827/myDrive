export default {
  
    props: [
      'afterClose', //     Modal 完全關閉後的回調    function    無
      'bodyStyle', //     Modal body 樣式    object    {}
      'cancelText', //     取消按鈕文字    string| slot    取消
      'centered', //     垂直居中展示 Modal    Boolean    false
      'closable', //     是否顯示右上角的關閉按钮    boolean    true
      'closeIcon', //     自定義關閉按鈕    VNode | slot    -    1.5.0
      'confirmLoading', //     確定按钮 loading    boolean    无
      'destroyOnClose', //     關閉時銷毀 Modal 里的子元素    boolean    false
      // 'footer', //     底部内容，當不需要默認底部按钮时，可以設為 :footer="null"    string|slot    确定取消按钮
      'forceRender', //     强制渲染 Modal    boolean    false
      'getContainer', //     指定 Modal 掛載的 HTML 节点    (instance): HTMLElement    () => document.body
      'keyboard', //     是否支持键盘 esc 關閉    boolean    true
      'mask', //     是否展示遮罩    Boolean    true
      'maskClosable', //     點擊蒙層是否允許關閉    boolean    true
      'maskStyle', //     遮罩樣式    object    {}
      'okText', //     確認按钮文字    string|slot    确定
      'okType', //     確認按钮类型    string    primary
      'okButtonProps', //     ok 按钮 props, 遵循 jsx规范    {props: ButtonProps, on: {}}    -
      'cancelButtonProps', //     cancel 按钮 props, 遵循 jsx规范    {props: ButtonProps, on: {}}    -
      'title', //     標題    string|slot    無
      'visible', // (v-model)    對話框是否可見    boolean    無
      'width', //     寬度    string|number    520
      'wrapClassName', //     對話框外層容器的類名    string    -
      'zIndex', //    設置 Modal 的 z-index    Number    1000
      'dialogStyle', //     可用于设置浮層的樣式，調整浮層位置等    object    -    1.6.1
      'dialogClass' //     可用于設置浮層的類名    string
    ]
  }
  