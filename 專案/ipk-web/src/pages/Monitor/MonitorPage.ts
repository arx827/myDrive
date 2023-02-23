import Vue from 'vue';
import axios from 'axios';
import { Component } from 'vue-property-decorator';
import exportUtil from '@/plugins/util/exportUtil';
import moment from 'moment';

@Component({
  components: {},
})
export default class MonitorPage extends Vue {
  executeSql = '';

  excelSql = '';

  querySql = '';

  top = 100;

  message = '';

  columns: any[] = [];

  data: any[] = [];

  callExecute() {
    axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/monitor/execute`,
    {
        executeSql: this.executeSql,
    }).then((res) => {
        this.message = res.data.message;
    }).catch(() => {
        history.back();
    });
  }

  callExcel() {
    axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/monitor/excel`,
    {
        excelSql: this.excelSql,
        top: this.top,
    }, { responseType: 'blob' }).then((res) => {
        exportUtil.dealDownloadData(res.data, `REPORT_${moment(new Date()).format('YYYYMMDDHHmmss')}`, 'xlsx');
    }).catch((err) => {
        if (err.response.data.message === 'Permission Deny') {
            history.back();
        } else {
            this.message = err.response.data.message;
        }
    });
  }

  callQuery() {
    axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/monitor/query`,
    {
        querySql: this.querySql,
        top: this.top,
    }).then((res) => {
        this.columns = res.data.columns;
        this.data = res.data.data;
        this.message = res.data.message;
    }).catch(() => {
        history.back();
    });
  }
}
