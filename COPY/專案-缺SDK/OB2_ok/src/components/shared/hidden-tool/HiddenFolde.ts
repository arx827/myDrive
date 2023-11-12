import { Vue, Component } from "vue-property-decorator";

@Component
export default class HiddenFolde extends Vue {
    isDisplay: boolean = true;
    color= {backgroundColor:"#eef6f8"};
}