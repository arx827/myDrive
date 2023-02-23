import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import {
  Row,
  Col,
  Button,
  Layout,
  Menu,
  Icon,
  PageHeader,
  Avatar,
  Dropdown,
  Modal,
  Spin,
  Form,
  FormModel,
  Input,
  Select,
  InputNumber,
  Tag,
  // DatePicker,
  Checkbox,
  Radio,
  notification,
  Table,
  Collapse,
  Divider,
  Badge,
  message,
  Tree,
  Tabs,
  Upload,
  Pagination,
  Empty,
  Popconfirm,
  Switch,
  Tooltip,
  Result,
  TreeSelect,
  List,
  Popover,
} from 'ant-design-vue';
import Space from 'ant-design-vue/lib/space';
import 'ant-design-vue/lib/space/style';
import VueRx from 'vue-rx';
import Lodash from 'lodash';
import SlideUpDown from 'vue-slide-up-down';
import ZhTW from 'date-format-parse/lib/locale/zh-tw';
import DatePicker from '@fubonlife/vue2-datepicker';
import VueMask from 'v-mask';
import App from './App.vue';
import router from './router';
import Api from './plugins/api';
import store from './store';
import '@fubonlife/vue2-datepicker/index.css';
import 'bootstrap/scss/bootstrap.scss';
import TwDateFormatter from './plugins/tw-date-formatter';
import User from './plugins/user';
import Global from './plugins/global';
import EnumData from './plugins/global/enumData';
import BlobUtils from './plugins/global/blobUtils';
import DateTime from './plugins/dateTimeFormmat/dateTimeFormmat';
import InfoNotification from './plugins/info/infoNotification';

Vue.use(Vuex);
Vue.use(VueRx);
Vue.use(Api, {});
Vue.use(User, { router, message });
Vue.use(VueRouter);
Vue.use(FormModel);
Vue.use(Modal);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Popconfirm);
Vue.use(Tooltip);
Vue.use(Result);
Vue.use(Input);
Vue.use(Switch);
Vue.use(TreeSelect);
Vue.use(Collapse);
Vue.use(Global, { router });
Vue.use(EnumData);
Vue.use(BlobUtils);
Vue.use(DateTime);
Vue.use(InfoNotification);
Vue.use(VueMask);
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
Vue.component(InputNumber.name, InputNumber);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Tag.name, Tag);
Vue.component(Empty.name, Empty);
// Vue.component(DatePicker.name, DatePicker);
// Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(Pagination.name, Pagination);
Vue.component(Upload.name, Upload);
Vue.component(Popover.name, Popover);
// Vue.component(Empty.name, Empty);
// Vue.component(Popconfirm.name, Popconfirm);
// Vue.component(List.name, List);
// Vue.component(List.Item.name, List.Item);

Vue.prototype.$notification = notification;
Vue.prototype.$message = message;

Vue.use(TwDateFormatter);
Vue.component('DatePicker', DatePicker);
DatePicker.locale('zh-tw', {
  formatLocale: ZhTW,
  yearFormat: (year) => {
    const twYear = year - 1911;
    return `${twYear} 年`;
  },
  monthFormat: 'MMM',
  monthBeforeYear: false,
});

Vue.prototype.$_ = Lodash;
Vue.config.productionTip = false;
Vue.component('slide-up-down', SlideUpDown);

// 資料驗證
Vue.prototype.$validateForm = function (refsName) {
  return (this.$refs[refsName] as any).validate();
};

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
