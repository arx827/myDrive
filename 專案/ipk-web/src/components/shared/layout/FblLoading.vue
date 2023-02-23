<template>
  <div
    v-if="getLoading"
    class="custom__spinWrap"
  >
    <div class="custom__position">
      <div id="floatingCirclesG">
        <div id="frotateG_01" class="f_circleG" />
        <div id="frotateG_02" class="f_circleG" />
        <div id="frotateG_03" class="f_circleG" />
        <div id="frotateG_04" class="f_circleG" />
        <div id="frotateG_05" class="f_circleG" />
        <div id="frotateG_06" class="f_circleG" />
        <div id="frotateG_07" class="f_circleG" />
        <div id="frotateG_08" class="f_circleG" />
      </div>
      <p class="loading__text">
        資料載入中
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component({})
export default class FblLoading extends Vue {
  @Getter getLoading!: boolean;

  // loading 百分比
  loadingPercent = 10;
}
</script>

<style lang="scss" scoped>
  // loading
  .custom__spinWrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
#floatingCirclesG{
	position:relative;
	width:160px;
	height:160px;
	margin:auto;
	transform:scale(0.6);
}

.f_circleG{
	position:absolute;
	background-color:rgba(0,147,193,0.96);
	height:29px;
	width:29px;
	border-radius:15px;
	animation-name:f_fadeG;
	animation-duration:0.932s;
	animation-iteration-count:infinite;
	animation-direction:normal;
}

#frotateG_01{
	left:0;
	top:65px;
	animation-delay:0.3495s;
}

#frotateG_02{
	left:19px;
	top:19px;
	animation-delay:0.466s;
}

#frotateG_03{
	left:65px;
	top:0;
	animation-delay:0.5825s;
}

#frotateG_04{
	right:19px;
	top:19px;
	animation-delay:0.699s;
}

#frotateG_05{
	right:0;
	top:65px;
	animation-delay:0.8155s;
}

#frotateG_06{
	right:19px;
	bottom:19px;
	animation-delay:0.932s;
}

#frotateG_07{
	left:65px;
	bottom:0;
	animation-delay:1.0485s;
}

#frotateG_08{
	left:19px;
	bottom:19px;
	animation-delay:1.165s;
}

@keyframes f_fadeG{
  // 0%{
	// 	background-color:rgb(0,147,193);
	// }
	// 50%{
	// 	background-color:rgba(0,147,193, .6);
	// }
	// 100%{
	// 	background-color:rgba(220, 255, 248, 0);
	// }
	0%{
		background-color:rgb(0,147,193);
	}

	100%{
		background-color:rgb(220,255,248);
	}
}

.custom__position {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading__text {
  color: $COLOR-WHITE;
  // margin-top: 10px;
  margin-bottom: 0;
  font-size: 20px;
  text-align: center;
  font-weight: $TEXT-BOLD;
  letter-spacing: 1px;
}
</style>
