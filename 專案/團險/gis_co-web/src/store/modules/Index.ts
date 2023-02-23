import {
	VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import { getField, updateField } from 'vuex-map-fields';

export interface WAFModalModel{
  visible: boolean;
  htmlContent: string;
}
@Module({ namespaced: false })
class Index extends VuexModule {
  isLoading: boolean = false;

  WAFModalSetting: WAFModalModel = {
  	visible: false,
  	htmlContent: null,
  };

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
  }

  @Action
  setLoading(payload) {
  	this.context.commit('SET_LOADING', payload);
  }

  get getWAFModalSetting() {
  	return this.WAFModalSetting;
  }

  @Mutation
  SET_WAFMODAL(payload: WAFModalModel) {
  	this.WAFModalSetting = payload;
  }

  @Action
  setWAFModal(payload) {
  	this.context.commit('SET_WAFMODAL', payload);
  }
}
export default Index;
