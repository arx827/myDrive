import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VXETable from 'vxe-table';
import 'font-awesome/css/font-awesome.css';
import {
// eslint-disable-next-line max-len
Row, Col, Button, Layout, Menu, Icon, PageHeader, Avatar, Dropdown, Modal, Spin, Form, FormModel, Input, Select, InputNumber, Tag, TimePicker, DatePicker, Table, Divider, Badge, message, Tree, Switch, Card, Upload, Tabs, Space, Checkbox, Tooltip, ConfigProvider, notification, Radio, Collapse, Transfer, Empty,
} from 'ant-design-vue';
// import Space from 'ant-design-vue/lib/space';

import {
  Select as select,
  Button as button,
  Transfer as transfer,
  Checkbox as elCheckbox,
  Tree as elTree,
} from 'element-ui';
import 'ant-design-vue/lib/space/style';
import VueRx from 'vue-rx';
import VueExcelXlsx from 'vue-excel-xlsx';
import VueI18n from 'vue-i18n';
// element
import locale from 'element-ui/lib/locale';
import elTW from 'element-ui/lib/locale/lang/zh-TW';
import zhTW from 'vxe-table/lib/locale/lang/zh-TW';
import XEUtils from 'xe-utils';
import App from './App.vue';
import router from './router';
import Api from './plugins/api';
import store from './store';
import User from './plugins/user';
import global from './plugins/global';

// Enum
import cfEnumData from './plugins/global/cfEnumData';
import actEnumData from './plugins/global/actEnumData';
import almEnumData from './plugins/global/almEnumData';
import ipEnumData from './plugins/global/ipEnumData';
import cfButtonKey from './plugins/global/cfButtonKey';
import buttonKey from './plugins/global/buttonKey';
import cfChildrenTab from './plugins/global/cfChildrenTab';
import childrenTab from './plugins/global/childrenTab';
import commonMsgEnumData from './plugins/global/commonMsgEnumData';
import otherMsgEnumData from './plugins/global/otherMsgEnumData';
import cfMsgEnumData from './plugins/global/cfMsgEnumData';
import settingsEnumData, { SettingsEnum } from './plugins/global/settingsEnumData';

// Util
import cfCommonUtil from './plugins/util/cfCommonUtil';
import actCommonUtil from './plugins/util/actCommonUtil';
import almCommonUtil from './plugins/util/almCommonUtil';
import ipCommonUtil from './plugins/util/ipCommonUtil';

// Service
import authService from './plugins/service/authService';
import noticeService from './plugins/service/noticeService';
import generateFileService from './plugins/service/generateFileService';
import axiosService from './plugins/service/axiosService';

// 樣式
import '@/style/layout.scss';
import 'vxe-table/lib/style.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Vuex);
Vue.use(VueRx);
Vue.use(Api, {});
Vue.use(User, { router, message });
Vue.use(VueRouter);
Vue.use(FormModel);
Vue.use(Modal);
Vue.use(Tabs);
Vue.use(global, { router });

// Enum
Vue.use(cfEnumData);
Vue.use(actEnumData);
Vue.use(almEnumData);
Vue.use(ipEnumData);
Vue.use(buttonKey);
Vue.use(cfButtonKey);
Vue.use(childrenTab);
Vue.use(cfChildrenTab);
Vue.use(commonMsgEnumData);
Vue.use(cfMsgEnumData);
Vue.use(otherMsgEnumData);
Vue.use(settingsEnumData);
// Util
Vue.use(cfCommonUtil);
Vue.use(actCommonUtil);
Vue.use(almCommonUtil);
Vue.use(ipCommonUtil);
// Service
Vue.use(authService);
Vue.use(noticeService);
Vue.use(generateFileService);
Vue.use(axiosService);

// excel
Vue.use(VueExcelXlsx);
// vxe table
Vue.use(VXETable, {
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhTW, key), args),
});
// ant design
Vue.use(VueI18n);
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
Vue.component(Input.Password.name, Input.Password);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Input.Group.name, Input.Group);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Tag.name, Tag);
Vue.component(Transfer.name, Transfer);
Vue.component(TimePicker.name, TimePicker);
Vue.component(DatePicker.name, DatePicker);
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(Switch.name, Switch);
Vue.component(Card.name, Card);
Vue.component(Card.Meta.name, Card.Meta);
Vue.component(Tabs.name, Tabs);
Vue.component(Tabs.TabPane.name, Tabs.TabPane);
Vue.component(Tooltip.name, Tooltip);
Vue.component(ConfigProvider.name, ConfigProvider);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Checkbox.Group.name, Checkbox.Group);
Vue.component(Radio.name, Radio);
Vue.component(Radio.Group.name, Radio.Group);
Vue.component(Radio.Button.name, Radio.Button);
Vue.component(Upload.name, Upload);
Vue.component(Upload.Dragger.name, Upload.Dragger);
Vue.component(Collapse.name, Collapse);
Vue.component(Collapse.Panel.name, Collapse.Panel);
Vue.component(Empty.name, Empty);
// element-ui
Vue.component(select.name, select);
Vue.component(button.name, button);
Vue.component(transfer.name, transfer);
Vue.component(elCheckbox.name, elCheckbox);
Vue.component(elTree.name, elTree);

Vue.prototype.$notification = notification;
Vue.prototype.$message = message;

Vue.config.productionTip = false;

const i18n = new VueI18n({
  locale: 'zh_TW',
  messages: {
    zh_TW: {
      ...zhTW,
      ...elTW,
    },
  },
});
locale.i18n((key, value) => i18n.t(key, value));

new Vue({
  i18n,
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
