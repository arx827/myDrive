import Vue from 'vue';
import VueRouter from 'vue-router';
import { Row, Col, Transfer, Button, Layout, Menu, Icon, PageHeader, Avatar, Dropdown, Modal, Spin, Form, FormModel, Input, Select, InputNumber, Tag, Table, Divider, Badge, message, Tree, Switch, Card, Tooltip, Checkbox, Upload, Popover, TimePicker, Tabs, Collapse, Descriptions, Slider, Radio, List } from 'ant-design-vue';
import Space from 'ant-design-vue/lib/space';
import 'ant-design-vue/lib/space/style';
import App from './App.vue';
import router from './router';
import Api from './plugins/api';
import VueRx from 'vue-rx';
import User from './plugins/user';
import VueLoading from 'vue-loading-overlay';
import "vue-loading-overlay/dist/vue-loading.css";
import i18n from '@/plugins/i18n/vue-i18n';
import DatePicker from '@fubonlife/vue2-datepicker';
import '@fubonlife/vue2-datepicker/index.css';
import SlideUpDown from 'vue-slide-up-down';
import zhTW from 'date-format-parse/lib/locale/zh-tw';
import TwDateFormatter from './plugins/tw-date-formatter';
import "@less/base.less";
import '@less/on-duty-layout.less';
import { createDecorator } from 'vue-class-component';
// 將ant-design所使用到的時間型別，moment，改為中文台灣。目前系統尚未用到ant-design時間相關元件。
// import moment from 'moment';
// moment.locale('zh-tw');

Vue.use(VueRx);
Vue.use(Api, {});
Vue.use(User, { router, message });
Vue.use(VueRouter);
Vue.use(FormModel);
Vue.use(Modal);
Vue.use(Upload);
Vue.use(VueLoading);
Vue.use(Tabs);
Vue.use(Collapse);
Vue.component(Space.name, Space);
Vue.component(Button.name, Button);
Vue.component(Transfer.name, Transfer);
// Vue.component(Checkbox.name, Checkbox);
Vue.component(Select.name, Select);
Vue.component(Select.Option.name, Select.Option);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Layout.name, Layout);
Vue.component(Layout.Sider.name, Layout.Sider);
Vue.component(Layout.Header.name, Layout.Header);
Vue.component(Layout.Content.name, Layout.Content);
Vue.component(Layout.Footer.name, Layout.Footer);
Vue.component(Menu.name, Menu);
Vue.component(Menu.SubMenu.name, Menu.SubMenu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(PageHeader.name, PageHeader);
Vue.component(Avatar.name, Avatar);
Vue.component(Icon.name, Icon);
Vue.component(Dropdown.name, Dropdown);
Vue.component(Modal.name, Modal);
Vue.component(Spin.name, Spin);
Vue.component(Form.name, Form);
Vue.component(Form.Item.name, Form.Item);
Vue.component(FormModel.name, FormModel);
Vue.component(FormModel.Item.name, FormModel.Item);
Vue.component(Input.name, Input);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Tag.name, Tag);
// 改用自定義的date picker
// Vue.component(DatePicker.name, DatePicker);
// Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(Switch.name, Switch);
Vue.component(Slider.name, Slider);
Vue.component(Radio.name, Radio);
Vue.component(Radio.Group.name, Radio.Group);
// const RadioGroup = Radio.Group
Vue.component(Card.name, Card);
Vue.component(Card.Meta.name, Card.Meta);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Checkbox.Group.name, Checkbox.Group);
Vue.component(Upload.name, Upload);
Vue.component(Popover.name, Popover);
Vue.component(TimePicker.name, TimePicker);
Vue.component('slide-up-down', SlideUpDown);
Vue.component(Descriptions.name, Descriptions)
Vue.component(Descriptions.Item.name, Descriptions.Item)
Vue.component(List.name, List)
Vue.component(List.Item.name, List.Item)
Vue.component(List.Item.Meta.name, List.Item.Meta)
Vue.config.productionTip = false;

Vue.use(TwDateFormatter);
Vue.component("DatePicker", DatePicker);

DatePicker.locale('zh-tw', {
  formatLocale: zhTW,
  yearFormat: (year) => {
    const twYear = year - 1911;
    return `${twYear} 年`;
  },
  monthFormat: 'MMM',
  monthBeforeYear: false,
});

// 載入語言包
Vue.prototype.$i18NResourceApi.findByIdUsingGET(localStorage.getItem('language') || 'zh_TW').then((res) => {
  i18n.setLocaleMessage(res.data.locale, JSON.parse(res.data.langResource)
  );
}).finally(() => {
  new Vue({
    i18n,
    router,
    render: h => h(App)
  }).$mount('#app')
});