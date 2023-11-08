import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  Row, Col, Button, Layout, Menu, Icon, PageHeader, Avatar, Dropdown, Modal, Spin, Form, FormModel, Input, Select, InputNumber, Tag, Table, Divider, Badge, message, Tree, Tooltip, Radio, ConfigProvider, Collapse, notification, Upload, Checkbox, Popover, Tabs, Calendar, TimePicker,
} from 'ant-design-vue';
import Space from 'ant-design-vue/lib/space';
import 'ant-design-vue/lib/space/style';
import VueRx from 'vue-rx';
import ZhTW from 'date-format-parse/lib/locale/zh-tw';
import DatePicker from '@fubonlife/vue2-datepicker';
import App from './App.vue';
import router from './router';
import global from './plugins/global';
// import Api from './plugins/api'
// import User from './plugins/user';
import store from './store';
import 'bootstrap/scss/bootstrap.scss';
import '@fubonlife/vue2-datepicker/index.css';
import TwDateFormatter from './plugins/tw-date-formatter';

Vue.use(VueRx);
// Vue.use(Api, {});
// Vue.use(User, { router, message });
Vue.use(global, { router });
Vue.use(VueRouter);
Vue.use(FormModel);
Vue.use(Modal);
Vue.component(Space.name, Space);
Vue.component(Button.name, Button);
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
Vue.component(Input.Group.name, Input.Group);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Input.Password.name, Input.Password);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Tag.name, Tag);
// Vue.component(DatePicker.name, DatePicker);
// Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Radio.name, Radio);
Vue.component(Radio.Group.name, Radio.Group);
Vue.component(Radio.Button.name, Radio.Button);
Vue.component(Tooltip.name, Tooltip);
Vue.component(ConfigProvider.name, ConfigProvider);
Vue.component(Collapse.name, Collapse);
Vue.component(Collapse.Panel.name, Collapse.Panel);
Vue.component(Upload.name, Upload);
Vue.component(Upload.Dragger.name, Upload.Dragger);
Vue.component(Popover.name, Popover);
Vue.component(Calendar.name, Calendar);
Vue.component(TimePicker.name, TimePicker);
// Vue.component('slide-up-down', SlideUpDown);
Vue.component(Tabs.name, Tabs);
Vue.component(Tabs.TabPane.name, Tabs.TabPane);
Vue.component(Modal.name, Modal);

Vue.use(TwDateFormatter);
Vue.component('DatePicker', DatePicker);
DatePicker.locale('zh-tw', {
  formatLocale: ZhTW,
  yearFormat: (year) =>
    // const twYear = year - 1911;
    `${year} 年`,
  // monthFormat: 'MMM',
  monthBeforeYear: false,
});

Vue.prototype.$confirm = Modal.confirm;

Vue.config.productionTip = false;

new Vue({
  router,
  // store,
  render: (h) => h(App),
}).$mount('#app');
