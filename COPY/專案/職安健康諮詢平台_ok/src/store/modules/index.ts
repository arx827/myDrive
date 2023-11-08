import {
	VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import { getField, updateField } from 'vuex-map-fields';

@Module({ namespaced: false })
class Index extends VuexModule {
  isLoading = false;

  get getField() {
  	return getField(this);
  }

  @Mutation
  updateField(options: {path: string; value: unknown}) {
  	return updateField(this, options);
  }

  get getLoading() {
  	return this.isLoading;
  }

  @Mutation
  SET_LOADING(payload: boolean) {
  	this.isLoading = payload;
  	const $bodyEle = document.getElementsByTagName('body')[0];
  	if (payload) {
  	  $bodyEle.classList.add('loading-open');
  	} else {
  		$bodyEle.classList.remove('loading-open');
  	}
  }

  @Action
  setLoading(payload) {
  	this.context.commit('SET_LOADING', payload);
  }
}
export default Index;
