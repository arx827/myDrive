<template>
  <div class="accordion">
    <div class="d-flex ">
      <div
        class="btn-text"
        @click="toggle"
      >
        {{ isShow? '收起' : '展開' }}
        <a-icon
          type="down"
          style="color:#0090FF"
          class="icon"
          :class="{ rotate: isShow }"
        />
      </div>
    </div>
    <div
      v-if="isLine"
      class="line"
    />
    <slide-up-down
      :active="isShow"
      :duration="300"
    >
      <div class="body-inner">
        <slot />
      </div>
    </slide-up-down>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({ components: {} })
export default class AccordionArea extends Vue {
  @Prop()
  isLine: boolean;

  isShow: boolean = true;

  toggle() {
  	this.isShow = !this.isShow;
  }
}
</script>

<style lang="scss" scoped>
.btn-text{
  color: #0090FF;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  line-height: 1em;
  padding: 5px 0;
  cursor: pointer;
  margin-left: auto;
}
.rotate {
  transform: rotate(45deg) translateY(-4px);
}

.content{
  max-height: 0;
  transition: all .35s;
}

.accordion {
  max-width: 100%;
}

.accordion .header {
  height: 40px;
  line-height: 40px;
  padding: 0 40px 0 8px;
  position: relative;
  color: #fff;
  cursor: pointer;
}

.accordion .icon {
  transform: rotate(0deg);
  transition-duration: 0.3s;
  font-size: 14px;
  margin-left: 5px;
}

.accordion .body {
  overflow: hidden;
  transition: 150ms ease-out;
}

.accordion .body-inner {
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.icon.rotate {
  transform: rotate(180deg);
  transition-duration: 0.3s;
}

.line{
  width: 100%;
  height: 1px;
  background-color: #C7C7C7;
}
</style>
