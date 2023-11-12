<template>
  <InfoModal
    title="比對資料"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    :height-full-screen="true"
    :centered="false"
    @closeModal="close"
  >
    <template slot="content">
      <div class="modal__list">
        <template v-if="compareData.length > 0">
          <div
            v-for="(item,index) in compareData"
            :key="index"
            class="modal__list__item"
          >
            <div class="modal__list__item__title">
              <span>{{ item.dateTime }}</span>
              <span>{{ item.title }}/{{ item.staffname }}</span>
            </div>
            <p
              class="content"
              v-html="item.text"
            />
          </div>
        </template>
        <!-- 無比對資料時，顯示空框 -->
        <div
          v-else
          class="modal__list__item"
        />
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import htmlDiff from 'htmldiff-js';

@Component({
	components: {
		InfoModal,
	},
})
export default class CompareDataModal extends Vue {
  @Prop()
  visible: boolean;

  @Prop()
  nowData: object;

  @Prop()
  oldData;

  compareData: {
    dateTime: string;
    title: string;
    staffname: string;
    text: string;
  }[] = [];

  get getCompareData() {
  	if (Object.keys(this.nowData).length > 0 && this.oldData.length > 0) {
  		return [{ ...this.nowData }, ...this.oldData];
  	}
  	if (Object.keys(this.nowData).length > 0) {
  		return [{ ...this.nowData }];
  	}
  	if (this.oldData.length > 0) {
  		return [...this.oldData];
  	}
  	return [];
  }

  close() {
  	this.$emit('closeModal');
  }

	/**
   * 監聽
   */
	@Watch('getCompareData', { deep: true })
  onGetCompareDataChanged(nV) {
  	this.compareData = nV;
  	// this.compareData = nV.reverse();
  	this.compareData = this.compareData.map((e, index) => {
  		const next = index + 1;
  		if (next == this.compareData.length) {
  			return { ...e };
  		}
  		const diffText = htmlDiff.execute(this.compareData[next].text, e.text);
  		console.log(diffText);
  		return { ...e, text: diffText };
  	});
  }
}
</script>

<style lang="scss" scoped>
.modal__list {
  margin-top: 10px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  .modal__list__item {
    min-height: 176px;
    background-color: $COLOR-LIGHT;
    padding: 20px;
    margin-top: 15px;
    &:first-child {
      margin-top: 0;
    }
  }
  ::v-deep{
    ins.diffmod,
    ins.diffins {
      background-color: #FFE58F;
    }

    del.diffdel,
    del.diffmod {
      background-color: #E5F2F5;
    }
    figure del.diffmod,
    figure del.diffins,
    figure ins.diffmod,
    figure ins.diffins {
      display: block;
      padding: 10px;
    }
  }
}
.modal__list__item__title{
  margin-bottom: 7px;
  color: $COLOR-MAIN1;
  span:nth-child(2){
    margin-left: 30px;
  }
}
.content{
  white-space: pre-line;
}
</style>
