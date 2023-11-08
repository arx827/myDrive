import Vue from 'vue';
import Vuex from 'vuex';

import Index from './modules';
import crawlerDataDetailVuex from './modules/crawlerDataDetail';
import modalControl from './modules/modalControl';

Vue.use(Vuex);
export default new Vuex.Store({
	modules: {
		Index,
		crawlerDataDetailVuex,
		modalControl,
	},
});
