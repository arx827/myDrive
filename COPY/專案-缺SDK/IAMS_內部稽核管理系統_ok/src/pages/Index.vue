<template>
  <div class="main-contain index-container container-fluid">
    <img
      class="login-container__leftbg"
      src="@/assets/images/index/icon-home-left-bg.svg"
    >
    <img
      class="login-container__rightbg"
      src="@/assets/images/index/icon-home-right-bg.svg"
    >

    <div class="title">
      內部稽核管理系統
    </div>
    <div class="todo d-flex">
      <img
        src="@/assets/images/index/icon-home-title.svg"
        alt=""
        class="todo__img"
      >
      <div class="todo__text flex-center">
        待辦事項：
        <span>
          {{ totalCount }}
        </span>
      </div>
    </div>
    <div class="todo-list flex-center row">
      <div
        v-for="item in todoListData"
        :key="item.title"
        class="col-12 col-md-6 col-lg-4"
      >
        <!-- 有待辦 在router 增加參數 -->
        <router-link
          class="todo-list__item"
          :to="{
            name: item.routerName,
            params: (item.count)? { type: 'todo' } : ''
          }"
        >
          <img
            class="todo-list__item__img"
            :src="item.img"
            alt=""
          >
          <div class="d-flex justify-content-between align-items-end flex-grow-1">
            <div class="todo-list__item__title">
              {{ item.title }}
            </div>
            <div>
              <span class="todo-list__item__count">{{ item.count }}</span>
              <span class="todo-list__item__text"> 筆</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';

export interface todoListDataInterface{
  img: string;
  title: string;
  routerName: string;
  count: number;
}

@Component
export default class Index extends Vue {
  @Action('setLoading') setLoading;

  totalCount: number = 0;

  todoListData: todoListDataInterface[] = null;

  created() {
  	this.getTodoList();
  }

  getTodoList() {
  	this.setLoading(true);
  	this.$roleApi.getConfirmItemByRoleUsingGET()
  		.then((resp) => {
  			const rewData = Object.values(resp.data.result)
  				.reduce((prev, cur) => prev.concat(cur), []);
  			this.todoListData = rewData.map((e) => ({
  				img: require(`@/assets/images/index/${e.route}.svg`),
  				title: e.title,
  				routerName: e.route,
  				count: e.count,
  			}));
  			this.todoListData.forEach((e) => { this.totalCount += e.count; });
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
  .index-container{
    background: $BG-LOGIN;
    min-height: calc(100vh - 78px);
    height: auto;
    ::v-deep{
      .ant-input-group-addon{
        background-color: $BG-LIGHT;
        padding: 7px 12px 7px 9px;
        width: 84px;
      }
      .ant-form-explain{
        color: $FONT-LIGHT;
        padding-top: 2px;
      }
    }
  }
  .login-container__leftbg{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 26%;
  }
  .login-container__rightbg{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 26%;
  }
  .title{
    color: $FONT-LIGHT;
    font-size: 42px;
    padding: 64px 0px 19px 0px;
    text-align: center;
    font-weight: bold;
    @include rwd-xll{
      // font-size: 57px;
      padding: 64px 0px 41px 0px;
    }
  }
  .todo{
    width: 100%;
    max-width: 1034px;
    margin: auto;
    padding-left: 13px;
    margin-bottom: 15px;
     @include rwd-xll{
      // max-width: 1500px;
    }
    .todo__img{
      width: 8px;
      // @include rwd-xll{
      //   width: 12px;
      // }
    }
    .todo__text{
      padding-left: 7px;
      color: $FONT-LIGHT;
      font-size: 20px;
      font-weight: bold;
      span{
        font-size: 28px;
        // @include rwd-xll{
        //   font-size: 32px;
        // }
      }
      // @include rwd-xll{
      //   font-size: 27px;
      // }
    }
  }

  .todo-list{
    width: 100%;
    max-width: 1034px;
    margin: auto;
    padding-bottom: 28px;
    // @include rwd-xll{
    //   max-width: 1500px;
    // }
  }
  .todo-list__item{
    background-color: #EEEEEE;
    border: solid 3px #D9D9D9;
    box-shadow: 3px 5px 0 2px #d9d9d9;
    border-radius: 16px;
    display: flex;
    align-items: center;
    margin: 0px 7px 22px 7px;
    justify-content:  space-between;
    cursor: pointer;
    &:hover{
      background-color: $BG-LIGHT;
    }
    // @include rwd-xll{
    //   margin: 0px 15px 49px 15px;
    // }
    .todo-list__item__img{
      width: 88px;
      margin: 4px 0px;
      // @include rwd-xll{
      //   width: 150px;
      //   margin: 17px 0px;
      // }
    }
    .todo-list__item__title{
      font-size: 20px;
      font-weight: bold;
      color: $FONT-DARK;
      // @include rwd-xll{
      //   font-size: 26px;
      // }
    }
    .todo-list__item__count{
      font-size: 37px;
      font-weight: bold;
      color: #009583;
      line-height: 1em;
      // @include rwd-xll{
      //   font-size: 52px;
      // }
    }
    .todo-list__item__text{
      font-size: 19px;
      color: #009583;
      padding-right: 25px;
      line-height: 1em;
      // @include rwd-xll{
      //   padding-right: 38px;
      //   font-size: 25px;
      // }
    }
  }

</style>
