import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
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
  Table,
  Collapse,
  Divider,
  Badge,
  message,
  Tree,
  Tabs,
  Checkbox,
  Upload,
  notification,
  Pagination,
  Empty,
  Popconfirm,
  Tooltip,
  Result,
  TreeSelect,
  List,
  Radio,
} from "ant-design-vue";
import Space from "ant-design-vue/lib/space";
import "ant-design-vue/lib/space/style";
import "@/style/less/main.less";
import App from "./App.vue";
import router from "./router";
import Api from "./plugins/api";
import VueRx from "vue-rx";
import User from "./plugins/user";
import i18n from "./i18n";
import DatePicker from "@fubonlife/vue2-datepicker";
import "@fubonlife/vue2-datepicker/index.css";
import zhTW from "date-format-parse/lib/locale/zh-tw";
import TwDateFormatter from "./plugins/tw-date-formatter";
import "@/style/style.scss";
import lodash from 'lodash';
import store from './store';

Vue.use(Vuex);
Vue.use(VueRx);
Vue.use(Api, {});
Vue.use(User, { router, message });
Vue.use(VueRouter);
Vue.use(FormModel);
Vue.use(Modal);
Vue.use(Tabs);
Vue.use(TreeSelect);
Vue.use(Collapse);
Vue.use(Radio);
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
Vue.use(Input);
// Vue.component(Input.name, Input);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Tag.name, Tag);
// Vue.component(DatePicker.name, DatePicker);
// Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(Pagination.name, Pagination);
Vue.component(Empty.name, Empty);
Vue.component(Popconfirm.name, Popconfirm);
Vue.component(List.name, List);
Vue.component(List.Item.name, List.Item);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Popconfirm);
Vue.use(Tooltip);
Vue.use(Result);

Vue.prototype.$notification = notification;
Vue.prototype.$message = message;

Vue.use(TwDateFormatter);
Vue.component("DatePicker", DatePicker);

DatePicker.locale("zh-tw", {
  formatLocale: zhTW,
  yearFormat: (year) => {
    const twYear = year - 1911;
    return `${twYear} 年`;
  },
  monthFormat: "MMM",
  monthBeforeYear: false,
});

Vue.prototype['$_'] = lodash;

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
