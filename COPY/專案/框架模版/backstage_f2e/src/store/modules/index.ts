import {
	VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';

@Module({ namespaced: false })
class Index extends VuexModule {
	// 改為陣列方式，當有多筆API同時需要 loading時，可正常運作，採非同步方式
  isLoadingArr: string[] = [];

  windowSize: string = 'lg';

  get getLoading() {
  	return this.isLoadingArr.length > 0;
  }

  get getWindowSize() {
  	return this.windowSize;
  }

  @Mutation
  SET_LOADING(payload: boolean) {
  	if (payload) {
  		this.isLoadingArr.push('1');
  	} else {
  		this.isLoadingArr.shift();
  	}
  }

  @Mutation
  SET_WINDOWSIZE(payload: number) {
  	if (payload >= 1920) {
  		this.windowSize = 'xxl';
  	} else if (payload >= 1280) {
  		this.windowSize = 'xl';
  	} else if (payload >= 992) {
  		this.windowSize = 'lg';
  	} else if (payload >= 768) {
  		this.windowSize = 'md';
  	} else if (payload >= 576) {
  		this.windowSize = 'sm';
  	} else {
  		this.windowSize = 'xs';
  	}
  }

  @Action
  setLoading(payload) {
  	this.context.commit('SET_LOADING', payload);
  }

  @Action
  setWindowSize(payload) {
  	this.context.commit('SET_WINDOWSIZE', payload);
  }
}

export default Index;
