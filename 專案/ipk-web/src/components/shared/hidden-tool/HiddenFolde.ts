import { Vue, Component } from 'vue-property-decorator';

@Component
export default class HiddenFolde extends Vue {
    isDisplay = true;

    color= { backgroundColor: 'white' };
}
