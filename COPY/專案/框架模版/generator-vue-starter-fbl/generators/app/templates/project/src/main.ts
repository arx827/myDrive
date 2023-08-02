import Vue from 'vue';
import VueRouter from 'vue-router'
import { Row, Col, Button, Layout, Menu, Icon, PageHeader, Avatar, Dropdown, 
  Modal, Spin, Form, FormModel, Input, Select, InputNumber, Tag, DatePicker, 
  Table, Divider, Badge, message, Tree, Switch, TreeSelect } from 'ant-design-vue';
import Space from 'ant-design-vue/lib/space';
import 'ant-design-vue/lib/space/style';
import App from './App.vue'
import router from './router'
import Api from './plugins/api'
import VueRx from 'vue-rx';
import User from './plugins/user';

Vue.use(VueRx)
Vue.use(Api, {});
Vue.use(User, { router, message });
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
Vue.component(Tag.name, Tag);
Vue.component(DatePicker.name, DatePicker);
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(Switch.name, Switch);
Vue.component(TreeSelect.name, TreeSelect);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
