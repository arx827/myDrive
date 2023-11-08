<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-baseline">
      <div class="page__title">
        參數維護
      </div>
      <div>
        <button
          class="btn__radius--primary--outline--small"
          @click="openModal"
        >
          新增系統參數
        </button>
      </div>
    </div>

    <div class="form__container">
      <div class="form__container__title">
        參數紀錄查詢
      </div>

      <a-form-model
        ref="formRef"
        :rules="formRules"
        :model="form"
      >
        <div class="row form__option">
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                分類代碼／名稱
              </div>
            </div>
            <a-form-model-item
              prop="className"
            >
              <a-select
                v-model="form.className"
                show-search
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(d, idx) in selectlist"
                  :key="`paramList_${idx}`"
                  :value="d.codeType"
                >
                  {{ d.codeType }} {{ d.codeName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                代碼內容
              </div>
            </div>
            <a-form-model-item
              prop="classContent"
            >
              <a-input
                v-model="form.classContent"
                class="input__block"
              />
            </a-form-model-item>
          </div>
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                備註
              </div>
              <div class="input__restriction">
                字數上限250字
              </div>
            </div>
            <a-form-model-item
              prop="note"
            >
              <a-textarea
                v-model="form.note"
                class="text-area"
                placeholder="字數上限250字。"
                :auto-size="{minRows: 4}"
              />
            </a-form-model-item>
          </div>
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                保留欄位一
              </div>
              <div class="input__restriction">
                字數上限100字
              </div>
            </div>
            <a-form-model-item
              prop="reserved1"
            >
              <a-textarea
                v-model="form.reserved1"
                class="text-area"
                placeholder="字數上限100字。"
                :auto-size="{minRows: 2}"
              />
            </a-form-model-item>
          </div>
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                保留欄位二
              </div>
              <div class="input__restriction">
                字數上限100字
              </div>
            </div>
            <a-form-model-item
              prop="reserved2"
            >
              <a-textarea
                v-model="form.reserved2"
                class="text-area"
                placeholder="字數上限100字。"
                :auto-size="{minRows: 2}"
              />
            </a-form-model-item>
          </div>
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                保留欄位三
              </div>
              <div class="input__restriction">
                字數上限100字
              </div>
            </div>
            <a-form-model-item
              prop="reserved3"
            >
              <a-textarea
                v-model="form.reserved3"
                class="text-area"
                placeholder="字數上限100字。"
                :auto-size="{minRows: 2}"
              />
            </a-form-model-item>
          </div>
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                是否啟用
              </div>
            </div>
            <a-form-model-item
              prop="enabled"
            >
              <a-radio-group
                v-model="form.enabled"
                class="row"
                :default-value="form.enabled"
              >
                <div class="col-12 col-md-3">
                  <a-radio
                    class="radio__block"
                  >
                    全部（預設）
                  </a-radio>
                </div>
                <div class="col-12 col-md-3">
                  <a-radio
                    value="Y"
                    class="radio__block"
                  >
                    是
                  </a-radio>
                </div>
                <div class="col-12 col-md-3">
                  <a-radio
                    value="N"
                    class="radio__block"
                  >
                    否
                  </a-radio>
                </div>
              </a-radio-group>
            </a-form-model-item>
          </div>
        </div>
      </a-form-model>
    </div>
    <div class="button__wrap text-center">
      <button
        class="btn__radius--primary--outline"
        @click="reset"
      >
        重設
      </button>
      <button
        class="btn__radius--primary"
        @click="search"
      >
        查詢
      </button>
    </div>
    <ParamModal
      :modal-type.sync="modalType"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ParamModal from '@admin/paramMaintain/ParamModal.vue';
// import { Action } from 'vuex-class';

@Component({
	components: {
		// FblDataGrid,
		ParamModal,
	},
})
export default class ParamMaintainIndex extends Vue {
	// @Action('setLoading') setLoading;

	selectlist = null;

	// 系統參數 CRUD modal 顯示: ['none', 'create', 'edit', 'delete']
	modalType = 'none';

	form = {
		className: undefined,
		classContent: undefined,
		reserved1: undefined,
		reserved2: undefined,
		reserved3: undefined,
		enabled: undefined,
		note: undefined,
	}

	formRules = {
		note: [{ max: 250, message: '字數上限250字', trigger: 'change' }],
		reserved1: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
		reserved2: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
		reserved3: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
	}

	filterOption(input, option) {
		return (
			option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
		);
	}

	reset() {
		this.form = {
			className: undefined,
			classContent: undefined,
			enabled: undefined,
			reserved1: undefined,
			reserved2: undefined,
			reserved3: undefined,
			note: undefined,
		};
		(this.$refs.formRef as any).resetFields();
	}

	search() {
		(this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				this.$global.changeRouterAndaddParam({
					toRouter: 'ParamMaintainList',
					query: this.form,
				});
			} else {
				console.log('Validation failed.');
				return false;
			}
		});
	}

	openModal() {
		this.modalType = 'create';
	}

	created() {
		// TEST:
		const TESTDATA = [
			{
				codeType: 'AGENT',
				codeName: '代理人相關設定',
			},
			{
				codeType: 'ALCASEINQUIRYPDF',
				codeName: 'FRSTPDF',
			},
			{
				codeType: 'ALCOHOL_TYPE',
				codeName: '是否有喝酒',
			},
			{
				codeType: 'ARECA_TYPE',
				codeName: '是否有嚼食檳榔',
			},
			{
				codeType: 'CARE_RECORD_TYPE',
				codeName: '護理紀錄類別',
			},
			{
				codeType: 'CHECK_PERIOD',
				codeName: '檢查時期',
			},
			{
				codeType: 'CITY_DIVIDE',
				codeName: '工作地點分區',
			},
			{
				codeType: 'DOWNLOAD_FILE_NAME',
				codeName: '健康促進活動QrCode',
			},
			{
				codeType: 'DOWNLOAD_FILE_NAME',
				codeName: '檔案下載名稱',
			},
			{
				codeType: 'E0401',
				codeName: '職業壓力過負荷評估量表種類',
			},
			{
				codeType: 'EH_FILE',
				codeName: '人因性文件上傳路徑',
			},
			{
				codeType: 'EH_FILE_LOCAL',
				codeName: '人因性文件上傳路徑',
			},
			{
				codeType: 'EH_FORM_NAME',
				codeName: '人因性問卷名稱',
			},
			{
				codeType: 'EH_FORM_TYPE',
				codeName: '人因性問卷分類',
			},
			{
				codeType: 'EH_IMG',
				codeName: '人因性banner',
			},
			{
				codeType: 'EH_IMG_LOCAL',
				codeName: '人因性banner',
			},
			{
				codeType: 'EH_IMPROVE_LEVEL',
				codeName: '人因性改善分級',
			},
			{
				codeType: 'EH_ITEM',
				codeName: '人因性改善衛教項目',
			},
			{
				codeType: 'EH_LEVEL',
				codeName: '人因性分級',
			},
			{
				codeType: 'EH_OPT_VALUE',
				codeName: '人因性問卷答案',
			},
			{
				codeType: 'EH_TOPIC_CONFIG_PATH',
				codeName: '人因性路口圖片路徑',
			},
			{
				codeType: 'EH_TOPIC_TYPE',
				codeName: '人因性危害預防計畫問卷題目分類',
			},
			{
				codeType: 'ERGONOMIC_HAZARD_PN',
				codeName: '人因性負責護理師',
			},
			{
				codeType: 'EVENT_EDM',
				codeName: '場次報名表EDM',
			},
			{
				codeType: 'EVENT_EDM_LOCAL',
				codeName: '場次報名表EDM',
			},
			{
				codeType: 'F_RISK_SCORE',
				codeName: '心力評量表',
			},
			{
				codeType: 'FORM_STATUS',
				codeName: '表單狀態',
			},
			{
				codeType: 'HE_EXCEL',
				codeName: '人因性檔案上傳路徑',
			},
			{
				codeType: 'HE_EXCEL_LOCAL',
				codeName: '人因性檔案上傳暫存',
			},
			{
				codeType: 'HEALTH_CHECK_DATA_TYPE',
				codeName: '健檢資料建立方式',
			},
			{
				codeType: 'HEALTH_CHECK_ITEM',
				codeName: '健康快e通衛教項目',
			},
			{
				codeType: 'HEALTH_CHECK_ITEM_TYPE',
				codeName: '健檢小項',
			},
			{
				codeType: 'HEALTH_CHECK_MAIN_ITEM_TYPE',
				codeName: '健檢大項',
			},
			{
				codeType: 'HEALTH_CHECK_TYPE',
				codeName: '健檢類別',
			},
			{
				codeType: 'HEATLHEXCEL',
				codeName: '下載健檢資料',
			},
			{
				codeType: 'IMAGE',
				codeName: '富邦LOGO',
			},
			{
				codeType: 'INDEX_CONTENT',
				codeName: '首頁顯示項目',
			},
			{
				codeType: 'INDEX_PAGE',
				codeName: '頁面',
			},
			{
				codeType: 'JOB_STATUS',
				codeName: '員工狀態',
			},
			{
				codeType: 'LEVEL',
				codeName: '綜合分級',
			},
			{
				codeType: 'LEVEL_STRING',
				codeName: '低中高對照',
			},
			{
				codeType: 'MON_ITEM',
				codeName: '母性保護衛教項目',
			},
			{
				codeType: 'MON_PLAN_IMG',
				codeName: '活動內容-圖片',
			},
			{
				codeType: 'MON_PLAN_PN',
				codeName: '過負荷負責護理師',
			},
			{
				codeType: 'MON_PLAN_TYPE',
				codeName: '母性保護狀態',
			},
			{
				codeType: 'MON_PLAN_WP_IMPORT',
				codeName: '作業環境評估表',
			},
			{
				codeType: 'NOTIFY_CONTENT_FILE',
				codeName: '通知內容檔案路徑',
			},
			{
				codeType: 'NURSE_TYPE',
				codeName: '證書類別',
			},
			{
				codeType: 'OFFICAL_SENDMAIL',
				codeName: '職安專案寄送通知',
			},
			{
				codeType: 'OVER_LOAD_F_RISK',
				codeName: '十年心血管風險',
			},
			{
				codeType: 'OVER_LOAD_FORM_TYPE',
				codeName: '表單種類',
			},
			{
				codeType: 'OVER_LOAD_IMG',
				codeName: '異常負荷圖片',
			},
			{
				codeType: 'OVER_LOAD_LEVEL',
				codeName: '過負荷等級',
			},
			{
				codeType: 'OVER_LOAD_PERSONAL',
				codeName: '個人過勞結果',
			},
			{
				codeType: 'OVER_LOAD_RESULT',
				codeName: '過負荷結果',
			},
			{
				codeType: 'OVER_LOAD_SPEC',
				codeName: '過負荷分類',
			},
			{
				codeType: 'OVER_LOAD_WORK',
				codeName: '工作過勞結果',
			},
			{
				codeType: 'OVERLOAD_ITEM',
				codeName: '異常負荷衛教項目',
			},
			{
				codeType: 'OVERLOAD_PN',
				codeName: '過負荷負責護理師',
			},
			{
				codeType: 'PHY_CANCEL_REASON',
				codeName: '醫師諮詢取消原因',
			},
			{
				codeType: 'PHY_CONSULT_FILE',
				codeName: '醫師諮詢檔案路徑',
			},
			{
				codeType: 'PHY_CONSULT_FILE_LOCAL',
				codeName: '醫師諮詢檔案路徑',
			},
			{
				codeType: 'PHY_CONSULT_STATUS',
				codeName: '醫生諮詢狀態',
			},
			{
				codeType: 'PHY_EDM',
				codeName: '醫師諮詢EDM',
			},
			{
				codeType: 'PHY_FORM_TYPE',
				codeName: '醫師面談表單類型',
			},
			{
				codeType: 'PHY_MEASURE_TYPE',
				codeName: '醫師面談採取措施類型',
			},
			{
				codeType: 'PHY_SENDMAIL',
				codeName: '醫師諮詢活動寄送通知',
			},
			{
				codeType: 'QUESTIONNAIRE_STATUS',
				codeName: '問卷狀態',
			},
			{
				codeType: 'REVIEW_STATUS',
				codeName: '覆核狀態',
			},
			{
				codeType: 'SATISFY_EDM',
				codeName: '滿意度問卷EDM',
			},
			{
				codeType: 'SATISFY_EDM_LOCAL',
				codeName: '滿意度問卷EDM',
			},
			{
				codeType: 'SAV_WEB_SERVICE',
				codeName: 'SAV SSO驗證',
			},
			{
				codeType: 'SAV_WEB_SERVICE',
				codeName: 'SAV SSO驗證token',
			},
			{
				codeType: 'SHIFT_WORK_TYPE',
				codeName: '班別',
			},
			{
				codeType: 'SMOKE_TYPE',
				codeName: '是否有吸菸',
			},
			{
				codeType: 'SRC_FROM',
				codeName: '計畫來源',
			},
			{
				codeType: 'TESTDOWNPDF',
				codeName: '測試下載PDF',
			},
			{
				codeType: 'TODO_LIST',
				codeName: '待辦事項',
			},
			{
				codeType: 'TRACK_PERIOD',
				codeName: '追蹤週期',
			},
			{
				codeType: 'UPLOAD_DOC',
				codeName: '文件位置',
			},
			{
				codeType: 'UPLOAD_PICTURE',
				codeName: '圖片暫存路徑',
			},
			{
				codeType: 'UPLOAD_PICTURE_LOCAL',
				codeName: '圖片路徑上傳',
			},
			{
				codeType: 'URINE_TYPE',
				codeName: '尿液檢查',
			},
			{
				codeType: 'WEBURL',
				codeName: '職安平台網址',
			},
			{
				codeType: 'WORK_CLASS_STATUS',
				codeName: '班別',
			},
			{
				codeType: 'YES_OR_NO',
				codeName: '是否',
			},
			{
				codeType: 'ZIP_FILE',
				codeName: '醫生諮詢表單ZIP',
			},
		];
		this.selectlist = TESTDATA;
		// this.setLoading(true);
		// this.$AdminControlAdminApi.codeTypeListUsingPOST()
		// 	.then((resp) => {
		// 		this.selectlist = resp.data.data;
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status => ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}
}
</script>
<style lang="scss" scoped>
  .form__container {
    background-color: $BS-COLOR-MAIN10;
    border-radius: 10px;
    padding: 30px (92/1088)*100%;
    margin-bottom: 40px;
  }
  .form__container__title {
    font-size: 24px;
    font-weight: $BS-TEXT-BOLD;
    margin-bottom: 30px;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    .input__title {
      font-size: 16px;
      font-weight: $BS-TEXT-BOLD;
    }
    .input__restriction {
      font-size: 14px;
      color: $BS-COLOR-GRAY10;
    }
  }
  .radio__block {
    margin-bottom: 10px;
  }
  .button__wrap {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    padding-bottom: 40px;
    @media(min-width: 768px) {
      flex-direction: row;
      justify-content: center;
    }
    button {
      width: 200px;
      max-width: 100%;
      margin: 5px;
    }
  }
  ::v-deep{
    .ant-form-item {
      margin: 0px;
      padding-bottom: 20px;
    }
    // 下拉選單
    .ant-select-selection__rendered {
      padding-left: 4px;
      margin-top: 6px;
    }
    .ant-select-selection {
      height: 42px !important;
    }
    .ant-input {
      height: 42px;
      padding: 12px;
      font-size: 16px;
    }
  }
</style>
