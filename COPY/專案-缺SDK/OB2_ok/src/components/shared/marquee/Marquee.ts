import { Vue, Component, Prop } from "vue-property-decorator";
import VueRollUp from "vue-roll-up";
import "@/assets/less/marquee.less";

@Component({
    components: {
        VueRollUp,
    },
})
export default class Marquee extends Vue {
    //marquee list


    marqueeList = [{ id: "", isEmergency: false, message: "" }];
    rollFirstList: Array<String>;
    rollSecondList: Array<String>;

    clicked: boolean = false;
    hovered: boolean = false;

    //for test list
    created() {
        //跑馬燈所有訊息
        this.marqueeList = [
            { id: "1", isEmergency: true, message: "緊急通知 ! 今天為國定不加班日，請還沒做完工作的同仁與想加班的同仁準時打卡離開，否則多留的時間將從薪水扣" },
            { id: "2", isEmergency: false, message: "輪播訊息 ! 今天第1則訊息，有看到請說聲一" },
            { id: "3", isEmergency: false, message: "輪播訊息 ! 今天第2則訊息，有看到請說聲二" },
            { id: "4", isEmergency: false, message: "輪播訊息 ! 今天第3則訊息，有看到請說聲三" },
            { id: "5", isEmergency: false, message: "輪播訊息 ! 今天第4則訊息，有看到請說聲四" },
            { id: "6", isEmergency: false, message: "輪播訊息 ! 今天第5則訊息，有看到請說聲五" }
        ]
        //分類
        this.rollFirstList = this.getEmergencyList();
        this.rollSecondList = this.getCommonList();
    }
    handleClickChange(visible) {
        this.clicked = visible;
        this.hovered = false;
    }
    hide() {
        this.clicked = false;
    }
    //取得緊急訊息內容
    getEmergencyList() {
        const emergencyList = this.marqueeList.filter(list => list.isEmergency).map(m => m.message);
        return emergencyList;
    }
    //取得一般訊息
    getCommonList() {
        const commonList = this.marqueeList.filter(list => !list.isEmergency).map(m => m.message);
        return commonList;
    }
}