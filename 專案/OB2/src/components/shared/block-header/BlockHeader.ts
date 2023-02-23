import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
    components: { }
})
export default class BlockHeader extends Vue {
    @Prop({ default: null })
    blockTitle!: string;

    @Prop({ default: null })
    tabsArray!: { key: string; value: Array<string>; label: string}[];

    @Prop()
    defaultTabKey!: string;

    @Prop()
    tipMessage!: string;

    @Prop({ default: null })
    countNum!: number;

    @Prop({ default: false })
    displayAll!: boolean;

    @Prop({ default: null })
    themeColor!: string;

    @Prop({ default: false })
    collapse!: boolean;

    @Prop({default: null})
    blockName!: string;

    @Prop({ default: false })
    showTipIcon!: boolean;

    // header顯示文字
    @Prop({default: null})
    headerText!: string;
    // header文字style
    @Prop({default: null})
    headerTextStyle!:string;
    // 是否顯示header文字
    @Prop({default:false})
    isHeaderTextShow!: boolean;
    // 選取的TAB KEY
    @Prop()
    tabKey!:string;

    // 切換頁籤
    handleChange(key) {
        this.$emit('changeTab', key)
    }

    // 收合區塊
    collapseMsg: string = "收起";
    collapseChange(event, type?) {
        let target = (type == "open")? event:event.currentTarget;
        let className = "";
        let displayArea = target.closest("[name='blockHeader']").nextSibling;

        if( displayArea.style.display == "none" || type == "open"){
            displayArea.style.display = "block";
            className = "arrow up";
            this.collapseMsg = "收起";
        }else{
            displayArea.style.display = "none";
            className = "arrow down";
            this.collapseMsg = "展開";
        }

        target.children[0].className = className;
    }

    // 點擊顯示全部
    openAll(event, blockName) {
        this.$emit('showAll', blockName)
    }
}