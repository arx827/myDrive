import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ResponseEntity, InfInfoGrid, F2bFileGrid } from "@fubonlife/obd-api-axios-sdk";
import CommonUtil from "@/assets/config/CommonUtil";
import { message } from "ant-design-vue";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import {
    FblColumn,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
    FblRow,
} from "@/components/shared/data-grid/models";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
// import InfInfoGrid from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
@Component({
    components: {
        FblDataGrid
    }
})
export default class F2BFileForm extends Vue {

    @Prop()
    iniData:Array<F2bFileGrid>;
   
    @Prop()
    f2BPreviewUrl:string;

    reload() {
        

    }
    /**
     * 取得F2B資料清單資料
     */
    created() {
        this.grid.data=this.iniData;
    }

    // ================Grid事件==============================================

    onInspectClick(row: FblRow<F2bFileGrid>) {
        window.open(this.f2BPreviewUrl+row.data.id+"/download")
    }

    // 會辦紀錄顯示
    grid: FblPDataGridHolder<F2bFileGrid> = {
        rowKey: "id",
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        columns: [
            {
                type: FblColumnType.PLAIN,
                title: this.$t("f2BFileForm_documentName").toString(),
                property: "name",
                width: 130,
                inspect:true
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t("f2BFileForm_scanDate").toString(),//掃描時間
                property: "scanDate",
                width: 60,
                formatter: (data: F2bFileGrid) => {
                    if (!ValidationUtil.isEmpty(data.scanDate)) {
                        return MomentUtil.transformRocYearMonthDayHHMMSS(data.scanDate)
                    } else {
                        return null;
                    }
                }
                
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("f2BFileForm_validDoc").toString(),//有效文件
                property: "isValidDoc",
                width: 40,
                formatter: (data: F2bFileGrid) => {
                    if ("true"==data.isValidDoc) {
                        return "有效"
                    } else if("false"==data.isValidDoc){
                        return "無效";
                    }else{
                        return null;
                    }
                }
            },
        ]
    };

    
}