import { Vue, Component, Prop } from "vue-property-decorator";
import { FblColumnType } from "../../data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";

@Component({
    components: { FblDataGrid }
})
export default class CaseSearchForm extends Vue{
    // 欄位資料
    grid = {
        rowKey: "data1",
        data: [],
        pagination: {
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          current: 1,
          pageSize: 15,
          total: 0,
          locale: { items_per_page: "" }
        },
        scroll: { x: 500, y: 370 },
        columns: [
          {
            type: FblColumnType.PLAIN,
            property: "data1",
            title: '案件階段',
            width: 100,
            fixed: 'left',
          },
          {
            type: FblColumnType.PLAIN,
            property: "data2",
            title: '案件狀態',
            width: 100,
            fixed: 'left',
          },
          {
            type: FblColumnType.TEMPLATE,
            property: "data3",
            title: '受訪者ID',
            width: 100,
            fixed: 'left',
            template: "alinkTemplate",
        },
          {
            type: FblColumnType.PLAIN,
            property: "data4",
            title: '受訪者姓名',
            width: 100,
            fixed: 'left',
          },
          {
            type: FblColumnType.PLAIN,
            property: "data5",
            title: '受訪者身分',
            width: 100,
            fixed: 'left',
          },
          {
            type: FblColumnType.TEMPLATE,
            property: "data6",
            title: '保單號碼',
            width: 100,
            template: "policyNumLinkTemplate",
          },
          {
            type: FblColumnType.PLAIN,
            property: "data7",
            title: '電訪項目',  
            width: 100,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data8",
            title: '交辦部門備註',
            width: 150,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data9",
            title: '應電訪日期',
            width: 150,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data10",
            title: '指定聯絡時段',
            width: 150,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data11",
            title: '方便聯絡時間',
            width: 150,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data12",
            title: '受理案號',
            width: 100,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data13",
            title: '名單序號',
            width: 100,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data14",
            title: '通路別',
            width: 100,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data15",
            title: '單位代號',
            width: 100,
          },
          {
            type: FblColumnType.PLAIN,
            property: "data16",
            title: '單位名稱',
            width: 100,
    
          },
          {
            type: FblColumnType.PLAIN,
            property: "data17",
            title: '業務員ID',
            width: 100,
          },
        ]
      };

    /**
     * Function
     */
    getGridData() {
        this.grid.data = [
            {
              data1: 'data1',
              data2: 'data2',
              data3: 'data3',
              data4: 'data4',
              data5: 'data5',
              data6: 'data6',
              data7: 'data7',
              data8: 'data8',
              data9: 'data9',
              data10: 'data10',
              data11: 'data11',
              data12: 'data12',
              data13: 'data13',
              data14: 'data14',
              data15: 'data15',
              data16: 'data16',
              data17: 'data17',
            }
        ]
    }

    /**
     * Event
     */
    handleExport() { }

    /**
     * Hooks
     */
    created() {
       this.getGridData();
    }
}