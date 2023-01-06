import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { getField, updateField } from "vuex-map-fields";
import { Getter } from "vuex-class";

// @Module({ namespaced: true, name: "SuspectLaundering" })
@Module({ namespaced: true })
class SuspectLaundering extends VuexModule {
  // 『是否符合』下拉選單的資料狀態
  public result: {
    [key: string]: string;
  } = {};

  amlReportData: [] = [];
  verCode: string = ''; //版本號
  initDataIsLoaded: boolean = false;

  suspectPageLoading: boolean = false;
  isSuspectUpdate: boolean = false;

  // getters
  get getField() {
    return getField(this);
  }

  get getAmlReportData() {
    return this.amlReportData;
  }

  @Mutation
  updateField(options: { path: string; value: unknown }) {
    // console.log("updateField", options);
    return updateField(this, options);
  }

  // 清空 result 資料
  @Mutation
  public resetField(payload): void {
    // console.log(this.result)
    this.result = {};
  }
  @Action
  onResetField(payload) {
    this.context.commit("resetField", payload);
  }

  // 代入 result 資料
  @Mutation
  public importField(result: { [key: string]: string }): void {
    // console.log("import field");
    this.result = result;
  }
  @Action
  onImportField(result: { [key: string]: string }) {
    this.context.commit("importField", result);
    // console.log(result)
  }

  // 更新題目資訊
  @Mutation
  updateDatas(data): void {
    this.amlReportData = data;
    this.isSuspectUpdate = true;
  }
  @Action
  onUpdateDatas(data) {
    this.context.commit("updateDatas", data);
  }

  // 更新版號
  @Mutation
  storeVerCode(verCode) {
    this.verCode = verCode;
  }
  @Action
  onStoreVerCode(verCode) {
    this.context.commit("storeVerCode", verCode);
  }

  get getIsSuspectUpdate() {
    return this.isSuspectUpdate;
  }
  @Mutation
  setInitDataIsLoaded(payload) {
    this.isSuspectUpdate = payload;
  }
  @Action
  onSetInitDataIsLoaded(payload) {
    this.context.commit("setInitDataIsLoaded", payload);
  }

  // page loading
  get getSuspectPageLoading() {
    return this.suspectPageLoading;
  }
  @Mutation
  SET_SUPECTPAGELOADING (payload: boolean) {
    this.suspectPageLoading = payload;
  }
  @Action
  setSupectPageLoading(payload) {
    this.context.commit("SET_SUPECTPAGELOADING", payload);
  }
}
export default SuspectLaundering;
