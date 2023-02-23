<template>
  <a-modal
    :class="[modalClass, simpleClass]"
    :visible="visible"
    v-bind="$props"
    :footer="null"
    :bodyStyle="mergeBodyStyle"
    @ok="handleOk"
    @cancel="handleCancel"
    :mask="isMasked"
    :destroyOnClose="destroyOnClose"
  >
    <div class="ant-modal-body">
      <slot></slot>
    </div>
    <div class="ant-modal-footer relative" v-show="visibleFooter">
      <slot name="footer">
        <a-button
          :style="{ display: removeCancelButton ? 'none' : '' }"
          @click="handleCancel"
        >
          {{ cancelText }}
        </a-button>
        <a-button class="dragModal-okBtn" type="primary" @click="handleOk">
          {{ okText }}
        </a-button>
      </slot>
    </div>
    <div v-if="!title && title !== ''" slot="title">
      <slot name="title"></slot>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class DragModal extends Vue {
  
  mouseDownX = 0;
  mouseDownY = 0;
  deltaX = 0;
  deltaY = 0;
  sumX = 0;
  sumY = 0;
  header = null;
  contain = null;
  modalContent = null;
  onmousedown = false;
  // 需要加入active的class物件
  modalWrap = null;
  // 紀錄這次移動的modal class
  moveClassName:string = "";

  // name: string = "DragModal";
  // props:typeof props;

  @Prop({ default: "modal-box" }) // 容器的类名
  modalClass: string;

  @Prop({ default: false })
  visible: boolean;

  @Prop({ default: undefined })
  title: string;

  @Prop({ default: "70%" })
  width: number;

  @Prop({ default: true })
  footer: boolean;

  @Prop({ default: true }) //Footer顯示
  visibleFooter: boolean;

  @Prop({ default: true })
  closable: boolean;

  @Prop({ default: false })
  maskClosable: boolean;

  @Prop({ default: true })
  destroyOnClose: boolean;

  @Prop({ default: false })
  centered: boolean;

  @Prop({ default: ("確定") })
  okText: string;

  @Prop({ default: "取消" })
  cancelText: string;

  @Prop({ default: false })
  removeCancelButton: boolean;

  @Prop({ default: true })
  isMasked: boolean;

  @Prop()
  bodyStyle;

  get mergeBodyStyle() {
    return this.bodyStyle ? Object.assign(this.bodyStyle, {padding: 0}):Object.assign({padding: 0});
  }

  get simpleClass(): any {
    return Math.random().toString(36).substring(2);
  }

  @Watch("visible")
  onvisibleChange(val) {
    if(val) {
      this.$nextTick(() => {
        this.initialEvent(this.visible);
        // 初始點開須至頂
        this.acitveModal();
      });
    }
  }

  mounted() {
    this.$nextTick(() => {
      this.initialEvent(this.visible);
    });
  }
  created() {}
  beforeDestroy() {
    this.removeMove();
    window.removeEventListener("mouseup", this.removeUp, false);
  }

  handleOk(e) {
    this.resetNum();
    this.$emit("ok", e);
  }
  handleCancel(e) {
    this.resetNum();
    this.$emit("cancel", e);
  }
  resetNum() {
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.sumX = 0;
    this.sumY = 0;
  }
  handleMove(event) {
    const delta1X = event.pageX - this.mouseDownX;
    const delta1Y = event.pageY - this.mouseDownY;
    // 判斷移動到的Y軸不可超過螢幕
    if(event.pageY <=0){
      this.deltaY = 1 - this.mouseDownY;
    } else if (event.pageY >= 1080) {
      this.deltaY = 1079 - this.mouseDownY;
    } else {
      this.deltaY = event.pageY - this.mouseDownY
    }

    this.deltaX = delta1X;
    // this.deltaY = delta1Y;
    // console.log('delta1X:' + delta1X, 'sumX:' + this.sumX, 'delta1Y:' + delta1Y, 'sumY:' + this.sumY)
    this.modalContent.style.transform = `translate(${delta1X + this.sumX}px, ${
      this.deltaY + this.sumY
    }px)`;
  }
  initialEvent(visible) {
    // console.log('--------- 初始化')
    // console.log('simpleClass===>', this.simpleClass)
    // console.log('document===>', document)
    if (visible) {
      this.contain = document.getElementsByClassName(this.simpleClass)[0];
      this.modalWrap = this.contain.getElementsByClassName("ant-modal-wrap")[0];
      // setTimeout(() => {
        window.removeEventListener("mouseup", this.removeUp, false);
         
        this.header =
          this.contain.getElementsByClassName("ant-modal-header")[0];
        this.modalContent =
          this.contain.getElementsByClassName("ant-modal-content")[0];

        this.modalContent.style.left = 0;
        this.modalContent.style.transform = "translate(0px,0px)";

        // console.log('初始化-header:', header)
        // console.log('初始化-contain:', contain)
        // console.log('初始化-modalContent:', modalContent)

        this.header.style.cursor = "all-scroll";

        // contain.onmousedown = (e) => {
        this.header.onmousedown = (e) => {
          this.onmousedown = true;
          this.mouseDownX = e.pageX;
          this.mouseDownY = e.pageY;
          document.body.onselectstart = () => false;
          window.addEventListener("mousemove", this.handleMove, false);
          // 點擊到modal需要至頂
          this.acitveModal();
        };
        
        window.addEventListener("mouseup", this.removeUp, false);
      // }, 0);
      
    }
  }
  removeMove() {
    window.removeEventListener("mousemove", this.handleMove, false);
  }
  removeUp(e) {
    // console.log('removeUp')
    document.body.onselectstart = () => true;

    if (
      onmousedown &&
      !(e.pageX === this.mouseDownX && e.pageY === this.mouseDownY)
    ) {
      this.onmousedown = false;
      // this.sumX = this.sumX + this.deltaX;
      // this.sumY = this.sumY + this.deltaY;
    } else if (this.moveClassName === this.simpleClass){
      // 多判斷在移動事件所記入的class name如果跟對應到的modal才紀錄對應的x與y，並清空拖曳的class name
      this.moveClassName = ""
      // 紀錄放掉後的x與y的偏移
      this.sumX = this.sumX + this.deltaX;
      this.sumY = this.sumY + this.deltaY;
    } 
      // (this.modalWrap as HTMLElement).classList.remove('active');
    this.removeMove();
    // this.checkMove()
  }
  /**
   * @authoer B0845
   * @description 初始MODAL與點擊到的MODAL至頂與紀錄移動MODAL名稱
   */
  acitveModal(){
    // 如果目前移動的modal跟紀錄的不同就置換成移動的
    if(this.moveClassName != this.simpleClass){
      (this.modalWrap as HTMLElement).classList.add('active');
      this.moveClassName = this.simpleClass;
    }
    // 找出所有modal-box物件
    let allModalBox = document.querySelectorAll('.modal-box');
    allModalBox.forEach(i => {
      let thisWrap = i.getElementsByClassName('ant-modal-wrap')[0];
      // 如果找到的物件是當前點擊的加入active class，反之移除active
      if(Array.from(i.classList).includes(this.simpleClass)){
        thisWrap.classList.add('active');
      }else{
        thisWrap.classList.remove('active');
      }
    });
  }
}
</script>

<style lang="less" scoped>
.dragModal-okBtn {
  background-color: @MODAL-BUTTON-BG-BLUE;
  border-color: @MODAL-BUTTON-BG-BLUE;
}
// 點擊到彈窗給予最高的z-index
/deep/ .ant-modal-wrap{
  &.active{
    z-index: 999;
  }
  z-index: 500;
}
</style>