import { Vue, Component, Prop } from "vue-property-decorator";

@Component({components: {}})
export default class DescriptionsFormComponent extends Vue {

    @Prop()
    themeColor:string;

    @Prop()
    initData;

    @Prop()
    name;

    dataList = []
    
    created(){
        
    }
}
