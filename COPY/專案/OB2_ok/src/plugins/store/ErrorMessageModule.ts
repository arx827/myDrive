import { store } from '@/plugins/store';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, namespaced: true, store, name: 'ErrorMessageModule' })
export default class ErrorMessageInfoModule extends VuexModule {

    errorMessage: string = '';

    // 設定錯誤為500時的資訊
    @Mutation
    setErrorState(errorMessageInfo) {
        this.errorMessage = errorMessageInfo;
    }

    // 清除當前錯誤資訊
    @Mutation
    clearErrorSatae(){
        this.errorMessage = '';
    }

}

export const ErrorMessageModule = getModule(ErrorMessageInfoModule);