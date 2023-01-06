import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getField, updateField } from 'vuex-map-fields';
import {
  FnOccuDataVO, FnOccuResponseDto
} from "@fubonlife/edd-api-axios-sdk";


@Module({ namespaced: true })
class FinanceJobInfo extends VuexModule {
  public data;
  public financialSourceA: string[] = [];
  public financialSourceAOther: string = '';
  public financialSourceB: string[] = [];
  public financialSourceBOther: string = '';
  public debitUsed: string[] = [];
  public debitUsedOther: string = '';
  public debitSource: string[] = [];
  public debitSourceOther: string = '';
  public personalProperty_a: number = null;
  public realProperty_a: number = null;
  public guarantorAnnualIncome_a: number = null;
  public insuredAnnualIncome_a: number = null;
  public debt_a: number = null;
  public personalProperty_b: number = null;
  public realProperty_b: number = null;
  public guarantorAnnualIncome_b: number = null;
  public insuredAnnualIncome_b: number = null;
  public debt_b: number = null;

  financeJobinfoPageLoading: boolean = false;
  isFinanceJobinfoUpdate: boolean = false;

  get getField() {
    return getField(this)
  }

  // 財務與職業影像資訊表格
  get fnOccuImages() {
    return this.data ? this.data.fnOccuImages : [];
  }
  // // 是否為『A-大額還款交易』
  // get hasCaseAType() {
  //   return this.data ? this.data.hasTypeA : true;
  // }
  // // 是否為『9-短期密集借/還款交易』
  // get hasCaseNineType() {
  //   return this.data ? this.data.hasType9 : true;
  // }
  @Mutation
  updateField(options: {path: string; value: unknown}) {
    return updateField(this, options);
  }

  @Mutation
  getInitDatas(orgData : FnOccuResponseDto){
    this.data = orgData || {};
    // // 目前先塞客利資料
    this.financialSourceB = orgData.fnOccuData.fundSrc;
    this.financialSourceBOther = orgData.fnOccuData.fundSrcDesc;
    this.debitUsed = orgData.fnOccuData.debt;
    this.debitUsedOther = orgData.fnOccuData.loanUseDesc;
    this.debitSource = orgData.fnOccuData.repayFundSrc;
    this.debitSourceOther = orgData.fnOccuData.repayFundSrcDesc;
    this.personalProperty_b = orgData.fnOccuData.insFamilyIncome;
    this.realProperty_b = orgData.fnOccuData.movableProperty;
    this.guarantorAnnualIncome_b = orgData.fnOccuData.applAnnualIncome;
    this.insuredAnnualIncome_b = orgData.fnOccuData.applFamilyIncome;
    this.debt_b = orgData.fnOccuData.realEstate;

    this.isFinanceJobinfoUpdate = true;
  }

  @Action
  fetchInitDatas(apiResponseData: any) {
    this.context.commit("getInitDatas", apiResponseData);
  }

  @Mutation
  UPDATECASETYPE({type, val}){
    this.data[`hasType${type}`] = val;
  }
  @Action
  updateCaseType({type, val}){
    this.context.commit('UPDATECASETYPE', {type, val})
  }

  // page loading
  get getFinanceJobinfoPageLoading() {
    return this.financeJobinfoPageLoading;
  }
  @Mutation
  SET_FINANCEJOBINFOPAGELOADING (payload: boolean) {
    this.financeJobinfoPageLoading = payload;
  }
  @Action
  setFinanceJobinfoPageLoading(payload) {
    this.context.commit("SET_FINANCEJOBINFOPAGELOADING", payload);
  }

}
export default FinanceJobInfo