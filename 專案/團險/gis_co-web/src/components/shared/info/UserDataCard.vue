<template>
  <div
    :class="{'card__userdata--selected':cardSelected}"
    class="card__userdata d-flex align-items-center"
  >
    <div class="d-inline-block">
      <img
        v-if="userSex == '女'"
        class="card__avatar"
        src="@/assets/image_girl_smaller.svg"
        alt=""
      >
      <img
        v-else
        class="card__avatar"
        src="@/assets/image_boy_smaller.svg"
        alt=""
      >
    </div>
    <div class="card__detail d-inline-block">
      <div class="card__name d-block">
        {{ userName }}
      </div>
      <div class="card__content d-flex align-items-center">
        <div
          v-for="(data, index) in cardDatas"
          :key="index"
          class="card__col"
        >
          <div class="card__label">
            {{ data.title }}
          </div>
          <div class="card__val">
            {{ data.val ? data.val: '--' }}
          </div>
        </div>
      </div>
    </div>
    <slot name="others" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

enum UserType {
  Employee = 0,
  Family = 1,
}

@Component
export default class UserDataCard extends Vue {
  @Prop()
  userType: UserType

  @Prop()
  cardSelected: boolean

  @Prop()
  userName: string

  @Prop()
  userSex: string

  @Prop()
  datas: [string, string, string, string, string]

  cardDatas = [
  	{
  		title: '身分證字號',
  		val: '',
  	},
  	{
  		title: '國籍',
  		val: '',
  	},
  	{
  		title: '性別',
  		val: '',
  	},
  	{
  		title: '生日',
  		val: '',
  	},
  	{
  		title: '',
  		val: '',
  	},
  ]

  created() {
  	this.cardDatas = this.cardDatas.map((e, index) => ({
  		title: e.title,
  		val: this.datas[index],
  	}));
  	const lastTitle = this.userType === 0 ? '保險證號(員工編號)' : '屬性';
  	this.cardDatas[this.cardDatas.length - 1].title = lastTitle;
  }
}
</script>

<style lang="scss" scoped>
.card__userdata {
  position: relative;
  padding: 15px 26px;
  border-radius: 4px;
  border: 1px #D9D9D9 solid;
  background-color: #ffffff;
  margin-bottom: 15px;
  &.card__userdata--selected {
    border: 1px #F2F8FF solid;
    background-color: #F2F8FF;
  }
  &:hover {
    border: 1px #F2F8FF solid;
    background-color: #F2F8FF;
  }
  .card__detail {
    margin-left: 16px;
  }
  .card__name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .card__label{
    color: #788088;
    font-size: 12px;
    margin-bottom: 2px;
  }
  .card__val {
    font-size: 16px;
  }
  .card__col {
    margin-right: 15px;
  }
}
</style>
