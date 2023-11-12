import { Vue } from "vue-property-decorator";

export default class LoadingUtil extends Vue{

    static loading = null;

    /**
     * 是否要顯示 Loading
     * @param container 指定顯示的範圍 Ex: this.$refs.XXX
     */
    static show(container?){

        if(this.loading != null){
            this.close();
        }
        
        this.loading = this.$loading.show({
            loader: 'spinner',
            canCancel: false,
            color: '#1FB4C0',
            container: container ? container : null
        });
    }

    /**
     * 關閉 Loading
     */
    static close() {
        this.loading.hide();
    }
}

