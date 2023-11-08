import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router'
import {
  Row,
  Col,
  Button,
  Layout,
  Menu,
  Icon,
  PageHeader,
  ConfigProvider,
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
  DatePicker,
  Table,
  Divider,
  Badge,
  message,
  Tree,
  Breadcrumb,
  Steps,
  Collapse,
  Descriptions,
  Empty,
  Transfer,
  Card,
  Upload,
  Popconfirm,
} from 'ant-design-vue';

import Space from 'ant-design-vue/lib/space';
import VueRx from 'vue-rx';
import App from './App.vue';
import router from './router';
import Api from './plugins/api';
import User from './plugins/user';
import Global from './plugins/global';
import EnumData from './plugins/global/enumData';
import ValidateUtil from './plugins/util/validateUtil';
import store from './store';

// 在Vue生成範圍內都認得以下的component
Vue.use(Vuex);
Vue.use(VueRx);
Vue.use(Api, {});
Vue.use(User, { router, message, Modal });
Vue.use(Global, { router });
Vue.use(EnumData);
Vue.use(ValidateUtil, {});
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
Vue.component(InputNumber.name, InputNumber);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Input.Password.name, Input.Password);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Input.Group.name, Input.Group);
Vue.component(Tag.name, Tag);
Vue.component(DatePicker.name, DatePicker);
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(ConfigProvider.name, ConfigProvider);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(Steps.name, Steps);
Vue.component(Steps.Step.name, Steps.Step);
Vue.component(Collapse.name, Collapse);
Vue.component(Collapse.Panel.name, Collapse.Panel);
Vue.component(Descriptions.name, Descriptions);
Vue.component(Descriptions.Item.name, Descriptions.Item);
Vue.component(Empty.name, Empty);
Vue.component(Transfer.name, Transfer);
Vue.component(Card.name, Card)
Vue.component(Upload.name, Upload)
Vue.component(Popconfirm.name, Popconfirm)
Vue.config.productionTip = false

Vue.prototype.$message = message;

// 生成Vue 定義作用範圍
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
