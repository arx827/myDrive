import Vue from 'vue';
import Vuex from 'vuex';

import Index from './modules/index';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		role: null,
	},
	getters: {
		getRole(state) {
			return state.role;
		},
	},
	mutations: {
		getRoleFromSession(state) {
			state.role = JSON.parse(sessionStorage.getItem('login_state')).selectedRole;
			console.log('mutations', state.role, JSON.parse(sessionStorage.getItem('login_state')).selectedRole);
		},
	},
	actions: {
		getRoleFromSession(context) {
			context.commit('getRoleFromSession');
		},
	},
	modules: {
		Index,
	},
});
