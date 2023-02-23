<template>
  <div class="card">
    <div class="row user__info">
      <div class="col-12 col-lg-1 offset-0 offset-lg-1">
        <img
          class="user__img"
          src="@/assets/image_girl_small.svg"
        >
      </div>
      <div class="col-12 col-lg-9 d-flex flex-column justify-content-between">
        <div class="user__title">
          被保險人資訊
        </div>
        <div class="user__name user__name--ch">
          富大幫富大幫富大幫富大幫幫富大幫幫富大幫幫富大幫
        </div>
        <div class="user__name user__name--en">
          Fubon LineFubonLineFubonLineF
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-4 offset-0 offset-lg-1">
        <div class="info__header">
          個人資料
        </div>
        <template v-for="item in data">
          <div
            v-if="item.categrory == 'personInfo'"
            :key="(item.key)"
            class="info__item"
          >
            <div class="info__item__title">
              {{ item.title }}
            </div>
            <div class="info__item__content">
              {{ item.value }}
            </div>
          </div>
        </template>
      </div>
      <div class="col-12 col-lg-2">
        <div class="info__header">
          投保資料
        </div>
        <template v-for="item in data">
          <div
            v-if="item.categrory == 'policy'"
            :key="(item.key)"
            class="info__item"
          >
            <div class="info__item__title">
              {{ item.title }}
            </div>
            <div class="info__item__content">
              {{ item.value }}
            </div>
          </div>
        </template>
      </div>
      <div class="col-12 col-lg-2 info__block">
        <div class="info__header">
          任職資料
        </div>
        <template v-for="item in data">
          <div
            v-if="item.categrory == 'career'"
            :key="(item.key)"
            class="info__item"
          >
            <div class="info__item__title">
              {{ item.title }}
            </div>
            <div class="info__item__content">
              {{ item.value }}
            </div>
          </div>
        </template>
      </div>
      <div class="col-12 col-lg-2 info__block">
        <div class="info__header">
          備註
        </div>
        <template v-for="item in data">
          <div
            v-if="item.categrory == 'remark'"
            :key="(item.key)"
            class="info__item"
          >
            <div class="info__item__title">
              {{ item.title }}
            </div>
            <div class="info__item__content">
              {{ item.value }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {
	GiMessageTypeQueryDto,
} from '@fubonlife/co-giiss-api-axios-sdk';

@Component
export default class UserInfoCard extends Vue {
  data = [
  	{
  		categrory: 'empName',
  		title: '員工姓名',
  		key: 'insName',
  		value: '王小明',
  	},
  	{
  		categrory: 'personInfo',
  		title: '屬性',
  		key: 'insarrt',
  		value: '子女',
  	},
  	{
  		categrory: 'personInfo',
  		title: '出生日期',
  		key: 'insBirthDate',
  		value: '81/01/01',
  	},
  	{
  		categrory: 'personInfo',
  		title: '國籍',
  		key: 'nationAlity',
  		value: '001臺灣',
  	},
  	{
  		categrory: 'personInfo',
  		title: '身分證字號/居留證號碼',
  		key: 'idNo',
  		value: 'A123456789',
  	},
  	{
  		categrory: 'personInfo',
  		title: '電話',
  		key: 'phone',
  		value: '0912-345-678',
  	},
  	{
  		categrory: 'personInfo',
  		title: '電子信箱',
  		key: 'mail',
  		value: 'fubon@gmail.com',
  	},
    	{
  		categrory: 'policy',
  		title: '保險證號',
  		key: 'crtNo',
  		value: 'A12345',
  	},
    	{
  		categrory: 'policy',
  		title: '加保日期',
  		key: 'jnDate',
  		value: '109/01/01',
  	},
    	{
  		categrory: 'policy',
  		title: '退保日期',
  		key: 'npDate',
  		value: '--',
  	},
    	{
  		categrory: 'policy',
  		title: '變更日期',
  		key: 'chDate',
  		value: '--',
  	},
    	{
  		categrory: 'policy',
  		title: '受理日期',
  		key: 'acDate',
  		value: '--',
  	},
    	{
  		categrory: 'policy',
  		title: '受益人',
  		key: 'beneficicary',
  		value: '勞基法順位',
  	},
    	{
  		categrory: 'career',
  		title: '部門',
  		key: 'department',
  		value: '--',
  	},
    	{
  		categrory: 'career',
  		title: '工作內容',
  		key: 'jobDescription',
  		value: '--',
  	},
    	{
  		categrory: 'career',
  		title: '提報工資(TWD)',
  		key: 'salary',
  		value: '--',
  	},
    	{
  		categrory: 'career',
  		title: '職保薪資(TWD)',
  		key: 'insuredSalary',
  		value: '--',
  	},
  	{
  		categrory: 'career',
  		title: '津貼(TWD)',
  		key: 'allowance',
  		value: '--',
  	},
  	{
  		categrory: 'remark',
  		title: '備註',
  		key: 'remark',
  		value: '備註備註備註',
  	},

  ]
}
</script>

<style lang="scss" scoped>
.card{
  padding: 20px 0px;
  background-color: #fff;
  border-radius: 10px;
}
.user__img{
  width: 100%;
}
.user__info{
  margin-bottom: 20px;
}
.user__title{
  font-weight: 600;
  color: $COLOR-MAIN2;
}
.user__name{
  font-size: 18px;
  word-break: break-word;
}
.user__name--ch{
  font-weight: 600;
}
.user__country{
  margin-top: auto;
}
.user__remark{
  margin: 49px 15px 0px 29px;
}
.user__remark__title{
  font-weight: 600;
  margin-bottom: 4px;
}
.info__block{
  padding-right: 10px;
}
.info__header{
  color: #fff;
  background-color: $COLOR-MAIN2;
  font-size: 12px;
  padding-left: 12px;
  margin-bottom: 8px;
  font-weight: 600;
}
.info__item{
  margin: 8px 0px;
  .info__item__title{
    font-weight: 600;
  }
}
</style>
