<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div
      class="container"
    >
      <div class="query__wrap">
        <h2 class="query__title">
          請輸入欲變更之員工資料
        </h2>
        <p class="info__txt primary__txt text-center">
          請擇一填寫
        </p>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :layout="'vertical'"
          :rules="formRules"
        >
          <a-radio-group
            v-model="queryOpt"
            default-value="1"
            class="query__list"
          >
            <a-radio
              class="query__item"
              :value="1"
            >
              保險證號(員工編號)
              <div
                v-if="queryOpt === 1"
                class="query__item-content"
              >
                <a-form-model-item prop="crtNo">
                  <a-input-search
                    v-model="form.crtNo"
                    block
                    enter-button
                    :disabled="isSearching"
                    @input="form.crtNo = $event.target.value.toUpperCase()"
                    @search="onSearch('crtNo', form.crtNo)"
                  />
                </a-form-model-item>
              </div>
            </a-radio>
            <a-radio
              class="query__item"
              :value="2"
            >
              身分證字號/居留證號碼
              <div
                v-if="queryOpt === 2"
                class="query__item-content"
              >
                <a-form-model-item prop="insIdNo">
                  <a-input-search
                    v-model="form.insIdNo"
                    block
                    enter-button
                    :disabled="isSearching"
                    @input="form.insIdNo = $event.target.value.toUpperCase()"
                    @search="onSearch('insIdNo', form.insIdNo)"
                  />
                </a-form-model-item>
              </div>
            </a-radio>
            <a-radio
              class="query__item"
              :value="3"
            >
              員工姓名
              <a-popover
                trigger="click"
                placement="top"
              >
                <template slot="content">
                  <div>原住民特殊字元可以複製以下字元使用</div>
                  <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
                </template>
                <a-icon
                  type="info-circle"
                  :style="{ color: '#4CAAF5' }"
                  @click="isreplyTypeModal = true"
                />
              </a-popover>
              <div
                v-if="queryOpt === 3"
                class="query__item-content"
              >
                <a-form-model-item prop="insName">
                  <a-input-search
                    v-model="form.insName"
                    vue="true"
                    alt="webfont"
                    block
                    enter-button
                    :disabled="isSearching"
                    @search="onSearch('insName', form.insName)"
                  />
                </a-form-model-item>
              </div>
            </a-radio>
          </a-radio-group>
        </a-form-model>
      </div>
      <div
        v-if="resultDatas"
        class="query__content"
      >
        <div class="query__result">
          <p
            v-if="resultDatas.length > 1"
            class="info__txt primary__txt text-center"
          >
            查詢到多筆員工資料，請擇一進行資料變更
          </p>
          <p
            v-if="resultDatas.length === 0"
            class="info__txt primary__txt text-center"
          >
            查詢無資料
          </p>
          <UserDataCard
            v-for="(user) in resultDatas"
            :key="user.insId"
            :card-selected="user.selectModel!=='請選擇'"
            :user-name="user.insName"
            :user-sex="user.sex"
            :user-type="user.attribute"
            :datas="[user.insId, user.nationality, user.sex, user.birthDate, user.attribute]"
          >
            <template v-slot:others>
              <a-select
                v-model="user.selectModel"
                label-in-value
                class="card__dropdown"
                default-value="{ key: 'default' }"
                style="width: 170px; position: absolute; right: 26px;"
                @change="onChangeSelect($event, user)"
              >
                <a-select-option
                  v-for="(opt) in queryOptions"
                  :key="opt.label"
                  class="card__dropdown__item"
                  :value="opt.key"
                >
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </template>
          </UserDataCard>
          <div class="clearfix" />
          <div
            v-if="empFamilyInfo!==null"
            ref="familyblock"
            class="family__info__wrap"
          >
            <p
              v-if="empFamilyInfo.length > 1"
              class="info__txt primary__txt text-center"
            >
              查詢到多筆員工資料，請擇一進行資料變更
            </p>
            <p
              v-if="empFamilyInfo.length === 0"
              class="info__txt primary__txt text-center"
            >
              查詢無資料
            </p>
            <a-radio-group
              v-model="familySelected"
              name="radioGroup"
              class="w-100"
              :default-value="0"
            >
              <div
                v-for="(family, index) in empFamilyInfo"
                :key="index"
                class="position-relative"
              >
                <a-radio
                  :value="index"
                  class="user__check"
                />
                <UserDataCard
                  :card-selected="false"
                  :user-name="family.insName"
                  :user-sex="family.sex"
                  :user-type="1"
                  :datas="[family.insId, family.nationality, family.sex, family.birthDate, family.attribute]"
                />
              </div>
            </a-radio-group>
          </div>
          <div
            class="block__btns text-center"
          >
            <button
              :disabled="selected === null"
              class="btn__radius--primary"
              @click="onSubmit"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	FGPEMPNEmployeeQueryModel,
	EmpFamGeneralChangeDto,
	FGPEMPNFamilyQueryModel,
} from '@fubonlife/co-giiss-api-axios-sdk';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, UserDataCard } })
export default class EmpFamilyPolicyChangeQuery extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  // 查詢條件:1. 保險證號(員工編號), 2. 身分證字號/居留證號碼, 3. 員工姓名
  queryOpt = 1;

  // 功能查詢選項
  queryOptions = [
  	{ label: '請選擇', key: 'default' },
  	{ label: '員工及眷屬退保', key: 'EmpFamilyPolicyChangeSurrenderList' },
  	{ label: '員工薪資變更', key: 'EmployeeSalaryChange' },
  	{ label: '員工基本資料變更', key: 'EmployeeGeneralInfoChange' },
  	{ label: '眷屬基本資料變更', key: 'FamilyGeneralInfoChange' },
  	{ label: '員工投保內容變更', key: 'EmployeeInsuredContentChangeApplication' },
  	{ label: '眷屬投保內容變更', key: 'FamilyInsuredContentChangeApplication' },
  ]

  resultDatas = null; // 查詢結果(員工資料)

  selected = null; // 選擇功能

  empFamilyInfo = null; // 員工眷屬資料

  familySelected = 0; // 選中之員眷

  isSearching = false; // 正在查詢(call API)變數

  form = {
  	// crtNo: 'A104466032',
  	crtNo: '',
  	insId: '',
  	// insName: '劉ＸＸＸ',
  	insName: '',
  	policyModel: {},
  }

  formRules = {
  	insId: [{ required: true, message: '請填入有效身分證字號' }, { pattern: /[A-Z]\d/, message: '輸入格式錯誤' }],
  	crtNo: [{ required: true, message: '請填入有效保險證號' }, { pattern: /^[A-Za-z0-9~\!@#\$%\^&\*\(\)_\+\{\}\|\:"<>\?`\-\=\[\]\\;',\.\/]{1,10}$/, message: '保險證號輸入格式錯誤' }],
  	insName: [{ required: true, message: '請填入有效姓名' }, { max: 100, message: '姓名輸入格式錯誤' }],
  }

  updated() {
  	window.parseWord();
  }

  onChangeSelect(val, user) {
  	// 一次只能選擇一位人員進行功能, 選擇前先清空原有選擇
  	if (this.selected !== null) {
  		this.resultDatas.forEach((element) => {
  			element.selectModel = { key: 'default' };
  		});
  	}
  	user.selectModel = val; // 選定功能
  	this.selected = val.key === 'default' ? null : user; // 選定人員資料

  	// 若選擇眷屬投保內容變更/眷屬基本資料變更 功能, 須先取得眷屬資料
  	if (user.selectModel.label.trim() == '眷屬投保內容變更' || user.selectModel.label.trim() == '眷屬基本資料變更') {
  		this.getFamilyInfo(user);
  	} else {
  		this.empFamilyInfo = null;
  	}

  	// 選擇完功能滑到頁面最下方
  	const el: any = this.$el;
  	const $el = el.getElementsByClassName('block__btns')[0];
  	if ($el) {
  		$el.scrollIntoView({ behavior: 'smooth' });
  	}
  }

  // key: 條件名稱(保險證號(員工編號)or保險證號(員工編號)or員工姓名), val: 輸入的值
  search(key, val) {
  	const data: FGPEMPNEmployeeQueryModel = {
  		policyModel: this.$userInfo.getPolicyModel(),
  	};

  	data[key] = val;

  	this.empFamilyInfo = null; // 清空員眷資料

  	this.isSearching = true;
  	this.setLoading(true);

  	this.$coUtilityApi.getEmpPageUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  			  this.resultDatas = resp.data.data;
  				this.resultDatas.forEach((element) => {
  					this.$set(element, 'selectModel', { key: 'default' }); // 新增"請選擇"選項
  				});
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.isSearching = false;
  			this.setLoading(false);
  		});
  }

  onSearch(key, val) {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.search(key, val);
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // 取得眷屬資料
  getFamilyInfo(data) {
  	const inputData: FGPEMPNFamilyQueryModel = {
  		crtNo: data.input.crtNo,
  		policyModel: this.$userInfo.getPolicyModel(),
  	};
  	this.setLoading(true);
  	this.$coUtilityApi.getEmpFamilyPageUsingPOST(inputData)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.empFamilyInfo = resp.data.data;
  				this.empFamilyInfo.forEach((e) => {
  					this.$set(e, 'isCheck', false);
  				});
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  async onSubmit() {
  	console.log(this.selected.selectModel.label.trim());
  	const vm = this;
  	let query = this.selected;
  	let request: EmpFamGeneralChangeDto;

  	switch (vm.selected.selectModel.label.trim()) {
  	case '員工基本資料變更': // 如果選擇員工基本資料變更，要先查是否可以變更
  		request = {
  			empFamilyChangeInput: vm.selected.input,
  			policyModel: vm.$userInfo.getPolicyModel(),
  		};
  		vm.setLoading(true);
  		await vm.$employeeFamilyGeneralInfoChangeApi
  			.oneGeneralInfoUsingPOST(request)
  			.then(async (resp) => {
  				console.log(resp);
  				if (resp.data.status === 200) {
  					query = {
  						...vm.selected, ...resp.data.data,
  					};
  					query = await this.$encryptionDecryption.encrypt(JSON.stringify(query)); // 加密
  					this.$global.changeRouterAndaddParam({
  						toRouter: this.selected.selectModel.key,
  						query,
  					});
  				} else {
  					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				}
  			})
  			.catch(console.error)
  			.finally(() => vm.setLoading(false));
  		break;

  	case '眷屬基本資料變更':
  		if (this.empFamilyInfo === null || this.empFamilyInfo.length === 0) {
  			notification.error({ Content: '請選擇欲查詢員眷' });
  		} else {
  			request = {
  				empFamilyChangeInput: vm.empFamilyInfo[vm.familySelected].input,
  				policyModel: vm.$userInfo.getPolicyModel(),
  			};
  			vm.setLoading(true);
  			await vm.$employeeFamilyGeneralInfoChangeApi
  				.oneFamilyGeneralInfoUsingPOST(request)
  				.then(async (resp) => {
  					console.log(resp);
  					if (resp.data.status === 200) {
  						query = {
  							empInfo: vm.selected,
  							empFamilyInfo: { ...vm.empFamilyInfo[vm.familySelected], ...resp.data.data },
  						};
  					  query = await this.$encryptionDecryption.encrypt(JSON.stringify(query)); // 加密

  						this.$global.changeRouterAndaddParam({
  							toRouter: this.selected.selectModel.key,
  							query,
  						});
  					} else {
  						notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  					}
  				})
  				.catch(console.error)
  				.finally(() => vm.setLoading(false));
  		}
  		break;

  	case '眷屬投保內容變更':
  		console.log(this.empFamilyInfo[this.familySelected]);
  		if (this.empFamilyInfo === null || this.empFamilyInfo.length === 0) {
  			notification.error({ Content: '請選擇欲查詢員眷' });
  			return;
  		}

  	  query = {
  			empInfo: this.selected,
  			empFamilyInfo: this.empFamilyInfo[this.familySelected],
  		};
  		query = await this.$encryptionDecryption.encrypt(JSON.stringify(query)); // 加密

  		this.$global.changeRouterAndaddParam({
  			toRouter: this.selected.selectModel.key,
  			query,
  		});

  		break;

  	default:
  	  query = await this.$encryptionDecryption.encrypt(JSON.stringify(query)); // 加密
  		this.$global.changeRouterAndaddParam({
  			toRouter: this.selected.selectModel.key,
  			query,
  		});
  	}
  }
}
</script>

<style lang="scss" scoped>
  .family__info__wrap {
    border-top: 1px #CECECE dashed;
    padding-top: 25px;
    margin-top: 10px;
  }
  .info__txt {
    margin: 10px 0;
  }
  .query__content {
    width: 900px;
    max-width: 100%;
    margin: 20px auto 0 auto;
    padding-bottom: 80px;
  }
  .query__result {
    border-top: 1px #CECECE dashed;
    padding-top: 25px;
  }
  .block__btns {
    margin-top: 80px;
    button {
      width: 150px;
      max-width: 100%;
    }
  }
  .user__check {
    position: absolute;
    left: -25px;
    top: 50%;
    margin-top: -8px;
  }
  ::v-deep {
    .ant-select {
      font-size: 14px;
      * {
        font-size: 14px;
      }
    }
    .dropdown__item {
      font-size: 14px;
    }
    .ant-input-search-button {
      height: 32px;
    }
    .ant-radio {
      top: -2px;
    }
    .ant-form-vertical .ant-form-item {
      margin: 0;
    }
    .query__tab {
      width: 100%;
      .ant-radio-button-wrapper {
        width: 50%;
        text-align: center;
      }
    }
  }
</style>
