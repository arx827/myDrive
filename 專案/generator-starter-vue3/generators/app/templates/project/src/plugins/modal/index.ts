import type { App } from 'vue'
import { Modal } from 'ant-design-vue'
import type { ModalFuncProps } from 'ant-design-vue/es/modal'
import 'ant-design-vue/es/modal/style/css'

// prefixCls?: string;
//     class?: string;
//     visible?: boolean;
//     title?: string | (() => VueNode) | VueNode;
//     closable?: boolean;
//     content?: string | (() => VueNode) | VueNode;
//     onOk?: (...args: any[]) => any;
//     onCancel?: (...args: any[]) => any;
//     afterClose?: () => void;
//     okButtonProps?: ButtonPropsType;
//     cancelButtonProps?: ButtonPropsType;
//     centered?: boolean;
//     width?: string | number;
//     okText?: string | (() => VueNode) | VueNode;
//     okType?: LegacyButtonType;
//     cancelText?: string | (() => VueNode) | VueNode;
//     icon?: (() => VueNode) | VueNode;
//     wrapClassName?: String;
//     iconType?: string;
//     mask?: boolean;
//     maskClosable?: boolean;
//     zIndex?: number;
//     okCancel?: boolean;
//     style?: CSSProperties | string;
//     maskStyle?: CSSProperties;
//     type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
//     keyboard?: boolean;
//     getContainer?: string | HTMLElement | getContainerFunc | false | null;
//     autoFocusButton?: null | 'ok' | 'cancel';
//     transitionName?: string;
//     maskTransitionName?: string;
//     direction?: Direction;
//     bodyStyle?: CSSProperties;
//     closeIcon?: string | (() => VueNode) | VueNode;
//     modalRender?: (arg: {
//         originVNode: VueNode;
//     }) => VueNode;
//     focusTriggerAfterClose?: boolean;
//     /** @deprecated please use `appContext` instead */
//     parentContext?: any;
//     appContext?: any;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: ModalService
  }
}

export class ModalService {
  // 預設項目
  private config = props => ({
    wrapClassName: 'modalCustom',
    title: '提醒',
    okText: '確定',
    ...props,
  })

  public info(option?: ModalFuncProps) {
    Modal.info(this.config({ ...option }))
  }

  public success(option?: ModalFuncProps) {
    Modal.success(this.config({ ...option }))
  }

  public error(option?: ModalFuncProps) {
    Modal.error(this.config({ ...option }))
  }

  public warning(option?: ModalFuncProps) {
    Modal.warning(this.config({ ...option }))
  }

  public confirm(option?: ModalFuncProps) {
    Modal.confirm(this.config({ ...option }))
  }

  public destroy() {
    Modal.destroyAll()
  }

  public install(app: App) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$modal = this
  }
}

export default new ModalService()

// ======================= Antd Modal 說明 ======================= //
/* Modal.method()
( 參數 ｜ 說明 ｜ 類型 ｜ 默認值 | 版本 )
appContext        | 弹窗的上下文，一般用于获取全局注册组件、vuex 等内容 | - | - | 
autoFocusButton   | 指定自动获得焦点的按钮 | null | ok | cancel | ok | 
cancelButtonProps | cancel 按钮 props | ButtonProps | - | 
cancelText        | 取消按钮文字 | string | 取消 | 
centered          | 垂直居中展示 Modal | boolean | false | 
class             | 容器类名 | string | - | 
closable          | 是否显示右上角的关闭按钮 | boolean | false | 
content           | 内容 | string |VNode |function(h) | 无 | 
icon              | 自定义图标（1.14.0 新增） | VNode | ()=>VNode | - | 
keyboard          | 是否支持键盘 esc 关闭 | boolean | true | 
mask              | 是否展示遮罩 | boolean | true | 
maskClosable      | 点击蒙层是否允许关闭 | boolean | false | 
okButtonProps     | ok 按钮 props | ButtonProps | - | 
okText            | 确认按钮文字 | string | 确定 | 
okType            | 确认按钮类型 | string | primary | 
title             | 标题 | string|VNode |function(h) | 无 | 
width             | 宽度 | string|number | 416 | 
wrapClassName     | 对话框外层容器的类名 | string | - | 3.2.3
zIndex            | 设置 Modal 的 z-index | number | 1000 | 
onCancel          | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function | 无 | 
onOk              | 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function | 无 | 
*/
