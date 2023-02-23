import {
 Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { MoneyData } from '@/components/shared/money/model';

@Component
export default class Money extends Vue {
    @Prop()
    data: MoneyData;

    numberOnly() {
      this.data.money = this.data.money.replaceAll(',', '');
    }

    transfer() {
      let money = this.data.money.toUpperCase();
      // 超過兩種字母
      if (money.replaceAll(/[0-9]/g, '').length > 1) {
        this.data.money = '';
        return;
      }
      // 字母不在最右側
      if (money.replaceAll(/[0-9]/g, '').length !== 0 && !(money.slice(-1) === 'K' || money.slice(-1) === 'M' || money.slice(-1) === 'B')) {
        this.data.money = '';
        return;
      }
      // 字母轉換成0
      if (money.includes('K')) {
        money = `${money.replaceAll('K', '')}000`;
      } else if (money.includes('M')) {
        money = `${money.replaceAll('M', '')}000000`;
      } else if (money.includes('B')) {
        money = `${money.replaceAll('B', '')}000000000`;
      }
      // 逗點
      this.data.money = money.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      console.log(`comma: ${this.data.money}`);
    }
}
