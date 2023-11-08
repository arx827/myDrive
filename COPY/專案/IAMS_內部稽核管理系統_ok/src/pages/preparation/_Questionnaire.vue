<template>
  <div class="main-contain container">
    <ActionBar
      :is-leader="isLeader"
      @click="handleClick"
    />
    <div class="border__wrap-radiu">
      <div class="page__title">
        發展新商品、新商業架構、新業務、新外部服務、新系統及運用新興科技調查表
      </div>
      <div class="query__wrap mt-4">
        <div class="d-flex w-100 align-items-center">
          <div class="query__label me-2">
            填寫單位名稱:
          </div>
          <div class="query__text">
            <a-input
              v-if="isLeader"
              v-model="departmentName"
              class="w-100"
            />
            <p v-else>
              {{ departmentName }}
            </p>
          </div>
        </div>
        <div class="d-flex w-100 mt-4 align-items-center">
          <div class="query__label me-2">
            查核範圍期間:
          </div>
          <div class="query__text">
            <div>
              <a-input
                class="query__input-disabled"
                disabled
              />
              有無發展新商品、新商業結構、新業務、新外務服務、新系統及運用新興科技?
              <span class="query__text-link">(附註說明1)</span>
            </div>
          </div>
        </div>
        <div class="row mt-3 w-100">
          <div class="query__label me-2" />
          <div class="col-1 d-flex p-0">
            <div class="square me-2" />有
          </div>
          <div class="col-1 d-flex p-0">
            <div class="square me-2" />無
          </div>
        </div>
      </div>
    </div>
    <QuestionnaireList
      :visible="uploadModalVisible"
      :type="UploadModalType"
      @closeModal="uploadModalVisible=false"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import QuestionnaireList from '@/components/preparation/questionnaire/QuestionnaireList.vue';
import ActionBar from '@/components/preparation/questionnaire/ActionBar.vue';

@Component({
	components: {
	 IconTextButton, QuestionnaireList, ActionBar,
	},
})
export default class Questionnaire extends Vue {
  h = this.$createElement;

  uploadModalVisible=false

  UploadModalType: 'view'|'upload' = 'upload'

  isLeader: boolean

  departmentName= '保費帳務部門'

  range='111/11/16-111/12/12'

  modalVisible=false

  uploadedData = []

  // 判斷彈窗是否出現上傳;
  viewQuestionnaire(type: 'view'|'upload') {
  	this.UploadModalType = type;
  	this.uploadModalVisible = true;
  }

  created() {
  	// TEST: 判斷是為領隊
  	this.isLeader = true;
  }

  handleClick(action) {
  	switch (action) {
  	case 'save':
  		console.log('儲存');
  		break;
  	case 'view':
  		this.viewQuestionnaire('view');
  		break;
  	case 'upload':
  		this.viewQuestionnaire('upload');
  	  break;
  	case 'download':
  		console.log('下載');
  		break;
  	case 'return':
  		this.$router.back();
  	}
  }
}
</script>

<style lang="scss" scoped>
.border__wrap-radiu{
  padding: 36px 10px;
  border: 2px solid #00829B;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 22px;
}
.page__title{
  color: #000;
  display: flex;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  line-height: 1em;
  margin-bottom: 20px;
}
.query__wrap{
  margin: 0 auto;
  max-width: 980px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.query__label{
  width:112px;
}
.query__text{
  width: calc(100% - 112px);
  p{
    margin-bottom: 0;
  }
}
.query__text-link{
  color: #00829B;
}
.square{
  border: 1px solid #00829B;
  border-radius: 2px;
  width: 24px;
  height: 24px;
}
.query__input-disabled{
  width: 200px;
}

</style>
,
