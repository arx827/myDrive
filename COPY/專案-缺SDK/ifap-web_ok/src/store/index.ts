import Vue from 'vue';
import Vuex from 'vuex';

import Index from './modules/Index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Index,
  },
});
