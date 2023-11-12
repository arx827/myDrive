<template>
  <div class="container">
    <div class="page__title">
      報表查詢下載
    </div>
    <div class="query__title">
      想找什麼報表？
    </div>
    <a-form-model
      ref="formRef"
      :rules="formRules"
      :model="form"
    >
      <a-form-model-item
        prop="choose"
      >
        <a-radio-group
          v-model="form.choose"
          class="row"
        >
          <div
            v-for="item in donwloadEnumList"
            :key="item.key"
            class="col-xl-4 col-md-6 col-12 mb-3"
          >
            <div class="report__block">
              <div class="radio__block">
                <a-radio
                  :value="item.key"
                />
              </div>
              <div class="input__block">
                <div class="input__name">
                  {{ item.label }}
                </div>
                <div class="input__title d-flex">
                  <div>{{ item.subtitle }}</div>
                  <div class="mark-required">
                    *
                  </div>
                </div>
                <a-form-model-item
                  :prop="item.key"
                >
                  <date-picker
                    v-model="form[item.key]"
                    class="year__block"
                    type="year"
                    :format="'YYYY'"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        :disabled="!form.choose"
        @click="goDownLoad"
      >
        下載
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { HfePeriodDto, HumanFactorsExecutiveReportDownLoadDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';

@Component({ components: {} })
export default class ReportDownLoadIndex extends Vue {
  @Action('setLoading') setLoading;

  donwloadEnumList = [
  	{
  		key: 'yearReport',
  		label: '人因性危害預防統計報表',
  		subtitle: '查詢時間(年)',
  	},
  	{
  		key: 'executeReportDate',
  		label: '執行報告',
  		subtitle: '查詢時間(年)',
  	},
  ]

  form = {
  	choose: null,
  	yearReport: new Date(),
  	executeReportDate: new Date(),
  }

  // 表單欄位規則
  formRules = {
  	// choose: [{ required: true, message: '請選擇報表', trigger: 'change' }],
  	yearReport: [{ required: true, message: '查詢時間(年)為必填', trigger: 'change' }],
  	executeReportDate: [{ required: true, message: '查詢時間(年)為必填', trigger: 'change' }],
  }

  checkFrom(): boolean {
  	let isValid = false;
  	(this.$refs.formRef as any).validate((valid) => {
  		if (!valid) {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  			isValid = false;
  		} else {
  			isValid = true;
  		}
  	});
  	return isValid;
  }

  goDownLoad() {
  	if (!this.checkFrom()) {
  		return;
  	}
  	const choose = this.form.choose;
  	this.setLoading(true);
  	if (this.donwloadEnumList.find((i) => i.key == choose).key === 'yearReport') {
  		const downloadData: HfePeriodDto = {
  			period: this.form.yearReport.getFullYear().toString(),
  		};
  		this.fetchDownloadYearReport(downloadData);
  	} else {
  		const downloadData: HumanFactorsExecutiveReportDownLoadDto = {
  			year: this.form.executeReportDate.getFullYear().toString(),
  		};
  		this.fetchDownloadExecuteReportDate(downloadData);
  	}
  }

  // API: 下載-人因性報表
  fetchDownloadYearReport(downloadData) {
  	this.$HfeRpnHfeHumanFactorReportControllerApi.getHfeDownLoadUsingPOST(downloadData, { responseType: 'blob', timeout: 3 * 60 * 1000 })
  		.then((resp) => {
  			setTimeout(() => {
  				const disposition = resp.headers['content-disposition'];
  				if (disposition) {
  					let filename = '';
  					if (disposition.indexOf('attachment') !== -1) {
  						const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  						const matches = filenameRegex.exec(disposition);
  						if (matches != null && matches[1]) {
  							filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  						}
  					}
  					this.$blobUtils.download(
              resp.data as Blob,
              filename,
              resp.headers['content-type'],
  					);
  				} else {
  					this.$HfeRpnHfeHumanFactorReportControllerApi.getHfeDownLoadUsingPOST(downloadData)
  						.then((resp) => {
  							const respData = JSON.stringify(resp);
  							const apiErrorMsg = JSON.parse(respData).data.apiError;
  							this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  						}).catch((error) => {
  							console.log(error);
  						}).finally(() => {
  							this.setLoading(false);
  						});
  				}
  			}, 30 * 1000);
  		})
  		.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 下載-人因性報表
  fetchDownloadExecuteReportDate(downloadData) {
  	this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.qumanFactorsExecutiveReportDownLoadUsingPOST(downloadData, { responseType: 'blob', timeout: 3 * 60 * 1000 })
  		.then((resp) => {
  			setTimeout(() => {
  				const disposition = resp.headers['content-disposition'];
  				if (disposition) {
  					let filename = '';
  					if (disposition.indexOf('attachment') !== -1) {
  						const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  						const matches = filenameRegex.exec(disposition);
  						if (matches != null && matches[1]) {
  							filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  						}
  					}
  					this.$blobUtils.download(
              resp.data as Blob,
              filename,
              resp.headers['content-type'],
  					);
  				} else {
  					this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.qumanFactorsExecutiveReportDownLoadUsingPOST(downloadData)
  						.then((resp) => {
  							const respData = JSON.stringify(resp);
  							const apiErrorMsg = JSON.parse(respData).data.apiError;
  							this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  						}).catch((error) => {
  							console.log(error);
  						}).finally(() => {
  							this.setLoading(false);
  						});
  				}
  			}, 30 * 1000);
  		})
  		.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
.query__title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
  }
  .report__form {
    width: 100%;
  }
  .report__block {
    height: 100%;
    background-color: #F9FCFC;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 36px;
    border-radius: 4px;
    box-shadow: 0px 2px 2px transparent;
    border: 0.5px solid transparent;
    display: flex;
    flex-direction: row;
    &:hover {
      box-shadow: 0px 2px 2px #00000029;
      border: 0.5px solid #D1D1D1;
    }
    .radio__block {
      margin-right: 36px;
    }
    .input__block {
      width: 100%;
      .input__name {
        color: $COLOR-MAIN1;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .input__title {
        margin-bottom: 10px;
      }
    }
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    margin-left: 5px;
  }
  .range__block {
    width: 100%;
  }
  .btn__wrap {
    margin-top: 26px;
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
  ::v-deep {
    .ant-radio-group {
      width: 100%;
    }
  }
</style>
