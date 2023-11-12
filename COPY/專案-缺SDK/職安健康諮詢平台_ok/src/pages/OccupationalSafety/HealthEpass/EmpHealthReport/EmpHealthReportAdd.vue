<template>
  <div>
    <div class="container">
      <h2 class="page__title">
        單筆建檔
      </h2>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="formRules"
        layout="horizontal"
      >
        <div>
          <a-collapse
            :bordered="false"
            default-active-key="personalInfo"
          >
            <a-collapse-panel
              key="personalInfo"
              header="基本資料"
            >
              <div class="personalInfo__panel">
                <template v-for="(item) in dataList">
                  <div
                    v-if="item.codeName === '基本資料'"
                    :key="item.codeName"
                  >
                    <div class="row">
                      <a-form-model-item
                        v-for="(detail, detialIndex) in item.detailDto"
                        :key="detialIndex"
                        :prop="detail.itemid"
                        :label="detail.caName"
                        :class="detail.caName==='姓名'?'col-12':'col-12 col-sm-6'"
                      >
                        <a-input
                          v-if="detail.dataType===3"
                          v-model="form[detail.itemid]"
                          :disabled="detail.itemid === 'H0002' || detail.itemid === 'H0008'"
                          :placeholder="detail.itemid === 'H0007' ? 'e.g. 2020/05/02' : ''"
                          :vue="detail.caName==='姓名'?true:false"
                          :alt="detail.caName==='姓名'?'webfont':''"
                        />
                      </a-form-model-item>
                    </div>
                  </div>
                </template>
              </div>
            </a-collapse-panel>
          </a-collapse>
          <div class="space__block row" />
          <a-table
            ref="tableHeaderScroll"
            :row-key="grid.rowKey"
            :columns="grid.columns"
            :pagination="false"
            :scroll="{x:0}"
          >
            <template slot="footer">
              <a-collapse
                v-model="activeKey"
                :bordered="false"
              >
                <template v-for="(item) in dataList">
                  <a-collapse-panel
                    v-if="item.codeName !== '基本資料'"
                    :key="item.codeName"
                  >
                    <template slot="header">
                      <div>
                        {{ item.codeName }}
                      </div>
                    </template>
                    <div class="form__wrap">
                      <div
                        v-for="(detail, detialIndex) in item.detailDto"
                        :key="detialIndex"
                      >
                        <a-form-model-item
                          v-if="detail.isFront === 'Y'"
                          :ref="detail.itemid"
                          :prop="detail.itemid"
                          class="form__item"
                          :class="{'form__item--required':detail.isRequired === 'Y'}"
                          :label="detail.caName"
                        >
                          <div
                            class="form__item__en col-2"
                          >
                            {{ detail.enName }}
                          </div>
                          <div
                            class="form__item__data col-5"
                          >
                            <a-radio-group
                              v-if="detail.dataType===1"
                              v-model="form[detail.itemid]"
                              class="col-12"
                            >
                              <a-radio
                                v-for="(radio, radioIndex) in detail.optType"
                                :key="radioIndex"
                                :value="radioIndex"
                                :class="detail.optType.length>3?'col-12 my-2':'col-4'"
                                @blur="
                                  () => {
                                    $refs[detail.itemid][0].onFieldBlur();
                                  }
                                "
                              >
                                {{ radio }}
                              </a-radio>
                            </a-radio-group>
                            <a-input-number
                              v-if="detail.dataType===2"
                              v-model="form[detail.itemid]"
                              @blur="
                                () => {
                                  $refs[detail.itemid][0].onFieldBlur();
                                }
                              "
                            />
                            <a-input
                              v-if="detail.dataType===3"
                              v-model="form[detail.itemid]"
                              @blur="
                                () => {
                                  $refs[detail.itemid][0].onFieldBlur();
                                }
                              "
                            />
                          </div>
                          <div
                            class="form__item__remark"
                          >
                            {{ detail.titleFlag }}
                          </div>
                        </a-form-model-item>
                      </div>
                    </div>
                  </a-collapse-panel>
                </template>
              </a-collapse>
            </template>
          </a-table>
        </div>
      </a-form-model>
      <div class="form__btn__wrap">
        <button
          class="btn__radius--primary--outline--small btn-absolute"
          @click="onSubmit(0)"
        >
          暫存
        </button>
        <div>
          <button
            class="btn__main btn__main--light"
            @click="onCancel"
          >
            取消
          </button>
          <button
            class="btn__main btn__main--primary"
            @click="onSubmit(1)"
          >
            存檔上傳
          </button>
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
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import { HealthCheckItemTableUserDto } from '@fubonlife/oss-api-axios-sdk';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({ components: { FblDataGrid } })
export default class EmpHealthReportList extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

  formatter = this.$twDateFormatter;

	activeKey: Array<string> = [];

	form = {}

	uid = null

	paramsType = null

  // 檢核規則
  formRules = {};

	public grid = {
  	rowKey: 'caName',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			dataIndex: 'caName',
  			title: '健檢項目',
				customHeaderCell: (record, rowIndex) => ({
					style: {
						width: '25%',
					},
				}),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			dataIndex: 'enName',
  			title: '健檢項目(英文)',
				customHeaderCell: (record, rowIndex) => ({
					style: {
						width: '16.6667%',
					},
				}),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
				dataIndex: 'content',
  			title: '健檢資訊',
				template: 'content',
				customHeaderCell: (record, rowIndex) => ({
					style: {
						width: '41.6667%',
					},
				}),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			dataIndex: 'remark',
				title: '備註',
  			customHeaderCell: (record, rowIndex) => ({
					style: {
						width: '16.6667%',
					},
				}),
  		},
  	],
	}

	dataList = [];

	async setData() {
  	this.setLoading(true);
  	// 查詢健檢欄位
  	await this.$HERpnCreateHealthCheckApi.healthCheckTableQueryUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  	      this.dataList = resp.data.data;
					this.dataList.forEach((item) => {
						item.detailDto.forEach((detial) => {
							if (detial.itemid) {
								this.$set(this.form, detial.itemid, null);
							}
							if (detial.isRequired === 'Y') {
								this.$set(this.formRules, detial.itemid, [{ required: true, message: `請填入${detial.caName}`, trigger: 'blur' }]);
							}
						});
					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
		this.getData();
	}

	created() {
		this.setData();
	}

	async getData() {
		this.paramsType = this.$route.params.type;
		const query = this.$global.getQuery();
		if (this.paramsType === 'edit') {
			this.fetchHealthCheck(query.resultId);
		} else {
			this.$set(this.form, 'H0002', query?.userName);
			this.$set(this.form, 'H0008', query?.department);
			this.uid = query.uid;
		}
	}

	// 取消
	onCancel() {
  	this.$router.push({ name: 'EmpHealthReportList' });
	}

	// 暫存與存檔上傳
	onSubmit(status) {
		const resultId = this.$global.getQuery() ? this.$global.getQuery().resultId : null;
		const data: HealthCheckItemTableUserDto = {
			resultId: resultId || null,
			itemIdValue: [],
			status,
			uid: this.uid,
			crtUid: this.$user.getMe().userId, // 使用者代碼
		};
		Object.keys(this.form).forEach((key, index) => {
			data.itemIdValue[index] = { itemId: key, value: this.form[key] };
		});
		(this.$refs.ruleForm as any).validate((valid) => {
			// TEST:
			// console.log(JSON.stringify(data));
  		if (valid || status === 0) {
  			this.setLoading(true);
				// 單筆儲存健檢資料
				this.$HERpnCreateHealthCheckApi.healthCheckTablesSingleSaveUsingPOST(data)
					.then((resp) => {
						switch (status) {
						case 0:
							if (resp.data.status === 200) {
								this.$infoNotification.success({
									content: '已成功暫存',
									duration: 3,
								});
							} else {
								const getError = resp.data;
								this.$infoNotification.error({
									content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成暫存項目，請再次嘗試。',
								});
							}
							break;
						case 1:
							this.$global.changeRouterAndaddParam({
								toRouter: 'EmpHealthReportUploadSingleResult',
								query: {
									result: resp.data.status === 200 ? 'success' : 'error',
									message: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
								},
							});
							break;
						default:
							break;
						}
					})
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
  		} else {
  			InfoModal.alertError({
					title: '必填欄位尚未填寫',
					confirm: false,
					content: '檢測到必填欄位尚未填寫，請填寫完成，再進行下一步，謝謝。',
				});
  			return false;
  		}
  	});
	}

	// API: 查詢單一健檢資料
	fetchHealthCheck(resultId) {
		this.setLoading(true);
  	// 查詢單一健檢資料
  	this.$HERpnCreateHealthCheckApi.querySingleHealthCheckDetailUsingPOST({ resultId })
  		.then((resp) => {
				JSON.parse(JSON.stringify(resp.data.data)).forEach((item) => {
					this.form[item.itemId] = item.checkValue.trim();
				});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
.slotheader_span{
  font-weight: 100;
}
.font-red{
	color:#F5222D
}
::v-deep {
// 	/*---------------collapse----------------- */
	.ant-collapse{
		// background-color: rgba($color: #000000, $alpha: 0);
		background-color: #000000;
		border: none;
	}
  .ant-collapse-borderless{
    background-color: #23C4A8;
    border-radius: 0px;
    .ant-collapse-item{
      border: none;
    }
    .ant-collapse-item .ant-collapse-header{
      color: #ffffff;
      font-weight: 600;
    }
    .ant-collapse-item > .ant-collapse-content {
      background-color:#ffffff;
      .ant-collapse-content-box{
        padding: 0;
      }
    }
  }

// 	/*--------------------個人資料表單----------------------- */

  .personalInfo__panel{
    padding: 20px 8%;
		border: 1px solid #D1D1D1;
		.ant-form-item-label label::after{
			display: inline-block;
			margin-right: 4px;
			color: #f5222d;
			font-size: 16px;
			font-family: SimSun, sans-serif;
			line-height: 1;
			content: '*';
		}
    // .ant-form-item:nth-last-child(1){
    //   margin-left: 0px;
		// 	.ant-form-item-label label::after{
		// 		content: '';
		// 	}
    // }
		.ant-form-item-required::before{
			content: '';
		}
		.ant-radio-wrapper{
			margin-right: 0;
		}
  }

	.ant-input-number {
		width: 100%;
		border: 1px solid #EBEBEB;
		&:hover {
			border: 1px solid #23C4A8;
		}
	}
	.ant-input-number-focused {
		border: 1px solid #23C4A8;
	}
	.has-error .ant-input-number, .has-error .ant-input-number:hover {
    background-color: #fff;
    border-color: #f5222d;
	}
// 	/*--------------------健檢資料表單----------------------- */

	.ant-table-footer {
		padding: 0;
	}
	.form__wrap{
		overflow-x: scroll;
	}
	.form__item.ant-form-item{
		display: flex;
		min-width: 1080px;
		width: 100%;
		border-bottom: 1px solid #00000017;
		margin-bottom: 0;
		@include rwd-md{
			min-height: 46px;
		}
	}
	.form__item {
		&.form__item--required {
			.ant-form-item-label label{
				&::before {
					display: inline-block;
					margin-right: 4px;
					color: #f5222d;
					font-size: 16px;
					font-family: SimSun, sans-serif;
					line-height: 1;
					content: '*';
					font-weight: bold;
				}
			}
		}
		.ant-form-item-label{
			display: flex;
			align-items: center;
			width: 25%;
			text-align: left;
			padding-left: 30px;
			padding-right: 5px;
			label{
				font-weight: 400;
				white-space: normal;
				font-size: 1em;
				&::before {
					content: '';
					display: inline-block;
					width: 12px;
					margin-right: 4px;
				}
			}
			label::after{
				content: '';
			}
		}
		.ant-form-item-control-wrapper{
			width: 75%;
		}
		.ant-form-item-control {
			height: 100%;
		}
		.ant-form-item-children{
			display: flex;
			height: 100%;
			position: relative;
		}
		.has-error {
			margin-bottom: 45px;
			.ant-form-explain {
				margin-left: 200px;
				position: absolute;
				bottom: 0;
			}
		}
	}
	.font-primary-bold .ant-form-item-label > label{
			color:#23C4A8;
			font-weight: bold;
		}
	.form__item__en{
		width: 22%;
		background-color: #F5F8FC;
    padding: 0 13px;
    color: #363636;
    align-self: stretch;
	}
	.form__item__data{
		padding: 0px 20px;
    margin: auto 0px;
		width: 56%;
	}
	.form__item__remark{
		align-self: stretch;
		background-color: #F5F8FC;
		padding: 0px 13px;
		justify-self: stretch;
		width: 22%;
		@include rwd-md{
			padding: 11px 13px;
		}
	}
}

::v-deep {
	.ant-table-empty .ant-table-body{
		overflow-x: hidden !important;
		width: 100%;
		table{
			min-width:1080px
		}
	}
	.ant-table-placeholder{
		display: none;
	}

}
/*----------------form -----------------------*/

.space__block{
  height: 20px;
  background-color: #ffffff;
}

/*---------------底部按鈕-------------------*/
.form__btn__wrap{
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 80px;
  position: relative;
  button{
    margin: 0px 5px;
  }
  .btn__main{
		padding: 8px 20px;
		@include rwd-sm{
			padding: 8px 40px;
		}

		@include rwd-md{
			padding: 8px 84px;
		}
  }
  .btn-absolute{
    padding-bottom: 8px;
    padding-top: 8px;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
