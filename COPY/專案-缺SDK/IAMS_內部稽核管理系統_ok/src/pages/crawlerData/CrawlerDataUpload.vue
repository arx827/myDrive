<template>
  <div class="main-contain container-fluid uploadList__container">
    <div class="top__bar">
      <IconTextButton
        text="上一頁"
        type="return"
        @click="backRoute"
      />
    </div>
    <div class="graybar__wrap">
      <div class="graybar__header">
        <div class="graybar__header__line" />
        <div class="graybar__header__title">
          資料來源上傳
        </div>
      </div>
      <div class="graybar__list">
        <button
          v-for="(item,index) in uploadType"
          :key="index"
          class="graybar__list__item flex-center"
          @click="setQuery(item)"
        >
          <div class="list__item-text col-5">
            <div class="list__item-icon" />
            {{ item.name }}
          </div>
        </button>
      </div>
    </div>
    <!-- 上傳 彈窗 -->
    <UploadModal
      :visible="modalVisible"
      :case-type="caseType"
      :page-title="title"
      @setModal="result"
      @closeModal="modalVisible=false"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import UploadModal from '@/components/crawlerData/crawlerUpload/UploadModal.vue';

const modalControl = namespace('modalControl');

@Component({
	components: {
		IconTextButton,
		UploadModal,
	},
})
export default class CrawlerDataUpload extends Vue {
  @modalControl.Action('setModalState') setModalState;

  @modalControl.Getter('getResultModal') getResultModal;

  modalVisible = false

  caseType = ''

  title=''

  uploadType = [
  	{
  		name: '作業風險事件清單',
  		caseType: 'F',
  	},
  	{
  		name: '作業委外合約清單',
  		caseType: 'G',
  	},
  	{
  		name: '重大市場/信用風險事件通報清單',
  		caseType: 'H',
  	},
  	{
  		name: '海外子公司信用風險事件通報清單',
  		caseType: 'I',
  	},
  ]

  modalData = {
  	visible: false,
  	content: null,
  	title: '',
  	type: '',
  	autoClose: null,
  }

  backRoute() {
  	this.$router.back();
  }

  setQuery(data) {
  	this.caseType = data.caseType;
  	this.title = data.name;
  	this.modalVisible = true;
  }

  result(value) {
  	console.log('emit', value);
  	this.setModalState({
  		resultModal: {
  			...value,
  		  visible: true,
  		},
  	});
  }
}
</script>
<style lang="scss" scoped>
.uploadList__container{
  margin-top:39px;
  .top__bar{
    margin: 0px auto;
    margin-bottom: 11px;
    max-width: 1089px;
    display: flex;
    justify-content: flex-end;
  }
}

.graybar__list{
  .graybar__list__item:nth-child(even){
    .list__item-text{
      color: #00BDBD;
    }
  }
  .graybar__list__item:nth-child(odd){
    .list__item-text{
      color: $COLOR-MAIN1;
    }
  }
  .graybar__list__item{
    cursor: pointer;
    background-color: $COLOR_LIGHT;
    border: none;
    width: 100%;
    padding: 19px 0px;
    border-bottom: 1px solid #C7C7C7;

    &:hover{
      background-color: $COLOR-MAIN4;
      .list__item-icon{
        background-image: url('~@assets/images/icon/icon_upload1.svg');
        background-repeat: no-repeat;
      }
    }
    .list__item-text{
      font-size: 25px;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
  }
  .graybar__list__item:nth-last-child(1) {
    border-bottom: none;
  }
  .list__item-icon {
      margin-right: 13px;
      width: 60px;
      height: 60px;
      background-image: url('~@assets/images/icon/icon_upload1_o.svg');
      background-repeat: no-repeat;
    }
  }
</style>
