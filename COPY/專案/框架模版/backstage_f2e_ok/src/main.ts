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
	Table,
	Divider,
	Badge,
	message,
	Tree,
	ConfigProvider,
	Pagination,
	Progress,
	Tooltip,
	Popover,
	Upload,
	Collapse,
	Checkbox,
	Popconfirm,
	Radio,
	TreeSelect,
} from 'ant-design-vue';
import Space from 'ant-design-vue/lib/space';
import 'ant-design-vue/lib/space/style';
import VueRx from 'vue-rx';
import Fragment from 'vue-fragment';

import VueObserveVisibility from 'vue-observe-visibility';
import '@/style/backStageStyle/main.scss';
import '@fubonlife/vue2-datepicker/scss/index.scss';
// import 'bootstrap/scss/bootstrap-grid.scss';
// 時間套件
import DatePicker from '@fubonlife/vue2-datepicker';
import zhTW from 'date-format-parse/lib/locale/zh-tw';
import TwDateFormatter from './plugins/TwDateFormatter';
// import '@fubonlife/vue2-datepicker/index.css';

import BlobUtils from './plugins/BlobUtils/BlobUtils';
import router from './router';
import Global from './plugins/global';
import EnumData from './plugins/global/enumData';

import App from './App.vue';
import store from './store';

// 全域plugins
Vue.use(VueRx);
Vue.use(Global, { router });
Vue.use(EnumData);
Vue.use(BlobUtils, {});
Vue.use(VueRouter);

Vue.use(Fragment.Plugin);
Vue.use(Collapse);
Vue.use(VueObserveVisibility);

// antd
Vue.use(FormModel);
Vue.use(Modal);
Vue.component(Space.name, Space);
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Select.Option.name, Select.Option);
Vue.component(Select.OptGroup.name, Select.OptGroup);
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
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Tag.name, Tag);
Vue.component(Table.name, Table);
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
Vue.component(Table.Column.name, Table.Column);
Vue.component(Divider.name, Divider);
Vue.component(Badge.name, Badge);
Vue.component(Tree.name, Tree);
Vue.component(ConfigProvider.name, ConfigProvider);
Vue.component(Progress.name, Progress);
Vue.component(Pagination.name, Pagination);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Popover.name, Popover);
Vue.component(Collapse.name, Collapse);
Vue.component(Collapse.Panel.name, Collapse.Panel);
Vue.component(Upload.name, Upload);
Vue.component(Upload.Dragger.name, Upload.Dragger);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Checkbox.Group.name, Checkbox.Group);
Vue.component(Popconfirm.name, Popconfirm);
Vue.component(Radio.name, Radio);
Vue.component(Radio.Group.name, Radio.Group);
Vue.component(Radio.Button.name, Radio.Button);
Vue.component(TreeSelect.name, TreeSelect);
// Vue.config.productionTip = false;
// Vue.component('slide-up-down', SlideUpDown);

// 民國年套件設定
Vue.use(TwDateFormatter);
Vue.component('DatePicker', DatePicker);
DatePicker.locale('zh-tw', {
	formatLocale: zhTW,
	yearFormat: (year) => {
		const twYear = year - 1911;
		return `${twYear} 年`;
	},
	monthFormat: 'MMM',
	monthBeforeYear: false,
});

new Vue({
	store,
	router,
	render: (h) => h(App),
}).$mount('#app');
