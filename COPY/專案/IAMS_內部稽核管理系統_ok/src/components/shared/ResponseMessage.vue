<template>
  <div
    class="message"
  >
    <div
      class="btn--dark message__btn"
    >
      <img
        class="message__btn__icon"
        src="@/assets/images/icon/icon_canned_o.svg"
        alt=""
      >
      罐頭語
    </div>
    <div class="search">
      <a-input-search
        v-model="searchValue"
        @input="fuzzySearch"
      />
    </div>
    <div
      class="message__list"
    >
      <template
        v-if="filterList && filterList.length > 0"
      >
        <div
          v-for="item in filterList"
          :key="item.detailId + item.mainId"
          class="list__item"
        >
          <div
            class="list__item__text"
            @click="selectMsg(item.value)"
          >
            {{ item.value }}
          </div>
          <CustomPopConfirm
            @confirm="deleteMsg(item)"
          >
            <a-icon
              v-if="!item.shared"
              class="btn-minus__icon"
              type="minus-square"
            />
          </CustomPopConfirm>
        </div>
      </template>
    </div>
    <div
      class="list__input"
    >
      <a-input
        v-model="addValue"
        placeholder="新增罐頭語"
        @keyup.enter="addMsg"
      />
      <div
        class="btn-add flex-center"
        @click="addMsg"
      >
        <img
          src="@/assets/images/icon/icon_canned_add.svg"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { TextTemplateResponseDto, SaveTextTempRequest } from '@fubonlife/iams-api-axios-sdk';
import Fuse from 'fuse.js';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import { Getter, Action, namespace } from 'vuex-class';

const modalModule = namespace('modalControl');

@Component({ components: { CustomPopConfirm } })
export default class ResponseMessage extends Vue {
  @modalModule.Action('setModalState') setModalState;

  @Action('setLoading') setLoading;

  isShow: boolean = false;

  searchValue: string = null;

  addValue: string = null;

  filterList = null;

  messageList: TextTemplateResponseDto[] = null;

  userId: string = this.$user.getMe().employee.domainId;

  created() {
  	this.getTextTemp();
  }

  // 取得罐頭語
  getTextTemp() {
  	this.setLoading(true);
  	const request = {
  		userId: this.userId,
  	};
  	this.$dataCollectApi.getTextTempInDataCollectUsingPOST(request)
  		.then((resp) => {
  			this.messageList = resp.data.result;
  			this.filterList = this.messageList;
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  deleteMsg(item: TextTemplateResponseDto) {
  	this.setLoading(true);
  	this.$dataCollectApi.deleteTextTempInDataCollectUsingPOST({
  		sysCodeDetailId: item.detailId,
  		sysCodeMainId: item.mainId,
  		sysCodeGroupId: item.groupId,
  	})
  		.then((resp) => {
  			this.getTextTemp();
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除罐頭語失敗',
  					autoClose: '0',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  addMsg() {
  	this.setLoading(true);
  	const request: SaveTextTempRequest = {
  		userId: this.userId,
  		value: this.addValue,
  	};
  	this.$dataCollectApi.saveTextTempInDataCollectUsingPOST(request)
  		.then((resp) => {
  			this.getTextTemp();
  			this.addValue = undefined;
  		})
  		.catch(() => {
        	this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '新增罐頭語失敗',
  					autoClose: '0',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  selectMsg(value) {
  	this.$emit('select', value);
  }

  fuzzySearch() {
  	if (this.searchValue) {
  		const options = {
  			includeScore: true,
  			keys: ['value'],
  		};

  		const fuse = new Fuse(this.messageList, options);
  		const result = fuse.search(this.searchValue);
  		this.filterList = result.map((item) => item.item);
  	} else {
  		this.filterList = this.messageList;
  	}
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/_varibles.scss';
@import '@/style/_mixin.scss';
.message{
  height: 365px;
}
.message__btn{
  width: 100%;
  @include button_base($COLOR_MAIN4, $COLOR_MAIN4, $BUTTON-DARK,$BUTTON-DARK, $BUTTON-DARK, $BUTTON-DARK, 4px, 14px,);
  cursor:default;
  padding: 3px 0px;
  .message__btn__icon{
    width: 28px;
    height: 28px;
  }
}
.message__list{
  z-index: 10;
  height: calc(100% - 164px);
  overflow: auto;
  background-color: $BG-LIGHT;
  width: 100%;
  .list__item{
    background-color: $BG-LIGHT;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 12px;
    &:hover{
      background-color: $COLOR-MAIN7;
    }
    .btn-minus__icon{
      color: $BUTTON_DARK;
      cursor: pointer;
      ::v-deep svg{
        font-size: 20px;
      }
    }
    .list__item__text{
      padding: 7px 0px;
      flex-grow: 1;
    }
  }
}

.search{
  padding: 7px 7px;
  background-color: $COLOR_LIGHT;
}
.list__input{
  background-color: $COLOR_LIGHT;
  padding:12px 9px;
  display: flex;
  flex: 3;
  ::v-deep .ant-input{
    border-radius: 0px;
    border: solid 1px $COLOR-MAIN1;
  }
}
.btn-add{
  flex: 32px 0 0;
  width: 32px;
  background-color: $BG-PRIMARY;
  cursor: pointer;
  &:hover{
    background-color: darken($BG-PRIMARY, 3%)
  }
  .btn-add__icon{
    color: $COLOR-LIGHT;
  }
}
</style>
