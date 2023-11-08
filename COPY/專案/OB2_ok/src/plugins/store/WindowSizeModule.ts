import { Module, VuexModule, Mutation, Action, MutationAction, getModule } from 'vuex-module-decorators';
import { store } from '@/plugins/store';


export interface WindowSizeModel{
    width:number,
    height:number
}

@Module({ dynamic: true, namespaced: true, store, name: 'WindowSizeModule' })
export default class WindowSizeModule extends VuexModule {
    //是否顯示提示訊息
    isShowAlter: boolean = false;
    // 瀏覽器大小
    size:WindowSizeModel ={height:0,width:0};

    // 取得目前local Storage的瀏覽器資訊
    @Mutation
    windowSize() {
        this.size = JSON.parse(localStorage.getItem("windowInfo"));
    }
    
    // 改變提示訊息的狀態
    @Mutation
    setRouterStatus() {
        this.isShowAlter = !this.isShowAlter;
    }

    // 設定瀏覽器資訊到local Storage
    @Mutation
    setWindowSize(windowSizeInfo){
        const windowSize:WindowSizeModel = {
            width:0,
            height:0
        };
        windowSize.height= windowSizeInfo.windowHeight;
        windowSize.width= windowSizeInfo.windowWidth;
        localStorage.setItem("windowInfo", JSON.stringify(windowSize));
    }

}

export const WindowModule = getModule(WindowSizeModule);