import { Vue, Component } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import { Action } from 'vuex-class';

 @Component({
  components: {
   Breadcrumb,
 },
 })
 export default class Loading extends Vue {
  @Action('setLoading') setLoading;

   /**
    * data
    */

   /**
    * hook
    */

   /**
    * methods
    */
  // 顯示loading
  showLoading() {
    this.setLoading(true);

    // API執行完畢時, 關閉loading
    setTimeout(() => {
      this.setLoading(false);
    }, 6000);
  }
 }
